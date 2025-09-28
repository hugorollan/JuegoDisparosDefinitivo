"use client";

import type { GameObject } from '@/lib/types';
import { PlayerIcon, TriangleOpponentIcon, PentagonOpponentIcon, SquareOpponentIcon, BossIcon, OctagonOpponentIcon, HexagonOpponentIcon } from '@/components/game-icons';
import { GAME_WIDTH, GAME_HEIGHT } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface GameAreaProps {
  player: GameObject;
  playerShots: GameObject[];
  opponents: GameObject[];
  enemyShots: GameObject[];
  explosions: GameObject[];
  isInvincible: boolean;
}

const Explosion = ({ x, y, width }: { x: number; y: number; width: number; }) => {
    return (
        <div style={{ left: x, top: y, width, height: width }} className="absolute">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary" />
            <div className="absolute inset-0 animate-ping rounded-full bg-accent [animation-delay:0.1s]" />
        </div>
    );
};

const HealthBar = ({ health, maxHealth }: { health: number; maxHealth: number }) => {
    const healthPercentage = (health / maxHealth) * 100;
    return (
        <div className="w-full h-1.5 bg-gray-700 rounded-full mt-1">
            <div
                className="h-1.5 rounded-full bg-primary"
                style={{ width: `${healthPercentage}%` }}
            ></div>
        </div>
    );
};

export function GameArea({ player, playerShots, opponents, enemyShots, explosions, isInvincible }: GameAreaProps) {
  return (
    <div
      className="relative bg-black border-2 border-primary shadow-[0_0_15px] shadow-primary/50 overflow-hidden"
      style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
    >
      <div className={cn('text-accent transition-opacity duration-150', isInvincible && 'animate-pulse opacity-50')} style={{ position: 'absolute', left: player.x, top: player.y, width: player.width, height: player.height }}>
        <PlayerIcon />
      </div>

      {playerShots.map(shot => (
        <div key={shot.id} className="bg-accent shadow-[0_0_8px] shadow-accent" style={{ position: 'absolute', left: shot.x, top: shot.y, width: shot.width, height: shot.height, borderRadius: '2px' }} />
      ))}

      {opponents.map(opp => (
        <div key={opp.id} className="text-primary" style={{ position: 'absolute', left: opp.x, top: opp.y, width: opp.width, height: opp.height }}>
            {opp.type === 'pentagon' ? <PentagonOpponentIcon /> 
           : opp.type === 'square' ? <SquareOpponentIcon />
           : opp.type === 'boss' ? <BossIcon />
           : opp.type === 'octagon' ? <OctagonOpponentIcon />
           : opp.type === 'hexagon' ? <HexagonOpponentIcon />
           : <TriangleOpponentIcon />}
          {opp.health && opp.health > 1 && (
            <HealthBar health={opp.health} maxHealth={
                opp.type === 'pentagon' ? 3 
              : opp.type === 'square' ? 5 
              : opp.type === 'boss' ? 10
              : opp.type === 'octagon' ? 15
              : opp.type === 'hexagon' ? 20
              : 1
            } />
          )}
        </div>
      ))}

      {enemyShots.map(shot => (
        <div key={shot.id} className="bg-primary shadow-[0_0_8px] shadow-primary" style={{ position: 'absolute', left: shot.x, top: shot.y, width: shot.width, height: shot.height, borderRadius: '2px' }} />
      ))}

      {explosions.map(exp => (
        <Explosion key={exp.id} x={exp.x} y={exp.y} width={exp.width} />
      ))}
    </div>
  );
}
