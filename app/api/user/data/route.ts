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

    const url = new URL(req.url)
    const userId = url.searchParams.get("userId") || session.id

    const client = await clientPromise
    const db = client.db()

    // Get user data
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } }, // Exclude password
    )

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get user progress
    const progress = user.progress || {}

    // Get user stats
    const stats = user.stats || {
      totalQuizzesTaken: 0,
      totalQuestionsAnswered: 0,
      correctAnswers: 0,
      totalTimeSpent: 0,
      gamesPlayed: 0,
      lastActive: new Date(),
    }

    // Get recent activities
    const activities = await db
      .collection("activities")
      .find({ userId: userId })
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray()

    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      age: user.age,
      progress,
      stats,
      activities,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    return NextResponse.json({ userData }, { status: 200 })
  } catch (error) {
    console.error("Get user data error:", error)
    return NextResponse.json({ error: "An error occurred while fetching user data." }, { status: 500 })
  }
}

