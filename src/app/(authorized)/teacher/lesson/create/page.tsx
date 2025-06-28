"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Save,
  Trash2,
  Upload,
  FileText,
  Clock,
  BookOpen,
} from "lucide-react";
import NextLink from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { LoadingComponent } from "@/components/loading";
import { toast } from "sonner";

interface ContentBlock {
  id: number;
  type: "texto" | "arquivo";
  title: string;
  content: string;
  url?: string;
  duration?: string;
}

export default function CreateLessonPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subjectId = searchParams.get("subjectId");

  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [lessonDate, setLessonDate] = useState("");
  const [lessonType, setLessonType] = useState("");
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState<Subject | null>(null);

  const addContentBlock = (type: ContentBlock["type"]) => {
    const newBlock: ContentBlock = {
      id: Date.now(),
      type,
      title: "",
      content: "",
    };
    setContentBlocks([...contentBlocks, newBlock]);
  };

  const updateContentBlock = (
    id: number,
    field: keyof ContentBlock,
    value: string
  ) => {
    setContentBlocks(
      contentBlocks.map((block) =>
        block.id === id ? { ...block, [field]: value } : block
      )
    );
  };

  const deleteContentBlock = (id: number) => {
    setContentBlocks(contentBlocks.filter((block) => block.id !== id));
  };

  const saveLesson = () => {
    if (subject) {
      if (
        !lessonTitle ||
        !subject.id ||
        !lessonDate ||
        !lessonType ||
        !contentBlocks
      ) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
      }

      const lessonData = {
        title: lessonTitle,
        description: lessonDescription || "",
        date: lessonDate,
        type: lessonType,
        contentTitle: contentBlocks
          .map((block) => (block.type === "texto" ? block.title : ""))
          .filter(Boolean)[0],
        content: contentBlocks.map((block) => block.content).filter(Boolean)[0],
      };

      api
        .post(`subjects/${subject.id}/lessons/create`, lessonData)
        .then(() => {
          toast.success("Evento criado com sucesso", { duration: 3000 });
          router.push(`/teacher/subject/${subject.id}`);
        })
        .catch((error) => {
          console.error("Error saving lesson:", error);
          toast.error("Erro ao criar evento", { duration: 3000 });
        });
    }
  };

  const fetchData = async (subjectId: string | null) => {
    if (!subjectId) return;
    try {
      const res = await api.post(`/subjects/${subjectId}`);
      setSubject(res.data);
    } catch (error) {
      throw new Error("Error fetching subject data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(subjectId);
  }, [subjectId]);

  if (loading) {
    return <LoadingComponent />;
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Criar uma nova aula
              </h1>
              <p className="text-gray-600">
                Crie uma nova aula para o curso selecionado
              </p>
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Aula</CardTitle>
                <CardDescription>
                  Detalhes básicos sobre sua aula
                </CardDescription>
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
                    <Label htmlFor="subject-select">Disciplina *</Label>
                    <Input
                      id="subject-select"
                      type="text"
                      value={
                        subject?.name
                          ? subject.name
                          : "Nenhuma disciplina selecionada"
                      }
                      disabled
                    />
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
                  <CardDescription>
                    Adicione diferentes tipos de conteúdo à sua aula
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => addContentBlock("texto")}
                    size="sm"
                    variant="outline"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Texto
                  </Button>
                  <Button
                    onClick={() => addContentBlock("arquivo")}
                    size="sm"
                    variant="outline"
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    Arquivo
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {contentBlocks.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg mb-2">
                      Nenhum bloco de conteúdo adicionado ainda
                    </p>
                    <p className="text-sm">
                      Use os botões acima para adicionar texto ou arquivos
                    </p>
                  </div>
                ) : (
                  contentBlocks.map((block, index) => (
                    <Card
                      key={block.id}
                      className="border-l-4 border-l-blue-500"
                    >
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {block.type === "texto" && (
                            <FileText className="h-5 w-5 text-green-600" />
                          )}
                          {block.type === "arquivo" && (
                            <Upload className="h-5 w-5 text-purple-600" />
                          )}
                          <CardTitle className="text-lg">
                            {block.type.charAt(0).toUpperCase() +
                              block.type.slice(1)}{" "}
                            Block {index + 1}
                          </CardTitle>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteContentBlock(block.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Título</Label>
                          <Input
                            placeholder="Insira o título do bloco de conteúdo"
                            value={block.title}
                            onChange={(e) =>
                              updateContentBlock(
                                block.id,
                                "title",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>
                            {block.type === "texto"
                              ? "Conteúdo do Texto"
                              : "Descrição do Arquivo"}
                          </Label>
                          <Textarea
                            placeholder={
                              block.type === "texto"
                                ? "Digite o conteúdo da aula aqui..."
                                : "Descreva o que este arquivo contém..."
                            }
                            value={block.content}
                            onChange={(e) =>
                              updateContentBlock(
                                block.id,
                                "content",
                                e.target.value
                              )
                            }
                            rows={block.type === "texto" ? 6 : 3}
                          />
                        </div>

                        {block.type === "arquivo" && (
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
        </Tabs>
      </div>
    </div>
  );
}
