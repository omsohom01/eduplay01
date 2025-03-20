import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getSession } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req)

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const userId = session.id
    const url = new URL(req.url)
    const subject = url.searchParams.get("subject")
    const topic = url.searchParams.get("topic")

    const client = await clientPromise
    const db = client.db()

    // If subject and topic are provided, get specific history
    if (subject && topic) {
      const history = await db.collection("learning_history").findOne({
        userId,
        subject,
        topic,
      })

      return NextResponse.json({ history }, { status: 200 })
    }

    // Otherwise, get all history for the user
    const history = await db.collection("learning_history").find({ userId }).sort({ lastAccessed: -1 }).toArray()

    return NextResponse.json({ history }, { status: 200 })
  } catch (error) {
    console.error("Get learning history error:", error)
    return NextResponse.json({ error: "An error occurred while fetching learning history." }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req)

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const userId = session.id
    const { subject, topic, content, progress, difficulty } = await req.json()

    if (!subject || !topic) {
      return NextResponse.json({ error: "Subject and topic are required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    // Check if history already exists
    const existingHistory = await db.collection("learning_history").findOne({
      userId,
      subject,
      topic,
    })

    const now = new Date()

    if (existingHistory) {
      // Update existing history
      await db.collection("learning_history").updateOne(
        { _id: existingHistory._id },
        {
          $set: {
            content: content || existingHistory.content,
            progress: progress !== undefined ? progress : existingHistory.progress,
            difficulty: difficulty || existingHistory.difficulty,
            lastAccessed: now,
            updatedAt: now,
          },
          $inc: { visitCount: 1 },
        },
      )
    } else {
      // Create new history
      await db.collection("learning_history").insertOne({
        userId,
        subject,
        topic,
        content: content || "",
        progress: progress || 0,
        difficulty: difficulty || "beginner",
        lastAccessed: now,
        visitCount: 1,
        createdAt: now,
        updatedAt: now,
      })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Update learning history error:", error)
    return NextResponse.json({ error: "An error occurred while updating learning history." }, { status: 500 })
  }
}

