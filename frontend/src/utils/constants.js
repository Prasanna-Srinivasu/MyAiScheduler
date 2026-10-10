export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const TASK_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
};

export const TASK_PRIORITY = {
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
};

export const TASK_CATEGORIES = [
  'STUDY',
  'CODING',
  'REVISION',
  'PROJECT',
  'OTHER',
];

export const ENERGY_LEVELS = [
  { value: 'HIGH', label: 'High Energy (Deep Focus, Challenging Coding)' },
  { value: 'MEDIUM', label: 'Moderate Energy (Balanced Features & Topics)' },
  { value: 'LOW', label: 'Low Energy (Light Review, Architecture & Reading)' },
];

export const TARGET_ROLES = [
  'Full Stack Java & React Developer',
  'Frontend React Specialist',
  'Backend Java & Spring Boot Engineer',
  'AI & Machine Learning Engineer',
  'DevOps & Cloud Engineer',
  'Software Engineer (General)',
];

export const EXPERIENCE_LEVELS = [
  'Beginner',
  'Intermediate',
  'Advanced',
];
