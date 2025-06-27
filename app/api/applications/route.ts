import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const applicationData = await request.json()

    db.init()

    const application = db.createApplication({
      citizenId: applicationData.citizenId,
      serviceType: applicationData.serviceType,
      serviceName: applicationData.serviceName,
      status: "pending",
      priority: applicationData.priority || "medium",
      formData: applicationData.formData,
      documents: applicationData.documents || [],
    })

    return NextResponse.json({
      success: true,
      application,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create application" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const userType = searchParams.get("userType")
    const department = searchParams.get("department")

    db.init()

    let applications
    if (userType === "citizen" && userId) {
      applications = db.getApplicationsByUserId(userId)
    } else if (userType === "department" && department) {
      // Filter applications by department
      applications = db.getApplicationsByDepartment(department)
    } else {
      applications = db.getAllApplications()
    }

    // Sort by most recent first
    applications.sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime())

    return NextResponse.json({
      success: true,
      applications,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}
