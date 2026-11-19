import { useEffect, useState } from 'react';
import { CARDS, cardImage, getCard } from '../content/cards';
import { SUITS } from '../content/minors';
import type { SuitId } from '../content/types';
import { IconBack, IconCheck, IconNext, IconSearch, IconZoomIn, IconZoomOut } from '../components/Icons';
import { useI18n } from '../i18n/I18n';
import { readJSON, writeJSON } from '../lib/storage';
import { useProgress } from '../progress/Progress';
import { href } from '../router';

function normalize(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

type Filter = 'all' | 'major' | SuitId;
const FILTER_KEY = 'arkhe.libraryFilter';

export function Library() {
  const { t, l } = useI18n();
  const { progress } = useProgress();
  const [query, setQuery] = useState('');
  const [filter, setFilterState] = useState<Filter>(() => readJSON<Filter>(FILTER_KEY, 'all'));
  const setFilter = (f: Filter) => { setFilterState(f); writeJSON(FILTER_KEY, f); };

  const q = normalize(query.trim());
  const list = CARDS.filter((c) => {
    const okFilter = filter === 'all' || (filter === 'major' ? c.arcana === 'major' : c.suit === filter);
    const okQuery = !q || normalize(l(c.name)).includes(q) || (c.arcana === 'major' && c.label.toLowerCase() === q);
    return okFilter && okQuery;
  });

  const filters: { id: Filter; label: string }[] = [
    { id: 'all', label: t('library.filterAll') },
    { id: 'major', label: t('library.filterMajors') },
    ...SUITS.map((s) => ({ id: s.id as Filter, label: l(s.name) })),
  ];

  return (
    <>
      <header className="row between">
        <h1 className="display h1">{t('library.title')}</h1>
        <span className="small muted" style={{ fontWeight: 700 }}>
          {list.length === 1 ? t('library.countOne') : t('library.count', { n: list.length })}
        </span>
      </header>
      <label className="search">
        <IconSearch style={{ color: 'var(--gold)' }} width={18} height={18} />
        <span className="sr-only">{t('library.search')}</span>
        <input id="library-search" type="search" value={query} placeholder={t('library.search')} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <div className="row" role="group" aria-label={t('library.title')} style={{ overflowX: 'auto', gap: 8, paddingBottom: 2 }}>
        {filters.map((f) => (
          <button key={f.id} type="button" className="chip" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
            {f.label}
          </button>
        ))}
      </div>
      <div className="grid3">
        {list.map((c) => {
          const studied = progress.cardsViewed.includes(c.id);
          return (
            <a key={c.id} href={href.card(c.id)} className="link-card stack" style={{ gap: 6, position: 'relative' }}>
              <img className="tarot" src={cardImage(c.id)} alt={l(c.name)} loading="lazy" />
              {studied && (
                <span title={t('library.studied')} style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: '50%', background: 'var(--teal)', color: 'var(--on-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconCheck width={14} height={14} />
                  <span className="sr-only">{t('library.studied')}</span>
                </span>
              )}
              <span className="small" style={{ textAlign: 'center', fontWeight: 700, color: 'var(--text-2)', lineHeight: 1.25 }}>
                {c.arcana === 'major' ? `${c.label} · ` : ''}{l(c.name)}
              </span>
            </a>
          );
        })}
      </div>
      {list.length === 0 && <p className="p muted" style={{ textAlign: 'center' }}>{t('library.empty')}</p>}
      <p className="small muted" style={{ textAlign: 'center', margin: 0 }}>{t('library.credit')}</p>
    </>
  );
}

type Tab = 'observe' | 'meanings' | 'correspondences' | 'history';

export function CardDetail({ id }: { id: string }) {
  const { t, l } = useI18n();
  const { record } = useProgress();
  const card = getCard(id)!;
  const [tab, setTab] = useState<Tab>('observe');
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    setTab('observe');
    setZoom(false);
    record({ type: 'viewCard', card: id });
  }, [id, record]);

  const prev = card.order > 0 ? CARDS[card.order - 1] : undefined;
  const next = card.order < CARDS.length - 1 ? CARDS[card.order + 1] : undefined;
  const tabs: { id: Tab; label: string }[] = [
    { id: 'observe', label: t('card.tabObserve') },
    { id: 'meanings', label: t('card.tabMeanings') },
    { id: 'correspondences', label: t('card.tabCorrespondences') },
    { id: 'history', label: t('card.tabHistory') },
  ];
  const neighbour = (c: typeof prev) => (c ? `${c.arcana === 'major' ? `${c.label} · ` : ''}${l(c.name)}` : '');

  return (
    <>
      <header className="row between">
        <a href={href.library()} className="icon-btn" aria-label={t('common.back')}><IconBack /></a>
        <span className="eyebrow" style={{ color: 'var(--muted)' }}>
          {card.arcana === 'major' ? `${t('card.arcanaMajor')} · ${card.label}` : t('card.arcanaMinor')}
        </span>
        <a href={href.tutor(card.id)} className="icon-btn" aria-label={t('tutor.askAboutCard')} style={{ background: 'var(--gold)', borderColor: 'var(--gold)', color: 'var(--on-gold)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" /></svg>
        </a>
      </header>

      <div className="card" style={{ position: 'relative', alignItems: zoom ? 'stretch' : 'center', padding: 18, overflow: 'hidden' }}>
        <div style={zoom ? { height: 360, overflow: 'auto' } : undefined}>
          <img
            src={cardImage(card.id, true)}
            alt={l(card.name)}
            style={zoom ? { width: 520, maxWidth: 'none', display: 'block', borderRadius: 6 } : { width: 200, display: 'block', borderRadius: 6, boxShadow: '0 16px 40px rgba(0,0,0,.5), 0 0 0 1px rgba(212,175,106,.5)' }}
          />
        </div>
        <button
          type="button"
          className="icon-btn"
          onClick={() => setZoom((z) => !z)}
          aria-pressed={zoom}
          aria-label={zoom ? t('card.zoomOut') : t('card.zoomIn')}
          style={{ position: 'absolute', right: 12, bottom: 12, background: 'var(--bg)', borderColor: 'var(--gold)', color: 'var(--gold)' }}
        >
          {zoom ? <IconZoomOut width={20} height={20} /> : <IconZoomIn width={20} height={20} />}
        </button>
      </div>

      <div style={{ textAlign: 'center' }}>
        <h1 className="display h1" style={{ fontSize: 34, textWrap: 'balance' }}>{l(card.name)}</h1>
        <span className="small muted">{t('card.imageCredit')}</span>
      </div>

      <div role="tablist" className="tabs" aria-label={l(card.name)}>
        {tabs.map((x) => (
          <button key={x.id} type="button" role="tab" aria-selected={tab === x.id} onClick={() => setTab(x.id)}>
            {x.label}
          </button>
        ))}
      </div>

      <section role="tabpanel" className="stack fade" key={tab}>
        {tab === 'observe' && <p className="p" style={{ fontSize: 16, lineHeight: 1.65 }}>{l(card.visual)}</p>}

        {tab === 'meanings' && (
          <>
            <div className="card">
              <span className="tag waite">{t('card.waite')} · {t('card.upright')}</span>
              <p className="p">{l(card.waite)}</p>
            </div>
            <div className="card">
              <span className="tag waite">{t('card.waite')} · {t('card.reversed')}</span>
              <p className="p">{card.waiteReversed ? l(card.waiteReversed) : t('card.noReversed')}</p>
            </div>
            <p className="small muted" style={{ margin: 0 }}>{t('card.waiteNote')}</p>
          </>
        )}

        {tab === 'correspondences' && (
          <>
            {card.correspondences.map((block, i) => (
              <div key={i} className="card">
                <span className="tag school">{block.school}</span>
                {block.rows.map((r) => (
                  <div key={r.label.en} className="row between" style={{ alignItems: 'baseline' }}>
                    <span className="muted">{l(r.label)}</span>
                    <strong style={{ textAlign: 'right' }}>{l(r.value)}</strong>
                  </div>
                ))}
                {block.note && <p className="p" style={{ fontSize: 14 }}>{l(block.note)}</p>}
              </div>
            ))}
            <p className="small muted" style={{ margin: 0 }}>{t('card.schoolNote')}</p>
          </>
        )}

        {tab === 'history' && (
          <>
            <div className="card">
              <span className="tag history">{t('card.marseille')}</span>
              <span className="display h3">{card.marseille}</span>
              {card.note && <p className="p">{l(card.note)}</p>}
            </div>
            <a href={href.sources()} className="small">{t('learn.sourcesLink')}</a>
          </>
        )}
      </section>

      <nav className="grid2" aria-label={l(card.name)}>
        {prev ? (
          <a href={href.card(prev.id)} className="card link-card" style={{ flexDirection: 'row', alignItems: 'center', padding: 8, gap: 8 }} aria-label={`${t('card.prev')}: ${l(prev.name)}`}>
            <IconBack width={18} height={18} style={{ flexShrink: 0 }} />
            <img src={cardImage(prev.id)} alt="" style={{ width: 28, borderRadius: 3 }} />
            <span className="small" style={{ fontWeight: 700, minWidth: 0 }}>{neighbour(prev)}</span>
          </a>
        ) : <span />}
        {next ? (
          <a href={href.card(next.id)} className="card link-card" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', padding: 8, gap: 8, textAlign: 'right' }} aria-label={`${t('card.nextCard')}: ${l(next.name)}`}>
            <span className="small" style={{ fontWeight: 700, minWidth: 0 }}>{neighbour(next)}</span>
            <img src={cardImage(next.id)} alt="" style={{ width: 28, borderRadius: 3 }} />
            <IconNext width={18} height={18} style={{ flexShrink: 0 }} />
          </a>
        ) : <span />}
      </nav>
    </>
  );
}
