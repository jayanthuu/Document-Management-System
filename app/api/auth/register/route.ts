import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    // Initialize database
    db.init()

    // Check if user already exists
    const existingUser = db.findUserByIdentifier(userData.identifier)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this identifier" }, { status: 400 })
    }

    // Create new user
    const newUser = db.createUser({
      userType: userData.userType,
      identifier: userData.identifier,
      password: userData.password, // In production, hash this password
      fullName: userData.fullName,
      mobileNumber: userData.mobileNumber,
      email: userData.email,
      department: userData.department, // Only for department users
      isActive: true,
    })

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: "Registration successful",
    })
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
