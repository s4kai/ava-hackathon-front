"use client";
import { LoadingComponent } from "@/components/loading";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  AlertCircle,
  ArrowLeft,
  BarChart3,
  BookOpen,
  CheckCircle,
  Clock,
  Edit,
  Plus,
  Trash2,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function TeacherCoursePage() {
  const params = useParams();
  const courseId = Number(params.id);

  const [subject, setSubject] = useState<Subject | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [quizzesAnalysis, setQuizzesAnalysis] =
    useState<QuizzesAnalysis | null>(null);
  const [studentsAnalysis, setStudentsAnalysis] =
    useState<StudentsAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch all data in parallel
  const fetchData = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const [subjectRes, quizzesRes, studentsRes, recentRes] =
        await Promise.all([
          api.post(`/subjects/${id}`),
          api.get(`/subjects/${id}/quiz-analysis`),
          api.get(`/subjects/${id}/students-quiz-analytics`),
          api.get(`/subjects/${id}/recent-activity`),
        ]);

      setSubject(subjectRes.data);
      setQuizzesAnalysis(quizzesRes.data);
      setStudentsAnalysis(studentsRes.data);
      setRecentActivity(recentRes.data);
    } catch (error) {
      console.error("Erro ao buscar dados do curso:", error);
      setSubject(null);
      setQuizzesAnalysis(null);
      setStudentsAnalysis(null);
      setRecentActivity([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!Number.isNaN(courseId)) {
      fetchData(courseId);
    }
  }, [courseId, fetchData]);

  const atRiskCount = useMemo(() => {
    return (
      studentsAnalysis?.students.filter((s) => s.percentageScore < 50).length ??
      0
    );
  }, [studentsAnalysis]);

  const onTrackCount = useMemo(() => {
    return (
      studentsAnalysis?.students.filter((s) => s.percentageScore >= 50)
        .length ?? 0
    );
  }, [studentsAnalysis]);

  const mostDifficultQuiz = useMemo(() => {
    if (!quizzesAnalysis?.quizzes?.length) return "Nenhum Quiz Disponível";
    return quizzesAnalysis.quizzes.reduce((prev, current) =>
      prev.percentageScore < current.percentageScore ? prev : current
    ).title;
  }, [quizzesAnalysis]);

  useEffect(() => {
    fetchData(courseId);
  }, [courseId]);

  if (loading) {
    return <LoadingComponent />;
  }

  const getDifficultyLabel = (score: number): string => {
    if (score >= 80) return "Fácil";
    if (score >= 50) return "Média";
    return "Difícil";
  };

  const getColorClass = (score: number): string => {
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  function calculateSubmissionRate(
    totalSubmissions: number,
    totalQuizzes: number,
    totalStudents: number
  ): string {
    if (totalQuizzes === 0 || totalStudents === 0) return "0%";
    const rate = (totalSubmissions * 100) / (totalQuizzes * totalStudents);
    return `${rate.toFixed(2)}%`;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/teacher/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Painel
            </Button>
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {subject?.name}
              </h1>
              <p className="text-gray-600 mb-4"></p>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {subject?.students?.length} Alunos
                </span>
                <span className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {subject?.lessons?.length} Aulas
                </span>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link href={`/teacher/quiz/create?subjectId=${courseId}`}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Quiz
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="students">Alunos</TabsTrigger>
            <TabsTrigger value="lessons">Aulas</TabsTrigger>
            <TabsTrigger value="analytics">Análises</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Alunos Matriculados
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {subject?.students?.length || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Média de Quizzes
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {quizzesAnalysis?.averagePercentageScore.toFixed(2) ||
                          0}
                        %
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Maior Nota
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {quizzesAnalysis?.highestScore || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <TrendingDown className="h-8 w-8 text-red-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Menor Nota
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {quizzesAnalysis?.lowestScore || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Atividade Recente dos Alunos</CardTitle>
                  <CardDescription>Últimos envios e conclusões</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.map((recentActivity) => (
                    <div
                      key={`${recentActivity.quizId}-${recentActivity.studentId}`}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>
                            {recentActivity.studentName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {recentActivity.studentName}
                          </p>
                          <p className="text-sm text-gray-600">
                            Taxa de Acerto:{" "}
                            {recentActivity.percentageScore.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="default">
                          {getDifficultyLabel(recentActivity.percentageScore)}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(
                            recentActivity.createdAt
                          ).toLocaleDateString("pt-BR", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Desempenho nos Quiz</CardTitle>
                  <CardDescription>
                    Estatísticas recentes dos quiz
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {quizzesAnalysis?.quizzes.map((quiz) => (
                    <div
                      key={quiz.quizId}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{quiz.title}</h4>
                        <p className="text-sm text-gray-600">
                          {quiz.totalSubmissions} conclusões
                        </p>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-lg font-bold ${getColorClass(
                            quiz.percentageScore
                          )}`}
                        >
                          {quiz.percentageScore.toFixed(2)}%
                        </div>
                        <p className="text-xs text-gray-500">
                          Dificuldade:{" "}
                          {getDifficultyLabel(quiz.percentageScore)}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Desempenho dos Alunos</CardTitle>
                <CardDescription>
                  Acompanhe o progresso e desempenho individual dos alunos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentsAnalysis?.students.map((studentAnalysis) => (
                    <div
                      key={studentAnalysis.studentId}
                      className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>
                            {studentAnalysis.student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">
                            {studentAnalysis.student.name}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-lg font-bold">
                            {studentAnalysis.totalQuizzes}
                          </div>
                          <div className="text-xs text-gray-600">
                            Submissoes
                          </div>
                        </div>

                        <div className="text-center">
                          <div
                            className={`text-lg font-bold ${getColorClass(
                              studentAnalysis.percentageScore
                            )}`}
                          >
                            {(studentAnalysis.percentageScore | 0).toFixed(2)}%
                          </div>
                          <div className="text-xs text-gray-600">
                            Média de taxa de acerto
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            Ver Detalhes
                          </Button>
                          <Button size="sm" variant="outline">
                            Mensagem
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lessons" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Aulas do Curso</CardTitle>
                  <CardDescription>
                    Gerencie o conteúdo das aulas e acompanhe as taxas de
                    conclusão
                  </CardDescription>
                </div>
                <Link href={`/teacher/lesson/create?subjectId=${courseId}`}>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Aula
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {subject?.lessons?.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-lg font-bold text-gray-400">
                          #{index + 1}
                        </div>
                        <div>
                          <h3 className="font-medium">{lesson.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {new Date(lesson.date).toLocaleDateString(
                                "pt-BR",
                                {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1  gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tendências de Desempenho</CardTitle>
                  <CardDescription>
                    Engajamento dos alunos e taxas de conclusão
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Alunos em risco ({"<"}50% compreensao)</span>
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                        <span className="font-bold">{atRiskCount} alunos</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Alunos no caminho ({">"}50% compreensao)</span>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <span className="font-bold">{onTrackCount} alunos</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Tempo médio por quiz</span>
                      <span className="font-bold">
                        {quizzesAnalysis?.avgTimeTaken || 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Taxa de participação em quizzes</span>
                      <div className="flex items-center">
                        <span className="font-bold">
                          {calculateSubmissionRate(
                            quizzesAnalysis?.totalSubmissions ?? 0,
                            quizzesAnalysis?.totalQuizzes ?? 0,
                            subject?.students?.length ?? 0
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Quiz Mais Dificil</span>
                      <span className="font-bold">{mostDifficultQuiz}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
