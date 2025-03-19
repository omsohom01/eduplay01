"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Calculator,
  Clock,
  Code,
  FlaskRoundIcon as Flask,
  Trophy,
  Award,
  Music,
  Palette,
  Globe,
  Brain,
  Film,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { getUserData, type UserProgress, type UserStats } from "@/lib/user-service"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Subject icons mapping
const subjectIcons: Record<string, React.ReactNode> = {
  math: <Calculator className="h-5 w-5 text-math" />,
  science: <Flask className="h-5 w-5 text-science" />,
  reading: <BookOpen className="h-5 w-5 text-reading" />,
  coding: <Code className="h-5 w-5 text-coding" />,
  art: <Palette className="h-5 w-5 text-art" />,
  music: <Music className="h-5 w-5 text-music" />,
  geography: <Globe className="h-5 w-5 text-geography" />,
  logic: <Brain className="h-5 w-5 text-logic" />,
  movies: <Film className="h-5 w-5 text-primary" />,
  c_programming: <Code className="h-5 w-5 text-coding" />,
  python: <Code className="h-5 w-5 text-coding" />,
  java: <Code className="h-5 w-5 text-coding" />,
}

// Subject colors mapping
const subjectColors: Record<string, string> = {
  math: "#4F46E5",
  science: "#10B981",
  reading: "#EC4899",
  coding: "#F59E0B",
  art: "#C026D3",
  music: "#F59E0B",
  geography: "#06B6D4",
  logic: "#8B5CF6",
  movies: "#8B5CF6",
  c_programming: "#3B82F6",
  python: "#10B981",
  java: "#F97316",
}

// Subject names mapping
const subjectNames: Record<string, string> = {
  math: "Mathematics",
  science: "Science",
  reading: "Reading",
  coding: "Coding",
  art: "Art",
  music: "Music",
  geography: "Geography",
  logic: "Logic",
  movies: "Movies",
  c_programming: "C Programming",
  python: "Python",
  java: "Java",
}

// Enhanced pie chart with animations
const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const sx = cx + (outerRadius + 10) * cos
  const sy = cy + (outerRadius + 10) * sin
  const mx = cx + (outerRadius + 30) * cos
  const my = cy + (outerRadius + 30) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 22
  const ey = my
  const textAnchor = cos >= 0 ? "start" : "end"

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-sm font-medium">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#999"
        className="text-xs"
      >{`${value}%`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" className="text-xs">
        {`(${(percent * 100).toFixed(0)}%)`}
      </text>
    </g>
  )
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const [userData, setUserData] = useState<{
    progress: UserProgress
    stats: UserStats
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const data = await getUserData(user.id)
          if (data) {
            setUserData({
              progress: data.progress || {},
              stats: data.stats || {},
            })
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
        } finally {
          setIsLoading(false)
        }
      } else if (!loading) {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchUserData()
    }
  }, [user, loading])

  // If not logged in, show login prompt
  if (!loading && !user) {
    return (
      <div className="container py-12 md:py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4">Sign in to view your dashboard</h1>
          <p className="text-muted-foreground mb-8">
            Track your progress, view your achievements, and continue your learning journey.
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

  // Get user's subject progress
  const subjectProgress = userData?.progress || {
    math: 0,
    science: 0,
    reading: 0,
    coding: 0,
    art: 0,
    music: 0,
    geography: 0,
    logic: 0,
    movies: 0,
    c_programming: 0,
    python: 0,
    java: 0,
  }

  // Prepare data for pie chart
  const chartData = Object.entries(subjectProgress)
    .filter(([_, value]) => value > 0) // Only include subjects with progress
    .map(([key, value]) => ({
      name: subjectNames[key as keyof typeof subjectNames] || key,
      value,
      color: subjectColors[key as keyof typeof subjectColors] || "#8B5CF6",
    }))

  // Replace the recentActivities section with this more accurate version
  // Get user's recent activities based on actual progress
  const recentActivities = Object.entries(subjectProgress)
    .filter(([_, value]) => value > 0) // Only show subjects with progress
    .map(([key, value]) => {
      const subjectKey = key as keyof typeof subjectNames
      return {
        id:
          key === "math"
            ? "counting"
            : key === "reading"
              ? "alphabet"
              : key === "science"
                ? "animals"
                : key === "coding"
                  ? "basics"
                  : "intro",
        title:
          key === "math"
            ? "Counting & Numbers"
            : key === "reading"
              ? "Alphabet Recognition"
              : key === "science"
                ? "Animals & Habitats"
                : key === "coding"
                  ? "Coding Basics"
                  : `${subjectNames[subjectKey]} Basics`,
        subject: subjectNames[subjectKey] || key,
        subjectSlug: key,
        subjectColor: `bg-${key}`,
        lastPlayed: "Recently",
        progress: Math.min(value, 100),
      }
    })
    .slice(0, 3) // Show top 3 activities

  // If no activities, show empty state
  const hasActivities = recentActivities.length > 0

  // Calculate achievements based on user stats
  const achievements = [
    {
      title: "Math Explorer",
      description: "Started learning mathematics",
      icon: Calculator,
      color: "text-math",
      bgColor: "bg-math/10",
      earned: userData?.progress?.math ? userData.progress.math > 0 : false,
    },
    {
      title: "Reading Beginner",
      description: "Started reading activities",
      icon: BookOpen,
      color: "text-reading",
      bgColor: "bg-reading/10",
      earned: userData?.progress?.reading ? userData.progress.reading > 0 : false,
    },
    {
      title: "Science Curious",
      description: "Explored science topics",
      icon: Flask,
      color: "text-science",
      bgColor: "bg-science/10",
      earned: userData?.progress?.science ? userData.progress.science > 0 : false,
    },
    {
      title: "Coding Enthusiast",
      description: "Started coding journey",
      icon: Code,
      color: "text-coding",
      bgColor: "bg-coding/10",
      earned: userData?.progress?.coding ? userData.progress.coding > 0 : false,
    },
  ]

  // Recommended topics based on user progress
  const recommendedTopics = [
    {
      id: "addition",
      title: "Addition",
      subject: "Mathematics",
      subjectSlug: "math",
      level: "Beginner",
      ageRange: "5-7",
      questionsCount: 15,
    },
    {
      id: "phonics",
      title: "Phonics",
      subject: "Reading",
      subjectSlug: "reading",
      level: "Beginner",
      ageRange: "4-6",
      questionsCount: 15,
    },
    {
      id: "plants",
      title: "Plants & Growth",
      subject: "Science",
      subjectSlug: "science",
      level: "Beginner",
      ageRange: "5-8",
      questionsCount: 12,
    },
  ]

  // Calculate total achievements earned
  const achievementsEarned = achievements.filter((a) => a.earned).length

  // Format time display
  const formatTime = (seconds: number) => {
    if (!seconds || seconds <= 0) return "0h 0m"
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="container py-12 md:py-20">
      <div className="relative mb-12 pb-12 border-b">
        <div className="absolute inset-0 pattern-dots opacity-10"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight gradient-text from-primary via-purple-500 to-pink-500">
              {user?.name ? `${user.name}'s Dashboard` : "Dashboard"}
            </h1>
            <p className="text-xl text-muted-foreground">Track your progress and continue your learning journey</p>
          </div>
          <Button
            asChild
            className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
          >
            <Link href="/subjects">
              Explore Subjects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="group relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary p-6 transition-all duration-300 hover:bg-secondary/50">
          <div className="absolute -inset-px bg-gradient-to-r from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/10 rounded-xl transition-all duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Total Learning Time</h3>
                <p className="text-muted-foreground text-sm">All time</p>
              </div>
            </div>

            <div className="text-3xl font-bold">{formatTime(userData?.stats?.totalTimeSpent || 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">Time spent on completed activities</p>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary p-6 transition-all duration-300 hover:bg-secondary/50">
          <div className="absolute -inset-px bg-gradient-to-r from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/10 rounded-xl transition-all duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Activities Completed</h3>
                <p className="text-muted-foreground text-sm">All time</p>
              </div>
            </div>
            <div className="text-3xl font-bold">{userData?.stats?.totalQuizzesTaken || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Complete more activities to learn!</p>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary p-6 transition-all duration-300 hover:bg-secondary/50">
          <div className="absolute -inset-px bg-gradient-to-r from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/10 rounded-xl transition-all duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Achievements</h3>
                <p className="text-muted-foreground text-sm">Total earned</p>
              </div>
            </div>
            <div className="text-3xl font-bold">{achievementsEarned}</div>
            <p className="text-xs text-muted-foreground mt-1">Earn more by exploring subjects!</p>
          </div>
        </div>
      </div>

      {/* Subject Progress Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Subject Progress</CardTitle>
            <CardDescription>Your learning progress across all subjects</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    animationBegin={0}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value}%`, name]}
                    contentStyle={{
                      backgroundColor: "rgba(23, 23, 23, 0.8)",
                      borderRadius: "8px",
                      border: "none",
                      color: "white",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-muted-foreground">
                <p>No progress data yet</p>
                <p className="text-sm">Complete activities to see your progress</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <div className="relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary p-6">
            <div className="absolute inset-0 pattern-diagonal opacity-5"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Recent Activities</h2>
                <Button variant="ghost" size="sm" asChild className="text-sm">
                  <Link href="/history">
                    View All
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>

              <div className="space-y-4">
                {hasActivities ? (
                  recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="group relative overflow-hidden rounded-lg bg-secondary/50 border border-secondary hover:border-primary/50 p-4 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium truncate group-hover:text-primary transition-colors">
                                {activity.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">{activity.subject}</p>
                            </div>
                            <Button asChild size="sm" variant="ghost" className={`${activity.subjectColor} text-white`}>
                              <Link href={`/subjects/${activity.subjectSlug}/topics/${activity.id}`}>Continue</Link>
                            </Button>
                          </div>
                          <div className="mt-2">
                            <Progress value={activity.progress} color={activity.subjectColor} className="h-1.5" />
                            <div className="flex justify-between mt-1">
                              <span className="text-xs text-muted-foreground">{activity.progress}% complete</span>
                              <span className="text-xs text-muted-foreground">
                                {Math.round((100 - activity.progress) / 20)} questions left
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-8 bg-secondary/20 rounded-lg">
                    <p className="text-muted-foreground mb-2">No activities yet</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Start exploring subjects to track your progress
                    </p>
                    <Button asChild size="sm">
                      <Link href="/subjects">
                        Start Learning
                        <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div>
          <div className="relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary p-6 h-full">
            <div className="absolute inset-0 pattern-diagonal opacity-5"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Achievements</h2>
                <Button variant="ghost" size="sm" asChild className="text-sm">
                  <Link href="/achievements">
                    View All
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>

              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-lg bg-secondary/50 border border-secondary hover:border-primary/50 p-4 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full ${achievement.bgColor} flex items-center justify-center ${achievement.earned ? "" : "opacity-50"}`}
                      >
                        <achievement.icon
                          className={`h-5 w-5 ${achievement.color} ${achievement.earned ? "" : "opacity-50"}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-medium truncate ${achievement.earned ? "" : "text-muted-foreground"}`}>
                          {achievement.title}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">{achievement.description}</p>
                      </div>
                      {achievement.earned && <Award className="h-5 w-5 text-yellow-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary p-6">
            <div className="absolute inset-0 pattern-diagonal opacity-5"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Recommended For You</h2>
                <Button variant="ghost" size="sm" asChild className="text-sm">
                  <Link href="/subjects">
                    View All Subjects
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendedTopics.map((topic) => (
                  <Link key={topic.id} href={`/subjects/${topic.subjectSlug}/topics/${topic.id}`} className="group">
                    <div className="relative overflow-hidden rounded-lg bg-secondary/50 border border-secondary hover:border-primary/50 p-4 h-full transition-all duration-300">
                      <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-500/20 text-green-500">
                            {topic.level}
                          </span>
                          <span className="text-xs text-muted-foreground">Ages {topic.ageRange}</span>
                        </div>
                        <h3 className="font-medium group-hover:text-primary transition-colors">{topic.title}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{topic.subject}</p>
                        <div className="mt-auto text-xs text-muted-foreground">{topic.questionsCount} questions</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <Button asChild variant="outline" className="flex items-center gap-2">
              <Link href="/test-your-level">
                <Brain className="h-4 w-4 text-primary" />
                Test Your Knowledge Level
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
