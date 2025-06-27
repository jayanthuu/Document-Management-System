import { type NextRequest, NextResponse } from "next/server"
import { otpService } from "@/lib/otp-service"

export async function POST(request: NextRequest) {
  try {
    const { mobileNumber, identifier } = await request.json()

    // Use mobileNumber if provided, otherwise extract from identifier
    const phoneNumber = mobileNumber || identifier

    if (!phoneNumber) {
      return NextResponse.json({ error: "Mobile number is required" }, { status: 400 })
    }

    const result = await otpService.sendOTP(phoneNumber)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        // Include OTP in response for demo (remove in production)
        otp: result.otp,
      })
    } else {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }
  } catch (error) {
    console.error("Send OTP error:", error)
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 })
  }
}
