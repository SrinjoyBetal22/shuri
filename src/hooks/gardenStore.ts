import { useState, useEffect } from 'react';

export interface Flower {
  id: string;
  name: string;
  threshold: number;
}

const FLOWER_TYPES = ['Tsukushi', 'Sakura', 'Tsubaki', 'Ume', 'Ayame'];

export const useGarden = () => {
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('shuri-sessions');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('shuri-sessions', sessions.toString());
  }, [sessions]);

  const incrementSessions = () => setSessions((s) => s + 1);

  const numUnlocked = Math.floor(sessions / 10);
  
  const unlockedFlowers: Flower[] = Array.from({ length: numUnlocked }, (_, i) => ({
    id: `flower-${i}`,
    name: FLOWER_TYPES[i % FLOWER_TYPES.length],
    threshold: (i + 1) * 10
  }));

  const nextFlower = {
    id: `flower-${numUnlocked}`,
    name: FLOWER_TYPES[numUnlocked % FLOWER_TYPES.length],
    threshold: (numUnlocked + 1) * 10
  };

  return { sessions, incrementSessions, unlockedFlowers, nextFlower };
};
