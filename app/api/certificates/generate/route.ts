import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { applicationId, issuedBy, applicationData } = await request.json()

    db.init()

    const application = db.getApplicationById(applicationId)
    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    // Check if certificate already exists
    const existingCertificates = db.getCertificatesByUserId(application.citizenId)
    const existingCert = existingCertificates.find((cert) => cert.applicationId === application.id)

    if (existingCert) {
      return NextResponse.json({ error: "Certificate already generated for this application" }, { status: 400 })
    }

    // Prepare certificate data based on service type and form data
    let certificateData = {}
    const formData = application.formData

    switch (application.serviceType) {
      case "revenue":
        // Determine certificate subtype based on service name
        let certificateSubType = "general"
        if (application.serviceName.toLowerCase().includes("income")) {
          certificateSubType = "income"
        } else if (application.serviceName.toLowerCase().includes("community")) {
          certificateSubType = "community"
        } else if (application.serviceName.toLowerCase().includes("nativity")) {
          certificateSubType = "nativity"
        }

        certificateData = {
          citizenName: formData.fullName,
          relation: formData.gender === "female" ? "D/o" : "S/o",
          parentName: formData.fatherName,
          address: formData.address,
          purpose: formData.purpose,
          certificateSubType: certificateSubType,
          dateOfBirth: formData.dateOfBirth,
          placeOfBirth: formData.address?.split(",")[0] || "Tamil Nadu",
          district: formData.address?.split(",").slice(-2)[0] || "Chennai",
          // Additional fields based on certificate type
          ...(certificateSubType === "income" && {
            income: "50000",
            incomeWords: "Fifty Thousand Only",
            category: "General",
          }),
          ...(certificateSubType === "community" && {
            community: "Hindu",
            category: "BC",
          }),
          ...(certificateSubType === "nativity" && {
            years: "15",
          }),
        }
        break

      case "education":
        certificateData = {
          studentName: formData.studentName || formData.fullName,
          fatherName: formData.fatherName,
          motherName: formData.motherName,
          course: formData.course,
          institution: formData.institution,
          yearOfStudy: formData.yearOfStudy,
          scholarshipName: getScholarshipName(formData.serviceType || application.serviceName),
          academicYear: "2024-25",
          amount: getScholarshipAmount(formData.serviceType || application.serviceName),
          duration: "1 Academic Year",
          familyIncome: formData.familyIncome,
          category: formData.category,
        }
        break

      case "naan-mudhalvan":
        certificateData = {
          participantName: formData.fullName,
          fatherName: formData.fatherName,
          programName: getProgramName(formData.programType),
          duration: getProgramDuration(formData.programType),
          skills: formData.skillInterest,
          center: formData.preferredLocation + " Training Center",
          qualification: formData.qualification,
          employmentStatus: formData.employmentStatus,
        }
        break

      default:
        certificateData = {
          citizenName: formData.fullName || formData.studentName,
          purpose: formData.purpose || "Government Service",
        }
    }

    // Create certificate with proper mapping
    const certificate = db.createCertificate({
      applicationId: application.id,
      certificateType: application.serviceType,
      issuedBy: issuedBy,
      citizenName: certificateData.citizenName || certificateData.studentName || certificateData.participantName,
      certificateData,
    })

    console.log("Certificate created:", certificate)
    console.log("For citizen ID:", application.citizenId)

    return NextResponse.json({
      success: true,
      certificate,
      message: `Certificate generated successfully and sent to citizen dashboard`,
    })
  } catch (error) {
    console.error("Certificate generation error:", error)
    return NextResponse.json({ error: "Failed to generate certificate" }, { status: 500 })
  }
}

// Helper functions
function getScholarshipName(serviceType: string): string {
  const scholarships = {
    scholarship: "Government Merit Scholarship",
    "fee-reimbursement": "Fee Reimbursement Scheme",
    "education-loan": "Education Loan Subsidy",
  }
  return scholarships[serviceType as keyof typeof scholarships] || "Government Educational Support"
}

function getScholarshipAmount(serviceType: string): string {
  const amounts = {
    scholarship: "25000",
    "fee-reimbursement": "50000",
    "education-loan": "100000",
  }
  return amounts[serviceType as keyof typeof amounts] || "25000"
}

function getProgramName(programType: string): string {
  const programs = {
    "technical-skills": "Technical Skills Development Program",
    "soft-skills": "Soft Skills Enhancement Program",
    entrepreneurship: "Entrepreneurship Development Program",
    "digital-literacy": "Digital Literacy Program",
    "industry-specific": "Industry Specific Training Program",
  }
  return programs[programType as keyof typeof programs] || "Skill Development Program"
}

function getProgramDuration(programType: string): string {
  const durations = {
    "technical-skills": "6 Months",
    "soft-skills": "3 Months",
    entrepreneurship: "4 Months",
    "digital-literacy": "2 Months",
    "industry-specific": "8 Months",
  }
  return durations[programType as keyof typeof durations] || "3 Months"
}
