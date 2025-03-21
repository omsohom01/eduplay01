"use client"
​
import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { MessageSquare, Send, User } from "lucide-react"
​
interface Message {
  role: "user" | "assistant"
  content: string
}
​
export default function ChatbotPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi there! I'm your EduPlay assistant. Ask me anything about your studies or any educational topic!",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
​
  // Hardcoded API key (REMOVE THIS FOR PRODUCTION)
  const apiKey = "AIzaSyDiaCC3dAZS8ZiDU1uF8YfEu9PoWy8YLoA" // Replace with your actual API key
​
  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])
​
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
​
  // Prepare conversation history for context
  const prepareConversationHistory = () => {
    // Get last 5 messages for context (or fewer if there aren't 5)
    return messages.slice(-5).map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));
  };
​
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
​
    const userMessage: Message = {
      role: "user",
      content: input,
    }
​
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
​
    try {
      // Get conversation history for context
      const history = prepareConversationHistory();
      
      // Gemini doesn't support system roles, so we'll use a user message for instructions
      const instructionMessage = {
        role: "user",
        parts: [{ 
          text: `Instructions for the assistant: You are EduPlay Assistant, an educational AI designed to help students learn. 
          When answering questions:
          1. Use clear, age-appropriate language
          2. Break down complex concepts into simpler parts
          3. Use examples and analogies to illustrate points
          4. Provide context for why information is important
          5. Encourage critical thinking by asking thoughtful follow-up questions
          6. Maintain a friendly, encouraging tone
          7. If appropriate, suggest related topics to explore further
          8. Keep answers concise but informative
          Always respond as if explaining to a student who is eager to learn.
          
          Now, please respond to this question: ${input}`
        }]
      };
      
      // Request body with educational prompt guidance
      const requestBody = {
        contents: [instructionMessage],
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 1024,
        }
      }
​
      // Make API request
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody),
      })
​
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        const errorText = errorData ? JSON.stringify(errorData) : await response.text()
        throw new Error(`Failed to get response: ${response.status} ${response.statusText}. ${errorText}`)
      }
​
      const data = await response.json()
      console.log("API Response:", data) // Log the response for debugging
      
      // Extract the assistant's response from the API response with updated path
      let assistantResponse = "Sorry, I couldn't generate a response."
      
      if (data.candidates && 
          data.candidates[0] && 
          data.candidates[0].content && 
          data.candidates[0].content.parts && 
          data.candidates[0].content.parts[0] &&
          data.candidates[0].content.parts[0].text) {
        assistantResponse = data.candidates[0].content.parts[0].text
      }
​
      const assistantMessage: Message = {
        role: "assistant",
        content: assistantResponse,
      }
​
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error: any) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Sorry, I encountered an error: ${error.message || "Unknown error"}. Please try again later.`,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }
​
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            EduPlay Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[60vh] overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <Avatar
                    className={`h-8 w-8 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {message.role === "user" ? <User className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
                  </Avatar>
                  <div
                    className={`rounded-lg p-3 ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    {message.content.split("\n").map((line, i) => (
                      <p key={i} className={i > 0 ? "mt-2" : ""}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[80%]">
                  <Avatar className="h-8 w-8 bg-secondary text-secondary-foreground">
                    <MessageSquare className="h-5 w-5" />
                  </Avatar>
                  <div className="rounded-lg p-3 bg-muted">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 rounded-full bg-current animate-bounce" />
                      <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
                      <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="border-t p-4 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}