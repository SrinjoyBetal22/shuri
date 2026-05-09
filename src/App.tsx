import { useState, useEffect } from 'react';
import { useTasks } from './hooks/useTasks';
import { useGarden } from './hooks/gardenStore';
import { zenMusic } from './hooks/zenMusic';
import type { FilterType } from './types/task';
import styles from './App.module.css';
import AddTask from './components/AddTask';
import TaskList from './components/TaskList';
import FocusMode from './components/FocusMode';
import CommandPalette from './components/CommandPalette';
import GardenDrawer from './components/GardenDrawer';
import IntentionScreen from './components/IntentionScreen';
import SettingsMenu from './components/SettingsMenu';
import TagFilter from './components/TagFilter';
import { Gear, Hexagon } from '@phosphor-icons/react';

function App() {
  const { incrementSessions } = useGarden();
  const { 
    filter, 
    setFilter, 
    selectedTag,
    setSelectedTag,
    filteredTasks, 
    tasks,
    addTask, 
    toggleComplete, 
    deleteTask,
    updateTask,
    toggleTimer
  } = useTasks();

  const [focusState, setFocusState] = useState<{ id: string; rect: DOMRect } | null>(null);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isGardenOpen, setIsGardenOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any | null>(null);
  const [isInstalled, setIsInstalled] = useState(window.matchMedia('(display-mode: standalone)').matches);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    const handler = (e: MediaQueryListEvent) => setIsInstalled(e.matches);
    window.matchMedia('(display-mode: standalone)').addEventListener('change', handler);
    return () => window.matchMedia('(display-mode: standalone)').removeEventListener('change', handler);
  }, []);

  const toggleAudio = () => {
    if (isAudioPlaying) {
      zenMusic.pause();
    } else {
      zenMusic.play();
    }
    setIsAudioPlaying(!isAudioPlaying);
  };
  const [intention, setIntention] = useState<string | null>(() => {
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem('shuri-last-date');
    const storedIntention = localStorage.getItem('shuri-intention');
    return lastDate === today ? storedIntention : null;
  });
  const [hasShownIntention, setHasShownIntention] = useState(() => {
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem('shuri-last-date');
    return lastDate === today && !!localStorage.getItem('shuri-intention');
  });
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const [focusedIndex, setFocusedIndex] = useState(-1);

  const filters: { label: FilterType; dotClass: string }[] = [
    { label: 'All', dotClass: styles.dotAll },
    { label: 'Overdue', dotClass: styles.dotOverdue },
    { label: 'Due Today', dotClass: styles.dotToday },
    { label: 'Due Soon', dotClass: styles.dotSoon },
    { label: 'Completed', dotClass: styles.dotCompleted },
  ];

  const allTags = Array.from(new Set(tasks.flatMap(t => t.tags || [])));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleSetIntention = (text: string) => {
    const today = new Date().toDateString();
    localStorage.setItem('shuri-last-date', today);
    localStorage.setItem('shuri-intention', text);
    setIntention(text);
    setHasShownIntention(true);
  };

  const handleFocus = (id: string, rect: DOMRect) => {
    setFocusState({ id, rect });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsPaletteOpen(prev => !prev);
      }
      if (e.key === 'ArrowDown') {
        setFocusedIndex(prev => Math.min(prev + 1, filteredTasks.length - 1));
      } else if (e.key === 'ArrowUp') {
        setFocusedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && focusedIndex >= 0) {
        const task = filteredTasks[focusedIndex];
        if (task) handleFocus(task.id, new DOMRect());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, filteredTasks]);

  const handleToggleComplete = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
      incrementSessions();
    }
    toggleComplete(id);
  };

  return (
    <div className={styles.container}>
      {!hasShownIntention && <IntentionScreen onSetIntention={handleSetIntention} />}
      <header className={styles.header} style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <h1 className={styles.title}>Shūri</h1>
            <p className={styles.subtitle}>Clarity in Motion</p>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button 
              className={styles.gardenBtn} 
              onClick={() => setIsSettingsOpen(true)} 
              title="Settings"
            >
              <Gear size={24} weight="light" />
            </button>
          </div>
        </div>
        {intention && (
          <div style={{ padding: '8px 0', color: 'var(--text-subtle)', textAlign: 'center', fontStyle: 'italic', fontSize: '0.9rem' }}>
            "{intention}"
          </div>
        )}
      </header>

      <main className={styles.main}>
        <AddTask onAdd={addTask} />

        <div className={styles.filterContainer}>
          <nav className={styles.tabs}>
            {filters.map((f) => (
              <button
                key={f.label}
                title={f.label}
                className={`${styles.tab} ${filter === f.label && !selectedTag ? styles.tabActive : ''}`}
                onClick={() => { setFilter(f.label); setSelectedTag(null); }}
              >
                <Hexagon size={12} weight="fill" className={`${styles.filterIcon} ${f.dotClass}`} />
                <span className={styles.tabText}>{f.label}</span>
              </button>
            ))}
          </nav>
          {allTags.length > 0 && (
            <TagFilter 
              tags={allTags} 
              selectedTag={selectedTag} 
              onSelect={(tag) => { setSelectedTag(tag); setFilter('All'); }} 
            />
          )}
        </div>
        
        <div className={styles.listHeader}>
          <span className={styles.listTitle}>{selectedTag ? `Tag: ${selectedTag}` : filter} Tasks</span>
          <span className={styles.count}>
            {filteredTasks.length} {filteredTasks.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        <TaskList 
          tasks={filteredTasks} 
          onToggle={handleToggleComplete} 
          onDelete={deleteTask} 
          onUpdate={updateTask}
          onToggleTimer={toggleTimer}
          onFocus={handleFocus}
          focusedIndex={focusedIndex}
        />
      </main>

      {isPaletteOpen && (
        <CommandPalette 
          onAdd={addTask} 
          onClose={() => setIsPaletteOpen(false)} 
        />
      )}

      {isSettingsOpen && (
        <SettingsMenu 
          intention={intention}
          onUpdateIntention={handleSetIntention}
          theme={theme}
          onToggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
          isAudioPlaying={isAudioPlaying}
          onToggleAudio={toggleAudio}
          isInstalled={isInstalled}
          onOpenGarden={() => setIsGardenOpen(true)}
          onInstallPWA={async () => {
            if (deferredPrompt) {
              await deferredPrompt.prompt();
              const { outcome } = await deferredPrompt.userChoice;
              if (outcome === 'accepted') {
                setDeferredPrompt(null);
              }
            }
          }}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {isGardenOpen && (
        <GardenDrawer onClose={() => setIsGardenOpen(false)} />
      )}

      {(() => {
        const focusedTask = focusState ? filteredTasks.find(t => t.id === focusState.id) : null;
        return focusState && focusedTask && (
          <FocusMode 
            task={focusedTask} 
            startRect={focusState.rect}
            onExit={() => setFocusState(null)} 
            onToggleTimer={() => toggleTimer(focusedTask.id)}
            onToggleComplete={() => {
              toggleComplete(focusedTask.id);
              incrementSessions();
              setFocusState(null);
            }}
            isAudioPlaying={isAudioPlaying}
            onToggleAudio={toggleAudio}
          />
        );
      })()}
    </div>
  );
}

export default App;
