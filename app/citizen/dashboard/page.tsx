"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, GraduationCap, Users, Clock, CheckCircle, XCircle, LogOut, Mic, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { voiceAssistant } from "@/lib/voice-assistant"

interface Application {
  id: string
  applicationId: string
  serviceType: string
  serviceName: string
  status: "pending" | "approved" | "rejected" | "in-review"
  submittedDate: string
  lastUpdated: string
  formData: any
}

interface Certificate {
  id: string
  certificateNumber: string
  certificateType: string
  issuedDate: string
  citizenName: string
}

export default function CitizenDashboard() {
  const [applications, setApplications] = useState<Application[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId")
    const storedUserName = localStorage.getItem("userName")

    if (!storedUserId) {
      window.location.href = "/citizen/login"
      return
    }

    setUserId(storedUserId)
    setUserName(storedUserName || "Citizen")

    fetchData(storedUserId)
  }, [])

  const fetchData = async (userId: string) => {
    await Promise.all([fetchApplications(userId), fetchCertificates(userId)])
    setIsLoading(false)
  }

  const fetchApplications = async (userId: string) => {
    try {
      const response = await fetch(`/api/applications?userId=${userId}&userType=citizen`)
      const data = await response.json()

      if (data.success) {
        setApplications(data.applications)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch applications",
        variant: "destructive",
      })
    }
  }

  const fetchCertificates = async (userId: string) => {
    try {
      const response = await fetch(`/api/certificates?userId=${userId}`)
      const data = await response.json()

      if (data.success) {
        console.log("Fetched certificates:", data.certificates)
        setCertificates(data.certificates)
      }
    } catch (error) {
      console.error("Failed to fetch certificates:", error)
    }
  }

  const refreshData = async () => {
    setIsRefreshing(true)
    await fetchData(userId)
    setIsRefreshing(false)
    toast({
      title: "Data Refreshed",
      description: "Your dashboard has been updated with the latest information",
    })
  }

  const getCertificatesByDepartment = (department: string) => {
    return certificates.filter((cert) => cert.certificateType === department)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "in-review":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "in-review":
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getProgress = (status: string) => {
    switch (status) {
      case "pending":
        return 25
      case "in-review":
        return 60
      case "approved":
        return 100
      case "rejected":
        return 100
      default:
        return 0
    }
  }

  const handleVoiceAssistant = () => {
    voiceAssistant.speak(
      `Hello ${userName}. You have ${applications.length} applications and ${certificates.length} certificates. You can say 'new application' to apply for services, or 'check status' to review your applications.`,
    )

    voiceAssistant.startListening(
      (command) => {
        const lowerCommand = command.toLowerCase()
        if (lowerCommand.includes("new application") || lowerCommand.includes("apply")) {
          voiceAssistant.speak("Which service would you like to apply for? Revenue, Education, or Naan Mudhalvan?")
        } else if (lowerCommand.includes("status") || lowerCommand.includes("check")) {
          const pendingCount = applications.filter((app) => app.status === "pending").length
          const approvedCount = applications.filter((app) => app.status === "approved").length
          voiceAssistant.speak(
            `You have ${pendingCount} pending applications and ${approvedCount} approved applications.`,
          )
        } else {
          voiceAssistant.speak("I can help you with new applications or checking status. Please try again.")
        }
      },
      (error) => {
        toast({
          title: "Voice Assistant Error",
          description: "Could not understand your command",
          variant: "destructive",
        })
      },
    )
  }

  const handleLogout = () => {
    localStorage.removeItem("userType")
    localStorage.removeItem("userId")
    localStorage.removeItem("userName")
    window.location.href = "/"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Citizen Portal</h1>
              <p className="text-gray-600">Welcome, {userName}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={refreshData} disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleVoiceAssistant}>
                <Mic className="h-4 w-4 mr-2" />
                Voice Assistant
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Department Services - For Viewing Documents */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">My Documents by Department</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link href="/citizen/documents/revenue">
                <CardHeader className="text-center">
                  <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Revenue Services</CardTitle>
                  <CardDescription>{getCertificatesByDepartment("revenue").length} Documents Available</CardDescription>
                  {getCertificatesByDepartment("revenue").length > 0 && (
                    <Badge className="bg-green-100 text-green-800 mt-2">
                      {getCertificatesByDepartment("revenue").length} Certificates
                    </Badge>
                  )}
                </CardHeader>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link href="/citizen/documents/education">
                <CardHeader className="text-center">
                  <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                    <GraduationCap className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Education Schemes</CardTitle>
                  <CardDescription>
                    {getCertificatesByDepartment("education").length} Documents Available
                  </CardDescription>
                  {getCertificatesByDepartment("education").length > 0 && (
                    <Badge className="bg-green-100 text-green-800 mt-2">
                      {getCertificatesByDepartment("education").length} Certificates
                    </Badge>
                  )}
                </CardHeader>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link href="/citizen/documents/naan-mudhalvan">
                <CardHeader className="text-center">
                  <div className="mx-auto h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">Naan Mudhalvan</CardTitle>
                  <CardDescription>
                    {getCertificatesByDepartment("naan-mudhalvan").length} Documents Available
                  </CardDescription>
                  {getCertificatesByDepartment("naan-mudhalvan").length > 0 && (
                    <Badge className="bg-green-100 text-green-800 mt-2">
                      {getCertificatesByDepartment("naan-mudhalvan").length} Certificates
                    </Badge>
                  )}
                </CardHeader>
              </Link>
            </Card>
          </div>
        </div>

        {/* New Application Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Apply for New Services</CardTitle>
            <CardDescription>Submit new applications for government services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/citizen/apply/revenue">
                <Button className="w-full h-16 bg-blue-600 hover:bg-blue-700">
                  <div className="text-center">
                    <FileText className="h-6 w-6 mx-auto mb-1" />
                    <div>Apply for Revenue Services</div>
                  </div>
                </Button>
              </Link>

              <Link href="/citizen/apply/education">
                <Button className="w-full h-16 bg-green-600 hover:bg-green-700">
                  <div className="text-center">
                    <GraduationCap className="h-6 w-6 mx-auto mb-1" />
                    <div>Apply for Education Schemes</div>
                  </div>
                </Button>
              </Link>

              <Link href="/citizen/apply/naan-mudhalvan">
                <Button className="w-full h-16 bg-purple-600 hover:bg-purple-700">
                  <div className="text-center">
                    <Users className="h-6 w-6 mx-auto mb-1" />
                    <div>Apply for Naan Mudhalvan</div>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Debug Information */}
        {certificates.length > 0 && (
          <Card className="mb-8 bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">🎉 Certificates Available!</CardTitle>
              <CardDescription>You have {certificates.length} certificates ready for download</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {certificates.map((cert) => (
                  <div key={cert.id} className="flex items-center justify-between p-2 bg-white rounded border">
                    <div>
                      <span className="font-medium">{cert.certificateType.toUpperCase()} Certificate</span>
                      <span className="text-sm text-gray-600 ml-2">#{cert.certificateNumber}</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Ready</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Applications Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My Applications Status</CardTitle>
                <CardDescription>Track the status of your submitted applications</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">No applications found. Start by applying for a service.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">{app.applicationId}</Badge>
                        <div>
                          <h4 className="font-semibold">{app.serviceName}</h4>
                          <p className="text-sm text-gray-600">{app.serviceType} Department</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(app.status)}>
                          {getStatusIcon(app.status)}
                          <span className="ml-1 capitalize">{app.status}</span>
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Progress</span>
                        <span>{getProgress(app.status)}%</span>
                      </div>
                      <Progress value={getProgress(app.status)} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Submitted: {new Date(app.submittedDate).toLocaleDateString()}</span>
                        <span>Updated: {new Date(app.lastUpdated).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
