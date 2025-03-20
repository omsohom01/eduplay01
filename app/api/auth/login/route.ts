import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { comparePassword, sanitizeUser } from "@/lib/models/user"

export async function POST(req: NextRequest) {
  try {
    const { email, password, age } = await req.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 422 })
    }

    const client = await clientPromise
    const db = client.db()

    // Find user
    const user = await db.collection("users").findOne({ email })
    if (!user) {
      return NextResponse.json({ error: "No user found with this email." }, { status: 404 })
    }

    // Verify password
    const isValid = await comparePassword(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid password." }, { status: 401 })
    }

    // Update age if provided
    if (age) {
      await db.collection("users").updateOne({ _id: user._id }, { $set: { age } })
    }

    // Create session
    const sessionUser = sanitizeUser(user)

    // Set session cookie
    const response = NextResponse.json({ user: sessionUser })
    response.cookies.set("auth_session", JSON.stringify(sessionUser), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "An error occurred during login." }, { status: 500 })
  }
}

