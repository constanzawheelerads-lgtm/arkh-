// Pure progress model: no React, no storage. Every update takes `today`
// explicitly so the rules are easy to test.

import type { L10n } from '../content/types';
import { daysBetween } from '../lib/random';

export const XP = {
  firstCardView: 5,
  lesson: 40,
  gameCorrect: 5,
  perfectBonus: 15,
  memoryComplete: 30,
} as const;

export const TOTAL_MAJORS = 22;

export interface ProgressState {
  version: 1;
  xp: number;
  cardsViewed: number[];
  lessonsDone: string[];
  gamesPlayed: number;
  perfectGames: number;
  badges: string[];
  streak: { count: number; lastDay: string | null };
}

export const initialProgress: ProgressState = {
  version: 1,
  xp: 0,
  cardsViewed: [],
  lessonsDone: [],
  gamesPlayed: 0,
  perfectGames: 0,
  badges: [],
  streak: { count: 0, lastDay: null },
};

export type ProgressEvent =
  | { type: 'viewCard'; card: number }
  | { type: 'completeLesson'; lesson: string }
  | { type: 'finishGame'; correct: number; total: number; bonusXp?: number; perfect?: boolean };

export interface BadgeDef {
  id: string;
  name: L10n;
  earned: (s: ProgressState, totalLessons: number) => boolean;
}

export const BADGES: BadgeDef[] = [
  { id: 'first-lesson', name: { es: 'Primera lección', en: 'First lesson' }, earned: (s) => s.lessonsDone.length >= 1 },
  { id: 'all-lessons', name: { es: 'Discípulo', en: 'Disciple' }, earned: (s, n) => n > 0 && s.lessonsDone.length >= n },
  { id: 'ten-cards', name: { es: 'Ojo atento', en: 'Keen eye' }, earned: (s) => s.cardsViewed.length >= 10 },
  { id: 'all-majors', name: { es: 'Los 22 arcanos', en: 'All 22 arcana' }, earned: (s) => s.cardsViewed.length >= TOTAL_MAJORS },
  { id: 'first-game', name: { es: 'Primer juego', en: 'First game' }, earned: (s) => s.gamesPlayed >= 1 },
  { id: 'perfect-game', name: { es: 'Sin errores', en: 'Flawless' }, earned: (s) => s.perfectGames >= 1 },
  { id: 'streak-3', name: { es: 'Constancia', en: 'Perseverance' }, earned: (s) => s.streak.count >= 3 },
];

/** Cumulative XP needed to reach a level: 0, 100, 300, 600, 1000… */
export function xpForLevel(level: number): number {
  return 50 * level * (level - 1);
}

export function levelFromXp(xp: number): number {
  let level = 1;
  while (xp >= xpForLevel(level + 1)) level++;
  return level;
}

export const LEVEL_TITLES: L10n[] = [
  { es: 'Principiante', en: 'Beginner' },
  { es: 'Aprendiz', en: 'Apprentice' },
  { es: 'Iniciado', en: 'Initiate' },
  { es: 'Adepto', en: 'Adept' },
  { es: 'Erudito', en: 'Scholar' },
  { es: 'Maestro', en: 'Master' },
];

export function levelTitle(level: number): L10n {
  return LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length) - 1];
}

function touchStreak(streak: ProgressState['streak'], today: string): ProgressState['streak'] {
  if (streak.lastDay === today) return streak;
  if (streak.lastDay && daysBetween(streak.lastDay, today) === 1) {
    return { count: streak.count + 1, lastDay: today };
  }
  return { count: 1, lastDay: today };
}

export interface ApplyResult {
  state: ProgressState;
  xpGained: number;
  newBadges: string[];
  levelUp: number | null;
}

export function applyEvent(
  prev: ProgressState,
  event: ProgressEvent,
  today: string,
  totalLessons: number,
): ApplyResult {
  let xpGained = 0;
  let next: ProgressState = { ...prev };

  switch (event.type) {
    case 'viewCard':
      if (!prev.cardsViewed.includes(event.card)) {
        next.cardsViewed = [...prev.cardsViewed, event.card];
        xpGained = XP.firstCardView;
      }
      break;
    case 'completeLesson':
      if (!prev.lessonsDone.includes(event.lesson)) {
        next.lessonsDone = [...prev.lessonsDone, event.lesson];
        xpGained = XP.lesson;
      }
      break;
    case 'finishGame': {
      const perfect = event.perfect ?? (event.total > 0 && event.correct === event.total);
      xpGained = event.correct * XP.gameCorrect + (event.bonusXp ?? 0) + (perfect ? XP.perfectBonus : 0);
      next.gamesPlayed = prev.gamesPlayed + 1;
      if (perfect) next.perfectGames = prev.perfectGames + 1;
      break;
    }
  }

  next.xp = prev.xp + xpGained;
  // Any learning activity counts towards the daily streak.
  next.streak = touchStreak(prev.streak, today);

  const newBadges = BADGES.filter((b) => !prev.badges.includes(b.id) && b.earned(next, totalLessons)).map((b) => b.id);
  if (newBadges.length) next = { ...next, badges: [...prev.badges, ...newBadges] };

  const before = levelFromXp(prev.xp);
  const after = levelFromXp(next.xp);
  return { state: next, xpGained, newBadges, levelUp: after > before ? after : null };
}

/** Accepts unknown stored data and returns a valid state. */
export function migrate(raw: unknown): ProgressState {
  if (!raw || typeof raw !== 'object') return initialProgress;
  const r = raw as Partial<ProgressState>;
  if (r.version !== 1) return initialProgress;
  return {
    ...initialProgress,
    ...r,
    cardsViewed: Array.isArray(r.cardsViewed) ? r.cardsViewed : [],
    lessonsDone: Array.isArray(r.lessonsDone) ? r.lessonsDone : [],
    badges: Array.isArray(r.badges) ? r.badges : [],
    streak: r.streak ?? initialProgress.streak,
  };
}
