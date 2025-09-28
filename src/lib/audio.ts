"use client";

let audioContext: AudioContext | null = null;
let musicSource: AudioBufferSourceNode | null = null;
let musicGainNode: GainNode | null = null;

const getAudioContext = () => {
  if (typeof window !== 'undefined' && !audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

const playMusic = (notes: { freq: number, duration: number, delay: number }[], tempo = 120, loop = true) => {
  const context = getAudioContext();
  if (!context) return;

  stopMusic();

  musicSource = context.createBufferSource();
  musicGainNode = context.createGain();
  musicGainNode.gain.value = 0.1; // Music volume
  musicSource.connect(musicGainNode);
  musicGainNode.connect(context.destination);

  let startTime = context.currentTime;
  const noteDuration = 60 / tempo;

  notes.forEach(note => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.connect(gain);
    gain.connect(musicGainNode);

    oscillator.frequency.setValueAtTime(note.freq, startTime + note.delay * noteDuration);
    gain.gain.setValueAtTime(1, startTime + note.delay * noteDuration);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + (note.delay + note.duration) * noteDuration);
    
    oscillator.start(startTime + note.delay * noteDuration);
    oscillator.stop(startTime + (note.delay + note.duration) * noteDuration);
  });
  
  if (loop) {
    const totalDuration = notes.reduce((max, note) => Math.max(max, note.delay + note.duration), 0) * noteDuration * 1000;
    setTimeout(() => playMusic(notes, tempo, loop), totalDuration);
  }
};

export const stopMusic = () => {
  if (musicSource) {
    // We can't actually stop the scheduled notes, so we just mute them.
    if (musicGainNode) {
      musicGainNode.gain.cancelScheduledValues(0);
      musicGainNode.gain.setValueAtTime(0, 0);
    }
    musicSource.stop(0);
    musicSource.disconnect();
    musicSource = null;
  }
};

const menuTheme = [
  // Arpeggio
  { freq: 261.63, duration: 0.25, delay: 0 }, { freq: 329.63, duration: 0.25, delay: 0.25 }, { freq: 392.00, duration: 0.25, delay: 0.5 }, { freq: 523.25, duration: 0.25, delay: 0.75 },
  { freq: 261.63, duration: 0.25, delay: 1 }, { freq: 329.63, duration: 0.25, delay: 1.25 }, { freq: 392.00, duration: 0.25, delay: 1.5 }, { freq: 523.25, duration: 0.25, delay: 1.75 },
  // Melody
  { freq: 392.00, duration: 0.5, delay: 2 }, { freq: 440.00, duration: 0.5, delay: 2.5 }, { freq: 493.88, duration: 1, delay: 3 },
  { freq: 392.00, duration: 0.5, delay: 4 }, { freq: 329.63, duration: 0.5, delay: 4.5 }, { freq: 349.23, duration: 1, delay: 5 },
];


const pauseTheme = [
    { freq: 220.00, duration: 0.5, delay: 0 },
    { freq: 220.00, duration: 0.5, delay: 0.75 },
    { freq: 220.00, duration: 0.5, delay: 1.5 },
    { freq: 261.63, duration: 0.75, delay: 2.25 },
    { freq: 220.00, duration: 0.5, delay: 3 },
    { freq: 220.00, duration: 0.5, delay: 3.75 },
    { freq: 196.00, duration: 1, delay: 4.5 },
];

export const playMenuMusic = () => {
  playMusic(menuTheme, 140, true);
};

export const playPauseMusic = () => {
    playMusic(pauseTheme, 100, true);
}
