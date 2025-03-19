import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { getSession } from "@/lib/auth"
import type { ActivityLog } from "@/lib/models/user"

// Update the activity logging to include difficulty
export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request)

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const userId = session.id
    const activityData = await request.json()

    if (!activityData.type || typeof activityData.timeSpent !== "number") {
      return NextResponse.json({ error: "Invalid input" }, { status: 422 })
    }

    // Validate timeSpent to ensure it's reasonable (max 30 minutes in seconds)
    const timeSpent = Math.min(Math.max(0, activityData.timeSpent), 1800) // Cap between 0 and 30 minutes

    const client = await clientPromise
    const db = client.db()

    // Create activity log with validated time
    const activity: ActivityLog = {
      userId,
      ...activityData,
      timeSpent,
      timestamp: new Date(),
    }

    await db.collection("activities").insertOne(activity)

    // Only update stats if this is a completed activity (not passive browsing)
    // We'll check if it's a quiz or game with actual data
    const isCompletedActivity =
      (activityData.type === "quiz" && activityData.score !== undefined) ||
      (activityData.type === "game" && activityData.score !== undefined)

    if (isCompletedActivity) {
      // Update user stats with validated time - only for completed activities
      const updateData: Record<string, any> = {}

      // Only add time for completed activities
      if (timeSpent > 0) {
        updateData["stats.totalTimeSpent"] = timeSpent
      }

      if (activityData.type === "quiz") {
        updateData["stats.totalQuizzesTaken"] = 1
        if (activityData.totalQuestions) {
          updateData["stats.totalQuestionsAnswered"] = activityData.totalQuestions
        }
        if (activityData.score !== undefined) {
          updateData["stats.correctAnswers"] = activityData.score
        }
      } else if (activityData.type === "game") {
        updateData["stats.gamesPlayed"] = 1
      }

      // Only update if we have stats to update
      if (Object.keys(updateData).length > 0) {
        await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $inc: updateData })
      }

      // Update subject progress if applicable
      if (activityData.subject) {
        await db
          .collection("users")
          .updateOne({ _id: new ObjectId(userId) }, { $inc: { [`progress.${activityData.subject}`]: 5 } })
      }
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error("Log activity error:", error)
    return NextResponse.json({ error: "An error occurred while logging activity." }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req)

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const userId = session.id
    const url = new URL(req.url)
    const limit = Number.parseInt(url.searchParams.get("limit") || "10")

    const client = await clientPromise
    const db = client.db()

    const activities = await db.collection("activities").find({ userId }).sort({ timestamp: -1 }).limit(limit).toArray()

    return NextResponse.json({ activities }, { status: 200 })
  } catch (error) {
    console.error("Get activities error:", error)
    return NextResponse.json({ error: "An error occurred while fetching activities." }, { status: 500 })
  }
}
