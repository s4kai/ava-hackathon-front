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
import { api } from "@/lib/api";
import {
  Award,
  BarChart3,
  BookOpen,
  Eye,
  GraduationCap,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TeacherDashboard() {
  const [userEmail, setUserEmail] = useState("");
  const [dataSubjects, setDataSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubjects = async () => {
    try {
      const response = await api.get("subjects/teacher/1");
      setDataSubjects(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setDataSubjects([]);
    }
  };

  useEffect(() => {
    fetchSubjects();
    setUserEmail(localStorage.getItem("userEmail") || "teacher@example.com");
  }, []);

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo de volta, Professor!
          </h1>
          <p className="text-gray-600">{userEmail}</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total de Alunos
                  </p>
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
                  <p className="text-sm font-medium text-gray-600">
                    Matérias Ativos
                  </p>
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
                  <p className="text-sm font-medium text-gray-600">
                    Progresso Médio
                  </p>
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
                  <p className="text-sm font-medium text-gray-600">
                    Nota Média em Quizzes
                  </p>
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
                  <CardTitle>Minhas Materias</CardTitle>
                  <CardDescription>
                    Gerencie seus cursos e acompanhe o progresso dos alunos
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {dataSubjects.map((subject) => (
                  <div
                    key={subject.id}
                    className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">
                          {subject.name}
                        </h3>
                        <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {subject.enrolledStudents} alunos
                          </span>
                          <span className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-1" />
                            {subject.lessonsAmount} lições
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">
                        {subject.enrolledStudents} matriculados
                      </Badge>
                      <div className="flex space-x-2">
                        <Link href={`/teacher/subject/${subject.id}`}>
                          <Button size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Visualizar
                          </Button>
                        </Link>
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
  );
}
