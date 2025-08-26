export const getStatusColor = (status: string) => {
  switch (status) {
    case 'Selected':
      return 'green';
    case 'Failed':
    case 'Rejected':
      return 'red';
    case 'Pending':
    case 'In Progress':
      return 'blue';
    case 'CV Screening':
      return 'yellow';
    case 'Technical Interview':
      return 'purple';
    case 'HR Interview':
      return 'cyan';
    case 'Passed':
    case 'Completed':
      return 'green';
    default:
      return 'gray';
  }
};

export const getStageProgress = (stage: string) => {
  switch (stage) {
    case 'CV Screening':
      return 20;
    case 'Technical Interview':
      return 60;
    case 'HR Interview':
      return 80;
    case 'Completed':
      return 100;
    default:
      return 0;
  }
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy':
      return 'green';
    case 'Medium':
      return 'yellow';
    case 'Hard':
      return 'red';
    default:
      return 'gray';
  }
};

export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
};
