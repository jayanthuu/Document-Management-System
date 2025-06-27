import { type NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { applicationId: string; documentIndex: string } },
) {
  try {
    const { applicationId, documentIndex } = params

    // In a real application, you would:
    // 1. Fetch the application from database
    // 2. Get the document path/URL from storage (AWS S3, Google Cloud, etc.)
    // 3. Return the actual document file

    // For demo purposes, we'll return a mock response
    // You should replace this with actual document retrieval logic

    console.log(`Fetching document ${documentIndex} for application ${applicationId}`)

    // Mock document content - replace with actual file retrieval
    const mockDocumentContent = `Mock document content for application ${applicationId}, document ${documentIndex}`

    return new NextResponse(mockDocumentContent, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="document-${documentIndex}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error fetching document:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch document" }, { status: 500 })
  }
}
