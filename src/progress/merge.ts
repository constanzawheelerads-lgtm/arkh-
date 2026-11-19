// Combines progress from two devices (or local + cloud) without losing anything.
// Rules: lists are united, counters keep the highest value, dated values keep
// the most recent. XP keeps the highest value, so the same activity done on
// two devices is never counted twice.

import { migrate, type ProgressState, type WeeklyCounters } from './model';

const union = (a: string[], b: string[]) => [...new Set([...a, ...b])];
const later = (a: string | null, b: string | null) => (!a ? b : !b ? a : a >= b ? a : b);

function mergeWeekly(a: WeeklyCounters, b: WeeklyCounters): WeeklyCounters {
  if (a.week !== b.week) return a.week > b.week ? a : b;
  return {
    week: a.week,
    cards: Math.max(a.cards, b.cards),
    lessons: Math.max(a.lessons, b.lessons),
    games: Math.max(a.games, b.games),
    practice: Math.max(a.practice, b.practice),
    exams: Math.max(a.exams, b.exams),
  };
}

/** `local` wins for personal choices (avatar) because it is what the person just set. */
export function mergeProgress(localRaw: unknown, remoteRaw: unknown): ProgressState {
  const a = migrate(localRaw);
  const b = migrate(remoteRaw);
  const exams: Record<string, number> = { ...b.exams };
  for (const [k, v] of Object.entries(a.exams)) exams[k] = Math.max(v, exams[k] ?? 0);

  let streak = a.streak;
  if (b.streak.lastDay && (!a.streak.lastDay || b.streak.lastDay > a.streak.lastDay)) streak = b.streak;
  else if (b.streak.lastDay === a.streak.lastDay) streak = { count: Math.max(a.streak.count, b.streak.count), lastDay: a.streak.lastDay };

  const weekly = mergeWeekly(a.weekly, b.weekly);
  const isDefaultAvatar = a.avatar.robe === 'indigo' && a.avatar.accessory === 'none';

  return {
    version: 3,
    xp: Math.max(a.xp, b.xp),
    cardsViewed: union(a.cardsViewed, b.cardsViewed),
    lessonsDone: union(a.lessonsDone, b.lessonsDone),
    gamesPlayed: Math.max(a.gamesPlayed, b.gamesPlayed),
    perfectGames: Math.max(a.perfectGames, b.perfectGames),
    combinations: Math.max(a.combinations, b.combinations),
    badges: union(a.badges, b.badges),
    streak,
    exams,
    casesDone: union(a.casesDone, b.casesDone),
    spreads: Math.max(a.spreads, b.spreads),
    bestTimed: Math.max(a.bestTimed, b.bestTimed),
    dailyDone: later(a.dailyDone, b.dailyDone),
    weekly,
    missionsClaimed: union(a.missionsClaimed, b.missionsClaimed).filter((k) => !weekly.week || k.startsWith(weekly.week)),
    collectibles: union(a.collectibles, b.collectibles),
    avatar: isDefaultAvatar ? b.avatar : a.avatar,
  };
}

/** True when merging `remote` into `local` would change nothing. */
export function sameProgress(a: ProgressState, b: ProgressState): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
