import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { cardLinks } from './links';
import { CARDS, getCard } from './cards';
import { LESSONS } from './lessons';
import { SOURCES } from './sources';
import { LANGS, type L10n } from './types';

function expectFilled(text: L10n, where: string) {
  for (const lang of LANGS) expect(text[lang]?.trim(), `${where} [${lang}]`).toBeTruthy();
}

describe('the full deck', () => {
  it('has 78 cards with unique ids, in deck order', () => {
    expect(CARDS).toHaveLength(78);
    expect(new Set(CARDS.map((c) => c.id)).size).toBe(78);
    CARDS.forEach((c, i) => expect(c.order, c.id).toBe(i));
    expect(CARDS.filter((c) => c.arcana === 'minor')).toHaveLength(56);
  });

  it('has every text in both languages and an image in two sizes', () => {
    for (const c of CARDS) {
      expectFilled(c.name, c.id);
      expectFilled(c.visual, c.id);
      expectFilled(c.waite, c.id);
      if (c.waiteReversed) expectFilled(c.waiteReversed, c.id);
      if (c.note) expectFilled(c.note, c.id);
      expect(c.correspondences.length, c.id).toBeGreaterThan(0);
      for (const b of c.correspondences) {
        expect(b.school, c.id).toBeTruthy();
        b.rows.forEach((r) => { expectFilled(r.label, c.id); expectFilled(r.value, c.id); });
      }
      for (const suffix of ['', '_lg']) {
        expect(existsSync(join(process.cwd(), 'public/cards', `${c.id}${suffix}.jpg`)), `${c.id}${suffix}.jpg`).toBe(true);
      }
    }
  });

  it('names minor cards correctly and gives Golden Dawn decans to pips', () => {
    expect(getCard('w01')!.name.es).toBe('As de Bastos');
    expect(getCard('c11')!.name.en).toBe('Page of Cups');
    expect(getCard('p14')!.name.es).toBe('Rey de Oros');
    const twoWands = getCard('w02')!.correspondences[0].rows.map((r) => r.value.en);
    expect(twoWands).toContain('Mars in Aries');
    expect(twoWands).toContain('Lord of Dominion');
    const tenSwords = getCard('s10')!.correspondences[0].rows.map((r) => r.value.en);
    expect(tenSwords).toContain('Sun in Gemini');
  });
});

describe('lessons and sources', () => {
  it('only reference existing cards', () => {
    for (const l of LESSONS) for (const p of l.pages) if (p.card) expect(getCard(p.card), `${l.id} → ${p.card}`).toBeDefined();
  });

  it('bibliography is bilingual and unique', () => {
    expect(new Set(SOURCES.map((s) => s.id)).size).toBe(SOURCES.length);
    for (const s of SOURCES) { expect(s.citation).toBeTruthy(); expectFilled(s.note, s.id); }
  });
});

describe('combination links', () => {
  it('reports only observable relations', () => {
    const keys = (a: string, b: string) => cardLinks(getCard(a)!, getCard(b)!).map((x) => x.key);
    expect(keys('m01', 'm02')).toEqual(['combo.bothMajors']);
    expect(keys('m01', 'p08')).toEqual(['combo.majorMinor']);
    expect(keys('w03', 'w07')).toEqual(['combo.sameSuit']);
    expect(keys('w03', 'c03')).toEqual(['combo.sameRank', 'combo.elements']);
  });
});
