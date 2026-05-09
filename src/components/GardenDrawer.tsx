import React, { useState, useEffect } from 'react';
import { X, Tree } from '@phosphor-icons/react';
import JapanPictogram from './JapanPictogram';
import { useGarden } from '../hooks/gardenStore';
import styles from './GardenDrawer.module.css';

interface GardenDrawerProps {
  onClose: () => void;
}

const GardenDrawer: React.FC<GardenDrawerProps> = ({ onClose }) => {
  const { sessions, unlockedFlowers, nextFlower } = useGarden();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 350);
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
        
        <div className={styles.nextFlower}>
             <p>Next flower:</p>
             <div className={styles.locked}>?</div>
             <p>{nextFlower.name} ({nextFlower.threshold} sessions)</p>
        </div>
        
        <p className={styles.guideLine}>10 completed tasks will unlock each new flower</p>

        <div className={styles.taskList}>
           <h3>Unlocked Flowers</h3>
           <div className={styles.grid}>
             {unlockedFlowers.map((flower) => (
                 <div key={flower.id} className={`${styles.flowerSlot} ${styles.unlocked}`}>
                   <JapanPictogram name="bonsai" size={48} />
                   <span className={styles.flowerName}>{flower.name}</span>
                 </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default GardenDrawer;
