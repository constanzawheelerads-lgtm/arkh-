import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;
const base = { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as const;

export const IconHome = (p: P) => <svg {...base} {...p}><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" /></svg>;
export const IconLearn = (p: P) => <svg {...base} {...p}><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 21V5M8 7h7" /></svg>;
export const IconLibrary = (p: P) => <svg {...base} {...p}><rect x="5" y="3" width="11" height="16" rx="1.5" /><path d="M19 6v13a2 2 0 0 1-2 2H8" /></svg>;
export const IconGames = (p: P) => <svg {...base} {...p}><path d="M12 3v18M5 7h14M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0zM8 21h8" /></svg>;
export const IconProfile = (p: P) => <svg {...base} {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4-6 8-6s7 2 8 6" /></svg>;
export const IconBack = (p: P) => <svg {...base} strokeWidth={2} {...p}><path d="M15 6l-6 6 6 6" /></svg>;
export const IconNext = (p: P) => <svg {...base} strokeWidth={2} {...p}><path d="M9 6l6 6-6 6" /></svg>;
export const IconSearch = (p: P) => <svg {...base} strokeWidth={2} {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>;
export const IconZoomIn = (p: P) => <svg {...base} strokeWidth={2} {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4M8 11h6M11 8v6" /></svg>;
export const IconZoomOut = (p: P) => <svg {...base} strokeWidth={2} {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4M8 11h6" /></svg>;
export const IconCheck = (p: P) => <svg {...base} strokeWidth={2.2} {...p}><path d="M5 12l5 5L20 7" /></svg>;
export const IconStar = (p: P) => (
  <svg width={24} height={24} viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <path d="M12 2l2.6 6.5L21 9.3l-5 4.4 1.5 6.8L12 17l-5.5 3.5L8 13.7 3 9.3l6.4-.8z" fill="currentColor" />
  </svg>
);
export const IconEye = (p: P) => <svg {...base} {...p}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>;
export const IconScale = IconGames;
export const IconGrid = (p: P) => <svg {...base} {...p}><rect x="3" y="3" width="8" height="8" rx="1" /><rect x="13" y="3" width="8" height="8" rx="1" /><rect x="3" y="13" width="8" height="8" rx="1" /><rect x="13" y="13" width="8" height="8" rx="1" /></svg>;
export const IconQuestion = (p: P) => <svg {...base} {...p}><rect x="6" y="3" width="12" height="18" rx="1.5" /><path d="M10 9.5a2 2 0 1 1 2.5 1.9c-.4.2-.5.5-.5.9V13M12 16h.01" /></svg>;
