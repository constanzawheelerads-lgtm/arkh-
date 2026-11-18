import { describe, expect, it } from 'vitest';
import { en, es } from '../i18n/ui';
import { LESSONS } from './lessons';
import { MAJORS } from './majors';
import { TRUE_FALSE } from './trueFalse';
import { LANGS, type L10n } from './types';
import { WORLDS } from './worlds';

function expectFilled(text: L10n, where: string) {
  for (const lang of LANGS) {
    expect(text[lang]?.trim(), `${where} [${lang}]`).toBeTruthy();
  }
}

describe('major arcana', () => {
  it('has the 22 cards in order', () => {
    expect(MAJORS.map((m) => m.n)).toEqual(Array.from({ length: 22 }, (_, i) => i));
  });

  it('has every text in every language', () => {
    for (const m of MAJORS) {
      const w = `card ${m.n}`;
      expectFilled(m.name, w);
      expectFilled(m.visual, w);
      expectFilled(m.waite, w);
      expectFilled(m.waiteReversed, w);
      expectFilled(m.goldenDawn.attribution, w);
      if (m.note) expectFilled(m.note, w);
      expect(m.goldenDawn.hebrewLetter).toBeTruthy();
    }
  });

  it('keeps the RWS Strength/Justice order', () => {
    expect(MAJORS[8].name.en).toBe('Strength');
    expect(MAJORS[11].name.en).toBe('Justice');
  });
});

describe('lessons', () => {
  it('are complete and bilingual', () => {
    const ids = new Set<string>();
    for (const lesson of LESSONS) {
      expect(ids.has(lesson.id)).toBe(false);
      ids.add(lesson.id);
      expect(WORLDS[lesson.world], lesson.id).toBeDefined();
      expectFilled(lesson.title, lesson.id);
      lesson.pages.forEach((p, i) => expectFilled(p.text, `${lesson.id} page ${i}`));
      expectFilled(lesson.quiz.prompt, lesson.id);
      expectFilled(lesson.quiz.explain, lesson.id);
      lesson.quiz.options.forEach((o) => expectFilled(o, lesson.id));
      expect(lesson.quiz.correct).toBeLessThan(lesson.quiz.options.length);
      expect(lesson.sources.length).toBeGreaterThan(0);
    }
  });
});

describe('true/false bank', () => {
  it('is bilingual and has unique ids', () => {
    const ids = TRUE_FALSE.map((x) => x.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const x of TRUE_FALSE) {
      expectFilled(x.statement, x.id);
      expectFilled(x.explain, x.id);
    }
  });
});

describe('interface strings', () => {
  it('have the same keys and placeholders in both languages', () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(es).sort());
    for (const key of Object.keys(es) as (keyof typeof es)[]) {
      const vars = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort();
      expect(vars(en[key]), key).toEqual(vars(es[key]));
    }
  });
});
