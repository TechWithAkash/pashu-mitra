"use client";

import { motion } from "framer-motion";

export default function HeroIllustration({ className }) {
  return (
    <svg
      viewBox="0 0 400 350"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Background blob */}
      <ellipse cx="200" cy="180" rx="180" ry="150" fill="oklch(0.55 0.16 155)" opacity="0.08" />

      {/* Ground */}
      <ellipse cx="200" cy="300" rx="170" ry="25" fill="oklch(0.55 0.16 155)" opacity="0.1" />

      {/* Cow body */}
      <ellipse cx="240" cy="220" rx="80" ry="50" fill="#A0724A" />
      {/* Cow belly */}
      <ellipse cx="240" cy="235" rx="65" ry="30" fill="#C4956A" />
      {/* Cow head */}
      <ellipse cx="150" cy="195" rx="32" ry="28" fill="#A0724A" />
      {/* Cow snout */}
      <ellipse cx="132" cy="205" rx="14" ry="10" fill="#C4956A" />
      {/* Cow eye */}
      <circle cx="145" cy="190" r="4" fill="#2D1B0E" />
      <circle cx="146" cy="189" r="1.5" fill="white" />
      {/* Cow ear */}
      <ellipse cx="165" cy="175" rx="10" ry="6" fill="#8B6914" transform="rotate(-20 165 175)" />
      {/* Cow horns */}
      <path d="M155 170 Q150 155 158 150" stroke="#D4A574" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M168 168 Q172 154 166 148" stroke="#D4A574" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Cow legs */}
      <rect x="190" y="260" width="12" height="40" rx="4" fill="#8B6B4A" />
      <rect x="215" y="262" width="12" height="38" rx="4" fill="#8B6B4A" />
      <rect x="265" y="260" width="12" height="40" rx="4" fill="#8B6B4A" />
      <rect x="285" y="262" width="12" height="38" rx="4" fill="#8B6B4A" />
      {/* Cow tail */}
      <path d="M320 210 Q340 195 335 220 Q330 240 325 235" stroke="#8B6914" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Cow spots */}
      <ellipse cx="220" cy="210" rx="15" ry="12" fill="#8B6B4A" opacity="0.5" />
      <ellipse cx="270" cy="215" rx="10" ry="14" fill="#8B6B4A" opacity="0.4" />

      {/* Farmer figure */}
      {/* Head */}
      <circle cx="80" cy="155" r="18" fill="#D4A574" />
      {/* Hair / turban */}
      <path d="M62 150 Q63 135 80 132 Q97 135 98 150" fill="#E8D5B7" />
      <path d="M65 148 Q67 138 80 136 Q93 138 95 148" fill="#F59E0B" opacity="0.8" />
      {/* Body (kurta) */}
      <path d="M62 173 L58 250 L102 250 L98 173 Q80 168 62 173Z" fill="white" />
      {/* Kurta border */}
      <path d="M62 173 L58 250 L102 250 L98 173" stroke="oklch(0.55 0.16 155)" strokeWidth="1" fill="none" opacity="0.3" />
      {/* Legs */}
      <rect x="65" y="250" width="13" height="40" rx="4" fill="#5C4033" />
      <rect x="83" y="250" width="13" height="40" rx="4" fill="#5C4033" />
      {/* Feet */}
      <rect x="62" y="286" width="18" height="6" rx="3" fill="#3D2B1F" />
      <rect x="81" y="286" width="18" height="6" rx="3" fill="#3D2B1F" />

      {/* Arm holding phone */}
      <path d="M98 185 L120 200 L118 205 L95 192Z" fill="#D4A574" />

      {/* Smartphone */}
      <rect x="112" y="192" width="24" height="40" rx="4" fill="#1a1a2e" />
      <rect x="114" y="196" width="20" height="32" rx="2" fill="#e8f5e9" />
      {/* Phone screen content - checkmark */}
      <path d="M120 210 L124 215 L132 205" stroke="oklch(0.55 0.16 155)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Camera icon on phone */}
      <circle cx="124" cy="195" r="1.5" fill="#555" />

      {/* Animated scan lines from phone to cow */}
      <motion.line
        x1="136" y1="200" x2="180" y2="200"
        stroke="oklch(0.55 0.16 155)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        animate={{ opacity: [0.2, 0.8, 0.2] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.line
        x1="136" y1="208" x2="175" y2="215"
        stroke="oklch(0.55 0.16 155)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        animate={{ opacity: [0.2, 0.8, 0.2] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      />
      <motion.line
        x1="136" y1="216" x2="178" y2="228"
        stroke="oklch(0.55 0.16 155)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        animate={{ opacity: [0.2, 0.8, 0.2] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      />

      {/* Scan pulse on cow */}
      <motion.circle
        cx="190" cy="210"
        r="8"
        fill="none"
        stroke="oklch(0.55 0.16 155)"
        strokeWidth="1.5"
        animate={{ r: [8, 18, 8], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}
