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
  cvLink: string;
  currentRound: // Updated currentRound types
  | 'CV Screening'
    | 'Aptitude Test'
    | 'Technical Interview'
    | 'HR Interview'
    | 'Completed';
  cvStatus: 'Pending' | 'Passed' | 'Failed';
  aptitudeStatus: 'Pending' | 'Passed' | 'Failed'; // New aptitude status
  techStatus: 'Pending' | 'Passed' | 'Failed'; // Now for offline tech interview
  hrStatus: 'Pending' | 'Passed' | 'Failed';
  overallStatus: 'In Progress' | 'Rejected' | 'Selected';
  jobId: number;
  createdAt: string;
  updatedAt: string;
  interviewDate?: string; // Added for scheduling
  interviewTime?: string; // Added for scheduling

  Job?: {
    title: string;
    location: string;
    requirements: string[];
    type: string;
    company: string;
    salary: string;
    posted: string;
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
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
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
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeLimit: number;
  starterCode: string;
  testCases: Array<{
    input: string;
    expectedOutput: string;
  }>;
}
