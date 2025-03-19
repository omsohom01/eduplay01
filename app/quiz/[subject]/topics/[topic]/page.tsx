"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, RefreshCw, Zap, Shield, Target, Award, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
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
      description: "Understand multiplication concepts",
      subject: "Mathematics",
      subjectSlug: "math",
      subjectColor: "bg-math",
      level: "Intermediate",
      ageRange: "7-9",
    },
    division: {
      title: "Division",
      description: "Learn how to divide numbers",
      subject: "Mathematics",
      subjectSlug: "math",
      subjectColor: "bg-math",
      level: "Intermediate",
      ageRange: "7-9",
    },
    fractions: {
      title: "Fractions",
      description: "Understand parts of a whole",
      subject: "Mathematics",
      subjectSlug: "math",
      subjectColor: "bg-math",
      level: "Advanced",
      ageRange: "8-10",
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
      description: "Discover how plants grow and change",
      subject: "Science",
      subjectSlug: "science",
      subjectColor: "bg-science",
      level: "Beginner",
      ageRange: "4-7",
    },
    weather: {
      title: "Weather & Seasons",
      description: "Learn about different weather patterns and seasons",
      subject: "Science",
      subjectSlug: "science",
      subjectColor: "bg-science",
      level: "Beginner",
      ageRange: "4-7",
    },
    "human-body": {
      title: "Human Body",
      description: "Explore the amazing human body and how it works",
      subject: "Science",
      subjectSlug: "science",
      subjectColor: "bg-science",
      level: "Intermediate",
      ageRange: "6-9",
    },
    space: {
      title: "Space & Planets",
      description: "Journey through our solar system and beyond",
      subject: "Science",
      subjectSlug: "science",
      subjectColor: "bg-science",
      level: "Intermediate",
      ageRange: "7-10",
    },
    "simple-machines": {
      title: "Simple Machines",
      description: "Learn about levers, pulleys, and other simple machines",
      subject: "Science",
      subjectSlug: "science",
      subjectColor: "bg-science",
      level: "Advanced",
      ageRange: "8-11",
    },
  },
  reading: {
    alphabet: {
      title: "Alphabet Recognition",
      description: "Learn to recognize and sound out letters",
      subject: "Reading",
      subjectSlug: "reading",
      subjectColor: "bg-reading",
      level: "Beginner",
      ageRange: "3-5",
    },
    phonics: {
      title: "Phonics & Word Sounds",
      description: "Connect letters with their sounds",
      subject: "Reading",
      subjectSlug: "reading",
      subjectColor: "bg-reading",
      level: "Beginner",
      ageRange: "4-6",
    },
    "sight-words": {
      title: "Sight Words",
      description: "Learn common words by sight",
      subject: "Reading",
      subjectSlug: "reading",
      subjectColor: "bg-reading",
      level: "Beginner",
      ageRange: "4-7",
    },
    vocabulary: {
      title: "Vocabulary Building",
      description: "Expand your word knowledge",
      subject: "Reading",
      subjectSlug: "reading",
      subjectColor: "bg-reading",
      level: "Intermediate",
      ageRange: "6-9",
    },
    comprehension: {
      title: "Reading Comprehension",
      description: "Understand and analyze what you read",
      subject: "Reading",
      subjectSlug: "reading",
      subjectColor: "bg-reading",
      level: "Intermediate",
      ageRange: "7-10",
    },
    grammar: {
      title: "Grammar & Punctuation",
      description: "Learn the rules of language",
      subject: "Reading",
      subjectSlug: "reading",
      subjectColor: "bg-reading",
      level: "Advanced",
      ageRange: "8-11",
    },
  },
  coding: {
    basics: {
      title: "Coding Basics",
      description: "Learn fundamental coding concepts",
      subject: "Coding",
      subjectSlug: "coding",
      subjectColor: "bg-coding",
      level: "Beginner",
      ageRange: "5-8",
    },
    sequences: {
      title: "Sequences & Algorithms",
      description: "Create step-by-step instructions",
      subject: "Coding",
      subjectSlug: "coding",
      subjectColor: "bg-coding",
      level: "Beginner",
      ageRange: "6-9",
    },
    loops: {
      title: "Loops & Repetition",
      description: "Learn how to repeat actions efficiently",
      subject: "Coding",
      subjectSlug: "coding",
      subjectColor: "bg-coding",
      level: "Intermediate",
      ageRange: "7-10",
    },
    conditionals: {
      title: "Conditionals & Logic",
      description: "Make decisions in your code",
      subject: "Coding",
      subjectSlug: "coding",
      subjectColor: "bg-coding",
      level: "Intermediate",
      ageRange: "8-11",
    },
    functions: {
      title: "Functions & Procedures",
      description: "Create reusable blocks of code",
      subject: "Coding",
      subjectSlug: "coding",
      subjectColor: "bg-coding",
      level: "Advanced",
      ageRange: "9-12",
    },
    debugging: {
      title: "Debugging & Problem Solving",
      description: "Find and fix errors in code",
      subject: "Coding",
      subjectSlug: "coding",
      subjectColor: "bg-coding",
      level: "Advanced",
      ageRange: "9-12",
    },
  },
  music: {
    instruments: {
      title: "Musical Instruments",
      description: "Learn about different musical instruments",
      subject: "Music",
      subjectSlug: "music",
      subjectColor: "bg-purple-500",
      level: "Beginner",
      ageRange: "4-7",
    },
    notes: {
      title: "Notes & Rhythms",
      description: "Understand basic musical notation",
      subject: "Music",
      subjectSlug: "music",
      subjectColor: "bg-purple-500",
      level: "Beginner",
      ageRange: "5-8",
    },
    composers: {
      title: "Famous Composers",
      description: "Learn about classical music composers",
      subject: "Music",
      subjectSlug: "music",
      subjectColor: "bg-purple-500",
      level: "Intermediate",
      ageRange: "7-10",
    },
    genres: {
      title: "Music Genres",
      description: "Explore different styles of music",
      subject: "Music",
      subjectSlug: "music",
      subjectColor: "bg-purple-500",
      level: "Intermediate",
      ageRange: "8-11",
    },
  },
  art: {
    colors: {
      title: "Colors & Mixing",
      description: "Learn about primary and secondary colors",
      subject: "Art",
      subjectSlug: "art",
      subjectColor: "bg-pink-500",
      level: "Beginner",
      ageRange: "3-6",
    },
    artists: {
      title: "Famous Artists",
      description: "Discover well-known artists and their work",
      subject: "Art",
      subjectSlug: "art",
      subjectColor: "bg-pink-500",
      level: "Intermediate",
      ageRange: "6-9",
    },
    styles: {
      title: "Art Styles",
      description: "Explore different artistic movements",
      subject: "Art",
      subjectSlug: "art",
      subjectColor: "bg-pink-500",
      level: "Intermediate",
      ageRange: "7-10",
    },
    techniques: {
      title: "Art Techniques",
      description: "Learn about different ways to create art",
      subject: "Art",
      subjectSlug: "art",
      subjectColor: "bg-pink-500",
      level: "Advanced",
      ageRange: "8-11",
    },
  },
  geography: {
    continents: {
      title: "Continents & Oceans",
      description: "Learn about the major landmasses and bodies of water",
      subject: "Geography",
      subjectSlug: "geography",
      subjectColor: "bg-green-500",
      level: "Beginner",
      ageRange: "5-8",
    },
    countries: {
      title: "Countries & Capitals",
      description: "Discover countries and their capital cities",
      subject: "Geography",
      subjectSlug: "geography",
      subjectColor: "bg-green-500",
      level: "Intermediate",
      ageRange: "7-10",
    },
    landforms: {
      title: "Landforms & Features",
      description: "Explore mountains, rivers, deserts, and more",
      subject: "Geography",
      subjectSlug: "geography",
      subjectColor: "bg-green-500",
      level: "Intermediate",
      ageRange: "7-10",
    },
    cultures: {
      title: "World Cultures",
      description: "Learn about different cultures around the world",
      subject: "Geography",
      subjectSlug: "geography",
      subjectColor: "bg-green-500",
      level: "Advanced",
      ageRange: "8-11",
    },
  },
  history: {
    ancient: {
      title: "Ancient Civilizations",
      description: "Explore early human societies and achievements",
      subject: "History",
      subjectSlug: "history",
      subjectColor: "bg-amber-500",
      level: "Intermediate",
      ageRange: "7-10",
    },
    explorers: {
      title: "Famous Explorers",
      description: "Learn about people who discovered new lands",
      subject: "History",
      subjectSlug: "history",
      subjectColor: "bg-amber-500",
      level: "Intermediate",
      ageRange: "7-10",
    },
    inventions: {
      title: "Important Inventions",
      description: "Discover inventions that changed the world",
      subject: "History",
      subjectSlug: "history",
      subjectColor: "bg-amber-500",
      level: "Intermediate",
      ageRange: "8-11",
    },
    leaders: {
      title: "Historical Leaders",
      description: "Learn about influential people throughout history",
      subject: "History",
      subjectSlug: "history",
      subjectColor: "bg-amber-500",
      level: "Advanced",
      ageRange: "9-12",
    },
  },
}

interface Question {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  id?: string
  difficulty?: string
}

export default function QuizTopicPage({ params }: { params: { subject: string; topic: string } }) {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timeLimit, setTimeLimit] = useState(0)

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

  // Function to fetch questions with difficulty using Gemini API
  const fetchQuestionsWithDifficulty = async (
    subject: string,
    topic: string,
    difficulty: string,
  ): Promise<Question[]> => {
    try {
      // Create a prompt based on the topic and subject with explicit instructions for difficulty
      const prompt = `Generate 10 multiple-choice quiz questions about "${topic}" for ${subject} subject for children.

      For ${difficulty} difficulty level:
      ${difficulty === "easy" ? "- Very basic concepts, simple vocabulary, obvious answers" : ""}
      ${difficulty === "beginner" ? "- Basic concepts, straightforward questions, some thought required" : ""}
      ${difficulty === "intermediate" ? "- More complex concepts, requires good understanding of the topic" : ""}
      ${difficulty === "hard" ? "- Advanced concepts, challenging questions, requires deep understanding" : ""}

      Each question must have:
      1. A clear, unique question
      2. Four distinct possible answers (options)
      3. The index of the correct answer (0-3, where 0 is the first option)
      4. A child-friendly explanation of the answer

      Format the response as a valid JSON array with objects having these properties:
      - question: string
      - options: string[] (array of 4 options)
      - correctAnswer: number (0-3 index of correct option)
      - explanation: string

      IMPORTANT: Return ONLY the JSON array, no other text.`

      const result = await model.generateContent(prompt)
      let responseText = result.response.text()

      // Fix: Remove unnecessary formatting
      responseText = responseText.replace(/```json|```/g, "").trim()

      try {
        // Parse the JSON
        const parsedQuestions: Question[] = JSON.parse(responseText)

        // Add unique IDs
        const questionsWithIds = parsedQuestions.map((q, index) => ({
          ...q,
          id: `${subject}-${topic}-${difficulty}-${Date.now()}-${index}`,
          difficulty: difficulty,
        }))

        return questionsWithIds
      } catch (parseError) {
        console.error("Error parsing JSON from API response", parseError)
        throw new Error("Error parsing JSON from API response")
      }
    } catch (error) {
      console.error("Error fetching questions:", error)
      throw error
    }
  }

  // Function to generate new questions with difficulty
  const generateNewQuestionsWithDifficulty = async (difficulty: string) => {
    setLoading(true)
    setError(null)

    try {
      const topicData = topicsData[params.subject as keyof typeof topicsData][params.topic as any]
      console.log(`Generating ${difficulty} questions for ${topicData.title} (${topicData.subject})`)

      // Set time limit based on difficulty
      const newTimeLimit =
        difficulty === "easy"
          ? 300
          : // 5 minutes
            difficulty === "beginner"
            ? 240
            : // 4 minutes
              difficulty === "intermediate"
              ? 180
              : // 3 minutes
                120 // 2 minutes for hard

      setTimeLimit(newTimeLimit)

      const generatedQuestions = await fetchQuestionsWithDifficulty(params.subject, params.topic, difficulty)

      if (!generatedQuestions || generatedQuestions.length === 0) {
        throw new Error("No questions were generated. Please try again.")
      }

      console.log(`Successfully generated ${generatedQuestions.length} questions`)
      setQuestions(generatedQuestions)
      setShowQuiz(true)
    } catch (err) {
      console.error("Error generating questions:", err)
      setError("Failed to generate questions. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  useEffect(() => {
    if (!mounted) return
  }, [mounted, params.subject, params.topic])

  if (!mounted) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <span className="ml-3 text-muted-foreground">Loading...</span>
      </div>
    )
  }

  const topicData = topicsData[params.subject as keyof typeof topicsData][params.topic as any]

  return (
    <div className="container py-12 md:py-20">
      <div className="mb-8">
        <Link
          href={`/quiz/${params.subject}`}
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to {topicData.subject} Quizzes
        </Link>

        <div className="relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary p-8 mb-12">
          <div className="absolute inset-0 pattern-dots opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${topicData.subjectColor} text-white`}>
                {topicData.level}
              </div>
              <div className="text-xs text-muted-foreground">Ages {topicData.ageRange}</div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{topicData.title} Quiz</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Test your knowledge of {topicData.title.toLowerCase()} with our interactive quiz.
            </p>
          </div>
        </div>

        {!selectedDifficulty && !showQuiz ? (
          <div className="p-8 rounded-xl bg-card border shadow-md">
            <h2 className="text-2xl font-bold mb-8 text-center">Select Difficulty Level</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <button
                onClick={() => {
                  setSelectedDifficulty("easy")
                  generateNewQuestionsWithDifficulty("easy")
                }}
                className="group relative overflow-hidden rounded-xl border border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-500/20 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                    <Shield className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-green-600 dark:text-green-400">Easy</h3>
                  <p className="text-muted-foreground">Basic concepts for beginners</p>
                  <div className="mt-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1 mb-1">
                      <Clock className="h-3 w-3" />
                      <span>5 minutes</span>
                    </div>
                    <div>Simple questions with obvious answers</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setSelectedDifficulty("beginner")
                  generateNewQuestionsWithDifficulty("beginner")
                }}
                className="group relative overflow-hidden rounded-xl border border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-500/20 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                    <Zap className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-blue-600 dark:text-blue-400">Beginner</h3>
                  <p className="text-muted-foreground">Straightforward questions with some challenge</p>
                  <div className="mt-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1 mb-1">
                      <Clock className="h-3 w-3" />
                      <span>4 minutes</span>
                    </div>
                    <div>Basic concepts requiring some thought</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setSelectedDifficulty("intermediate")
                  generateNewQuestionsWithDifficulty("intermediate")
                }}
                className="group relative overflow-hidden rounded-xl border border-orange-200 dark:border-orange-800 hover:border-orange-400 dark:hover:border-orange-600 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-500/20 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
                    <Target className="h-8 w-8 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-orange-600 dark:text-orange-400">Intermediate</h3>
                  <p className="text-muted-foreground">More complex concepts for experienced learners</p>
                  <div className="mt-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1 mb-1">
                      <Clock className="h-3 w-3" />
                      <span>3 minutes</span>
                    </div>
                    <div>Requires good understanding of the topic</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setSelectedDifficulty("hard")
                  generateNewQuestionsWithDifficulty("hard")
                }}
                className="group relative overflow-hidden rounded-xl border border-red-200 dark:border-red-800 hover:border-red-400 dark:hover:border-red-600 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-red-500/20 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                    <Award className="h-8 w-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-red-600 dark:text-red-400">Hard</h3>
                  <p className="text-muted-foreground">Advanced concepts for experts</p>
                  <div className="mt-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1 mb-1">
                      <Clock className="h-3 w-3" />
                      <span>2 minutes</span>
                    </div>
                    <div>Challenging questions requiring deep understanding</div>
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground mb-4">Not sure which level to choose?</p>
              <Link href={`/test-your-level?subject=${params.subject}`}>
                <Button variant="outline">Test Your Level</Button>
              </Link>
            </div>
          </div>
        ) : loading ? (
          <div className="p-8 rounded-xl bg-card border shadow-md text-center">
            <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-6"></div>
            <p className="text-xl font-medium mb-2">Generating {selectedDifficulty} questions...</p>
            <p className="text-muted-foreground">
              This may take a moment as our AI creates personalized questions for you
            </p>
          </div>
        ) : error ? (
          <div className="p-8 rounded-xl bg-card border shadow-md text-center">
            <div className="text-red-500 mb-6 text-xl">⚠️ {error}</div>
            <Button
              onClick={() => setSelectedDifficulty(null)}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
            >
              Try Again
            </Button>
          </div>
        ) : questions.length > 0 && showQuiz ? (
          <>
            {selectedDifficulty && (
              <div className="mb-4 flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2">Difficulty:</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      selectedDifficulty === "easy"
                        ? "bg-green-500"
                        : selectedDifficulty === "beginner"
                          ? "bg-blue-500"
                          : selectedDifficulty === "intermediate"
                            ? "bg-orange-500"
                            : "bg-red-500"
                    } text-white`}
                  >
                    {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Time Limit: {formatTime(timeLimit)}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedDifficulty(null)
                    setShowQuiz(false)
                  }}
                >
                  Change Difficulty
                </Button>
              </div>
            )}
            <QuizEngine
              questions={questions}
              subjectColor={topicData.subjectColor}
              subject={params.subject}
              topic={params.topic}
              difficulty={selectedDifficulty || undefined}
              timeLimit={timeLimit}
              onComplete={(score, total) => {
                console.log(`Quiz completed with score ${score}/${total}`)
                // Here you would typically save the progress to a database
              }}
            />
          </>
        ) : (
          <div className="p-8 rounded-xl bg-card border shadow-md text-center">
            <p className="text-muted-foreground">No questions available for this topic yet.</p>
          </div>
        )}

        {showQuiz && !loading && (
          <div className="mt-8 flex justify-center">
            <Button
              onClick={() => generateNewQuestionsWithDifficulty(selectedDifficulty || "beginner")}
              className={`${topicData.subjectColor} text-white flex items-center gap-2`}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Generate New Questions
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
