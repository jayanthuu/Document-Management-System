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
import { ArrowLeft, Mic, MicOff, Volume2, FileText, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { voiceAssistant } from "@/lib/voice-assistant"
import Link from "next/link"

export default function EducationApplication() {
  const [formData, setFormData] = useState({
    serviceType: "",
    studentName: "",
    fatherName: "",
    motherName: "",
    dateOfBirth: "",
    gender: "",
    category: "",
    qualification: "",
    institution: "",
    course: "",
    yearOfStudy: "",
    familyIncome: "",
    address: "",
    mobileNumber: "",
    email: "",
    bankAccount: "",
    ifscCode: "",
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
          serviceType: "education",
          serviceName: getServiceName(formData.serviceType),
          priority: "medium",
          formData: formData,
          documents: uploadedFiles.map((file) => file.name),
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Education Application Submitted!",
          description: `Your application ID is ${data.application.applicationId}. Processing will take 7-10 working days.`,
        })

        voiceAssistant.speak(
          `Your education application has been submitted successfully. Your application ID is ${data.application.applicationId}. You will receive updates via SMS and email.`,
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
      scholarship: "Government Scholarship",
      admission: "College Admission Service",
      certificate: "Academic Certificate",
      "fee-reimbursement": "Fee Reimbursement",
      "education-loan": "Education Loan Subsidy",
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
      "education",
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
        ? "நான் கேட்கிறேன். 'மாணவர் பெயர் ராம்' அல்லது 'மொபைல் எண் 9876543210' என்று சொல்லுங்கள்"
        : "I'm listening. You can say things like 'Student name is Ram' or 'Mobile number is 9876543210'"

    voiceAssistant.speak(promptText, currentLanguage)

    voiceAssistant.startListening(
      (text) => {
        const result = voiceAssistant.processVoiceCommand(text, "education")
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
              <h1 className="text-2xl font-bold text-gray-900">Education Department Services</h1>
              <p className="text-gray-600">Apply for scholarships and educational services</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Education Services Application
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
            <CardDescription>Apply for government scholarships, certificates, and educational services</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Type */}
              <div className="space-y-2">
                <Label htmlFor="serviceType">Service Type *</Label>
                <Select
                  value={formData.serviceType}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, serviceType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scholarship">Government Scholarship</SelectItem>
                    <SelectItem value="admission">College Admission Service</SelectItem>
                    <SelectItem value="certificate">Academic Certificate</SelectItem>
                    <SelectItem value="fee-reimbursement">Fee Reimbursement</SelectItem>
                    <SelectItem value="education-loan">Education Loan Subsidy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Student Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="studentName">Student Name *</Label>
                  <Input
                    id="studentName"
                    value={formData.studentName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, studentName: e.target.value }))}
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
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="obc">OBC</SelectItem>
                      <SelectItem value="sc">SC</SelectItem>
                      <SelectItem value="st">ST</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Academic Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="qualification">Current Qualification *</Label>
                  <Select
                    value={formData.qualification}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, qualification: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select qualification" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high-school">High School</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="graduate">Graduate</SelectItem>
                      <SelectItem value="postgraduate">Postgraduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution *</Label>
                  <Input
                    id="institution"
                    value={formData.institution}
                    onChange={(e) => setFormData((prev) => ({ ...prev, institution: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="course">Course *</Label>
                  <Input
                    id="course"
                    value={formData.course}
                    onChange={(e) => setFormData((prev) => ({ ...prev, course: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearOfStudy">Year of Study *</Label>
                  <Input
                    id="yearOfStudy"
                    value={formData.yearOfStudy}
                    onChange={(e) => setFormData((prev) => ({ ...prev, yearOfStudy: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* Family Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="familyIncome">Family Income *</Label>
                  <Input
                    id="familyIncome"
                    value={formData.familyIncome}
                    onChange={(e) => setFormData((prev) => ({ ...prev, familyIncome: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mobileNumber">Mobile Number *</Label>
                  <Input
                    id="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData((prev) => ({ ...prev, mobileNumber: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* Bank Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankAccount">Bank Account *</Label>
                  <Input
                    id="bankAccount"
                    value={formData.bankAccount}
                    onChange={(e) => setFormData((prev) => ({ ...prev, bankAccount: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ifscCode">IFSC Code *</Label>
                  <Input
                    id="ifscCode"
                    value={formData.ifscCode}
                    onChange={(e) => setFormData((prev) => ({ ...prev, ifscCode: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* Required Documents Information */}
              <div className="space-y-4 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  <Label className="text-lg font-semibold text-green-800">Required Documents Checklist</Label>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">📋 Mandatory Documents:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>
                          <strong>Aadhaar Card</strong> - Identity proof
                        </span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>
                          <strong>Income Certificate</strong> - Family income proof (issued by Tahsildar)
                        </span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>
                          <strong>Academic Records</strong> - Latest mark sheets and certificates
                        </span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>
                          <strong>Bank Passbook</strong> - First page with account details
                        </span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>
                          <strong>Passport Size Photos</strong> - Recent colored photographs
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">📄 Additional Documents (if applicable):</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span>
                          <strong>Caste Certificate</strong> - For SC/ST/OBC categories
                        </span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span>
                          <strong>Disability Certificate</strong> - For physically challenged students
                        </span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span>
                          <strong>Minority Certificate</strong> - For minority community students
                        </span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span>
                          <strong>Fee Receipt</strong> - For fee reimbursement applications
                        </span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span>
                          <strong>Admission Letter</strong> - For college admission services
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-start space-x-2">
                    <div className="w-5 h-5 text-yellow-600 mt-0.5">⚠️</div>
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">Important Notes:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• All documents must be clear, readable, and in PDF/JPG format</li>
                        <li>• Maximum file size: 5MB per document</li>
                        <li>• Documents should be recent (issued within last 6 months for income certificate)</li>
                        <li>• Self-attested copies are acceptable for online submission</li>
                        <li>• Original documents may be required for verification at later stage</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Upload Section - Enhanced */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Upload Documents *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Drag and drop your documents here, or click to browse</p>
                    <p className="text-xs text-gray-500">Supported formats: PDF, JPG, JPEG, PNG (Max 5MB each)</p>
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
                      className="hover:bg-green-50 hover:border-green-300"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Files
                    </Button>
                  </div>
                </div>

                {/* Uploaded Files Display */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700">Uploaded Files ({uploadedFiles.length}):</p>
                    <div className="grid gap-3">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{file.name}</p>
                              <p className="text-xs text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:bg-red-50 hover:border-red-300"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
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
