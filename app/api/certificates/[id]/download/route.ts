import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"
import { certificateGenerator } from "@/lib/certificate-generator"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    db.init()

    const certificate = db.getCertificateById(params.id)
    if (!certificate) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
    }

    const html = certificateGenerator.generateCertificateHTML(
      certificate.certificateType,
      certificate.certificateNumber,
      certificate.certificateData,
      certificate.issuedBy,
      certificate.issuedDate,
      certificate.digitalSignature,
    )

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="${certificate.certificateNumber}.html"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate certificate" }, { status: 500 })
  }
}
