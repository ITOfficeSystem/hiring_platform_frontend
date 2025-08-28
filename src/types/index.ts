export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  posted: string;
}

export interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  cvLink: string;
  currentRound: // Updated currentRound types
  "CV Screening" | "Technical Interview" | "HR Interview" | "Completed";
  cvStatus: "Pending" | "Passed" | "Failed";
  techStatus: "Pending" | "Passed" | "Failed";
  hrStatus: "Pending" | "Passed" | "Failed";
  overallStatus: "In Progress" | "Rejected" | "Selected";
  jobId: number;
  createdAt: string;
  updatedAt: string;

  Job?: {
    title: string;
    location: string;
    requirements: string[];
    type: string;
    company: string;
    salary: string;
    posted: string;
  };

  aiScreenings?: {
    createdAt: string;
    decision: string;
    feedback: string;
    score: number;
  };
}

export interface HRUser {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  password: string;
}

export interface JobFormValues {
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Internship";
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  posted: string;
}

export interface Question {
  id: number;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  timeLimit: number;
  starterCode: string;
  testCases: Array<{
    input: string;
    expectedOutput: string;
  }>;
}
