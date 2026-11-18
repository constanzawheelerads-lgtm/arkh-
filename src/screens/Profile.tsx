import { useState } from 'react';
import { cardImage, majorId } from '../content/cards';
import { EXAMS } from '../content/exams';
import { LANGS } from '../content/types';
import { Avatar } from '../components/Avatar';
import { IconStar } from '../components/Icons';
import { useI18n } from '../i18n/I18n';
import { ACCESSORIES, BADGES, COLLECTIBLES, examPassed, levelFromXp, levelTitle, ROBES, xpForLevel } from '../progress/model';
import { useProgress } from '../progress/Progress';
import { href } from '../router';

const LANG_NAMES = { es: 'Español', en: 'English' } as const;

export function Profile() {
  const { t, l, lang, setLang } = useI18n();
  const { progress, reset, record } = useProgress();
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

      <section className="card" style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <Avatar avatar={progress.avatar} label={t('profile.avatar')} />
        <div className="stack" style={{ gap: 8, minWidth: 0, flex: 1 }}>
          <span className="display h2" style={{ fontSize: 22 }}>{l(levelTitle(level))} · {t('home.level', { n: level })}</span>
          <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}><span style={{ width: `${pct}%` }} /></div>
          <span className="small muted">{t('profile.toNext', { n: to - progress.xp, l: level + 1 })}</span>
        </div>
      </section>

      <section className="card">
        <span className="eyebrow">{t('profile.robe')}</span>
        <div className="row" role="group" aria-label={t('profile.robe')} style={{ flexWrap: 'wrap', gap: 10 }}>
          {ROBES.map((r) => {
            const ok = r.unlocked(progress);
            const on = progress.avatar.robe === r.id;
            return (
              <button
                key={r.id}
                type="button"
                aria-pressed={on}
                disabled={!ok}
                title={ok ? l(r.name) : t('profile.unlock', { how: l(r.unlock) })}
                aria-label={ok ? l(r.name) : `${l(r.name)}. ${t('profile.unlock', { how: l(r.unlock) })}`}
                onClick={() => record({ type: 'setAvatar', avatar: { robe: r.id } })}
                style={{ width: 44, height: 44, borderRadius: '50%', background: r.color, border: `2px solid ${on ? 'var(--gold)' : 'var(--line-strong)'}`, boxShadow: on ? '0 0 0 3px var(--bg), 0 0 0 4px var(--gold)' : 'none', opacity: ok ? 1 : 0.35 }}
              />
            );
          })}
        </div>
        <span className="eyebrow" style={{ marginTop: 6 }}>{t('profile.accessory')}</span>
        <div className="row" role="group" aria-label={t('profile.accessory')} style={{ flexWrap: 'wrap', gap: 8 }}>
          {ACCESSORIES.map((a) => {
            const ok = a.unlocked(progress);
            return (
              <button
                key={a.id}
                type="button"
                className="chip"
                aria-pressed={progress.avatar.accessory === a.id}
                disabled={!ok}
                title={ok ? undefined : t('profile.unlock', { how: l(a.unlock) })}
                onClick={() => record({ type: 'setAvatar', avatar: { accessory: a.id } })}
                style={{ opacity: ok ? 1 : 0.45 }}
              >
                {l(a.name)}
              </button>
            );
          })}
        </div>
        {ACCESSORIES.some((a) => !a.unlocked(progress)) && (
          <span className="small muted">
            {t('profile.toUnlock')}: {ACCESSORIES.filter((a) => !a.unlocked(progress)).map((a) => `${l(a.name)} (${l(a.unlock)})`).join(' · ')}
          </span>
        )}
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

      <section className="stack" aria-label={t('profile.collection')}>
        <h2 className="display h2">{t('profile.collection')}</h2>
        <div className="grid3" style={{ gap: '14px 10px' }}>
          {COLLECTIBLES.map((c) => {
            const got = progress.collectibles.includes(c.id);
            return (
              <a key={c.id} href={href.world(c.world)} className="link-card stack" style={{ alignItems: 'center', gap: 6, textAlign: 'center' }}>
                <span style={{ position: 'relative', width: 56 }}>
                  <img src={cardImage(majorId(c.world))} alt="" style={{ width: 56, borderRadius: 4, opacity: got ? 1 : 0.3, filter: got ? 'none' : 'grayscale(1)' }} />
                  {got && (
                    <span style={{ position: 'absolute', right: -6, bottom: -6, width: 24, height: 24, borderRadius: '50%', background: 'var(--gold)', color: 'var(--on-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconStar width={14} height={14} />
                    </span>
                  )}
                </span>
                <span className="small" style={{ fontWeight: 700, fontSize: 11, color: got ? 'var(--text)' : 'var(--muted)' }}>{l(c.name)}</span>
                {!got && <span className="small muted" style={{ fontSize: 10 }}>{l(c.how)}</span>}
              </a>
            );
          })}
        </div>
      </section>

      <section className="stack" aria-label={t('profile.exams')}>
        <h2 className="display h2">{t('profile.exams')}</h2>
        {EXAMS.map((e) => {
          const best = progress.exams[e.id];
          return (
            <a key={e.id} href={href.world(e.world)} className="card link-card" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="stack" style={{ gap: 2 }}>
                <strong>{l(e.title)}</strong>
                {best !== undefined && <span className="small muted">{t('exam.best', { p: Math.round(best * 100) })}</span>}
              </span>
              <span className={`tag ${examPassed(progress, e.id) ? 'school' : 'waite'}`}>{examPassed(progress, e.id) ? t('exam.passed') : t('exam.notYet')}</span>
            </a>
          );
        })}
      </section>

      <section className="stack" aria-label={t('profile.badges')}>
        <h2 className="display h2">{t('profile.badges')}</h2>
        <div className="grid3" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '14px 8px' }}>
          {BADGES.map((b) => {
            const got = progress.badges.includes(b.id);
            return (
              <div key={b.id} className="stack" style={{ alignItems: 'center', gap: 6, textAlign: 'center' }}>
                <span style={{ width: 50, height: 50, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: got ? 'var(--gold)' : 'transparent', border: `1px solid ${got ? 'var(--gold-soft)' : 'var(--line-strong)'}`, color: got ? 'var(--on-gold)' : 'var(--line-strong)' }}>
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
        <button type="button" className="btn ghost" style={{ borderColor: 'var(--rose)', color: 'var(--rose)' }} onClick={() => setConfirming(true)}>
          {t('profile.reset')}
        </button>
      )}
    </>
  );
}
