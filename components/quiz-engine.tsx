"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, ChevronRight, Award, AlertCircle, RefreshCw } from "lucide-react"
import confetti from "canvas-confetti"

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

interface QuizEngineProps {
  questions: Question[]
  subjectColor: string
  onComplete?: (score: number, totalQuestions: number) => void
}

export function QuizEngine({ questions, subjectColor, onComplete }: QuizEngineProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  const handleOptionSelect = (index: number) => {
    if (!isAnswerChecked) {
      setSelectedOption(index)
    }
  }

  const checkAnswer = () => {
    if (selectedOption === null) return

    setIsAnswerChecked(true)

    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(score + 1)

      // Trigger confetti for correct answer
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }

    setShowExplanation(true)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedOption(null)
      setIsAnswerChecked(false)
      setShowExplanation(false)
    } else {
      setQuizCompleted(true)
      if (onComplete) {
        onComplete(score + (selectedOption === currentQuestion.correctAnswer ? 1 : 0), questions.length)
      }
    }
  }

  const isCorrect = selectedOption === currentQuestion.correctAnswer

  // Determine button state
  const buttonText = isAnswerChecked
    ? currentQuestionIndex < questions.length - 1
      ? "Next Question"
      : "Complete Quiz"
    : "Check Answer"

  const buttonAction = isAnswerChecked ? nextQuestion : checkAnswer
  const buttonDisabled = selectedOption === null

  return (
    <div className="w-full max-w-3xl mx-auto">
      {!quizCompleted ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            <div className="text-sm font-medium">
              Score: {score}/{currentQuestionIndex + (isAnswerChecked ? 1 : 0)}
            </div>
          </div>

          <Progress value={progress} color={subjectColor} className="h-1.5" />

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
                      selectedOption !== currentQuestion.correctAnswer && <XCircle className="h-5 w-5 text-red-500" />}
                  </div>
                </div>
              ))}
            </div>

            {showExplanation && currentQuestion.explanation && (
              <div
                className={`mt-6 p-4 rounded-lg ${isCorrect ? "bg-green-500/10 border border-green-500/30" : "bg-red-500/10 border border-red-500/30"}`}
              >
                <div className="flex items-start gap-2">
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  )}
                  <div>
                    <p className={`font-medium ${isCorrect ? "text-green-500" : "text-red-500"}`}>
                      {isCorrect ? "Correct!" : "Incorrect!"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{currentQuestion.explanation}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={buttonAction} disabled={buttonDisabled} className={`${subjectColor} text-white`}>
              {buttonText}
              {isAnswerChecked && <ChevronRight className="ml-1 h-4 w-4" />}
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-xl bg-secondary/30 border border-secondary text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Award className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Quiz Completed!</h3>
          <p className="text-muted-foreground mb-6">
            You scored {score} out of {questions.length}
          </p>

          <div className="w-full max-w-xs mx-auto mb-6">
            <div className="relative h-4 rounded-full bg-secondary overflow-hidden">
              <div
                className={`absolute left-0 top-0 bottom-0 ${subjectColor}`}
                style={{ width: `${(score / questions.length) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>0</span>
              <span>{questions.length}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setCurrentQuestionIndex(0)
                setSelectedOption(null)
                setIsAnswerChecked(false)
                setScore(0)
                setQuizCompleted(false)
                setShowExplanation(false)
              }}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Button className={`${subjectColor} text-white`} onClick={() => (window.location.href = "/subjects")}>
              Back to Subjects
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

