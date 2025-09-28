interface LevelTransitionScreenProps {
  round: number;
  explanation: string;
}

export function LevelTransitionScreen({ round, explanation }: LevelTransitionScreenProps) {
  return (
    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 gap-6 text-center p-8 animate-fade-in">
      <h1 className="text-5xl md:text-7xl text-accent drop-shadow-[0_0_10px_hsl(var(--accent))]">
        Round {round}
      </h1>
      <div className="max-w-md">
        <p className="text-lg text-white font-code">
          AI adjusting difficulty...
        </p>
        <p className="mt-4 text-base text-primary font-code">
          "{explanation}"
        </p>
      </div>
    </div>
  );
}
