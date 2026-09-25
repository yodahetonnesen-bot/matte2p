/** Logoen: søylediagram med en trendlinje og et prosenttegn – statistikk og prosent, kjernen i 2P. */
export function LogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <defs>
        <linearGradient id="lg-2p" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="oklch(0.52 0.19 262)" />
          <stop offset="1" stopColor="oklch(0.6 0.17 200)" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="38" height="38" rx="11" fill="url(#lg-2p)" />
      <rect x="8" y="23" width="5" height="9" rx="1.2" fill="white" opacity="0.55" />
      <rect x="15" y="18" width="5" height="14" rx="1.2" fill="white" opacity="0.7" />
      <rect x="22" y="13" width="5" height="19" rx="1.2" fill="white" opacity="0.85" />
      <path d="M7.5 22 L 16 17 L 24 11.5 L 32.5 7.5" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="30.3" cy="21.3" r="1.9" fill="none" stroke="white" strokeWidth="1.6" />
      <circle cx="34.2" cy="30.2" r="1.9" fill="none" stroke="white" strokeWidth="1.6" />
      <path d="M35.2 19.8 L 29.4 31.8" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
