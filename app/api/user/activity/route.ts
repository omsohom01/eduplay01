import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { getSession } from "@/lib/auth"

// Update the activity logging to include all types of activities
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

    // Validate timeSpent to ensure it's reasonable (max 2 hours in seconds)
    const timeSpent = Math.min(Math.max(0, activityData.timeSpent), 7200) // Cap between 0 and 2 hours

    const client = await clientPromise
    const db = client.db()

    // Create activity log with validated time
    const activity = {
      userId,
      ...activityData,
      timeSpent,
      timestamp: new Date(),
    }

    await db.collection("activities").insertOne(activity)

    // Update user stats based on activity type
    const updateData: Record<string, any> = {}

    // Always add time spent for any activity
    if (timeSpent > 0) {
      updateData["stats.totalTimeSpent"] = timeSpent
    }

    // Update specific stats based on activity type
    switch (activityData.type) {
      case "quiz":
        updateData["stats.totalQuizzesTaken"] = 1
        if (activityData.totalQuestions) {
          updateData["stats.totalQuestionsAnswered"] = activityData.totalQuestions
        }
        if (activityData.score !== undefined) {
          updateData["stats.correctAnswers"] = activityData.score
        }
        break
      case "game":
        updateData["stats.gamesPlayed"] = 1
        break
      case "subject":
        updateData["stats.subjectsExplored"] = 1
        if (activityData.topic) {
          updateData["stats.topicsStudied"] = 1
        }
        break
      case "test":
        // For "Test Your Level" activities
        updateData["stats.totalQuizzesTaken"] = 1
        if (activityData.totalQuestions) {
          updateData["stats.totalQuestionsAnswered"] = activityData.totalQuestions
        }
        break
      case "video":
        // For video search activities
        // No specific counter for this yet, but we track time spent
        break
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
    const limit = Number.parseInt(url.searchParams.get("limit") || "20")
    const type = url.searchParams.get("type") // Optional filter by activity type

    const client = await clientPromise
    const db = client.db()

    // Build query
    const query: Record<string, any> = { userId }
    if (type) {
      query.type = type
    }

    const activities = await db.collection("activities").find(query).sort({ timestamp: -1 }).limit(limit).toArray()

    return NextResponse.json({ activities }, { status: 200 })
  } catch (error) {
    console.error("Get activities error:", error)
    return NextResponse.json({ error: "An error occurred while fetching activities." }, { status: 500 })
  }
}

