export function LogoMark({ size = 38 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="Sanora logo">
      <defs>
        <linearGradient id="sanora-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#14A0AB" />
          <stop offset="1" stopColor="#0A5C66" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill="url(#sanora-grad)" />
      <path d="M20 12h8a2 2 0 0 1 2 2v6h6a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-6v6a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-6h-6a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h6v-6a2 2 0 0 1 2-2z" fill="#fff" />
      <circle cx="35" cy="13" r="3.2" fill="#F2784B" />
    </svg>
  );
}

export default function Logo({ light = false, size = 38 }) {
  return (
    <span className={`logo ${light ? 'light' : ''}`}>
      <LogoMark size={size} />
      <span className="logo-text">
        Sanora
        <small>Health</small>
      </span>
    </span>
  );
}