import { useState } from 'react';
import type { Question as Q } from '../content/types';
import { useI18n } from '../i18n/I18n';

/** Multiple-choice question with immediate feedback and explanation. */
export function QuestionBlock({ q, onAnswered }: { q: Q; onAnswered?: (correct: boolean) => void }) {
  const { t, l } = useI18n();
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;
  const ok = picked === q.correct;

  return (
    <div className="stack">
      <h2 className="display h3" style={{ fontSize: 21 }}>{l(q.prompt)}</h2>
      <div className="stack" style={{ gap: 8 }}>
        {q.options.map((o, i) => {
          const cls = answered && i === q.correct ? 'right' : answered && i === picked ? 'wrong' : '';
          return (
            <button
              key={i}
              type="button"
              className={`option ${cls}`}
              disabled={answered}
              onClick={() => {
                setPicked(i);
                onAnswered?.(i === q.correct);
              }}
            >
              {l(o)}
            </button>
          );
        })}
      </div>
      {answered && (
        <p role="status" className={`feedback fade ${ok ? '' : 'bad'}`}>
          <strong>{ok ? t('common.correct') : t('common.incorrect')}</strong> {l(q.explain)}
        </p>
      )}
    </div>
  );
}
