import type { ReactNode } from 'react';
import { useI18n } from '../i18n/I18n';

/** Provisional emblem for Mysterium until the final realistic illustration exists. */
export function MysteriumEmblem({ size = 60 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="Mysterium" style={{ flexShrink: 0 }}>
      <circle cx="32" cy="32" r="31" fill="#372a66" stroke="#d4af6a" strokeWidth="1.5" />
      <circle cx="32" cy="32" r="26.5" fill="none" stroke="#d4af6a" strokeOpacity="0.35" />
      <path d="M32 17c-9 0-15 8-15 18v15h30V35c0-10-6-18-15-18z" fill="#45357d" stroke="#d4af6a" strokeWidth="1.2" />
      <path d="M32 24c-5.5 0-8.5 5-8.5 10.5S26.5 44 32 44s8.5-4 8.5-9.5S37.5 24 32 24z" fill="#1c1438" />
      <circle cx="28.8" cy="33" r="1.2" fill="#e9d3a1" />
      <circle cx="35.2" cy="33" r="1.2" fill="#e9d3a1" />
      <path d="M32 6l1.2 3 3.1.3-2.4 2 .8 3.1-2.7-1.7-2.7 1.7.8-3.1-2.4-2 3.1-.3z" fill="#d4af6a" />
    </svg>
  );
}

export function MysteriumSays({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  return (
    <section className="row" style={{ alignItems: 'flex-start' }} aria-label={t('home.mysterium')}>
      <MysteriumEmblem />
      <div className="card" style={{ borderRadius: '4px 18px 18px 18px', padding: '12px 14px', gap: 4 }}>
        <span className="display h3" style={{ color: 'var(--gold)', fontSize: 17 }}>Mysterium</span>
        <p className="p" style={{ fontSize: 14 }}>{children}</p>
      </div>
    </section>
  );
}
