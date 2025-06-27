import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export async function GET(
  request: NextRequest,
  { params }: { params: { applicationId: string; documentName: string } },
) {
  try {
    const { applicationId, documentName } = params

    // Decode the document name
    const decodedDocumentName = decodeURIComponent(documentName)

    // In production, you would fetch from your actual storage (AWS S3, etc.)
    // For now, let's create a proper file serving system

    // Try to find the document in the uploads directory
    const uploadsDir = path.join(process.cwd(), "uploads", applicationId)
    const filePath = path.join(uploadsDir, decodedDocumentName)

    try {
      // Check if file exists
      await fs.access(filePath)

      // Read the file
      const fileBuffer = await fs.readFile(filePath)

      // Determine content type based on file extension
      const extension = decodedDocumentName.split(".").pop()?.toLowerCase()
      let contentType = "application/octet-stream"

      switch (extension) {
        case "pdf":
          contentType = "application/pdf"
          break
        case "jpg":
        case "jpeg":
          contentType = "image/jpeg"
          break
        case "png":
          contentType = "image/png"
          break
        case "gif":
          contentType = "image/gif"
          break
        case "txt":
          contentType = "text/plain"
          break
        case "doc":
          contentType = "application/msword"
          break
        case "docx":
          contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          break
      }

      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `inline; filename="${decodedDocumentName}"`,
          "Cache-Control": "private, max-age=3600",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      })
    } catch (fileError) {
      // File doesn't exist, create a demo PDF for testing
      return createDemoPDF(decodedDocumentName, applicationId)
    }
  } catch (error) {
    console.error("Document serving error:", error)
    return NextResponse.json({ error: "Document not found" }, { status: 404 })
  }
}

// Create a demo PDF for testing purposes
function createDemoPDF(documentName: string, applicationId: string) {
  // Create a simple PDF-like content for demo
  const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 12 Tf
50 750 Td
(Document: ${documentName}) Tj
0 -20 Td
(Application ID: ${applicationId}) Tj
0 -20 Td
(This is a demo document for testing purposes.) Tj
0 -20 Td
(In production, this would be the actual uploaded document.) Tj
0 -20 Td
(Date: ${new Date().toLocaleDateString()}) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000053 00000 n 
0000000110 00000 n 
0000000251 00000 n 
0000000504 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
581
%%EOF`

  const buffer = Buffer.from(pdfContent, "utf-8")

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${documentName}"`,
      "Cache-Control": "private, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  })
}
