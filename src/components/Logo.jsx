import React from 'react';

export default function Logo({ className = "w-8 h-8", color = "black" }) {
  // Orange color for the accent parts
  const accent = "#FF5A00";
  // The base color for the rest
  const base = color === "white" ? "#FFFFFF" : "#141414";

  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Center Hexagon */}
      <polygon points="50,30 67.32,40 67.32,60 50,70 32.68,60 32.68,40" fill={accent} />

      {/* 6 Spokes */}
      <line x1="50" y1="30" x2="50" y2="15" stroke={accent} strokeWidth="6" />
      <line x1="67.32" y1="40" x2="80.31" y2="32.5" stroke={accent} strokeWidth="6" />
      <line x1="67.32" y1="60" x2="80.31" y2="67.5" stroke={accent} strokeWidth="6" />
      <line x1="50" y1="70" x2="50" y2="85" stroke={accent} strokeWidth="6" />
      <line x1="32.68" y1="60" x2="19.69" y2="67.5" stroke={accent} strokeWidth="6" />
      <line x1="32.68" y1="40" x2="19.69" y2="32.5" stroke={accent} strokeWidth="6" />

      {/* We use a circle with strokeDasharray to draw the 6 segments.
          Radius = 36. Circumference = 226.19467.
          226.19467 / 6 = 37.699.
          Dash = 34.699, Gap = 3.
      */}
      <g transform="rotate(-90 50 50)">
        {/* All segments in base color */}
        <circle cx="50" cy="50" r="36" fill="none" stroke={base} strokeWidth="24" strokeDasharray="34.699 3" strokeDashoffset="17.3495" />
        {/* Top-right segment in orange */}
        <circle cx="50" cy="50" r="36" fill="none" stroke={accent} strokeWidth="24" strokeDasharray="34.699 191.495" strokeDashoffset="-20.3495" />
      </g>
    </svg>
  );
}
