"use client";

import { LoadingComponent } from "@/components/loading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import {
  ArrowLeft,
  Book,
  Clock,
  Download,
  FileText,
  HelpCircle,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const mockCourseData = {
  1: {
    title: "Introduction to Computer Science",
    instructor: "Dr. Sarah Johnson",
    description:
      "A comprehensive introduction to computer science fundamentals, covering programming concepts, data structures, and algorithms.",
    progress: 75,
    totalLessons: 12,
    completedLessons: 9,
    lessons: [
      {
        id: 1,
        title: "Introduction to Programming",
        type: "video",
        duration: "45 min",
        completed: true,
      },
      {
        id: 2,
        title: "Variables and Data Types",
        type: "video",
        duration: "30 min",
        completed: true,
      },
      {
        id: 3,
        title: "Control Structures",
        type: "video",
        duration: "40 min",
        completed: true,
      },
      {
        id: 4,
        title: "Functions and Methods",
        type: "video",
        duration: "35 min",
        completed: true,
      },
      {
        id: 5,
        title: "Arrays and Lists",
        type: "video",
        duration: "50 min",
        completed: true,
      },
      {
        id: 6,
        title: "Object-Oriented Programming",
        type: "video",
        duration: "60 min",
        completed: true,
      },
      {
        id: 7,
        title: "Inheritance and Polymorphism",
        type: "video",
        duration: "45 min",
        completed: true,
      },
      {
        id: 8,
        title: "Exception Handling",
        type: "video",
        duration: "30 min",
        completed: true,
      },
      {
        id: 9,
        title: "File I/O Operations",
        type: "video",
        duration: "40 min",
        completed: true,
      },
      {
        id: 10,
        title: "Data Structures",
        type: "video",
        duration: "55 min",
        completed: false,
        current: true,
      },
      {
        id: 11,
        title: "Algorithms and Complexity",
        type: "video",
        duration: "50 min",
        completed: false,
      },
      {
        id: 12,
        title: "Final Project",
        type: "assignment",
        duration: "2 hours",
        completed: false,
      },
    ],
    quizzes: [
      {
        id: 1,
        title: "Programming Basics Quiz",
        lessons: "1-3",
        score: 85,
        completed: true,
      },
      {
        id: 2,
        title: "Functions and OOP Quiz",
        lessons: "4-6",
        score: 92,
        completed: true,
      },
      {
        id: 3,
        title: "Advanced Concepts Quiz",
        lessons: "7-9",
        score: null,
        completed: false,
      },
    ],
    materials: [
      { id: 1, title: "Course Syllabus", type: "pdf", size: "2.3 MB" },
      {
        id: 2,
        title: "Programming Reference Guide",
        type: "pdf",
        size: "5.1 MB",
      },
      { id: 3, title: "Code Examples", type: "zip", size: "12.4 MB" },
      { id: 4, title: "Additional Reading List", type: "pdf", size: "1.8 MB" },
    ],
  },
};

export default function CoursePage() {
  const params = useParams();
  const courseId = Number.parseInt(params.id as string);

  const [subject, setSubject] = useState<Subject | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson>({} as Lesson);
  const [loading, setLoading] = useState(true);

  const course = mockCourseData[1];

  const fetchSubject = async (id: number) => {
    try {
      const response = await api.get(`/subjects/${id}`);
      setSubject(response.data);
      setLoading(false);
      setSelectedLesson(subject?.lessons?.[0] || ({} as Lesson));
    } catch (error) {
      console.error("Erro ao buscar curso:", error);
      setLoading(false);
      setSubject(null);
    }
  };

  useEffect(() => {
    fetchSubject(courseId);
  }, []);

  if (loading) {
    return <LoadingComponent />;
  }

  if (!subject) {
    return <div>Curso não encontrado</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/student/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Painel
            </Button>
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {subject.name}
              </h1>
              <p className="text-gray-600 mb-4">
                Instrutor: {subject.teachers?.[0]?.name || "Desconhecido"}
              </p>
              <p className="text-gray-700 max-w-3xl">{subject.code}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="lessons" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="lessons">Aulas</TabsTrigger>
                <TabsTrigger value="quizzes">Questiónarios</TabsTrigger>
                <TabsTrigger value="materials">Materiais</TabsTrigger>
              </TabsList>

              <TabsContent value="lessons" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Materiais do Curso</CardTitle>
                    <CardDescription>
                      Baixe recursos e refências adicionais
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      <div className="space-y-3">
                        {subject.lessons?.map((lesson) => (
                          <AccordionItem
                            value={`lesson-${lesson.id}`}
                            key={lesson.id}
                            className={`p-4 border border rounded-lg cursor-pointer transition-colors ${
                              selectedLesson?.id === lesson.id
                                ? "border-blue-500 bg-blue-50"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <AccordionTrigger
                              className="hover:no-underline"
                              onClick={() => setSelectedLesson(lesson)}
                            >
                              <div>
                                <h3 className="font-medium mb-1">
                                  {lesson.title}
                                </h3>

                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <span className="flex items-center">
                                    {lesson.type === "video" ? (
                                      <Video className="h-4 w-4 mr-1" />
                                    ) : (
                                      <FileText className="h-4 w-4 mr-1" />
                                    )}
                                    {lesson.type}
                                  </span>
                                  <span className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {new Date(
                                      lesson.date
                                    ).toLocaleDateString() ||
                                      "Data não disponível"}
                                  </span>
                                </div>
                              </div>
                            </AccordionTrigger>

                            <AccordionContent>
                              <div className="mt-2">
                                <p className="text-sm text-gray-600">
                                  Lorem ipsum dolor sit amet, consectetur
                                  adipiscing elit. Sed do eiusmod tempor
                                  incididunt ut labore et dolore magna aliqua.
                                  Ut enim ad minim veniam, quis nostrud
                                  exercitation ullamco laboris nisi ut aliquip
                                  ex ea commodo consequat.
                                </p>

                                <div className="mt-4 flex justify-end">
                                  <Button
                                    variant="outline"
                                    className="mt-2"
                                    onClick={() => setSelectedLesson(lesson)}
                                  >
                                    <Book className="h-4 w-4 mr-2" />
                                    Ver Conteúdo
                                  </Button>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </div>
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="quizzes" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Questionários do Curso</CardTitle>
                    <CardDescription>
                      Teste seus conhecimentos com estas avaliações
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {course.quizzes.map((quiz) => (
                        <div
                          key={quiz.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <HelpCircle className="h-5 w-5 text-blue-600" />
                            <div>
                              <h3 className="font-medium">{quiz.title}</h3>
                              <p className="text-sm text-gray-600">
                                Cobre as aulas {quiz.lessons}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            {quiz.completed && quiz.score && (
                              <Badge
                                variant={
                                  quiz.score >= 80 ? "default" : "secondary"
                                }
                              >
                                Pontuação: {quiz.score}%
                              </Badge>
                            )}
                            <Link href={`/student/quiz/${quiz.id}`}>
                              <Button
                                size="sm"
                                variant={quiz.completed ? "outline" : "default"}
                              >
                                {quiz.completed ? "Retake" : "Start Quiz"}
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="materials" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Materiais do Curso</CardTitle>
                    <CardDescription>
                      Baixe recursos e refências adicionais
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {course.materials.map((material) => (
                        <div
                          key={material.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-gray-600" />
                            <div>
                              <h3 className="font-medium">{material.title}</h3>
                              <p className="text-sm text-gray-600">
                                {material.type.toUpperCase()} • {material.size}
                              </p>
                            </div>
                          </div>

                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {selectedLesson.id && (
              <Card>
                <CardHeader>
                  <CardTitle>Aula Atual</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">
                        {selectedLesson.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                        <span className="flex items-center">
                          {selectedLesson.type === "video" ? (
                            <Video className="h-4 w-4 mr-1" />
                          ) : (
                            <FileText className="h-4 w-4 mr-1" />
                          )}
                          {selectedLesson.type}
                        </span>
                      </div>
                    </div>

                    <Button className="w-full">
                      <Book className="h-4 w-4 mr-2" />
                      Ver Conteudo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Progresso do Curso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1"></div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Aulas:</span>
                      <span className="font-medium">
                        {subject.lessons?.length || 0}{" "}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Média dos Questionários:</span>
                      <span className="font-medium">88%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
