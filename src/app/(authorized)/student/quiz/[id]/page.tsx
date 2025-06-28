"use client";

import { LoadingComponent } from "@/components/loading";
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
import { api } from "@/lib/api";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  Loader,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function QuizPage() {
  const params = useParams();
  const quizId = Number.parseInt(params.id as string);

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [timeLeft, setTimeLeft] = useState(1800); // default 30min
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const [currentQ, setCurrentQ] = useState<Question | null>(null);
  const [progress, setProgress] = useState(0);
  const [options, setOptions] = useState<string[]>([]);

  const [customMaterialCompleted, setCustomMaterialCompleted] = useState(false);
  const [customMaterialId, setCustomMaterialId] = useState<number | null>(null);

  // Carrega o quiz
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await api.get(`/quizzes/${quizId}`);
        setQuiz(response.data);
        setLoading(false);

        const initialTime = response.data?.timeLimit
          ? response.data.timeLimit * 60
          : 1800;

        setTimeLeft(initialTime);
      } catch (error) {
        console.error("Erro ao buscar quiz:", error);
        setLoading(false);
      }
    };

    if (quizId) fetchQuizData();
  }, [quizId]);

  // Atualiza a questão atual e progresso
  useEffect(() => {
    if (quiz && quiz.QuizQuestion?.length > 0) {
      const q = quiz.QuizQuestion[currentQuestion];
      const opts = JSON.parse(q.options as string);
      const answered = Object.keys(answers).length;
      const prog = (answered / quiz.QuizQuestion.length) * 100;

      setCurrentQ(q);
      setOptions(opts);
      setProgress(prog);
    }
  }, [quiz, currentQuestion, answers]);

  // Timer
  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !quizCompleted) {
      handleSubmitQuiz();
    }
  }, [timeLeft, quizCompleted]);

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const handleSubmitQuiz = async () => {
    setQuizCompleted(true);
    setShowResults(true);
    // Save the quiz results
    try {
      const quizSubmitResult = await api.post(`/quizzes/submit`, {
        quizId: quiz?.id,
        studentId: 1, // Replace with actual student ID
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          questionId: Number(questionId),
          answer,
        })),
      });

      toast.success(
        "Quiz enviado com sucesso, seu material customizado esta sendo gerado",
        {
          duration: 3000,
        }
      );

      setCustomMaterialCompleted(true);
      setCustomMaterialId(quizSubmitResult.data.customMaterialId);
    } catch (error) {
      console.error("Erro ao enviar quiz:", error);
    }
  };

  const calculateScore = () => {
    if (!quiz) return 0;

    const correct = quiz.QuizQuestion.filter(
      (q) => answers[q.id] === q.answer
    ).length;

    return Math.round((correct / quiz.QuizQuestion.length) * 100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return <LoadingComponent />;
  }

  if (!quiz) {
    return (
      <div className="p-6 text-center text-red-500">Quiz não encontrado.</div>
    );
  }

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
                  de {quiz.QuizQuestion.length} questões
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
                    ? "Excelente!"
                    : score >= 60
                    ? "Bom trabalho!"
                    : "Precisa melhorar"}
                </Badge>
              </div>

              {/* Revisão das questões */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Revisão das Questões</h3>
                {quiz.QuizQuestion.map((question, index) => {
                  const userAnswer = answers[question.id];
                  const isCorrect = userAnswer === question.answer;
                  const opts = JSON.parse(question.options as string);

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
                                  {opts[userAnswer]}
                                </span>
                              </div>
                              {!isCorrect && (
                                <div className="text-gray-600">
                                  Resposta correta:{" "}
                                  <span className="text-green-600">
                                    {opts[question.answer as number]}
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
                <Button variant="outline" disabled={!customMaterialCompleted}>
                  {customMaterialCompleted ? (
                    <Link
                      href={`/student/custom-material/${customMaterialId}`}
                      className="flex items-center"
                    >
                      Material Customizado Gerado
                    </Link>
                  ) : (
                    <>
                      Seu material personalizado esta sendo gerado{" "}
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
            <div className="flex items-center space-x-4 text-orange-600">
              <Clock className="h-5 w-5 mr-1" />
              <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>

        {/* QUESTÃO ATUAL */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Questão {currentQuestion + 1} de {quiz.QuizQuestion.length}
              </CardTitle>
              <Badge variant="outline">{Math.round(progress)}% Completo</Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h2 className="text-xl font-medium mb-4">{currentQ?.question}</h2>

              <RadioGroup
                value={answers[currentQ?.id || 0]?.toString()}
                onValueChange={(value) =>
                  handleAnswerSelect(currentQ!.id, parseInt(value))
                }
                key={currentQ?.id}
              >
                {options.map((option, index) => (
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
                  disabled={!currentQ || answers[currentQ.id] === undefined}
                >
                  Próximo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navegação por questões */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Navegar pelas Questões</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-center gap-3">
              {quiz.QuizQuestion.map((q, index) => (
                <Button
                  key={q.id}
                  variant={
                    currentQuestion === index
                      ? "default"
                      : answers[q.id] !== undefined
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
