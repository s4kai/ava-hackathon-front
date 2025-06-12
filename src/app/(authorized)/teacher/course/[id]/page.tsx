"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Users,
  BookOpen,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

const mockCourseData = {
  1: {
    title: "Introduction to Computer Science",
    description: "A comprehensive introduction to computer science fundamentals",
    students: 28,
    lessons: 12,
    avgProgress: 75,
    lessons_data: [
      { id: 1, title: "Introduction to Programming", completionRate: 100, avgTime: "45 min" },
      { id: 2, title: "Variables and Data Types", completionRate: 96, avgTime: "38 min" },
      { id: 3, title: "Control Structures", completionRate: 89, avgTime: "52 min" },
      { id: 4, title: "Functions and Methods", completionRate: 82, avgTime: "48 min" },
      { id: 5, title: "Arrays and Lists", completionRate: 75, avgTime: "55 min" },
      { id: 6, title: "Object-Oriented Programming", completionRate: 68, avgTime: "62 min" },
      { id: 7, title: "Inheritance and Polymorphism", completionRate: 61, avgTime: "58 min" },
      { id: 8, title: "Exception Handling", completionRate: 54, avgTime: "45 min" },
      { id: 9, title: "File I/O Operations", completionRate: 46, avgTime: "50 min" },
      { id: 10, title: "Data Structures", completionRate: 32, avgTime: "65 min" },
      { id: 11, title: "Algorithms and Complexity", completionRate: 18, avgTime: "70 min" },
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
      { id: 2, name: "Bob Smith", email: "bob@example.com", progress: 85, lastActive: "1 day ago", quizAvg: 82 },
      { id: 3, name: "Carol Davis", email: "carol@example.com", progress: 78, lastActive: "3 hours ago", quizAvg: 91 },
      { id: 4, name: "David Wilson", email: "david@example.com", progress: 65, lastActive: "2 days ago", quizAvg: 76 },
      { id: 5, name: "Emma Brown", email: "emma@example.com", progress: 88, lastActive: "5 hours ago", quizAvg: 85 },
      { id: 6, name: "Frank Miller", email: "frank@example.com", progress: 42, lastActive: "1 week ago", quizAvg: 68 },
    ],
    quizzes: [
      { id: 1, title: "Programming Basics Quiz", avgScore: 85, completions: 26, created: "2024-01-10" },
      { id: 2, title: "Functions and OOP Quiz", avgScore: 78, completions: 22, created: "2024-01-15" },
      { id: 3, title: "Advanced Concepts Quiz", avgScore: 72, completions: 15, created: "2024-01-20" },
    ],
  },
}

export default function TeacherCoursePage() {
  const params = useParams()
  const courseId = Number.parseInt(params.id as string)
  const course = mockCourseData[courseId as keyof typeof mockCourseData]

  if (!course) {
    return <div>Curso não encontrado</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {course.students} Alunos
                </span>
                <span className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {course.lessons} Aulas
                </span>
                <span className="flex items-center">
                  <BarChart3 className="h-4 w-4 mr-1" />
                  {course.avgProgress}% Progresso Médio
                </span>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Editar Curso
              </Button>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Alunos Matriculados</p>
                      <p className="text-2xl font-bold text-gray-900">{course.students}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Progresso Médio</p>
                      <p className="text-2xl font-bold text-gray-900">{course.avgProgress}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Média de Quizzes</p>
                      <p className="text-2xl font-bold text-gray-900">82%</p>
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
                  {course.students_data.slice(0, 5).map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-600">Progresso: {student.progress}%</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            student.progress >= 80 ? "default" : student.progress >= 60 ? "secondary" : "destructive"
                          }
                        >
                          {student.progress >= 80 ? "On Track" : student.progress >= 60 ? "Behind" : "At Risk"}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{student.lastActive}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Desempenho nos Quiz</CardTitle>
                  <CardDescription>Estatísticas recentes dos quiz</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {course.quizzes.map((quiz) => (
                    <div key={quiz.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{quiz.title}</h4>
                        <p className="text-sm text-gray-600">{quiz.completions} conclusões</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">{quiz.avgScore}%</div>
                        <p className="text-xs text-gray-500">Média</p>
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
                <CardDescription>Acompanhe o progresso e desempenho individual dos alunos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.students_data.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{student.name}</h3>
                          <p className="text-sm text-gray-600">{student.email}</p>
                          <p className="text-xs text-gray-500">Última atividade: {student.lastActive}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-lg font-bold">{student.progress}%</div>
                          <div className="text-xs text-gray-600">Progresso</div>
                          <Progress value={student.progress} className="w-20 h-2 mt-1" />
                        </div>

                        <div className="text-center">
                          <div className="text-lg font-bold">{student.quizAvg}%</div>
                          <div className="text-xs text-gray-600">Média de Quizzes</div>
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
                  <CardDescription>Gerencie o conteúdo das aulas e acompanhe as taxas de conclusão</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Aula
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {course.lessons_data.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-lg font-bold text-gray-400">#{lesson.id}</div>
                        <div>
                          <h3 className="font-medium">{lesson.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {lesson.avgTime}
                            </span>
                            <span className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {Math.round((lesson.completionRate / 100) * course.students)} concluíram
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-lg font-bold">{lesson.completionRate}%</div>
                          <div className="text-xs text-gray-600">Conclusão</div>
                          <Progress value={lesson.completionRate} className="w-20 h-2 mt-1" />
                        </div>

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tendências de Desempenho</CardTitle>
                  <CardDescription>Engajamento dos alunos e taxas de conclusão</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Alunos em risco ({"<"}50% progress)</span>
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                        <span className="font-bold">3 alunos</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Alunos no caminho ({">"}80% progress)</span>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <span className="font-bold">18 students</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Tempo médio por aula</span>
                      <span className="font-bold">52 minutes</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Aula mais desafiadora</span>
                      <span className="font-bold">Estruturas de Dados</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estruturas de Dados</CardTitle>
                  <CardDescription>Atividade e participação dos alunos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Alunos ativos diariamente</span>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="font-bold">22/28</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Taxa de participação em quizzes</span>
                      <div className="flex items-center">
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                        <span className="font-bold">78%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Duração média da sessão</span>
                      <span className="font-bold">45 minutes</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Perguntas feitas esta semana</span>
                      <span className="font-bold">12</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
