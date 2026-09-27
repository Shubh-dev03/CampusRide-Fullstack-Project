/**
 * Custom "Clean & Friendly" hero illustration for the CampusRide landing page.
 * Built as inline SVG (no raster assets) so it stays crisp at any size and
 * recolors cleanly for dark mode via currentColor + the classNames below.
 */
export default function CampusRideHero({ className = "" }) {
  return (
    <svg
      viewBox="0 0 560 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Illustration of a car driving past campus buildings"
    >
      {/* Sky / backdrop blob */}
      <circle cx="300" cy="190" r="190" className="fill-primary-light dark:fill-surface-dark-raised" />

      {/* Sun / accent circle */}
      <circle cx="450" cy="90" r="34" className="fill-cta/20" />
      <circle cx="450" cy="90" r="20" className="fill-cta/40" />

      {/* Campus buildings silhouette */}
      <g className="fill-primary/25 dark:fill-primary/20">
        <rect x="70" y="180" width="60" height="110" rx="6" />
        <rect x="140" y="150" width="50" height="140" rx="6" />
        <rect x="380" y="165" width="55" height="125" rx="6" />
        <rect x="445" y="195" width="45" height="95" rx="6" />
      </g>
      <g className="fill-primary/40 dark:fill-primary/35">
        <rect x="85" y="200" width="10" height="14" rx="2" />
        <rect x="105" y="200" width="10" height="14" rx="2" />
        <rect x="85" y="230" width="10" height="14" rx="2" />
        <rect x="105" y="230" width="10" height="14" rx="2" />
        <rect x="155" y="175" width="10" height="14" rx="2" />
        <rect x="175" y="175" width="10" height="14" rx="2" />
        <rect x="155" y="205" width="10" height="14" rx="2" />
        <rect x="175" y="205" width="10" height="14" rx="2" />
        <rect x="395" y="190" width="10" height="14" rx="2" />
        <rect x="415" y="190" width="10" height="14" rx="2" />
      </g>

      {/* Road */}
      <rect x="0" y="300" width="560" height="46" className="fill-ink/10 dark:fill-ink-dark/10" />
      <g className="fill-surface dark:fill-surface-dark">
        <rect x="20" y="321" width="34" height="6" rx="3" />
        <rect x="90" y="321" width="34" height="6" rx="3" />
        <rect x="160" y="321" width="34" height="6" rx="3" />
        <rect x="230" y="321" width="34" height="6" rx="3" />
        <rect x="300" y="321" width="34" height="6" rx="3" />
        <rect x="370" y="321" width="34" height="6" rx="3" />
        <rect x="440" y="321" width="34" height="6" rx="3" />
        <rect x="510" y="321" width="34" height="6" rx="3" />
      </g>

      {/* Car */}
      <g transform="translate(160, 235)">
        <ellipse cx="120" cy="88" rx="118" ry="10" className="fill-ink/10 dark:fill-ink-dark/10" />
        <path
          d="M18 62 L34 26 Q40 16 52 16 H188 Q200 16 206 26 L222 62 Z"
          className="fill-primary"
        />
        <path
          d="M56 20 L48 46 H190 L182 20 Q178 16 172 16 H62 Q58 16 56 20Z"
          className="fill-primary-light"
        />
        <rect x="8" y="58" width="224" height="26" rx="10" className="fill-primary-hover" />
        <circle cx="62" cy="86" r="20" className="fill-ink dark:fill-ink-dark" />
        <circle cx="62" cy="86" r="9" className="fill-surface dark:fill-surface-dark" />
        <circle cx="180" cy="86" r="20" className="fill-ink dark:fill-ink-dark" />
        <circle cx="180" cy="86" r="9" className="fill-surface dark:fill-surface-dark" />
        <rect x="30" y="66" width="14" height="8" rx="3" className="fill-cta" />
      </g>

      {/* Leaf accent (eco-friendly touch) */}
      <g transform="translate(60, 90)">
        <path
          d="M0 30 C0 10 20 0 40 0 C40 20 30 30 10 30 Z"
          className="fill-success/40"
        />
      </g>
    </svg>
  );
}
