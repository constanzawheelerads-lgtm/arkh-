import { useState } from 'react';
import type { Lang } from '../content/types';
import { useI18n } from '../i18n/I18n';
import type { UiKey } from '../i18n/ui';
import { askMysterium, IS_PREVIEW_BUILD, isMysteriumConfigured, type TutorEvaluation, type TutorPayload, type TutorResult } from '../lib/mysterium';

const SCORE_KEY: Record<0 | 1 | 2, UiKey> = { 0: 'eval.score0', 1: 'eval.score1', 2: 'eval.score2' };
const SCORE_CLASS: Record<0 | 1 | 2, string> = { 0: 'history', 1: 'waite', 2: 'school' };

export function errorKey(r: Extract<TutorResult, { ok: false }>): UiKey {
  switch (r.reason) {
    case 'not-configured': return 'tutor.notConfigured';
    case 'limit': return 'tutor.errLimit';
    case 'refusal': return 'tutor.errRefusal';
    case 'network': return 'tutor.errNetwork';
    case 'invalid': return 'tutor.errInvalid';
    default: return 'tutor.errServer';
  }
}

export function EvaluationView({ evaluation }: { evaluation: TutorEvaluation }) {
  const { t } = useI18n();
  return (
    <section className="card gold fade" aria-label={t('eval.title')}>
      <span className="eyebrow">{t('eval.title')}</span>
      <p className="p">{evaluation.summary}</p>
      {evaluation.criteria.map((c) => (
        <div key={c.id} className="stack" style={{ gap: 4, paddingTop: 8, borderTop: '1px solid var(--line)' }}>
          <div className="row between" style={{ gap: 8 }}>
            <strong style={{ fontSize: 14 }}>{t(`eval.c.${c.id}` as UiKey)}</strong>
            <span className={`tag ${SCORE_CLASS[c.score]}`} style={{ flexShrink: 0 }}>{t(SCORE_KEY[c.score])}</span>
          </div>
          <p className="p" style={{ fontSize: 14 }}>{c.comment}</p>
        </div>
      ))}
      <div className="stack" style={{ gap: 4, paddingTop: 8, borderTop: '1px solid var(--line)' }}>
        <strong style={{ fontSize: 14, color: 'var(--teal)' }}>{t('eval.strengths')}</strong>
        <p className="p" style={{ fontSize: 14 }}>{evaluation.strengths}</p>
        <strong style={{ fontSize: 14, color: 'var(--gold)' }}>{t('eval.suggestion')}</strong>
        <p className="p" style={{ fontSize: 14 }}>{evaluation.suggestion}</p>
      </div>
    </section>
  );
}

/** Button + result panel that asks Mysterium to assess a written reading. */
export function AskForFeedback({ payload, disabled }: { payload: () => Omit<TutorPayload, 'mode' | 'lang'>; disabled: boolean }) {
  const { t, lang } = useI18n();
  const [state, setState] = useState<{ status: 'idle' | 'loading' } | { status: 'done'; result: TutorResult }>({ status: 'idle' });

  const run = async () => {
    setState({ status: 'loading' });
    const result = await askMysterium({ ...payload(), mode: 'evaluate', lang: lang as Lang });
    setState({ status: 'done', result });
  };

  return (
    <div className="stack">
      <button type="button" className="btn ghost" disabled={disabled || state.status === 'loading' || !isMysteriumConfigured()} onClick={run}>
        {state.status === 'loading' ? t('eval.loading') : t('eval.request')}
      </button>
      {!isMysteriumConfigured() && <p className="small muted" style={{ margin: 0 }}>{t(IS_PREVIEW_BUILD ? 'tutor.previewOnly' : 'tutor.notConfigured')}</p>}
      {state.status === 'done' && state.result.ok && state.result.kind === 'evaluation' && <EvaluationView evaluation={state.result.evaluation} />}
      {state.status === 'done' && !state.result.ok && <p role="alert" className="feedback bad">{t(errorKey(state.result))}</p>}
    </div>
  );
}
