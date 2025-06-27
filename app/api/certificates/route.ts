import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    db.init()

    const certificates = db.getCertificatesByUserId(userId)

    return NextResponse.json({
      success: true,
      certificates,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch certificates" }, { status: 500 })
  }
}
