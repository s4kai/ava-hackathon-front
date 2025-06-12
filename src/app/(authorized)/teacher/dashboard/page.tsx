"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, BookOpen, TrendingUp, Clock, Plus, Eye, Edit, BarChart3, GraduationCap, Award } from "lucide-react"
import Link from "next/link"

const mockClasses = [
  {
    id: 1,
    title: "Introduction to Computer Science",
    students: 28,
    lessons: 12,
    avgProgress: 75,
    nextClass: "Today, 2:00 PM",
    recentActivity: "3 new quiz submissions",
  },
  {
    id: 2,
    title: "Web Development Fundamentals",
    students: 22,
    lessons: 16,
    avgProgress: 45,
    nextClass: "Tomorrow, 10:00 AM",
    recentActivity: "5 students completed Lesson 7",
  },
  {
    id: 3,
    title: "Database Management Systems",
    students: 19,
    lessons: 10,
    avgProgress: 90,
    nextClass: "Friday, 1:00 PM",
    recentActivity: "Final project submissions due",
  },
]

const recentActivity = [
  {
    type: "submission",
    student: "Alice Johnson",
    course: "Computer Science",
    item: "Quiz 3",
    score: 92,
    time: "2 hours ago",
  },
  { type: "completion", student: "Bob Smith", course: "Web Development", item: "Lesson 7", time: "4 hours ago" },
  { type: "submission", student: "Carol Davis", course: "Database Systems", item: "Final Project", time: "1 day ago" },
  { type: "question", student: "David Wilson", course: "Computer Science", item: "Data Structures", time: "1 day ago" },
]

export default function TeacherDashboard() {
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    setUserEmail(localStorage.getItem("userEmail") || "teacher@example.com")
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo de volta, Professor!</h1>
          <p className="text-gray-600">{userEmail}</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Alunos</p>
                  <p className="text-2xl font-bold text-gray-900">69</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Cursos Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Progresso Médio</p>
                  <p className="text-2xl font-bold text-gray-900">70%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Award className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Nota Média em Quizzes</p>
                  <p className="text-2xl font-bold text-gray-900">84%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Classes */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Minhas Turmas</CardTitle>
                  <CardDescription>Gerencie seus cursos e acompanhe o progresso dos alunos</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Curso
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {mockClasses.map((course) => (
                  <div key={course.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                        <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {course.students} alunos
                          </span>
                          <span className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-1" />
                            {course.lessons} lições
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {course.nextClass}
                          </span>
                        </div>
                        <p className="text-sm text-blue-600">{course.recentActivity}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progresso Médio</span>
                        <span>{course.avgProgress}%</span>
                      </div>
                      <Progress value={course.avgProgress} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{course.students} matriculados</Badge>
                      <div className="flex space-x-2">
                        <Link href={`/teacher/course/${course.id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            Visualizar
                          </Button>
                        </Link>
                        <Button size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Gerenciar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
                <CardDescription>Últimas interações dos alunos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      {activity.type === "submission" ? (
                        <Award className="h-5 w-5 text-green-600" />
                      ) : activity.type === "completion" ? (
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Users className="h-5 w-5 text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.student}</p>
                      <p className="text-sm text-gray-600">
                        {activity.type === "submission"
                          ? "Submitted"
                          : activity.type === "completion"
                            ? "Completed"
                            : "Asked about"}{" "}
                        {activity.item}
                        {activity.score && ` (${activity.score}%)`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.course} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/teacher/quiz/create">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Quiz com IA
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Ver Análises
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Avaliar Tarefas
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Desempenho dos Alunos
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
