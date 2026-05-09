// src/hooks/zenMusic.ts

class ZenMusicPlayer {
  private audio: HTMLAudioElement | null = null;

  public play() {
    if (!this.audio) {
      console.log('Initializing audio with path: /sounds/forest.mp3');
      this.audio = new Audio('/sounds/forest.mp3');
      this.audio.loop = true;
      this.audio.volume = 0.8; // Set default volume to 80%
      this.audio.onerror = (e) => console.error('Audio playback error:', e);
    }
    
    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => console.log('Playback started successfully'))
        .catch((error) => console.error('Playback failed:', error));
    }
  }

  public pause() {
    this.audio?.pause();
  }
}

export const zenMusic = new ZenMusicPlayer();
