import { SOURCES } from '../content/sources';
import type { Source } from '../content/types';
import { IconBack } from '../components/Icons';
import { useI18n } from '../i18n/I18n';
import type { UiKey } from '../i18n/ui';
import { href } from '../router';

const KIND: Record<Source['kind'], { key: UiKey; cls: string }> = {
  primary: { key: 'sources.primary', cls: 'waite' },
  research: { key: 'sources.research', cls: 'history' },
  school: { key: 'sources.school', cls: 'school' },
};

export function Sources() {
  const { t, l } = useI18n();
  return (
    <>
      <header className="row">
        <a href={href.learn()} className="icon-btn" aria-label={t('common.back')}><IconBack /></a>
        <div className="stack" style={{ gap: 2 }}>
          <h1 className="display h1">{t('sources.title')}</h1>
        </div>
      </header>
      <p className="p muted">{t('sources.subtitle')}</p>
      {SOURCES.map((s) => (
        <article key={s.id} className="card">
          <span className={`tag ${KIND[s.kind].cls}`}>{t(KIND[s.kind].key)}</span>
          <p className="p" style={{ fontWeight: 700, color: 'var(--text)' }}>{s.citation}</p>
          <p className="p" style={{ fontSize: 14 }}>{l(s.note)}</p>
        </article>
      ))}
    </>
  );
}
