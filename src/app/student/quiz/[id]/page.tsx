"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

const mockQuizData = {
  1: {
    title: "Programming Basics Quiz",
    description: "Test your understanding of basic programming concepts",
    timeLimit: 30, // minutes
    questions: [
      {
        id: 1,
        question: "What is a variable in programming?",
        options: [
          "A fixed value that cannot be changed",
          "A named storage location that can hold data",
          "A type of loop structure",
          "A function that returns a value",
        ],
        correct: 1,
        explanation:
          "A variable is a named storage location in memory that can hold data and whose value can be changed during program execution.",
      },
      {
        id: 2,
        question: "Which of the following is NOT a primitive data type in most programming languages?",
        options: ["Integer", "Boolean", "String", "Array"],
        correct: 3,
        explanation:
          "Array is a composite data type, not a primitive one. Primitive data types are the basic building blocks like integers, booleans, and characters.",
      },
      {
        id: 3,
        question: "What does the term 'algorithm' refer to?",
        options: [
          "A programming language",
          "A step-by-step procedure to solve a problem",
          "A type of data structure",
          "A debugging technique",
        ],
        correct: 1,
        explanation:
          "An algorithm is a finite sequence of well-defined instructions to solve a problem or perform a computation.",
      },
      {
        id: 4,
        question: "In object-oriented programming, what is encapsulation?",
        options: [
          "Creating multiple instances of a class",
          "Inheriting properties from a parent class",
          "Bundling data and methods that operate on that data",
          "Overriding methods in a subclass",
        ],
        correct: 2,
        explanation:
          "Encapsulation is the bundling of data and the methods that operate on that data into a single unit, typically a class.",
      },
      {
        id: 5,
        question: "What is the purpose of a loop in programming?",
        options: [
          "To store multiple values",
          "To make decisions in code",
          "To repeat a block of code multiple times",
          "To define a function",
        ],
        correct: 2,
        explanation: "Loops are used to execute a block of code repeatedly until a certain condition is met.",
      },
    ],
  },
}

export default function QuizPage() {
  const params = useParams()
  const quizId = Number.parseInt(params.id as string)
  const quiz = mockQuizData[quizId as keyof typeof mockQuizData]

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [timeLeft, setTimeLeft] = useState(quiz?.timeLimit ? quiz.timeLimit * 60 : 1800) // in seconds
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      handleSubmitQuiz()
    }
  }, [timeLeft, quizCompleted])

  if (!quiz) {
    return <div>Quiz not found</div>
  }

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }))
  }

  const handleSubmitQuiz = () => {
    setQuizCompleted(true)
    setShowResults(true)
  }

  const calculateScore = () => {
    let correct = 0
    quiz.questions.forEach((question) => {
      if (answers[question.id] === question.correct) {
        correct++
      }
    })
    return Math.round((correct / quiz.questions.length) * 100)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (showResults) {
    const score = calculateScore()
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Quiz Results</CardTitle>
              <CardDescription>{quiz.title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-6xl font-bold text-green-600 mb-2">{score}%</div>
                <div className="text-lg text-gray-600">
                  You got {quiz.questions.filter((q) => answers[q.id] === q.correct).length} out of{" "}
                  {quiz.questions.length} questions correct
                </div>
                <Badge variant={score >= 80 ? "default" : score >= 60 ? "secondary" : "destructive"} className="mt-2">
                  {score >= 80 ? "Excellent!" : score >= 60 ? "Good Job!" : "Needs Improvement"}
                </Badge>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Question Review</h3>
                {quiz.questions.map((question, index) => {
                  const userAnswer = answers[question.id]
                  const isCorrect = userAnswer === question.correct

                  return (
                    <Card
                      key={question.id}
                      className={`border-l-4 ${isCorrect ? "border-l-green-500" : "border-l-red-500"}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          {isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600 mt-1" />
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium mb-2">
                              Question {index + 1}: {question.question}
                            </h4>
                            <div className="space-y-1 text-sm">
                              <div className="text-gray-600">
                                Your answer:{" "}
                                <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                                  {question.options[userAnswer] || "Not answered"}
                                </span>
                              </div>
                              {!isCorrect && (
                                <div className="text-gray-600">
                                  Correct answer:{" "}
                                  <span className="text-green-600">{question.options[question.correct]}</span>
                                </div>
                              )}
                              <div className="text-gray-700 mt-2 p-2 bg-blue-50 rounded">
                                <strong>Explanation:</strong> {question.explanation}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <div className="flex justify-center space-x-4">
                <Link href="/student/dashboard">
                  <Button>Return to Dashboard</Button>
                </Link>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Retake Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentQ = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/student/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
              <p className="text-gray-600">{quiz.description}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-orange-600">
                <Clock className="h-5 w-5 mr-1" />
                <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Question {currentQuestion + 1} of {quiz.questions.length}
              </CardTitle>
              <Badge variant="outline">{Math.round(progress)}% Complete</Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h2 className="text-xl font-medium mb-4">{currentQ.question}</h2>

              <RadioGroup
                value={answers[currentQ.id]?.toString()}
                onValueChange={(value) => handleAnswerSelect(currentQ.id, Number.parseInt(value))}
              >
                {currentQ.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentQuestion === quiz.questions.length - 1 ? (
                <Button onClick={handleSubmitQuiz} className="bg-green-600 hover:bg-green-700">
                  Submit Quiz
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentQuestion(Math.min(quiz.questions.length - 1, currentQuestion + 1))}
                  disabled={answers[currentQ.id] === undefined}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Question Navigation */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Question Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {quiz.questions.map((_, index) => (
                <Button
                  key={index}
                  variant={
                    currentQuestion === index
                      ? "default"
                      : answers[quiz.questions[index].id] !== undefined
                        ? "secondary"
                        : "outline"
                  }
                  size="sm"
                  onClick={() => setCurrentQuestion(index)}
                  className="aspect-square"
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
