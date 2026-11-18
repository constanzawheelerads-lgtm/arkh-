import { describe, expect, it } from 'vitest';
import { applyEvent, initialProgress, levelFromXp, migrate, XP, xpForLevel } from './model';

const DAY = '2026-11-18';

describe('levels', () => {
  it('uses growing thresholds', () => {
    expect(xpForLevel(1)).toBe(0);
    expect(xpForLevel(2)).toBe(100);
    expect(xpForLevel(3)).toBe(300);
    expect(levelFromXp(0)).toBe(1);
    expect(levelFromXp(99)).toBe(1);
    expect(levelFromXp(100)).toBe(2);
    expect(levelFromXp(299)).toBe(2);
    expect(levelFromXp(300)).toBe(3);
  });
});

describe('applyEvent', () => {
  it('awards XP only for the first view of a card', () => {
    const a = applyEvent(initialProgress, { type: 'viewCard', card: 'm01' }, DAY, 4);
    expect(a.xpGained).toBe(XP.firstCardView);
    const b = applyEvent(a.state, { type: 'viewCard', card: 'm01' }, DAY, 4);
    expect(b.xpGained).toBe(0);
    expect(b.state.cardsViewed).toEqual(['m01']);
  });

  it('completes a lesson once and grants the first-lesson badge', () => {
    const a = applyEvent(initialProgress, { type: 'completeLesson', lesson: 'structure' }, DAY, 4);
    expect(a.xpGained).toBe(XP.lesson);
    expect(a.newBadges).toContain('first-lesson');
    const b = applyEvent(a.state, { type: 'completeLesson', lesson: 'structure' }, DAY, 4);
    expect(b.xpGained).toBe(0);
    expect(b.newBadges).toEqual([]);
  });

  it('scores games and rewards perfect ones', () => {
    const r = applyEvent(initialProgress, { type: 'finishGame', correct: 6, total: 6 }, DAY, 4);
    expect(r.xpGained).toBe(6 * XP.gameCorrect + XP.perfectBonus);
    expect(r.state.perfectGames).toBe(1);
    expect(r.newBadges).toEqual(expect.arrayContaining(['first-game', 'perfect-game']));
    const s = applyEvent(r.state, { type: 'finishGame', correct: 3, total: 6 }, DAY, 4);
    expect(s.xpGained).toBe(3 * XP.gameCorrect);
    expect(s.state.perfectGames).toBe(1);
  });

  it('tracks the daily streak', () => {
    let s = applyEvent(initialProgress, { type: 'viewCard', card: 'm00' }, '2026-11-16', 4).state;
    expect(s.streak.count).toBe(1);
    s = applyEvent(s, { type: 'viewCard', card: 'm01' }, '2026-11-16', 4).state;
    expect(s.streak.count).toBe(1);
    s = applyEvent(s, { type: 'viewCard', card: 'm02' }, '2026-11-17', 4).state;
    expect(s.streak.count).toBe(2);
    const r = applyEvent(s, { type: 'viewCard', card: 'm03' }, '2026-11-18', 4);
    expect(r.state.streak.count).toBe(3);
    expect(r.newBadges).toContain('streak-3');
    s = applyEvent(r.state, { type: 'viewCard', card: 'm04' }, '2026-11-21', 4).state;
    expect(s.streak.count).toBe(1);
  });

  it('reports level ups', () => {
    const start = { ...initialProgress, xp: 95 };
    const r = applyEvent(start, { type: 'completeLesson', lesson: 'x' }, DAY, 4);
    expect(r.levelUp).toBe(2);
  });
});

describe('phase 3 badges', () => {
  it('awards four-suits and first-combination', () => {
    let s = initialProgress;
    for (const id of ['w01', 'c02', 's03']) s = applyEvent(s, { type: 'viewCard', card: id }, DAY, 4).state;
    const r = applyEvent(s, { type: 'viewCard', card: 'p04' }, DAY, 4);
    expect(r.newBadges).toContain('four-suits');
    const c = applyEvent(r.state, { type: 'practiceCombination' }, DAY, 4);
    expect(c.xpGained).toBe(XP.combination);
    expect(c.newBadges).toContain('first-combination');
  });
});

describe('migrate', () => {
  it('rejects garbage and keeps valid data', () => {
    expect(migrate(null)).toEqual(initialProgress);
    expect(migrate('nope')).toEqual(initialProgress);
    expect(migrate({ version: 99 })).toEqual(initialProgress);
    const valid = { ...initialProgress, xp: 42, cardsViewed: ['m01', 'w03'] };
    expect(migrate(valid)).toEqual(valid);
  });

  it('upgrades version 1 progress (numeric major ids)', () => {
    const v1 = { version: 1, xp: 60, cardsViewed: [1, 12], lessonsDone: ['structure'], gamesPlayed: 1, perfectGames: 0, badges: ['first-lesson'], streak: { count: 2, lastDay: '2026-11-17' } };
    const m = migrate(v1);
    expect(m.version).toBe(2);
    expect(m.cardsViewed).toEqual(['m01', 'm12']);
    expect(m.combinations).toBe(0);
    expect(m.xp).toBe(60);
    expect(m.streak.count).toBe(2);
  });
});
