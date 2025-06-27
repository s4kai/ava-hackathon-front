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

export default function CoursePage() {
  const params = useParams();
  const courseId = Number.parseInt(params.id as string);

  const [subject, setSubject] = useState<Subject | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson>({} as Lesson);
  const [loading, setLoading] = useState(true);

  const fetchSubject = async (id: number) => {
    try {
      const response = await api.get(`/subjects/${id}`, {
        data: {
          studentId: 1, // Assuming a static student ID for now
        },
      });
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
    <div className="min-h-screen max-w-7xl w-full bg-gray-50 p-6">
      <div className="mx-auto">
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
              <p className="text-gray-600 mb-4"></p>
              <p className="text-gray-700 max-w-3xl">{subject.code}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Lições</CardTitle>
                <CardDescription>
                  Acesse as lições, questionários e materiais da disciplina
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <div className="space-y-3">
                    {subject.lessons?.map((lesson) => (
                      <AccordionItem
                        value={`lesson-${lesson.id}`}
                        key={lesson.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedLesson?.id === lesson.id
                            ? "border-blue-500"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <AccordionTrigger
                          className="hover:no-underline"
                          onClick={() => setSelectedLesson(lesson)}
                        >
                          <div>
                            <h3 className="font-medium mb-1">{lesson.title}</h3>

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
                                {new Date(lesson.date).toLocaleDateString() ||
                                  "Data não disponível"}
                              </span>
                            </div>
                          </div>
                        </AccordionTrigger>

                        <AccordionContent>
                          <div className="mt-2 flex flex-col md:flex-row items-center justify-between p-4 border rounded-lg gap-4">
                            <div className="w-full max-w-lg flex">
                              <p className="text-sm text-gray-600 break-words items-center">
                                {lesson.description ||
                                  "Nenhuma descrição disponível"}
                              </p>
                            </div>

                            <div className="w-full md:w-auto mt-2 md:mt-0 flex justify-end">
                              <Button
                                variant="outline"
                                className="whitespace-nowrap"
                                onClick={() => setSelectedLesson(lesson)}
                              >
                                <Book className="h-4 w-4 mr-2" />
                                Ver Conteúdo
                              </Button>
                            </div>
                          </div>
                        </AccordionContent>

                        <AccordionContent className="overflow-auto transition-all duration-300">
                          <div className="space-y-4">
                            {lesson.quiz.name !== undefined && (
                              <div
                                key={lesson.quiz.id}
                                className="flex items-center justify-between p-4 border rounded-lg"
                              >
                                <div className="flex items-center space-x-3">
                                  <HelpCircle className="h-5 w-5 text-blue-600" />
                                  <div>
                                    <h3 className="font-medium">
                                      {lesson.quiz.name}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                      {lesson.quiz.description ||
                                        "Nenhuma descrição disponível"}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                  {lesson.quiz.wasTaken && (
                                    <Badge variant={"default"}>
                                      Pontuação: %
                                    </Badge>
                                  )}
                                  <Link
                                    href={`/student/quiz/${lesson.quiz.id}`}
                                  >
                                    <Button
                                      size="sm"
                                      variant={
                                        lesson.quiz.wasTaken
                                          ? "outline"
                                          : "default"
                                      }
                                    >
                                      {lesson.quiz.wasTaken
                                        ? "Retake"
                                        : "Start Quiz"}
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            )}
                          </div>
                        </AccordionContent>

                        <AccordionContent className="overflow-auto transition-all duration-300">
                          <div className="space-y-3">
                            {lesson.customMaterials?.map((material) => (
                              <div
                                key={material.id}
                                className="flex items-center justify-between p-4 border rounded-lg"
                              >
                                <div className="flex items-center space-x-3">
                                  <FileText className="h-5 w-5 text-gray-600" />
                                  <div>
                                    <h3 className="font-medium">
                                      {material.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                      {material.title.toUpperCase()} • 30
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
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </div>
                </Accordion>
              </CardContent>
            </Card>
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
