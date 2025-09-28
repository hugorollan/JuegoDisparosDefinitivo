"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

import { GameArea } from '@/components/game/game-area';
import { Hud } from '@/components/game/hud';
import { StartScreen } from '@/components/game/start-screen';
import { GameOverScreen } from '@/components/game/game-over-screen';
import { WinScreen } from '@/components/game/win-screen';
import { LevelTransitionScreen } from '@/components/game/level-transition-screen';
import { PauseScreen } from '@/components/game/pause-screen';

import type { GameObject, GameState, KeysPressed } from '@/lib/types';
import {
  GAME_WIDTH, GAME_HEIGHT, PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_SPEED, SHOT_WIDTH, SHOT_HEIGHT, PLAYER_SHOT_SPEED, ENEMY_SHOT_SPEED, SHOT_COOLDOWN, INITIAL_LIVES, OPPONENT_WIDTH, OPPONENT_HEIGHT, PENTAGON_BOSS_WIDTH, PENTAGON_BOSS_HEIGHT, SQUARE_BOSS_WIDTH, SQUARE_BOSS_HEIGHT, BOSS_WIDTH, BOSS_HEIGHT, MAX_ROUNDS
} from '@/lib/constants';
import { playMenuMusic, playPauseMusic, stopMusic } from '@/lib/audio';

export default function StarDefenderGame() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [round, setRound] = useState(1);
  const [level, setLevel] = useState(1);
  const [keysPressed, setKeysPressed] = useState<KeysPressed>({});
  
  const [player, setPlayer] = useState<GameObject>({ id: 0, x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2, y: GAME_HEIGHT - PLAYER_HEIGHT - 20, width: PLAYER_WIDTH, height: PLAYER_HEIGHT });
  const [playerShots, setPlayerShots] = useState<GameObject[]>([]);
  const [opponents, setOpponents] = useState<GameObject[]>([]);
  const [enemyShots, setEnemyShots] = useState<GameObject[]>([]);
  const [explosions, setExplosions] = useState<GameObject[]>([]);

  const [lastShotTime, setLastShotTime] = useState(0);
  const [isInvincible, setIsInvincible] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);

  const playShotSound = useCallback(() => {
    if (!audioContextRef.current) {
        if (typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    }
    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }, []);

  const playExplosionSound = useCallback(() => {
    if (!audioContextRef.current) {
      if (typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    }
    const audioContext = audioContextRef.current;
    if (!audioContext) return;
  
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
  
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
  
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.2);
  
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.2);
  
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  }, []);

  const setupRound = useCallback((currentRound: number) => {
    setPlayer({ id: 0, x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2, y: GAME_HEIGHT - PLAYER_HEIGHT - 20, width: PLAYER_WIDTH, height: PLAYER_HEIGHT });
    setPlayerShots([]);
    setEnemyShots([]);
    setExplosions([]);

    let newOpponents: GameObject[] = [];
    if (currentRound === 1) {
      newOpponents = [{
        id: Date.now(),
        type: 'triangle',
        x: GAME_WIDTH / 2 - OPPONENT_WIDTH / 2,
        y: 50,
        width: OPPONENT_WIDTH,
        height: OPPONENT_HEIGHT,
        dx: 2,
        dy: 0,
        health: 1,
      }];
    } else if (currentRound === 2) {
      newOpponents = [{
        id: Date.now(),
        type: 'pentagon',
        x: GAME_WIDTH / 2 - PENTAGON_BOSS_WIDTH / 2,
        y: 50,
        width: PENTAGON_BOSS_WIDTH,
        height: PENTAGON_BOSS_HEIGHT,
        dx: 3,
        dy: 0,
        health: 3,
      }];
    } else if (currentRound === 3) {
      newOpponents = [{
        id: Date.now(),
        type: 'square',
        x: GAME_WIDTH / 2 - SQUARE_BOSS_WIDTH / 2,
        y: 50,
        width: SQUARE_BOSS_WIDTH,
        height: SQUARE_BOSS_HEIGHT,
        dx: 4,
        dy: 0,
        health: 5,
      }];
    } else if (currentRound === 4) {
      newOpponents = [{
        id: Date.now(),
        type: 'boss',
        x: GAME_WIDTH / 2 - BOSS_WIDTH / 2,
        y: 50,
        width: BOSS_WIDTH,
        height: BOSS_HEIGHT,
        dx: 2,
        dy: 0,
        health: 10,
      }];
    }
    setOpponents(newOpponents);
  }, []);

  const startGame = useCallback(() => {
    stopMusic();
    setScore(0);
    setLives(INITIAL_LIVES);
    setRound(1);
    setLevel(1);
    setupRound(1);
    setGameState('playing');
  }, [setupRound]);

  const togglePause = useCallback(() => {
    if (gameState === 'playing') {
      setGameState('paused');
      playPauseMusic();
    } else if (gameState === 'paused') {
      setGameState('playing');
      stopMusic();
    }
  }, [gameState]);

  const handleNextRound = useCallback(() => {
    setGameState('levelTransition');
    const nextRound = round + 1;
    setRound(nextRound);
    setTimeout(() => {
      setupRound(nextRound);
      setGameState('playing');
    }, 2000);
  }, [round, setupRound]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'p' || key === 'escape') {
        togglePause();
      } else {
        setKeysPressed(prev => ({ ...prev, [key]: true }));
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => setKeysPressed(prev => ({...prev, [e.key.toLowerCase()]: false }));
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [togglePause]);

  useEffect(() => {
    if (gameState === 'start') {
      playMenuMusic();
    } else {
      stopMusic();
    }
    return () => {
      stopMusic();
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    let animationFrameId: number;

    const gameLoop = () => {
      // Player movement
      setPlayer(p => {
        let newX = p.x;
        if (keysPressed['arrowleft'] || keysPressed['a']) newX -= PLAYER_SPEED;
        if (keysPressed['arrowright'] || keysPressed['d']) newX += PLAYER_SPEED;
        return {...p, x: Math.max(0, Math.min(GAME_WIDTH - p.width, newX))};
      });

      // Player shooting
      const now = Date.now();
      if ((keysPressed[' '] || keysPressed['arrowup'] || keysPressed['w']) && now - lastShotTime > SHOT_COOLDOWN) {
        setPlayerShots(shots => [...shots, {
          id: now, x: player.x + player.width / 2 - SHOT_WIDTH / 2, y: player.y, width: SHOT_WIDTH, height: SHOT_HEIGHT
        }]);
        setLastShotTime(now);
        playShotSound();
      }
      
      // Update positions
      setPlayerShots(shots => shots.map(s => ({...s, y: s.y - PLAYER_SHOT_SPEED})).filter(s => s.y > -s.height));
      setEnemyShots(shots => shots.map(s => ({...s, y: s.y + ENEMY_SHOT_SPEED})).filter(s => s.y < GAME_HEIGHT));
      
      setOpponents(opps => opps.map(opp => {
        let newX = opp.x + (opp.dx ?? 0);
        let newDx = opp.dx ?? 2;
        if (newX <= 0 || newX >= GAME_WIDTH - opp.width) newDx *= -1;
        if (Math.random() < 0.01 + round * 0.005) {
            setEnemyShots(shots => [...shots, {
                id: Date.now() + Math.random(), x: opp.x + opp.width / 2 - SHOT_WIDTH / 2, y: opp.y + opp.height, width: SHOT_WIDTH, height: SHOT_HEIGHT
            }]);
        }
        return {...opp, x: newX, dx: newDx};
      }));

      // Collision Detection
      let hitPlayerShotIds = new Set();
      let updatedOpponents = [...opponents];
      
      playerShots.forEach(shot => {
        updatedOpponents.forEach((opp, oppIndex) => {
          if (hitPlayerShotIds.has(shot.id)) return;

          if (shot.x < opp.x + opp.width && shot.x + shot.width > opp.x && shot.y < opp.y + opp.height && shot.y + shot.height > opp.y) {
            hitPlayerShotIds.add(shot.id);
            const newHealth = (opp.health ?? 1) - 1;

            if (newHealth <= 0) {
              updatedOpponents.splice(oppIndex, 1);
              setScore(s => s + 100);
              const explosion = { id: opp.id, x: opp.x, y: opp.y, width: opp.width, height: opp.height };
              setExplosions(ex => [...ex, explosion]);
              playExplosionSound();
              setTimeout(() => setExplosions(ex => ex.filter(e => e.id !== explosion.id)), 300);
            } else {
              updatedOpponents[oppIndex] = { ...opp, health: newHealth };
            }
          }
        });
      });
      
      if (hitPlayerShotIds.size > 0) {
        setOpponents(updatedOpponents);
        setPlayerShots(shots => shots.filter(s => !hitPlayerShotIds.has(s.id)));
      }

      let playerIsHit = false;
      let hitEnemyShotIds = new Set();
      if (!isInvincible) {
        enemyShots.forEach(shot => {
          if (shot.x < player.x + player.width && shot.x + shot.width > player.x && shot.y < player.y + player.height && shot.y + shot.height > player.y) {
            playerIsHit = true;
            hitEnemyShotIds.add(shot.id);
          }
        });
      }

      if (playerIsHit) {
        setLives(l => l - 1);
        setIsInvincible(true);
        setTimeout(() => setIsInvincible(false), 1500);
      }
      
      if (hitEnemyShotIds.size > 0) {
        setEnemyShots(shots => shots.filter(s => !hitEnemyShotIds.has(s.id)));
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };
    
    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);

  }, [gameState, keysPressed, player.x, player.y, lastShotTime, opponents, playerShots, enemyShots, isInvincible, round, playShotSound, playExplosionSound]);

  useEffect(() => {
    if (gameState === 'playing' && lives <= 0) {
      setGameState('gameOver');
    }
  }, [lives, gameState]);

  useEffect(() => {
    if (gameState === 'playing' && opponents.length === 0) {
      if (round < MAX_ROUNDS) {
        handleNextRound();
      } else {
        setGameState('win');
      }
    }
  }, [opponents, round, gameState, handleNextRound]);
  
  const gameContent = useMemo(() => {
    switch (gameState) {
      case 'start':
        return <StartScreen onStart={startGame} />;
      case 'gameOver':
        return <GameOverScreen score={score} onRestart={startGame} />;
      case 'win':
        return <WinScreen score={score} onRestart={startGame} />;
      case 'levelTransition':
        return <LevelTransitionScreen round={round} />;
      case 'paused':
        return <PauseScreen onResume={togglePause} onRestart={startGame} />;
      case 'playing':
        return <GameArea player={player} playerShots={playerShots} opponents={opponents} enemyShots={enemyShots} explosions={explosions} isInvincible={isInvincible} />;
      default:
        return null;
    }
  }, [gameState, score, startGame, player, playerShots, opponents, enemyShots, explosions, round, isInvincible, togglePause]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden">
      <div className="relative" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
        {(gameState === 'playing' || gameState === 'levelTransition' || gameState === 'paused') && <Hud score={score} lives={lives} />}
        {gameContent}
      </div>
      <div className="text-center mt-4 text-xs max-w-2xl text-muted-foreground font-code px-4">
        <p>Use Arrow Keys or A/D to move. Use Space, Up Arrow, or W to shoot.</p>
        <p>Press P or Esc to pause the game.</p>
      </div>
    </main>
  );
}
