"use client";

export default function StepCamera({ className }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Background circle */}
      <circle cx="60" cy="60" r="58" fill="oklch(0.55 0.16 155)" opacity="0.1" />

      {/* Hand */}
      <path
        d="M38 90 Q35 78 37 65 L40 55 Q42 50 46 50 L48 65 L48 90Z"
        fill="#D4A574"
      />
      <path
        d="M48 50 L50 48 Q52 47 54 48 L54 65 L48 65Z"
        fill="#D4A574"
      />

      {/* Smartphone body */}
      <rect x="42" y="28" width="36" height="60" rx="5" fill="#1F2937" />
      {/* Screen */}
      <rect x="45" y="33" width="30" height="50" rx="3" fill="#E8F5E9" />

      {/* Camera viewfinder brackets */}
      {/* Top-left */}
      <path d="M50 40 L50 36 L56 36" stroke="oklch(0.55 0.16 155)" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Top-right */}
      <path d="M70 40 L70 36 L64 36" stroke="oklch(0.55 0.16 155)" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Bottom-left */}
      <path d="M50 72 L50 76 L56 76" stroke="oklch(0.55 0.16 155)" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Bottom-right */}
      <path d="M70 72 L70 76 L64 76" stroke="oklch(0.55 0.16 155)" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Center focus dot */}
      <circle cx="60" cy="56" r="3" stroke="oklch(0.55 0.16 155)" strokeWidth="1.5" fill="none" />
      <circle cx="60" cy="56" r="1" fill="oklch(0.55 0.16 155)" />

      {/* Capture button */}
      <circle cx="60" cy="85" r="4" fill="#374151" />
      <circle cx="60" cy="85" r="2.5" fill="#6B7280" />
    </svg>
  );
}
