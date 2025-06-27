// Certificate generation functionality
export interface CertificateTemplate {
  type: string
  title: string
  content: string
  footer: string
}

export class CertificateGenerator {
  private templates: Record<string, CertificateTemplate> = {
    revenue: {
      type: "Revenue Certificate",
      title: "GOVERNMENT OF TAMIL NADU\nREVENUE DEPARTMENT\nOFFICIAL CERTIFICATE",
      content: `This is to certify that {citizenName}, {relation} {parentName}, residing at {address}, is a bonafide resident of Tamil Nadu State.

{certificateSpecificContent}

This certificate is issued for the purpose of {purpose} and is valid for one year from the date of issue.

Place: Chennai
State: Tamil Nadu`,
      footer: "Issued under the authority of Revenue Department, Government of Tamil Nadu",
    },
    education: {
      type: "Education Certificate",
      title: "GOVERNMENT OF TAMIL NADU\nEDUCATION DEPARTMENT\nSCHOLARSHIP CERTIFICATE",
      content: `This is to certify that {studentName}, {relation} {fatherName} and {motherName}, studying {course} ({yearOfStudy}) in {institution}, has been awarded {scholarshipName} for the academic year {academicYear}.

Student Details:
- Course: {course}
- Year of Study: {yearOfStudy}
- Institution: {institution}
- Category: {category}
- Family Income: Rs. {familyIncome}/-

Scholarship Details:
- Scholarship Amount: Rs. {amount}/-
- Duration: {duration}

The scholarship is awarded based on merit and family income criteria as per Government of Tamil Nadu guidelines.

Place: Chennai
State: Tamil Nadu`,
      footer: "Issued under the authority of Education Department, Government of Tamil Nadu",
    },
    "naan-mudhalvan": {
      type: "Skill Development Certificate",
      title: "GOVERNMENT OF TAMIL NADU\nNAAN MUDHALVAN INITIATIVE\nSKILL DEVELOPMENT CERTIFICATE",
      content: `This is to certify that {participantName}, {relation} {fatherName}, has successfully completed the {programName} under Naan Mudhalvan Skill Development Initiative.

Participant Details:
- Qualification: {qualification}
- Employment Status: {employmentStatus}

Program Details:
- Program Duration: {duration}
- Skills Acquired: {skills}
- Training Center: {center}

The participant has demonstrated proficiency in the above mentioned skills and is ready for employment opportunities in the relevant field.

This certificate is recognized by the Government of Tamil Nadu and affiliated industry partners.

Place: Chennai
State: Tamil Nadu`,
      footer: "Issued under the authority of Naan Mudhalvan Initiative, Government of Tamil Nadu",
    },
  }

  generateCertificateHTML(
    certificateType: string,
    certificateNumber: string,
    data: any,
    issuedBy: string,
    issuedDate: string,
    digitalSignature: string,
  ): string {
    const template = this.templates[certificateType]
    if (!template) {
      throw new Error(`Template not found for certificate type: ${certificateType}`)
    }

    let content = template.content

    // Add certificate-specific content for revenue certificates
    if (certificateType === "revenue") {
      let specificContent = ""

      if (data.certificateSubType === "income") {
        specificContent = `The annual family income from all sources is Rs. {income}/- ({incomeWords}).

Income Details:
- Annual Family Income: Rs. {income}/-
- Category: {category}`
      } else if (data.certificateSubType === "community") {
        specificContent = `The above mentioned person belongs to {community} community which is recognized as {category} category.

Personal Details:
- Date of Birth: {dateOfBirth}
- Place of Birth: {placeOfBirth}
- Community: {community}
- Category: {category}`
      } else if (data.certificateSubType === "nativity") {
        specificContent = `The family has been residing in {district} District, Tamil Nadu for the past {years} years.

Nativity Details:
- District: {district}
- Years of Residence: {years} years
- Native Place: Tamil Nadu`
      } else {
        specificContent = `This person is a permanent resident of the above mentioned address and is known to be of good character.`
      }

      content = content.replace("{certificateSpecificContent}", specificContent)
    }

    // Replace placeholders with actual data
    Object.keys(data).forEach((key) => {
      const placeholder = `{${key}}`
      content = content.replace(new RegExp(placeholder, "g"), data[key] || "")
    })

    // Clean up any remaining placeholders
    content = content.replace(/\{[^}]*\}/g, "")

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${template.type}</title>
        <style>
          body {
            font-family: 'Times New Roman', serif;
            margin: 0;
            padding: 40px;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
          }
          .certificate {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border: 8px solid #2c5aa0;
            border-radius: 15px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            position: relative;
          }
          .certificate::before {
            content: '';
            position: absolute;
            top: 20px;
            left: 20px;
            right: 20px;
            bottom: 20px;
            border: 2px solid #DAA520;
            border-radius: 10px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            position: relative;
            z-index: 1;
          }
          .title {
            font-size: 22px;
            font-weight: bold;
            color: #2c5aa0;
            line-height: 1.4;
            margin-bottom: 20px;
            text-transform: uppercase;
          }
          .cert-number {
            font-size: 14px;
            color: #666;
            margin-bottom: 20px;
            font-weight: bold;
          }
          .content {
            font-size: 16px;
            line-height: 1.8;
            text-align: justify;
            margin: 30px 0;
            color: #333;
            white-space: pre-line;
          }
          .signature-section {
            display: flex;
            justify-content: space-between;
            margin-top: 50px;
            align-items: end;
          }
          .signature-box {
            text-align: center;
            min-width: 200px;
          }
          .signature-line {
            border-bottom: 2px solid #333;
            margin-bottom: 10px;
            height: 60px;
            display: flex;
            align-items: end;
            justify-content: center;
            font-style: italic;
            color: #2c5aa0;
            font-weight: bold;
          }
          .date-issued {
            text-align: left;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #666;
            margin-top: 30px;
            font-style: italic;
          }
          .seal {
            position: absolute;
            top: 50px;
            right: 50px;
            width: 100px;
            height: 100px;
            border: 3px solid #2c5aa0;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(44, 90, 160, 0.1);
            font-size: 12px;
            font-weight: bold;
            color: #2c5aa0;
            text-align: center;
          }
          .digital-signature {
            font-size: 10px;
            color: #999;
            margin-top: 20px;
            text-align: center;
          }
          .emblem {
            position: absolute;
            top: 30px;
            left: 50px;
            width: 80px;
            height: 80px;
            background: radial-gradient(circle, #ff6b35 0%, #f7931e 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 10px;
          }
          @media print {
            body { background: white; }
            .certificate { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="emblem">
            TN<br>GOVT
          </div>
          
          <div class="seal">
            OFFICIAL<br>SEAL
          </div>
          
          <div class="header">
            <div class="title">${template.title}</div>
            <div class="cert-number">Certificate No: ${certificateNumber}</div>
          </div>
          
          <div class="content">
            ${content}
          </div>
          
          <div class="signature-section">
            <div class="date-issued">
              <strong>Date of Issue:</strong><br>
              ${new Date(issuedDate).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </div>
            
            <div class="signature-box">
              <div class="signature-line">
                ${issuedBy}
              </div>
              <div><strong>Authorized Signatory</strong></div>
              <div style="font-size: 12px; margin-top: 5px;">
                ${this.getDepartmentTitle(certificateType)}
              </div>
            </div>
          </div>
          
          <div class="footer">
            ${template.footer}
          </div>
          
          <div class="digital-signature">
            Digital Signature: ${digitalSignature}<br>
            This is a digitally generated certificate. Verify authenticity at www.tngovt.in/verify
          </div>
        </div>
      </body>
      </html>
    `
  }

  private getDepartmentTitle(certificateType: string): string {
    const titles = {
      revenue: "Revenue Department",
      education: "Education Department",
      "naan-mudhalvan": "Naan Mudhalvan Initiative",
    }
    return titles[certificateType as keyof typeof titles] || "Government Department"
  }

  // Convert HTML to downloadable format
  downloadCertificate(html: string, filename: string): void {
    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${filename}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}

export const certificateGenerator = new CertificateGenerator()
