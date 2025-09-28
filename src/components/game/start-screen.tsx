import { Button } from '@/components/ui/button';

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20 gap-8 text-center p-4">
      <h1 className="text-5xl md:text-7xl text-primary drop-shadow-[0_0_10px_hsl(var(--primary))] animate-pulse">
        Star Defender
      </h1>
      <h2 className="text-3xl md:text-4xl text-accent drop-shadow-[0_0_10px_hsl(var(--accent))]">
        Evolution
      </h2>
      <Button onClick={onStart} size="lg" className="text-2xl px-8 py-6 mt-4">
        Start Game
      </Button>
    </div>
  );
}
