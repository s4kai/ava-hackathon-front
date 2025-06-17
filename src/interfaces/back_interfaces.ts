interface Subject {
  id: number;
  code: string;
  name: string;

  teachers?: Teacher[];
  students?: Student[];
  lessons?: Lesson[];
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
  date: string;
  type: string;
  content: string;
}
