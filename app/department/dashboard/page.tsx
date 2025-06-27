"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FileText, Clock, CheckCircle, XCircle, LogOut, Eye, Send, Download, Award } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DocumentMeta {
  name: string
  size: number
  type: string
  uploadedAt: string
  url?: string
}

interface Application {
  id: string
  applicationId: string
  citizenId: string
  serviceType: string
  serviceName: string
  status: "pending" | "in-review" | "approved" | "rejected" | "forwarded"
  priority: "low" | "medium" | "high"
  formData: any
  submittedDate: string
  lastUpdated: string
  documents: DocumentMeta[]
}

export default function DepartmentDashboard() {
  const [applications, setApplications] = useState<Application[]>([])
  const [employeeInfo, setEmployeeInfo] = useState({ id: "", name: "", department: "" })
  const [stats, setStats] = useState({
    pending: 0,
    inReview: 0,
    approved: 0,
    rejected: 0,
  })
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [actionRemarks, setActionRemarks] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()
  const [documentViewerOpen, setDocumentViewerOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<{ name: string; url: string; type: string } | null>(null)
  const [documentLoading, setDocumentLoading] = useState(false)

  useEffect(() => {
    const employeeId = localStorage.getItem("employeeId")
    const employeeName = localStorage.getItem("employeeName")
    const department = localStorage.getItem("department")

    if (!employeeId || !department) {
      window.location.href = "/department/login"
      return
    }

    setEmployeeInfo({ id: employeeId, name: employeeName || "", department })
    fetchApplications(department)
  }, [])

  const fetchApplications = async (department: string) => {
    try {
      const response = await fetch(`/api/applications?userType=department&department=${department}`)
      const data = await response.json()

      if (data.success) {
        setApplications(data.applications)
        calculateStats(data.applications)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch applications",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const calculateStats = (apps: Application[]) => {
    const newStats = apps.reduce(
      (acc, app) => {
        if (app.status === "in-review") acc.inReview++
        else acc[app.status]++
        return acc
      },
      { pending: 0, inReview: 0, approved: 0, rejected: 0 },
    )
    setStats(newStats)
  }

  const handleAction = async (applicationId: string, action: "approve" | "reject" | "review" | "forward") => {
    if (!selectedApp) return

    setIsProcessing(true)

    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: action === "review" ? "in-review" : action === "forward" ? "forwarded" : action + "d",
          remarks: actionRemarks,
          issuedBy: employeeInfo.name || employeeInfo.id,
          applicationData: selectedApp,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Action Completed",
          description: `Application has been ${action}${action.endsWith("e") ? "d" : "ed"} successfully`,
        })

        // Refresh applications
        await fetchApplications(employeeInfo.department)
        setActionRemarks("")
        setSelectedApp(null)
        setDialogOpen(false)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "Could not complete the action. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const generateCertificate = async (applicationId: string) => {
    if (!selectedApp) return

    setIsProcessing(true)

    try {
      const response = await fetch(`/api/certificates/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId: applicationId,
          issuedBy: employeeInfo.name || employeeInfo.id,
          applicationData: selectedApp,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Certificate Generated!",
          description: `Certificate ${data.certificate.certificateNumber} has been generated and sent to citizen`,
        })

        // Refresh applications to update the UI
        await fetchApplications(employeeInfo.department)
        setActionRemarks("")
        setSelectedApp(null)
        setDialogOpen(false)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Certificate Generation Failed",
        description: "Could not generate certificate. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "in-review":
        return "bg-yellow-100 text-yellow-800"
      case "forwarded":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-green-100 text-green-800"
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("userType")
    localStorage.removeItem("employeeId")
    localStorage.removeItem("employeeName")
    localStorage.removeItem("department")
    window.location.href = "/"
  }

  const filterApplications = (status?: string) => {
    if (!status || status === "all") return applications
    if (status === "completed")
      return applications.filter((app) => app.status === "approved" || app.status === "rejected")
    return applications.filter((app) => app.status === status)
  }

  const formatFormData = (formData: any) => {
    const entries = Object.entries(formData).filter(([key, value]) => value && value !== "")
    return entries.map(([key, value]) => ({
      label: key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
      value: value as string,
    }))
  }

  const handleViewDocument = async (doc: DocumentMeta) => {
    setDocumentLoading(true)
    try {
      const documentUrl = `/api/documents/${selectedApp?.id}/${encodeURIComponent(doc.name)}`

      // Test if the document is accessible
      const response = await fetch(documentUrl, { method: "HEAD" })

      if (response.ok) {
        setSelectedDocument({
          name: doc.name,
          url: documentUrl,
          type: doc.type,
        })
        setDocumentViewerOpen(true)
        toast({
          title: "Document Loaded",
          description: `Successfully loaded ${doc.name}`,
        })
      } else {
        throw new Error("Document not accessible")
      }
    } catch (error) {
      console.error("Document loading error:", error)
      toast({
        title: "Document Loading Failed",
        description: "Could not load the document. Creating demo version for testing.",
        variant: "destructive",
      })

      // Create demo document URL for testing
      const demoUrl = `/api/documents/${selectedApp?.id}/${encodeURIComponent(doc.name)}`
      setSelectedDocument({
        name: doc.name,
        url: demoUrl,
        type: doc.type,
      })
      setDocumentViewerOpen(true)
    } finally {
      setDocumentLoading(false)
    }
  }

  const handleDownloadDocument = async (doc: DocumentMeta) => {
    try {
      const url = `/api/documents/${selectedApp?.id}/${encodeURIComponent(doc.name)}`

      // Create download link
      const link = document.createElement("a")
      link.href = url
      link.download = doc.name
      link.target = "_blank"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Download Started",
        description: `Downloading ${doc.name}...`,
      })
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not download the document. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()
    switch (extension) {
      case "pdf":
        return "📄"
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "🖼️"
      case "doc":
      case "docx":
        return "📝"
      default:
        return "📎"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading department dashboard...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">
                {employeeInfo.department.charAt(0).toUpperCase() + employeeInfo.department.slice(1)} Department Portal
              </h1>
              <p className="text-gray-600">{employeeInfo.name || employeeInfo.id}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Review</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.inReview}</p>
                </div>
                <FileText className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Application Management - {employeeInfo.department.toUpperCase()} Department</CardTitle>
            <CardDescription>Review and process citizen applications for your department</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Applications</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="in-review">In Review</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              {["all", "pending", "in-review", "completed"].map((tabValue) => (
                <TabsContent key={tabValue} value={tabValue} className="space-y-4">
                  {filterApplications(tabValue).length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-600">No applications found in this category.</p>
                    </div>
                  ) : (
                    filterApplications(tabValue).map((app) => (
                      <div key={app.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline">{app.applicationId}</Badge>
                            <div>
                              <h4 className="font-semibold">
                                {app.formData.fullName || app.formData.studentName || "Applicant"}
                              </h4>
                              <p className="text-sm text-gray-600">{app.serviceName}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getPriorityColor(app.priority)}>{app.priority.toUpperCase()}</Badge>
                            <Badge className={getStatusColor(app.status)}>{app.status.toUpperCase()}</Badge>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            <p>Submitted: {new Date(app.submittedDate).toLocaleDateString()}</p>
                            <p>Documents: {app.documents.length} files</p>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Dialog open={dialogOpen && selectedApp?.id === app.id} onOpenChange={setDialogOpen}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedApp(app)
                                    setDialogOpen(true)
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Application Details - {app.applicationId}</DialogTitle>
                                  <DialogDescription>
                                    {app.serviceName} - {app.serviceType} Department
                                  </DialogDescription>
                                </DialogHeader>

                                {selectedApp && (
                                  <div className="space-y-6">
                                    {/* Basic Information */}
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="font-semibold text-base">Application ID</Label>
                                        <p className="text-lg">{selectedApp.applicationId}</p>
                                      </div>
                                      <div>
                                        <Label className="font-semibold text-base">Service Type</Label>
                                        <p className="text-lg">{selectedApp.serviceName}</p>
                                      </div>
                                      <div>
                                        <Label className="font-semibold text-base">Status</Label>
                                        <Badge className={getStatusColor(selectedApp.status)}>
                                          {selectedApp.status.toUpperCase()}
                                        </Badge>
                                      </div>
                                      <div>
                                        <Label className="font-semibold text-base">Priority</Label>
                                        <Badge className={getPriorityColor(selectedApp.priority)}>
                                          {selectedApp.priority.toUpperCase()}
                                        </Badge>
                                      </div>
                                    </div>

                                    {/* Applicant Details */}
                                    <div>
                                      <Label className="font-semibold text-lg mb-4 block">Applicant Information</Label>
                                      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                        {formatFormData(selectedApp.formData).map((item, index) => (
                                          <div key={index}>
                                            <Label className="font-medium text-gray-700">{item.label}</Label>
                                            <p className="text-gray-900">{item.value}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Enhanced Documents Section */}
                                    {selectedApp.documents.length > 0 && (
                                      <div>
                                        <Label className="font-semibold text-lg mb-4 block">
                                          📎 Uploaded Documents ({selectedApp.documents.length})
                                        </Label>
                                        <div className="grid grid-cols-1 gap-3">
                                          {selectedApp.documents.map((doc, index) => (
                                            <div
                                              key={index}
                                              className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200"
                                            >
                                              <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4 flex-1">
                                                  <div className="text-3xl">{getFileIcon(doc.name)}</div>
                                                  <div className="flex-1 min-w-0">
                                                    <p
                                                      className="font-semibold text-gray-900 truncate"
                                                      title={doc.name}
                                                    >
                                                      {doc.name}
                                                    </p>
                                                    <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                                                      <span className="bg-white px-2 py-1 rounded text-xs">
                                                        {(doc.size / 1024 / 1024).toFixed(2)} MB
                                                      </span>
                                                      <span className="bg-white px-2 py-1 rounded text-xs">
                                                        {doc.type}
                                                      </span>
                                                      <span className="text-xs">
                                                        📅 {new Date(doc.uploadedAt).toLocaleDateString()}
                                                      </span>
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="flex items-center space-x-2 ml-4">
                                                  <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleViewDocument(doc)}
                                                    disabled={documentLoading}
                                                    className="bg-white hover:bg-blue-50 border-blue-200"
                                                  >
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    {documentLoading ? "Loading..." : "View"}
                                                  </Button>
                                                  <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDownloadDocument(doc)}
                                                    className="bg-white hover:bg-green-50 border-green-200"
                                                  >
                                                    <Download className="h-4 w-4 mr-1" />
                                                    Download
                                                  </Button>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {/* Action Section */}
                                    <div className="space-y-4 pt-4 border-t">
                                      <div>
                                        <Label htmlFor="remarks" className="font-semibold">
                                          Remarks/Comments
                                        </Label>
                                        <Textarea
                                          id="remarks"
                                          value={actionRemarks}
                                          onChange={(e) => setActionRemarks(e.target.value)}
                                          placeholder="Add your remarks or comments about this application..."
                                          className="mt-2"
                                        />
                                      </div>

                                      {/* Action Buttons */}
                                      <div className="flex flex-wrap gap-2">
                                        {selectedApp.status === "pending" && (
                                          <>
                                            <Button
                                              size="sm"
                                              onClick={() => handleAction(selectedApp.id, "review")}
                                              className="bg-yellow-600 hover:bg-yellow-700"
                                              disabled={isProcessing}
                                            >
                                              <Clock className="h-4 w-4 mr-1" />
                                              Start Review
                                            </Button>
                                            <Button
                                              size="sm"
                                              onClick={() => handleAction(selectedApp.id, "approve")}
                                              className="bg-green-600 hover:bg-green-700"
                                              disabled={isProcessing}
                                            >
                                              <CheckCircle className="h-4 w-4 mr-1" />
                                              Approve Application
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="destructive"
                                              onClick={() => handleAction(selectedApp.id, "reject")}
                                              disabled={isProcessing}
                                            >
                                              <XCircle className="h-4 w-4 mr-1" />
                                              Reject
                                            </Button>
                                          </>
                                        )}

                                        {selectedApp.status === "in-review" && (
                                          <>
                                            <Button
                                              size="sm"
                                              onClick={() => handleAction(selectedApp.id, "approve")}
                                              className="bg-green-600 hover:bg-green-700"
                                              disabled={isProcessing}
                                            >
                                              <CheckCircle className="h-4 w-4 mr-1" />
                                              Approve Application
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => handleAction(selectedApp.id, "forward")}
                                              disabled={isProcessing}
                                            >
                                              <Send className="h-4 w-4 mr-1" />
                                              Forward to Senior
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="destructive"
                                              onClick={() => handleAction(selectedApp.id, "reject")}
                                              disabled={isProcessing}
                                            >
                                              <XCircle className="h-4 w-4 mr-1" />
                                              Reject
                                            </Button>
                                          </>
                                        )}

                                        {selectedApp.status === "approved" && (
                                          <div className="space-y-3">
                                            <div className="text-green-600 font-medium flex items-center">
                                              <CheckCircle className="h-5 w-5 mr-2" />
                                              Application Approved Successfully
                                            </div>
                                            <div className="bg-blue-50 p-4 rounded-lg">
                                              <p className="text-sm text-blue-800 mb-3">
                                                The application has been approved. Click below to generate and send the
                                                certificate to the citizen.
                                              </p>
                                              <Button
                                                size="sm"
                                                onClick={() => generateCertificate(selectedApp.id)}
                                                className="bg-blue-600 hover:bg-blue-700"
                                                disabled={isProcessing}
                                              >
                                                <Award className="h-4 w-4 mr-1" />
                                                {isProcessing
                                                  ? "Generating Certificate..."
                                                  : "Generate & Send Certificate"}
                                              </Button>
                                            </div>
                                          </div>
                                        )}

                                        {selectedApp.status === "rejected" && (
                                          <div className="text-red-600 font-medium flex items-center">
                                            <XCircle className="h-5 w-5 mr-2" />
                                            Application Rejected
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Document Viewer Dialog */}
      <Dialog open={documentViewerOpen} onOpenChange={setDocumentViewerOpen}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <span>📄 Document Viewer</span>
            </DialogTitle>
            <DialogDescription className="flex items-center space-x-2">
              <span>{selectedDocument?.name}</span>
              {selectedDocument?.type && (
                <Badge variant="outline" className="ml-2">
                  {selectedDocument.type}
                </Badge>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {selectedDocument && (
              <div className="space-y-4">
                {/* Document Controls */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getFileIcon(selectedDocument.name)}</div>
                    <div>
                      <p className="font-medium text-gray-900">{selectedDocument.name}</p>
                      <p className="text-sm text-gray-600">Click buttons below to view or download</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => window.open(selectedDocument.url, "_blank")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Open in New Tab
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDownloadDocument({ name: selectedDocument.name } as DocumentMeta)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>

                {/* Document Preview */}
                <div className="border rounded-lg overflow-hidden">
                  {selectedDocument.name.toLowerCase().endsWith(".pdf") ? (
                    <div className="bg-gray-100 p-4">
                      <div className="text-center py-8">
                        <div className="text-6xl mb-4">📄</div>
                        <p className="text-lg font-medium text-gray-900 mb-2">PDF Document</p>
                        <p className="text-gray-600 mb-4">
                          PDF preview is available in the new tab. Click "Open in New Tab" to view the document.
                        </p>
                        <iframe
                          src={selectedDocument.url}
                          className="w-full h-[600px] border rounded-lg bg-white"
                          title={selectedDocument.name}
                          onError={() => {
                            toast({
                              title: "PDF Preview Unavailable",
                              description: "Please use 'Open in New Tab' to view the PDF document.",
                              variant: "destructive",
                            })
                          }}
                        />
                      </div>
                    </div>
                  ) : selectedDocument.name.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/) ? (
                    <div className="bg-gray-100 p-4">
                      <div className="text-center">
                        <img
                          src={selectedDocument.url || "/placeholder.svg"}
                          alt={selectedDocument.name}
                          className="max-w-full h-auto rounded-lg border bg-white shadow-sm mx-auto"
                          onError={(e) => {
                            e.currentTarget.style.display = "none"
                            toast({
                              title: "Image Preview Unavailable",
                              description: "Could not load image preview. Please try downloading the file.",
                              variant: "destructive",
                            })
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-100 p-8 text-center">
                      <div className="text-6xl mb-4">📎</div>
                      <p className="text-lg font-medium text-gray-900 mb-2">Document Preview</p>
                      <p className="text-gray-600 mb-4">
                        Preview not available for this file type. Please download to view the document.
                      </p>
                      <Button
                        onClick={() => handleDownloadDocument({ name: selectedDocument.name } as DocumentMeta)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Document
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
