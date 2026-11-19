import { LESSONS } from '../content/lessons';
import { CARDS, cardImage } from '../content/cards';
import { WORLDS } from '../content/worlds';
import { IconCheck, IconNext, IconProfile } from '../components/Icons';
import { MysteriumSays } from '../components/Mysterium';
import { useI18n } from '../i18n/I18n';
import { dayKey } from '../lib/random';
import { levelFromXp, levelTitle, MISSIONS, missionStatus, xpForLevel } from '../progress/model';
import { useProgress } from '../progress/Progress';
import { href } from '../router';
import { MYSTERIUM_ENABLED } from '../lib/supabase';

function cardOfTheDay(): number {
  const key = dayKey();
  let h = 0;
  for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h % CARDS.length;
}

export function Home() {
  const { t, l } = useI18n();
  const { progress, record } = useProgress();
  const today = dayKey();
  const dailyDone = progress.dailyDone === today;
  const level = levelFromXp(progress.xp);
  const from = xpForLevel(level);
  const to = xpForLevel(level + 1);
  const pct = Math.round(((progress.xp - from) / (to - from)) * 100);
  const daily = CARDS[cardOfTheDay()];
  const nextLesson = LESSONS.find((x) => !progress.lessonsDone.includes(x.id));

  return (
    <>
      <header className="row between">
        <div className="wordmark">
          <b>ARKHÉ</b>
          <i>{t('app.tagline')}</i>
        </div>
        <a href={href.profile()} className="icon-btn" aria-label={t('nav.profile')}>
          <IconProfile />
        </a>
      </header>

      <section className="card" aria-label={t('home.level', { n: level })}>
        <div className="row between">
          <span className="display h3" style={{ fontSize: 22 }}>
            {l(levelTitle(level))} · {t('home.level', { n: level })}
          </span>
          <span className="small muted" style={{ fontWeight: 700 }}>{progress.xp} / {to} XP</span>
        </div>
        <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
          <span style={{ width: `${pct}%` }} />
        </div>
        <span className="small muted" style={{ fontWeight: 700 }}>{t('home.streak', { n: progress.streak.count })}</span>
      </section>

      <MysteriumSays>{t('home.cardOfDayMsg', { card: l(daily.name) })}</MysteriumSays>

      <a href={href.tutor()} className="card link-card" style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: '12px 14px' }}>
        <span className="display h3" style={{ flex: 1, fontSize: 19 }}>{MYSTERIUM_ENABLED ? t('tutor.ask') : t('tutor.askSoon')}</span>
        <IconNext style={{ color: 'var(--gold)' }} />
      </a>

      <a href={href.card(daily.id)} className="card gold link-card" style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <img src={cardImage(daily.id)} alt={l(daily.name)} style={{ width: 62, borderRadius: 4, flexShrink: 0 }} />
        <div className="stack" style={{ gap: 4, flex: 1 }}>
          <span className="eyebrow">{t('home.cardOfDay')}</span>
          <span className="display h3" style={{ fontSize: 22 }}>{daily.arcana === 'major' ? `${daily.label} · ` : ''}{l(daily.name)}</span>
        </div>
        <IconNext style={{ color: 'var(--gold)' }} />
      </a>

      <section className="stack" aria-label={t('home.continue')}>
        <span className="eyebrow" style={{ color: 'var(--teal)' }}>{t('home.continue')}</span>
        {nextLesson ? (
          <a href={href.lesson(nextLesson.id)} className="card link-card">
            <span className="small muted">{l(WORLDS[nextLesson.world])}</span>
            <span className="display h3" style={{ fontSize: 21 }}>{l(nextLesson.title)}</span>
            <span className="small muted">{t('common.minutes', { n: nextLesson.minutes })}</span>
          </a>
        ) : (
          <p className="p muted">{t('home.allLessonsDone')}</p>
        )}
      </section>

      <a href={href.game('guess')} className={`btn ${dailyDone ? 'ghost' : ''}`} style={{ justifyContent: 'space-between', borderRadius: 18, minHeight: 64, padding: '0 18px' }}>
        <span className="stack" style={{ gap: 0, textAlign: 'left' }}>
          <span className="display" style={{ fontSize: 20 }}>{t('home.challenge')}</span>
          <span style={{ fontSize: 12, fontWeight: 600 }}>{dailyDone ? t('missions.dailyDone') : t('home.challengeText')}</span>
        </span>
        {dailyDone ? <IconCheck /> : <IconNext />}
      </a>

      <section className="card" aria-label={t('missions.title')}>
        <span className="eyebrow">{t('missions.title')}</span>
        {MISSIONS.map((m) => {
          const st = missionStatus(progress, m, today);
          return (
            <div key={m.id} className="stack" style={{ gap: 6, paddingBlock: 4 }}>
              <div className="row between" style={{ gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{l(m.name)}</span>
                <span className="small muted" style={{ fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{st.value}/{m.target}</span>
              </div>
              <div className="bar" aria-hidden="true"><span style={{ width: `${(st.value / m.target) * 100}%`, background: st.claimed ? 'var(--teal)' : undefined }} /></div>
              {st.done && !st.claimed && (
                <button type="button" className="btn" style={{ minHeight: 40, alignSelf: 'flex-start', fontSize: 13 }} onClick={() => record({ type: 'claimMission', mission: m.id })}>
                  {t('missions.claim', { n: m.xp })}
                </button>
              )}
              {st.claimed && <span className="small" style={{ color: 'var(--teal)', fontWeight: 700 }}>{t('missions.claimed')}</span>}
            </div>
          );
        })}
      </section>

      <a href={href.worlds()} className="card link-card" style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <img src={cardImage('m00')} alt="" style={{ width: 44, borderRadius: 4 }} />
        <span className="stack" style={{ gap: 2, flex: 1 }}>
          <span className="display h3">{t('worlds.title')}</span>
          <span className="small muted">{t('worlds.subtitle')}</span>
        </span>
        <IconNext style={{ color: 'var(--gold)' }} />
      </a>
    </>
  );
}
