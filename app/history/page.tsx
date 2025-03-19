"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, BookOpen, Calendar } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { getUserActivities } from "@/lib/user-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Activity {
  _id: string
  userId: string
  type: "quiz" | "game"
  subject?: string
  topic?: string
  score?: number
  totalQuestions?: number
  timeSpent: number
  timestamp: Date
}

export default function HistoryPage() {
  const { user, loading } = useAuth()
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      if (user) {
        try {
          const data = await getUserActivities(20) // Get up to 20 activities
          setActivities(data || [])
        } catch (error) {
          console.error("Error fetching activities:", error)
        } finally {
          setIsLoading(false)
        }
      } else if (!loading) {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchActivities()
    }
  }, [user, loading])

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // If not logged in, show login prompt
  if (!loading && !user) {
    return (
      <div className="container py-12 md:py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4">Sign in to view your history</h1>
          <p className="text-muted-foreground mb-8">
            Track your progress, view your activities, and continue your learning journey.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/signup">Create Account</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="container py-12 md:py-20 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="container py-12 md:py-20">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary p-8 mb-12">
          <div className="absolute inset-0 pattern-dots opacity-10"></div>
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 gradient-text from-primary via-purple-500 to-pink-500">
              Learning History
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Track your learning journey and see your progress over time.
            </p>
          </div>
        </div>

        {activities.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Your Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity._id}
                    className="p-4 border rounded-lg flex justify-between items-center hover:bg-secondary/20 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        {activity.type === "quiz" ? (
                          <BookOpen className="h-4 w-4 text-primary" />
                        ) : (
                          <Clock className="h-4 w-4 text-primary" />
                        )}
                        <span className="font-medium">
                          {activity.type === "quiz" ? "Quiz" : "Game"}: {activity.subject || "General"}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {activity.topic && <span>Topic: {activity.topic}</span>}
                        {activity.score !== undefined && activity.totalQuestions && (
                          <span className="ml-2">
                            Score: {activity.score}/{activity.totalQuestions}
                          </span>
                        )}
                        <span className="ml-2">
                          Time: {Math.floor(activity.timeSpent / 60)}m {activity.timeSpent % 60}s
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{formatDate(activity.timestamp.toString())}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="p-8 rounded-xl bg-secondary/30 border border-secondary text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No Activities Yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start exploring subjects and completing activities to build your learning history.
            </p>
            <Button asChild>
              <Link href="/subjects">
                <BookOpen className="mr-2 h-4 w-4" />
                Explore Subjects
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
