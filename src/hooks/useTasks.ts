import { useState, useEffect, useMemo } from 'react';
import { collection, doc, onSnapshot, updateDoc, deleteDoc, writeBatch, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import type { Task, FilterType } from '../types/task';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('All');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const tasksCollection = collection(db, 'users', user.uid, 'tasks');
    
    // Migration: Check for localStorage tasks
    const saved = localStorage.getItem('tasks');
    if (saved) {
      const localTasks: Task[] = JSON.parse(saved);
      if (localTasks.length > 0) {
        const batch = writeBatch(db);
        localTasks.forEach(task => {
          const docRef = doc(tasksCollection, task.id);
          batch.set(docRef, task);
        });
        batch.commit().then(() => {
          localStorage.removeItem('tasks');
        });
      } else {
        localStorage.removeItem('tasks');
      }
    }

    const unsubscribe = onSnapshot(tasksCollection, (snapshot) => {
      const newTasks: Task[] = [];
      snapshot.forEach((doc) => {
        newTasks.push(doc.data() as Task);
      });
      setTasks(newTasks);
    });

    return () => unsubscribe();
  }, []);

  // Timer interval
  useEffect(() => {
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
            return {
              ...task,
              timer: {
                ...task.timer,
                remainingSeconds: task.timer.remainingSeconds - 1,
              },
            };
          }
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

  const addTask = async (taskData: Omit<Task, 'id' | 'completed' | 'createdAt' | 'updatedAt'>) => {
    const user = auth.currentUser;
    if (!user) return;
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const taskDocRef = doc(db, 'users', user.uid, 'tasks', newTask.id);
    await setDoc(taskDocRef, newTask);
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const user = auth.currentUser;
    if (!user) return;
    const taskRef = doc(db, 'users', user.uid, 'tasks', id);
    await updateDoc(taskRef, { ...updates, updatedAt: new Date().toISOString() });
  };

  const toggleTimer = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task || !task.timer) return;
    await updateTask(id, {
      timer: { ...task.timer, isActive: !task.timer.isActive }
    });
  };

  const deleteTask = async (id: string) => {
    const user = auth.currentUser;
    if (!user) return;
    const taskRef = doc(db, 'users', user.uid, 'tasks', id);
    await deleteDoc(taskRef);
  };

  const toggleComplete = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    await updateTask(id, {
      completed: !task.completed,
      timer: task.timer ? { ...task.timer, isActive: false } : undefined
    });
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
