"use client";

import { motion } from "framer-motion";

export default function FarmScene({ className }) {
  return (
    <svg
      viewBox="0 0 600 250"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMax meet"
      className={className}
      aria-hidden="true"
    >
      {/* Sky gradient */}
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="100%" stopColor="#FDE68A" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <rect width="600" height="250" fill="url(#skyGrad)" />

      {/* Sun */}
      <circle cx="480" cy="50" r="30" fill="#F59E0B" opacity="0.7" />
      <circle cx="480" cy="50" r="22" fill="#FBBF24" opacity="0.9" />

      {/* Clouds */}
      <motion.g
        animate={{ x: [0, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <ellipse cx="120" cy="45" rx="40" ry="14" fill="white" opacity="0.7" />
        <ellipse cx="145" cy="40" rx="30" ry="12" fill="white" opacity="0.6" />
        <ellipse cx="100" cy="42" rx="25" ry="10" fill="white" opacity="0.5" />
      </motion.g>
      <motion.g
        animate={{ x: [0, -12, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <ellipse cx="380" cy="35" rx="35" ry="12" fill="white" opacity="0.6" />
        <ellipse cx="400" cy="30" rx="25" ry="10" fill="white" opacity="0.5" />
      </motion.g>

      {/* Back hills — lightest */}
      <path d="M0 180 Q100 110 200 150 Q300 100 400 140 Q500 105 600 145 L600 250 L0 250Z" fill="oklch(0.72 0.19 155)" opacity="0.5" />

      {/* Barn on back hill */}
      <rect x="340" y="115" width="30" height="28" fill="#8B4513" opacity="0.6" />
      <path d="M335 115 L355 100 L375 115Z" fill="#A0522D" opacity="0.6" />
      <rect x="350" y="128" width="8" height="15" fill="#5C3310" opacity="0.5" />

      {/* Mid hills */}
      <path d="M0 200 Q80 155 180 185 Q280 145 380 175 Q480 150 600 180 L600 250 L0 250Z" fill="oklch(0.55 0.16 155)" opacity="0.5" />

      {/* Small cow silhouettes on mid hills */}
      <g opacity="0.4" transform="translate(150, 172)">
        <ellipse cx="12" cy="5" rx="12" ry="7" fill="#2D5016" />
        <ellipse cx="2" cy="2" rx="5" ry="4" fill="#2D5016" />
        <rect x="3" y="10" width="3" height="8" fill="#2D5016" />
        <rect x="15" y="10" width="3" height="8" fill="#2D5016" />
      </g>
      <g opacity="0.35" transform="translate(430, 160)">
        <ellipse cx="10" cy="4" rx="10" ry="6" fill="#2D5016" />
        <ellipse cx="1" cy="1" rx="4" ry="3.5" fill="#2D5016" />
        <rect x="3" y="8" width="2.5" height="7" fill="#2D5016" />
        <rect x="13" y="8" width="2.5" height="7" fill="#2D5016" />
      </g>

      {/* Front hills — darkest */}
      <path d="M0 220 Q100 190 200 210 Q300 185 400 205 Q500 190 600 215 L600 250 L0 250Z" fill="oklch(0.45 0.14 155)" opacity="0.6" />

      {/* Grass tufts on front hill */}
      <g opacity="0.3">
        <path d="M50 225 Q52 218 54 225" stroke="oklch(0.35 0.14 155)" strokeWidth="1.5" fill="none" />
        <path d="M180 215 Q182 208 184 215" stroke="oklch(0.35 0.14 155)" strokeWidth="1.5" fill="none" />
        <path d="M320 210 Q322 203 324 210" stroke="oklch(0.35 0.14 155)" strokeWidth="1.5" fill="none" />
        <path d="M500 218 Q502 211 504 218" stroke="oklch(0.35 0.14 155)" strokeWidth="1.5" fill="none" />
      </g>
    </svg>
  );
}
