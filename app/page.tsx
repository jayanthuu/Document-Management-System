import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Mic, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-green-600 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Rural Digital Platform</h1>
            </div>
            <nav className="hidden md:flex space-x-4">
              <Link href="/about" className="text-gray-600 hover:text-gray-900">
                About
              </Link>
              <Link href="/services" className="text-gray-600 hover:text-gray-900">
                Services
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Government Services
            <span className="block text-green-600">Made Simple</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Access government documents and services with ease. Voice-enabled interface designed specifically for rural
            communities.
          </p>

          {/* Portal Selection */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Citizen Portal</CardTitle>
                <CardDescription className="text-lg">
                  Apply for certificates, access schemes, and track your applications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="text-left space-y-2 text-gray-600">
                  <li>• Revenue Department Services</li>
                  <li>• Education Schemes & Certificates</li>
                  <li>• Naan Mudhalvan Skill Development</li>
                  <li>• Real-time Application Tracking</li>
                </ul>
                <Link href="/citizen/login" className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Access Citizen Portal</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Department Portal</CardTitle>
                <CardDescription className="text-lg">
                  Review applications, approve requests, and manage certificates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="text-left space-y-2 text-gray-600">
                  <li>• Review Citizen Applications</li>
                  <li>• Approve/Reject Requests</li>
                  <li>• Generate Official Certificates</li>
                  <li>• Track & Audit All Actions</li>
                </ul>
                <Link href="/department/login" className="block">
                  <Button className="w-full bg-green-600 hover:bg-green-700">Access Department Portal</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Platform Features</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Mic className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Voice Enabled</h4>
              <p className="text-gray-600">Navigate and fill forms using voice commands in local languages</p>
            </div>
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Digital Documents</h4>
              <p className="text-gray-600">Secure digital storage and instant access to all your certificates</p>
            </div>
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Transparent Process</h4>
              <p className="text-gray-600">Real-time tracking and complete transparency in application processing</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Rural Digital Platform. Empowering rural communities through technology.</p>
        </div>
      </footer>
    </div>
  )
}
