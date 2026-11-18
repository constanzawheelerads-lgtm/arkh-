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
  combination: 20,
  dailyChallenge: 20,
  examPass: 60,
  case: 35,
  spread: 5,
} as const;

export const TOTAL_MAJORS = 22;
export const TOTAL_CARDS = 78;
export const EXAM_PASS_RATIO = 0.75;

export type GameKind = 'guess' | 'truefalse' | 'memory' | 'timed';

export interface WeeklyCounters {
  week: string;
  cards: number;
  lessons: number;
  games: number;
  practice: number;
  exams: number;
}

export interface Avatar {
  robe: string;
  accessory: string;
}

export interface ProgressState {
  version: 3;
  xp: number;
  /** Card ids (m00–m21, w/c/s/p01–14). */
  cardsViewed: string[];
  lessonsDone: string[];
  gamesPlayed: number;
  perfectGames: number;
  combinations: number;
  badges: string[];
  streak: { count: number; lastDay: string | null };
  /** Best score per exam id, as a ratio 0–1. */
  exams: Record<string, number>;
  casesDone: string[];
  spreads: number;
  bestTimed: number;
  /** Day key of the last completed daily challenge. */
  dailyDone: string | null;
  weekly: WeeklyCounters;
  /** Claimed missions, as `${week}:${missionId}`. */
  missionsClaimed: string[];
  collectibles: string[];
  avatar: Avatar;
}

/** ISO-8601 week key (e.g. 2026-W47) for a YYYY-MM-DD day key. */
export function weekKey(day: string): string {
  const [y, m, d] = day.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const dow = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dow);
  const yearStart = Date.UTC(date.getUTCFullYear(), 0, 1);
  const week = Math.ceil(((date.getTime() - yearStart) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

const emptyWeek = (week: string): WeeklyCounters => ({ week, cards: 0, lessons: 0, games: 0, practice: 0, exams: 0 });

export const initialProgress: ProgressState = {
  version: 3,
  xp: 0,
  cardsViewed: [],
  lessonsDone: [],
  gamesPlayed: 0,
  perfectGames: 0,
  combinations: 0,
  badges: [],
  streak: { count: 0, lastDay: null },
  exams: {},
  casesDone: [],
  spreads: 0,
  bestTimed: 0,
  dailyDone: null,
  weekly: emptyWeek(''),
  missionsClaimed: [],
  collectibles: [],
  avatar: { robe: 'indigo', accessory: 'none' },
};

export type ProgressEvent =
  | { type: 'viewCard'; card: string }
  | { type: 'completeLesson'; lesson: string }
  | { type: 'finishGame'; game?: GameKind; correct: number; total: number; bonusXp?: number; perfect?: boolean }
  | { type: 'practiceCombination' }
  | { type: 'finishExam'; exam: string; correct: number; total: number }
  | { type: 'completeCase'; caseId: string }
  | { type: 'drawSpread' }
  | { type: 'claimMission'; mission: string }
  | { type: 'setAvatar'; avatar: Partial<Avatar> };

// ---------------------------------------------------------------- badges

export interface BadgeDef {
  id: string;
  name: L10n;
  earned: (s: ProgressState, totalLessons: number) => boolean;
}

const majorsViewed = (s: ProgressState) => s.cardsViewed.filter((id) => id.startsWith('m')).length;
const suitsSeen = (s: ProgressState) => new Set(s.cardsViewed.filter((id) => !id.startsWith('m')).map((id) => id[0])).size;
export const examPassed = (s: ProgressState, exam: string) => (s.exams[exam] ?? 0) >= EXAM_PASS_RATIO;

export const BADGES: BadgeDef[] = [
  { id: 'first-lesson', name: { es: 'Primera lección', en: 'First lesson' }, earned: (s) => s.lessonsDone.length >= 1 },
  { id: 'all-lessons', name: { es: 'Discípulo', en: 'Disciple' }, earned: (s, n) => n > 0 && s.lessonsDone.length >= n },
  { id: 'ten-cards', name: { es: 'Ojo atento', en: 'Keen eye' }, earned: (s) => s.cardsViewed.length >= 10 },
  { id: 'all-majors', name: { es: 'Los 22 arcanos', en: 'All 22 arcana' }, earned: (s) => majorsViewed(s) >= TOTAL_MAJORS },
  { id: 'four-suits', name: { es: 'Los cuatro palos', en: 'The four suits' }, earned: (s) => suitsSeen(s) >= 4 },
  { id: 'all-cards', name: { es: 'El mazo completo', en: 'The whole deck' }, earned: (s) => s.cardsViewed.length >= TOTAL_CARDS },
  { id: 'first-game', name: { es: 'Primer juego', en: 'First game' }, earned: (s) => s.gamesPlayed >= 1 },
  { id: 'perfect-game', name: { es: 'Sin errores', en: 'Flawless' }, earned: (s) => s.perfectGames >= 1 },
  { id: 'first-combination', name: { es: 'Primera combinación', en: 'First combination' }, earned: (s) => s.combinations >= 1 },
  { id: 'first-exam', name: { es: 'Examen aprobado', en: 'Exam passed' }, earned: (s) => Object.keys(s.exams).some((k) => examPassed(s, k)) },
  { id: 'first-case', name: { es: 'Primera consulta', en: 'First consultation' }, earned: (s) => s.casesDone.length >= 1 },
  { id: 'streak-3', name: { es: 'Constancia', en: 'Perseverance' }, earned: (s) => s.streak.count >= 3 },
];

// ---------------------------------------------------------- collectibles

export interface CollectibleDef {
  id: string;
  /** World (major arcanum number) it comes from. */
  world: number;
  name: L10n;
  how: L10n;
  earned: (s: ProgressState) => boolean;
}

export const COLLECTIBLES: CollectibleDef[] = [
  { id: 'wand', world: 1, name: { es: 'La vara del Mago', en: 'The Magician’s wand' }, how: { es: 'Aprueba el examen de Fundamentos.', en: 'Pass the Foundations exam.' }, earned: (s) => examPassed(s, 'foundations') },
  { id: 'scroll', world: 2, name: { es: 'El rollo de la Sacerdotisa', en: 'The High Priestess’s scroll' }, how: { es: 'Aprueba el examen de Historia.', en: 'Pass the History exam.' }, earned: (s) => examPassed(s, 'history') },
  { id: 'rose', world: 0, name: { es: 'La rosa blanca del Loco', en: 'The Fool’s white rose' }, how: { es: 'Aprueba el examen de Arcanos mayores.', en: 'Pass the Major Arcana exam.' }, earned: (s) => examPassed(s, 'majors') },
  { id: 'wheat', world: 3, name: { es: 'La espiga de la Emperatriz', en: 'The Empress’s wheat' }, how: { es: 'Aprueba el examen de Arcanos menores.', en: 'Pass the Minor Arcana exam.' }, earned: (s) => examPassed(s, 'minors') },
  { id: 'lantern', world: 9, name: { es: 'La linterna del Ermitaño', en: 'The Hermit’s lantern' }, how: { es: 'Resuelve una consulta ficticia.', en: 'Solve a fictional consultation.' }, earned: (s) => s.casesDone.length >= 1 },
  { id: 'caduceus', world: 6, name: { es: 'El caduceo de los Enamorados', en: 'The Lovers’ caduceus' }, how: { es: 'Practica tres combinaciones.', en: 'Practise three combinations.' }, earned: (s) => s.combinations >= 3 },
  { id: 'wheel', world: 10, name: { es: 'El radio de la Rueda', en: 'The spoke of the Wheel' }, how: { es: 'Haz cinco tiradas en el Laboratorio.', en: 'Draw five spreads in the Laboratory.' }, earned: (s) => s.spreads >= 5 },
  { id: 'scales', world: 11, name: { es: 'La balanza de la Justicia', en: 'The scales of Justice' }, how: { es: 'Acierta 10 cartas en una contrarreloj.', en: 'Get 10 cards right in a time trial.' }, earned: (s) => s.bestTimed >= 10 },
  { id: 'star', world: 17, name: { es: 'La estrella de ocho puntas', en: 'The eight-pointed star' }, how: { es: 'Estudia los 22 arcanos mayores.', en: 'Study all 22 major arcana.' }, earned: (s) => majorsViewed(s) >= TOTAL_MAJORS },
];

// ---------------------------------------------------------------- avatar

export interface AvatarOption { id: string; name: L10n; unlock: L10n; unlocked: (s: ProgressState) => boolean }

export const ROBES: (AvatarOption & { color: string })[] = [
  { id: 'indigo', color: '#3B2D6E', name: { es: 'Índigo', en: 'Indigo' }, unlock: { es: 'Disponible', en: 'Available' }, unlocked: () => true },
  { id: 'garnet', color: '#6E2436', name: { es: 'Granate', en: 'Garnet' }, unlock: { es: 'Nivel 2', en: 'Level 2' }, unlocked: (s) => levelFromXp(s.xp) >= 2 },
  { id: 'forest', color: '#1F5752', name: { es: 'Verde profundo', en: 'Deep green' }, unlock: { es: 'Nivel 3', en: 'Level 3' }, unlocked: (s) => levelFromXp(s.xp) >= 3 },
  { id: 'gold', color: '#8A6A2E', name: { es: 'Oro viejo', en: 'Old gold' }, unlock: { es: 'Nivel 4', en: 'Level 4' }, unlocked: (s) => levelFromXp(s.xp) >= 4 },
];

const hasCollectible = (id: string) => (s: ProgressState) => s.collectibles.includes(id);

export const ACCESSORIES: AvatarOption[] = [
  { id: 'none', name: { es: 'Ninguno', en: 'None' }, unlock: { es: 'Disponible', en: 'Available' }, unlocked: () => true },
  { id: 'star', name: { es: 'Estrella', en: 'Star' }, unlock: { es: 'Coleccionable: la estrella', en: 'Collectible: the star' }, unlocked: hasCollectible('star') },
  { id: 'rose', name: { es: 'Rosa blanca', en: 'White rose' }, unlock: { es: 'Coleccionable: la rosa', en: 'Collectible: the rose' }, unlocked: hasCollectible('rose') },
  { id: 'lantern', name: { es: 'Linterna', en: 'Lantern' }, unlock: { es: 'Coleccionable: la linterna', en: 'Collectible: the lantern' }, unlocked: hasCollectible('lantern') },
  { id: 'wand', name: { es: 'Vara', en: 'Wand' }, unlock: { es: 'Coleccionable: la vara', en: 'Collectible: the wand' }, unlocked: hasCollectible('wand') },
];

// -------------------------------------------------------------- missions

export interface MissionDef {
  id: string;
  name: L10n;
  target: number;
  xp: number;
  counter: keyof Omit<WeeklyCounters, 'week'>;
}

export const MISSIONS: MissionDef[] = [
  { id: 'cards', name: { es: 'Estudia 5 cartas nuevas', en: 'Study 5 new cards' }, target: 5, xp: 30, counter: 'cards' },
  { id: 'lessons', name: { es: 'Completa 2 lecciones', en: 'Complete 2 lessons' }, target: 2, xp: 40, counter: 'lessons' },
  { id: 'games', name: { es: 'Juega 3 partidas', en: 'Play 3 games' }, target: 3, xp: 30, counter: 'games' },
  { id: 'practice', name: { es: 'Practica una combinación o una consulta', en: 'Practise a combination or a consultation' }, target: 1, xp: 25, counter: 'practice' },
  { id: 'exam', name: { es: 'Aprueba un examen', en: 'Pass an exam' }, target: 1, xp: 50, counter: 'exams' },
];

export function missionStatus(s: ProgressState, m: MissionDef, today: string) {
  const week = weekKey(today);
  const counters = s.weekly.week === week ? s.weekly : emptyWeek(week);
  const value = Math.min(counters[m.counter], m.target);
  const claimed = s.missionsClaimed.includes(`${week}:${m.id}`);
  return { value, done: value >= m.target, claimed };
}

// ---------------------------------------------------------------- levels

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

// ----------------------------------------------------------------- apply

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
  newCollectibles: string[];
  levelUp: number | null;
  dailyCompleted: boolean;
}

export function applyEvent(
  prev: ProgressState,
  event: ProgressEvent,
  today: string,
  totalLessons: number,
): ApplyResult {
  let xpGained = 0;
  let dailyCompleted = false;
  const week = weekKey(today);
  const weekly: WeeklyCounters = prev.weekly.week === week ? { ...prev.weekly } : emptyWeek(week);
  let next: ProgressState = { ...prev, weekly };
  let countsAsActivity = true;

  switch (event.type) {
    case 'viewCard':
      if (!prev.cardsViewed.includes(event.card)) {
        next.cardsViewed = [...prev.cardsViewed, event.card];
        xpGained = XP.firstCardView;
        weekly.cards++;
      }
      break;
    case 'completeLesson':
      if (!prev.lessonsDone.includes(event.lesson)) {
        next.lessonsDone = [...prev.lessonsDone, event.lesson];
        xpGained = XP.lesson;
        weekly.lessons++;
      }
      break;
    case 'finishGame': {
      const perfect = event.perfect ?? (event.total > 0 && event.correct === event.total);
      xpGained = event.correct * XP.gameCorrect + (event.bonusXp ?? 0) + (perfect ? XP.perfectBonus : 0);
      next.gamesPlayed = prev.gamesPlayed + 1;
      if (perfect) next.perfectGames = prev.perfectGames + 1;
      if (event.game === 'timed') next.bestTimed = Math.max(prev.bestTimed, event.correct);
      if (event.game === 'guess' && prev.dailyDone !== today) {
        next.dailyDone = today;
        xpGained += XP.dailyChallenge;
        dailyCompleted = true;
      }
      weekly.games++;
      break;
    }
    case 'practiceCombination':
      xpGained = XP.combination;
      next.combinations = prev.combinations + 1;
      weekly.practice++;
      break;
    case 'finishExam': {
      const ratio = event.total > 0 ? event.correct / event.total : 0;
      const wasPassed = examPassed(prev, event.exam);
      next.exams = { ...prev.exams, [event.exam]: Math.max(prev.exams[event.exam] ?? 0, ratio) };
      if (ratio >= EXAM_PASS_RATIO) {
        weekly.exams++;
        if (!wasPassed) xpGained = XP.examPass;
      }
      break;
    }
    case 'completeCase':
      xpGained = prev.casesDone.includes(event.caseId) ? 0 : XP.case;
      if (!prev.casesDone.includes(event.caseId)) next.casesDone = [...prev.casesDone, event.caseId];
      weekly.practice++;
      break;
    case 'drawSpread':
      next.spreads = prev.spreads + 1;
      xpGained = prev.spreads < 5 ? XP.spread : 0;
      break;
    case 'claimMission': {
      const def = MISSIONS.find((m) => m.id === event.mission);
      countsAsActivity = false;
      if (def) {
        const st = missionStatus(next, def, today);
        if (st.done && !st.claimed) {
          next.missionsClaimed = [...prev.missionsClaimed.filter((k) => k.startsWith(week)), `${week}:${def.id}`];
          xpGained = def.xp;
        }
      }
      break;
    }
    case 'setAvatar': {
      countsAsActivity = false;
      const robe = event.avatar.robe ? ROBES.find((r) => r.id === event.avatar.robe) : undefined;
      const acc = event.avatar.accessory ? ACCESSORIES.find((a) => a.id === event.avatar.accessory) : undefined;
      next.avatar = {
        robe: robe && robe.unlocked(prev) ? robe.id : prev.avatar.robe,
        accessory: acc && acc.unlocked(prev) ? acc.id : prev.avatar.accessory,
      };
      break;
    }
  }

  next.xp = prev.xp + xpGained;
  // Learning activities count towards the daily streak.
  if (countsAsActivity) next.streak = touchStreak(prev.streak, today);

  const newCollectibles = COLLECTIBLES.filter((c) => !prev.collectibles.includes(c.id) && c.earned(next)).map((c) => c.id);
  if (newCollectibles.length) next = { ...next, collectibles: [...prev.collectibles, ...newCollectibles] };

  const newBadges = BADGES.filter((b) => !prev.badges.includes(b.id) && b.earned(next, totalLessons)).map((b) => b.id);
  if (newBadges.length) next = { ...next, badges: [...prev.badges, ...newBadges] };

  const before = levelFromXp(prev.xp);
  const after = levelFromXp(next.xp);
  return { state: next, xpGained, newBadges, newCollectibles, levelUp: after > before ? after : null, dailyCompleted };
}

/** Accepts unknown stored data (any past version) and returns a valid state. */
export function migrate(raw: unknown): ProgressState {
  if (!raw || typeof raw !== 'object') return initialProgress;
  const r = raw as Record<string, unknown>;
  if (r.version !== 1 && r.version !== 2 && r.version !== 3) return initialProgress;
  const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
  const num = (v: unknown, d = 0) => (typeof v === 'number' && Number.isFinite(v) ? v : d);
  const obj = (v: unknown) => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {});
  // v1 stored major arcana as numbers 0–21.
  const cardsViewed = arr(r.cardsViewed).map((c) => (typeof c === 'number' ? `m${String(c).padStart(2, '0')}` : String(c)));
  const streak = obj(r.streak);
  const weekly = obj(r.weekly);
  const avatar = obj(r.avatar);
  const exams: Record<string, number> = {};
  for (const [k, v] of Object.entries(obj(r.exams))) if (typeof v === 'number') exams[k] = v;
  return {
    version: 3,
    xp: num(r.xp),
    cardsViewed,
    lessonsDone: arr(r.lessonsDone).map(String),
    gamesPlayed: num(r.gamesPlayed),
    perfectGames: num(r.perfectGames),
    combinations: num(r.combinations),
    badges: arr(r.badges).map(String),
    streak: typeof streak.count === 'number' ? { count: streak.count, lastDay: typeof streak.lastDay === 'string' ? streak.lastDay : null } : initialProgress.streak,
    exams,
    casesDone: arr(r.casesDone).map(String),
    spreads: num(r.spreads),
    bestTimed: num(r.bestTimed),
    dailyDone: typeof r.dailyDone === 'string' ? r.dailyDone : null,
    weekly: typeof weekly.week === 'string'
      ? { week: weekly.week, cards: num(weekly.cards), lessons: num(weekly.lessons), games: num(weekly.games), practice: num(weekly.practice), exams: num(weekly.exams) }
      : emptyWeek(''),
    missionsClaimed: arr(r.missionsClaimed).map(String),
    collectibles: arr(r.collectibles).map(String),
    avatar: { robe: typeof avatar.robe === 'string' ? avatar.robe : 'indigo', accessory: typeof avatar.accessory === 'string' ? avatar.accessory : 'none' },
  };
}
