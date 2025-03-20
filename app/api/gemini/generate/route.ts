import { type NextRequest, NextResponse } from "next/server"
import { generateContent } from "@/lib/gemini-api"

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const content = await generateContent(prompt)

    return NextResponse.json({ content })
  } catch (error) {
    console.error("Error in generate route:", error)
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 })
  }
}

