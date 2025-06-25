"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const mockQuizData = {
  1: {
    id: 1,
    title: "Basic Math Quiz",
    maxScore: 8,
    timeLimit: 15,
    description: "A simple quiz to test basic math skills.",
    lessonId: 1,
    QuizQuestion: [
      {
        id: 1,
        quizId: 1,
        question: "What is 2 + 2?",
        options: '["3","4","5","6"]',
        answer: 1,
        type: "multiple-choice",
        explanation: "2 + 2 equals 4.",
      },
      {
        id: 2,
        quizId: 1,
        question: "What is 10 - 7?",
        options: '["2","3","4","5"]',
        answer: 1,
        type: "multiple-choice",
        explanation: "10 - 7 equals 3.",
      },
      {
        id: 3,
        quizId: 1,
        question: "What is 3 x 3?",
        options: '["6","9","12","15"]',
        answer: 1,
        type: "multiple-choice",
        explanation: "3 multiplied by 3 is 9.",
      },
      {
        id: 4,
        quizId: 1,
        question: "What is 12 divided by 4?",
        options: '["2","3","4","5"]',
        answer: 1,
        type: "multiple-choice",
        explanation: "12 divided by 4 equals 3.",
      },
      {
        id: 5,
        quizId: 1,
        question: "What is the square root of 16?",
        options: '["2","4","6","8"]',
        answer: 1,
        type: "multiple-choice",
        explanation: "The square root of 16 is 4.",
      },
      {
        id: 6,
        quizId: 1,
        question: "What is 7 + 6?",
        options: '["12","13","14","15"]',
        answer: 1,
        type: "multiple-choice",
        explanation: "7 + 6 equals 13.",
      },
      {
        id: 7,
        quizId: 1,
        question: "What is 5 x 0?",
        options: '["0","1","5","10"]',
        answer: 0,
        type: "multiple-choice",
        explanation: "Any number multiplied by 0 is 0.",
      },
      {
        id: 8,
        quizId: 1,
        question: "What is 100 - 25?",
        options: '["75","85","95","100"]',
        answer: 0,
        type: "multiple-choice",
        explanation: "100 minus 25 is 75.",
      },
    ],
  },
};

export default function QuizPage() {
  const params = useParams();
  const quizId = Number.parseInt(params.id as string);
  const quiz = mockQuizData[quizId as keyof typeof mockQuizData];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [timeLeft, setTimeLeft] = useState(
    quiz?.timeLimit ? quiz.timeLimit * 60 : 1800
  ); // in seconds
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmitQuiz();
    }
  }, [timeLeft, quizCompleted]);

  if (!quiz) {
    return <div>Quiz não encontrado</div>;
  }

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const handleSubmitQuiz = () => {
    setQuizCompleted(true);
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.QuizQuestion.forEach((question) => {
      if (answers[question.id] === question.answer) {
        correct++;
      }
    });
    return Math.round((correct / quiz.QuizQuestion.length) * 100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="min-h-screen w-full bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Resultado do Quiz</CardTitle>
              <CardDescription>{quiz.title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-6xl font-bold text-green-600 mb-2">
                  {score}%
                </div>
                <div className="text-lg text-gray-600 mb-4">
                  Tempo restante: {formatTime(timeLeft)}
                </div>
                <div className="text-lg text-gray-600">
                  Você acertou{" "}
                  {
                    quiz.QuizQuestion.filter((q) => answers[q.id] === q.answer)
                      .length
                  }{" "}
                  de {quiz.QuizQuestion.length} questões corretas
                </div>
                <Badge
                  variant={
                    score >= 80
                      ? "default"
                      : score >= 60
                      ? "secondary"
                      : "destructive"
                  }
                  className="mt-2"
                >
                  {score >= 80
                    ? "Excellent!"
                    : score >= 60
                    ? "Good Job!"
                    : "Needs Improvement"}
                </Badge>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Revisão das Questões</h3>
                {quiz.QuizQuestion.map((question, index) => {
                  const userAnswer = answers[question.id];
                  const isCorrect = userAnswer === question.answer;

                  return (
                    <Card
                      key={question.id}
                      className={`border-l-4 ${
                        isCorrect ? "border-l-green-500" : "border-l-red-500"
                      }`}
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
                              Questão {index + 1}: {question.question}
                            </h4>
                            <div className="space-y-1 text-sm">
                              <div className="text-gray-600">
                                Sua resposta:{" "}
                                <span
                                  className={
                                    isCorrect
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }
                                >
                                  {JSON.parse(question.options)[userAnswer]}
                                </span>
                              </div>
                              {!isCorrect && (
                                <div className="text-gray-600">
                                  Resposta Correta:{" "}
                                  <span className="text-green-600">
                                    {
                                      JSON.parse(question.options)[
                                        question.answer
                                      ]
                                    }
                                  </span>
                                </div>
                              )}
                              <div className="text-gray-700 mt-2 p-2 bg-blue-50 rounded">
                                <strong>Explicação:</strong>{" "}
                                {question.explanation}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="flex justify-center space-x-4">
                <Link href="/student/dashboard">
                  <Button>Voltar ao Painel</Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Refazer Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQ = quiz.QuizQuestion[currentQuestion];
  const progress =
    (Object.keys(answers).length / quiz.QuizQuestion.length) * 100;
  const options = JSON.parse(currentQ.options);

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/student/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Painel
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
                <span className="font-mono text-lg">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Questão {currentQuestion + 1} of {quiz.QuizQuestion.length}
              </CardTitle>
              <Badge variant="outline">{Math.round(progress)}% Completo</Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h2 className="text-xl font-medium mb-4">{currentQ.question}</h2>

              <RadioGroup
                value={answers[currentQ.id]?.toString()}
                onValueChange={(value) =>
                  handleAnswerSelect(currentQ.id, Number.parseInt(value))
                }
                key={currentQ.id}
              >
                {options.map((option: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <RadioGroupItem
                      value={index.toString()}
                      id={`option-${index}`}
                    />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex-1 cursor-pointer"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentQuestion(Math.max(0, currentQuestion - 1))
                }
                disabled={currentQuestion === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>

              {currentQuestion === quiz.QuizQuestion.length - 1 ? (
                <Button
                  onClick={handleSubmitQuiz}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={
                    Object.keys(answers).length < quiz.QuizQuestion.length
                  }
                >
                  Enviar Quiz
                </Button>
              ) : (
                <Button
                  onClick={() =>
                    setCurrentQuestion(
                      Math.min(
                        quiz.QuizQuestion.length - 1,
                        currentQuestion + 1
                      )
                    )
                  }
                  disabled={answers[currentQ.id] === undefined}
                >
                  Próximo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Question Navigation */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Questões</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div className="flex flex-wrap gap-3 items-center">
                {quiz.QuizQuestion.map((_, index) => (
                  <Button
                    key={index}
                    variant={
                      currentQuestion === index
                        ? "default"
                        : answers[quiz.QuizQuestion[index].id] !== undefined
                        ? "muted"
                        : "outline"
                    }
                    size="icon"
                    onClick={() => setCurrentQuestion(index)}
                    className="w-16"
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
