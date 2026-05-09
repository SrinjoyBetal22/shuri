export interface Task {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  deadline?: string; // ISO string
  timer?: {
    hours: number;
    minutes: number;
    remainingSeconds: number;
    isActive: boolean;
  };
  completed: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export type FilterType = 'All' | 'Overdue' | 'Due Today' | 'Due Soon' | 'Completed';
