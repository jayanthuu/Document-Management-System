"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, ArrowLeft, Mic } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { voiceAssistant } from "@/lib/voice-assistant"

export default function CitizenRegister() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    identifier: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const router = useRouter()
  const { toast } = useToast()

  const [otpStep, setOtpStep] = useState(false)
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [remainingTime, setRemainingTime] = useState(0)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)

  const sendOTP = async () => {
    if (!formData.mobileNumber || formData.mobileNumber.length !== 10) {
      toast({
        title: "Invalid Mobile Number",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive",
      })
      return
    }

    setSendingOtp(true)
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber: formData.mobileNumber }),
      })

      const data = await response.json()
      if (data.success) {
        setOtpSent(true)
        setOtpStep(true)
        setRemainingTime(300) // 5 minutes
        toast({
          title: "OTP Sent!",
          description: data.message,
        })
        voiceAssistant.speak("OTP has been sent to your mobile number. Please enter the 6-digit code.")

        // Start countdown
        const interval = setInterval(() => {
          setRemainingTime((prev) => {
            if (prev <= 1) {
              clearInterval(interval)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Failed to Send OTP",
        description: "Could not send OTP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSendingOtp(false)
    }
  }

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit OTP",
        variant: "destructive",
      })
      return
    }

    setVerifyingOtp(true)
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber: formData.mobileNumber, otp }),
      })

      const data = await response.json()
      if (data.success) {
        setOtpVerified(true)
        setOtpStep(false)
        toast({
          title: "OTP Verified!",
          description: "Mobile number verified successfully",
        })
        voiceAssistant.speak("Mobile number verified successfully. You can now complete your registration.")
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      toast({
        title: "OTP Verification Failed",
        description: error.message || "Invalid OTP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setVerifyingOtp(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!otpVerified) {
      toast({
        title: "Mobile Verification Required",
        description: "Please verify your mobile number with OTP before registering.",
        variant: "destructive",
      })
      return
    }

    if (!agreeTerms) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions to proceed.",
        variant: "destructive",
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      })
      return
    }

    if (formData.password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userType: "citizen",
          identifier: formData.identifier,
          password: formData.password,
          fullName: formData.fullName,
          mobileNumber: formData.mobileNumber,
          email: formData.email,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Registration Successful!",
          description: "Your account has been created. You can now login.",
        })

        voiceAssistant.speak(
          `Registration successful! Welcome ${formData.fullName}. You can now login to your citizen portal.`,
        )

        // Auto login after successful registration
        setTimeout(() => {
          router.push("/citizen/login")
        }, 2000)
      } else {
        toast({
          title: "Registration Failed",
          description: data.error || "Could not create account",
          variant: "destructive",
        })
        voiceAssistant.speak("Registration failed. Please check your details and try again.")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const startVoiceInput = () => {
    setIsVoiceMode(true)
    voiceAssistant.speak(
      "I'm listening. You can say things like 'My name is John Doe' or 'My mobile number is 9876543210'",
    )

    voiceAssistant.startListening(
      (text) => {
        const result = voiceAssistant.processVoiceCommand(text, "registration")
        if (result) {
          setFormData((prev) => ({
            ...prev,
            [result.field]: result.value,
          }))
          toast({
            title: "Voice Input Applied",
            description: `${result.field}: ${result.value}`,
          })
          voiceAssistant.speak(`I've filled in your ${result.field}. Continue speaking or click voice button again.`)
        } else {
          toast({
            title: "Could not understand",
            description: "Please try speaking more clearly or use specific phrases like 'My name is...'",
            variant: "destructive",
          })
        }
        setIsVoiceMode(false)
      },
      (error) => {
        setIsVoiceMode(false)
        toast({
          title: "Voice Input Error",
          description: "Could not capture voice input. Please try again.",
          variant: "destructive",
        })
      },
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <Link href="/citizen/login" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={startVoiceInput}
              disabled={isVoiceMode}
              className={isVoiceMode ? "bg-red-100 text-red-600" : ""}
            >
              <Mic className="h-4 w-4 mr-2" />
              {isVoiceMode ? "Listening..." : "Voice Fill"}
            </Button>
          </div>
          <CardTitle className="text-2xl text-center">Citizen Registration</CardTitle>
          <CardDescription className="text-center">Create your account to access government services</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="identifier">Aadhaar Number *</Label>
              <Input
                id="identifier"
                type="text"
                placeholder="Enter your 12-digit Aadhaar number"
                value={formData.identifier}
                onChange={(e) => setFormData((prev) => ({ ...prev, identifier: e.target.value }))}
                maxLength={12}
                pattern="[0-9]{12}"
                required
              />
              <p className="text-xs text-gray-500">This will be used as your login ID</p>
            </div>

            {/* Mobile Number with OTP Verification */}
            <div className="space-y-2">
              <Label htmlFor="mobileNumber">Mobile Number *</Label>
              <div className="flex space-x-2">
                <Input
                  id="mobileNumber"
                  type="tel"
                  placeholder="Enter your 10-digit mobile number"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData((prev) => ({ ...prev, mobileNumber: e.target.value }))}
                  maxLength={10}
                  pattern="[0-9]{10}"
                  required
                  disabled={otpVerified}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={sendOTP}
                  disabled={sendingOtp || otpVerified || formData.mobileNumber.length !== 10}
                  className={otpVerified ? "bg-green-100 text-green-700" : ""}
                >
                  {sendingOtp ? "Sending..." : otpVerified ? "✓ Verified" : "Send OTP"}
                </Button>
              </div>
              {otpVerified && <p className="text-sm text-green-600">✓ Mobile number verified successfully</p>}
            </div>

            {/* OTP Verification Step */}
            {otpStep && (
              <div className="space-y-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Label htmlFor="otp">Enter OTP *</Label>
                <div className="flex space-x-2">
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                  />
                  <Button
                    type="button"
                    onClick={verifyOTP}
                    disabled={verifyingOtp || otp.length !== 6}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {verifyingOtp ? "Verifying..." : "Verify OTP"}
                  </Button>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">
                    {remainingTime > 0
                      ? `Resend OTP in ${Math.floor(remainingTime / 60)}:${(remainingTime % 60).toString().padStart(2, "0")}`
                      : "OTP expired"}
                  </span>
                  {remainingTime === 0 && (
                    <Button type="button" variant="link" onClick={sendOTP} className="text-blue-600 p-0 h-auto">
                      Resend OTP
                    </Button>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address (optional)"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  minLength={6}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="agreeTerms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
              />
              <Label htmlFor="agreeTerms" className="text-sm">
                I agree to the{" "}
                <Link href="/terms" className="text-blue-600 hover:underline">
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>

            <div className="text-center">
              <div className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/citizen/login" className="text-blue-600 hover:underline">
                  Login here
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
