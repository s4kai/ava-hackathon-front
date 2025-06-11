"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, CheckCircle, Clock, FileText, Video, HelpCircle, ArrowLeft, Download } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

const mockCourseData = {
  1: {
    title: "Introduction to Computer Science",
    instructor: "Dr. Sarah Johnson",
    description:
      "A comprehensive introduction to computer science fundamentals, covering programming concepts, data structures, and algorithms.",
    progress: 75,
    totalLessons: 12,
    completedLessons: 9,
    lessons: [
      { id: 1, title: "Introduction to Programming", type: "video", duration: "45 min", completed: true },
      { id: 2, title: "Variables and Data Types", type: "video", duration: "30 min", completed: true },
      { id: 3, title: "Control Structures", type: "video", duration: "40 min", completed: true },
      { id: 4, title: "Functions and Methods", type: "video", duration: "35 min", completed: true },
      { id: 5, title: "Arrays and Lists", type: "video", duration: "50 min", completed: true },
      { id: 6, title: "Object-Oriented Programming", type: "video", duration: "60 min", completed: true },
      { id: 7, title: "Inheritance and Polymorphism", type: "video", duration: "45 min", completed: true },
      { id: 8, title: "Exception Handling", type: "video", duration: "30 min", completed: true },
      { id: 9, title: "File I/O Operations", type: "video", duration: "40 min", completed: true },
      { id: 10, title: "Data Structures", type: "video", duration: "55 min", completed: false, current: true },
      { id: 11, title: "Algorithms and Complexity", type: "video", duration: "50 min", completed: false },
      { id: 12, title: "Final Project", type: "assignment", duration: "2 hours", completed: false },
    ],
    quizzes: [
      { id: 1, title: "Programming Basics Quiz", lessons: "1-3", score: 85, completed: true },
      { id: 2, title: "Functions and OOP Quiz", lessons: "4-6", score: 92, completed: true },
      { id: 3, title: "Advanced Concepts Quiz", lessons: "7-9", score: null, completed: false },
    ],
    materials: [
      { id: 1, title: "Course Syllabus", type: "pdf", size: "2.3 MB" },
      { id: 2, title: "Programming Reference Guide", type: "pdf", size: "5.1 MB" },
      { id: 3, title: "Code Examples", type: "zip", size: "12.4 MB" },
      { id: 4, title: "Additional Reading List", type: "pdf", size: "1.8 MB" },
    ],
  },
}

export default function CoursePage() {
  const params = useParams()
  const courseId = Number.parseInt(params.id as string)
  const course = mockCourseData[courseId as keyof typeof mockCourseData]
  const [selectedLesson, setSelectedLesson] = useState(course?.lessons.find((l) => l.current) || course?.lessons[0])

  if (!course) {
    return <div>Course not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/student/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
              <p className="text-gray-600 mb-4">Instructor: {course.instructor}</p>
              <p className="text-gray-700 max-w-3xl">{course.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{course.progress}%</div>
              <div className="text-sm text-gray-600">Complete</div>
            </div>
          </div>

          <div className="mt-4">
            <Progress value={course.progress} className="h-3" />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>
                {course.completedLessons} of {course.totalLessons} lessons completed
              </span>
              <span>{course.totalLessons - course.completedLessons} lessons remaining</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="lessons" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="lessons">Lessons</TabsTrigger>
                <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                <TabsTrigger value="materials">Materials</TabsTrigger>
              </TabsList>

              <TabsContent value="lessons" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Lessons</CardTitle>
                    <CardDescription>Complete lessons in order to progress through the course</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {course.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedLesson?.id === lesson.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                          }`}
                          onClick={() => setSelectedLesson(lesson)}
                        >
                          <div className="flex items-center space-x-3">
                            {lesson.completed ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : lesson.current ? (
                              <Play className="h-5 w-5 text-blue-600" />
                            ) : (
                              <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
                            )}

                            <div>
                              <h3 className="font-medium">{lesson.title}</h3>
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
                                  {lesson.duration}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            {lesson.current && <Badge variant="secondary">Current</Badge>}
                            {lesson.completed && <Badge variant="default">Completed</Badge>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="quizzes" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Quizzes</CardTitle>
                    <CardDescription>Test your knowledge with these assessments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {course.quizzes.map((quiz) => (
                        <div key={quiz.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <HelpCircle className="h-5 w-5 text-blue-600" />
                            <div>
                              <h3 className="font-medium">{quiz.title}</h3>
                              <p className="text-sm text-gray-600">Covers lessons {quiz.lessons}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            {quiz.completed && quiz.score && (
                              <Badge variant={quiz.score >= 80 ? "default" : "secondary"}>Score: {quiz.score}%</Badge>
                            )}
                            <Link href={`/student/quiz/${quiz.id}`}>
                              <Button size="sm" variant={quiz.completed ? "outline" : "default"}>
                                {quiz.completed ? "Retake" : "Start Quiz"}
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="materials" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Materials</CardTitle>
                    <CardDescription>Download additional resources and references</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {course.materials.map((material) => (
                        <div key={material.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-gray-600" />
                            <div>
                              <h3 className="font-medium">{material.title}</h3>
                              <p className="text-sm text-gray-600">
                                {material.type.toUpperCase()} • {material.size}
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
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {selectedLesson && (
              <Card>
                <CardHeader>
                  <CardTitle>Current Lesson</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">{selectedLesson.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                        <span className="flex items-center">
                          {selectedLesson.type === "video" ? (
                            <Video className="h-4 w-4 mr-1" />
                          ) : (
                            <FileText className="h-4 w-4 mr-1" />
                          )}
                          {selectedLesson.type}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {selectedLesson.duration}
                        </span>
                      </div>
                    </div>

                    {selectedLesson.completed ? (
                      <Button className="w-full" variant="outline">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Review Lesson
                      </Button>
                    ) : (
                      <Button className="w-full">
                        <Play className="h-4 w-4 mr-2" />
                        Start Lesson
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Course Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">{course.progress}%</div>
                    <div className="text-sm text-gray-600">Complete</div>
                  </div>

                  <Progress value={course.progress} className="h-2" />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Completed Lessons:</span>
                      <span className="font-medium">
                        {course.completedLessons}/{course.totalLessons}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quiz Average:</span>
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
  )
}
