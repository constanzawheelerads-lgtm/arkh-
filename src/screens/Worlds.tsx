import { useMemo, useState } from 'react';
import { cardImage, majorId } from '../content/cards';
import { getExam, type ExamQuestion } from '../content/exams';
import { LESSONS } from '../content/lessons';
import { IconBack, IconCheck, IconStar } from '../components/Icons';
import { useI18n } from '../i18n/I18n';
import { COLLECTIBLES, EXAM_PASS_RATIO, examPassed } from '../progress/model';
import { useProgress } from '../progress/Progress';
import { getWorld, isWorldOpen, WORLD_PATH } from '../progress/worlds';
import { href } from '../router';

const pct = (r: number) => Math.round(r * 100);

export function WorldsMap() {
  const { t, l } = useI18n();
  const { progress } = useProgress();
  const [picked, setPicked] = useState(WORLD_PATH[0].n);
  const sel = getWorld(picked)!;
  const selOpen = isWorldOpen(sel, progress);
  const rowH = 128;

  return (
    <>
      <header className="stack" style={{ gap: 4 }}>
        <span className="eyebrow">Arkhé</span>
        <h1 className="display h1">{t('worlds.title')}</h1>
        <p className="p muted">{t('worlds.subtitle')}</p>
      </header>

      <div style={{ position: 'relative', height: WORLD_PATH.length * rowH + 10 }} role="list">
        <svg width="100%" height="100%" viewBox={`0 0 360 ${WORLD_PATH.length * rowH + 10}`} preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
          <path
            d={WORLD_PATH.map((_, i) => {
              const x = i % 2 === 0 ? 70 : 250;
              const y = 64 + i * rowH;
              if (i === 0) return `M${x} ${y}`;
              const px = i % 2 === 0 ? 250 : 70;
              return `C ${px} ${y - rowH / 2}, ${x} ${y - rowH / 2}, ${x} ${y}`;
            }).join(' ')}
            stroke="#d4af6a" strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="1 7" strokeLinecap="round" fill="none"
          />
        </svg>
        {WORLD_PATH.map((w, i) => {
          const open = isWorldOpen(w, progress);
          const on = w.n === picked;
          const left = i % 2 === 0;
          const lessons = LESSONS.filter((x) => x.world === w.n);
          const done = lessons.filter((x) => progress.lessonsDone.includes(x.id)).length;
          return (
            <div key={w.n} role="listitem" style={{ position: 'absolute', top: 10 + i * rowH, left: left ? '4%' : 'auto', right: left ? 'auto' : '4%', width: '62%' }}>
              <button
                type="button"
                onClick={() => { setPicked(w.n); window.setTimeout(() => document.getElementById('world-panel')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50); }}
                aria-pressed={on}
                aria-label={`${l(w.name)}${open ? '' : ` (${t('worlds.locked')})`}`}
                style={{ display: 'flex', flexDirection: left ? 'row' : 'row-reverse', alignItems: 'center', gap: 12, background: 'none', border: 0, padding: 0, color: 'inherit', textAlign: left ? 'left' : 'right', width: '100%' }}
              >
                <span style={{ display: 'block', padding: 3, borderRadius: 8, flexShrink: 0, background: on ? 'var(--gold)' : 'var(--line)', boxShadow: on ? '0 0 24px rgba(212,175,106,.45)' : 'none' }}>
                  <img src={cardImage(majorId(w.n))} alt="" style={{ display: 'block', width: 60, borderRadius: 5, opacity: open ? 1 : 0.45 }} />
                </span>
                <span className="stack" style={{ gap: 2, minWidth: 0 }}>
                  <span className="display h3" style={{ fontSize: 18 }}>{l(w.name)}</span>
                  <span className="small" style={{ fontWeight: 700, color: open ? 'var(--teal)' : 'var(--muted)' }}>
                    {open ? (lessons.length ? t('worlds.progress', { d: done, n: lessons.length }) : t('worlds.open')) : t('worlds.locked')}
                  </span>
                </span>
              </button>
            </div>
          );
        })}
      </div>

      <section className="card gold fade" key={sel.n} aria-live="polite" id="world-panel">
        <div className="row between" style={{ alignItems: 'baseline' }}>
          <h2 className="display h2" style={{ fontSize: 22 }}>{l(sel.name)}</h2>
          <span className="small" style={{ fontWeight: 800, color: selOpen ? 'var(--teal)' : 'var(--muted)' }}>{selOpen ? t('worlds.open') : t('worlds.locked')}</span>
        </div>
        <p className="p" style={{ fontSize: 14 }}>{l(sel.desc)}</p>
        {!selOpen && sel.requirement && <p className="small muted" style={{ margin: 0 }}>{t('worlds.requires', { text: l(sel.requirement.text) })}</p>}
        <a href={href.world(sel.n)} className="btn" style={{ alignSelf: 'flex-start' }}>{t('worlds.enter')}</a>
      </section>
      <div className="grid2">
        <a href={href.learn()} className="btn ghost">{t('learn.title')}</a>
        <a href={href.sources()} className="btn ghost">{t('sources.title')}</a>
      </div>
    </>
  );
}

export function WorldView({ n }: { n: number }) {
  const { t, l } = useI18n();
  const { progress } = useProgress();
  const world = getWorld(n)!;
  const open = isWorldOpen(world, progress);
  const lessons = LESSONS.filter((x) => x.world === n);
  const exam = world.exam ? getExam(world.exam) : undefined;
  const collectible = COLLECTIBLES.find((c) => c.world === n);
  const hasCollectible = collectible && progress.collectibles.includes(collectible.id);

  return (
    <>
      <header className="row">
        <a href={href.worlds()} className="icon-btn" aria-label={t('common.back')}><IconBack /></a>
        <span className="eyebrow" style={{ color: open ? 'var(--teal)' : 'var(--muted)' }}>{open ? t('worlds.open') : t('worlds.locked')}</span>
      </header>
      <section className="row" style={{ alignItems: 'flex-start', gap: 16 }}>
        <a href={href.card(majorId(n))} style={{ flexShrink: 0 }}>
          <img className="tarot" src={cardImage(majorId(n))} alt={l(world.name)} style={{ width: 96 }} />
        </a>
        <div className="stack" style={{ gap: 8, minWidth: 0 }}>
          <h1 className="display h1" style={{ fontSize: 28, textWrap: 'balance' }}>{l(world.name)}</h1>
          <p className="p" style={{ fontSize: 14 }}>{l(world.desc)}</p>
        </div>
      </section>

      {!open && world.requirement && (
        <div className="card" style={{ borderColor: 'var(--rose)' }}>
          <strong>{t('worlds.requires', { text: l(world.requirement.text) })}</strong>
          <span className="small muted">{t('worlds.syllabus')}</span>
        </div>
      )}

      <section className="stack">
        <h2 className="display h2" style={{ fontSize: 21 }}>{t('worlds.lessons')}</h2>
        {lessons.length === 0 && <p className="p muted">{t('worlds.noLessons')}</p>}
        {lessons.map((lesson) => {
          const done = progress.lessonsDone.includes(lesson.id);
          const content = (
            <>
              <div className="stack" style={{ gap: 2, flex: 1 }}>
                <span className="display h3">{l(lesson.title)}</span>
                <span className="small muted">{t('common.minutes', { n: lesson.minutes })}</span>
              </div>
              {done && <span className="tag school row" style={{ gap: 4 }}><IconCheck width={14} height={14} /> {t('learn.done')}</span>}
            </>
          );
          return open ? (
            <a key={lesson.id} href={href.lesson(lesson.id)} className="card link-card" style={{ flexDirection: 'row', alignItems: 'center' }}>{content}</a>
          ) : (
            <div key={lesson.id} className="card" style={{ flexDirection: 'row', alignItems: 'center', opacity: 0.6 }}>{content}</div>
          );
        })}
      </section>

      {open && world.activities.length > 0 && (
        <section className="stack">
          <h2 className="display h2" style={{ fontSize: 21 }}>{t('worlds.activities')}</h2>
          {world.activities.map((a) => (
            <a key={a.href + a.label.en} href={a.href} className="btn ghost" style={{ justifyContent: 'flex-start' }}>{l(a.label)}</a>
          ))}
        </section>
      )}

      {exam && (
        <section className="card">
          <div className="row between">
            <span className="eyebrow">{t('worlds.exam')}</span>
            <span className={`tag ${examPassed(progress, exam.id) ? 'school' : 'waite'}`}>
              {examPassed(progress, exam.id) ? t('exam.passed') : t('exam.notYet')}
            </span>
          </div>
          <span className="display h3">{l(exam.title)}</span>
          {progress.exams[exam.id] !== undefined && <span className="small muted">{t('exam.best', { p: pct(progress.exams[exam.id]) })}</span>}
          {open ? (
            <a href={href.exam(exam.id)} className="btn" style={{ alignSelf: 'flex-start' }}>{t('exam.start')}</a>
          ) : (
            <span className="small muted">{t('exam.lockedWorld')}</span>
          )}
        </section>
      )}

      {collectible && (
        <section className="card" style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <span style={{ width: 48, height: 48, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: hasCollectible ? 'var(--gold)' : 'transparent', border: '1px solid var(--line-strong)', color: hasCollectible ? 'var(--on-gold)' : 'var(--line-strong)' }}>
            <IconStar />
          </span>
          <span className="stack" style={{ gap: 2 }}>
            <span className="eyebrow">{t('worlds.collectible')}{hasCollectible ? ` · ${t('worlds.collected')}` : ''}</span>
            <strong>{l(collectible.name)}</strong>
            {!hasCollectible && <span className="small muted">{l(collectible.how)}</span>}
          </span>
        </section>
      )}
    </>
  );
}

export function ExamView({ id }: { id: string }) {
  const { t, l } = useI18n();
  const { progress, record } = useProgress();
  const exam = getExam(id);
  const [attempt, setAttempt] = useState(0);
  const [started, setStarted] = useState(false);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const questions = useMemo<ExamQuestion[]>(() => (exam ? exam.build() : []), [exam, attempt]);

  if (!exam) {
    window.location.hash = href.worlds();
    return null;
  }
  const world = getWorld(exam.world)!;
  const open = isWorldOpen(world, progress);
  const finished = answers.length === questions.length && started;
  const correct = answers.filter((a, k) => a === questions[k].correct).length;
  const ratio = questions.length ? correct / questions.length : 0;

  const answer = (choice: number) => {
    const nextAnswers = [...answers, choice];
    setAnswers(nextAnswers);
    if (nextAnswers.length === questions.length) {
      const c = nextAnswers.filter((a, k) => a === questions[k].correct).length;
      record({ type: 'finishExam', exam: exam.id, correct: c, total: questions.length });
    } else {
      setI(i + 1);
    }
  };
  const retry = () => { setAttempt((a) => a + 1); setAnswers([]); setI(0); setStarted(true); };

  return (
    <>
      <header className="row">
        <a href={href.world(exam.world)} className="icon-btn" aria-label={t('exam.backWorld')}><IconBack /></a>
        <div className="stack" style={{ gap: 0 }}>
          <span className="eyebrow">{t('worlds.exam')} · {l(world.name)}</span>
          <h1 className="display h2">{l(exam.title)}</h1>
        </div>
      </header>

      {!open ? (
        <p className="p muted">{t('exam.lockedWorld')}</p>
      ) : !started ? (
        <section className="card gold">
          <p className="p">{t('exam.intro', { n: questions.length, p: pct(EXAM_PASS_RATIO) })}</p>
          {progress.exams[exam.id] !== undefined && <span className="small muted">{t('exam.best', { p: pct(progress.exams[exam.id]) })}</span>}
          <button type="button" className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => setStarted(true)}>{t('exam.start')}</button>
        </section>
      ) : !finished ? (
        <section className="stack fade" key={`${attempt}-${i}`}>
          <span className="small muted" style={{ fontWeight: 700 }}>{t('exam.question', { i: i + 1, n: questions.length })}</span>
          <div className="bar"><span style={{ width: `${(i / questions.length) * 100}%` }} /></div>
          {questions[i].image && <img className="tarot" src={cardImage(questions[i].image!)} alt="" style={{ width: 140, alignSelf: 'center' }} />}
          <h2 className="display h3" style={{ fontSize: 20 }}>{l(questions[i].prompt)}</h2>
          <div className="stack" style={{ gap: 8 }}>
            {questions[i].options.map((o, k) => (
              <button key={k} type="button" className="option" onClick={() => answer(k)}>{l(o)}</button>
            ))}
          </div>
        </section>
      ) : (
        <>
          <section className="card gold fade" role="status" style={{ alignItems: 'center', textAlign: 'center' }}>
            <span className="eyebrow">{ratio >= EXAM_PASS_RATIO ? t('exam.passed') : t('exam.notYet')}</span>
            <span className="display h2">
              {ratio >= EXAM_PASS_RATIO ? t('exam.resultPassed', { p: pct(ratio) }) : t('exam.resultFailed', { p: pct(ratio), m: pct(EXAM_PASS_RATIO) })}
            </span>
            <div className="row">
              <button type="button" className="btn" onClick={retry}>{t('exam.retry')}</button>
              <a href={href.world(exam.world)} className="btn ghost">{t('exam.backWorld')}</a>
            </div>
          </section>
          <h2 className="display h2" style={{ fontSize: 21 }}>{t('exam.review')}</h2>
          {questions.map((q, k) => {
            const ok = answers[k] === q.correct;
            return (
              <article key={k} className="card">
                <span className={`tag ${ok ? 'school' : 'history'}`}>{ok ? t('common.correct') : t('common.incorrect')}</span>
                <strong>{l(q.prompt)}</strong>
                {!ok && <span className="small muted">{t('exam.yourAnswer', { a: l(q.options[answers[k]]) })}</span>}
                <p className={`feedback ${ok ? '' : 'bad'}`}><strong>{l(q.options[q.correct])}.</strong> {l(q.explain)}</p>
              </article>
            );
          })}
        </>
      )}
    </>
  );
}
