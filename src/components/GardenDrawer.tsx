import React, { useState, useEffect } from 'react';
import { X, Tree } from '@phosphor-icons/react';
import JapanPictogram from './JapanPictogram';
import { useGarden, AVAILABLE_FLOWERS } from '../hooks/gardenStore';
import styles from './GardenDrawer.module.css';

interface GardenDrawerProps {
  onClose: () => void;
}

const GardenDrawer: React.FC<GardenDrawerProps> = ({ onClose }) => {
  const { sessions, unlockedFlowers } = useGarden();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Trigger opening animation
    const timer = setTimeout(() => setIsOpen(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 350); // Match CSS duration
  };

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`} onClick={handleClose}>
      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={handleClose}>
          <X size={20} weight="light" />
        </button>
        <div className={styles.header}>
          <Tree size={40} weight="light" className={styles.headerIcon} />
          <h2>Your Focus Garden</h2>
        </div>
        <p className={styles.stats}>{sessions} sessions completed</p>

        <div className={styles.grid}>
          {AVAILABLE_FLOWERS.map((flower) => {
            const isUnlocked = unlockedFlowers.some((f) => f.id === flower.id);
            return (
              <div key={flower.id} className={`${styles.flowerSlot} ${isUnlocked ? styles.unlocked : ''}`}>
                {isUnlocked ? <JapanPictogram name="bonsai" size={48} /> : <div className={styles.locked}>?</div>}
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
