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
  /** Optional historical note specific to this card. */
  note?: L10n;
}

export interface LessonPage {
  text: L10n;
  /** Optional card shown alongside the page (RWS number). */
  card?: number;
}

export interface Question {
  prompt: L10n;
  options: L10n[];
  correct: number;
  explain: L10n;
}

export interface Lesson {
  id: string;
  /** World (major arcanum) the lesson belongs to. */
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
