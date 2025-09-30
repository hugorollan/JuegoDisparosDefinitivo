import { Button } from '@/components/ui/button';

interface WinScreenProps {
  score: number;
  onRestart: () => void;
}

export function WinScreen({ score, onRestart }: WinScreenProps) {
  const rankings = [
    { name: 'R. Tyrell', score: 3850 },
    { name: 'Deckard', score: 3450 },
    { name: 'Roy Batty', score: 3250 },
    { name: 'Zhora', score: 2500 },
    { name: 'Leon', score: 2100 },
  ];

  const finalRankings = [...rankings, { name: 'You', score }]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return (
    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 gap-4 text-center p-4">
      <h1 className="text-5xl md:text-7xl text-accent drop-shadow-[0_0_10px_hsl(var(--accent))]">
        You Win!
      </h1>
      
      <div className="mt-4 w-full max-w-sm bg-black/50 p-4 rounded-lg border border-primary/50">
        <h2 className="text-2xl md:text-3xl text-primary mb-4">High Scores</h2>
        <ul className="text-left font-code text-lg space-y-2">
          {finalRankings.map((entry, index) => (
            <li key={index} className={`flex justify-between p-2 rounded-md ${entry.name === 'You' ? 'bg-primary/30 text-white' : 'text-gray-400'}`}>
              <span className="w-2/3 truncate">{index + 1}. {entry.name}</span>
              <span className="w-1/3 text-right">{entry.score}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xl md:text-2xl text-white mt-2">Your Score: <span className="text-primary font-code">{score}</span></p>

      <Button onClick={onRestart} size="lg" className="text-2xl px-8 py-6 mt-4">
        Play Again
      </Button>
    </div>
  );
}
