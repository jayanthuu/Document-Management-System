"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, GraduationCap, Calendar, User, BookOpen } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Certificate {
  id: string
  certificateNumber: string
  certificateType: string
  issuedDate: string
  citizenName: string
  certificateData: any
}

export default function EducationCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId")
    const storedUserName = localStorage.getItem("userName")

    if (!storedUserId) {
      window.location.href = "/citizen/login"
      return
    }

    setUserName(storedUserName || "Citizen")
    fetchCertificates(storedUserId)
  }, [])

  const fetchCertificates = async (userId: string) => {
    try {
      const response = await fetch(`/api/certificates?userId=${userId}`)
      const data = await response.json()

      if (data.success) {
        // Filter only education certificates
        const educationCerts = data.certificates.filter((cert: Certificate) => cert.certificateType === "education")
        setCertificates(educationCerts)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch certificates",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const downloadCertificate = async (certificateId: string) => {
    try {
      const response = await fetch(`/api/certificates/${certificateId}/download`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `education-certificate-${certificateId}.html`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Certificate Downloaded",
          description: "Your education certificate has been downloaded successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not download certificate",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading your education certificates...</p>
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
            <div className="flex items-center space-x-4">
              <Link href="/citizen/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Education Department Certificates</h1>
                <p className="text-gray-600">Welcome, {userName}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="h-6 w-6 mr-2 text-green-600" />
              Education Department Documents
            </CardTitle>
            <CardDescription>Your certificates and documents from the Education Department</CardDescription>
          </CardHeader>
          <CardContent>
            {certificates.length === 0 ? (
              <div className="text-center py-12">
                <GraduationCap className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Education Certificates Found</h3>
                <p className="text-gray-600 mb-6">You don't have any certificates from the Education Department yet.</p>
                <Link href="/citizen/apply/education">
                  <Button className="bg-green-600 hover:bg-green-700">Apply for Education Schemes</Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-6">
                {certificates.map((cert) => (
                  <div key={cert.id} className="border rounded-lg p-6 bg-green-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <GraduationCap className="h-5 w-5 text-green-600 mr-2" />
                          <h3 className="text-lg font-semibold text-green-900">
                            {cert.certificateData?.scholarshipName || "Education Certificate"}
                          </h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center text-sm text-gray-700">
                            <User className="h-4 w-4 mr-2" />
                            <span className="font-medium">Student:</span>
                            <span className="ml-1">{cert.certificateData?.studentName || cert.citizenName}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-700">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span className="font-medium">Issued:</span>
                            <span className="ml-1">{new Date(cert.issuedDate).toLocaleDateString()}</span>
                          </div>
                          {cert.certificateData?.course && (
                            <div className="flex items-center text-sm text-gray-700">
                              <BookOpen className="h-4 w-4 mr-2" />
                              <span className="font-medium">Course:</span>
                              <span className="ml-1">{cert.certificateData.course}</span>
                            </div>
                          )}
                          {cert.certificateData?.amount && (
                            <div className="flex items-center text-sm text-gray-700">
                              <span className="font-medium">Amount:</span>
                              <span className="ml-1">₹{cert.certificateData.amount}</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2 mb-4">
                          <Badge variant="outline" className="text-green-700 border-green-300">
                            Certificate No: {cert.certificateNumber}
                          </Badge>
                          {cert.certificateData?.institution && (
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Institution:</span> {cert.certificateData.institution}
                            </div>
                          )}
                        </div>
                      </div>

                      <Button
                        onClick={() => downloadCertificate(cert.id)}
                        className="bg-green-600 hover:bg-green-700 ml-4"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
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
