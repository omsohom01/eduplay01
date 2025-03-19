"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Loader2, Youtube } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { useAuth } from "@/contexts/auth-context"

// Initialize the Gemini API
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyDiaCC3dAZS8ZiDU1uF8YfEu9PoWy8YLoA"
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

// YouTube API key - you'll need to add this to your environment variables
const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || ""

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  videos?: YouTubeVideo[]
  timestamp: Date
}

interface YouTubeVideo {
  id: string
  title: string
  channelTitle: string
  description: string
  thumbnailUrl: string
  publishedAt: string
}

export default function VideoSearchPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I can help you find educational videos on any topic. What would you like to learn about today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Update the searchYouTubeVideos function to search for kid-friendly content
  const searchYouTubeVideos = async (query: string): Promise<YouTubeVideo[]> => {
    try {
      if (!YOUTUBE_API_KEY) {
        console.error("YouTube API key is missing")
        return []
      }

      // Add "for kids" to the search query to get more kid-friendly results
      const kidFriendlyQuery = `${query} for kids educational`

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(
          kidFriendlyQuery,
        )}&type=video&key=${YOUTUBE_API_KEY}`,
      )

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`)
      }

      const data = await response.json()

      return data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        description: item.snippet.description,
        thumbnailUrl: item.snippet.thumbnails.medium.url,
        publishedAt: item.snippet.publishedAt,
      }))
    } catch (error) {
      console.error("Error searching YouTube:", error)
      return []
    }
  }

  // Update the rankVideosWithAI function to prioritize kid-friendly content
  const rankVideosWithAI = async (query: string, videos: YouTubeVideo[]): Promise<YouTubeVideo[]> => {
    try {
      if (videos.length === 0) return []

      // Create a prompt for the AI to rank the videos
      const prompt = `
        I'm looking for the best educational videos about "${query}" specifically for children.
        Here are some videos I found. Please rank them from most to least relevant for children's learning.
        Consider factors like:
        1. Child-friendliness (appropriate for kids)
        2. Educational value for children
        3. Engagement level for young learners
        4. Clarity and simplicity of explanation
      
        Videos:
        ${videos
          .map(
            (video, index) => `
        Video ${index + 1}:
        Title: ${video.title}
        Channel: ${video.channelTitle}
        Description: ${video.description}
      `,
          )
          .join("\n")}
      
      Return ONLY the ranked list of video indices (e.g., [3, 1, 5, 2, 4]) with the most kid-friendly and educational video first.
    `

      const result = await model.generateContent(prompt)
      const responseText = result.response.text()

      // Extract the ranked indices from the response
      const indexMatch = responseText.match(/\[[\d,\s]+\]/)
      if (!indexMatch) return videos.slice(0, 3) // Return first 3 if no ranking found

      const rankedIndices = JSON.parse(indexMatch[0])

      // Reorder videos based on AI ranking
      const rankedVideos: YouTubeVideo[] = []
      for (const idx of rankedIndices) {
        if (videos[idx - 1]) {
          rankedVideos.push(videos[idx - 1])
        }
      }

      // Add any videos that weren't ranked
      const rankedIds = new Set(rankedVideos.map((v) => v.id))
      const unrankedVideos = videos.filter((v) => !rankedIds.has(v.id))

      // Return only the top 3 videos
      return [...rankedVideos, ...unrankedVideos].slice(0, 3)
    } catch (error) {
      console.error("Error ranking videos with AI:", error)
      return videos.slice(0, 3) // Return first 3 if ranking fails
    }
  }

  // Update the generateResponse function to specify kid-friendly content
  const generateResponse = async (query: string, videos: YouTubeVideo[]): Promise<string> => {
    try {
      if (videos.length === 0) {
        return "I couldn't find any videos on that topic. Please try a different search term."
      }

      const prompt = `
      The user is looking for educational videos about "${query}" for children.
      I found ${videos.length} kid-friendly educational videos on this topic.
      
      Write a helpful, friendly response that:
      1. Acknowledges their search query
      2. Mentions these are specifically selected for kids
      3. Encourages them to check out the videos below
      4. Suggests they can ask for more specific videos if needed
      
      Keep it concise (2-3 sentences) and friendly, as if speaking to a parent or teacher helping a child.
    `

      const result = await model.generateContent(prompt)
      return result.response.text().trim()
    } catch (error) {
      console.error("Error generating AI response:", error)
      return "Here are some kid-friendly videos I found on that topic. I hope they're helpful for your child's learning!"
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Search for videos
      const videos = await searchYouTubeVideos(input)

      // Rank videos with AI
      const rankedVideos = await rankVideosWithAI(input, videos)

      // Generate AI response
      const responseText = await generateResponse(input, rankedVideos)

      // Add assistant message with videos
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseText,
        videos: rankedVideos,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error in chat flow:", error)

      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I encountered an error while searching for videos. Please try again later.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
            <Youtube className="h-3.5 w-3.5 mr-1.5" />
            <span>Video Search</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight gradient-text from-primary via-purple-500 to-pink-500 mb-4">
            Educational Video Search
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ask me to find educational videos on any topic. I'll search YouTube and show you the best results.
          </p>
        </div>

        {/* Chat container */}
        <div className="border rounded-xl overflow-hidden bg-background shadow-sm">
          {/* Messages area */}
          <div className="h-[600px] overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <Avatar className={message.role === "assistant" ? "bg-primary/10" : "bg-secondary"}>
                    <AvatarFallback>
                      {message.role === "assistant" ? "AI" : user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`rounded-lg p-4 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>

                    {/* Video results */}
                    {message.videos && message.videos.length > 0 && (
                      <div className="mt-4">
                        <div className="grid grid-cols-1 gap-4">
                          {message.videos.map((video) => (
                            <div key={video.id} className="rounded-lg overflow-hidden bg-background shadow-sm">
                              <div className="flex flex-col md:flex-row">
                                <div className="md:w-1/2 aspect-video">
                                  <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${video.id}`}
                                    title={video.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  ></iframe>
                                </div>
                                <div className="p-4 md:w-1/2 flex flex-col">
                                  <h4 className="font-medium text-base">{video.title}</h4>
                                  <p className="text-sm text-muted-foreground mt-1">{video.channelTitle}</p>
                                  <p className="text-xs text-muted-foreground mt-2 line-clamp-3">{video.description}</p>
                                  <div className="mt-auto pt-2">
                                    <a
                                      href={`https://www.youtube.com/watch?v=${video.id}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-primary hover:underline"
                                    >
                                      Watch on YouTube
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3">
                  <Avatar className="bg-primary/10">
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg p-4 bg-secondary text-secondary-foreground">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <p>Searching for videos...</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me to find videos on any topic..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>Powered by YouTube and Gemini AI. Results are based on YouTube's search algorithm and may vary.</p>
        </div>
      </div>
    </div>
  )
}
