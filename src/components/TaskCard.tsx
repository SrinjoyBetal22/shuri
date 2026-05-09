import React, { useState, useRef } from 'react';
import { 
  Check, 
  Calendar, 
  Trash, 
  PencilSimple, 
  X, 
  Play, 
  Pause, 
  Clock, 
  CornersOut
} from '@phosphor-icons/react';
import type { Task } from '../types/task';
import styles from './TaskCard.module.css';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onToggleTimer: (id: string) => void;
  onFocus: (id: string, rect: DOMRect) => void;
  isFocused?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onDelete, onUpdate, onToggleTimer, onFocus, isFocused }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description || '');
  const [editTags, setEditTags] = useState(task.tags?.join(', ') || '');
  
  const initialDate = task.deadline ? task.deadline.split('T')[0] : '';
  const initialTime = task.deadline ? task.deadline.split('T')[1].substring(0, 5) : '';
  
  const [editDate, setEditDate] = useState(initialDate);
  const [editTime, setEditTime] = useState(initialTime);
  const [editTimerH, setEditTimerH] = useState(task.timer?.hours || 0);
  const [editTimerM, setEditTimerM] = useState(task.timer?.minutes || 0);

  const getStatusClass = () => {
    if (task.completed) return styles.statusCompleted;
    if (!task.deadline) return styles.statusAll;

    const now = new Date();
    const deadline = new Date(task.deadline);
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (deadline < now) return styles.statusOverdue;
    if (deadline < tomorrow) return styles.statusToday;
    return styles.statusSoon;
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatSeconds = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSave = () => {
    if (!editTitle.trim()) return;

    let deadlineIso: string | undefined = undefined;
    if (editDate) {
      const timeStr = editTime || '00:00';
      deadlineIso = new Date(`${editDate}T${timeStr}`).toISOString();
    }

    const totalSeconds = (editTimerH * 3600) + (editTimerM * 60);
    const tagArray = editTags ? editTags.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : undefined;

    onUpdate(task.id, {
      title: editTitle,
      description: editDesc || undefined,
      tags: tagArray,
      deadline: deadlineIso,
      timer: totalSeconds > 0 ? { 
        hours: editTimerH, 
        minutes: editTimerM, 
        remainingSeconds: totalSeconds, 
        isActive: false 
      } : undefined,
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className={`${styles.taskCard} ${styles.editing}`}>
        <div className={styles.editForm}>
          <input
            type="text"
            className={styles.editTitleInput}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Task Title"
          />
          <textarea
            className={styles.editTextarea}
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            placeholder="Description (optional)"
          />
          <input
            type="text"
            className={styles.editTagsInput}
            value={editTags}
            onChange={(e) => setEditTags(e.target.value)}
            placeholder="Tags (comma separated)"
          />
          <div className={styles.editMetaRow}>
            <div className={styles.editField}>
              <label>Date</label>
              <input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
              />
            </div>
            <div className={styles.editField}>
              <label>Time</label>
              <input
                type="time"
                value={editTime}
                onChange={(e) => setEditTime(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.editField}>
            <label>Timer</label>
            <div className={styles.timerInputs}>
              <div className={styles.inputGroup}>
                <input
                  type="number"
                  placeholder="0"
                  value={editTimerH || ''}
                  onChange={(e) => setEditTimerH(parseInt(e.target.value) || 0)}
                />
                <span>hours</span>
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="number"
                  placeholder="0"
                  value={editTimerM || ''}
                  onChange={(e) => setEditTimerM(parseInt(e.target.value) || 0)}
                />
                <span>minutes</span>
              </div>
            </div>
          </div>
          <div className={styles.editActions}>
            <button className={styles.cancelBtn} onClick={() => setIsEditing(false)}>
              <X size={16} weight="light" /> Cancel
            </button>
            <button className={styles.saveBtn} onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalSeconds = task.timer ? (task.timer.hours * 3600 + task.timer.minutes * 60) : 0;
  const progress = task.timer ? (task.timer.remainingSeconds / totalSeconds) * 100 : 0;

  return (
    <div 
      className={`
        ${styles.taskCard} 
        ${isCompleting ? styles.isCompleting : ''} 
        ${isFocused ? styles.focused : ''} 
        ${task.completed ? styles.completedCard : ''}
      `} 
      ref={cardRef}
    >
      <div className={`${styles.statusIndicator} ${getStatusClass()}`} />
      <div className={styles.kintsugiCrack} />
      
      <div className={styles.content}>
        <div className={styles.headerRow}>
          <div className={styles.mainTitleGroup}>
            <button 
              className={`${styles.checkbox} ${task.completed ? styles.checkboxActive : ''}`}
              onClick={() => {
                setIsCompleting(true);
                setTimeout(() => onToggle(task.id), 350);
              }}
            >
              {task.completed && <Check size={12} weight="bold" />}
            </button>
            
            <h3 className={`${styles.title} ${task.completed ? styles.completed : ''}`}>
              {task.title}
            </h3>

            {task.tags && task.tags.length > 0 && (
              <div className={styles.tagsContainer}>
                {task.tags.map(tag => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className={styles.actions}>
            <button 
              className={styles.actionBtn} 
              onClick={() => {
                if (cardRef.current) {
                  onFocus(task.id, cardRef.current.getBoundingClientRect());
                }
              }} 
              title="Focus Mode"
            >
              <CornersOut size={16} weight="light" />
            </button>
            <button className={styles.actionBtn} onClick={() => setIsEditing(true)}>
              <PencilSimple size={16} weight="light" />
            </button>
            <button 
              className={styles.actionBtn} 
              onClick={() => {
                if (window.confirm('Delete this task?')) {
                  onDelete(task.id);
                }
              }}
            >
              <Trash size={16} weight="light" />
            </button>
          </div>
        </div>
        
        {task.description && (
          <p className={styles.description}>{task.description}</p>
        )}
        
        <div className={styles.meta}>
          {task.deadline && (
            <div className={styles.metaItem}>
              <Calendar size={12} weight="light" />
              {formatDate(task.deadline)}
            </div>
          )}

          {task.timer && (
            <div className={styles.timerRow}>
              <div className={styles.timerDisplay}>
                <Clock size={14} weight="light" />
                <span>{formatSeconds(totalSeconds - task.timer.remainingSeconds)} / {formatSeconds(totalSeconds)} ({formatSeconds(task.timer.remainingSeconds)} left)</span>
              </div>
              <button 
                className={`${styles.timerToggle} ${task.timer.isActive ? styles.timerActive : ''}`}
                onClick={() => onToggleTimer(task.id)}
                disabled={task.completed || task.timer.remainingSeconds === 0}
              >
                {task.timer.isActive ? <Pause size={16} weight="fill" /> : <Play size={16} weight="fill" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {task.timer && (
        <div className={styles.progressBarWrapper}>
          <div className={styles.progressBarContainer}>
            <div 
              className={`${styles.progressBar} ${task.timer.remainingSeconds === 0 ? styles.progressBarExpired : ''}`} 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
