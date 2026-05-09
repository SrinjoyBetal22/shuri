import React, { useState } from 'react';
import { CaretUp, Plus } from '@phosphor-icons/react';
import styles from './AddTask.module.css';

interface AddTaskProps {
  onAdd: (task: {
    title: string;
    description?: string;
    tags?: string[];
    deadline?: string;
    timer?: { hours: number; minutes: number; remainingSeconds: number; isActive: boolean };
  }) => void;
}

const AddTask: React.FC<AddTaskProps> = ({ onAdd }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('');
  const [timerHours, setTimerHours] = useState<number>(0);
  const [timerMinutes, setTimerMinutes] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let deadlineIso: string | undefined = undefined;
    if (deadlineDate) {
      const timeStr = deadlineTime || '00:00';
      deadlineIso = new Date(`${deadlineDate}T${timeStr}`).toISOString();
    }

    const totalSeconds = (timerHours * 3600) + (timerMinutes * 60);
    const tagArray = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : undefined;

    onAdd({
      title,
      description: description || undefined,
      tags: tagArray,
      deadline: deadlineIso,
      timer: totalSeconds > 0 ? { 
        hours: timerHours, 
        minutes: timerMinutes, 
        remainingSeconds: totalSeconds, 
        isActive: false 
      } : undefined,
    });

    setTitle('');
    setDescription('');
    setTags('');
    setDeadlineDate('');
    setDeadlineTime('');
    setTimerHours(0);
    setTimerMinutes(0);
    setIsExpanded(false);
  };

  return (
    <form className={styles.addTask} onSubmit={handleSubmit}>
      <input
        id="task-title"
        name="title"
        type="text"
        placeholder="Add a task..."
        className={styles.titleInput}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      {isExpanded && (
        <div className={styles.optionalFields}>
          <div className={styles.field}>
            <label htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              name="description"
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="task-tags">Tags (comma separated)</label>
            <input
              id="task-tags"
              name="tags"
              type="text"
              placeholder="work, project, urgent"
              className={styles.tagInput}
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className={styles.multiFieldRow}>
            <div className={styles.field}>
              <label htmlFor="task-date">Deadline Date</label>
              <input
                id="task-date"
                name="deadlineDate"
                type="date"
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="task-time">Deadline Time</label>
              <input
                id="task-time"
                name="deadlineTime"
                type="time"
                value={deadlineTime}
                onChange={(e) => setDeadlineTime(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>Timer</label>
            <div className={styles.timerPresets}>
              <button type="button" onClick={() => { setTimerHours(0); setTimerMinutes(15); }}>15m</button>
              <button type="button" onClick={() => { setTimerHours(0); setTimerMinutes(25); }}>25m</button>
              <button type="button" onClick={() => { setTimerHours(1); setTimerMinutes(0); }}>1h</button>
            </div>
            <div className={styles.timerRow}>
              <div className={styles.inputGroup}>
                <input
                  id="timer-hours"
                  name="timerHours"
                  type="number"
                  min="0"
                  placeholder="0"
                  className={styles.timerInput}
                  value={timerHours || ''}
                  onChange={(e) => setTimerHours(parseInt(e.target.value) || 0)}
                />
                <span>hours</span>
              </div>
              <div className={styles.inputGroup}>
                <input
                  id="timer-minutes"
                  name="timerMinutes"
                  type="number"
                  min="0"
                  max="59"
                  placeholder="0"
                  className={styles.timerInput}
                  value={timerMinutes || ''}
                  onChange={(e) => setTimerMinutes(parseInt(e.target.value) || 0)}
                />
                <span>minutes</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.expandBtn}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <CaretUp size={16} weight="light" /> : <Plus size={16} weight="light" />}
          {isExpanded ? 'Less' : 'More Details'}
        </button>
        <button type="submit" className={styles.submitBtn}>
          Add Task
        </button>
      </div>
    </form>
  );
};

export default AddTask;
