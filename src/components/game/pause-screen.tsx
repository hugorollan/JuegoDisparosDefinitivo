import { Button } from '@/components/ui/button';

interface PauseScreenProps {
  onResume: () => void;
  onRestart: () => void;
}

export function PauseScreen({ onResume, onRestart }: PauseScreenProps) {
  return (
    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 gap-6 text-center p-4">
      <h1 className="text-6xl md:text-8xl text-accent drop-shadow-[0_0_10px_hsl(var(--accent))]">
        Paused
      </h1>
      <div className="flex flex-col gap-4 mt-4">
        <Button onClick={onResume} size="lg" className="text-2xl px-8 py-6">
          Resume
        </Button>
        <Button onClick={onRestart} size="lg" variant="secondary" className="text-2xl px-8 py-6">
          Restart
        </Button>
      </div>
    </div>
  );
}
