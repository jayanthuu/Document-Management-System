import { type NextRequest, NextResponse } from "next/server"
import { otpService } from "@/lib/otp-service"

export async function POST(request: NextRequest) {
  try {
    const { mobileNumber, otp } = await request.json()

    if (!mobileNumber || !otp) {
      return NextResponse.json({ error: "Mobile number and OTP are required" }, { status: 400 })
    }

    const result = otpService.verifyOTP(mobileNumber, otp)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
      })
    } else {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }
  } catch (error) {
    console.error("Verify OTP error:", error)
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 })
  }
}
