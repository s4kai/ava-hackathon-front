interface Subject {
  id: number;
  code: string;
  name: string;

  teachers?: Teacher[];
  students?: Student[];
  lessons?: Lesson[];

  enrolledStudents?: number;
  lessonsAmount?: number;
}

interface Student {
  id: number;
  name: string;
  subjects?: Subject[];
}

interface Teacher {
  id: number;
  name: string;
  email: string;
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  date: string;
  type: string;
  content: string;
  subjectId: number;

  lessonPlan?: {
    id?: number;
    title: string;
    content: string;
    createdAt?: string;
    updatedAt?: string;
  };

  quiz: {
    id?: number;
    name?: string;
    wasTaken: boolean;
    description?: string;
    percentage?: number;
  };

  customMaterials?: CustomMaterial[];
}

interface QuizAnalysis {
  quizId: number;
  title: string;
  totalSubmissions: number;
  averageScore: number;
  percentageScore: number;
  highestScore: number;
  lowestScore: number;
}

interface QuizzesAnalysis {
  subjectId: number;
  quizzes: QuizAnalysis[];
  totalQuizzes: number;
  averageScore: number;
  totalSubmissions: number;
  averagePercentageScore: number;
  highestScore: number;
  lowestScore: number;
  avgTimeTaken: number;
}

interface Quiz {
  id: number;
  title: string;
  description?: string;
  maxScore: number;
  timeLimit: number;
  lessonId: number;
  QuizQuestion: Question[];
  createdAt: string;
  updatedAt: string;
}

interface Question {
  id: number;
  quizId?: number;
  question: string;
  type: "multiple-choice" | "true-false" | "short-answer";
  options: string[] | string;
  answer?: number; // Index of the correct answer in options array
  correctAnswer?: number;
  explanation?: string;
}

interface StudentAnalysis {
  studentId: number;
  student: Student;
  totalQuizzes: number;
  averageScore: number;
  averageTimeTaken: number;
  percentageScore: number;
  totalScore: number;
  totalTimeTaken: number;
}

interface StudentsAnalysis {
  subjectId: number;
  students: StudentAnalysis[];
}

interface RecentActivity {
  studentId: number;
  studentName: string;
  quizId: number;
  quizTitle: string;
  score: number;
  percentageScore: number;
  timeTaken: number;
  createdAt: string;
}

interface CustomMaterial {
  id: number;
  studentId: number;
  title: string;
  content: string;
  lessonId: number;
  createdAt: string;
  updatedAt: string;
  subject: number;
}
