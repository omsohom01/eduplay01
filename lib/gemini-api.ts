import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function generateContent(prompt: string) {
  try {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return text
  } catch (error) {
    console.error("Error generating content:", error)
    return "I'm sorry, I couldn't generate content at this time. Please try again later."
  }
}

export async function generateQuestions(subject: string, topic: string, difficulty: string, count = 5) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `Generate ${count} multiple-choice questions about ${topic} in ${subject} at a ${difficulty} difficulty level. 
    Format each question as a JSON object with the following structure:
    {
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "The correct option (full text)",
      "explanation": "A brief explanation of why this is the correct answer"
    }
    Return the questions as a JSON array of these objects. Make sure the JSON is valid and properly formatted.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse the response to get the questions
    try {
      // Find JSON array in the response
      const jsonMatch = text.match(/\[\s*\{.*\}\s*\]/s)
      if (jsonMatch) {
        const jsonStr = jsonMatch[0]
        const questions = JSON.parse(jsonStr)
        return questions
      } else {
        throw new Error("No valid JSON found in response")
      }
    } catch (parseError) {
      console.error("Error parsing questions:", parseError)
      return []
    }
  } catch (error) {
    console.error("Error generating questions:", error)
    return []
  }
}

export async function generateChat(messages: { role: string; content: string }[]) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Convert our message format to Gemini's chat format
    const chat = model.startChat({
      history: messages.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
    })

    // Get the last user message
    const lastUserMessage = messages.filter((msg) => msg.role === "user").pop()
    if (!lastUserMessage) {
      throw new Error("No user message found")
    }

    const result = await chat.sendMessage(lastUserMessage.content)
    const response = await result.response
    const text = response.text()

    return text
  } catch (error) {
    console.error("Error in chat:", error)
    return "I'm sorry, I couldn't process your request at this time. Please try again later."
  }
}

