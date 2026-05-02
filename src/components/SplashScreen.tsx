import React, { useEffect, useState } from 'react';
import styles from './SplashScreen.module.css';

const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(onComplete, 500); // Wait for fade out
    }, 1500); // Duration of splash
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`${styles.splash} ${fading ? styles.fade : ''}`}>
      <h1 className={styles.logo}>Shūri</h1>
    </div>
  );
};

export default SplashScreen;
