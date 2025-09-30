export interface GameObject {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  dx?: number;
  dy?: number;
  type?: 'triangle' | 'pentagon' | 'square' | 'boss' | 'octagon' | 'hexagon' | PowerUpType;
  health?: number;
  duration?: number;
  createdAt?: number;
}

export type PowerUpType = 'EXTRA_LIFE' | 'FAST_SHOT' | 'SHIELD';

export type GameState = 'start' | 'playing' | 'paused' | 'gameOver' | 'win' | 'levelTransition';

export interface KeysPressed {
  [key: string]: boolean;
}
