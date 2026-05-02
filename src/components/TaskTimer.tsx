import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import styles from './TaskCard.module.css';

interface TaskTimerProps {
  initialHours: number;
  initialMinutes: number;
}

const TaskTimer: React.FC<TaskTimerProps> = ({ initialHours, initialMinutes }) => {
  const [timeLeft, setTimeLeft] = useState(initialHours * 60 + initialMinutes);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [timeLeft]);

  const h = Math.floor(timeLeft / 60);
  const m = timeLeft % 60;

  return (
    <div className={styles.metaItem}>
      <Clock size={12} className={timeLeft === 0 ? styles.timerExpired : ''} />
      <span>{h}h {m}m</span>
    </div>
  );
};

export default TaskTimer;
