import { useEffect, useState } from 'react';
import { getLesson, LESSONS } from '../content/lessons';
import { cardImage, getCard, majorId } from '../content/cards';
import { WORLDS } from '../content/worlds';
import { IconBack, IconCheck } from '../components/Icons';
import { QuestionBlock } from '../components/Question';
import { useI18n } from '../i18n/I18n';
import { XP } from '../progress/model';
import { useProgress } from '../progress/Progress';
import { href } from '../router';

export function LessonList() {
  const { t, l } = useI18n();
  const { progress } = useProgress();
  const worlds = [...new Set(LESSONS.map((x) => x.world))];

  return (
    <>
      <header className="stack" style={{ gap: 4 }}>
        <h1 className="display h1">{t('learn.title')}</h1>
        <p className="p muted">{t('learn.subtitle')}</p>
      </header>
      {worlds.map((w) => (
        <section key={w} className="stack" aria-label={l(WORLDS[w])}>
          <div className="row">
            <img src={cardImage(majorId(w))} alt="" style={{ width: 34, borderRadius: 3 }} />
            <h2 className="display h2" style={{ fontSize: 21 }}>{l(WORLDS[w])}</h2>
          </div>
          {LESSONS.filter((x) => x.world === w).map((lesson) => {
            const done = progress.lessonsDone.includes(lesson.id);
            return (
              <a key={lesson.id} href={href.lesson(lesson.id)} className="card link-card" style={{ flexDirection: 'row', alignItems: 'center' }}>
                <div className="stack" style={{ gap: 2, flex: 1 }}>
                  <span className="display h3">{l(lesson.title)}</span>
                  <span className="small muted">{t('common.minutes', { n: lesson.minutes })}</span>
                </div>
                {done && (
                  <span className="tag school row" style={{ gap: 4 }}>
                    <IconCheck width={14} height={14} /> {t('learn.done')}
                  </span>
                )}
              </a>
            );
          })}
        </section>
      ))}
      <a href={href.sources()} className="btn ghost">{t('learn.sourcesLink')}</a>
    </>
  );
}

export function LessonView({ id }: { id: string }) {
  const { t, l } = useI18n();
  const { progress, record } = useProgress();
  const lesson = getLesson(id);
  const [page, setPage] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [gained, setGained] = useState<number | null>(null);

  useEffect(() => {
    setPage(0);
    setAnswered(false);
    setGained(null);
  }, [id]);

  if (!lesson) {
    window.location.hash = href.learn();
    return null;
  }

  const total = lesson.pages.length + 1; // pages + quiz
  const onQuiz = page === lesson.pages.length;
  const wasDone = progress.lessonsDone.includes(lesson.id);
  const current = lesson.pages[page];
  const card = current?.card !== undefined ? getCard(current.card) : undefined;

  const finish = () => {
    setGained(record({ type: 'completeLesson', lesson: lesson.id }));
  };

  return (
    <>
      <header className="row">
        <a href={href.learn()} className="icon-btn" aria-label={t('common.back')}><IconBack /></a>
        <div className="stack" style={{ gap: 0, flex: 1 }}>
          <span className="eyebrow">{l(WORLDS[lesson.world])}</span>
          <h1 className="display h2">{l(lesson.title)}</h1>
        </div>
      </header>

      <div className="bar" aria-label={t('learn.page', { i: page + 1, n: total })}>
        <span style={{ width: `${((page + 1) / total) * 100}%` }} />
      </div>

      {gained !== null ? (
        <section className="card gold fade" role="status" style={{ alignItems: 'center', textAlign: 'center', padding: 28 }}>
          <span className="eyebrow">{t('learn.completed')}</span>
          <span className="display h1">{gained > 0 ? t('learn.reward', { n: gained }) : '✓'}</span>
          {gained === 0 && <p className="p muted">{t('learn.alreadyDone')}</p>}
          <a href={href.learn()} className="btn">{t('common.continue')}</a>
        </section>
      ) : onQuiz ? (
        <section className="card fade" key="quiz">
          <span className="eyebrow">{t('learn.quiz')}</span>
          <QuestionBlock q={lesson.quiz} onAnswered={() => setAnswered(true)} />
        </section>
      ) : (
        <section className="stack fade" key={page}>
          {card && (
            <a href={href.card(card.id)} style={{ alignSelf: 'center', width: 150 }}>
              <img className="tarot" src={cardImage(card.id)} alt={l(card.name)} />
            </a>
          )}
          <p className="p" style={{ fontSize: 17, lineHeight: 1.6 }}>{l(current.text)}</p>
        </section>
      )}

      {gained === null && (
        <div className="row between" style={{ marginTop: 'auto' }}>
          <button type="button" className="btn ghost" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            {t('common.back')}
          </button>
          <span className="small muted">{t('learn.page', { i: page + 1, n: total })}</span>
          {onQuiz ? (
            <button type="button" className="btn" disabled={!answered} onClick={finish}>
              {t('common.finish')}{!wasDone ? ` · +${XP.lesson}` : ''}
            </button>
          ) : (
            <button type="button" className="btn" onClick={() => setPage((p) => p + 1)}>{t('common.next')}</button>
          )}
        </div>
      )}

      {gained === null && (
        <details className="small muted">
          <summary>{t('common.sources')}</summary>
          <ul style={{ paddingLeft: 18, margin: '8px 0 0' }}>
            {lesson.sources.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </details>
      )}
    </>
  );
}
