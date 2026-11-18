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
    const a = applyEvent(initialProgress, { type: 'viewCard', card: 1 }, DAY, 4);
    expect(a.xpGained).toBe(XP.firstCardView);
    const b = applyEvent(a.state, { type: 'viewCard', card: 1 }, DAY, 4);
    expect(b.xpGained).toBe(0);
    expect(b.state.cardsViewed).toEqual([1]);
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
    let s = applyEvent(initialProgress, { type: 'viewCard', card: 0 }, '2026-11-16', 4).state;
    expect(s.streak.count).toBe(1);
    s = applyEvent(s, { type: 'viewCard', card: 1 }, '2026-11-16', 4).state;
    expect(s.streak.count).toBe(1);
    s = applyEvent(s, { type: 'viewCard', card: 2 }, '2026-11-17', 4).state;
    expect(s.streak.count).toBe(2);
    const r = applyEvent(s, { type: 'viewCard', card: 3 }, '2026-11-18', 4);
    expect(r.state.streak.count).toBe(3);
    expect(r.newBadges).toContain('streak-3');
    s = applyEvent(r.state, { type: 'viewCard', card: 4 }, '2026-11-21', 4).state;
    expect(s.streak.count).toBe(1);
  });

  it('reports level ups', () => {
    const start = { ...initialProgress, xp: 95 };
    const r = applyEvent(start, { type: 'completeLesson', lesson: 'x' }, DAY, 4);
    expect(r.levelUp).toBe(2);
  });
});

describe('migrate', () => {
  it('rejects garbage and keeps valid data', () => {
    expect(migrate(null)).toEqual(initialProgress);
    expect(migrate('nope')).toEqual(initialProgress);
    expect(migrate({ version: 99 })).toEqual(initialProgress);
    const valid = { ...initialProgress, xp: 42, cardsViewed: [1, 2] };
    expect(migrate(valid)).toEqual(valid);
  });
});
