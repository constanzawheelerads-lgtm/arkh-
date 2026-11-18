import type { Card } from './types';

/** Objective, observable links between two cards (no interpretation). */
export function cardLinks(a: Card, b: Card): { key: 'combo.sameSuit' | 'combo.sameRank' | 'combo.bothMajors' | 'combo.majorMinor' | 'combo.elements'; vars?: Record<string, string> }[] {
  const out: ReturnType<typeof cardLinks> = [];
  if (a.arcana === 'major' && b.arcana === 'major') out.push({ key: 'combo.bothMajors' });
  else if (a.arcana !== b.arcana) out.push({ key: 'combo.majorMinor' });
  if (a.suit && a.suit === b.suit) out.push({ key: 'combo.sameSuit', vars: { suit: a.suit } });
  if (a.rank && a.rank === b.rank) out.push({ key: 'combo.sameRank' });
  if (a.suit && b.suit && a.suit !== b.suit) out.push({ key: 'combo.elements', vars: { a: a.suit, b: b.suit } });
  return out;
}

