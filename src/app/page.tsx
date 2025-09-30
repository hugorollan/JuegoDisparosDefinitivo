"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

import { GameArea } from '@/components/game/game-area';
import { Hud } from '@/components/game/hud';
import { StartScreen } from '@/components/game/start-screen';
import { GameOverScreen } from '@/components/game/game-over-screen';
import { WinScreen } from '@/components/game/win-screen';
import { LevelTransitionScreen } from '@/components/game/level-transition-screen';
import { PauseScreen } from '@/components/game/pause-screen';

import type { GameObject, GameState, KeysPressed, PowerUpType } from '@/lib/types';
import {
  GAME_WIDTH, GAME_HEIGHT, PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_SPEED, SHOT_WIDTH, SHOT_HEIGHT, PLAYER_SHOT_SPEED, ENEMY_SHOT_SPEED, SHOT_COOLDOWN, INITIAL_LIVES, OPPONENT_WIDTH, OPPONENT_HEIGHT, PENTAGON_BOSS_WIDTH, PENTAGON_BOSS_HEIGHT, SQUARE_BOSS_WIDTH, SQUARE_BOSS_HEIGHT, BOSS_WIDTH, BOSS_HEIGHT, MAX_ROUNDS, OCTAGON_BOSS_WIDTH, OCTAGON_BOSS_HEIGHT, HEXAGON_BOSS_WIDTH, HEXAGON_BOSS_HEIGHT, POWER_UP_SHOT_COOLDOWN, ROUND_TIME_LIMIT, POWER_UP_DROP_CHANCE, POWER_UP_WIDTH, POWER_UP_HEIGHT, POWER_UP_SPEED, FAST_SHOT_DURATION, SHIELD_DURATION
} from '@/lib/constants';
import { playMenuMusic, stopMusic, playGameMusic, playGameOverMusic } from '@/lib/audio';

export default function StarDefenderGame() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [round, setRound] = useState(1);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME_LIMIT);
  const [keysPressed, setKeysPressed] = useState<KeysPressed>({});
  
  const [player, setPlayer] = useState<GameObject>({ id: 0, x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2, y: GAME_HEIGHT - PLAYER_HEIGHT - 20, width: PLAYER_WIDTH, height: PLAYER_HEIGHT });
  const [playerShots, setPlayerShots] = useState<GameObject[]>([]);
  const [opponents, setOpponents] = useState<GameObject[]>([]);
  const [enemyShots, setEnemyShots] = useState<GameObject[]>([]);
  const [explosions, setExplosions] = useState<GameObject[]>([]);
  const [powerUps, setPowerUps] = useState<GameObject[]>([]);

  const [lastShotTime, setLastShotTime] = useState(0);
  const [isInvincible, setIsInvincible] = useState(false);
  const [isPowerUpActive, setIsPowerUpActive] = useState(false);
  
  const [fastShotTimeout, setFastShotTimeout] = useState<NodeJS.Timeout | null>(null);
  const [shieldTimeout, setShieldTimeout] = useState<NodeJS.Timeout | null>(null);

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

  const playEnemyShotSound = useCallback(() => {
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
  
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.1);
  
    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
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

  const playPlayerHitSound = useCallback(() => {
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

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);

    gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }, []);

  const playPowerUpSound = useCallback(() => {
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
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(1046.50, audioContext.currentTime + 0.2);
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.2);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  }, []);

  const playGameOverSound = useCallback(() => {
    if (!audioContextRef.current) {
      if (typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    }
    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    const freqs = [164.81, 155.56, 146.83, 138.59];
    let time = audioContext.currentTime;

    freqs.forEach((freq) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(freq, time);

      gainNode.gain.setValueAtTime(0.2, time);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, time + 0.5);

      oscillator.start(time);
      oscillator.stop(time + 0.5);
      time += 0.15;
    });
  }, []);

  const resetPowerUps = useCallback(() => {
    setIsPowerUpActive(false);
    setIsInvincible(false);
    if (fastShotTimeout) clearTimeout(fastShotTimeout);
    if (shieldTimeout) clearTimeout(shieldTimeout);
    setFastShotTimeout(null);
    setShieldTimeout(null);
    setPowerUps([]);
  }, [fastShotTimeout, shieldTimeout]);

  const setupRound = useCallback((currentRound: number) => {
    setPlayer({ id: 0, x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2, y: GAME_HEIGHT - PLAYER_HEIGHT - 20, width: PLAYER_WIDTH, height: PLAYER_HEIGHT });
    setPlayerShots([]);
    setEnemyShots([]);
    setExplosions([]);
    setTimeLeft(ROUND_TIME_LIMIT);
    resetPowerUps();

    if (currentRound === MAX_ROUNDS && lives === INITIAL_LIVES) {
      setIsPowerUpActive(true);
    } else {
      setIsPowerUpActive(false);
    }

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
    } else if (currentRound === 5) {
      newOpponents = [{
        id: Date.now(),
        type: 'octagon',
        x: GAME_WIDTH / 2 - OCTAGON_BOSS_WIDTH / 2,
        y: 50,
        width: OCTAGON_BOSS_WIDTH,
        height: OCTAGON_BOSS_HEIGHT,
        dx: 5,
        dy: 0,
        health: 15,
      }];
    } else if (currentRound === 6) {
      newOpponents = [{
        id: Date.now(),
        type: 'hexagon',
        x: GAME_WIDTH / 2 - HEXAGON_BOSS_WIDTH / 2,
        y: 50,
        width: HEXAGON_BOSS_WIDTH,
        height: HEXAGON_BOSS_HEIGHT,
        dx: 6,
        dy: 0,
        health: 20,
      }];
    }
    setOpponents(newOpponents);
  }, [lives, resetPowerUps]);

  const startGame = useCallback(() => {
    stopMusic();
    setScore(0);
    setLives(INITIAL_LIVES);
    setRound(1);
    setLevel(1);
    setupRound(1);
    setGameState('playing');
  }, [setupRound]);

  const handleNextRound = useCallback(() => {
    setGameState('levelTransition');
    const nextRound = round + 1;
    setRound(nextRound);
    setTimeout(() => {
      setupRound(nextRound);
      setGameState('playing');
    }, 2000);
  }, [round, setupRound]);
  
  const togglePause = useCallback(() => {
    setGameState(prev => {
      if (prev === 'playing') {
        stopMusic();
        playMenuMusic();
        return 'paused';
      }
      if (prev === 'paused') {
        stopMusic();
        playGameMusic();
        return 'playing';
      }
      return prev;
    });
  }, []);

  const restartGame = useCallback(() => {
    setGameState('start');
  }, []);

  const spawnPowerUp = (x: number, y: number) => {
    if (Math.random() > POWER_UP_DROP_CHANCE) return;

    const powerUpTypes: PowerUpType[] = ['EXTRA_LIFE', 'FAST_SHOT', 'SHIELD'];
    const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];

    setPowerUps(currentPowerUps => [
      ...currentPowerUps,
      {
        id: Date.now(),
        type,
        x: x,
        y: y,
        width: POWER_UP_WIDTH,
        height: POWER_UP_HEIGHT,
      },
    ]);
  };
  
  const activatePowerUp = (type: PowerUpType) => {
    playPowerUpSound();
    if (type === 'EXTRA_LIFE') {
      setLives(l => Math.min(INITIAL_LIVES, l + 1));
    } else if (type === 'FAST_SHOT') {
      setIsPowerUpActive(true);
      if (fastShotTimeout) clearTimeout(fastShotTimeout);
      const timeout = setTimeout(() => setIsPowerUpActive(false), FAST_SHOT_DURATION);
      setFastShotTimeout(timeout);
    } else if (type === 'SHIELD') {
      setIsInvincible(true);
      if (shieldTimeout) clearTimeout(shieldTimeout);
      const timeout = setTimeout(() => setIsInvincible(false), SHIELD_DURATION);
      setShieldTimeout(timeout);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'p' || key === 'escape') {
        if (gameState === 'playing' || gameState === 'paused') {
          togglePause();
        }
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
  }, [gameState, togglePause]);

  useEffect(() => {
    if (gameState === 'start') {
      stopMusic();
      playMenuMusic();
    } else if (gameState === 'playing') {
      stopMusic();
      playGameMusic();
    } else if (gameState === 'gameOver') {
      stopMusic();
      playGameOverMusic();
    } else if (gameState === 'win' || gameState === 'paused') {
      stopMusic();
    }
    return () => {
      if (gameState !== 'start' && gameState !== 'playing') {
        stopMusic();
      }
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const timerId = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (!isInvincible) {
            setLives(l => l - 1);
            playPlayerHitSound();
            setIsInvincible(true);
            setTimeout(() => setIsInvincible(false), 1500);
          }
          return ROUND_TIME_LIMIT;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [gameState, playPlayerHitSound, isInvincible]);

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
      const currentShotCooldown = isPowerUpActive ? POWER_UP_SHOT_COOLDOWN : SHOT_COOLDOWN;
      if ((keysPressed[' '] || keysPressed['arrowup'] || keysPressed['w']) && now - lastShotTime > currentShotCooldown) {
        setPlayerShots(shots => [...shots, {
          id: now, x: player.x + player.width / 2 - SHOT_WIDTH / 2, y: player.y, width: SHOT_WIDTH, height: SHOT_HEIGHT
        }]);
        setLastShotTime(now);
        playShotSound();
      }
      
      // Update positions
      setPlayerShots(shots => shots.map(s => ({...s, y: s.y - PLAYER_SHOT_SPEED})).filter(s => s.y > -s.height));
      setEnemyShots(shots => shots.map(s => ({...s, y: s.y + ENEMY_SHOT_SPEED})).filter(s => s.y < GAME_HEIGHT));
      setPowerUps(pus => pus.map(p => ({ ...p, y: p.y + POWER_UP_SPEED })).filter(p => p.y < GAME_HEIGHT));
      
      setOpponents(opps => opps.map(opp => {
        let newX = opp.x + (opp.dx ?? 0);
        let newDx = opp.dx ?? 2;
        
        // Wall bouncing
        if (newX <= 0 || newX >= GAME_WIDTH - opp.width) {
          newDx *= -1;
        } else if (Math.random() < 0.02) { // Random direction change
          newDx *= -1;
        }

        if (Math.random() < 0.01 + round * 0.005) {
            setEnemyShots(shots => [...shots, {
                id: Date.now() + Math.random(), x: opp.x + opp.width / 2 - SHOT_WIDTH / 2, y: opp.y + opp.height, width: SHOT_WIDTH, height: SHOT_HEIGHT
            }]);
            playEnemyShotSound();
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
              const destroyedOpp = updatedOpponents.splice(oppIndex, 1)[0];
              setScore(s => s + 100);
              setTimeLeft(ROUND_TIME_LIMIT);
              const explosion = { id: destroyedOpp.id, x: destroyedOpp.x, y: destroyedOpp.y, width: destroyedOpp.width, height: destroyedOpp.height };
              setExplosions(ex => [...ex, explosion]);
              spawnPowerUp(destroyedOpp.x + destroyedOpp.width / 2, destroyedOpp.y + destroyedOpp.height / 2);
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
        playPlayerHitSound();
        setIsInvincible(true);
        setTimeout(() => setIsInvincible(false), 1500);
      }
      
      if (hitEnemyShotIds.size > 0) {
        setEnemyShots(shots => shots.filter(s => !hitEnemyShotIds.has(s.id)));
      }

      const collectedPowerUpIds = new Set();
      powerUps.forEach(powerUp => {
        if (
          powerUp.x < player.x + player.width &&
          powerUp.x + powerUp.width > player.x &&
          powerUp.y < player.y + player.height &&
          powerUp.y + powerUp.height > player.y
        ) {
          activatePowerUp(powerUp.type as PowerUpType);
          collectedPowerUpIds.add(powerUp.id);
        }
      });

      if (collectedPowerUpIds.size > 0) {
        setPowerUps(pus => pus.filter(p => !collectedPowerUpIds.has(p.id)));
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };
    
    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);

  }, [gameState, keysPressed, player.x, player.y, lastShotTime, opponents, playerShots, enemyShots, isInvincible, round, playShotSound, playExplosionSound, playEnemyShotSound, playPlayerHitSound, isPowerUpActive, powerUps, playPowerUpSound]);

  useEffect(() => {
    if (gameState === 'playing' && lives <= 0) {
      playGameOverSound();
      setGameState('gameOver');
    }
  }, [lives, gameState, playGameOverSound]);

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
        return <PauseScreen onResume={togglePause} onRestart={restartGame} />;
      case 'playing':
        return <GameArea player={player} playerShots={playerShots} opponents={opponents} enemyShots={enemyShots} explosions={explosions} powerUps={powerUps} isInvincible={isInvincible} />;
      default:
        return null;
    }
  }, [gameState, score, startGame, player, playerShots, opponents, enemyShots, explosions, powerUps, round, isInvincible, togglePause, restartGame]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden">
      <div className="relative" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
        {(gameState === 'playing' || gameState === 'levelTransition' || gameState === 'paused') && <Hud score={score} lives={lives} timeLeft={timeLeft} powerUpActive={isPowerUpActive} shieldActive={isInvincible} />}
        {gameContent}
      </div>
      <div className="text-center mt-4 text-xs max-w-2xl text-muted-foreground font-code px-4">
        <p>Use Arrow Keys or A/D to move. Use Space, Up Arrow, or W to shoot. P/Esc to pause.</p>
        <p className="mt-2">&copy; 2025 Hugo Rollán. All rights reserved.</p>
      </div>
    </main>
  );
}
