import { useEffect, useRef, useState, type FormEvent } from 'react';
import { cardImage, getCard } from '../content/cards';
import { CASES, getCase } from '../content/cases';
import type { Lang } from '../content/types';
import { IconBack } from '../components/Icons';
import { MysteriumEmblem } from '../components/Mysterium';
import { errorKey } from '../components/Evaluation';
import { useI18n } from '../i18n/I18n';
import type { UiKey } from '../i18n/ui';
import { askMysterium, IS_PREVIEW_BUILD, isMysteriumConfigured, type TutorCitation, type TutorMode } from '../lib/mysterium';
import { readJSON, writeJSON } from '../lib/storage';
import { MYSTERIUM_ENABLED } from '../lib/supabase';
import { href } from '../router';

type ChatMode = Exclude<TutorMode, 'evaluate'>;
interface Turn { role: 'user' | 'assistant'; content: string; citations?: TutorCitation[] }

const CONSENT_KEY = 'arkhe.tutorConsent';
const LIMIT = 15;
const MODES: { id: ChatMode; key: UiKey; intro: UiKey }[] = [
  { id: 'teacher', key: 'tutor.modeTeacher', intro: 'tutor.introTeacher' },
  { id: 'socratic', key: 'tutor.modeSocratic', intro: 'tutor.introSocratic' },
  { id: 'client', key: 'tutor.modeClient', intro: 'tutor.introClient' },
];

function citationHref(docId: string): string {
  const [kind, id] = docId.split(':');
  if (kind === 'card') return href.card(id);
  if (kind === 'lesson') return href.lesson(id);
  if (kind === 'case') return href.caseStudy(id);
  return href.sources();
}

function TutorChat({ cardId }: { cardId?: string }) {
  const { t, l, lang } = useI18n();
  const [consent, setConsent] = useState<boolean>(() => readJSON(CONSENT_KEY, false));
  const [mode, setMode] = useState<ChatMode>('teacher');
  const [chats, setChats] = useState<Record<ChatMode, Turn[]>>({ teacher: [], socratic: [], client: [] });
  const [card, setCard] = useState<string | undefined>(cardId);
  const [caseId, setCaseId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<UiKey | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCard(cardId);
  }, [cardId]);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [chats, loading]);

  const turns = chats[mode];
  const cardObj = card ? getCard(card) : undefined;
  const caseObj = caseId ? getCase(caseId) : undefined;
  const configured = isMysteriumConfigured();

  const send = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    const history: Turn[] = [...turns, { role: 'user', content: text }];
    setChats((c) => ({ ...c, [mode]: history }));
    setInput('');
    setError(null);
    setLoading(true);
    const result = await askMysterium({
      mode,
      lang: lang as Lang,
      messages: history.slice(-20).map(({ role, content }) => ({ role, content })),
      context: mode === 'client' ? { caseId: caseId! } : { cardIds: card ? [card] : [] },
    });
    setLoading(false);
    if (result.ok && result.kind === 'chat') {
      setChats((c) => ({ ...c, [mode]: [...history, { role: 'assistant', content: result.text, citations: result.citations }] }));
      setRemaining(result.remaining);
    } else if (!result.ok) {
      // Remove the unanswered question so the conversation stays valid.
      setChats((c) => ({ ...c, [mode]: turns }));
      setInput(text);
      setError(errorKey(result));
      if (result.remaining !== undefined) setRemaining(result.remaining);
    }
  };

  const who = (turn: Turn) => (turn.role === 'user' ? t('tutor.you') : mode === 'client' && caseObj ? caseObj.client : 'Mysterium');

  return (
    <>
      <header className="row">
        <a href={cardId ? href.card(cardId) : href.home()} className="icon-btn" aria-label={t('common.back')}><IconBack /></a>
        <MysteriumEmblem size={48} />
        <div className="stack" style={{ gap: 0 }}>
          <h1 className="display h2">{t('tutor.title')}</h1>
          <span className="small muted">{t('tutor.subtitle')}</span>
        </div>
      </header>

      {!configured && <div className="card" role="status" style={{ borderColor: 'var(--rose)' }}><p className="p">{t(IS_PREVIEW_BUILD ? 'tutor.previewOnly' : 'tutor.notConfigured')}</p></div>}

      {!consent ? (
        <section className="card gold">
          <span className="eyebrow">{t('tutor.consentTitle')}</span>
          <p className="p">{t('tutor.consentText')}</p>
          <button type="button" className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => { setConsent(true); writeJSON(CONSENT_KEY, true); }}>
            {t('tutor.consentAccept')}
          </button>
        </section>
      ) : (
        <>
          <div role="tablist" aria-label={t('tutor.title')} className="row" style={{ gap: 6 }}>
            {MODES.map((m) => (
              <button key={m.id} type="button" role="tab" className="chip" aria-selected={mode === m.id} onClick={() => { setMode(m.id); setError(null); setInput(''); }}>
                {t(m.key)}
              </button>
            ))}
          </div>

          <p className="p muted" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 16 }}>{t(MODES.find((m) => m.id === mode)!.intro)}</p>

          {mode !== 'client' && cardObj && (
            <div className="card" style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10 }}>
              <img src={cardImage(cardObj.id)} alt="" style={{ width: 34, borderRadius: 3 }} />
              <span className="small" style={{ flex: 1, fontWeight: 700 }}>{t('tutor.aboutCard', { card: l(cardObj.name) })}</span>
              <button type="button" className="chip" onClick={() => setCard(undefined)}>{t('tutor.clearCard')}</button>
            </div>
          )}

          {mode === 'client' && !caseObj && (
            <section className="stack" aria-label={t('tutor.chooseCase')}>
              {CASES.map((c) => (
                <button key={c.id} type="button" className="option" onClick={() => { setCaseId(c.id); setChats((x) => ({ ...x, client: [] })); }}>
                  <strong>{c.client}</strong> · <span className="muted">{l(c.question)}</span>
                </button>
              ))}
            </section>
          )}

          {mode === 'client' && caseObj && (
            <div className="card" style={{ gap: 6 }}>
              <div className="row between"><strong>{caseObj.client}</strong><button type="button" className="chip" onClick={() => setCaseId(null)}>{t('tutor.chooseCase')}</button></div>
              <span className="small muted">{l(caseObj.story)}</span>
              <a href={href.caseStudy(caseObj.id)} className="small">{t('tutor.writeReading')}</a>
            </div>
          )}

          <section className="stack" aria-live="polite" style={{ gap: 12 }}>
            {turns.map((turn, i) => (
              <div key={i} className="stack" style={{ gap: 4, alignItems: turn.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <span className="small" style={{ fontWeight: 800, color: turn.role === 'user' ? 'var(--muted)' : 'var(--gold)' }}>{who(turn)}</span>
                <div style={{ maxWidth: '88%', whiteSpace: 'pre-wrap', lineHeight: 1.55, fontSize: 15, padding: '12px 14px', borderRadius: turn.role === 'user' ? '16px 16px 4px 16px' : '4px 16px 16px 16px', background: turn.role === 'user' ? 'var(--surface-2)' : 'var(--surface)', border: '1px solid var(--line)' }}>
                  {turn.content}
                </div>
                {turn.citations && turn.citations.length > 0 && (
                  <div className="row" style={{ flexWrap: 'wrap', gap: 6 }} aria-label={t('tutor.sources')}>
                    {turn.citations.map((c) => (
                      <a key={c.docId} href={citationHref(c.docId)} title={c.quote} className="tag school" style={{ textDecoration: 'none' }}>{c.title}</a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && <p className="small muted" role="status">{t('tutor.thinking')}</p>}
            {error && <p role="alert" className="feedback bad">{t(error)}</p>}
            <div ref={endRef} />
          </section>

          {(mode !== 'client' || caseObj) && (
            <form onSubmit={send} className="stack" style={{ gap: 8 }}>
              <div className="row" style={{ gap: 8 }}>
                <label htmlFor="tutor-input" className="sr-only">{t('tutor.placeholder')}</label>
                <textarea
                  id="tutor-input"
                  rows={2}
                  maxLength={2000}
                  value={input}
                  disabled={!configured || loading}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.currentTarget.form?.requestSubmit(); } }}
                  placeholder={mode === 'client' && caseObj ? t('tutor.placeholderClient', { name: caseObj.client }) : t('tutor.placeholder')}
                  style={{ flex: 1, minWidth: 0, borderRadius: 14, border: '1px solid var(--line-strong)', background: 'var(--surface)', padding: '10px 12px', resize: 'none', lineHeight: 1.45 }}
                />
                <button type="submit" className="btn" disabled={!configured || loading || !input.trim()}>{t('tutor.send')}</button>
              </div>
              <div className="row between">
                <span className="small muted">{remaining !== null ? t('tutor.remaining', { n: remaining, m: LIMIT }) : ''}</span>
                {turns.length > 0 && <button type="button" className="chip" onClick={() => setChats((c) => ({ ...c, [mode]: [] }))}>{t('tutor.newChat')}</button>}
              </div>
            </form>
          )}
        </>
      )}
    </>
  );
}

/** Shown while Mysterium is switched off (no AI budget yet). */
function MysteriumSoon({ cardId }: { cardId?: string }) {
  const { t } = useI18n();
  const modes: { title: UiKey; text: UiKey }[] = [
    { title: 'tutor.modeTeacher', text: 'soon.teacher' },
    { title: 'tutor.modeSocratic', text: 'soon.socratic' },
    { title: 'tutor.modeClient', text: 'soon.client' },
  ];
  return (
    <>
      <header className="row">
        <a href={cardId ? href.card(cardId) : href.home()} className="icon-btn" aria-label={t('common.back')}><IconBack /></a>
        <MysteriumEmblem size={48} />
        <div className="stack" style={{ gap: 0 }}>
          <span className="eyebrow">{t('soon.badge')}</span>
          <h1 className="display h2">{t('tutor.title')}</h1>
        </div>
      </header>
      <section className="card gold">
        <p className="display h3" style={{ fontSize: 21 }}>{t('soon.title')}</p>
        <p className="p">{t('soon.text')}</p>
      </section>
      <section className="stack">
        {modes.map((m) => (
          <div key={m.title} className="card">
            <strong className="display h3">{t(m.title)}</strong>
            <p className="p" style={{ fontSize: 14 }}>{t(m.text)}</p>
          </div>
        ))}
      </section>
      <section className="stack">
        <span className="eyebrow" style={{ color: 'var(--teal)' }}>{t('soon.meanwhile')}</span>
        <a href={href.learn()} className="btn ghost">{t('learn.title')}</a>
        <a href={href.game('combination')} className="btn ghost">{t('games.combination')}</a>
        <a href={href.lab()} className="btn ghost">{t('lab.cases')}</a>
      </section>
    </>
  );
}

export function Tutor({ cardId }: { cardId?: string }) {
  return MYSTERIUM_ENABLED ? <TutorChat cardId={cardId} /> : <MysteriumSoon cardId={cardId} />;
}
