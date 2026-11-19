import { useState } from 'react';
import { CARDS, cardImage, getCard, majorId } from '../content/cards';
import { CASES, getCase, type ConsultationCase } from '../content/cases';
import type { Card, L10n } from '../content/types';
import { WORLDS } from '../content/worlds';
import { IconBack, IconCheck } from '../components/Icons';
import { AskForFeedback } from '../components/Evaluation';
import { useI18n } from '../i18n/I18n';
import type { UiKey } from '../i18n/ui';
import { readJSON, writeJSON } from '../lib/storage';
import { sample } from '../lib/random';
import { XP } from '../progress/model';
import { useProgress } from '../progress/Progress';
import { href } from '../router';

const POSITIONS: Record<number, L10n[]> = {
  1: [{ es: 'Carta del día', en: 'Card of the day' }],
  2: [{ es: 'Situación', en: 'Situation' }, { es: 'Consejo', en: 'Advice' }],
  3: [{ es: 'Situación', en: 'Situation' }, { es: 'Obstáculo', en: 'Obstacle' }, { es: 'Consejo', en: 'Advice' }],
};
const LEVEL_KEY: Record<ConsultationCase['level'], UiKey> = { beginner: 'lab.beginner', intermediate: 'lab.intermediate', advanced: 'lab.advanced' };

function FaceDown() {
  return (
    <div style={{ width: '100%', aspectRatio: '300 / 520', borderRadius: 6, background: 'var(--surface-2)', border: '1px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.6 6.5L21 9.3l-5 4.4 1.5 6.8L12 17l-5.5 3.5L8 13.7 3 9.3l6.4-.8z" fill="none" stroke="#d4af6a" strokeWidth="1" /></svg>
    </div>
  );
}

function CardFace({ card, reversed }: { card: Card; reversed?: boolean }) {
  const { l, t } = useI18n();
  return (
    <img className="tarot" src={cardImage(card.id)} alt={`${l(card.name)}${reversed ? `, ${t('card.reversed').toLowerCase()}` : ''}`} style={{ transform: reversed ? 'rotate(180deg)' : undefined }} />
  );
}

export function Lab() {
  const { t, l } = useI18n();
  const { progress, record } = useProgress();
  const [size, setSize] = useState(3);
  const [rev, setRev] = useState<boolean>(() => readJSON('arkhe.labReversed', false));
  const [drawn, setDrawn] = useState<{ card: Card; reversed: boolean }[] | null>(null);
  const positions = POSITIONS[size];
  const advancedOpen = progress.casesDone.length >= 2;

  const draw = () => {
    setDrawn(sample(CARDS, size).map((card) => ({ card, reversed: rev && Math.random() < 0.5 })));
    record({ type: 'drawSpread' });
  };

  return (
    <>
      <header className="row">
        <img src={cardImage(majorId(10))} alt="" style={{ width: 40, borderRadius: 4 }} />
        <div className="stack" style={{ gap: 2 }}>
          <span className="eyebrow">{l(WORLDS[10])}</span>
          <h1 className="display h1">{t('lab.title')}</h1>
        </div>
      </header>
      <p className="p muted">{t('lab.subtitle')}</p>

      <div className="row" role="group" aria-label={t('lab.spreadType')} style={{ gap: 8 }}>
        {[1, 2, 3].map((k) => (
          <button key={k} type="button" className="chip" aria-pressed={size === k} onClick={() => { setSize(k); setDrawn(null); }}>
            {k === 1 ? t('lab.one') : t('lab.many', { n: k })}
          </button>
        ))}
      </div>
      <label className="card" style={{ padding: '10px 14px', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} htmlFor="lab-rev">
        <span className="stack" style={{ gap: 0 }}>
          <strong style={{ fontSize: 14 }}>{t('lab.reversed')}</strong>
          <span className="small muted">{t('lab.reversedHint')}</span>
        </span>
        <input id="lab-rev" type="checkbox" checked={rev} onChange={() => { setRev(!rev); writeJSON('arkhe.labReversed', !rev); }} style={{ width: 22, height: 22, accentColor: 'var(--gold)' }} />
      </label>

      <section className="card" aria-live="polite" style={{ alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${size}, minmax(0, 104px))`, gap: 10, justifyContent: 'center', width: '100%' }}>
          {positions.map((p, i) => {
            const d = drawn?.[i];
            return (
              <div key={i} className="stack" style={{ gap: 6, alignItems: 'center', textAlign: 'center' }}>
                <span className="eyebrow" style={{ fontSize: 10 }}>{l(p)}</span>
                {d ? <a href={href.card(d.card.id)} style={{ width: '100%' }}><CardFace card={d.card} reversed={d.reversed} /></a> : <FaceDown />}
                <span className="small" style={{ fontWeight: 700 }}>{d ? `${l(d.card.name)}${d.reversed ? ` · ${t('card.reversed')}` : ''}` : t('lab.hidden')}</span>
              </div>
            );
          })}
        </div>
        <button type="button" className="btn" onClick={draw}>{drawn ? t('lab.redraw') : t('lab.draw')}</button>
      </section>

      <section className="stack">
        <h2 className="display h2" style={{ fontSize: 22 }}>{t('lab.cases')}</h2>
        <p className="p muted small">{t('lab.casesHint')}</p>
        {CASES.map((c) => {
          const locked = c.level === 'advanced' && !advancedOpen;
          const done = progress.casesDone.includes(c.id);
          const body = (
            <>
              <div className="row between">
                <span className="display h3">{c.client}</span>
                <span className={`tag ${c.level === 'advanced' ? 'history' : c.level === 'intermediate' ? 'waite' : 'school'}`}>{t(LEVEL_KEY[c.level])}</span>
              </div>
              <span className="small muted">{l(c.question)}</span>
              {done && <span className="small row" style={{ gap: 4, color: 'var(--teal)', fontWeight: 700 }}><IconCheck width={14} height={14} />{t('lab.solved')}</span>}
              {locked && <span className="small muted">{t('lab.advancedLocked')}</span>}
            </>
          );
          return locked ? (
            <div key={c.id} className="card" style={{ opacity: 0.6 }}>{body}</div>
          ) : (
            <a key={c.id} href={href.caseStudy(c.id)} className="card link-card">{body}</a>
          );
        })}
      </section>
    </>
  );
}

export function CaseView({ id }: { id: string }) {
  const { t, l } = useI18n();
  const { progress, record } = useProgress();
  const c = getCase(id);
  const [asked, setAsked] = useState<number[]>([]);
  const [text, setText] = useState('');
  const [checks, setChecks] = useState([false, false, false, false]);
  const [gained, setGained] = useState<number | null>(null);

  if (!c || (c.level === 'advanced' && progress.casesDone.length < 2)) {
    window.location.hash = href.lab();
    return null;
  }
  const ready = text.trim().length >= 60 && checks.every(Boolean);
  const items: UiKey[] = ['case.c1', 'case.c2', 'case.c3', 'case.c4'];

  return (
    <>
      <header className="row">
        <a href={href.lab()} className="icon-btn" aria-label={t('common.back')}><IconBack /></a>
        <div className="stack" style={{ gap: 0 }}>
          <span className="eyebrow">{t(LEVEL_KEY[c.level])}</span>
          <h1 className="display h2">{c.client}</h1>
        </div>
      </header>
      <p className="small muted" style={{ margin: 0 }}>{t('case.fictional')}</p>
      <section className="card">
        <p className="p">{l(c.story)}</p>
        <span className="eyebrow">{t('case.question', { name: c.client })}</span>
        <p className="display h3" style={{ fontSize: 20 }}>«{l(c.question)}»</p>
      </section>

      <section className="stack">
        <h2 className="display h3">{t('case.ask')}</h2>
        {c.dialogue.map((d, i) => (
          <div key={i} className="stack" style={{ gap: 6 }}>
            <button type="button" className="option" aria-expanded={asked.includes(i)} onClick={() => setAsked((a) => (a.includes(i) ? a : [...a, i]))}>
              {l(d.ask)}
            </button>
            {asked.includes(i) && (
              <p className="feedback fade" style={{ borderColor: 'var(--rose)' }}><strong>{c.client}:</strong> {l(d.answer)}</p>
            )}
          </div>
        ))}
      </section>

      <section className="stack">
        <h2 className="display h3">{t('case.spread')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${c.cards.length}, minmax(0, 1fr))`, gap: 10 }}>
          {c.cards.map((cc) => {
            const card = getCard(cc.card)!;
            return (
              <a key={cc.card} href={href.card(card.id)} className="link-card stack" style={{ gap: 6, alignItems: 'center', textAlign: 'center' }}>
                <span className="eyebrow" style={{ fontSize: 10 }}>{l(cc.position)}</span>
                <CardFace card={card} reversed={cc.reversed} />
                <span className="small" style={{ fontWeight: 700 }}>{l(card.name)}{cc.reversed ? ` · ${t('card.reversed')}` : ''}</span>
              </a>
            );
          })}
        </div>
        {c.note && <p className="small muted" style={{ margin: 0 }}>{l(c.note)}</p>}
      </section>

      <label className="stack" style={{ gap: 8 }} htmlFor="case-text">
        <span className="display h3">{t('case.reading')}</span>
        <textarea
          id="case-text" rows={6} value={text} disabled={gained !== null}
          onChange={(e) => setText(e.target.value)} placeholder={t('case.placeholder')}
          style={{ borderRadius: 14, border: '1px solid var(--line-strong)', background: 'var(--surface)', padding: '12px 14px', lineHeight: 1.5, resize: 'vertical' }}
        />
      </label>
      <fieldset className="card" style={{ margin: 0 }}>
        <legend className="eyebrow" style={{ padding: '0 6px' }}>{t('combo.checklist')}</legend>
        {items.map((k, i) => (
          <label key={k} className="row" style={{ gap: 10, minHeight: 36 }}>
            <input
              id={`case-check-${i}`} type="checkbox" checked={checks[i]} disabled={gained !== null}
              onChange={() => setChecks((v) => v.map((x, j) => (j === i ? !x : x)))}
              style={{ width: 20, height: 20, accentColor: 'var(--gold)' }}
            />
            <span className="p" style={{ fontSize: 14 }}>{t(k)}</span>
          </label>
        ))}
      </fieldset>
      {gained === null ? (
        <button type="button" className="btn" disabled={!ready} onClick={() => setGained(record({ type: 'completeCase', caseId: c.id }))}>
          {t('case.finish')}{!progress.casesDone.includes(c.id) ? ` · +${XP.case} XP` : ''}
        </button>
      ) : (
        <section className="card gold fade" role="status" style={{ alignItems: 'center', textAlign: 'center' }}>
          <span className="display h2">{t('case.saved')}</span>
          {gained > 0 && <span className="display h2" style={{ color: 'var(--gold)' }}>+{gained} XP</span>}
          <a href={href.lab()} className="btn">{t('common.continue')}</a>
        </section>
      )}
      <AskForFeedback disabled={text.trim().length < 60} payload={() => ({ context: { caseId: c.id }, reading: { kind: 'case', text } })} />
      <a href={href.tutor()} className="small">{t('tutor.ask')}</a>
    </>
  );
}
