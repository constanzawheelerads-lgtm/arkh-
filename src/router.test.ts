import { describe, expect, it } from 'vitest';
import { href, parseHash } from './router';

describe('router', () => {
  it('round-trips every route', () => {
    expect(parseHash(href.home())).toEqual({ name: 'home' });
    expect(parseHash(href.learn())).toEqual({ name: 'learn' });
    expect(parseHash(href.lesson('rws'))).toEqual({ name: 'lesson', id: 'rws' });
    expect(parseHash(href.library())).toEqual({ name: 'library' });
    expect(parseHash(href.card('m08'))).toEqual({ name: 'card', id: 'm08' });
    expect(parseHash(href.card('p14'))).toEqual({ name: 'card', id: 'p14' });
    expect(parseHash(href.sources())).toEqual({ name: 'sources' });
    expect(parseHash(href.game('combination'))).toEqual({ name: 'game', id: 'combination' });
    expect(parseHash(href.games())).toEqual({ name: 'games' });
    expect(parseHash(href.game('memory'))).toEqual({ name: 'game', id: 'memory' });
    expect(parseHash(href.profile())).toEqual({ name: 'profile' });
    expect(parseHash(href.worlds())).toEqual({ name: 'worlds' });
    expect(parseHash(href.world(17))).toEqual({ name: 'world', n: 17 });
    expect(parseHash(href.exam('majors'))).toEqual({ name: 'exam', id: 'majors' });
    expect(parseHash(href.lab())).toEqual({ name: 'lab' });
    expect(parseHash(href.caseStudy('marina'))).toEqual({ name: 'case', id: 'marina' });
    expect(parseHash(href.game('timed'))).toEqual({ name: 'game', id: 'timed' });
  });

  it('falls back safely on bad input', () => {
    expect(parseHash('')).toEqual({ name: 'home' });
    expect(parseHash('#card-m22')).toEqual({ name: 'library' });
    expect(parseHash('#card-w15')).toEqual({ name: 'library' });
    expect(parseHash('#card-8')).toEqual({ name: 'library' });
    expect(parseHash('#game-chess')).toEqual({ name: 'games' });
    expect(parseHash('#whatever')).toEqual({ name: 'home' });
    expect(parseHash('#world-5')).toEqual({ name: 'worlds' });
    expect(parseHash('#world-')).toEqual({ name: 'worlds' });
  });
});
