import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { getSession } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req)

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const userId = session.id

    const client = await clientPromise
    const db = client.db()

    const user = await db.collection("users").findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } }, // Exclude password
    )

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "An error occurred while fetching user data." }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession(req)

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const userId = session.id
    const { name } = await req.json()

    const client = await clientPromise
    const db = client.db()

    const updateData: Record<string, any> = {}
    if (name) updateData.name = name

    const result = await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update session with new name
    if (name) {
      const updatedSession = { ...session, name }
      const response = NextResponse.json({ success: true }, { status: 200 })

      response.cookies.set("auth_session", JSON.stringify(updatedSession), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      })

      return response
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json({ error: "An error occurred while updating user data." }, { status: 500 })
  }
}
