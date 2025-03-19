import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { hashPassword, createDefaultUserData } from "@/lib/models/user"

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    // Validate input
    if (!name || !email || !password || password.length < 6) {
      return NextResponse.json({ error: "Invalid input. Password must be at least 6 characters." }, { status: 422 })
    }

    const client = await clientPromise
    const db = client.db()

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email." }, { status: 422 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user with default data
    const userData = {
      name,
      email,
      password: hashedPassword,
      ...createDefaultUserData(),
    }

    const result = await db.collection("users").insertOne(userData)

    // Create session
    const user = {
      id: result.insertedId.toString(),
      name,
      email,
    }

    // Set session cookie
    const response = NextResponse.json({ user }, { status: 201 })
    response.cookies.set("auth_session", JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "An error occurred during signup." }, { status: 500 })
  }
}
