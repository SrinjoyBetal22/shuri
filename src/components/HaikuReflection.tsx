import { X, Sparkle } from '@phosphor-icons/react';
import styles from './HaikuReflection.module.css';

interface HaikuReflectionProps {
  tasks: { title: string; completed: boolean }[];
  onClose: () => void;
}

export default function HaikuReflection({ tasks, onClose }: HaikuReflectionProps) {
  const completedTasks = tasks.filter(t => t.completed);
  
  // Simple "Haiku" generation logic based on task count
  const generateHaiku = () => {
    if (completedTasks.length === 0) {
      return {
        line1: "A quiet garden",
        line2: "Seeds waiting for tomorrow",
        line3: "Rest now, weary soul"
      };
    }
    if (completedTasks.length < 3) {
      return {
        line1: "First steps on the path",
        line2: "Slow progress is still motion",
        line3: "Sun sets on the work"
      };
    }
    return {
      line1: "The mountain climbed high",
      line2: "Effort turned to achievement",
      line3: "Clarity found here"
    };
  };

  const haiku = generateHaiku();

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.container} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}><X size={24} /></button>
        
        <div className={styles.content}>
          <div className={styles.icon}><Sparkle size={48} weight="light" /></div>
          <h2 className={styles.title}>Day's End Reflection</h2>
          
          <div className={styles.haiku}>
            <p>{haiku.line1}</p>
            <p>{haiku.line2}</p>
            <p>{haiku.line3}</p>
          </div>
          
          <div className={styles.stats}>
            <p>You repaired <strong>{completedTasks.length}</strong> moments today.</p>
          </div>

          <div className={styles.taskList}>
            {completedTasks.map((t, i) => (
              <div key={i} className={styles.taskItem}>
                <span className={styles.bullet}>◈</span> {t.title}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
