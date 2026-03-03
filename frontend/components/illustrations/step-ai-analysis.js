"use client";

import { motion } from "framer-motion";

const nodes = [
  { cx: 35, cy: 40 },
  { cx: 60, cy: 28 },
  { cx: 85, cy: 40 },
  { cx: 35, cy: 70 },
  { cx: 60, cy: 82 },
  { cx: 85, cy: 70 },
  { cx: 60, cy: 55 },
];

const connections = [
  [0, 1], [1, 2], [0, 3], [3, 4], [4, 5], [2, 5],
  [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6],
];

export default function StepAiAnalysis({ className }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Background circle */}
      <circle cx="60" cy="60" r="58" fill="oklch(0.58 0.13 200)" opacity="0.1" />

      {/* Connection lines */}
      {connections.map(([from, to], i) => (
        <line
          key={`line-${i}`}
          x1={nodes[from].cx}
          y1={nodes[from].cy}
          x2={nodes[to].cx}
          y2={nodes[to].cy}
          stroke="oklch(0.58 0.13 200)"
          strokeWidth="1"
          opacity="0.25"
        />
      ))}

      {/* Animated nodes */}
      {nodes.map((node, i) => (
        <motion.circle
          key={`node-${i}`}
          cx={node.cx}
          cy={node.cy}
          r={i === 6 ? 6 : 4}
          fill={i === 6 ? "oklch(0.55 0.16 155)" : "oklch(0.58 0.13 200)"}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.25,
          }}
        />
      ))}

      {/* Magnifying glass over center */}
      <circle cx="60" cy="55" r="14" stroke="oklch(0.55 0.16 155)" strokeWidth="2" fill="none" opacity="0.5" />
      <line x1="70" y1="65" x2="80" y2="76" stroke="oklch(0.55 0.16 155)" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}
