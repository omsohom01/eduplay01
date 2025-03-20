import { type NextRequest, NextResponse } from "next/server"
import { generateQuestions } from "@/lib/gemini-api"

export async function POST(request: NextRequest) {
  try {
    const { subject, topic, difficulty, count } = await request.json()

    if (!subject || !topic || !difficulty) {
      return NextResponse.json({ error: "Subject, topic, and difficulty are required" }, { status: 400 })
    }

    const questions = await generateQuestions(subject, topic, difficulty, count || 5)

    return NextResponse.json({ questions })
  } catch (error) {
    console.error("Error in questions route:", error)
    return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 })
  }
}

