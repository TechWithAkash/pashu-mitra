"use client";

export default function StepResults({ className }) {
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

      {/* Clipboard body */}
      <rect x="35" y="30" width="50" height="65" rx="6" fill="white" stroke="oklch(0.55 0.16 155)" strokeWidth="1.5" opacity="0.8" />

      {/* Clipboard clip */}
      <rect x="48" y="24" width="24" height="12" rx="4" fill="oklch(0.55 0.16 155)" opacity="0.6" />
      <rect x="54" y="22" width="12" height="6" rx="3" fill="oklch(0.55 0.16 155)" opacity="0.8" />

      {/* Green checkmark */}
      <path
        d="M48 55 L56 64 L74 44"
        stroke="oklch(0.55 0.16 155)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Text line placeholders */}
      <rect x="43" y="74" width="34" height="4" rx="2" fill="oklch(0.55 0.16 155)" opacity="0.2" />
      <rect x="43" y="82" width="26" height="4" rx="2" fill="oklch(0.55 0.16 155)" opacity="0.15" />
    </svg>
  );
}
