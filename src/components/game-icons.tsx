import type { SVGProps } from 'react';

export const PlayerIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M10 2 L2 18 L18 18 Z" />
  </svg>
);

export const TriangleOpponentIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M10 18 L2 2 L18 2 Z" />
  </svg>
);

export const PentagonOpponentIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M10 1 L2 7 L5 18 L15 18 L18 7 Z" />
  </svg>
);

export const SquareOpponentIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M2 2 H 18 V 18 H 2 Z" />
    </svg>
);
  
export const BossIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2l1.45 4.47L18 7.35l-3.22 3.14.76 4.43L12 12.5l-3.54 2.42.76-4.43L4 7.35l4.55-.88L12 2z" />
        <path d="M12 12.5l3.54 2.42-.76 4.43L12 16.5l-3.54 2.85.76-4.43L4 14.65l4.55-.88L12 12.5z" stroke="hsl(var(--accent))" strokeWidth="1" />
    </svg>
);