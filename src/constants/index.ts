import type { HRUser, Question } from '../types';

export const MOCK_HR_USERS: HRUser[] = [
  {
    id: '1',
    email: 'hr.manager@gmail.com',
    password: 'admin123',
    name: 'Sajak Shrestha',
    role: 'Senior HR Manager',
    company: 'Hiring Tech Inc.',
  },
];

export const MOCK_QUESTIONS: Question[] = [
  {
    id: 1,
    title: 'Two Sum',
    description:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    difficulty: 'Easy',
    timeLimit: 15,
    starterCode: `function twoSum(nums, target) {
}`,
    testCases: [
      { input: '[2,7,11,15], 9', expectedOutput: '[0,1]' },
      { input: '[3,2,4], 6', expectedOutput: '[1,2]' },
    ],
  },
  {
    id: 2,
    title: 'Valid Parentheses',
    description:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    difficulty: 'Medium',
    timeLimit: 20,
    starterCode: `function isValid(s) {
}`,
    testCases: [
      { input: '"()"', expectedOutput: 'true' },
      { input: '"()[]{}"', expectedOutput: 'true' },
      { input: '"(]"', expectedOutput: 'false' },
    ],
  },
  {
    id: 3,
    title: 'Merge Two Sorted Lists',
    description:
      'You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a sorted manner.',
    difficulty: 'Hard',
    timeLimit: 10,
    starterCode: `function mergeTwoLists(list1, list2) {
}`,
    testCases: [
      { input: '[1,2,4], [1,3,4]', expectedOutput: '[1,1,2,3,4,4]' },
      { input: '[], []', expectedOutput: '[]' },
    ],
  },
];
