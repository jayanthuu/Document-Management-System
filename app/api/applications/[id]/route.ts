import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status, remarks, issuedBy } = await request.json()

    db.init()

    // Update application status
    db.updateApplicationStatus(params.id, status, remarks)

    // Return updated application without auto-generating certificate
    return NextResponse.json({
      success: true,
      application: db.getApplicationById(params.id),
      message: "Application updated successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 })
  }
}
