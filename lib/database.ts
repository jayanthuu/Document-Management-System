// Mock database using localStorage for demo - in production use real database
export interface User {
  id: string
  userType: "citizen" | "department"
  identifier: string
  password: string
  fullName: string
  mobileNumber?: string
  email?: string
  department?: string
  isActive: boolean
  createdAt: string
}

export interface Application {
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
  assignedOfficer?: string
  remarks?: string
  documents: DocumentInfo[]
}

export interface DocumentInfo {
  name: string
  size: number
  type: string
  uploadedAt: string
  path?: string // For actual file storage path
}

export interface Certificate {
  id: string
  applicationId: string
  certificateNumber: string
  certificateType: string
  issuedDate: string
  issuedBy: string
  citizenName: string
  certificateData: any
  digitalSignature: string
}

class Database {
  private getFromStorage<T>(key: string): T[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  }

  private saveToStorage<T>(key: string, data: T[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(key, JSON.stringify(data))
  }

  // Initialize with sample data
  init() {
    const users = this.getFromStorage<User>("users")
    if (users.length === 0) {
      const sampleUsers: User[] = [
        {
          id: "1",
          userType: "citizen",
          identifier: "1234-5678-9012",
          password: "password123",
          fullName: "Suresh Babu",
          mobileNumber: "9876543210",
          email: "suresh@example.com",
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          userType: "department",
          identifier: "REV001",
          password: "admin123",
          fullName: "Rajesh Kumar",
          mobileNumber: "9876543211",
          email: "rajesh@tn.gov.in",
          department: "revenue",
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: "3",
          userType: "department",
          identifier: "EDU001",
          password: "admin123",
          fullName: "Priya Sharma",
          mobileNumber: "9876543212",
          email: "priya@tn.gov.in",
          department: "education",
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: "4",
          userType: "department",
          identifier: "NM001",
          password: "admin123",
          fullName: "Arjun Patel",
          mobileNumber: "9876543213",
          email: "arjun@tn.gov.in",
          department: "naan-mudhalvan",
          isActive: true,
          createdAt: new Date().toISOString(),
        },
      ]
      this.saveToStorage("users", sampleUsers)
    }
  }

  // User operations
  findUserByIdentifier(identifier: string): User | null {
    const users = this.getFromStorage<User>("users")
    return users.find((user) => user.identifier === identifier) || null
  }

  createUser(userData: Omit<User, "id" | "createdAt">): User {
    const users = this.getFromStorage<User>("users")
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    users.push(newUser)
    this.saveToStorage("users", users)
    return newUser
  }

  // Application operations
  createApplication(appData: Omit<Application, "id" | "applicationId" | "submittedDate" | "lastUpdated">): Application {
    const applications = this.getFromStorage<Application>("applications")

    // Convert File objects to DocumentInfo if needed
    const processedDocuments = appData.documents.map((doc: any) => {
      if (typeof doc === "string") {
        return {
          name: doc,
          size: 0,
          type: "application/octet-stream",
          uploadedAt: new Date().toISOString(),
        }
      } else if (doc instanceof File) {
        return {
          name: doc.name,
          size: doc.size,
          type: doc.type,
          uploadedAt: new Date().toISOString(),
        }
      }
      return doc
    })

    const newApp: Application = {
      ...appData,
      documents: processedDocuments,
      id: Date.now().toString(),
      applicationId: this.generateApplicationId(appData.serviceType),
      submittedDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    }

    // Add to beginning of array for newest first
    applications.unshift(newApp)
    this.saveToStorage("applications", applications)
    return newApp
  }

  getApplicationsByUserId(userId: string): Application[] {
    const applications = this.getFromStorage<Application>("applications")
    return applications.filter((app) => app.citizenId === userId)
  }

  getApplicationsByDepartment(department: string): Application[] {
    const applications = this.getFromStorage<Application>("applications")
    return applications.filter((app) => app.serviceType === department)
  }

  getAllApplications(): Application[] {
    return this.getFromStorage<Application>("applications")
  }

  updateApplicationStatus(applicationId: string, status: Application["status"], remarks?: string): void {
    const applications = this.getFromStorage<Application>("applications")
    const appIndex = applications.findIndex((app) => app.id === applicationId)
    if (appIndex !== -1) {
      applications[appIndex].status = status
      applications[appIndex].lastUpdated = new Date().toISOString()
      if (remarks) applications[appIndex].remarks = remarks
      this.saveToStorage("applications", applications)
    }
  }

  getApplicationById(id: string): Application | null {
    const applications = this.getFromStorage<Application>("applications")
    return applications.find((app) => app.id === id) || null
  }

  // Certificate operations
  createCertificate(
    certData: Omit<Certificate, "id" | "certificateNumber" | "issuedDate" | "digitalSignature">,
  ): Certificate {
    const certificates = this.getFromStorage<Certificate>("certificates")
    const newCert: Certificate = {
      ...certData,
      id: Date.now().toString(),
      certificateNumber: this.generateCertificateNumber(certData.certificateType),
      issuedDate: new Date().toISOString(),
      digitalSignature: this.generateDigitalSignature(),
    }
    certificates.push(newCert)
    this.saveToStorage("certificates", certificates)

    console.log("Certificate saved to localStorage:", newCert)
    console.log("All certificates:", certificates)

    return newCert
  }

  getCertificatesByUserId(userId: string): Certificate[] {
    const certificates = this.getFromStorage<Certificate>("certificates")
    const applications = this.getApplicationsByUserId(userId)
    const userAppIds = applications.map((app) => app.id)

    const userCertificates = certificates.filter((cert) => userAppIds.includes(cert.applicationId))
    console.log("Getting certificates for user:", userId)
    console.log("User applications:", userAppIds)
    console.log("User certificates:", userCertificates)

    return userCertificates
  }

  getCertificateById(id: string): Certificate | null {
    const certificates = this.getFromStorage<Certificate>("certificates")
    return certificates.find((cert) => cert.id === id) || null
  }

  private generateApplicationId(serviceType: string): string {
    const prefixes = {
      revenue: "REV",
      education: "EDU",
      "naan-mudhalvan": "NM",
    }
    const prefix = prefixes[serviceType as keyof typeof prefixes] || "APP"
    const timestamp = Date.now().toString().slice(-6)
    return `${prefix}${timestamp}`
  }

  private generateCertificateNumber(type: string): string {
    const year = new Date().getFullYear()
    const month = String(new Date().getMonth() + 1).padStart(2, "0")
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `${type.substring(0, 2).toUpperCase()}/${year}/${month}/${random}`
  }

  private generateDigitalSignature(): string {
    return "DIGITAL_SIGNATURE_" + Math.random().toString(36).substring(2, 15).toUpperCase()
  }
}

export const db = new Database()
