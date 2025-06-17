"use client";

import { LoadingComponent } from "@/components/loading";
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
  BookOpen,
  CheckCircle,
  Clock,
  Play,
  TrendingUp,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const mockCourses = [
  {
    id: 1,
    title: "Introduction to Computer Science",
    instructor: "Dr. Sarah Johnson",
    progress: 75,
    totalLessons: 12,
    completedLessons: 9,
    nextLesson: "Data Structures",
    dueDate: "2024-01-15",
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "Web Development Fundamentals",
    instructor: "Prof. Mike Chen",
    progress: 45,
    totalLessons: 16,
    completedLessons: 7,
    nextLesson: "JavaScript Basics",
    dueDate: "2024-01-20",
    color: "bg-green-500",
  },
  {
    id: 3,
    title: "Database Management Systems",
    instructor: "Dr. Emily Rodriguez",
    progress: 90,
    totalLessons: 10,
    completedLessons: 9,
    nextLesson: "Advanced Queries",
    dueDate: "2024-01-12",
    color: "bg-purple-500",
  },
];

const recentActivity = [
  { type: "quiz", course: "Computer Science", score: 85, date: "2 hours ago" },
  {
    type: "lesson",
    course: "Web Development",
    title: "HTML Basics",
    date: "1 day ago",
  },
  { type: "quiz", course: "Database Systems", score: 92, date: "2 days ago" },
];

export default function StudentDashboard() {
  const [userEmail, setUserEmail] = useState("");
  const [dataSubjects, setDataSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubjects = async () => {
    try {
      const response = await api.get("subjects/student/1");
      setDataSubjects(response.data);
      setLoading(false);

      console.log("Fetched subjects:", response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      setDataSubjects([]);
    }
  };

  useEffect(() => {
    fetchSubjects();
    setUserEmail(localStorage.getItem("userEmail") || "student@example.com");
  }, []);

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo de volta, Aluno!
          </h1>
          <p className="text-gray-600">{userEmail}</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Cursos Inscritos
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dataSubjects.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Horas Estudados
                  </p>
                  <p className="text-2xl font-bold text-gray-900">47</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Trophy className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Média em Questionários
                  </p>
                  <p className="text-2xl font-bold text-gray-900">87%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Progresso Geral
                  </p>
                  <p className="text-2xl font-bold text-gray-900">70%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enrolled Courses */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Meus Cursos</CardTitle>
                <CardDescription>
                  Continue sua jornada de aprendizado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {dataSubjects.length != 0 &&
                  dataSubjects.map((subject) => (
                    <div
                      key={subject.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">
                            {subject.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            Instructor:{" "}
                            {subject?.teachers?.[0]?.name || "Unknown"}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{subject?.lessons?.length ?? 0} aulas</span>
                          </div>
                        </div>
                        <div
                          className={`w-3 h-3 rounded-full bg-green-500`}
                        ></div>
                      </div>

                      <div className="flex items-center justify-end">
                        <Link href={`/student/course/${subject.id}`}>
                          <Button size="sm">
                            <Play className="h-4 w-4 mr-1" />
                            Continuar
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}

                {dataSubjects.length === 0 && (
                  <p className="text-gray-500">
                    Você ainda não está inscrito em nenhum curso.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Atividade Recentes</CardTitle>
                <CardDescription>
                  Suas últimas atividades de aprendizado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    {activity.type === "quiz" ? (
                      <Trophy className="h-5 w-5 text-primary" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {activity.type === "quiz"
                          ? "Quiz Completed"
                          : "Lesson Completed"}
                      </p>
                      <p className="text-xs text-gray-600">
                        {activity.course}
                        {activity.score && ` - Score: ${activity.score}%`}
                        {activity.title && ` - ${activity.title}`}
                      </p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Navegar por Todos os Cursos
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Trophy className="h-4 w-4 mr-2" />
                  Ver Conquistas
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Análise de Desempenho
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
