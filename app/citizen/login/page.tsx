"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mic, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { voiceAssistant } from "@/lib/voice-assistant"

export default function CitizenLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  })
  const router = useRouter()
  const { toast } = useToast()

  const [loginMethod, setLoginMethod] = useState<"password" | "otp">("password")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [remainingTime, setRemainingTime] = useState(0)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    if (remainingTime > 0) {
      intervalId = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1)
      }, 1000)
    } else if (intervalId) {
      clearInterval(intervalId)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [remainingTime])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let response
      if (loginMethod === "password") {
        response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier: formData.identifier,
            password: formData.password,
            userType: "citizen",
          }),
        })
      } else {
        response = await fetch("/api/auth/login-otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier: formData.identifier,
            otp: otp,
            userType: "citizen",
          }),
        })
      }

      const data = await response.json()

      if (data.success) {
        // Store user session
        localStorage.setItem("userType", "citizen")
        localStorage.setItem("userId", data.user.id)
        localStorage.setItem("userName", data.user.fullName)

        toast({
          title: "Login Successful",
          description: `Welcome back, ${data.user.fullName}!`,
        })

        voiceAssistant.speak(
          `Welcome back, ${data.user.fullName}. You have successfully logged in to the citizen portal.`,
        )

        router.push("/citizen/dashboard")
      } else {
        toast({
          title: "Login Failed",
          description: data.error || "Invalid credentials",
          variant: "destructive",
        })
        voiceAssistant.speak("Login failed. Please check your credentials and try again.")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setVerifyingOtp(false)
    }
  }

  const sendOTPForLogin = async () => {
    setSendingOtp(true)
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: formData.identifier,
          userType: "citizen",
        }),
      })

      const data = await response.json()

      if (data.success) {
        setOtpSent(true)
        setRemainingTime(60)
        toast({
          title: "OTP Sent",
          description: "OTP has been sent to your registered mobile number.",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to send OTP.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSendingOtp(false)
    }
  }

  const verifyOTPForLogin = async () => {
    setVerifyingOtp(true)
    handleSubmit(new Event("submit"))
  }

  const startVoiceInput = () => {
    setIsVoiceMode(true)
    voiceAssistant.speak("Please speak your Aadhaar number, mobile number, or email address")

    voiceAssistant.startListening(
      (text) => {
        setFormData((prev) => ({ ...prev, identifier: text }))
        setIsVoiceMode(false)
        toast({
          title: "Voice Input Received",
          description: "Now please speak your password",
        })

        // Ask for password after a short delay
        setTimeout(() => {
          voiceAssistant.speak("Now please speak your password")
          voiceAssistant.startListening(
            (passwordText) => {
              setFormData((prev) => ({ ...prev, password: passwordText }))
              toast({
                title: "Password Received",
                description: "You can now submit the form",
              })
            },
            (error) => {
              toast({
                title: "Voice Input Error",
                description: "Could not capture password. Please type it manually.",
                variant: "destructive",
              })
            },
          )
        }, 1000)
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
            <Link href="/" className="text-gray-500 hover:text-gray-700">
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
              {isVoiceMode ? "Listening..." : "Voice Login"}
            </Button>
          </div>
          <CardTitle className="text-2xl text-center">Citizen Login</CardTitle>
          <CardDescription className="text-center">
            Enter your Aadhaar number, mobile number, or email to access your portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">Aadhaar / Mobile / Email</Label>
              <Input
                id="identifier"
                type="text"
                placeholder="Enter your Aadhaar, mobile, or email"
                value={formData.identifier}
                onChange={(e) => setFormData((prev) => ({ ...prev, identifier: e.target.value }))}
                required
              />
            </div>

            {/* Login Method Toggle */}
            <div className="flex space-x-2 mb-4">
              <Button
                type="button"
                variant={loginMethod === "password" ? "default" : "outline"}
                onClick={() => setLoginMethod("password")}
                className="flex-1"
              >
                Password Login
              </Button>
              <Button
                type="button"
                variant={loginMethod === "otp" ? "default" : "outline"}
                onClick={() => setLoginMethod("otp")}
                className="flex-1"
              >
                OTP Login
              </Button>
            </div>

            {/* Password or OTP Input */}
            {loginMethod === "password" ? (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
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
            ) : (
              <div className="space-y-2">
                <Label>OTP Login</Label>
                {!otpSent ? (
                  <Button
                    type="button"
                    onClick={sendOTPForLogin}
                    disabled={sendingOtp || !formData.identifier}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {sendingOtp ? "Sending OTP..." : "Send OTP to Mobile"}
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        maxLength={6}
                        className="text-center text-lg tracking-widest"
                      />
                      <Button
                        type="button"
                        onClick={verifyOTPForLogin}
                        disabled={verifyingOtp || otp.length !== 6}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {verifyingOtp ? "Verifying..." : "Verify"}
                      </Button>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        {remainingTime > 0
                          ? `Resend in ${Math.floor(remainingTime / 60)}:${(remainingTime % 60).toString().padStart(2, "0")}`
                          : ""}
                      </span>
                      {remainingTime === 0 && (
                        <Button
                          type="button"
                          variant="link"
                          onClick={sendOTPForLogin}
                          className="text-green-600 p-0 h-auto"
                        >
                          Resend OTP
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading || sendingOtp || verifyingOtp}
            >
              {isLoading ? "Logging in..." : "Login to Portal"}
            </Button>
          </form>

          <div className="text-center space-y-2">
            <Link href="/citizen/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot Password?
            </Link>
            <div className="text-sm text-gray-600">
              {"Don't have an account? "}
              <Link href="/citizen/register" className="text-blue-600 hover:underline">
                Register here
              </Link>
            </div>
            <div className="text-sm text-gray-600">Demo Credentials: 1234-5678-9012 / password123</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
