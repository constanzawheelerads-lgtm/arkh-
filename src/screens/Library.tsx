import { useEffect, useState } from 'react';
import { cardImage, getMajor, MAJORS } from '../content/majors';
import { IconBack, IconCheck, IconNext, IconSearch, IconZoomIn, IconZoomOut } from '../components/Icons';
import { useI18n } from '../i18n/I18n';
import { useProgress } from '../progress/Progress';
import { href } from '../router';

function normalize(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export function Library() {
  const { t, l } = useI18n();
  const { progress } = useProgress();
  const [query, setQuery] = useState('');
  const q = normalize(query.trim());
  const list = MAJORS.filter((m) => !q || normalize(l(m.name)).includes(q) || m.roman.toLowerCase() === q || String(m.n) === q);

  return (
    <>
      <header className="row between">
        <h1 className="display h1">{t('library.title')}</h1>
        <span className="small muted" style={{ fontWeight: 700 }}>{list.length === 1 ? t('library.countOne') : t('library.count', { n: list.length })}</span>
      </header>
      <label className="search">
        <IconSearch style={{ color: 'var(--gold)' }} width={18} height={18} />
        <span className="sr-only">{t('library.search')}</span>
        <input type="search" value={query} placeholder={t('library.search')} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <div className="grid3">
        {list.map((m) => {
          const studied = progress.cardsViewed.includes(m.n);
          return (
            <a key={m.n} href={href.card(m.n)} className="link-card stack" style={{ gap: 6, position: 'relative' }}>
              <img className="tarot" src={cardImage(m.n)} alt={l(m.name)} loading="lazy" />
              {studied && (
                <span title={t('library.studied')} style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: '50%', background: 'var(--teal)', color: 'var(--on-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconCheck width={14} height={14} />
                  <span className="sr-only">{t('library.studied')}</span>
                </span>
              )}
              <span className="small" style={{ textAlign: 'center', fontWeight: 700, color: 'var(--text-2)' }}>{m.roman} · {l(m.name)}</span>
            </a>
          );
        })}
      </div>
      {list.length === 0 && <p className="p muted" style={{ textAlign: 'center' }}>{t('library.empty')}</p>}
      <p className="small muted" style={{ textAlign: 'center', margin: 0 }}>{t('library.minorsSoon')}</p>
      <p className="small muted" style={{ textAlign: 'center', margin: 0 }}>{t('library.credit')}</p>
    </>
  );
}

type Tab = 'observe' | 'meanings' | 'correspondences' | 'history';

export function CardDetail({ n }: { n: number }) {
  const { t, l } = useI18n();
  const { record } = useProgress();
  const card = getMajor(n)!;
  const [tab, setTab] = useState<Tab>('observe');
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    setTab('observe');
    setZoom(false);
    record({ type: 'viewCard', card: n });
  }, [n, record]);

  const prev = n > 0 ? getMajor(n - 1) : undefined;
  const next = n < 21 ? getMajor(n + 1) : undefined;
  const tabs: { id: Tab; label: string }[] = [
    { id: 'observe', label: t('card.tabObserve') },
    { id: 'meanings', label: t('card.tabMeanings') },
    { id: 'correspondences', label: t('card.tabCorrespondences') },
    { id: 'history', label: t('card.tabHistory') },
  ];

  return (
    <>
      <header className="row between">
        <a href={href.library()} className="icon-btn" aria-label={t('common.back')}><IconBack /></a>
        <span className="eyebrow" style={{ color: 'var(--muted)' }}>{card.roman}</span>
        <span style={{ width: 44 }} />
      </header>

      <div className="card" style={{ position: 'relative', alignItems: zoom ? 'stretch' : 'center', padding: 18, overflow: 'hidden' }}>
        <div style={zoom ? { height: 360, overflow: 'auto' } : undefined}>
          <img
            src={cardImage(n, true)}
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
        <h1 className="display h1" style={{ fontSize: 34 }}>{l(card.name)}</h1>
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
              <p className="p">{l(card.waiteReversed)}</p>
            </div>
            <p className="small muted" style={{ margin: 0 }}>{t('card.waiteNote')}</p>
          </>
        )}

        {tab === 'correspondences' && (
          <div className="card">
            <span className="tag school">{t('card.gdLabel')}</span>
            <div className="row between"><span className="muted">{t('card.gdAttribution')}</span><strong>{l(card.goldenDawn.attribution)}</strong></div>
            <div className="row between"><span className="muted">{t('card.gdLetter')}</span><strong>{card.goldenDawn.hebrewLetter}</strong></div>
            <p className="small muted" style={{ margin: 0 }}>{t('card.gdNote')}</p>
          </div>
        )}

        {tab === 'history' && (
          <>
            <div className="card">
              <span className="tag history">{t('card.marseille')}</span>
              <span className="display h3">{card.marseille}</span>
              {card.note && <p className="p">{l(card.note)}</p>}
            </div>
            <p className="small muted" style={{ margin: 0 }}>Waite, A. E. (1910). The Pictorial Key to the Tarot. · Dummett, M. (1980). The Game of Tarot.</p>
          </>
        )}
      </section>

      <nav className="grid2" aria-label={l(card.name)}>
        {prev ? (
          <a href={href.card(prev.n)} className="card link-card" style={{ flexDirection: 'row', alignItems: 'center', padding: 8, gap: 8 }} aria-label={`${t('card.prev')}: ${l(prev.name)}`}>
            <IconBack width={18} height={18} />
            <img src={cardImage(prev.n)} alt="" style={{ width: 28, borderRadius: 3 }} />
            <span className="small" style={{ fontWeight: 700 }}>{prev.roman} · {l(prev.name)}</span>
          </a>
        ) : <span />}
        {next ? (
          <a href={href.card(next.n)} className="card link-card" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', padding: 8, gap: 8, textAlign: 'right' }} aria-label={`${t('card.nextCard')}: ${l(next.name)}`}>
            <span className="small" style={{ fontWeight: 700 }}>{next.roman} · {l(next.name)}</span>
            <img src={cardImage(next.n)} alt="" style={{ width: 28, borderRadius: 3 }} />
            <IconNext width={18} height={18} />
          </a>
        ) : <span />}
      </nav>
    </>
  );
}
