import { useState } from 'react';
import { LANGS } from '../content/types';
import { IconStar } from '../components/Icons';
import { useI18n } from '../i18n/I18n';
import { BADGES, levelFromXp, levelTitle, xpForLevel } from '../progress/model';
import { useProgress } from '../progress/Progress';

const LANG_NAMES = { es: 'Español', en: 'English' } as const;

export function Profile() {
  const { t, l, lang, setLang } = useI18n();
  const { progress, reset } = useProgress();
  const [confirming, setConfirming] = useState(false);
  const level = levelFromXp(progress.xp);
  const to = xpForLevel(level + 1);
  const from = xpForLevel(level);
  const pct = Math.round(((progress.xp - from) / (to - from)) * 100);

  return (
    <>
      <header className="stack" style={{ gap: 4 }}>
        <h1 className="display h1">{t('profile.title')}</h1>
        <span className="small muted">{t('profile.local')}</span>
      </header>

      <section className="card">
        <span className="display h2">{l(levelTitle(level))} · {t('home.level', { n: level })}</span>
        <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}><span style={{ width: `${pct}%` }} /></div>
        <span className="small muted">{t('profile.toNext', { n: to - progress.xp, l: level + 1 })}</span>
      </section>

      <section className="grid3" style={{ gap: 10 }}>
        {[
          { v: progress.lessonsDone.length, k: t('profile.lessons') },
          { v: progress.cardsViewed.length, k: t('profile.cards') },
          { v: progress.streak.count, k: t('profile.streak') },
        ].map((s) => (
          <div key={s.k} className="card" style={{ alignItems: 'center', gap: 0, padding: 12, textAlign: 'center' }}>
            <span className="display" style={{ fontSize: 30, color: 'var(--gold)' }}>{s.v}</span>
            <span className="small muted" style={{ fontWeight: 700 }}>{s.k}</span>
          </div>
        ))}
      </section>

      <section className="stack" aria-label={t('profile.badges')}>
        <h2 className="display h2">{t('profile.badges')}</h2>
        <div className="grid3" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '14px 8px' }}>
          {BADGES.map((b) => {
            const got = progress.badges.includes(b.id);
            return (
              <div key={b.id} className="stack" style={{ alignItems: 'center', gap: 6, textAlign: 'center' }}>
                <span style={{ width: 54, height: 54, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: got ? 'var(--gold)' : 'transparent', border: `1px solid ${got ? 'var(--gold-soft)' : 'var(--line-strong)'}`, color: got ? 'var(--on-gold)' : 'var(--line-strong)' }}>
                  <IconStar />
                </span>
                <span className="small" style={{ fontWeight: 700, fontSize: 11, color: got ? 'var(--text)' : 'var(--muted)' }}>{l(b.name)}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="stack">
        <h2 className="display h3">{t('profile.language')}</h2>
        <div className="row" role="group" aria-label={t('profile.language')}>
          {LANGS.map((x) => (
            <button key={x} type="button" className="chip" aria-pressed={lang === x} onClick={() => setLang(x)} lang={x}>
              {LANG_NAMES[x]}
            </button>
          ))}
        </div>
      </section>

      <p className="small muted" style={{ margin: 0 }}>{t('profile.accountSoon')}</p>
      {confirming ? (
        <div className="card" role="alertdialog" aria-label={t('profile.reset')} style={{ borderColor: 'var(--rose)' }}>
          <p className="p">{t('profile.resetConfirm')}</p>
          <div className="row">
            <button type="button" className="btn" style={{ background: 'var(--rose)', borderColor: 'var(--rose)' }} onClick={() => { reset(); setConfirming(false); }}>
              {t('profile.reset')}
            </button>
            <button type="button" className="btn ghost" onClick={() => setConfirming(false)}>{t('common.cancel')}</button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="btn ghost"
          style={{ borderColor: 'var(--rose)', color: 'var(--rose)' }}
          onClick={() => setConfirming(true)}
        >
          {t('profile.reset')}
        </button>
      )}
    </>
  );
}
