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
