import type { SVGProps } from 'react';

export const PlayerIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M 2.5,12 C 2.5,9.5 6,8 10,8 C 14,8 17.5,9.5 17.5,12 C 17.5,14.5 14,16 10,16 C 6,16 2.5,14.5 2.5,12 Z" />
      <path d="M 7,8 A 3,3.5 0 0 1 13,8 Z" stroke="hsl(var(--background))" strokeWidth="1.5" />
    </svg>
  );

export const TriangleOpponentIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M10 2 L18 10 L15 18 L10 16 L5 18 L2 10 Z" />
    </svg>
);

export const PentagonOpponentIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path d="M10 1 L19 6 L16 19 L4 19 L1 6 Z" />
    </svg>
);

export const SquareOpponentIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M4 2 L16 2 L18 8 L16 18 L4 18 L2 8 Z" />
    </svg>
);

export const BossIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2l1.45 4.47L18 7.35l-3.22 3.14.76 4.43L12 12.5l-3.54 2.42.76-4.43L4 7.35l4.55-.88L12 2z" />
        <path d="M12 12.5l3.54 2.42-.76 4.43L12 16.5l-3.54 2.85.76-4.43L4 14.65l4.55-.88L12 12.5z" stroke="hsl(var(--accent))" strokeWidth="1" />
    </svg>
);

export const OctagonOpponentIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M10 2 L18 5 L18 15 L10 18 L2 15 L2 5 Z" />
    </svg>
);

export const HexagonOpponentIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M10 1 L19 5 L16 19 L4 19 L1 5 Z" />
    </svg>
);
