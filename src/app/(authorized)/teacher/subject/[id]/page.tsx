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
import { useEffect, useState } from "react";

const mockCourseData = {
  1: {
    title: "Introduction to Computer Science",
    description:
      "A comprehensive introduction to computer science fundamentals",
    students: 28,
    lessons: 12,
    avgProgress: 75,
    lessons_data: [
      {
        id: 1,
        title: "Introduction to Programming",
        completionRate: 100,
        avgTime: "45 min",
      },
      {
        id: 2,
        title: "Variables and Data Types",
        completionRate: 96,
        avgTime: "38 min",
      },
      {
        id: 3,
        title: "Control Structures",
        completionRate: 89,
        avgTime: "52 min",
      },
      {
        id: 4,
        title: "Functions and Methods",
        completionRate: 82,
        avgTime: "48 min",
      },
      {
        id: 5,
        title: "Arrays and Lists",
        completionRate: 75,
        avgTime: "55 min",
      },
      {
        id: 6,
        title: "Object-Oriented Programming",
        completionRate: 68,
        avgTime: "62 min",
      },
      {
        id: 7,
        title: "Inheritance and Polymorphism",
        completionRate: 61,
        avgTime: "58 min",
      },
      {
        id: 8,
        title: "Exception Handling",
        completionRate: 54,
        avgTime: "45 min",
      },
      {
        id: 9,
        title: "File I/O Operations",
        completionRate: 46,
        avgTime: "50 min",
      },
      {
        id: 10,
        title: "Data Structures",
        completionRate: 32,
        avgTime: "65 min",
      },
      {
        id: 11,
        title: "Algorithms and Complexity",
        completionRate: 18,
        avgTime: "70 min",
      },
      { id: 12, title: "Final Project", completionRate: 7, avgTime: "120 min" },
    ],
    students_data: [
      {
        id: 1,
        name: "Alice Johnson",
        email: "alice@example.com",
        progress: 92,
        lastActive: "2 hours ago",
        quizAvg: 88,
      },
      {
        id: 2,
        name: "Bob Smith",
        email: "bob@example.com",
        progress: 85,
        lastActive: "1 day ago",
        quizAvg: 82,
      },
      {
        id: 3,
        name: "Carol Davis",
        email: "carol@example.com",
        progress: 78,
        lastActive: "3 hours ago",
        quizAvg: 91,
      },
      {
        id: 4,
        name: "David Wilson",
        email: "david@example.com",
        progress: 65,
        lastActive: "2 days ago",
        quizAvg: 76,
      },
      {
        id: 5,
        name: "Emma Brown",
        email: "emma@example.com",
        progress: 88,
        lastActive: "5 hours ago",
        quizAvg: 85,
      },
      {
        id: 6,
        name: "Frank Miller",
        email: "frank@example.com",
        progress: 42,
        lastActive: "1 week ago",
        quizAvg: 68,
      },
    ],
    quizzes: [
      {
        id: 1,
        title: "Programming Basics Quiz",
        avgScore: 85,
        completions: 26,
        created: "2024-01-10",
      },
      {
        id: 2,
        title: "Functions and OOP Quiz",
        avgScore: 78,
        completions: 22,
        created: "2024-01-15",
      },
      {
        id: 3,
        title: "Advanced Concepts Quiz",
        avgScore: 72,
        completions: 15,
        created: "2024-01-20",
      },
    ],
  },
};

export default function TeacherCoursePage() {
  const params = useParams();
  const courseId = Number.parseInt(params.id as string);

  const [subject, setSubject] = useState<Subject | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  const [quizzesAnalysis, setQuizzesAnalysis] =
    useState<QuizzesAnalysis | null>(null);

  const [studentsAnalysis, setStudentsAnalysis] =
    useState<StudentsAnalysis | null>(null);

  const [loading, setLoading] = useState(true);

  const fetchData = async (id: number) => {
    try {
      const subjectData = await api.get(`/subjects/${id}`);
      setSubject(subjectData.data);

      const quizData = await api.get(`/subjects/${id}/quiz-analysis`);
      setQuizzesAnalysis(quizData.data);

      const studentAnalysis = await api.get(
        `/subjects/${id}/students-quiz-analytics`
      );
      setStudentsAnalysis(studentAnalysis.data);

      const recentActivityData = await api.get(
        `/subjects/${id}/recent-activity`
      );
      setRecentActivity(recentActivityData.data);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setSubject(null);
      setQuizzesAnalysis(null);
      console.error("Erro ao buscar dados do curso:", error);
    }
  };

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

  const atRiskCount =
    studentsAnalysis?.students.filter((s) => s.percentageScore < 50).length ||
    0;

  const onTrackCount =
    studentsAnalysis?.students.filter((s) => s.percentageScore >= 50).length ||
    0;

  const mostDifficultQuiz = quizzesAnalysis?.quizzes?.length
    ? quizzesAnalysis.quizzes.reduce(
        (prev, current) =>
          prev.percentageScore > current.percentageScore ? prev : current,
        quizzesAnalysis.quizzes[0]
      ).title
    : "Nenhum Quiz Disponível";

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
              <Link href="/teacher/quiz/create">
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
                        {quizzesAnalysis?.averagePercentageScore || 0}%
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
                            Taxa de Acerto: {recentActivity.percentageScore}%
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
                        <div className="text-lg font-bold text-green-600">
                          {quiz.percentageScore}%
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
                            {studentAnalysis.percentageScore | 0}%
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
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Aula
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {subject?.lessons?.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-lg font-bold text-gray-400">
                          #{lesson.id}
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

                      <div className="flex items-center space-x-4">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
                          {((quizzesAnalysis?.totalSubmissions || 0) * 100) /
                            ((quizzesAnalysis?.totalQuizzes || 0) *
                              (subject?.students?.length || 0)) || 0}
                          %
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
