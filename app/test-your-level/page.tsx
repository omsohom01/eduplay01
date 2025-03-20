"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Brain, RefreshCw, Award, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Gemini API
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyDiaCC3dAZS8ZiDU1uF8YfEu9PoWy8YLoA"
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

interface Question {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  id: string
  difficulty: string
}

interface SubjectInfo {
  name: string
  color: string
  icon: JSX.Element
  slug: string
}

const subjects: Record<string, SubjectInfo> = {
  math: {
    name: "Mathematics",
    color: "bg-math text-white",
    icon: <span className="text-2xl">🔢</span>,
    slug: "math",
  },
  science: {
    name: "Science",
    color: "bg-science text-white",
    icon: <span className="text-2xl">🔬</span>,
    slug: "science",
  },
  reading: {
    name: "Reading",
    color: "bg-reading text-white",
    icon: <span className="text-2xl">📚</span>,
    slug: "reading",
  },
  coding: {
    name: "Coding",
    color: "bg-coding text-white",
    icon: <span className="text-2xl">💻</span>,
    slug: "coding",
  },
  art: {
    name: "Art",
    color: "bg-art text-white",
    icon: <span className="text-2xl">🎨</span>,
    slug: "art",
  },
  music: {
    name: "Music",
    color: "bg-music text-white",
    icon: <span className="text-2xl">🎵</span>,
    slug: "music",
  },
  geography: {
    name: "Geography",
    color: "bg-geography text-white",
    icon: <span className="text-2xl">🌍</span>,
    slug: "geography",
  },
  logic: {
    name: "Logic",
    color: "bg-logic text-white",
    icon: <span className="text-2xl">🧩</span>,
    slug: "logic",
  },
}

export default function TestYourLevelPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialSubject = searchParams.get("subject") || ""

  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [score, setScore] = useState(0)
  const [testCompleted, setTestCompleted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [recommendedLevel, setRecommendedLevel] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0

  // Function to generate adaptive test questions
  const generateAdaptiveQuestions = async (subject: string) => {
    setLoading(true)
    setError(null)

    try {
      const prompt = `Generate 10 quiz questions to test a student's knowledge level in ${subjects[subject]?.name || subject}.
      
      Create questions with varying difficulty levels:
      - 2 VERY EASY questions (basic knowledge)
      - 2 EASY questions (elementary knowledge)
      - 2 INTERMEDIATE questions (average knowledge)
      - 2 ADVANCED questions (above average knowledge)
      - 2 EXPERT questions (expert knowledge)
      
      Each question must have:
      - A clear question text
      - Four answer choices
      - The index of the correct answer (0-3)
      - A brief explanation
      - The difficulty level explicitly marked
      
      Return ONLY valid JSON formatted like this:
      [
        {
          "question": "What is 2 + 2?",
          "options": ["3", "4", "5", "6"],
          "correctAnswer": 1,
          "explanation": "2 + 2 equals 4.",
          "difficulty": "very easy"
        }
      ]`

      const result = await model.generateContent(prompt)
      let responseText = result.response.text()

      // Fix: Remove unnecessary formatting
      responseText = responseText.replace(/```json|```/g, "").trim()

      // Parse the JSON
      const parsedQuestions: Question[] = JSON.parse(responseText)

      // Add unique IDs
      const questionsWithIds = parsedQuestions.map((q, index) => ({
        ...q,
        id: `level-test-${subject}-${Date.now()}-${index}`,
      }))

      if (!questionsWithIds || questionsWithIds.length === 0) {
        throw new Error("Failed to generate questions")
      }

      // Shuffle the questions to mix difficulty levels
      const shuffledQuestions = [...questionsWithIds].sort(() => Math.random() - 0.5)

      setQuestions(shuffledQuestions)
      setCurrentQuestionIndex(0)
      setSelectedOption(null)
      setIsAnswerChecked(false)
      setScore(0)
      setTestCompleted(false)
      setShowExplanation(false)
    } catch (err) {
      console.error("Error generating adaptive questions:", err)
      setError("Failed to generate questions. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Start the test when a subject is selected
  useEffect(() => {
    if (selectedSubject && subjects[selectedSubject]) {
      generateAdaptiveQuestions(selectedSubject)
    }
  }, [selectedSubject])

  const handleOptionSelect = (index: number) => {
    if (!isAnswerChecked) {
      setSelectedOption(index)
    }
  }

  const checkAnswer = () => {
    if (selectedOption === null) return

    setIsAnswerChecked(true)
    setShowExplanation(true)

    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedOption(null)
      setIsAnswerChecked(false)
      setShowExplanation(false)
    } else {
      completeTest()
    }
  }

  const completeTest = () => {
    setTestCompleted(true)

    // Determine recommended level based on score
    const finalScore = score + (selectedOption === currentQuestion.correctAnswer ? 1 : 0)
    const percentage = (finalScore / questions.length) * 100

    if (percentage < 30) {
      setRecommendedLevel("easy")
    } else if (percentage < 50) {
      setRecommendedLevel("beginner")
    } else if (percentage < 75) {
      setRecommendedLevel("intermediate")
    } else {
      setRecommendedLevel("hard")
    }
  }

  // If no subject is selected, show subject selection
  if (!selectedSubject || !subjects[selectedSubject]) {
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
                Test Your Knowledge Level
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl">
                Take a quick assessment to determine which difficulty level is right for you. Select a subject to begin.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(subjects).map(([slug, subject]) => (
              <button
                key={slug}
                onClick={() => setSelectedSubject(slug)}
                className="p-6 rounded-xl bg-secondary/30 border border-secondary hover:bg-secondary/50 transition-all duration-300 text-left"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full ${subject.color} flex items-center justify-center`}>
                    {subject.icon}
                  </div>
                  <h3 className="text-xl font-bold">{subject.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Test your knowledge in {subject.name.toLowerCase()} and find the right difficulty level.
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Show loading state
  if (loading) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <span className="ml-3 text-muted-foreground">Generating assessment questions...</span>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="container py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-red-500 mb-4">⚠️ {error}</div>
        <Button
          onClick={() => generateAdaptiveQuestions(selectedSubject)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Try Again
        </Button>
      </div>
    )
  }

  // If test is completed, show results
  if (testCompleted) {
    const finalScore = score + (selectedOption === currentQuestion?.correctAnswer ? 1 : 0)
    const subjectInfo = subjects[selectedSubject]
    const percentage = Math.round((finalScore / questions.length) * 100)

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

          <div className="p-8 rounded-xl bg-secondary/30 border border-secondary text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Assessment Completed!</h2>
            <p className="text-muted-foreground mb-6">
              You scored {finalScore} out of {questions.length} ({percentage}%)
            </p>

            <div className="w-full max-w-xs mx-auto mb-6">
              <div className="relative h-4 rounded-full bg-secondary overflow-hidden">
                <div
                  className={`absolute left-0 top-0 bottom-0 ${subjectInfo.color.split(" ")[0]}`}
                  style={{ width: `${(finalScore / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-primary/10 border border-primary/30 mb-8 max-w-md mx-auto">
              <h3 className="text-xl font-bold mb-2">Recommended Level</h3>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    recommendedLevel === "easy"
                      ? "bg-green-500"
                      : recommendedLevel === "beginner"
                        ? "bg-blue-500"
                        : recommendedLevel === "intermediate"
                          ? "bg-orange-500"
                          : "bg-red-500"
                  } text-white`}
                >
                  {recommendedLevel.charAt(0).toUpperCase() + recommendedLevel.slice(1)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Based on your performance, we recommend you start with <strong>{recommendedLevel}</strong> difficulty in{" "}
                {subjectInfo.name}.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentQuestionIndex(0)
                  setSelectedOption(null)
                  setIsAnswerChecked(false)
                  setScore(0)
                  setTestCompleted(false)
                  generateAdaptiveQuestions(selectedSubject)
                }}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Retake Test
              </Button>

              <Button
                className={`${subjectInfo.color.split(" ")[0]} text-white`}
                onClick={() => {
                  router.push(`/subjects/${selectedSubject}?difficulty=${recommendedLevel}`)
                }}
              >
                Start Learning at {recommendedLevel.charAt(0).toUpperCase() + recommendedLevel.slice(1)} Level
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show the test questions
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
            <div className="flex items-center gap-2 mb-2">
              <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${subjects[selectedSubject].color}`}>
                {subjects[selectedSubject].name}
              </div>
              <div className="text-xs text-muted-foreground">Knowledge Assessment</div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Test Your Level</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Answer these questions to help us determine the right difficulty level for you.
            </p>
          </div>
        </div>

        {currentQuestion && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
              <div className="text-sm font-medium">
                Score: {score}/{currentQuestionIndex + (isAnswerChecked ? 1 : 0)}
              </div>
            </div>

            <Progress value={progress} className="h-1.5 bg-secondary" />

            <div className="p-6 rounded-xl bg-secondary/30 border border-secondary">
              <h3 className="text-xl font-bold mb-6">{currentQuestion.question}</h3>

              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    className={`answer-option p-4 rounded-lg cursor-pointer relative z-10 ${
                      selectedOption === index ? "selected" : ""
                    } ${isAnswerChecked && index === currentQuestion.correctAnswer ? "correct" : ""} ${
                      isAnswerChecked && selectedOption === index && selectedOption !== currentQuestion.correctAnswer
                        ? "incorrect"
                        : ""
                    }`}
                    onClick={() => handleOptionSelect(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                            selectedOption === index
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-muted-foreground"
                          } ${
                            isAnswerChecked && index === currentQuestion.correctAnswer ? "bg-green-500 text-white" : ""
                          } ${
                            isAnswerChecked &&
                            selectedOption === index &&
                            selectedOption !== currentQuestion.correctAnswer
                              ? "bg-red-500 text-white"
                              : ""
                          }`}
                        >
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-md">{option}</span>
                      </div>

                      {isAnswerChecked && index === currentQuestion.correctAnswer && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {isAnswerChecked &&
                        selectedOption === index &&
                        selectedOption !== currentQuestion.correctAnswer && (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                    </div>
                  </div>
                ))}
              </div>

              {showExplanation && currentQuestion.explanation && (
                <div
                  className={`mt-6 p-4 rounded-lg ${
                    isAnswerChecked && selectedOption === currentQuestion.correctAnswer
                      ? "bg-green-500/10 border border-green-500/30"
                      : "bg-red-500/10 border border-red-500/30"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <Brain className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-primary">Explanation</p>
                      <p className="text-sm text-muted-foreground mt-1">{currentQuestion.explanation}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                onClick={isAnswerChecked ? nextQuestion : checkAnswer}
                disabled={selectedOption === null}
                className={`${subjects[selectedSubject].color.split(" ")[0]} text-white`}
              >
                {isAnswerChecked
                  ? currentQuestionIndex < questions.length - 1
                    ? "Next Question"
                    : "Complete Assessment"
                  : "Check Answer"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
