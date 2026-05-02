import { useState, useEffect } from 'react';

export interface Flower {
  id: string;
  name: string;
  threshold: number;
}

export const AVAILABLE_FLOWERS: Flower[] = [
  { id: 'tsukushi', name: 'Tsukushi', threshold: 10 },
  { id: 'sakura', name: 'Sakura', threshold: 50 },
  { id: 'tsubaki', name: 'Tsubaki', threshold: 100 },
];

export const useGarden = () => {
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('shuri-sessions');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('shuri-sessions', sessions.toString());
  }, [sessions]);

  const incrementSessions = () => setSessions((s) => s + 1);

  const unlockedFlowers = AVAILABLE_FLOWERS.filter((f) => sessions >= f.threshold);

  return { sessions, incrementSessions, unlockedFlowers };
};
