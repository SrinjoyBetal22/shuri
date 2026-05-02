import { useState, useEffect } from 'react';
import { useTasks } from './hooks/useTasks';
import { useGarden } from './hooks/gardenStore';
import styles from './App.module.css';
import type { FilterType } from './types/task';
import AddTask from './components/AddTask';
import TaskList from './components/TaskList';
import FocusMode from './components/FocusMode';
import CommandPalette from './components/CommandPalette';
import GardenDrawer from './components/GardenDrawer';
import IntentionScreen from './components/IntentionScreen';
import SplashScreen from './components/SplashScreen';
import { Sprout, Sun, Moon } from 'lucide-react';

function App() {
  const { incrementSessions } = useGarden();
  const { 
    filter, 
    setFilter, 
    filteredTasks, 
    addTask, 
    toggleComplete, 
    deleteTask,
    updateTask,
    toggleTimer
  } = useTasks();

  const [isLoading, setIsLoading] = useState(true);
  const [focusState, setFocusState] = useState<{ id: string; rect: DOMRect } | null>(null);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isGardenOpen, setIsGardenOpen] = useState(false);
  const [intention, setIntention] = useState<string | null>(null);
  const [hasShownIntention, setHasShownIntention] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [focusedIndex, setFocusedIndex] = useState(-1);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem('shuri-last-date');
    const storedIntention = localStorage.getItem('shuri-intention');

    if (lastDate === today && storedIntention) {
      setIntention(storedIntention);
      setHasShownIntention(true);
    }
  }, []);

  if (isLoading) {
    return <SplashScreen onComplete={() => setIsLoading(false)} />;
  }

  const handleSetIntention = (text: string) => {
    const today = new Date().toDateString();
    localStorage.setItem('shuri-last-date', today);
    localStorage.setItem('shuri-intention', text);
    setIntention(text);
    setHasShownIntention(true);
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

  const filters: { label: FilterType; dotClass: string }[] = [
    { label: 'All', dotClass: styles.dotAll },
    { label: 'Overdue', dotClass: styles.dotOverdue },
    { label: 'Due Today', dotClass: styles.dotToday },
    { label: 'Due Soon', dotClass: styles.dotSoon },
    { label: 'Completed', dotClass: styles.dotCompleted },
  ];

  const focusedTask = filteredTasks.find(t => t.id === focusState?.id);

  const handleFocus = (id: string, rect: DOMRect) => {
    setFocusState({ id, rect });
  };

  return (
    <div className={styles.container}>
      {!hasShownIntention && <IntentionScreen onSetIntention={handleSetIntention} />}
      <header className={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <h1 className={styles.title}>Shūri</h1>
            <p className={styles.subtitle}>Clarity in Motion</p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')} style={{ color: 'var(--text-subtle)' }}>
              {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <button onClick={() => setIsGardenOpen(true)} style={{ color: 'var(--text-subtle)' }}>
              <Sprout size={24} />
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

        <nav className={styles.tabs}>
          {filters.map((f) => (
            <button
              key={f.label}
              title={f.label}
              className={`${styles.tab} ${filter === f.label ? styles.tabActive : ''}`}
              onClick={() => setFilter(f.label)}
            >
              <span className={`${styles.dot} ${f.dotClass}`} />
              <span className={styles.tabText}>{f.label}</span>
            </button>
          ))}
        </nav>
        
        <div className={styles.listHeader}>
          <span className={styles.listTitle}>{filter} Tasks</span>
          <span className={styles.count}>
            {filteredTasks.length} {filteredTasks.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        <TaskList 
          tasks={filteredTasks} 
          onToggle={toggleComplete} 
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

      {isGardenOpen && (
        <GardenDrawer onClose={() => setIsGardenOpen(false)} />
      )}

      {focusState && focusedTask && (
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
        />
      )}
    </div>
  );
}

export default App;
