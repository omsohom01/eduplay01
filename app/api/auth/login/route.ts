import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { comparePassword, sanitizeUser } from "@/lib/models/user"
import { ObjectId } from "mongodb"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Please provide email and password." }, { status: 422 })
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

    // Update last login
    await db.collection("users").updateOne({ _id: new ObjectId(user._id) }, { $set: { lastLogin: new Date() } })

    // Create session
    const session = sanitizeUser(user)

    // Set session cookie
    const response = NextResponse.json({ user: session }, { status: 200 })
    response.cookies.set("auth_session", JSON.stringify(session), {
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
