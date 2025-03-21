import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Create a model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Generate content
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Try to extract JSON from the response
    try {
      // Find JSON array in the response
      const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/)
      if (jsonMatch) {
        const jsonStr = jsonMatch[0]
        const questions = JSON.parse(jsonStr)
        return NextResponse.json({ questions })
      } else {
        // If no valid JSON found, try to create basic questions as fallback
        const fallbackQuestions = [
          {
            question: "What is the main concept being taught in this topic?",
            options: [
              "The fundamental principles",
              "Advanced applications",
              "Historical context",
              "Future developments",
            ],
            correctAnswer: 0,
            explanation: "The fundamental principles are typically covered first in any educational topic.",
          },
          {
            question: "Why is this topic important to learn?",
            options: [
              "It builds critical thinking skills",
              "It's required for tests",
              "It has real-world applications",
              "All of the above",
            ],
            correctAnswer: 3,
            explanation: "Educational topics typically serve all these purposes.",
          },
          {
            question: "Which approach is best for mastering this topic?",
            options: ["Memorization only", "Practice and application", "Reading without notes", "Watching videos only"],
            correctAnswer: 1,
            explanation: "Practice and application are essential for mastering most educational topics.",
          },
        ]
        return NextResponse.json({ questions: fallbackQuestions })
      }
    } catch (parseError) {
      console.error("Error parsing questions:", parseError)
      return NextResponse.json({
        questions: [
          {
            question: "What is the main concept being taught in this topic?",
            options: [
              "The fundamental principles",
              "Advanced applications",
              "Historical context",
              "Future developments",
            ],
            correctAnswer: 0,
            explanation: "The fundamental principles are typically covered first in any educational topic.",
          },
          {
            question: "Why is this topic important to learn?",
            options: [
              "It builds critical thinking skills",
              "It's required for tests",
              "It has real-world applications",
              "All of the above",
            ],
            correctAnswer: 3,
            explanation: "Educational topics typically serve all these purposes.",
          },
          {
            question: "Which approach is best for mastering this topic?",
            options: ["Memorization only", "Practice and application", "Reading without notes", "Watching videos only"],
            correctAnswer: 1,
            explanation: "Practice and application are essential for mastering most educational topics.",
          },
        ],
      })
    }
  } catch (error) {
    console.error("Error in Gemini API:", error)
    return NextResponse.json({
      questions: [
        {
          question: "What is the main concept being taught in this topic?",
          options: ["The fundamental principles", "Advanced applications", "Historical context", "Future developments"],
          correctAnswer: 0,
          explanation: "The fundamental principles are typically covered first in any educational topic.",
        },
        {
          question: "Why is this topic important to learn?",
          options: [
            "It builds critical thinking skills",
            "It's required for tests",
            "It has real-world applications",
            "All of the above",
          ],
          correctAnswer: 3,
          explanation: "Educational topics typically serve all these purposes.",
        },
        {
          question: "Which approach is best for mastering this topic?",
          options: ["Memorization only", "Practice and application", "Reading without notes", "Watching videos only"],
          correctAnswer: 1,
          explanation: "Practice and application are essential for mastering most educational topics.",
        },
      ],
    })
  }
}

