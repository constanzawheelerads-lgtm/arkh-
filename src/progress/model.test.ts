import { describe, expect, it } from 'vitest';
import { applyEvent, initialProgress, levelFromXp, migrate, missionStatus, MISSIONS, weekKey, XP, xpForLevel } from './model';

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
    expect(m.version).toBe(3);
    expect(m.cardsViewed).toEqual(['m01', 'm12']);
    expect(m.combinations).toBe(0);
    expect(m.xp).toBe(60);
    expect(m.streak.count).toBe(2);
  });
});

describe('phase 4: progression', () => {
  it('computes ISO weeks', () => {
    expect(weekKey('2026-11-18')).toBe('2026-W47');
    expect(weekKey('2026-01-01')).toBe('2026-W01');
    expect(weekKey('2027-01-01')).toBe('2026-W53');
  });

  it('awards the daily challenge once per day', () => {
    const a = applyEvent(initialProgress, { type: 'finishGame', game: 'guess', correct: 2, total: 6 }, DAY, 4);
    expect(a.dailyCompleted).toBe(true);
    expect(a.xpGained).toBe(2 * XP.gameCorrect + XP.dailyChallenge);
    const b = applyEvent(a.state, { type: 'finishGame', game: 'guess', correct: 2, total: 6 }, DAY, 4);
    expect(b.dailyCompleted).toBe(false);
    expect(b.xpGained).toBe(2 * XP.gameCorrect);
  });

  it('tracks exams, keeps the best score and grants the collectible on pass', () => {
    const fail = applyEvent(initialProgress, { type: 'finishExam', exam: 'majors', correct: 4, total: 8 }, DAY, 4);
    expect(fail.xpGained).toBe(0);
    expect(fail.state.exams.majors).toBe(0.5);
    const pass = applyEvent(fail.state, { type: 'finishExam', exam: 'majors', correct: 7, total: 8 }, DAY, 4);
    expect(pass.xpGained).toBe(XP.examPass);
    expect(pass.newCollectibles).toContain('rose');
    expect(pass.newBadges).toContain('first-exam');
    const again = applyEvent(pass.state, { type: 'finishExam', exam: 'majors', correct: 6, total: 8 }, DAY, 4);
    expect(again.xpGained).toBe(0);
    expect(again.state.exams.majors).toBe(0.875);
  });

  it('counts weekly missions, lets them be claimed once and resets next week', () => {
    let s = initialProgress;
    for (const id of ['m01', 'm02', 'm03', 'm04', 'm05']) s = applyEvent(s, { type: 'viewCard', card: id }, DAY, 4).state;
    const cards = MISSIONS.find((m) => m.id === 'cards')!;
    expect(missionStatus(s, cards, DAY)).toEqual({ value: 5, done: true, claimed: false });
    const c = applyEvent(s, { type: 'claimMission', mission: 'cards' }, DAY, 4);
    expect(c.xpGained).toBe(cards.xp);
    expect(applyEvent(c.state, { type: 'claimMission', mission: 'cards' }, DAY, 4).xpGained).toBe(0);
    expect(missionStatus(c.state, cards, '2026-11-25')).toEqual({ value: 0, done: false, claimed: false });
  });

  it('does not let a mission be claimed before it is done', () => {
    expect(applyEvent(initialProgress, { type: 'claimMission', mission: 'exam' }, DAY, 4).xpGained).toBe(0);
  });

  it('only equips unlocked avatar options', () => {
    const locked = applyEvent(initialProgress, { type: 'setAvatar', avatar: { robe: 'gold', accessory: 'star' } }, DAY, 4);
    expect(locked.state.avatar).toEqual({ robe: 'indigo', accessory: 'none' });
    const rich = { ...initialProgress, xp: 700, collectibles: ['star'] };
    const ok = applyEvent(rich, { type: 'setAvatar', avatar: { robe: 'gold', accessory: 'star' } }, DAY, 4);
    expect(ok.state.avatar).toEqual({ robe: 'gold', accessory: 'star' });
  });

  it('rewards consultations, spreads and time trials with collectibles', () => {
    let s = applyEvent(initialProgress, { type: 'completeCase', caseId: 'marina' }, DAY, 4).state;
    expect(s.collectibles).toContain('lantern');
    for (let i = 0; i < 5; i++) s = applyEvent(s, { type: 'drawSpread' }, DAY, 4).state;
    expect(s.collectibles).toContain('wheel');
    s = applyEvent(s, { type: 'finishGame', game: 'timed', correct: 11, total: 14, perfect: false }, DAY, 4).state;
    expect(s.bestTimed).toBe(11);
    expect(s.collectibles).toContain('scales');
  });

  it('migrates version 2 progress', () => {
    const v2 = { version: 2, xp: 135, cardsViewed: ['m01', 's10'], lessonsDone: ['structure'], gamesPlayed: 1, perfectGames: 0, combinations: 1, badges: ['first-lesson'], streak: { count: 2, lastDay: '2026-11-18' } };
    const m = migrate(v2);
    expect(m.version).toBe(3);
    expect(m.cardsViewed).toEqual(['m01', 's10']);
    expect(m.exams).toEqual({});
    expect(m.avatar).toEqual({ robe: 'indigo', accessory: 'none' });
  });
});
