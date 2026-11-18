import { useMemo, useState } from 'react';
import { cardImage, MAJORS } from '../content/majors';
import { TRUE_FALSE } from '../content/trueFalse';
import type { MajorArcanum } from '../content/types';
import { WORLDS } from '../content/worlds';
import { IconBack, IconEye, IconGrid, IconQuestion } from '../components/Icons';
import { useI18n } from '../i18n/I18n';
import { sample, shuffle } from '../lib/random';
import { XP } from '../progress/model';
import { useProgress } from '../progress/Progress';
import { href } from '../router';

export function GamesHub() {
  const { t, l } = useI18n();
  const games = [
    { id: 'guess', icon: <IconEye />, title: t('games.guess'), desc: t('games.guessDesc') },
    { id: 'truefalse', icon: <IconQuestion />, title: t('games.truefalse'), desc: t('games.truefalseDesc') },
    { id: 'memory', icon: <IconGrid />, title: t('games.memory'), desc: t('games.memoryDesc') },
  ];
  return (
    <>
      <header className="stack" style={{ gap: 4 }}>
        <span className="eyebrow">{l(WORLDS[11])}</span>
        <h1 className="display h1">{t('games.title')}</h1>
        <p className="p muted">{t('games.subtitle')}</p>
      </header>
      {games.map((g) => (
        <a key={g.id} href={href.game(g.id)} className="card link-card" style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <span style={{ color: 'var(--gold)' }}>{g.icon}</span>
          <span className="stack" style={{ gap: 2 }}>
            <span className="display h3">{g.title}</span>
            <span className="small muted">{g.desc}</span>
          </span>
        </a>
      ))}
    </>
  );
}

function GameHeader({ title, sub }: { title: string; sub?: string }) {
  const { t } = useI18n();
  return (
    <header className="row">
      <a href={href.games()} className="icon-btn" aria-label={t('common.back')}><IconBack /></a>
      <div className="stack" style={{ gap: 0 }}>
        <h1 className="display h2">{title}</h1>
        {sub && <span className="small muted">{sub}</span>}
      </div>
    </header>
  );
}

function Result({ correct, total, gained, onAgain }: { correct: number; total: number; gained: number; onAgain: () => void }) {
  const { t } = useI18n();
  return (
    <section className="card gold fade" role="status" style={{ alignItems: 'center', textAlign: 'center', padding: 28 }}>
      {correct === total && <span className="eyebrow">{t('games.perfect')}</span>}
      <span className="display h1">{t('games.result', { c: correct, n: total })}</span>
      <span className="display h2" style={{ color: 'var(--gold)' }}>+{gained} XP</span>
      <div className="row">
        <button type="button" className="btn" onClick={onAgain}>{t('common.playAgain')}</button>
        <a href={href.games()} className="btn ghost">{t('common.back')}</a>
      </div>
    </section>
  );
}

const ROUNDS = 6;

interface GuessRound { answer: MajorArcanum; options: MajorArcanum[] }

function makeGuessRounds(): GuessRound[] {
  return sample(MAJORS, ROUNDS).map((answer) => ({
    answer,
    options: shuffle([answer, ...sample(MAJORS.filter((m) => m.n !== answer.n), 3)]),
  }));
}

export function GuessGame() {
  const { t, l } = useI18n();
  const { record } = useProgress();
  const [seed, setSeed] = useState(0);
  const rounds = useMemo(makeGuessRounds, [seed]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [gained, setGained] = useState<number | null>(null);

  const restart = () => { setSeed((s) => s + 1); setI(0); setPicked(null); setScore(0); setGained(null); };

  if (gained !== null) return (<><GameHeader title={t('games.guess')} /><Result correct={score} total={ROUNDS} gained={gained} onAgain={restart} /></>);

  const r = rounds[i];
  const answered = picked !== null;
  const next = () => {
    if (i + 1 < ROUNDS) { setI(i + 1); setPicked(null); }
    else setGained(record({ type: 'finishGame', correct: score, total: ROUNDS }));
  };

  return (
    <>
      <GameHeader title={t('games.guess')} sub={t('games.round', { i: i + 1, n: ROUNDS })} />
      <section className="card">
        <span className="eyebrow">{t('games.whichCard')}</span>
        <p className="p" style={{ fontSize: 16, lineHeight: 1.6 }}>{l(r.answer.visual)}</p>
      </section>
      <div className="grid2" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8 }}>
        {r.options.map((o) => {
          const right = answered && o.n === r.answer.n;
          const wrong = answered && o.n === picked && !right;
          return (
            <button
              key={o.n}
              type="button"
              disabled={answered}
              onClick={() => { setPicked(o.n); if (o.n === r.answer.n) setScore((s) => s + 1); }}
              aria-label={l(o.name)}
              style={{ padding: 3, borderRadius: 8, border: `2px solid ${right ? 'var(--teal)' : wrong ? 'var(--rose)' : 'transparent'}`, background: 'transparent' }}
            >
              <img className="tarot" src={cardImage(o.n)} alt="" />
            </button>
          );
        })}
      </div>
      {answered && (
        <div className="stack fade">
          <p role="status" className={`feedback ${picked === r.answer.n ? '' : 'bad'}`}>
            <strong>{picked === r.answer.n ? t('common.correct') : t('common.incorrect')}</strong> {r.answer.roman} · {l(r.answer.name)}
          </p>
          <button type="button" className="btn" onClick={next}>{i + 1 < ROUNDS ? t('common.next') : t('common.finish')}</button>
        </div>
      )}
    </>
  );
}

export function TrueFalseGame() {
  const { t, l } = useI18n();
  const { record } = useProgress();
  const [seed, setSeed] = useState(0);
  const items = useMemo(() => sample(TRUE_FALSE, ROUNDS), [seed]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [gained, setGained] = useState<number | null>(null);

  const restart = () => { setSeed((s) => s + 1); setI(0); setPicked(null); setScore(0); setGained(null); };

  if (gained !== null) return (<><GameHeader title={t('games.truefalse')} /><Result correct={score} total={ROUNDS} gained={gained} onAgain={restart} /></>);

  const item = items[i];
  const answered = picked !== null;
  const ok = picked === item.answer;
  const choose = (v: boolean) => { setPicked(v); if (v === item.answer) setScore((s) => s + 1); };
  const next = () => {
    if (i + 1 < ROUNDS) { setI(i + 1); setPicked(null); }
    else setGained(record({ type: 'finishGame', correct: score, total: ROUNDS }));
  };
  const cls = (v: boolean) => (answered && v === item.answer ? 'right' : answered && v === picked ? 'wrong' : '');

  return (
    <>
      <GameHeader title={t('games.truefalse')} sub={t('games.round', { i: i + 1, n: ROUNDS })} />
      <section className="card gold">
        <h2 className="display h2" style={{ fontSize: 22 }}>{l(item.statement)}</h2>
      </section>
      <div className="grid2">
        <button type="button" className={`option ${cls(true)}`} disabled={answered} onClick={() => choose(true)} style={{ textAlign: 'center' }}>{t('games.true')}</button>
        <button type="button" className={`option ${cls(false)}`} disabled={answered} onClick={() => choose(false)} style={{ textAlign: 'center' }}>{t('games.false')}</button>
      </div>
      {answered && (
        <div className="stack fade">
          <p role="status" className={`feedback ${ok ? '' : 'bad'}`}><strong>{ok ? t('common.correct') : t('common.incorrect')}</strong> {l(item.explain)}</p>
          <button type="button" className="btn" onClick={next}>{i + 1 < ROUNDS ? t('common.next') : t('common.finish')}</button>
        </div>
      )}
    </>
  );
}

interface Tile { key: string; card: number; kind: 'image' | 'name' }
const PAIRS = 6;

export function MemoryGame() {
  const { t, l } = useI18n();
  const { record } = useProgress();
  const [seed, setSeed] = useState(0);
  const tiles = useMemo<Tile[]>(() => {
    const cards = sample(MAJORS, PAIRS);
    return shuffle(cards.flatMap((c) => [
      { key: `${c.n}-i`, card: c.n, kind: 'image' as const },
      { key: `${c.n}-n`, card: c.n, kind: 'name' as const },
    ]));
  }, [seed]);
  const [open, setOpen] = useState<string[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gained, setGained] = useState<number | null>(null);

  const restart = () => { setSeed((s) => s + 1); setOpen([]); setMatched([]); setMoves(0); setGained(null); };

  const flip = (tile: Tile) => {
    if (open.length === 2 || open.includes(tile.key) || matched.includes(tile.card)) return;
    const nowOpen = [...open, tile.key];
    setOpen(nowOpen);
    if (nowOpen.length === 2) {
      const [a, b] = nowOpen.map((k) => tiles.find((x) => x.key === k)!);
      const m = moves + 1;
      setMoves(m);
      if (a.card === b.card) {
        const nm = [...matched, a.card];
        setMatched(nm);
        setOpen([]);
        if (nm.length === PAIRS) {
          const perfect = m <= PAIRS + 2;
          setGained(record({ type: 'finishGame', correct: PAIRS, total: PAIRS, bonusXp: XP.memoryComplete, perfect }));
        }
      } else {
        window.setTimeout(() => setOpen([]), 900);
      }
    }
  };

  return (
    <>
      <GameHeader title={t('games.memory')} sub={t('games.moves', { n: moves })} />
      {gained !== null && (
        <section className="card gold fade" role="status" style={{ alignItems: 'center', textAlign: 'center' }}>
          <span className="display h2">{t('games.memoryDone')}</span>
          <span className="display h2" style={{ color: 'var(--gold)' }}>+{gained} XP</span>
          <button type="button" className="btn" onClick={restart}>{t('common.playAgain')}</button>
        </section>
      )}
      <div className="memory">
        {tiles.map((tile) => {
          const isMatched = matched.includes(tile.card);
          const isOpen = isMatched || open.includes(tile.key);
          const card = MAJORS[tile.card];
          return (
            <button
              key={tile.key}
              type="button"
              className={isMatched ? 'matched' : isOpen ? 'open' : ''}
              onClick={() => flip(tile)}
              aria-label={isOpen ? (tile.kind === 'name' ? l(card.name) : `${l(card.name)} (img)`) : t('games.memoryCardBack')}
            >
              {!isOpen ? (
                <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.6 6.5L21 9.3l-5 4.4 1.5 6.8L12 17l-5.5 3.5L8 13.7 3 9.3l6.4-.8z" fill="none" stroke="#d4af6a" strokeWidth="1" /></svg>
              ) : tile.kind === 'image' ? (
                <img src={cardImage(tile.card)} alt="" />
              ) : (
                <span>{l(card.name)}</span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}
