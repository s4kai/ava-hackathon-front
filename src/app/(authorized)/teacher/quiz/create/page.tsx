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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeClosed,
  Loader2,
  Plus,
  Save,
  Trash2,
  Wand2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Question {
  id: number;
  question: string;
  type: "multiple-choice" | "true-false" | "short-answer";
  options?: string[];
  correct?: number | string;
  explanation?: string;
}

export default function CreateQuizPage() {
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [timeLimit, setTimeLimit] = useState("30");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiDifficulty, setAiDifficulty] = useState("");
  const [aiQuestionCount, setAiQuestionCount] = useState("5");
  const [isPreview, setIsPreview] = useState(false);

  const courses = [
    { id: 1, title: "Introduction to Computer Science" },
    { id: 2, title: "Web Development Fundamentals" },
    { id: 3, title: "Database Management Systems" },
  ];

  const addQuestion = () => {
    setIsPreview(false);

    const newQuestion: Question = {
      id: Date.now(),
      question: "",
      type: "multiple-choice",
      options: ["", "", "", ""],
      correct: 0,
      explanation: "",
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: number, field: keyof Question, value: any) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const deleteQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const generateAIQuiz = async () => {
    if (!aiTopic || !aiDifficulty) return;

    setIsGenerating(true);

    try {
      const response = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: aiTopic,
          difficulty: aiDifficulty,
          questionCount: Number.parseInt(aiQuestionCount),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions);
        setQuizTitle(data.title);
        setQuizDescription(data.description);
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveQuiz = () => {
    // In a real app, this would save to a database
    console.log("Saving quiz:", {
      title: quizTitle,
      description: quizDescription,
      course: selectedCourse,
      timeLimit,
      questions,
    });
    alert("Quiz saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/teacher/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Painel
            </Button>
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Criar Novo Quiz
              </h1>
              <p className="text-gray-600">
                Crie avaliações para seus alunos
              </p>
            </div>
            <div className="flex space-x-3">
              <Button onClick={saveQuiz}>
                <Save className="h-4 w-4 mr-2" />
                Salvar Quiz
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Quiz</CardTitle>
              <CardDescription>
                Configure as informações básicas do quiz
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quiz-title">Título do Quiz</Label>
                  <Input
                    id="quiz-title"
                    placeholder="Enter quiz title"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course-select">Curso</Label>
                  <Select
                    value={selectedCourse}
                    onValueChange={setSelectedCourse}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem
                          key={course.id}
                          value={course.id.toString()}
                        >
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quiz-description">Descrição</Label>
                <Textarea
                  id="quiz-description"
                  placeholder="Enter quiz description"
                  value={quizDescription}
                  onChange={(e) => setQuizDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time-limit">Tempo Limite (minutos)</Label>
                <Input
                  id="time-limit"
                  type="number"
                  placeholder="30"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(e.target.value)}
                  className="w-32"
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wand2 className="h-5 w-5 mr-2" />
                Geração de Quiz por IA
              </CardTitle>
              <CardDescription>
                Gere perguntas de quiz automaticamente usando IA com base no seu
                tópico e requisitos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ai-topic">Tópico</Label>
                  <Input
                    id="ai-topic"
                    placeholder="e.g., JavaScript fundamentals"
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ai-difficulty">Nível de Dificuldade</Label>
                  <Select value={aiDifficulty} onValueChange={setAiDifficulty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Iniciante</SelectItem>
                      <SelectItem value="intermediate">Intermediário</SelectItem>
                      <SelectItem value="advanced">Avançado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ai-count">Número de Perguntas</Label>
                  <Select
                    value={aiQuestionCount}
                    onValueChange={setAiQuestionCount}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 Perguntas</SelectItem>
                      <SelectItem value="10">10 Perguntas</SelectItem>
                      <SelectItem value="15">15 Perguntas</SelectItem>
                      <SelectItem value="20">20 Perguntas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={generateAIQuiz}
                disabled={!aiTopic || !aiDifficulty || isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Gerando Quiz...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Gerar Quiz com IA
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
          {/* Questions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Perguntas</CardTitle>
                <CardDescription>
                  Adicione e configure as perguntas do quiz
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsPreview(!isPreview)}
                >
                  {isPreview ? (
                    <Eye className="h-4 w-4 mr-2" />
                  ) : (
                    <EyeClosed className="h-4 w-4 mr-2" />
                  )}
                  Pré-visualizar
                </Button>

                <Button onClick={addQuestion}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Pergunta
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {isPreview && (
                <>
                  {questions.length > 0 && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">
                          Perguntas Geradas
                        </h3>
                        <Badge variant="secondary">
                          {questions.length} perguntas
                        </Badge>
                      </div>

                      <div className="space-y-4">
                        {questions.map((question, index) => (
                          <Card
                            key={question.id}
                            className="border-l-4 border-l-green-500"
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium mb-2">
                                    Pergunta {index + 1}: {question.question}
                                  </h4>
                                  {question.options && (
                                    <div className="space-y-1 text-sm">
                                      {question.options.map(
                                        (option, optionIndex) => (
                                          <div
                                            key={optionIndex}
                                            className={`flex items-center ${
                                              question.correct === optionIndex
                                                ? "text-green-600 font-medium"
                                                : "text-gray-600"
                                            }`}
                                          >
                                            <span className="mr-2">
                                              {String.fromCharCode(
                                                65 + optionIndex
                                              )}
                                              .
                                            </span>
                                            {option}
                                            {question.correct ===
                                              optionIndex && (
                                              <CheckCircle className="h-4 w-4 ml-2" />
                                            )}
                                          </div>
                                        )
                                      )}
                                    </div>
                                  )}
                                  {question.explanation && (
                                    <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                                      <strong>Explicação:</strong>{" "}
                                      {question.explanation}
                                    </div>
                                  )}
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => deleteQuestion(question.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
              {isPreview == false && (
                <>
                  {questions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                    Nenhuma pergunta adicionada ainda. Clique em "Adicionar Pergunta" para começar.
                    </div>
                  ) : (
                    questions.map((question, index) => (
                      <Card
                        key={question.id}
                        className="border-l-4 border-l-blue-500"
                      >
                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle className="text-lg">
                            Pergunta {index + 1}
                          </CardTitle>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteQuestion(question.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label>Tipo de Pergunta</Label>
                            <Select
                              value={question.type}
                              onValueChange={(value) =>
                                updateQuestion(question.id, "type", value)
                              }
                            >
                              <SelectTrigger className="w-48">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="multiple-choice">
                                  Múltipla Escolha
                                </SelectItem>
                                <SelectItem value="true-false">
                                  Verdadeiro/Falso
                                </SelectItem>
                                <SelectItem value="short-answer">
                                  Resposta Curta
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Pergunta</Label>
                            <Textarea
                              placeholder="Enter your question"
                              value={question.question}
                              onChange={(e) =>
                                updateQuestion(
                                  question.id,
                                  "question",
                                  e.target.value
                                )
                              }
                            />
                          </div>

                          {question.type === "multiple-choice" && (
                            <div className="space-y-2">
                              <Label>Opções de Resposta</Label>
                              <RadioGroup
                                value={question.correct?.toString()}
                                onValueChange={(value) =>
                                  updateQuestion(
                                    question.id,
                                    "correct",
                                    Number.parseInt(value)
                                  )
                                }
                              >
                                {question.options?.map(
                                  (option, optionIndex) => (
                                    <div
                                      key={optionIndex}
                                      className="flex items-center space-x-2"
                                    >
                                      <RadioGroupItem
                                        value={optionIndex.toString()}
                                        id={`q${question.id}-option${optionIndex}`}
                                      />
                                      <Input
                                        placeholder={`Option ${
                                          optionIndex + 1
                                        }`}
                                        value={option}
                                        onChange={(e) => {
                                          const newOptions = [
                                            ...(question.options || []),
                                          ];
                                          newOptions[optionIndex] =
                                            e.target.value;
                                          updateQuestion(
                                            question.id,
                                            "options",
                                            newOptions
                                          );
                                        }}
                                        className="flex-1"
                                      />
                                      <Label
                                        htmlFor={`q${question.id}-option${optionIndex}`}
                                        className="text-sm text-gray-500"
                                      >
                                        {question.correct === optionIndex && (
                                          <CheckCircle className="h-4 w-4 text-green-500" />
                                        )}
                                      </Label>
                                    </div>
                                  )
                                )}
                              </RadioGroup>
                            </div>
                          )}

                          {question.type === "true-false" && (
                            <div className="space-y-2">
                              <Label>Resposta Correta</Label>
                              <RadioGroup
                                value={question.correct?.toString()}
                                onValueChange={(value) =>
                                  updateQuestion(question.id, "correct", value)
                                }
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="true"
                                    id={`q${question.id}-true`}
                                  />
                                  <Label htmlFor={`q${question.id}-true`}>
                                    Verdadeiro
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="false"
                                    id={`q${question.id}-false`}
                                  />
                                  <Label htmlFor={`q${question.id}-false`}>
                                    Falso
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>
                          )}

                          <div className="space-y-2">
                            <Label>Explicação (Opcional)</Label>
                            <Textarea
                              placeholder="Explain the correct answer"
                              value={question.explanation}
                              onChange={(e) =>
                                updateQuestion(
                                  question.id,
                                  "explanation",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
