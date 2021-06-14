export interface IExam {
  id: number;
  details: IDetails;
}

export interface IDetails {
  summary: string;
  student: IStudent;
  school: School;
  grade_value: number;
  exam_date: string;
  course_number: string;
  semester: string;
  discipline: string;
  subject: string;
  level: string;
  ungraded_url: string;
  graded_url: string;
  status: number;
}

interface School {
  id: number;
  schoolName: string;
}

export interface IStudent {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  verified: boolean;
}
