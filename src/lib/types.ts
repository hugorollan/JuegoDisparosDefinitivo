export interface GameObject {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  dx?: number;
  dy?: number;
  type?: 'triangle' | 'pentagon' | 'square' | 'boss';
  health?: number;
}

export type GameState = 'start' | 'playing' | 'paused' | 'gameOver' | 'win' | 'levelTransition';

export interface KeysPressed {
  [key: string]: boolean;
}
