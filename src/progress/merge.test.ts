import { describe, expect, it } from 'vitest';
import { mergeProgress } from './merge';
import { initialProgress, type ProgressState } from './model';

const base = (over: Partial<ProgressState>): ProgressState => ({ ...initialProgress, ...over });

describe('mergeProgress', () => {
  it('keeps everything learned on either device', () => {
    const phone = base({ xp: 300, cardsViewed: ['m01', 'm02'], lessonsDone: ['structure'], badges: ['first-lesson'], collectibles: ['rose'], exams: { majors: 0.75 } });
    const tablet = base({ xp: 120, cardsViewed: ['m02', 'w03'], lessonsDone: ['origins'], badges: ['first-game'], collectibles: ['wheel'], exams: { majors: 0.5, history: 0.875 } });
    const m = mergeProgress(phone, tablet);
    expect(m.xp).toBe(300);
    expect(m.cardsViewed.sort()).toEqual(['m01', 'm02', 'w03']);
    expect(m.lessonsDone.sort()).toEqual(['origins', 'structure']);
    expect(m.badges.sort()).toEqual(['first-game', 'first-lesson']);
    expect(m.collectibles.sort()).toEqual(['rose', 'wheel']);
    expect(m.exams).toEqual({ majors: 0.75, history: 0.875 });
  });

  it('is symmetric for learning data and idempotent', () => {
    const a = base({ xp: 50, cardsViewed: ['m01'], spreads: 3 });
    const b = base({ xp: 80, cardsViewed: ['p14'], spreads: 1 });
    const ab = mergeProgress(a, b);
    const ba = mergeProgress(b, a);
    expect(ab.xp).toBe(ba.xp);
    expect(ab.cardsViewed.sort()).toEqual(ba.cardsViewed.sort());
    expect(mergeProgress(ab, ab)).toEqual(ab);
  });

  it('takes the most recent streak and week', () => {
    const a = base({ streak: { count: 4, lastDay: '2026-11-18' }, weekly: { week: '2026-W47', cards: 2, lessons: 1, games: 0, practice: 0, exams: 0 }, missionsClaimed: ['2026-W46:cards', '2026-W47:lessons'] });
    const b = base({ streak: { count: 9, lastDay: '2026-11-10' }, weekly: { week: '2026-W46', cards: 9, lessons: 9, games: 9, practice: 9, exams: 9 } });
    const m = mergeProgress(a, b);
    expect(m.streak).toEqual({ count: 4, lastDay: '2026-11-18' });
    expect(m.weekly.week).toBe('2026-W47');
    expect(m.weekly.cards).toBe(2);
    expect(m.missionsClaimed).toEqual(['2026-W47:lessons']);
  });

  it('adds up counters within the same week by keeping the highest', () => {
    const w = { week: '2026-W47', cards: 1, lessons: 2, games: 0, practice: 1, exams: 0 };
    const m = mergeProgress(base({ weekly: w }), base({ weekly: { ...w, cards: 4, exams: 1 } }));
    expect(m.weekly).toEqual({ ...w, cards: 4, exams: 1 });
  });

  it('keeps the avatar the person chose on this device', () => {
    const local = base({ avatar: { robe: 'garnet', accessory: 'star' } });
    const cloud = base({ avatar: { robe: 'forest', accessory: 'none' } });
    expect(mergeProgress(local, cloud).avatar).toEqual({ robe: 'garnet', accessory: 'star' });
    expect(mergeProgress(initialProgress, cloud).avatar).toEqual({ robe: 'forest', accessory: 'none' });
  });

  it('survives corrupt or old cloud data', () => {
    const local = base({ xp: 10, cardsViewed: ['m01'] });
    expect(mergeProgress(local, null).cardsViewed).toEqual(['m01']);
    expect(mergeProgress(local, { version: 1, xp: 40, cardsViewed: [3] }).cardsViewed.sort()).toEqual(['m01', 'm03']);
  });
});
