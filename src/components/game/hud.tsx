import { Heart, Star } from 'lucide-react';
import { INITIAL_LIVES } from '@/lib/constants';

interface HudProps {
  score: number;
  lives: number;
}

export function Hud({ score, lives }: HudProps) {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center text-lg md:text-2xl pointer-events-none">
      <div className="flex items-center gap-3 text-primary">
        <Star className="w-5 h-5 md:w-7 md:h-7 fill-primary" />
        <span className="font-code tracking-widest">{score.toString().padStart(6, '0')}</span>
      </div>
      <div className="flex items-center gap-2">
        {Array.from({ length: INITIAL_LIVES }).map((_, i) => (
          <Heart key={i} className={`w-5 h-5 md:w-7 md:h-7 transition-colors ${i < lives ? 'text-accent fill-accent' : 'text-gray-600 fill-gray-600'}`} />
        ))}
      </div>
    </div>
  );
}
