/**
 * Signature product visual: Claim -> AI Engine -> Safe / Risk -> Investigation.
 * This is InsureGuard's recurring "AI is doing real work" motif (brief section
 * 46) — a static SVG diagram with subtle CSS-driven motion (pulsing nodes,
 * flowing dashed connectors) rather than a plain flowchart image.
 *
 * Pure presentation — takes no props, renders no live data, so it is safe to
 * drop into the landing hero or an empty dashboard state without implying
 * real fraud scores are shown.
 */
export function FraudEngineVisual({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 640 360"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Diagram: a submitted claim flows through the AI engine, is scored as safe or high risk, and high-risk claims move to investigation"
    >
      <defs>
        <linearGradient id="fe-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--brand-cyan)" />
          <stop offset="100%" stopColor="var(--primary)" />
        </linearGradient>
        <radialGradient id="fe-core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Claim node */}
      <g transform="translate(40,150)">
        <rect
          width="120"
          height="60"
          rx="14"
          fill="var(--surface-elevated)"
          stroke="var(--border)"
        />
        <text
          x="60"
          y="35"
          textAnchor="middle"
          fontSize="13"
          fontWeight="600"
          fill="var(--foreground)"
        >
          Claim
        </text>
      </g>

      {/* Connector: claim -> engine */}
      <path
        d="M160 180 H 250"
        stroke="url(#fe-line)"
        strokeWidth="2"
        className="animate-dash-flow"
        fill="none"
      />

      {/* AI engine core */}
      <g transform="translate(250,120)">
        <circle
          cx="60"
          cy="60"
          r="80"
          fill="url(#fe-core-glow)"
        />
        <circle
          cx="60"
          cy="60"
          r="52"
          fill="var(--surface-elevated)"
          stroke="var(--primary)"
          strokeWidth="1.5"
          className="animate-pulse-soft"
        />
        <circle cx="60" cy="60" r="34" fill="none" stroke="var(--brand-cyan)" strokeWidth="1" opacity="0.5" />
        <text
          x="60"
          y="55"
          textAnchor="middle"
          fontSize="12"
          fontWeight="700"
          fill="var(--foreground)"
        >
          AI
        </text>
        <text
          x="60"
          y="70"
          textAnchor="middle"
          fontSize="10"
          fill="var(--muted-foreground)"
        >
          Engine
        </text>
      </g>

      {/* Connectors: engine -> safe / risk */}
      <path
        d="M410 150 C 460 150, 460 90, 520 90"
        stroke="url(#fe-line)"
        strokeWidth="2"
        className="animate-dash-flow"
        fill="none"
      />
      <path
        d="M410 190 C 460 190, 460 250, 520 250"
        stroke="url(#fe-line)"
        strokeWidth="2"
        className="animate-dash-flow"
        fill="none"
      />

      {/* Safe node */}
      <g transform="translate(520,60)">
        <rect width="100" height="56" rx="14" fill="var(--surface-elevated)" stroke="var(--success)" strokeWidth="1.5" />
        <text x="50" y="33" textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--success)">
          Safe
        </text>
      </g>

      {/* Risk node */}
      <g transform="translate(520,222)">
        <rect width="100" height="56" rx="14" fill="var(--surface-elevated)" stroke="var(--destructive)" strokeWidth="1.5" />
        <text x="50" y="33" textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--destructive)">
          High Risk
        </text>
      </g>

      {/* Connector: risk -> investigation */}
      <path
        d="M570 278 V 320 H 320"
        stroke="var(--destructive)"
        strokeOpacity="0.6"
        strokeWidth="2"
        className="animate-dash-flow"
        fill="none"
      />

      <g transform="translate(220,296)">
        <rect width="140" height="46" rx="12" fill="var(--surface-elevated)" stroke="var(--border)" />
        <text x="70" y="29" textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--foreground)">
          Investigation
        </text>
      </g>
    </svg>
  );
}
