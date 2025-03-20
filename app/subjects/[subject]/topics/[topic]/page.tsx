"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock, BookOpen, Brain, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { getTopicLearningHistory, updateLearningHistory } from "@/lib/learning-history"
import { logActivity } from "@/lib/user-service"
import type { JSX } from "react/jsx-runtime"

// Initialize the Gemini API
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ""
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

interface Question {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface SubjectInfo {
  name: string
  color: string
  icon: JSX.Element
}

const subjects: Record<string, SubjectInfo> = {
  math: {
    name: "Mathematics",
    color: "bg-math text-white",
    icon: <span className="text-2xl">🔢</span>,
  },
  science: {
    name: "Science",
    color: "bg-science text-white",
    icon: <span className="text-2xl">🔬</span>,
  },
  reading: {
    name: "Reading",
    color: "bg-reading text-white",
    icon: <span className="text-2xl">📚</span>,
  },
  coding: {
    name: "Coding",
    color: "bg-coding text-white",
    icon: <span className="text-2xl">💻</span>,
  },
  art: {
    name: "Art",
    color: "bg-art text-white",
    icon: <span className="text-2xl">🎨</span>,
  },
  music: {
    name: "Music",
    color: "bg-music text-white",
    icon: <span className="text-2xl">🎵</span>,
  },
  geography: {
    name: "Geography",
    color: "bg-geography text-white",
    icon: <span className="text-2xl">🌍</span>,
  },
  logic: {
    name: "Logic",
    color: "bg-logic text-white",
    icon: <span className="text-2xl">🧩</span>,
  },
}

export default function TopicPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()

  const subject = params.subject as string
  const topic = params.topic as string
  const difficulty = searchParams.get("difficulty") || "beginner"

  const [content, setContent] = useState<string>("")
  const [previousContent, setPreviousContent] = useState<string>("")
  const [visitCount, setVisitCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Quiz state
  const [questions, setQuestions] = useState<Question[]>([])
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [quizStartTime, setQuizStartTime] = useState<number>(0)

  const currentQuestion = questions[currentQuestionIndex]
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0

  // Time limits based on difficulty (in seconds)
  const timeLimits = {
    easy: 30,
    beginner: 25,
    intermediate: 20,
    hard: 15,
  }

  // Load learning history and generate content
  useEffect(() => {
    const loadTopicData = async () => {
      setLoading(true)
      setError(null)

      try {
        // Get learning history
        const history = await getTopicLearningHistory(subject, topic)

        if (history) {
          setPreviousContent(history.content)
          setVisitCount(history.visitCount)
        }

        // Generate new content
        await generateContent(history?.content || "")
      } catch (err) {
        console.error("Error loading topic data:", err)
        setError("Failed to load topic content. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadTopicData()
  }, [subject, topic, difficulty])

  // Generate content using Gemini API
  const generateContent = async (previousContent: string) => {
    try {
      const isFirstVisit = !previousContent
      const formattedSubject = subjects[subject]?.name || subject

      let prompt = ""

      if (isFirstVisit) {
        // First visit - generate new content
        prompt = `Create an educational lesson about "${topic}" in the subject of ${formattedSubject} for a student at ${difficulty} level.
        
        The content should:
        1. Be engaging and appropriate for the ${difficulty} level
        2. Include clear explanations with examples
        3. Be structured with headings and subheadings
        4. Be approximately 500-700 words
        5. Include 2-3 key concepts that will be tested in a quiz
        
        Format the content using Markdown with headings, bullet points, and emphasis where appropriate.`
      } else {
        // Return visit - reference previous content and continue
        prompt = `The student is returning to learn more about "${topic}" in ${formattedSubject}. 
        
        Here's a summary of what they learned previously:
        "${previousContent.substring(0, 300)}..."
        
        Please:
        1. Start with a 2-3 sentence recap of what they learned before
        2. Then say "Let's continue learning about ${topic}..."
        3. Provide NEW and MORE ADVANCED content about ${topic} at ${difficulty} level
        4. Build upon the previous knowledge but don't repeat the same information
        5. Include 2-3 new key concepts that will be tested in a quiz
        6. Be approximately 500-700 words
        
        Format the content using Markdown with headings, bullet points, and emphasis where appropriate.`
      }

      const result = await model.generateContent(prompt)
      const newContent = result.response.text()

      // Save the content to learning history
      await updateLearningHistory(subject, topic, newContent, 0, difficulty)

      // Log activity
      await logActivity("", {
        type: "learning",
        subject,
        topic,
        timeSpent: 0,
        difficulty,
      })

      setContent(newContent)
    } catch (err) {
      console.error("Error generating content:", err)
      setError("Failed to generate content. Please try again.")
    }
  }

  // Generate quiz questions
  const generateQuizQuestions = async () => {
    try {
      setLoading(true)

      const formattedSubject = subjects[subject]?.name || subject

      const prompt = `Based on the following educational content about "${topic}" in ${formattedSubject}, create 10 quiz questions to test the student's understanding.

      Content: "${content.substring(0, 1500)}..."
      
      Each question must have:
      - A clear question text
      - Four answer choices
      - The index of the correct answer (0-3)
      - A brief explanation of why the answer is correct
      
      Return ONLY valid JSON formatted like this:
      [
        {
          "question": "What is the main concept of ${topic}?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 1,
          "explanation": "Option B is correct because..."
        }
      ]`

      const result = await model.generateContent(prompt)
      let responseText = result.response.text()

      // Fix: Remove unnecessary formatting
      responseText = responseText.replace(/```json|```/g, "").trim()

      // Parse the JSON
      const parsedQuestions: Question[] = JSON.parse(responseText)

      if (!parsedQuestions || parsedQuestions.length === 0) {
        throw new Error("Failed to generate questions")
      }

      setQuestions(parsedQuestions)
      setCurrentQuestionIndex(0)
      setSelectedOption(null)
      setIsAnswerChecked(false)
      setScore(0)
      setQuizCompleted(false)
      setShowQuiz(true)

      // Set time limit based on difficulty
      const timeLimit = timeLimits[difficulty as keyof typeof timeLimits] || 20
      setTimeLeft(timeLimit)
      setQuizStartTime(Date.now())

      // Start timer
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer)
            return 0
          }
          return prevTime - 1
        })
      }, 1000)

      // Clean up timer
      return () => clearInterval(timer)
    } catch (err) {
      console.error("Error generating quiz questions:", err)
      setError("Failed to generate quiz questions. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Handle option selection
  const handleOptionSelect = (index: number) => {
    if (!isAnswerChecked) {
      setSelectedOption(index)
    }
  }

  // Check answer
  const checkAnswer = () => {
    if (selectedOption === null) return

    setIsAnswerChecked(true)

    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(score + 1)
    }
  }

  // Next question
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedOption(null)
      setIsAnswerChecked(false)

      // Reset timer for next question
      const timeLimit = timeLimits[difficulty as keyof typeof timeLimits] || 20
      setTimeLeft(timeLimit)
    } else {
      completeQuiz()
    }
  }

  // Complete quiz
  const completeQuiz = () => {
    setQuizCompleted(true)

    // Calculate time spent
    const timeSpent = Math.floor((Date.now() - quizStartTime) / 1000)

    // Log activity
    logActivity("", {
      type: "quiz",
      subject,
      topic,
      score: score + (selectedOption === currentQuestion?.correctAnswer ? 1 : 0),
      totalQuestions: questions.length,
      timeSpent,
      difficulty,
    })

    // Update learning history with progress
    const finalScore = score + (selectedOption === currentQuestion?.correctAnswer ? 1 : 0)
    const progressPercentage = Math.round((finalScore / questions.length) * 100)

    updateLearningHistory(subject, topic, content, progressPercentage, difficulty)
  }

  // Effect for timer
  useEffect(() => {
    if (showQuiz && !quizCompleted && timeLeft === 0 && !isAnswerChecked) {
      // Time's up, auto-check answer
      checkAnswer()
    }
  }, [timeLeft, showQuiz, quizCompleted, isAnswerChecked])

  // Show loading state
  if (loading) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <span className="ml-3 text-muted-foreground">Loading content...</span>
      </div>
    )
  }

  // Show error state
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

  // If quiz is completed, show results
  if (showQuiz && quizCompleted) {
    const finalScore = score + (selectedOption === currentQuestion?.correctAnswer ? 1 : 0)
    const percentage = Math.round((finalScore / questions.length) * 100)

    return (
      <div className="container py-12 md:py-20">
        <div className="mb-8">
          <Link
            href={`/subjects/${subject}`}
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to {subjects[subject]?.name || subject}
          </Link>

          <div className="p-8 rounded-xl bg-secondary/30 border border-secondary text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Quiz Completed!</h2>
            <p className="text-muted-foreground mb-6">
              You scored {finalScore} out of {questions.length} ({percentage}%)
            </p>

            <div className="w-full max-w-xs mx-auto mb-6">
              <div className="relative h-4 rounded-full bg-secondary overflow-hidden">
                <div
                  className={`absolute left-0 top-0 bottom-0 ${
                    percentage >= 70 ? "bg-green-500" : percentage >= 40 ? "bg-amber-500" : "bg-red-500"
                  }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  setShowQuiz(false)
                }}
                className="flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Return to Lesson
              </Button>

              <Button
                className={`${subjects[subject]?.color.split(" ")[0] || "bg-primary"} text-white`}
                onClick={() => {
                  router.push(`/subjects/${subject}`)
                }}
              >
                Continue Learning
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If showing quiz, display questions
  if (showQuiz) {
    return (
      <div className="container py-12 md:py-20">
        <div className="mb-8">
          <Link
            href={`/subjects/${subject}`}
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to {subjects[subject]?.name || subject}
          </Link>

          <div className="relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary p-8 mb-12">
            <div className="absolute inset-0 pattern-dots opacity-10"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${subjects[subject]?.color || "bg-primary text-white"}`}
                >
                  {subjects[subject]?.name || subject}
                </div>
                <div className="text-xs text-muted-foreground">{topic}</div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Quiz Time</h1>
              <p className="text-lg text-muted-foreground max-w-3xl">Let's test your understanding of {topic}.</p>
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

              {/* Timer display */}
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  timeLeft < 5 ? "text-red-500 animate-pulse" : "text-muted-foreground"
                }`}
              >
                <Clock className="h-4 w-4" />
                {timeLeft > 0 ? `${timeLeft}s remaining` : "Time's up!"}
              </div>

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
                              isAnswerChecked && index === currentQuestion.correctAnswer
                                ? "bg-green-500 text-white"
                                : ""
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

                {isAnswerChecked && currentQuestion.explanation && (
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
                  disabled={selectedOption === null && timeLeft > 0}
                  className={`${subjects[subject]?.color?.split(" ")[0] || "bg-primary"} text-white`}
                >
                  {isAnswerChecked
                    ? currentQuestionIndex < questions.length - 1
                      ? "Next Question"
                      : "Complete Quiz"
                    : "Check Answer"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Show content
  return (
    <div className="container py-12 md:py-20">
      <div className="mb-8">
        <Link
          href={`/subjects/${subject}`}
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to {subjects[subject]?.name || subject}
        </Link>

        <div className="relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary p-8 mb-12">
          <div className="absolute inset-0 pattern-dots opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${subjects[subject]?.color || "bg-primary text-white"}`}
              >
                {subjects[subject]?.name || subject}
              </div>
              <div className="text-xs text-muted-foreground">{difficulty} level</div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 capitalize">{topic.replace(/-/g, " ")}</h1>
            {visitCount > 1 && (
              <p className="text-sm text-muted-foreground mb-2">This is visit #{visitCount} to this topic</p>
            )}
          </div>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          {/* Render markdown content */}
          <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br />") }} />
        </div>

        <div className="flex justify-center">
          <Button
            onClick={generateQuizQuestions}
            className={`${subjects[subject]?.color?.split(" ")[0] || "bg-primary"} text-white px-8 py-6 text-lg`}
          >
            Take Quiz
          </Button>
        </div>
      </div>
    </div>
  )
}

