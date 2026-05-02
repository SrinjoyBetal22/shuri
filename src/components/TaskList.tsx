import React from 'react';
import type { Task } from '../types/task';
import TaskCard from './TaskCard';
import styles from './TaskList.module.css';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onToggleTimer: (id: string) => void;
  onFocus: (id: string, rect: DOMRect) => void;
  focusedIndex?: number;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggle, onDelete, onUpdate, onToggleTimer, onFocus, focusedIndex = -1 }) => {
  const isStale = (task: Task) => {
    const updated = new Date(task.updatedAt);
    const now = new Date();
    const diffDays = (now.getTime() - updated.getTime()) / (1000 * 3600 * 24);
    return diffDays > 7;
  };

  const handleTaskClick = (task: Task) => {
    if (isStale(task)) {
      if (window.confirm('This task has been dormant. Would you like to bring it back to attention?')) {
        onUpdate(task.id, { updatedAt: new Date().toISOString() });
      } else if (window.confirm('Would you like to archive it?')) {
        onDelete(task.id);
      }
    }
  };

  if (tasks.length === 0) {
    return <div className={styles.empty}>No tasks found. Take a breath.</div>;
  }

  return (
    <div className={styles.taskList}>
      {tasks.map((task, index) => (
        <div key={task.id} onClick={() => handleTaskClick(task)} style={{ opacity: isStale(task) ? 0.4 : 1, transition: 'opacity 0.3s' }}>
          <TaskCard 
            task={task} 
            onToggle={onToggle} 
            onDelete={onDelete} 
            onUpdate={onUpdate}
            onToggleTimer={onToggleTimer}
            onFocus={onFocus}
            isFocused={index === focusedIndex}
          />
        </div>
      ))}
    </div>
  );
};

export default TaskList;
