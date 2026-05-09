import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../config/firebase';
import styles from './LoginScreen.module.css';

export default function LoginScreen() {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <h1>Shūri</h1>
        <p>Log in to access your garden and tasks.</p>
        <button onClick={handleLogin} className={styles.loginBtn}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
