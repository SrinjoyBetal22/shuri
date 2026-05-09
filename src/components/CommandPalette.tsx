import React, { useEffect, useState } from 'react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import styles from './CommandPalette.module.css';

interface CommandPaletteProps {
  onAdd: (task: { title: string }) => void;
  onClose: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ onAdd, onClose }) => {
  const [input, setInput] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onAdd({ title: input });
    setInput('');
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.palette} onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <MagnifyingGlass size={20} weight="light" className={styles.icon} />
            <input
              autoFocus
              type="text"
              placeholder="Quick-capture task (e.g., 'Finish report')..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={styles.input}
            />
          </div>
        </form>
        <div className={styles.footer}>
          <span>Press <strong>Enter</strong> to create</span>
          <span>Press <strong>Esc</strong> to close</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;

