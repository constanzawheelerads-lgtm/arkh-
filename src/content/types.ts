export type Lang = 'es' | 'en';
export const LANGS: readonly Lang[] = ['es', 'en'];

/** A text available in every supported language. */
export type L10n = Record<Lang, string>;

export interface MajorArcanum {
  /** RWS number, 0–21. */
  n: number;
  roman: string;
  name: L10n;
  /** Name (and number when it differs) in the Tarot de Marseille tradition. */
  marseille: string;
  /** What the card shows: description only, no interpretation. */
  visual: L10n;
  /** Selection of the divinatory meanings listed by A. E. Waite (1910). */
  waite: L10n;
  waiteReversed: L10n;
  /** Golden Dawn attribution (late 19th c.). */
  goldenDawn: { attribution: L10n; hebrewLetter: string };
  /** Correspondences of other schools that differ from the Golden Dawn. */
  otherSchools?: { school: string; text: L10n }[];
  /** Optional historical note specific to this card. */
  note?: L10n;
}

export type SuitId = 'wands' | 'cups' | 'swords' | 'pentacles';

/** One block of correspondences, always tied to the school that proposes it. */
export interface CorrespondenceBlock {
  school: string;
  rows: { label: L10n; value: L10n }[];
  note?: L10n;
}

/** Unified card model used by the whole app (22 majors + 56 minors). */
export interface Card {
  /** Stable id: m00–m21 for majors; w/c/s/p + 01–14 for minors. */
  id: string;
  arcana: 'major' | 'minor';
  /** Position in the deck, 0–77 (majors first, then Wands, Cups, Swords, Pentacles). */
  order: number;
  /** Short label: roman numeral for majors, suit + rank for minors. */
  label: string;
  suit?: SuitId;
  /** 1 = Ace … 10, 11 = Page, 12 = Knight, 13 = Queen, 14 = King. */
  rank?: number;
  name: L10n;
  marseille: string;
  visual: L10n;
  waite: L10n;
  waiteReversed?: L10n;
  correspondences: CorrespondenceBlock[];
  note?: L10n;
}

export interface LessonPage {
  text: L10n;
  /** Optional card shown alongside the page (card id). */
  card?: string;
}

export interface Question {
  prompt: L10n;
  options: L10n[];
  correct: number;
  explain: L10n;
}

export interface Lesson {
  id: string;
  /** World (major arcanum number) the lesson belongs to. */
  world: number;
  title: L10n;
  minutes: number;
  pages: LessonPage[];
  quiz: Question;
  sources: string[];
}

export interface TrueFalseItem {
  id: string;
  statement: L10n;
  answer: boolean;
  explain: L10n;
}

export interface Source {
  id: string;
  citation: string;
  kind: 'primary' | 'research' | 'school';
  note: L10n;
}
