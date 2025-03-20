import { type NextRequest, NextResponse } from "next/server"
import { generateChat } from "@/lib/gemini-api"

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 })
    }

    const response = await generateChat(messages)

    return NextResponse.json({
      message: {
        role: "assistant",
        content: response,
      },
    })
  } catch (error) {
    console.error("Error in chat route:", error)
    return NextResponse.json({ error: "Failed to generate chat response" }, { status: 500 })
  }
}

