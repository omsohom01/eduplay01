import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { getSession } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req)

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const userId = session.id
    const { subject, progress } = await req.json()

    if (!subject || typeof progress !== "number") {
      return NextResponse.json({ error: "Invalid input" }, { status: 422 })
    }

    const client = await clientPromise
    const db = client.db()

    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(userId) }, { $set: { [`progress.${subject}`]: progress } })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Update progress error:", error)
    return NextResponse.json({ error: "An error occurred while updating progress." }, { status: 500 })
  }
}
