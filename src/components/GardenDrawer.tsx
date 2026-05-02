import React from 'react';
import { X, Sprout } from 'lucide-react';
import { useGarden, AVAILABLE_FLOWERS } from '../hooks/gardenStore';
import styles from './GardenDrawer.module.css';

interface GardenDrawerProps {
  onClose: () => void;
}

const GardenDrawer: React.FC<GardenDrawerProps> = ({ onClose }) => {
  const { sessions, unlockedFlowers } = useGarden();

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        <h2>Your Focus Garden</h2>
        <p className={styles.stats}>{sessions} sessions completed</p>

        <div className={styles.grid}>
          {AVAILABLE_FLOWERS.map((flower) => {
            const isUnlocked = unlockedFlowers.some((f) => f.id === flower.id);
            return (
              <div key={flower.id} className={`${styles.flowerSlot} ${isUnlocked ? styles.unlocked : ''}`}>
                {isUnlocked ? <Sprout size={32} /> : <div className={styles.locked}>?</div>}
                <span>{flower.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GardenDrawer;
