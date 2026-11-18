import { useEffect, useMemo, useState } from 'react';
import { CARDS, cardImage } from '../content/cards';
import { cardLinks } from '../content/links';
import { SUITS } from '../content/minors';
import { TRUE_FALSE } from '../content/trueFalse';
import type { Card, L10n } from '../content/types';
import { WORLDS } from '../content/worlds';
import { IconBack, IconEye, IconGrid, IconQuestion, IconLearn, IconStar } from '../components/Icons';
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
    { id: 'combination', icon: <IconLearn />, title: t('games.combination'), desc: t('games.combinationDesc') },
    { id: 'timed', icon: <IconStar />, title: t('games.timed'), desc: t('games.timedDesc') },
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

interface GuessRound { answer: Card; options: Card[] }

function makeGuessRounds(): GuessRound[] {
  return sample(CARDS, ROUNDS).map((answer) => ({
    answer,
    options: shuffle([answer, ...sample(CARDS.filter((c) => c.id !== answer.id), 3)]),
  }));
}

export function GuessGame() {
  const { t, l } = useI18n();
  const { record } = useProgress();
  const [seed, setSeed] = useState(0);
   
  const rounds = useMemo(makeGuessRounds, [seed]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [gained, setGained] = useState<number | null>(null);

  const restart = () => { setSeed((s) => s + 1); setI(0); setPicked(null); setScore(0); setGained(null); };

  if (gained !== null) return (<><GameHeader title={t('games.guess')} /><Result correct={score} total={ROUNDS} gained={gained} onAgain={restart} /></>);

  const r = rounds[i];
  const answered = picked !== null;
  const next = () => {
    if (i + 1 < ROUNDS) { setI(i + 1); setPicked(null); }
    else setGained(record({ type: 'finishGame', game: 'guess', correct: score, total: ROUNDS }));
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
          const right = answered && o.id === r.answer.id;
          const wrong = answered && o.id === picked && !right;
          return (
            <button
              key={o.id}
              type="button"
              disabled={answered}
              onClick={() => { setPicked(o.id); if (o.id === r.answer.id) setScore((s) => s + 1); }}
              aria-label={l(o.name)}
              style={{ padding: 3, borderRadius: 8, border: `2px solid ${right ? 'var(--teal)' : wrong ? 'var(--rose)' : 'transparent'}`, background: 'transparent' }}
            >
              <img className="tarot" src={cardImage(o.id)} alt="" />
            </button>
          );
        })}
      </div>
      {answered && (
        <div className="stack fade">
          <p role="status" className={`feedback ${picked === r.answer.id ? '' : 'bad'}`}>
            <strong>{picked === r.answer.id ? t('common.correct') : t('common.incorrect')}</strong> {l(r.answer.name)}
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    else setGained(record({ type: 'finishGame', game: 'truefalse', correct: score, total: ROUNDS }));
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

interface Tile { key: string; card: Card; kind: 'image' | 'name' }
const PAIRS = 6;

export function MemoryGame() {
  const { t, l } = useI18n();
  const { record } = useProgress();
  const [seed, setSeed] = useState(0);
  const tiles = useMemo<Tile[]>(() => {
    const cards = sample(CARDS, PAIRS);
    return shuffle(cards.flatMap((c) => [
      { key: `${c.id}-i`, card: c, kind: 'image' as const },
      { key: `${c.id}-n`, card: c, kind: 'name' as const },
    ]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);
  const [open, setOpen] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [gained, setGained] = useState<number | null>(null);

  const restart = () => { setSeed((s) => s + 1); setOpen([]); setMatched([]); setMoves(0); setGained(null); };

  const flip = (tile: Tile) => {
    if (open.length === 2 || open.includes(tile.key) || matched.includes(tile.card.id)) return;
    const nowOpen = [...open, tile.key];
    setOpen(nowOpen);
    if (nowOpen.length === 2) {
      const [a, b] = nowOpen.map((k) => tiles.find((x) => x.key === k)!);
      const m = moves + 1;
      setMoves(m);
      if (a.card.id === b.card.id) {
        const nm = [...matched, a.card.id];
        setMatched(nm);
        setOpen([]);
        if (nm.length === PAIRS) {
          const perfect = m <= PAIRS + 2;
          setGained(record({ type: 'finishGame', game: 'memory', correct: PAIRS, total: PAIRS, bonusXp: XP.memoryComplete, perfect }));
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
          const isMatched = matched.includes(tile.card.id);
          const isOpen = isMatched || open.includes(tile.key);
          return (
            <button
              key={tile.key}
              type="button"
              className={isMatched ? 'matched' : isOpen ? 'open' : ''}
              onClick={() => flip(tile)}
              aria-label={isOpen ? l(tile.card.name) : t('games.memoryCardBack')}
            >
              {!isOpen ? (
                <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.6 6.5L21 9.3l-5 4.4 1.5 6.8L12 17l-5.5 3.5L8 13.7 3 9.3l6.4-.8z" fill="none" stroke="#d4af6a" strokeWidth="1" /></svg>
              ) : tile.kind === 'image' ? (
                <img src={cardImage(tile.card.id)} alt="" />
              ) : (
                <span style={{ fontSize: 15 }}>{l(tile.card.name)}</span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}

const PRACTICE_QUESTIONS: L10n[] = [
  { es: '¿Qué conviene tener en cuenta al empezar un trabajo nuevo?', en: 'What should I keep in mind when starting a new job?' },
  { es: '¿Cómo puedo mejorar la comunicación con una amiga?', en: 'How can I improve communication with a friend?' },
  { es: '¿Qué actitud me conviene ante una mudanza?', en: 'What attitude would help me through a move?' },
  { es: '¿Cómo encarar un examen importante?', en: 'How should I approach an important exam?' },
  { es: '¿Qué necesito para retomar un proyecto abandonado?', en: 'What do I need to pick up an abandoned project?' },
];

export function CombinationGame() {
  const { t, l } = useI18n();
  const { record } = useProgress();
  const [seed, setSeed] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pair = useMemo(() => sample(CARDS, 2), [seed]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const question = useMemo(() => sample(PRACTICE_QUESTIONS, 1)[0], [seed]);
  const [text, setText] = useState('');
  const [checks, setChecks] = useState([false, false, false, false]);
  const [gained, setGained] = useState<number | null>(null);

  const suitName = (id: string) => l(SUITS.find((s) => s.id === id)!.name);
  const suitElement = (id: string) => l(SUITS.find((s) => s.id === id)!.element);
  const links = cardLinks(pair[0], pair[1]).map((x) => {
    if (x.key === 'combo.sameSuit') return t(x.key, { suit: suitName(x.vars!.suit) });
    if (x.key === 'combo.elements') return t(x.key, { a: suitElement(x.vars!.a), b: suitElement(x.vars!.b) });
    return t(x.key);
  });
  const ready = text.trim().length >= 40 && checks.every(Boolean);
  const reset = () => { setSeed((s) => s + 1); setText(''); setChecks([false, false, false, false]); setGained(null); };
  const items: ('combo.c1' | 'combo.c2' | 'combo.c3' | 'combo.c4')[] = ['combo.c1', 'combo.c2', 'combo.c3', 'combo.c4'];

  return (
    <>
      <GameHeader title={t('games.combination')} />
      <section className="card gold">
        <span className="eyebrow">{t('combo.question')}</span>
        <p className="display h3" style={{ fontSize: 21 }}>{l(question)}</p>
      </section>
      <div className="grid2">
        {pair.map((c) => (
          <a key={c.id} href={href.card(c.id)} className="link-card stack" style={{ gap: 6, alignItems: 'center' }}>
            <img className="tarot" src={cardImage(c.id)} alt={l(c.name)} style={{ maxWidth: 150 }} />
            <span className="small" style={{ fontWeight: 700, textAlign: 'center' }}>{l(c.name)}</span>
          </a>
        ))}
      </div>
      <section className="card">
        <span className="eyebrow" style={{ color: 'var(--teal)' }}>{t('combo.links')}</span>
        <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--text-2)' }}>
          {links.map((x) => <li key={x}>{x}</li>)}
          <li>{t('combo.lookFor')}</li>
        </ul>
      </section>
      <label className="stack" style={{ gap: 8 }} htmlFor="combo-text">
        <span className="display h3">{t('combo.yourReading')}</span>
        <textarea
          id="combo-text"
          rows={5}
          value={text}
          disabled={gained !== null}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('combo.placeholder')}
          style={{ borderRadius: 14, border: '1px solid var(--line-strong)', background: 'var(--surface)', padding: '12px 14px', lineHeight: 1.5, resize: 'vertical' }}
        />
      </label>
      <fieldset className="card" style={{ margin: 0 }}>
        <legend className="eyebrow" style={{ padding: '0 6px' }}>{t('combo.checklist')}</legend>
        {items.map((k, i) => (
          <label key={k} className="row" style={{ gap: 10, minHeight: 36 }}>
            <input
              id={`combo-check-${i}`}
              type="checkbox"
              checked={checks[i]}
              disabled={gained !== null}
              onChange={() => setChecks((c) => c.map((v, j) => (j === i ? !v : v)))}
              style={{ width: 20, height: 20, accentColor: 'var(--gold)' }}
            />
            <span className="p" style={{ fontSize: 14 }}>{t(k)}</span>
          </label>
        ))}
      </fieldset>
      {gained === null ? (
        <button type="button" className="btn" disabled={!ready} onClick={() => setGained(record({ type: 'practiceCombination' }))}>
          {t('combo.done')} · +{XP.combination} XP
        </button>
      ) : (
        <section className="card gold fade" role="status" style={{ alignItems: 'center', textAlign: 'center' }}>
          <span className="display h2">{t('combo.saved')}</span>
          <span className="display h2" style={{ color: 'var(--gold)' }}>+{gained} XP</span>
          <button type="button" className="btn" onClick={reset}>{t('combo.newPair')}</button>
        </section>
      )}
      <p className="small muted" style={{ margin: 0 }}>{t('combo.note')}</p>
    </>
  );
}

const TIME_LIMIT = 60;

function timedRound(): { answer: Card; options: Card[] } {
  const answer = sample(CARDS, 1)[0];
  return { answer, options: shuffle([answer, ...sample(CARDS.filter((c) => c.id !== answer.id), 3)]) };
}

export function TimedGame() {
  const { t, l } = useI18n();
  const { progress, record } = useProgress();
  const [phase, setPhase] = useState<'ready' | 'playing' | 'done'>('ready');
  const [left, setLeft] = useState(TIME_LIMIT);
  const [round, setRound] = useState(timedRound);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [flash, setFlash] = useState<'right' | 'wrong' | null>(null);
  const [gained, setGained] = useState(0);

  useEffect(() => {
    if (phase !== 'playing') return;
    if (left <= 0) {
      setPhase('done');
      setGained(record({ type: 'finishGame', game: 'timed', correct: score.correct, total: Math.max(score.total, 1), perfect: false }));
      return;
    }
    const id = window.setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [phase, left, record, score]);

  const start = () => { setScore({ correct: 0, total: 0 }); setLeft(TIME_LIMIT); setRound(timedRound()); setPhase('playing'); };
  const pick = (c: Card) => {
    const ok = c.id === round.answer.id;
    setScore((s) => ({ correct: s.correct + (ok ? 1 : 0), total: s.total + 1 }));
    setFlash(ok ? 'right' : 'wrong');
    window.setTimeout(() => setFlash(null), 250);
    setRound(timedRound());
  };

  return (
    <>
      <GameHeader title={t('games.timed')} sub={t('timed.best', { n: progress.bestTimed })} />
      {phase === 'ready' && (
        <section className="card gold" style={{ alignItems: 'flex-start' }}>
          <p className="p">{t('games.timedDesc')}</p>
          <button type="button" className="btn" onClick={start}>{t('timed.start')}</button>
        </section>
      )}
      {phase === 'playing' && (
        <>
          <div className="row between" aria-live="off">
            <span className="display h2" style={{ color: left <= 10 ? 'var(--rose)' : 'var(--gold)', fontVariantNumeric: 'tabular-nums' }}>{t('timed.left', { s: left })}</span>
            <span className="display h3" style={{ fontVariantNumeric: 'tabular-nums' }}>{t('timed.score', { n: score.correct })}</span>
          </div>
          <div className="bar"><span style={{ width: `${(left / TIME_LIMIT) * 100}%` }} /></div>
          <img
            className="tarot"
            src={cardImage(round.answer.id)}
            alt={t('games.whichCard')}
            style={{ width: 150, alignSelf: 'center', outline: flash ? `3px solid ${flash === 'right' ? 'var(--teal)' : 'var(--rose)'}` : 'none', outlineOffset: 4 }}
          />
          <div className="grid2" style={{ gap: 8 }}>
            {round.options.map((o) => (
              <button key={o.id} type="button" className="option" style={{ textAlign: 'center', fontSize: 14 }} onClick={() => pick(o)}>{l(o.name)}</button>
            ))}
          </div>
        </>
      )}
      {phase === 'done' && (
        <section className="card gold fade" role="status" style={{ alignItems: 'center', textAlign: 'center', padding: 28 }}>
          <span className="eyebrow">{t('timed.done')}</span>
          <span className="display h1">{t('timed.score', { n: score.correct })}</span>
          <span className="display h2" style={{ color: 'var(--gold)' }}>+{gained} XP</span>
          <div className="row">
            <button type="button" className="btn" onClick={start}>{t('common.playAgain')}</button>
            <a href={href.games()} className="btn ghost">{t('common.back')}</a>
          </div>
        </section>
      )}
    </>
  );
}
