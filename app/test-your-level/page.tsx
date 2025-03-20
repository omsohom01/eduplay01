"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { Brain } from "@/components/ui/brain"
import { Progress } from "@/components/ui/progress"
import { Clock, AlertCircle } from "lucide-react"

interface Question {
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
  topic: string
  timeLimit: number
}

interface TopicPerformance {
  topic: string
  correct: number
  total: number
  averageTimeRatio: number // Time taken / expected time
}

const subjects = [
  { id: "math", name: "Mathematics", topics: ["Algebra", "Geometry", "Calculus", "Statistics", "Number Theory"] },
  { id: "science", name: "Science", topics: ["Physics", "Chemistry", "Biology", "Earth Science", "Astronomy"] },
  {
    id: "english",
    name: "English",
    topics: ["Grammar", "Vocabulary", "Reading Comprehension", "Writing", "Literature"],
  },
  {
    id: "history",
    name: "History",
    topics: ["Ancient History", "Medieval History", "Modern History", "World Wars", "Cultural History"],
  },
  {
    id: "geography",
    name: "Geography",
    topics: ["Physical Geography", "Human Geography", "Cartography", "Climate", "Ecosystems"],
  },
]

export default function TestYourLevelPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [topicPerformance, setTopicPerformance] = useState<TopicPerformance[]>([])
  const [questionStartTime, setQuestionStartTime] = useState<number>(0)
  const [timeSpent, setTimeSpent] = useState<Record<number, number>>({})

  useEffect(() => {
    if (!user) {
      router.push("/signin")
    }
  }, [user, router])

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !isAnswered) {
      handleAnswer(null) // Auto-submit when time runs out
    }
  }, [timeLeft, isAnswered])

  const fetchQuestions = async (subject: string) => {
    setLoading(true)
    try {
      // Get topics for the selected subject
      const subjectData = subjects.find((s) => s.id === subject)
      if (!subjectData) throw new Error("Subject not found")

      const allQuestions: Question[] = []

      // Generate questions for each topic
      for (const topic of subjectData.topics) {
        const response = await fetch("/api/gemini/questions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subject,
            topic,
            difficulty: "medium",
            count: 2, // 2 questions per topic = 10 total questions
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch questions")
        }

        const data = await response.json()

        // Add topic and time limit to each question
        const questionsWithTopic = data.questions.map((q: any) => ({
          ...q,
          topic,
          timeLimit: calculateTimeLimit(q),
        }))

        allQuestions.push(...questionsWithTopic)
      }

      // Shuffle the questions
      const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5)

      setQuestions(shuffledQuestions)
      setCurrentQuestionIndex(0)
      setScore(0)
      setIsAnswered(false)
      setSelectedOption(null)
      setTestCompleted(false)
      setTopicPerformance([])
      setTimeSpent({})

      // Set the time limit for the first question
      if (shuffledQuestions.length > 0) {
        setTimeLeft(shuffledQuestions[0].timeLimit)
        setQuestionStartTime(Date.now())
      }
    } catch (error) {
      console.error("Error fetching questions:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateTimeLimit = (question: any): number => {
    // Base time in seconds
    let baseTime = 30

    // Adjust based on question length
    const questionLength = question.question.length
    if (questionLength > 200) baseTime += 15
    else if (questionLength > 100) baseTime += 10

    // Adjust based on options complexity
    const optionsComplexity =
      question.options.reduce((acc: number, opt: string) => acc + opt.length, 0) / question.options.length
    if (optionsComplexity > 50) baseTime += 10
    else if (optionsComplexity > 25) baseTime += 5

    return baseTime
  }

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject)
    fetchQuestions(subject)
  }

  const handleAnswer = (option: string | null) => {
    if (isAnswered) return

    // Calculate time spent on this question
    const timeSpentOnQuestion = Date.now() - questionStartTime
    setTimeSpent((prev) => ({
      ...prev,
      [currentQuestionIndex]: timeSpentOnQuestion / 1000, // Convert to seconds
    }))

    setSelectedOption(option)
    setIsAnswered(true)

    const currentQuestion = questions[currentQuestionIndex]
    const isCorrect = option === currentQuestion.correctAnswer

    if (isCorrect) {
      setScore(score + 1)
    }

    // Update topic performance
    updateTopicPerformance(currentQuestion.topic, isCorrect, timeSpentOnQuestion / 1000, currentQuestion.timeLimit)
  }

  const updateTopicPerformance = (topic: string, isCorrect: boolean, timeSpent: number, timeLimit: number) => {
    setTopicPerformance((prev) => {
      const existingTopic = prev.find((t) => t.topic === topic)

      if (existingTopic) {
        return prev.map((t) => {
          if (t.topic === topic) {
            return {
              ...t,
              correct: isCorrect ? t.correct + 1 : t.correct,
              total: t.total + 1,
              averageTimeRatio: (t.averageTimeRatio * t.total + timeSpent / timeLimit) / (t.total + 1),
            }
          }
          return t
        })
      } else {
        return [
          ...prev,
          {
            topic,
            correct: isCorrect ? 1 : 0,
            total: 1,
            averageTimeRatio: timeSpent / timeLimit,
          },
        ]
      }
    })
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedOption(null)
      setIsAnswered(false)
      setTimeLeft(questions[currentQuestionIndex + 1].timeLimit)
      setQuestionStartTime(Date.now())
    } else {
      setTestCompleted(true)

      // Log the activity
      if (user) {
        fetch("/api/user/activity", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            activityType: "assessment",
            details: {
              subject: selectedSubject,
              score: `${score}/${questions.length}`,
              topicPerformance,
            },
          }),
        }).catch((err) => console.error("Error logging activity:", err))
      }
    }
  }

  const getTopicRecommendations = () => {
    return topicPerformance
      .sort((a, b) => a.correct / a.total - b.correct / b.total)
      .map((topic) => {
        const performancePercentage = (topic.correct / topic.total) * 100
        let recommendedDifficulty = "medium"
        let improvementNeeded = false

        if (performancePercentage < 40) {
          recommendedDifficulty = "easy"
          improvementNeeded = true
        } else if (performancePercentage > 80) {
          recommendedDifficulty = "hard"
          improvementNeeded = false
        } else {
          improvementNeeded = performancePercentage < 60
        }

        const timeManagement =
          topic.averageTimeRatio > 1.2
            ? "You took longer than expected on these questions. Try to improve your speed."
            : topic.averageTimeRatio < 0.8
              ? "You answered quickly! Make sure you're not rushing through questions."
              : "Your timing was good on these questions."

        return {
          topic: topic.topic,
          performance: `${topic.correct}/${topic.total} correct (${performancePercentage.toFixed(0)}%)`,
          recommendedDifficulty,
          improvementNeeded,
          timeManagement,
        }
      })
  }

  const restartTest = () => {
    setSelectedSubject(null)
    setQuestions([])
    setCurrentQuestionIndex(0)
    setSelectedOption(null)
    setIsAnswered(false)
    setScore(0)
    setTestCompleted(false)
    setTopicPerformance([])
    setTimeSpent({})
    setTimeLeft(null)
  }

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="w-full max-w-4xl mx-auto">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Brain className="animate-pulse" />
            <p className="mt-4 text-lg">Generating your assessment questions...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (testCompleted) {
    const recommendations = getTopicRecommendations()
    const overallScore = (score / questions.length) * 100

    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Assessment Results</CardTitle>
            <CardDescription>
              You scored {score} out of {questions.length} ({overallScore.toFixed(0)}%)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Overall Performance</h3>
              <Progress value={overallScore} className="h-2" />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Topic Breakdown & Recommendations</h3>

              {recommendations.map((rec, index) => (
                <Card
                  key={index}
                  className={`border ${rec.improvementNeeded ? "border-orange-300 dark:border-orange-700" : "border-green-300 dark:border-green-700"}`}
                >
                  <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{rec.topic}</h4>
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          rec.improvementNeeded
                            ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        }`}
                      >
                        {rec.performance}
                      </span>
                    </div>

                    <div className="text-sm space-y-1">
                      <p>
                        <span className="font-medium">Recommended difficulty:</span> {rec.recommendedDifficulty}
                      </p>
                      <p>
                        <span className="font-medium">Time management:</span> {rec.timeManagement}
                      </p>
                      {rec.improvementNeeded && (
                        <p className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                          <AlertCircle className="h-4 w-4" />
                          This topic needs improvement
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={restartTest} className="w-full">
              Start a New Assessment
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (!selectedSubject) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Test Your Knowledge Level</CardTitle>
            <CardDescription>
              Select a subject to begin your assessment. We'll test your knowledge across different topics and provide
              personalized recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <Button
                key={subject.id}
                variant="outline"
                className="h-24 flex flex-col items-center justify-center text-center p-4 hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => handleSubjectSelect(subject.id)}
              >
                <span className="text-lg font-medium">{subject.name}</span>
                <span className="text-xs mt-1">{subject.topics.length} topics</span>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progressPercentage = (currentQuestionIndex / questions.length) * 100
  const timePercentage = timeLeft !== null ? (timeLeft / currentQuestion.timeLimit) * 100 : 0
  const isTimeRunningLow = timeLeft !== null && timeLeft <= 10

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="relative">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">
              Question {currentQuestionIndex + 1} of {questions.length}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Clock className={`h-5 w-5 ${isTimeRunningLow ? "text-red-500 animate-pulse" : ""}`} />
              <span className={`${isTimeRunningLow ? "text-red-500 font-bold" : ""}`}>{timeLeft}s</span>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-1 mt-2" />
          <Progress
            value={timePercentage}
            className={`h-1 mt-1 ${isTimeRunningLow ? "bg-red-100 dark:bg-red-900" : "bg-blue-100 dark:bg-blue-900"}`}
            indicatorClassName={isTimeRunningLow ? "bg-red-500" : "bg-blue-500"}
          />
          <div className="text-xs mt-1 text-muted-foreground">Topic: {currentQuestion.topic}</div>
        </CardHeader>
        <CardContent className="pt-4 pb-6">
          <div className="space-y-6">
            <div className="text-lg font-medium">{currentQuestion.question}</div>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant={
                    isAnswered
                      ? option === currentQuestion.correctAnswer
                        ? "default"
                        : option === selectedOption
                          ? "destructive"
                          : "outline"
                      : selectedOption === option
                        ? "default"
                        : "outline"
                  }
                  className="w-full justify-start text-left p-4 h-auto"
                  onClick={() => !isAnswered && handleAnswer(option)}
                  disabled={isAnswered}
                >
                  {option}
                </Button>
              ))}
            </div>
            {isAnswered && (
              <div
                className={`p-4 rounded-lg ${
                  selectedOption === currentQuestion.correctAnswer
                    ? "bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-100"
                    : "bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-100"
                }`}
              >
                <p className="font-medium">
                  {selectedOption === currentQuestion.correctAnswer
                    ? "Correct!"
                    : selectedOption === null
                      ? "Time's up!"
                      : "Incorrect!"}
                </p>
                <p className="mt-1">{currentQuestion.explanation}</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          {isAnswered ? (
            <Button onClick={handleNextQuestion} className="w-full">
              {currentQuestionIndex < questions.length - 1 ? "Next Question" : "See Results"}
            </Button>
          ) : (
            <Button onClick={() => handleAnswer(null)} variant="outline" className="w-full">
              Skip Question
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

