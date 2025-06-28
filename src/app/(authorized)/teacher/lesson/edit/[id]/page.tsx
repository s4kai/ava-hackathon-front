"use client"

import Link from "next/link"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Upload,
  Video,
  FileText,
  ImageIcon,
  Clock,
  Users,
  Target,
  BookOpen,
  History,
  AlertCircle,
  LinkIcon,
} from "lucide-react"
import NextLink from "next/link"
import { useParams, useRouter } from "next/navigation"

interface ContentBlock {
  id: number
  type: "texto" | "arquivo" | "link"
  title: string
  content: string
  url?: string
  duration?: string
}

const mockLessonData = {
  1: {
    id: 1,
    title: "Introduction to Variables",
    description: "Learn about variables, data types, and how to use them in programming",
    courseId: "1",
    courseName: "Introduction to Computer Science",
    lessonDate: "2024-01-15",
    lessonType: "Presencial",
    prerequisites: ["Basic Programming Concepts"],
    learningObjectives: [
      { id: 1, text: "Understand what variables are and why they're important" },
      { id: 2, text: "Learn different data types (string, number, boolean)" },
      { id: 3, text: "Practice declaring and using variables" },
    ],
    contentBlocks: [
      {
        id: 1,
        type: "texto" as const,
        title: "What are Variables?",
        content:
          "Variables are containers that store data values. In programming, we use variables to store information that we can use and manipulate throughout our program.",
      }
    ],
    assignments: [
      {
        id: 1,
        title: "Variable Practice Quiz",
        description: "Test your understanding of variables and data types",
        type: "quiz" as const,
        dueDate: "2024-02-15",
        points: 100,
      },
    ],
    isPublished: true,
    createdAt: "2024-01-10",
    lastModified: "2024-01-15",
    studentProgress: {
      enrolled: 28,
      completed: 22,
      inProgress: 4,
      notStarted: 2,
    },
  },
}

export default function EditLessonPage() {
  const params = useParams()
  const router = useRouter()
  const lessonId = Number.parseInt(params.id as string)
  const lesson = mockLessonData[lessonId as keyof typeof mockLessonData]

  const [lessonTitle, setLessonTitle] = useState("")
  const [lessonDescription, setLessonDescription] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("")
  const [lessonDate, setLessonDate] = useState("")
  const [lessonType, setLessonType] = useState("")
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([])
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const courses = [
    { id: "1", title: "Introduction to Computer Science" },
    { id: "2", title: "Web Development Fundamentals" },
    { id: "3", title: "Database Management Systems" },
  ]

  useEffect(() => {
    if (lesson) {
      setLessonTitle(lesson.title)
      setLessonDescription(lesson.description)
      setSelectedCourse(lesson.courseId)
      setLessonDate(lesson.lessonDate)
      setLessonType(lesson.lessonType)
      setContentBlocks(lesson.contentBlocks)
    }
  }, [lesson])

  useEffect(() => {
    setHasUnsavedChanges(true)
  }, [
    lessonTitle,
    lessonDescription,
    selectedCourse,
    lessonDate,
    lessonType,
    contentBlocks,
  ])

  if (!lesson) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Aula não encontrada</h1>
          <p className="text-gray-600 mb-6">A aula que você está procurando não existe.</p>
          <NextLink href="/teacher/dashboard">
            <Button>Voltar ao painel</Button>
          </NextLink>
        </div>
      </div>
    )
  }

  const addContentBlock = (type: ContentBlock["type"]) => {
    const newBlock: ContentBlock = {
      id: Date.now(),
      type,
      title: "",
      content: "",
      url: type === "link" ? "" : undefined,
      duration: undefined,
    }
    setContentBlocks([...contentBlocks, newBlock])
  }

  const updateContentBlock = (id: number, field: keyof ContentBlock, value: string) => {
    setContentBlocks(contentBlocks.map((block) => (block.id === id ? { ...block, [field]: value } : block)))
  }

  const deleteContentBlock = (id: number) => {
    setContentBlocks(contentBlocks.filter((block) => block.id !== id))
  }

  const saveLesson = () => {
    const lessonData = {
      id: lessonId,
      title: lessonTitle,
      description: lessonDescription,
      courseId: selectedCourse,
      lessonDate,
      lessonType,
      contentBlocks,
      lastModified: new Date().toISOString().split("T")[0],
    }

    console.log("Updating lesson:", lessonData)
    setHasUnsavedChanges(false)
    alert("Lesson updated successfully!")
  }

  const duplicateLesson = () => {
    alert("Lesson duplicated! You can now edit the copy.")
    router.push("/teacher/lesson/create")
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <NextLink href="/teacher/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Painel
            </Button>
          </NextLink>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">Editar Aula</h1>
                {hasUnsavedChanges && (
                  <Badge variant="secondary" className="flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Alterações Não Salvas
                  </Badge>
                )}
              </div>
              <p className="text-gray-600">{lesson.courseName}</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={duplicateLesson}>
                Duplicar
              </Button>
              <Button onClick={saveLesson}>
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          </div>
        </div>

        {/* Lesson Stats */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Progresso dos Alunos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{lesson.studentProgress.enrolled}</div>
                <div className="text-sm text-gray-600">Matriculados</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{lesson.studentProgress.completed}</div>
                <div className="text-sm text-gray-600">Concluídos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{lesson.studentProgress.inProgress}</div>
                <div className="text-sm text-gray-600">Em Progresso</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">{lesson.studentProgress.notStarted}</div>
                <div className="text-sm text-gray-600">Não Iniciado</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>Detalhes básicos sobre sua aula</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lesson-title">Título *</Label>
                    <Input
                      id="lesson-title"
                      placeholder="Digite o título da aula"
                      value={lessonTitle}
                      onChange={(e) => setLessonTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="course-select">Curso *</Label>
                    <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um curso" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lesson-description">Descrição</Label>
                  <Textarea
                    id="lesson-description"
                    placeholder="Descreva o que os alunos aprenderam nesta aula"
                    value={lessonDescription}
                    onChange={(e) => setLessonDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Data *</Label>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <Input
                        id="date"
                        type="date"
                        value={lessonDate}
                        onChange={(e) => setLessonDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo *</Label>
                    <Select value={lessonType} onValueChange={setLessonType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo da aula" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Presencial">Presencial</SelectItem>
                        <SelectItem value="EAD">EAD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Conteúdo da Aula</CardTitle>
                  <CardDescription>Adicione diferentes tipos de conteúdo à sua aula</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => addContentBlock("texto")} size="sm" variant="outline">
                    <FileText className="h-4 w-4 mr-1" />
                    Texto
                  </Button>
                  <Button onClick={() => addContentBlock("arquivo")} size="sm" variant="outline">
                    <Upload className="h-4 w-4 mr-1" />
                    Arquivo
                  </Button>
                  <Button onClick={() => addContentBlock("link")} size="sm" variant="outline">
                    <LinkIcon className="h-4 w-4 mr-1" />
                    Link
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {contentBlocks.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg mb-2">Nenhum bloco de conteúdo adicionado ainda</p>
                    <p className="text-sm">Use os botões acima para adicionar texto, arquivos ou links</p>
                  </div>
                ) : (
                  contentBlocks.map((block, index) => (
                    <Card key={block.id} className="border-l-4 border-l-blue-500">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {block.type === "texto" && <FileText className="h-5 w-5 text-green-600" />}
                          {block.type === "arquivo" && <Upload className="h-5 w-5 text-purple-600" />}
                          {block.type === "link" && <LinkIcon className="h-5 w-5 text-blue-600" />}
                          <CardTitle className="text-lg">
                            {block.type.charAt(0).toUpperCase() + block.type.slice(1)} Block {index + 1}
                          </CardTitle>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => deleteContentBlock(block.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Título</Label>
                          <Input
                            placeholder="Digite o título do conteúdo"
                            value={block.title}
                            onChange={(e) => updateContentBlock(block.id, "title", e.target.value)}
                          />
                        </div>

                        {( block.type === "link") && (
                          <div className="space-y-2">
                            <Label>URL</Label>
                            <Input
                              placeholder="Digite a URL do link"
                              value={block.url || ""}
                              onChange={(e) => updateContentBlock(block.id, "url", e.target.value)}
                            />
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label>
                            {block.type === "texto"
                              ? "Conteúdo"
                              : block.type === "arquivo"
                                ? "Descrição do Arquivo"
                                : "Descrição"}
                          </Label>
                          <Textarea
                            placeholder={
                              block.type === "texto"
                                ? "Digite o conteúdo da aula aqui..."
                                : block.type === "arquivo"
                                  ? "Descreva o que este arquivo contém..."
                                  : "Adicione uma descrição..."
                            }
                            value={block.content}
                            onChange={(e) => updateContentBlock(block.id, "content", e.target.value)}
                            rows={block.type === "texto" ? 6 : 3}
                          />
                        </div>

                        {(block.type === "arquivo") && (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-600 mb-2">
                              Clique para adicionar um {block.type}
                            </p>
                            <Button variant="outline" size="sm">
                              Escolher Arquivo
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="h-5 w-5 mr-2" />
                  Histórico da Aula
                </CardTitle>
                <CardDescription>Acompanhar alterações e versões desta aula</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Versão Atual</p>
                      <p className="text-sm text-gray-600">Última modificação: {lesson.lastModified}</p>
                    </div>
                    <Badge>Ativo</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Versão 1.0</p>
                      <p className="text-sm text-gray-600">Criado em: {lesson.createdAt}</p>
                      <p className="text-xs text-gray-500">Criação inicial da aula</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Análise da Aula</CardTitle>
                <CardDescription>Métricas de desempenho para esta aula</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Tempo Médio de Conclusão:</span>
                    <p className="text-gray-600">42 minutos</p>
                  </div>
                  <div>
                    <span className="font-medium">Taxa de Conclusão:</span>
                    <p className="text-gray-600">78.6%</p>
                  </div>
                  <div>
                    <span className="font-medium">Média de Notas do Quiz:</span>
                    <p className="text-gray-600">85%</p>
                  </div>
                  <div>
                    <span className="font-medium">Feedback dos Alunos:</span>
                    <p className="text-gray-600">4.2/5 estrelas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
