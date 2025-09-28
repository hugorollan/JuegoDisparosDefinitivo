"use client";

let audioContext: AudioContext | null = null;
let musicSource: AudioBufferSourceNode | null = null;
let musicGainNode: GainNode | null = null;
let musicPlaying = false;
let loopTimeout: NodeJS.Timeout | null = null;


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
  
  if (!musicSource || !musicGainNode) return;

  musicSource.connect(musicGainNode);
  musicGainNode.connect(context.destination);

  let startTime = context.currentTime;
  const noteDuration = 60 / tempo;

  notes.forEach(note => {
    if (!musicGainNode) return;
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

  if (musicSource) {
    musicSource.start(0);
    musicPlaying = true;
  }
  
  if (loop) {
    const totalDuration = notes.reduce((max, note) => Math.max(max, note.delay + note.duration), 0) * noteDuration * 1000;
    if (loopTimeout) clearTimeout(loopTimeout);
    loopTimeout = setTimeout(() => playMusic(notes, tempo, loop), totalDuration);
  }
};

export const stopMusic = () => {
  if (loopTimeout) {
    clearTimeout(loopTimeout);
    loopTimeout = null;
  }
  if (musicPlaying && musicSource) {
    if (musicGainNode) {
      musicGainNode.gain.cancelScheduledValues(0);
      musicGainNode.gain.setValueAtTime(0, 0);
    }
    musicSource.stop(0);
    musicSource.disconnect();
    musicSource = null;
    musicGainNode = null;
  }
  musicPlaying = false;
};

const menuTheme = [
  // Arpeggio
  { freq: 261.63, duration: 0.25, delay: 0 }, { freq: 329.63, duration: 0.25, delay: 0.25 }, { freq: 392.00, duration: 0.25, delay: 0.5 }, { freq: 523.25, duration: 0.25, delay: 0.75 },
  { freq: 261.63, duration: 0.25, delay: 1 }, { freq: 329.63, duration: 0.25, delay: 1.25 }, { freq: 392.00, duration: 0.25, delay: 1.5 }, { freq: 523.25, duration: 0.25, delay: 1.75 },
  // Melody
  { freq: 392.00, duration: 0.5, delay: 2 }, { freq: 440.00, duration: 0.5, delay: 2.5 }, { freq: 493.88, duration: 1, delay: 3 },
  { freq: 392.00, duration: 0.5, delay: 4 }, { freq: 329.63, duration: 0.5, delay: 4.5 }, { freq: 349.23, duration: 1, delay: 5 },
];

const gameTheme = [
  // Bassline
  { freq: 130.81, duration: 0.25, delay: 0 }, { freq: 130.81, duration: 0.25, delay: 0.5 },
  { freq: 130.81, duration: 0.25, delay: 1 }, { freq: 130.81, duration: 0.25, delay: 1.5 },
  { freq: 146.83, duration: 0.25, delay: 2 }, { freq: 146.83, duration: 0.25, delay: 2.5 },
  { freq: 164.81, duration: 0.25, delay: 3 }, { freq: 164.81, duration: 0.25, delay: 3.5 },

  // Melody
  { freq: 261.63, duration: 0.25, delay: 0 }, { freq: 293.66, duration: 0.25, delay: 0.25 }, { freq: 329.63, duration: 0.5, delay: 0.5 },
  { freq: 261.63, duration: 0.25, delay: 1.5 }, { freq: 293.66, duration: 0.25, delay: 1.75 }, { freq: 329.63, duration: 0.25, delay: 2.0 },
  { freq: 349.23, duration: 0.5, delay: 2.5 }, { freq: 329.63, duration: 0.5, delay: 3.0 },
];

const gameOverTheme = [
  { freq: 110.00, duration: 1, delay: 0 }, { freq: 103.83, duration: 1, delay: 1 },
  { freq: 98.00, duration: 2, delay: 2 },
  { freq: 110.00, duration: 0.5, delay: 4 }, { freq: 103.83, duration: 0.5, delay: 4.5 },
  { freq: 98.00, duration: 1, delay: 5 },
];


export const playMenuMusic = () => {
  playMusic(menuTheme, 140, true);
};

export const playGameMusic = () => {
    playMusic(gameTheme, 160, true);
};

export const playGameOverMusic = () => {
  playMusic(gameOverTheme, 100, true);
};
