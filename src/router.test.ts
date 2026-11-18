import { describe, expect, it } from 'vitest';
import { href, parseHash } from './router';

describe('router', () => {
  it('round-trips every route', () => {
    expect(parseHash(href.home())).toEqual({ name: 'home' });
    expect(parseHash(href.learn())).toEqual({ name: 'learn' });
    expect(parseHash(href.lesson('rws'))).toEqual({ name: 'lesson', id: 'rws' });
    expect(parseHash(href.library())).toEqual({ name: 'library' });
    expect(parseHash(href.card(8))).toEqual({ name: 'card', n: 8 });
    expect(parseHash(href.games())).toEqual({ name: 'games' });
    expect(parseHash(href.game('memory'))).toEqual({ name: 'game', id: 'memory' });
    expect(parseHash(href.profile())).toEqual({ name: 'profile' });
  });

  it('falls back safely on bad input', () => {
    expect(parseHash('')).toEqual({ name: 'home' });
    expect(parseHash('#card-99')).toEqual({ name: 'library' });
    expect(parseHash('#game-chess')).toEqual({ name: 'games' });
    expect(parseHash('#whatever')).toEqual({ name: 'home' });
  });
});
