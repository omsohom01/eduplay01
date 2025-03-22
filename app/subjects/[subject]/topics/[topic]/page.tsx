"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { QuizEngine } from "@/components/quiz-engine"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Gemini API
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyDiaCC3dAZS8ZiDU1uF8YfEu9PoWy8YLoA"
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

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
  // New subjects
  music: {
    notes: {
      title: "Musical Notes",
      description: "Learn to read and understand musical notes",
      subject: "Music",
      subjectSlug: "music",
      subjectColor: "bg-music",
      level: "Beginner",
      ageRange: "5-8",
    },
    instruments: {
      title: "Musical Instruments",
      description: "Discover different musical instruments and their sounds",
      subject: "Music",
      subjectSlug: "music",
      subjectColor: "bg-music",
      level: "Beginner",
      ageRange: "4-7",
    },
    rhythm: {
      title: "Rhythm & Beat",
      description: "Understand rhythm patterns and beats in music",
      subject: "Music",
      subjectSlug: "music",
      subjectColor: "bg-music",
      level: "Intermediate",
      ageRange: "6-9",
    },
    composition: {
      title: "Music Composition",
      description: "Learn the basics of creating your own music",
      subject: "Music",
      subjectSlug: "music",
      subjectColor: "bg-music",
      level: "Advanced",
      ageRange: "8-12",
    },
  },
  art: {
    colors: {
      title: "Colors & Mixing",
      description: "Learn about primary colors and how to mix them",
      subject: "Art",
      subjectSlug: "art",
      subjectColor: "bg-art",
      level: "Beginner",
      ageRange: "3-6",
    },
    drawing: {
      title: "Basic Drawing",
      description: "Learn fundamental drawing techniques",
      subject: "Art",
      subjectSlug: "art",
      subjectColor: "bg-art",
      level: "Beginner",
      ageRange: "5-8",
    },
    painting: {
      title: "Painting Techniques",
      description: "Explore different painting styles and methods",
      subject: "Art",
      subjectSlug: "art",
      subjectColor: "bg-art",
      level: "Intermediate",
      ageRange: "7-10",
    },
    art_history: {
      title: "Art History",
      description: "Learn about famous artists and art movements",
      subject: "Art",
      subjectSlug: "art",
      subjectColor: "bg-art",
      level: "Advanced",
      ageRange: "9-12",
    },
  },
  geography: {
    continents: {
      title: "Continents & Oceans",
      description: "Learn about the seven continents and five oceans",
      subject: "Geography",
      subjectSlug: "geography",
      subjectColor: "bg-geography",
      level: "Beginner",
      ageRange: "5-8",
    },
    countries: {
      title: "Countries & Capitals",
      description: "Explore different countries and their capital cities",
      subject: "Geography",
      subjectSlug: "geography",
      subjectColor: "bg-geography",
      level: "Intermediate",
      ageRange: "7-10",
    },
    landforms: {
      title: "Landforms & Features",
      description: "Learn about mountains, rivers, deserts, and other geographical features",
      subject: "Geography",
      subjectSlug: "geography",
      subjectColor: "bg-geography",
      level: "Intermediate",
      ageRange: "8-11",
    },
    climate: {
      title: "Climate Zones",
      description: "Understand different climate types around the world",
      subject: "Geography",
      subjectSlug: "geography",
      subjectColor: "bg-geography",
      level: "Advanced",
      ageRange: "9-12",
    },
  },
  logic: {
    patterns: {
      title: "Patterns & Sequences",
      description: "Identify and continue patterns in shapes, numbers, and objects",
      subject: "Logic",
      subjectSlug: "logic",
      subjectColor: "bg-logic",
      level: "Beginner",
      ageRange: "4-7",
    },
    puzzles: {
      title: "Logic Puzzles",
      description: "Solve fun puzzles that develop critical thinking skills",
      subject: "Logic",
      subjectSlug: "logic",
      subjectColor: "bg-logic",
      level: "Intermediate",
      ageRange: "7-10",
    },
    reasoning: {
      title: "Deductive Reasoning",
      description: "Learn to draw conclusions from given information",
      subject: "Logic",
      subjectSlug: "logic",
      subjectColor: "bg-logic",
      level: "Intermediate",
      ageRange: "8-11",
    },
    problem_solving: {
      title: "Problem Solving",
      description: "Develop strategies to solve complex problems",
      subject: "Logic",
      subjectSlug: "logic",
      subjectColor: "bg-logic",
      level: "Advanced",
      ageRange: "9-12",
    },
  },
  // Programming languages
  c_programming: {
    intro: {
      title: "Introduction to C",
      description: "Learn the basics of C programming language",
      subject: "C Programming",
      subjectSlug: "c_programming",
      subjectColor: "bg-coding",
      level: "Beginner",
      ageRange: "10-12",
    },
    variables: {
      title: "Variables & Data Types",
      description: "Understand different data types and how to use variables in C",
      subject: "C Programming",
      subjectSlug: "c_programming",
      subjectColor: "bg-coding",
      level: "Beginner",
      ageRange: "10-12",
    },
    control_flow: {
      title: "Control Flow",
      description: "Learn about if statements, loops, and switch cases in C",
      subject: "C Programming",
      subjectSlug: "c_programming",
      subjectColor: "bg-coding",
      level: "Intermediate",
      ageRange: "11-12",
    },
    functions: {
      title: "Functions",
      description: "Create and use functions in C programs",
      subject: "C Programming",
      subjectSlug: "c_programming",
      subjectColor: "bg-coding",
      level: "Intermediate",
      ageRange: "11-12",
    },
  },
  python: {
    intro: {
      title: "Introduction to Python",
      description: "Learn the basics of Python programming language",
      subject: "Python",
      subjectSlug: "python",
      subjectColor: "bg-coding",
      level: "Beginner",
      ageRange: "9-12",
    },
    variables: {
      title: "Variables & Data Types",
      description: "Understand different data types and how to use variables in Python",
      subject: "Python",
      subjectSlug: "python",
      subjectColor: "bg-coding",
      level: "Beginner",
      ageRange: "9-12",
    },
    control_flow: {
      title: "Control Flow",
      description: "Learn about if statements, loops, and conditional expressions in Python",
      subject: "Python",
      subjectSlug: "python",
      subjectColor: "bg-coding",
      level: "Intermediate",
      ageRange: "10-12",
    },
    functions: {
      title: "Functions & Modules",
      description: "Create and use functions and modules in Python",
      subject: "Python",
      subjectSlug: "python",
      subjectColor: "bg-coding",
      level: "Intermediate",
      ageRange: "10-12",
    },
  },
  java: {
    intro: {
      title: "Introduction to Java",
      description: "Learn the basics of Java programming language",
      subject: "Java",
      subjectSlug: "java",
      subjectColor: "bg-coding",
      level: "Beginner",
      ageRange: "10-12",
    },
    variables: {
      title: "Variables & Data Types",
      description: "Understand different data types and how to use variables in Java",
      subject: "Java",
      subjectSlug: "java",
      subjectColor: "bg-coding",
      level: "Beginner",
      ageRange: "10-12",
    },
    control_flow: {
      title: "Control Flow",
      description: "Learn about if statements, loops, and switch cases in Java",
      subject: "Java",
      subjectSlug: "java",
      subjectColor: "bg-coding",
      level: "Intermediate",
      ageRange: "11-12",
    },
    classes: {
      title: "Classes & Objects",
      description: "Understand object-oriented programming concepts in Java",
      subject: "Java",
      subjectSlug: "java",
      subjectColor: "bg-coding",
      level: "Advanced",
      ageRange: "11-12",
    },
  },
  movies: {
    film_history: {
      title: "Film History",
      description: "Learn about the evolution of movies from silent films to modern cinema",
      subject: "Movies",
      subjectSlug: "movies",
      subjectColor: "bg-primary",
      level: "Intermediate",
      ageRange: "8-12",
    },
    genres: {
      title: "Movie Genres",
      description: "Explore different types of movies and their characteristics",
      subject: "Movies",
      subjectSlug: "movies",
      subjectColor: "bg-primary",
      level: "Beginner",
      ageRange: "6-10",
    },
    animation: {
      title: "Animation",
      description: "Discover how animated movies are made and their history",
      subject: "Movies",
      subjectSlug: "movies",
      subjectColor: "bg-primary",
      level: "Beginner",
      ageRange: "5-9",
    },
    storytelling: {
      title: "Storytelling in Film",
      description: "Learn how movies tell stories through visuals and sound",
      subject: "Movies",
      subjectSlug: "movies",
      subjectColor: "bg-primary",
      level: "Intermediate",
      ageRange: "8-12",
    },
  },
}

interface Question {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  id?: string
}

export default function TopicPage({ params }: { params: { subject: string; topic: string } }) {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [educationalContent, setEducationalContent] = useState("")
  const [readingComplete, setReadingComplete] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [timeLimit, setTimeLimit] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Check if the subject and topic exist in our data
  if (
    mounted &&
    (!topicsData[params.subject as keyof typeof topicsData] ||
      !topicsData[params.subject as keyof typeof topicsData][params.topic as any])
  ) {
    notFound()
  }

  // Generate educational content and questions
  useEffect(() => {
    if (!mounted) return

    const generateContent = async () => {
      setLoading(true)
      setError(null)

      try {
        const topicData = topicsData[params.subject as keyof typeof topicsData][params.topic as any]

        // Generate educational content
        const contentPrompt = `
          Create an educational lesson about "${topicData.title}" for ${topicData.subject}.
          This is for children aged ${topicData.ageRange}.
          
          Write a comprehensive but engaging explanation that:
          1. Introduces the topic in a child-friendly way
          2. Explains key concepts clearly with examples
          3. Uses simple language appropriate for the age range
          4. Includes some interesting facts that children would find engaging
          5. Is about 3-4 paragraphs long (300-500 words)
          
          Format the content with proper paragraphs and make it visually readable.
        `

        const contentResult = await model.generateContent(contentPrompt)
        const content = contentResult.response.text()
        setEducationalContent(content)

        // Generate quiz questions
        const questionsPrompt = `
          Create 10 multiple-choice quiz questions about "${topicData.title}" for ${topicData.subject}.
          These questions are for children aged ${topicData.ageRange} with ${topicData.level} level knowledge.
          
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

        const questionsResult = await model.generateContent(questionsPrompt)
        let responseText = questionsResult.response.text()

        // Fix: Remove unnecessary formatting
        responseText = responseText.replace(/```json|```/g, "").trim()

        // Parse the JSON
        const parsedQuestions: Question[] = JSON.parse(responseText)

        // Add unique IDs
        const questionsWithIds = parsedQuestions.map((q, index) => ({
          ...q,
          id: `${params.subject}-${params.topic}-${Date.now()}-${index}`,
        }))

        setQuestions(questionsWithIds)

        // Determine appropriate time limit based on difficulty and age
        let recommendedTime = 0
        if (topicData.level === "Beginner") {
          recommendedTime = 120 // 2 minutes for beginners
        } else if (topicData.level === "Intermediate") {
          recommendedTime = 180 // 3 minutes for intermediate
        } else {
          recommendedTime = 240 // 4 minutes for advanced
        }

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
  }, [mounted, params.subject, params.topic])

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
                onComplete={(score, total) => {
                  setTimerActive(false)
                  console.log(`Quiz completed with score ${score}/${total}`)
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