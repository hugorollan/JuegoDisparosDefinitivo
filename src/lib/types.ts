export interface GameObject {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  dx?: number;
  dy?: number;
  type?: 'triangle' | 'pentagon';
}

export type GameState = 'start' | 'playing' | 'gameOver' | 'win' | 'levelTransition';

export interface KeysPressed {
  [key: string]: boolean;
}
