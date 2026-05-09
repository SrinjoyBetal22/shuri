import React, { useEffect, useState } from 'react';
import { X, Play, Pause, Check } from '@phosphor-icons/react';
import type { Task } from '../types/task';
import styles from './FocusMode.module.css';

interface FocusModeProps {
  task: Task;
  startRect: DOMRect;
  onExit: () => void;
  onToggleTimer: () => void;
  onToggleComplete: () => void;
}

const FocusMode: React.FC<FocusModeProps> = ({ task, startRect, onExit, onToggleTimer, onToggleComplete }) => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Trigger expansion after a tiny delay to ensure initial state is rendered
    const timer = setTimeout(() => {
      setIsAnimating(false);
      // Fade in content mid-expansion
      setTimeout(() => setShowContent(true), 150);
    }, 50);

    // Lock scroll AFTER expansion to prevent layout shift during the animation
    const lockTimer = setTimeout(() => {
      document.body.style.overflow = 'hidden';
    }, 450);
    
    return () => {
      document.body.style.overflow = '';
      clearTimeout(timer);
      clearTimeout(lockTimer);
    };
  }, []);

  const handleExit = () => {
    setShowContent(false);
    // Wait for content to fade out before shrinking
    setTimeout(() => {
      setIsExiting(true);
      setIsAnimating(true);
      // Wait for shrink animation to finish
      setTimeout(onExit, 500);
    }, 200);
  };

  const formatSeconds = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    
    const parts = [
        h.toString().padStart(2, '0'),
        m.toString().padStart(2, '0'),
        s.toString().padStart(2, '0')
    ];
    return parts.join(':');
  };

  const totalSeconds = task.timer ? (task.timer.hours * 3600 + task.timer.minutes * 60) : 0;
  const progress = task.timer ? (task.timer.remainingSeconds / totalSeconds) * 100 : 0;

  const expansionStyle: React.CSSProperties = isAnimating ? {
    top: startRect.top,
    left: startRect.left,
    width: startRect.width,
    height: startRect.height,
    opacity: isExiting ? 0 : 1,
    borderRadius: '12px',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
  } : {
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    opacity: 1,
    borderRadius: '0px',
    backgroundColor: 'var(--bg-color)',
    border: '0px solid transparent',
  };

  return (
    <div 
      className={`${styles.focusOverlay} ${!isAnimating && !isExiting ? styles.expanded : ''} ${task.timer?.remainingSeconds === 0 ? styles.pulse : ''}`} 
      style={expansionStyle}
    >
      <div className={`${styles.contentWrapper} ${!showContent ? styles.hidden : ''}`}>
        <button className={styles.exitBtn} onClick={handleExit}>
          <X size={24} weight="light" />
        </button>

        <div className={styles.focusContainer}>
          <div className={styles.content}>
            <h2 className={styles.title}>{task.title}</h2>
            {task.description && <p className={styles.description}>{task.description}</p>}
          </div>

          {task.timer && (
            <div className={styles.timerSection}>
              <div className={styles.timeText}>
                {formatSeconds(task.timer.remainingSeconds)}
              </div>
              
              <div className={styles.progressBarContainer}>
                <div 
                  className={`${styles.progressBar} ${task.timer.remainingSeconds === 0 ? styles.progressBarExpired : ''}`} 
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className={styles.timerControls}>
                <button 
                  className={`${styles.playPauseBtn} ${task.timer.isActive ? styles.active : ''}`}
                  onClick={onToggleTimer}
                  disabled={task.timer.remainingSeconds === 0}
                >
                  {task.timer.isActive ? <Pause size={48} weight="fill" /> : <Play size={48} weight="fill" />}
                </button>
              </div>

              <div className={styles.stats}>
                <span>{formatSeconds(totalSeconds - task.timer.remainingSeconds)}</span>
                <span className={styles.separator}>/</span>
                <span>{formatSeconds(totalSeconds)}</span>
              </div>
            </div>
          )}

          <button className={styles.completeBtn} onClick={onToggleComplete}>
            <Check size={20} weight="light" />
            Complete
          </button>
        </div>
      </div>
    </div>
  );
};

export default FocusMode;
