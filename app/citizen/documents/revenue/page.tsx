"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, FileText, Calendar, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Certificate {
  id: string
  certificateNumber: string
  certificateType: string
  issuedDate: string
  citizenName: string
  certificateData: any
}

export default function RevenueCertificates() {
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
        // Filter only revenue certificates
        const revenueCerts = data.certificates.filter((cert: Certificate) => cert.certificateType === "revenue")
        setCertificates(revenueCerts)
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
        a.download = `revenue-certificate-${certificateId}.html`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Certificate Downloaded",
          description: "Your revenue certificate has been downloaded successfully",
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
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading your revenue certificates...</p>
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
                <h1 className="text-2xl font-bold text-gray-900">Revenue Department Certificates</h1>
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
              <FileText className="h-6 w-6 mr-2 text-blue-600" />
              Revenue Department Documents
            </CardTitle>
            <CardDescription>Your certificates and documents from the Revenue Department</CardDescription>
          </CardHeader>
          <CardContent>
            {certificates.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Revenue Certificates Found</h3>
                <p className="text-gray-600 mb-6">You don't have any certificates from the Revenue Department yet.</p>
                <Link href="/citizen/apply/revenue">
                  <Button className="bg-blue-600 hover:bg-blue-700">Apply for Revenue Services</Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-6">
                {certificates.map((cert) => (
                  <div key={cert.id} className="border rounded-lg p-6 bg-blue-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <FileText className="h-5 w-5 text-blue-600 mr-2" />
                          <h3 className="text-lg font-semibold text-blue-900">
                            {cert.certificateData?.certificateSubType
                              ? `${cert.certificateData.certificateSubType.charAt(0).toUpperCase() + cert.certificateData.certificateSubType.slice(1)} Certificate`
                              : "Revenue Certificate"}
                          </h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center text-sm text-gray-700">
                            <User className="h-4 w-4 mr-2" />
                            <span className="font-medium">Name:</span>
                            <span className="ml-1">{cert.certificateData?.citizenName || cert.citizenName}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-700">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span className="font-medium">Issued:</span>
                            <span className="ml-1">{new Date(cert.issuedDate).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <Badge variant="outline" className="text-blue-700 border-blue-300">
                            Certificate No: {cert.certificateNumber}
                          </Badge>
                          {cert.certificateData?.purpose && (
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Purpose:</span> {cert.certificateData.purpose}
                            </div>
                          )}
                        </div>
                      </div>

                      <Button
                        onClick={() => downloadCertificate(cert.id)}
                        className="bg-blue-600 hover:bg-blue-700 ml-4"
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
