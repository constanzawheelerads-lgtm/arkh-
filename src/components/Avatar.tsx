import { ROBES, type Avatar as AvatarState } from '../progress/model';

/** Illustrated student avatar. Accessories reward collectibles from the worlds. */
export function Avatar({ avatar, size = 108, label }: { avatar: AvatarState; size?: number; label: string }) {
  const robe = ROBES.find((r) => r.id === avatar.robe)?.color ?? ROBES[0].color;
  return (
    <svg width={size} height={size * (128 / 108)} viewBox="0 0 108 128" role="img" aria-label={label} style={{ flexShrink: 0 }}>
      <ellipse cx="54" cy="64" rx="52" ry="62" fill="#241a45" stroke="#d4af6a" strokeWidth="1.2" />
      <path d="M18 124c3-26 17-42 36-42s33 16 36 42z" fill={robe} />
      <path d="M54 82v42" stroke="#d4af6a" strokeWidth="1" strokeOpacity="0.6" />
      <path d="M54 22c-14 0-22 12-22 26v30h44V48c0-14-8-26-22-26z" fill={robe} />
      <path d="M54 34c-8 0-12 7-12 15s4 14 12 14 12-6 12-14-4-15-12-15z" fill="#d9b79c" />
      <path d="M48 50h4M56 50h4" stroke="#2a1b4d" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M51 57c2 1 4 1 6 0" stroke="#7a4e3a" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      {avatar.accessory === 'star' && (
        <path d="M54 6l2.2 5.4 5.8.5-4.4 3.8 1.3 5.7-4.9-3-4.9 3 1.3-5.7-4.4-3.8 5.8-.5z" fill="#e9d3a1" />
      )}
      {avatar.accessory === 'rose' && (
        <g transform="translate(70 92)">
          <path d="M0 0v18" stroke="#5f8a4e" strokeWidth="1.6" />
          <circle cx="0" cy="-2" r="5" fill="#f3ede1" stroke="#c9bfa8" />
          <path d="M-2.5 -2.5a2.5 2.5 0 0 1 5 0" stroke="#c9bfa8" fill="none" />
        </g>
      )}
      {avatar.accessory === 'lantern' && (
        <g transform="translate(26 88)">
          <path d="M6 0v4" stroke="#d4af6a" strokeWidth="1.4" />
          <rect x="1" y="4" width="10" height="13" rx="2" fill="#2a1f4e" stroke="#d4af6a" strokeWidth="1.2" />
          <path d="M6 7.5l1 2.2 2.3.2-1.8 1.5.6 2.3-2.1-1.3-2.1 1.3.6-2.3-1.8-1.5 2.3-.2z" fill="#e9d3a1" />
        </g>
      )}
      {avatar.accessory === 'wand' && (
        <g>
          <path d="M80 118L92 74" stroke="#c9a46a" strokeWidth="3" strokeLinecap="round" />
          <path d="M92 74l-1.5-4M92 74l3-3" stroke="#7fa26a" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}
