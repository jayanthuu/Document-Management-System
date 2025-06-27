"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Upload, Mic, MicOff, Volume2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { voiceAssistant } from "@/lib/voice-assistant"
import Link from "next/link"
import { DocumentViewer } from "@/components/document-viewer"

export default function RevenueApplication() {
  const [formData, setFormData] = useState({
    certificateType: "",
    fullName: "",
    fatherName: "",
    motherName: "",
    dateOfBirth: "",
    address: "",
    pincode: "",
    mobileNumber: "",
    email: "",
    purpose: "",
    additionalInfo: "",
  })
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isListening, setIsListening] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userId, setUserId] = useState("")
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState<"en-IN" | "ta-IN">("en-IN")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId")
    if (!storedUserId) {
      router.push("/citizen/login")
      return
    }
    setUserId(storedUserId)
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          citizenId: userId,
          serviceType: "revenue",
          serviceName: getServiceName(formData.certificateType),
          priority: "medium",
          formData: formData,
          documents: uploadedFiles.map((file) => file.name),
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Application Submitted Successfully!",
          description: `Your application ID is ${data.application.applicationId}. Processing will take 7-10 working days.`,
        })

        voiceAssistant.speak(
          `Your application has been submitted successfully. Your application ID is ${data.application.applicationId}. You will receive updates via SMS and email.`,
          currentLanguage,
        )

        setTimeout(() => {
          router.push("/citizen/dashboard")
        }, 2000)
      } else {
        throw new Error(data.error || "Failed to submit application")
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Could not submit your application. Please try again.",
        variant: "destructive",
      })
      voiceAssistant.speak("Application submission failed. Please try again.", currentLanguage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getServiceName = (type: string) => {
    const names = {
      income: "Income Certificate",
      community: "Community Certificate",
      nativity: "Nativity Certificate",
      property: "Property Certificate",
      "land-records": "Land Records",
    }
    return names[type as keyof typeof names] || type
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setUploadedFiles((prev) => [...prev, ...files])

    toast({
      title: "Files Uploaded",
      description: `${files.length} file(s) uploaded successfully`,
    })
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
    toast({
      title: "File Removed",
      description: "File has been removed from upload list",
    })
  }

  const startInteractiveVoiceFilling = () => {
    setIsVoiceMode(true)
    voiceAssistant.startInteractiveFormFilling(
      "revenue",
      (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        toast({
          title: "Voice Input Applied",
          description: `${field}: ${value}`,
        })
      },
      (completedData) => {
        setFormData((prev) => ({ ...prev, ...completedData }))
        setIsVoiceMode(false)
        toast({
          title: "Voice Form Filling Complete",
          description: "Please review the filled details and submit",
        })
      },
      currentLanguage,
    )
  }

  const handleQuickVoiceFill = () => {
    if (isListening) {
      voiceAssistant.stopListening()
      setIsListening(false)
      return
    }

    setIsListening(true)
    const promptText =
      currentLanguage === "ta-IN"
        ? "நான் கேட்கிறேன். 'என் பெயர் ராம்' அல்லது 'என் மொபைல் எண் 9876543210' என்று சொல்லுங்கள்"
        : "I'm listening. You can say things like 'My name is Ram' or 'My mobile number is 9876543210'"

    voiceAssistant.speak(promptText, currentLanguage)

    voiceAssistant.startListening(
      (text) => {
        const result = voiceAssistant.processVoiceCommand(text, "revenue")
        if (result) {
          setFormData((prev) => ({
            ...prev,
            [result.field]: result.value,
          }))
          toast({
            title: "Voice Input Applied",
            description: `${result.field}: ${result.value}`,
          })
          const confirmText =
            currentLanguage === "ta-IN"
              ? `சரி, ${result.field} ${result.value} என்று பதிவு செய்யப்பட்டது`
              : `I've filled in your ${result.field}. You can continue speaking or click the voice button again.`
          voiceAssistant.speak(confirmText, currentLanguage)
        } else {
          const errorText =
            currentLanguage === "ta-IN"
              ? "புரியவில்லை. மீண்டும் தெளிவாக சொல்லுங்கள்"
              : "Could not understand. Please try speaking more clearly or use specific phrases like 'My name is...'"
          toast({
            title: "Could not understand",
            description: errorText,
            variant: "destructive",
          })
        }
        setIsListening(false)
      },
      (error) => {
        setIsListening(false)
        toast({
          title: "Voice Input Error",
          description: "Could not capture voice input. Please try again.",
          variant: "destructive",
        })
      },
    )
  }

  const readFormData = () => {
    voiceAssistant.readFormData(formData, currentLanguage)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/citizen/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Revenue Department Services</h1>
              <p className="text-gray-600">Apply for certificates and documents</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Certificate Application Form
              <div className="flex items-center space-x-2">
                <Select value={currentLanguage} onValueChange={(value: "en-IN" | "ta-IN") => setCurrentLanguage(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-IN">English</SelectItem>
                    <SelectItem value="ta-IN">தமிழ்</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={readFormData}>
                  <Volume2 className="h-4 w-4 mr-2" />
                  Read Form
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleQuickVoiceFill}
                  className={isListening ? "bg-red-100 text-red-600" : ""}
                >
                  {isListening ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                  {isListening ? "Stop" : "Quick Voice"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={startInteractiveVoiceFilling}
                  className={isVoiceMode ? "bg-blue-100 text-blue-600" : ""}
                  disabled={isVoiceMode}
                >
                  <Mic className="h-4 w-4 mr-2" />
                  {isVoiceMode ? "Voice Active..." : "Interactive Voice"}
                </Button>
              </div>
            </CardTitle>
            <CardDescription>Fill out the form below to apply for revenue department certificates</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Certificate Type */}
              <div className="space-y-2">
                <Label htmlFor="certificateType">Certificate Type *</Label>
                <Select
                  value={formData.certificateType}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, certificateType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select certificate type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income Certificate</SelectItem>
                    <SelectItem value="community">Community Certificate</SelectItem>
                    <SelectItem value="nativity">Nativity Certificate</SelectItem>
                    <SelectItem value="property">Property Certificate</SelectItem>
                    <SelectItem value="land-records">Land Records</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fatherName">Father's Name *</Label>
                  <Input
                    id="fatherName"
                    value={formData.fatherName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, fatherName: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="motherName">Mother's Name *</Label>
                  <Input
                    id="motherName"
                    value={formData.motherName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, motherName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-2">
                <Label htmlFor="address">Complete Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter your complete address"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => setFormData((prev) => ({ ...prev, pincode: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobileNumber">Mobile Number *</Label>
                  <Input
                    id="mobileNumber"
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData((prev) => ({ ...prev, mobileNumber: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>

              {/* Purpose */}
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose of Certificate *</Label>
                <Textarea
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) => setFormData((prev) => ({ ...prev, purpose: e.target.value }))}
                  placeholder="Explain why you need this certificate"
                  required
                />
              </div>

              {/* Document Upload */}
              <div className="space-y-4">
                <Label>Supporting Documents</Label>

                {/* Required Documents List */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Required Documents:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>
                      • <strong>Aadhaar Card</strong> (Mandatory - Clear scanned copy)
                    </li>
                    <li>
                      • <strong>Birth Certificate or School Transfer Certificate</strong> (To verify community/personal
                      details)
                    </li>
                    <li>
                      • <strong>Address Proof:</strong> Ration Card, Voter ID, Electricity Bill, or Water Bill
                    </li>
                    <li>
                      • <strong>Passport Size Photograph</strong> (Recent color photo)
                    </li>
                    {formData.certificateType === "community" && (
                      <>
                        <li>
                          • <strong>Parent's Community Certificate</strong> (If available - helps in verification)
                        </li>
                        <li>
                          • <strong>School Leaving Certificate</strong> (Shows community mentioned in school records)
                        </li>
                      </>
                    )}
                    {formData.certificateType === "income" && (
                      <>
                        <li>
                          • <strong>Salary Slips</strong> (Last 3 months for employed persons)
                        </li>
                        <li>
                          • <strong>Bank Statements</strong> (Last 6 months)
                        </li>
                        <li>
                          • <strong>Income Tax Returns</strong> (If applicable)
                        </li>
                        <li>
                          • <strong>Agricultural Income Proof</strong> (For farmers)
                        </li>
                        <li>
                          • <strong>Business License & Income Proof</strong> (For self-employed)
                        </li>
                      </>
                    )}
                    {formData.certificateType === "nativity" && (
                      <>
                        <li>
                          • <strong>Parent's Nativity Certificate</strong> (If available)
                        </li>
                        <li>
                          • <strong>Property Documents</strong> (Land records, house documents if family owns property)
                        </li>
                        <li>
                          • <strong>Continuous Residence Proof</strong> (Utility bills, ration card showing long-term
                          residence)
                        </li>
                      </>
                    )}
                  </ul>
                  <p className="text-xs text-blue-600 mt-2">
                    <strong>Note:</strong> All documents should be clear, readable scanned copies in PDF, JPG, or PNG
                    format. Maximum file size 2MB per document.
                  </p>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Upload the required documents listed above</p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("file-upload")?.click()}
                    >
                      Choose Files
                    </Button>
                  </div>
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <p className="text-sm font-medium">Uploaded Files:</p>
                    {uploadedFiles.map((file, index) => (
                      <DocumentViewer key={index} file={file} onRemove={() => removeFile(index)} />
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Information */}
              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Additional Information</Label>
                <Textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData((prev) => ({ ...prev, additionalInfo: e.target.value }))}
                  placeholder="Any additional information you'd like to provide"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline">
                  Save as Draft
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
