import { Button } from '@/components/ui/button';

interface WinScreenProps {
  score: number;
  onRestart: () => void;
}

export function WinScreen({ score, onRestart }: WinScreenProps) {
  return (
    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 gap-6 text-center p-4">
      <h1 className="text-6xl md:text-8xl text-accent drop-shadow-[0_0_10px_hsl(var(--accent))]">
        You Win!
      </h1>
      <p className="text-2xl md:text-3xl text-white">Final Score: <span className="text-primary font-code">{score}</span></p>
      <Button onClick={onRestart} size="lg" className="text-2xl px-8 py-6 mt-4">
        Play Again
      </Button>
    </div>
  );
}
