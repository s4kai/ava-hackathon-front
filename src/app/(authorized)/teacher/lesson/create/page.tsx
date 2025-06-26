"use client"

import Link from "next/link"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Save,
  Trash2,
  Upload,
  FileText,
  Clock,
  BookOpen,
  LinkIcon,
} from "lucide-react"
import NextLink from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

interface ContentBlock {
  id: number
  type: "texto" | "arquivo" | "link"
  title: string
  content: string
  url?: string
  duration?: string
}

export default function CreateLessonPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const courseId = searchParams.get("courseId")

  const [lessonTitle, setLessonTitle] = useState("")
  const [lessonDescription, setLessonDescription] = useState("")
  const [selectedCourse, setSelectedCourse] = useState(courseId || "")
  const [lessonDate, setLessonDate] = useState("")
  const [lessonType, setLessonType] = useState("")
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([])

  const courses = [
    { id: "1", title: "Introduction to Computer Science" },
    { id: "2", title: "Web Development Fundamentals" },
    { id: "3", title: "Database Management Systems" },
  ]

  const addContentBlock = (type: ContentBlock["type"]) => {
    const newBlock: ContentBlock = {
      id: Date.now(),
      type,
      title: "",
      content: "",
      url: type === "link" ? "" : undefined,
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
      title: lessonTitle,
      description: lessonDescription,
      courseId: selectedCourse,
      lessonDate,
      lessonType,
      contentBlocks,
    }

    console.log("Saving lesson:", lessonData)
    alert("Lesson saved successfully!")
    router.push(`/teacher/course/${selectedCourse}`)
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <NextLink href="/teacher/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao painel
            </Button>
          </NextLink>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Criar uma nova aula</h1>
              <p className="text-gray-600">Crie uma nova aula para o curso selecionado</p>
            </div>
            <div className="flex space-x-3">
              <Button onClick={saveLesson}>
                <Save className="h-4 w-4 mr-2" />
                Salvar Aula
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Aula</CardTitle>
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
                            placeholder="Insira o título do bloco de conteúdo"
                            value={block.title}
                            onChange={(e) => updateContentBlock(block.id, "title", e.target.value)}
                          />
                        </div>

                        {(block.type === "link") && (
                          <div className="space-y-2">
                            <Label>URL</Label>
                            <Input
                              placeholder="Insira a URL do link"
                              value={block.url || ""}
                              onChange={(e) => updateContentBlock(block.id, "url", e.target.value)}
                            />
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label>
                            {block.type === "texto"
                              ? "Conteúdo do Texto"
                              : block.type === "arquivo"
                                ? "Descrição do Arquivo"
                                : "Descrição do Link"}
                          </Label>
                          <Textarea
                            placeholder={
                              block.type === "texto"
                                ? "Digite o conteúdo da aula aqui..."
                                : block.type === "arquivo"
                                  ? "Descreva o que este arquivo contém..."
                                  : "Adicione uma descrição do link aqui..."
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

          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>Revise sua lição antes de salvar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Título da aula:</span>
                    <p className="text-gray-600">{lessonTitle || "Não definido"}</p>
                  </div>
                  <div>
                    <span className="font-medium">Data da aula:</span>
                    <p className="text-gray-600">{lessonDate || "Não definido"}</p>
                  </div>
                  <div>
                    <span className="font-medium">Tipo da aula:</span>
                    <p className="text-gray-600">{lessonType || "Não definido"}</p>
                  </div>
                  <div>
                    <span className="font-medium">Blocos de Conteúdo:</span>
                    <p className="text-gray-600">{contentBlocks.length} blocos</p>
                  </div>
                  <div>
                    <span className="font-medium">Status: </span>
                    <Badge variant={"secondary"}>Rascunho</Badge>
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
