import { useEffect, useState } from 'react';

// Minimal hash router with flat route names (#library, #card-8, #learn-rws).
// Flat names work on any static host, inside Capacitor (Android/iOS) and in
// embedded previews that only pass simple #names through.

export type GameId = 'guess' | 'truefalse' | 'memory' | 'combination' | 'timed';

export type Route =
  | { name: 'home' }
  | { name: 'learn' }
  | { name: 'lesson'; id: string }
  | { name: 'library' }
  | { name: 'card'; id: string }
  | { name: 'games' }
  | { name: 'game'; id: GameId }
  | { name: 'profile' }
  | { name: 'sources' }
  | { name: 'worlds' }
  | { name: 'world'; n: number }
  | { name: 'exam'; id: string }
  | { name: 'lab' }
  | { name: 'case'; id: string };

const GAMES: GameId[] = ['guess', 'truefalse', 'memory', 'combination', 'timed'];
const WORLD_NUMBERS = [0, 1, 2, 3, 6, 9, 10, 11, 17];
const SLUG = /^[a-z0-9-]{1,40}$/;
const CARD_ID = /^(m(0\d|1\d|2[01])|[wcsp](0[1-9]|1[0-4]))$/;

export function parseHash(hash: string): Route {
  const h = hash.replace(/^#\/?/, '');
  if (h === 'learn') return { name: 'learn' };
  if (h.startsWith('learn-')) return { name: 'lesson', id: h.slice(6) };
  if (h === 'library') return { name: 'library' };
  if (h.startsWith('card-')) {
    const id = h.slice(5);
    return CARD_ID.test(id) ? { name: 'card', id } : { name: 'library' };
  }
  if (h === 'games') return { name: 'games' };
  if (h.startsWith('game-')) {
    const id = h.slice(5) as GameId;
    return GAMES.includes(id) ? { name: 'game', id } : { name: 'games' };
  }
  if (h === 'profile') return { name: 'profile' };
  if (h === 'sources') return { name: 'sources' };
  if (h === 'worlds') return { name: 'worlds' };
  if (h.startsWith('world-')) {
    const n = Number(h.slice(6));
    return WORLD_NUMBERS.includes(n) && h.slice(6) !== '' ? { name: 'world', n } : { name: 'worlds' };
  }
  if (h.startsWith('exam-') && SLUG.test(h.slice(5))) return { name: 'exam', id: h.slice(5) };
  if (h === 'lab') return { name: 'lab' };
  if (h.startsWith('case-') && SLUG.test(h.slice(5))) return { name: 'case', id: h.slice(5) };
  return { name: 'home' };
}

export const href = {
  home: () => '#home',
  learn: () => '#learn',
  lesson: (id: string) => `#learn-${id}`,
  library: () => '#library',
  card: (id: string) => `#card-${id}`,
  games: () => '#games',
  game: (id: string) => `#game-${id}`,
  profile: () => '#profile',
  sources: () => '#sources',
  worlds: () => '#worlds',
  world: (n: number) => `#world-${n}`,
  exam: (id: string) => `#exam-${id}`,
  lab: () => '#lab',
  caseStudy: (id: string) => `#case-${id}`,
};

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => {
      setRoute(parseHash(window.location.hash));
      document.getElementById('main')?.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}
