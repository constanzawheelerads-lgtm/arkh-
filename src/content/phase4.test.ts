import { describe, expect, it } from 'vitest';
import { getCard } from './cards';
import { CASES } from './cases';
import { EXAMS } from './exams';
import { LESSONS } from './lessons';
import { LANGS, type L10n } from './types';
import { WORLD_PATH } from '../progress/worlds';

const filled = (t: L10n) => LANGS.every((l) => t[l]?.trim());

describe('exams', () => {
  it('build valid, bilingual attempts with distinct options', () => {
    for (const exam of EXAMS) {
      for (let run = 0; run < 25; run++) {
        const qs = exam.build();
        expect(qs.length, exam.id).toBe(8);
        for (const q of qs) {
          expect(filled(q.prompt), exam.id).toBeTruthy();
          expect(filled(q.explain), exam.id).toBeTruthy();
          expect(q.correct).toBeGreaterThanOrEqual(0);
          expect(q.correct).toBeLessThan(q.options.length);
          expect(new Set(q.options.map((o) => o.es)).size, `${exam.id}: ${q.prompt.es}`).toBe(q.options.length);
          if (q.image) expect(getCard(q.image)).toBeDefined();
        }
      }
    }
  });
});

describe('consultation cases', () => {
  it('use real cards and are bilingual', () => {
    for (const c of CASES) {
      expect(filled(c.story) && filled(c.question)).toBeTruthy();
      c.cards.forEach((x) => { expect(getCard(x.card), x.card).toBeDefined(); expect(filled(x.position)).toBeTruthy(); });
      c.dialogue.forEach((d) => expect(filled(d.ask) && filled(d.answer)).toBeTruthy());
    }
  });
});

describe('worlds', () => {
  it('every lesson belongs to a world on the map', () => {
    const worlds = new Set(WORLD_PATH.map((w) => w.n));
    for (const l of LESSONS) expect(worlds.has(l.world), l.id).toBe(true);
  });
});
