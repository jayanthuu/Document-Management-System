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
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Upload, Mic, MicOff, Volume2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { voiceAssistant } from "@/lib/voice-assistant"
import Link from "next/link"
import { DocumentViewer } from "@/components/document-viewer"

export default function NaanMudhalvanApplication() {
  const [formData, setFormData] = useState({
    programType: "",
    fullName: "",
    dateOfBirth: "",
    gender: "",
    qualification: "",
    experience: "",
    skillInterest: "",
    preferredLocation: "",
    mobileNumber: "",
    email: "",
    address: "",
    employmentStatus: "",
    previousTraining: false,
    agreementAccepted: false,
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

    if (!formData.agreementAccepted) {
      toast({
        title: "Agreement Required",
        description: "Please accept the terms and conditions to proceed.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          citizenId: userId,
          serviceType: "naan-mudhalvan",
          serviceName: getProgramName(formData.programType),
          priority: "medium",
          formData: formData,
          documents: uploadedFiles.map((file) => file.name),
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Naan Mudhalvan Application Submitted!",
          description: `Your application ID is ${data.application.applicationId}. You will be contacted for further process.`,
        })

        voiceAssistant.speak(
          `Your Naan Mudhalvan application has been submitted successfully. Your application ID is ${data.application.applicationId}. You will be contacted for further process.`,
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

  const getProgramName = (type: string) => {
    const names = {
      "technical-skills": "Technical Skills Training",
      "soft-skills": "Soft Skills Development",
      entrepreneurship: "Entrepreneurship Program",
      "digital-literacy": "Digital Literacy",
      "industry-specific": "Industry Specific Training",
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
      "naan-mudhalvan",
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
        ? "நான் கேட்கிறேன். 'என் பெயர் ராம்' அல்லது 'திறமை வலை வடிவமைப்பு' என்று சொல்லுங்கள்"
        : "I'm listening. You can say things like 'My name is Ram' or 'Skills web development'"

    voiceAssistant.speak(promptText, currentLanguage)

    voiceAssistant.startListening(
      (text) => {
        const result = voiceAssistant.processVoiceCommand(text, "naan-mudhalvan")
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
              : `I've filled in ${result.field}. You can continue speaking or click the voice button again.`
          voiceAssistant.speak(confirmText, currentLanguage)
        } else {
          const errorText =
            currentLanguage === "ta-IN"
              ? "புரியவில்லை. மீண்டும் தெளிவாக சொல்லுங்கள்"
              : "Could not understand. Please try speaking more clearly."
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
              <h1 className="text-2xl font-bold text-gray-900">Naan Mudhalvan Program</h1>
              <p className="text-gray-600">Skill Development Initiative by Government of Tamil Nadu</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Skill Development Program Application
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
            <CardDescription>Join the Naan Mudhalvan initiative to enhance your employability skills</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Program Selection */}
              <div className="space-y-2">
                <Label htmlFor="programType">Program Type *</Label>
                <Select
                  value={formData.programType}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, programType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select program type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical-skills">Technical Skills Training</SelectItem>
                    <SelectItem value="soft-skills">Soft Skills Development</SelectItem>
                    <SelectItem value="entrepreneurship">Entrepreneurship Program</SelectItem>
                    <SelectItem value="digital-literacy">Digital Literacy</SelectItem>
                    <SelectItem value="industry-specific">Industry Specific Training</SelectItem>
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

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="qualification">Highest Qualification *</Label>
                  <Select
                    value={formData.qualification}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, qualification: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select qualification" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10th">10th Standard</SelectItem>
                      <SelectItem value="12th">12th Standard</SelectItem>
                      <SelectItem value="diploma">Diploma</SelectItem>
                      <SelectItem value="ug">Under Graduate</SelectItem>
                      <SelectItem value="pg">Post Graduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-2">
                <Label htmlFor="experience">Work Experience</Label>
                <Textarea
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => setFormData((prev) => ({ ...prev, experience: e.target.value }))}
                  placeholder="Describe your work experience (if any)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skillInterest">Skills of Interest *</Label>
                <Textarea
                  id="skillInterest"
                  value={formData.skillInterest}
                  onChange={(e) => setFormData((prev) => ({ ...prev, skillInterest: e.target.value }))}
                  placeholder="What skills would you like to learn or improve?"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employmentStatus">Current Employment Status *</Label>
                  <Select
                    value={formData.employmentStatus}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, employmentStatus: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unemployed">Unemployed</SelectItem>
                      <SelectItem value="employed">Employed</SelectItem>
                      <SelectItem value="self-employed">Self Employed</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredLocation">Preferred Training Location *</Label>
                  <Select
                    value={formData.preferredLocation}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, preferredLocation: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chennai">Chennai</SelectItem>
                      <SelectItem value="coimbatore">Coimbatore</SelectItem>
                      <SelectItem value="madurai">Madurai</SelectItem>
                      <SelectItem value="tiruchirappalli">Tiruchirappalli</SelectItem>
                      <SelectItem value="salem">Salem</SelectItem>
                      <SelectItem value="tirunelveli">Tirunelveli</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-4">
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
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

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

              {/* Previous Training */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="previousTraining"
                  checked={formData.previousTraining}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, previousTraining: checked as boolean }))
                  }
                />
                <Label htmlFor="previousTraining">I have attended previous skill development programs</Label>
              </div>

              {/* Document Upload */}
              <div className="space-y-4">
                <Label>Required Documents</Label>

                {/* Required Documents List */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 mb-2">Required Documents:</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>
                      • <strong>Educational Certificates:</strong> 10th mark sheet & certificate, 12th mark sheet &
                      certificate (if completed), Degree/Diploma certificates (if applicable)
                    </li>
                    <li>
                      • <strong>Identity Documents:</strong> Aadhaar card (mandatory), Voter ID card (if available),
                      Passport (if available)
                    </li>
                    <li>
                      • <strong>Address Proof:</strong> Ration card, Utility bills, Bank statements
                    </li>
                    <li>
                      • <strong>Employment Documents:</strong> Resume/CV (if any work experience), Experience
                      certificates (if applicable), Salary slips (for employed candidates)
                    </li>
                    <li>
                      • <strong>Other Documents:</strong> Passport size photographs (recent), Bank account details for
                      stipend transfer
                    </li>
                    {formData.programType === "technical-skills" && (
                      <>
                        <li>
                          • <strong>Technical Certificates:</strong> Any previous technical course certificates,
                          Programming certificates (if any)
                        </li>
                        <li>
                          • <strong>Project Portfolio:</strong> Previous projects or work samples (if available)
                        </li>
                      </>
                    )}
                    {formData.programType === "entrepreneurship" && (
                      <>
                        <li>
                          • <strong>Business Plan:</strong> Basic business idea document (if available)
                        </li>
                        <li>
                          • <strong>Market Research:</strong> Any market analysis done (if applicable)
                        </li>
                      </>
                    )}
                    <li>
                      • <strong>Category Documents:</strong> Caste certificate (if applicable for reserved category
                      benefits), Income certificate (for economically weaker section benefits)
                    </li>
                  </ul>
                  <p className="text-xs text-purple-600 mt-2">
                    <strong>Note:</strong> All documents should be clear scanned copies. Original documents need to be
                    produced during verification process. Age limit: 18-35 years, Minimum qualification: 10th pass.
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
                      className="hidden"
                      id="file-upload"
                      onChange={handleFileUpload}
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

              {/* Agreement */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreementAccepted"
                  checked={formData.agreementAccepted}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, agreementAccepted: checked as boolean }))
                  }
                />
                <Label htmlFor="agreementAccepted" className="text-sm">
                  I agree to the terms and conditions of the Naan Mudhalvan program and commit to complete the training
                  successfully
                </Label>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline">
                  Save as Draft
                </Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
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
