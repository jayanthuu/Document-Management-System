// OTP Service for SMS verification
class OTPService {
  private otpStorage: Map<string, { otp: string; expires: number; attempts: number }> = new Map()
  private readonly OTP_EXPIRY = 5 * 60 * 1000 // 5 minutes
  private readonly MAX_ATTEMPTS = 3

  // Generate 6-digit OTP
  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  // Send OTP to mobile number
  async sendOTP(mobileNumber: string): Promise<{ success: boolean; message: string; otp?: string }> {
    try {
      // Clean and validate mobile number
      const cleanMobile = this.cleanMobileNumber(mobileNumber)

      if (!this.isValidMobileNumber(cleanMobile)) {
        return {
          success: false,
          message: "Invalid mobile number format. Please enter a valid 10-digit Indian mobile number.",
        }
      }

      const otp = this.generateOTP()
      const expires = Date.now() + this.OTP_EXPIRY

      // Store OTP with expiry and attempt count
      this.otpStorage.set(cleanMobile, {
        otp,
        expires,
        attempts: 0,
      })

      // Send SMS (in production, integrate with SMS gateway)
      await this.sendSMSMessage(cleanMobile, otp)

      return {
        success: true,
        message: `OTP sent successfully to +91-${cleanMobile}. Please check your SMS.`,
        otp: otp, // Remove this in production for security
      }
    } catch (error) {
      console.error("OTP sending error:", error)
      return {
        success: false,
        message: "Failed to send OTP. Please try again.",
      }
    }
  }

  // Clean mobile number (remove spaces, dashes, country code)
  private cleanMobileNumber(mobile: string): string {
    // Remove all non-digits
    let cleaned = mobile.replace(/\D/g, "")

    // Remove country code if present
    if (cleaned.startsWith("91") && cleaned.length === 12) {
      cleaned = cleaned.substring(2)
    } else if (cleaned.startsWith("+91") && cleaned.length === 13) {
      cleaned = cleaned.substring(3)
    }

    return cleaned
  }

  // Validate Indian mobile number
  private isValidMobileNumber(mobile: string): boolean {
    // Indian mobile numbers: 10 digits starting with 6, 7, 8, or 9
    const mobileRegex = /^[6-9]\d{9}$/
    return mobileRegex.test(mobile)
  }

  // Send SMS message
  private async sendSMSMessage(mobileNumber: string, otp: string): Promise<void> {
    const message = `Your OTP for Rural Digital Platform is: ${otp}. Valid for 5 minutes. Do not share this OTP with anyone.`

    console.log(`📱 SMS to +91-${mobileNumber}: ${message}`)

    // In production, replace with actual SMS gateway:
    /*
    // Example with MSG91
    const response = await fetch('https://api.msg91.com/api/v5/otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authkey': process.env.MSG91_AUTH_KEY
      },
      body: JSON.stringify({
        template_id: process.env.MSG91_TEMPLATE_ID,
        mobile: `91${mobileNumber}`,
        otp: otp,
        message: message
      })
    })

    // Example with Twilio
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const client = require('twilio')(accountSid, authToken)
    
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${mobileNumber}`
    })
    */

    // For demo, show enhanced notification
    if (typeof window !== "undefined") {
      this.showOTPNotification(mobileNumber, otp, message)
    }
  }

  // Enhanced OTP notification for demo
  private showOTPNotification(mobileNumber: string, otp: string, message: string): void {
    // Create enhanced notification
    const notification = document.createElement("div")
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #10B981, #059669);
      color: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
      z-index: 10000;
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 350px;
      animation: slideIn 0.3s ease-out;
    `

    notification.innerHTML = `
      <div style="display: flex; align-items: center; margin-bottom: 10px;">
        <div style="background: rgba(255,255,255,0.2); padding: 8px; border-radius: 8px; margin-right: 12px;">
          📱
        </div>
        <div>
          <div style="font-weight: 600; font-size: 14px;">SMS Sent Successfully</div>
          <div style="font-size: 12px; opacity: 0.9;">To: +91-${mobileNumber}</div>
        </div>
      </div>
      <div style="background: rgba(255,255,255,0.15); padding: 12px; border-radius: 8px; margin-bottom: 12px;">
        <div style="font-size: 12px; opacity: 0.9; margin-bottom: 4px;">Your OTP Code:</div>
        <div style="font-size: 24px; font-weight: bold; letter-spacing: 4px; text-align: center;">${otp}</div>
      </div>
      <div style="font-size: 11px; opacity: 0.8; text-align: center;">
        Valid for 5 minutes • Do not share with anyone
      </div>
    `

    // Add animation styles
    const style = document.createElement("style")
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `
    document.head.appendChild(style)
    document.body.appendChild(notification)

    // Auto-remove notification after 10 seconds
    setTimeout(() => {
      if (document.body.contains(notification)) {
        notification.style.animation = "slideOut 0.3s ease-in"
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification)
          }
          if (document.head.contains(style)) {
            document.head.removeChild(style)
          }
        }, 300)
      }
    }, 10000)

    // Add click to dismiss
    notification.addEventListener("click", () => {
      if (document.body.contains(notification)) {
        notification.style.animation = "slideOut 0.3s ease-in"
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification)
          }
        }, 300)
      }
    })
  }

  // Verify OTP
  verifyOTP(mobileNumber: string, enteredOTP: string): { success: boolean; message: string } {
    const cleanMobile = this.cleanMobileNumber(mobileNumber)
    const otpData = this.otpStorage.get(cleanMobile)

    if (!otpData) {
      return {
        success: false,
        message: "No OTP found for this mobile number. Please request a new OTP.",
      }
    }

    // Check if OTP expired
    if (Date.now() > otpData.expires) {
      this.otpStorage.delete(cleanMobile)
      return {
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      }
    }

    // Check attempts
    if (otpData.attempts >= this.MAX_ATTEMPTS) {
      this.otpStorage.delete(cleanMobile)
      return {
        success: false,
        message: "Maximum attempts exceeded. Please request a new OTP.",
      }
    }

    // Increment attempts
    otpData.attempts++

    // Verify OTP
    if (otpData.otp === enteredOTP.trim()) {
      this.otpStorage.delete(cleanMobile) // Clear OTP after successful verification
      return {
        success: true,
        message: "OTP verified successfully!",
      }
    } else {
      return {
        success: false,
        message: `Invalid OTP. ${this.MAX_ATTEMPTS - otpData.attempts} attempts remaining.`,
      }
    }
  }

  // Get remaining time for OTP
  getRemainingTime(mobileNumber: string): number {
    const cleanMobile = this.cleanMobileNumber(mobileNumber)
    const otpData = this.otpStorage.get(cleanMobile)
    if (!otpData) return 0

    const remaining = otpData.expires - Date.now()
    return Math.max(0, Math.ceil(remaining / 1000))
  }

  // Clear expired OTPs (cleanup function)
  clearExpiredOTPs(): void {
    const now = Date.now()
    for (const [mobile, data] of this.otpStorage.entries()) {
      if (now > data.expires) {
        this.otpStorage.delete(mobile)
      }
    }
  }

  // Get OTP for testing (remove in production)
  getOTPForTesting(mobileNumber: string): string | null {
    const cleanMobile = this.cleanMobileNumber(mobileNumber)
    const otpData = this.otpStorage.get(cleanMobile)
    return otpData?.otp || null
  }
}

export const otpService = new OTPService()

// Clean up expired OTPs every minute
if (typeof window !== "undefined") {
  setInterval(() => {
    otpService.clearExpiredOTPs()
  }, 60000)
}
