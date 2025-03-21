"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { QuizEngine } from "@/components/quiz-engine"
import { useAuth } from "@/contexts/auth-context"

// This would typically come from a database or API
const topicsData = {
  math: {
    counting: {
      title: "Counting & Numbers",
      description: "Learn to count and recognize numbers",
      subject: "Mathematics",
      subjectSlug: "math",
      subjectColor: "bg-math",
      level: "Beginner",
      ageRange: "3-5",
    },
    addition: {
      title: "Addition",
      description: "Master the basics of adding numbers",
      subject: "Mathematics",
      subjectSlug: "math",
      subjectColor: "bg-math",
      level: "Beginner",
      ageRange: "5-7",
    },
    subtraction: {
      title: "Subtraction",
      description: "Learn how to subtract numbers",
      subject: "Mathematics",
      subjectSlug: "math",
      subjectColor: "bg-math",
      level: "Beginner",
      ageRange: "5-7",
    },
    multiplication: {
      title: "Multiplication",
      description: "Multiply numbers and learn times tables",
      subject: "Mathematics",
      subjectSlug: "math",
      subjectColor: "bg-math",
      level: "Intermediate",
      ageRange: "7-9",
    },
    division: {
      title: "Division",
      description: "Understand division concepts",
      subject: "Mathematics",
      subjectSlug: "math",
      subjectColor: "bg-math",
      level: "Intermediate",
      ageRange: "7-9",
    },
  },
  science: {
    animals: {
      title: "Animals & Habitats",
      description: "Learn about different animals and where they live",
      subject: "Science",
      subjectSlug: "science",
      subjectColor: "bg-science",
      level: "Beginner",
      ageRange: "3-6",
    },
    plants: {
      title: "Plants & Growth",
      description: "Discover how plants grow and thrive",
      subject: "Science",
      subjectSlug: "science",
      subjectColor: "bg-science",
      level: "Beginner",
      ageRange: "5-8",
    },
    weather: {
      title: "Weather & Seasons",
      description: "Explore different weather patterns and seasons",
      subject: "Science",
      subjectSlug: "science",
      subjectColor: "bg-science",
      level: "Beginner",
      ageRange: "6-9",
    },
    solar_system: {
      title: "Solar System",
      description: "Learn about planets and space",
      subject: "Science",
      subjectSlug: "science",
      subjectColor: "bg-science",
      level: "Intermediate",
      ageRange: "7-10",
    },
  },
  reading: {
    alphabet: {
      title: "Alphabet Recognition",
      description: "Learn letters and their sounds",
      subject: "Reading",
      subjectSlug: "reading",
      subjectColor: "bg-reading",
      level: "Beginner",
      ageRange: "3-5",
    },
    phonics: {
      title: "Phonics",
      description: "Connect letters with their sounds",
      subject: "Reading",
      subjectSlug: "reading",
      subjectColor: "bg-reading",
      level: "Beginner",
      ageRange: "4-6",
    },
    sight_words: {
      title: "Sight Words",
      description: "Learn common words by sight",
      subject: "Reading",
      subjectSlug: "reading",
      subjectColor: "bg-reading",
      level: "Beginner",
      ageRange: "5-7",
    },
    comprehension: {
      title: "Reading Comprehension",
      description: "Understand what you read",
      subject: "Reading",
      subjectSlug: "reading",
      subjectColor: "bg-reading",
      level: "Intermediate",
      ageRange: "7-10",
    },
  },
  coding: {
    basics: {
      title: "Coding Basics",
      description: "Introduction to coding concepts",
      subject: "Coding",
      subjectSlug: "coding",
      subjectColor: "bg-coding",
      level: "Beginner",
      ageRange: "5-7",
    },
    sequences: {
      title: "Sequences",
      description: "Learn about sequences and algorithms",
      subject: "Coding",
      subjectSlug: "coding",
      subjectColor: "bg-coding",
      level: "Beginner",
      ageRange: "6-8",
    },
    loops: {
      title: "Loops",
      description: "Discover how loops work in programming",
      subject: "Coding",
      subjectSlug: "coding",
      subjectColor: "bg-coding",
      level: "Intermediate",
      ageRange: "7-9",
    },
    conditionals: {
      title: "Conditionals",
      description: "Learn about if-then statements and logic",
      subject: "Coding",
      subjectSlug: "coding",
      subjectColor: "bg-coding",
      level: "Intermediate",
      ageRange: "8-10",
    },
  },
  // Other subjects...
}

interface Question {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  id?: string
}

interface LearningHistory {
  _id?: string
  userId?: string
  subject: string
  topic: string
  content: string
  lastAccessed?: Date
  accessCount?: number
  difficulty?: string
}

export default function TopicPage({ params }: { params: { subject: string; topic: string } }) {
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [educationalContent, setEducationalContent] = useState("")
  const [previousContent, setPreviousContent] = useState<LearningHistory | null>(null)
  const [readingComplete, setReadingComplete] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [timeLimit, setTimeLimit] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activityStartTime, setActivityStartTime] = useState<number>(0)

  useEffect(() => {
    setMounted(true)
    // Start tracking time spent on this page
    setActivityStartTime(Date.now())

    // Log activity when component unmounts
    return () => {
      if (user && activityStartTime > 0) {
        const timeSpent = Math.floor((Date.now() - activityStartTime) / 1000) // Convert to seconds
        logActivity("subject", timeSpent)
      }
    }
  }, [])

  // Check if the subject and topic exist in our data
  if (
    mounted &&
    (!topicsData[params.subject as keyof typeof topicsData] ||
      !topicsData[params.subject as keyof typeof topicsData][params.topic as any])
  ) {
    notFound()
  }

  // Log activity function
  const logActivity = async (type: string, timeSpent: number) => {
    if (!user) return

    try {
      await fetch("/api/user/activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          activity: {
            type,
            subject: params.subject,
            topic: params.topic,
            timeSpent,
          },
        }),
      })
    } catch (error) {
      console.error("Error logging activity:", error)
    }
  }

  // Store learning history
  const storeLearningHistory = async (content: string, difficulty = "beginner") => {
    if (!user) return

    try {
      await fetch("/api/user/learning-history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: params.subject,
          topic: params.topic,
          content,
          difficulty,
        }),
      })
    } catch (error) {
      console.error("Error storing learning history:", error)
    }
  }

  // Get previous learning history
  const getPreviousLearningHistory = async () => {
    if (!user) return null

    try {
      const response = await fetch(`/api/user/learning-history?subject=${params.subject}&topic=${params.topic}`)
      const data = await response.json()

      if (data.exists) {
        return data.history
      }
      return null
    } catch (error) {
      console.error("Error getting learning history:", error)
      return null
    }
  }

  // Generate educational content and questions
  useEffect(() => {
    if (!mounted) return

    const generateContent = async () => {
      setLoading(true)
      setError(null)

      try {
        const topicData = topicsData[params.subject as keyof typeof topicsData][params.topic as any]

        // Get previous learning history
        const history = await getPreviousLearningHistory()
        setPreviousContent(history)

        // Generate educational content based on previous history
        let content = ""

        if (history && history.accessCount && history.accessCount > 1) {
          // User has studied this before, generate content that builds on previous knowledge
          const previousSummary = history.content.substring(0, 200) + "..."

          content = await generateContentWithGemini(
            topicData.title,
            topicData.subject,
            topicData.ageRange,
            true,
            previousSummary,
            history.accessCount,
          )
        } else {
          // First time studying this topic
          content = await generateContentWithGemini(topicData.title, topicData.subject, topicData.ageRange, false)
        }

        setEducationalContent(content)

        // Store the content in learning history
        await storeLearningHistory(content, topicData.level.toLowerCase())

        // Generate quiz questions
        const generatedQuestions = await generateQuestionsWithGemini(
          topicData.title,
          topicData.subject,
          topicData.ageRange,
          topicData.level,
          10, // Generate 10 questions
        )

        // Add unique IDs to questions
        const questionsWithIds = generatedQuestions.map((q, index) => ({
          ...q,
          id: `${params.subject}-${params.topic}-${Date.now()}-${index}`,
        }))

        setQuestions(questionsWithIds)

        // Determine appropriate time limit based on difficulty and number of questions
        let recommendedTime = 0
        if (topicData.level === "Beginner") {
          recommendedTime = 120 // 2 minutes for beginners
        } else if (topicData.level === "Intermediate") {
          recommendedTime = 180 // 3 minutes for intermediate
        } else {
          recommendedTime = 240 // 4 minutes for advanced
        }

        // Add 30 seconds per question
        recommendedTime += questionsWithIds.length * 30

        setTimeLimit(recommendedTime)
        setTimeRemaining(recommendedTime)
      } catch (err) {
        console.error("Error generating content:", err)
        setError("Failed to generate content. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    generateContent()
  }, [mounted, params.subject, params.topic, user])

  // Generate content with Gemini API
  const generateContentWithGemini = async (
    title: string,
    subject: string,
    ageRange: string,
    isReturningUser = false,
    previousContent = "",
    accessCount = 0,
  ) => {
    try {
      let prompt = ""

      if (isReturningUser) {
        prompt = `
        Create an educational lesson about "${title}" for ${subject}.
        This is for children aged ${ageRange} who have already studied this topic ${accessCount} times.
        
        Their previous lesson covered:
        ${previousContent}
        
        Write a more advanced lesson that:
        1. Briefly summarizes what they learned before (2-3 lines)
        2. Introduces new, more advanced concepts on the same topic
        3. Provides more complex examples and applications
        4. Uses language appropriate for the age range but assumes prior knowledge
        5. Is about 3-4 paragraphs long (300-500 words)
        
        Format the content with proper paragraphs and make it visually readable.
      `
      } else {
        prompt = `
        Create an educational lesson about "${title}" for ${subject}.
        This is for children aged ${ageRange}.
        
        Write a comprehensive but engaging explanation that:
        1. Introduces the topic in a child-friendly way
        2. Explains key concepts clearly with examples
        3. Uses simple language appropriate for the age range
        4. Includes some interesting facts that children would find engaging
        5. Is about 3-4 paragraphs long (300-500 words)
        
        Format the content with proper paragraphs and make it visually readable.
      `
      }

      // Call Gemini API directly using the Gemini API library
      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error(`Failed to generate content: ${response.status}`)
      }

      const data = await response.json()
      return data.content || "Unable to generate content at this time. Please try again later."
    } catch (error) {
      console.error("Error generating content with Gemini:", error)

      // Return fallback content
      return isReturningUser
        ? `
        Welcome back to our lesson on ${title}!
        
        Last time, we covered the basics of ${title}. You learned about the fundamental concepts of this topic and how they apply to everyday situations.
        
        Today, we'll build on that knowledge and explore more advanced concepts. Let's dive deeper into ${title} and discover new examples and applications.
        
        Remember to take your time and enjoy the learning process. If you have any questions, feel free to use our chatbot for additional help!
      `
        : `
        Welcome to our lesson on ${title}!
        
        ${title} is an important topic in ${subject} that will help you understand many other concepts. This lesson will introduce you to the key ideas and give you a solid foundation.
        
        We'll start with the basics and then explore some fun examples together. By the end of this lesson, you'll have a good understanding of ${title} and be ready to tackle more complex ideas.
        
        Let's begin our exploration of ${title} together. Remember, learning is an adventure!
      `
    }
  }

  // Generate questions with Gemini API
  const generateQuestionsWithGemini = async (
    title: string,
    subject: string,
    ageRange: string,
    level: string,
    count = 10,
  ): Promise<Question[]> => {
    try {
      const prompt = `
        Create ${count} multiple-choice quiz questions about "${title}" for ${subject}.
        These questions are for children aged ${ageRange} with ${level} level knowledge.
        
        Each question must have:
        - A clear question text
        - Four answer choices
        - The index of the correct answer (0-3)
        - A brief explanation of why the answer is correct
        
        Return ONLY valid JSON formatted like this:
        [
          {
            "question": "What is 2 + 2?",
            "options": ["3", "4", "5", "6"],
            "correctAnswer": 1,
            "explanation": "2 + 2 equals 4."
          }
        ]
      `

      // Call Gemini API
      const response = await fetch("/api/gemini/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error(`Failed to generate questions: ${response.status}`)
      }

      const data = await response.json()

      if (!data.questions || !Array.isArray(data.questions)) {
        throw new Error("Invalid questions format in API response")
      }

      return data.questions
    } catch (error) {
      console.error("Error generating questions with Gemini:", error)

      // Return fallback questions
      return [
        {
          question: `What is ${title} about?`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: 0,
          explanation: "This is a sample explanation for the correct answer.",
        },
        {
          question: `Why is ${title} important?`,
          options: ["Option 1", "Option 2", "Option 3", "Option 4"],
          correctAnswer: 1,
          explanation: "This is another sample explanation.",
        },
        {
          question: `How can we use ${title} in real life?`,
          options: ["First choice", "Second choice", "Third choice", "Fourth choice"],
          correctAnswer: 2,
          explanation: "This is a third sample explanation.",
        },
      ]
    }
  }

  // Timer effect
  useEffect(() => {
    if (timerActive && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timerActive && timeRemaining === 0) {
      // Time's up
      setTimerActive(false)
    }
  }, [timerActive, timeRemaining])

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const startQuiz = () => {
    setReadingComplete(true)
    setTimerActive(true)

    // Log activity when starting quiz
    if (user && activityStartTime > 0) {
      const timeSpent = Math.floor((Date.now() - activityStartTime) / 1000) // Convert to seconds
      logActivity("quiz", timeSpent)
    }
  }

  const topicData = topicsData[params.subject as keyof typeof topicsData]?.[params.topic as any]

  if (!mounted) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <span className="ml-3 text-muted-foreground">Loading...</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <span className="ml-3 text-muted-foreground">Generating educational content...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-red-500 mb-4">⚠️ {error}</div>
        <Button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-12 md:py-20">
      <div className="mb-8">
        <Link
          href={`/subjects/${params.subject}`}
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to {topicData?.subject}
        </Link>

        <div className="relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary p-8 mb-12">
          <div className="absolute inset-0 pattern-dots opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${topicData?.subjectColor} text-white`}>
                {topicData?.level}
              </div>
              <div className="text-xs text-muted-foreground">Ages {topicData?.ageRange}</div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{topicData?.title}</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">{topicData?.description}</p>
          </div>
        </div>

        {!readingComplete ? (
          <div className="p-6 rounded-xl bg-secondary/30 border border-secondary">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Educational Content</h2>

              {previousContent && previousContent.accessCount && previousContent.accessCount > 1 && (
                <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-start gap-3">
                    <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium text-primary">Welcome Back!</h3>
                      <p className="text-sm text-muted-foreground">
                        You've studied this topic {previousContent.accessCount} times before. This lesson builds on your
                        previous knowledge.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="prose prose-sm dark:prose-invert max-w-none">
                {educationalContent.split("\n\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={startQuiz} className={`${topicData?.subjectColor} text-white`}>
                I've Read This - Start Quiz
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium text-muted-foreground">Timed Quiz: {questions.length} questions</div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <div className={`text-sm font-medium ${timeRemaining < 30 ? "text-red-500" : ""}`}>
                  Time Remaining: {formatTime(timeRemaining)}
                </div>
              </div>
            </div>

            <Progress value={(timeRemaining / timeLimit) * 100} className="h-1.5 bg-secondary" />

            {timerActive ? (
              <QuizEngine
                questions={questions}
                subjectColor={topicData?.subjectColor || "bg-primary"}
                subject={params.subject}
                topic={params.topic}
                timeLimit={timeLimit}
                difficulty={topicData?.level.toLowerCase()}
                onComplete={(score, total) => {
                  setTimerActive(false)
                  // Log quiz completion
                  if (user) {
                    logActivity("quiz", timeLimit - timeRemaining)
                  }
                }}
              />
            ) : timeRemaining === 0 ? (
              <div className="p-8 rounded-xl bg-secondary/30 border border-secondary text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Time's Up!</h2>
                <p className="text-muted-foreground mb-6">
                  You've run out of time for this quiz. Would you like to try again?
                </p>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}

