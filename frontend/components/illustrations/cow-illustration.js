"use client";

import { motion } from "framer-motion";

const markers = [
  { cx: 150, cy: 90, delay: 0 },
  { cx: 185, cy: 80, delay: 0.4 },
  { cx: 120, cy: 100, delay: 0.8 },
  { cx: 210, cy: 95, delay: 1.2 },
  { cx: 165, cy: 110, delay: 1.6 },
];

export default function CowIllustration({ className, showMarkers = false }) {
  return (
    <svg
      viewBox="0 0 300 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Shadow under cow */}
      <ellipse cx="160" cy="175" rx="100" ry="12" fill="oklch(0.55 0.16 155)" opacity="0.08" />

      {/* Cow body */}
      <ellipse cx="165" cy="110" rx="75" ry="45" fill="#D4A574" />

      {/* Cow belly lighter area */}
      <ellipse cx="165" cy="125" rx="60" ry="25" fill="#E8D5B7" />

      {/* Head */}
      <ellipse cx="72" cy="88" rx="30" ry="26" fill="#D4A574" />

      {/* Snout */}
      <ellipse cx="52" cy="98" rx="14" ry="10" fill="#E8D5B7" />
      {/* Nostrils */}
      <circle cx="48" cy="98" r="2" fill="#A0724A" />
      <circle cx="56" cy="98" r="2" fill="#A0724A" />

      {/* Eye */}
      <circle cx="66" cy="82" r="5" fill="#2D1B0E" />
      <circle cx="67.5" cy="81" r="2" fill="white" />

      {/* Ears */}
      <ellipse cx="90" cy="68" rx="12" ry="7" fill="#C4956A" transform="rotate(-10 90 68)" />
      <ellipse cx="55" cy="72" rx="12" ry="7" fill="#C4956A" transform="rotate(10 55 72)" />

      {/* Horns */}
      <path d="M72 65 Q68 45 78 42" stroke="#F5DEB3" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M85 62 Q88 43 82 38" stroke="#F5DEB3" strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* Spots */}
      <ellipse cx="140" cy="100" rx="18" ry="14" fill="#A0724A" opacity="0.4" />
      <ellipse cx="195" cy="105" rx="14" ry="18" fill="#A0724A" opacity="0.35" />
      <ellipse cx="165" cy="90" rx="10" ry="8" fill="#A0724A" opacity="0.3" />

      {/* Legs */}
      <rect x="110" y="148" width="14" height="30" rx="5" fill="#C4956A" />
      <rect x="135" y="150" width="14" height="28" rx="5" fill="#C4956A" />
      <rect x="190" y="148" width="14" height="30" rx="5" fill="#C4956A" />
      <rect x="210" y="150" width="14" height="28" rx="5" fill="#C4956A" />

      {/* Hooves */}
      <rect x="108" y="175" width="18" height="6" rx="3" fill="#8B6B4A" />
      <rect x="133" y="175" width="18" height="6" rx="3" fill="#8B6B4A" />
      <rect x="188" y="175" width="18" height="6" rx="3" fill="#8B6B4A" />
      <rect x="208" y="175" width="18" height="6" rx="3" fill="#8B6B4A" />

      {/* Tail */}
      <path d="M240 100 Q260 85 265 100 Q270 120 260 130" stroke="#A0724A" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="260" cy="133" rx="5" ry="7" fill="#A0724A" />

      {/* Disease marker dots (animated) */}
      {showMarkers &&
        markers.map((marker, i) => (
          <motion.circle
            key={`marker-${i}`}
            cx={marker.cx}
            cy={marker.cy}
            r="6"
            fill="#EF4444"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: marker.delay,
            }}
          />
        ))}
    </svg>
  );
}
