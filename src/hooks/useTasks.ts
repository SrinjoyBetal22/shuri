import { useState, useEffect, useMemo } from 'react';
import type { Task, FilterType } from '../types/task';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [filter, setFilter] = useState<FilterType>('All');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Timer interval
  useEffect(() => {
    // Persistent audio element to avoid issues with GC or browser throttling
    const sound = new Audio('/sounds/thunder.mp3');
    sound.load(); // Preload sound
    
    const interval = setInterval(() => {
      setTasks((prev) => {
        let hasChanges = false;
        const nextTasks = prev.map((task) => {
          if (
            !task.completed &&
            task.timer &&
            task.timer.isActive &&
            task.timer.remainingSeconds > 0
          ) {
            hasChanges = true;
            const remaining = task.timer.remainingSeconds - 1;
            if (remaining === 0) {
              sound.currentTime = 0;
              // Play attempt after user interaction is usually required
              sound.play().catch(e => console.warn("Audio autoplay blocked or failed:", e));
            }
            return {
              ...task,
              timer: {
                ...task.timer,
                remainingSeconds: remaining,
              },
            };
          }
          // Auto-pause if finished
          if (task.timer?.isActive && task.timer?.remainingSeconds === 0) {
            hasChanges = true;
            return {
              ...task,
              timer: {
                ...task.timer,
                isActive: false,
              },
            };
          }
          return task;
        });
        return hasChanges ? nextTasks : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const addTask = (taskData: Omit<Task, 'id' | 'completed' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
      )
    );
  };

  const toggleTimer = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id && task.timer) {
          return {
            ...task,
            timer: {
              ...task.timer,
              isActive: !task.timer.isActive,
            },
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const toggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { 
              ...task, 
              completed: !task.completed, 
              updatedAt: new Date().toISOString(),
              // Pause timer if completed
              timer: task.timer ? { ...task.timer, isActive: false } : undefined
            }
          : task
      )
    );
  };

  const filteredTasks = useMemo(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return tasks.filter((task) => {
      // 1. Tag Filtering
      if (selectedTag && (!task.tags || !task.tags.includes(selectedTag))) return false;

      // 2. Status Filtering
      if (filter === 'Completed') return task.completed;
      if (task.completed) return false;

      if (filter === 'All') return true;

      if (!task.deadline) return false;

      const deadlineDate = new Date(task.deadline);

      if (filter === 'Overdue') {
        return deadlineDate < now;
      }

      if (filter === 'Due Today') {
        return deadlineDate >= now && deadlineDate < tomorrow;
      }

      if (filter === 'Due Soon') {
        return deadlineDate >= tomorrow;
      }

      return true;
    });
  }, [tasks, filter, selectedTag]);

  return {
    tasks,
    filter,
    setFilter,
    selectedTag,
    setSelectedTag,
    filteredTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    toggleTimer,
  };
};
