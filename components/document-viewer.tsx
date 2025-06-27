"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Eye, Download, FileText, ImageIcon } from "lucide-react"

interface DocumentViewerProps {
  file: File
  onRemove?: () => void
}

export function DocumentViewer({ file, onRemove }: DocumentViewerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleView = () => {
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setIsOpen(true)
    }
  }

  const handleDownload = () => {
    if (file) {
      const url = URL.createObjectURL(file)
      const a = document.createElement("a")
      a.href = url
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const getFileIcon = () => {
    const fileType = file.type.toLowerCase()
    if (fileType.includes("image")) {
      return <ImageIcon className="h-4 w-4" />
    } else if (fileType.includes("pdf")) {
      return <FileText className="h-4 w-4" />
    }
    return <FileText className="h-4 w-4" />
  }

  const isImage = file.type.startsWith("image/")
  const isPDF = file.type === "application/pdf"

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
      <div className="flex items-center space-x-3">
        {getFileIcon()}
        <div>
          <p className="text-sm font-medium text-gray-900">{file.name}</p>
          <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" onClick={handleView}>
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>{file.name}</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {previewUrl && (
                <>
                  {isImage && (
                    <img
                      src={previewUrl || "/placeholder.svg"}
                      alt={file.name}
                      className="max-w-full h-auto rounded-lg"
                    />
                  )}
                  {isPDF && <iframe src={previewUrl} className="w-full h-[600px] rounded-lg" title={file.name} />}
                  {!isImage && !isPDF && (
                    <div className="text-center py-8">
                      <ImageIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">Preview not available for this file type</p>
                      <Button onClick={handleDownload} className="mt-4">
                        <Download className="h-4 w-4 mr-2" />
                        Download to View
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-1" />
          Download
        </Button>

        {onRemove && (
          <Button variant="destructive" size="sm" onClick={onRemove}>
            Remove
          </Button>
        )}
      </div>
    </div>
  )
}
