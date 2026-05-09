import React, { useState } from 'react';
import JapanPictogram from './JapanPictogram';
import styles from './IntentionScreen.module.css';

interface IntentionScreenProps {
  onSetIntention: (intention: string) => void;
}

const IntentionScreen: React.FC<IntentionScreenProps> = ({ onSetIntention }) => {
  const [intention, setIntention] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (intention.trim()) onSetIntention(intention);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <JapanPictogram name="fuji-san" size={64} className={styles.icon} />
        <h1 className={styles.title}>What is your clarity for today?</h1>
        <form onSubmit={handleSubmit}>
          <input
            autoFocus
            type="text"
            className={styles.input}
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            placeholder="Type your intention here..."
          />
        </form>
      </div>
    </div>
  );
};

export default IntentionScreen;

