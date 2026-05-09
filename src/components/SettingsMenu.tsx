import { useState, useEffect } from 'react';
import { X, Moon, Sun, Download, Trash, Export, SpeakerSimpleHigh, SpeakerSimpleSlash, Sparkle, Tree } from '@phosphor-icons/react';
import styles from './SettingsMenu.module.css';

interface SettingsMenuProps {
  intention: string | null;
  onUpdateIntention: (val: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  onOpenHaiku: () => void;
  onOpenGarden: () => void;
  onInstallPWA: () => void;
  onClose: () => void;
}

export default function SettingsMenu({
  intention,
  onUpdateIntention,
  theme,
  onToggleTheme,
  isAudioPlaying,
  onToggleAudio,
  onOpenHaiku,
  onOpenGarden,
  onInstallPWA,
  onClose
}: SettingsMenuProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small timeout to allow mount before triggering transition
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for transition duration
  };

  return (
    <div className={`${styles.overlay} ${isVisible ? styles.visible : ''}`} onClick={handleClose}>
      <div className={`${styles.menu} ${isVisible ? styles.visible : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Settings</h2>
          <button className={styles.closeBtn} onClick={handleClose} aria-label="Close menu">
            <X size={24} />
          </button>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h3>Daily Focus</h3>
            <div className={styles.inputGroup}>
              <input 
                type="text" 
                value={intention || ''} 
                onChange={(e) => onUpdateIntention(e.target.value)}
                placeholder="What is your focus for today?"
                className={styles.input}
              />
            </div>
          </section>

          <section className={styles.section}>
            <h3>Zen & Reflection</h3>
            <div className={styles.buttonList}>
              <button className={styles.toggleBtn} onClick={onToggleAudio}>
                <div className={styles.iconLabel}>
                  {isAudioPlaying ? <SpeakerSimpleSlash size={20} weight="light" /> : <SpeakerSimpleHigh size={20} weight="light" />}
                  <span>{isAudioPlaying ? 'Stop Ambient Audio' : 'Start Ambient Audio'}</span>
                </div>
              </button>

              <button className={styles.actionBtn} onClick={onOpenHaiku}>
                <div className={styles.iconLabel}>
                  <Sparkle size={20} weight="light" />
                  <span>Day's End Reflection</span>
                </div>
              </button>
              
              <button className={styles.actionBtn} onClick={onOpenGarden}>
                <div className={styles.iconLabel}>
                  <Tree size={20} weight="light" />
                  <span>Focus Garden</span>
                </div>
              </button>
            </div>
          </section>

          <section className={styles.section}>
            <h3>Interface</h3>
            <div className={styles.buttonList}>
              <button className={styles.toggleBtn} onClick={onToggleTheme}>
                <div className={styles.iconLabel}>
                  {theme === 'dark' ? <Sun size={20} weight="light" /> : <Moon size={20} weight="light" />}
                  <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </div>
              </button>
              
              <button className={styles.actionBtn} onClick={onInstallPWA}>
                <div className={styles.iconLabel}>
                  <Download size={20} weight="light" />
                  <span>Install Application</span>
                </div>
              </button>
            </div>
          </section>

          <section className={styles.section}>
            <h3>Data Management</h3>
            <div className={styles.buttonList}>
              <button className={styles.actionBtn}>
                <div className={styles.iconLabel}>
                  <Export size={20} weight="light" />
                  <span>Export JSON Data</span>
                </div>
              </button>
              
              <button className={`${styles.actionBtn} ${styles.danger}`}>
                <div className={styles.iconLabel}>
                  <Trash size={20} weight="light" />
                  <span>Reset All Data</span>
                </div>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
