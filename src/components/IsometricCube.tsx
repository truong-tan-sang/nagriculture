import React from "react";

const COS30 = Math.sqrt(3) / 2;
const SIN30 = 0.5;

function project([X, Y, Z]) {
  const x = (X - Y) * COS30;
  const y = (X + Y) * SIN30 - Z;
  return [x, y];
}
function darkenColor(hex, amount = 0.3) {
  let c = hex.replace("#", "");
  if (c.length === 3) c = c.split("").map((ch) => ch + ch).join("");
  const num = parseInt(c, 16);
  let r = (num >> 16) & 255;
  let g = (num >> 8) & 255;
  let b = num & 255;
  r = Math.max(0, Math.min(255, r * (1 - amount)));
  g = Math.max(0, Math.min(255, g * (1 - amount)));
  b = Math.max(0, Math.min(255, b * (1 - amount)));
  return `rgb(${r}, ${g}, ${b})`;
}
// Color + height presets for the 4 visible stages
const riceStages = [
  { height: 0.0, color: "transparent" }, // 0: bare field
  { height: 0.3, color: "#9be7a5" },     // 1: seedlings (light green)
  { height: 0.6, color: "#4caf50" },     // 2: growing (green)
  { height: 0.9, color: "#2e7d32" },     // 3: mature (deep green)
  { height: 1.1, color: "#d4af37" },     // 4: ripe (gold)
];

function pointsToString(points) {
  return points.map((p) => p.join(",")).join(" ");
}

export default function IsometricCube({
  size = 360,
  side = 180,
  thickness = 0.3,
  growthStage = 0, // 👈 new prop
  colors = {
    top: "#a96c4f",
    left: "#d5a888",
    right: "#845751",
  },
  overlay = {
    enabled: true,
    thickness: 0.05,
    colors: {
      top: "rgba(119, 220, 245, 0.25)",
      left: "rgba(94, 206, 250, 0.7)",
      right: "rgba(52, 150, 175, 0.7)",
    },
  },
  stroke = "#0f172a",
  strokeWidth = 0,
  className = "",
}) {
  const s = side;
  const h = Math.max(0, Math.min(2, thickness)) * side;

  // cube points
  const A = [0, 0, -s];
  const B = [s, 0, 0];
  const C = [s, s, 0];
  const D = [0, s, 0];
  const E = [0, 0, h];
  const F = [s, 0, h];
  const G = [s, s, h];
  const H = [0, s, h];

  const pts = [A, B, C, D, E, F, G, H].map(project);
  const allX = pts.map((p) => p[0]);
  const allY = pts.map((p) => p[1]);
  const minX = Math.min(...allX);
  const minY = Math.min(...allY);
  const maxX = Math.max(...allX);
  const maxY = Math.max(...allY);
  const pad = Math.max(8, strokeWidth * 2);
  const viewW = maxX - minX;
  const viewH = maxY - minY;
  const scale = (size - pad * 2) / Math.max(viewW, viewH);
  const offsetX = (size - viewW * scale) / 2;
  const offsetY = (size - viewH * scale) / 2;

  const transform = (p) => [
    (p[0] - minX) * scale + offsetX,
    (p[1] - minY) * scale + offsetY,
  ];

  const [tA, tB, tC, tD, tE, tF, tG, tH] = pts.map(transform);
  const topPoints = pointsToString([tE, tF, tG, tH]);
  const leftPoints = pointsToString([tE, tH, tD, tA]);
  const rightPoints = pointsToString([tF, tG, tC, tB]);

  // overlay
  let overlayPolygons = null;
  if (overlay.enabled) {
    const oh = overlay.thickness * side;
    const E2 = [0, 0, h + oh];
    const F2 = [s, 0, h + oh];
    const G2 = [s, s, h + oh];
    const H2 = [0, s, h + oh];
    const [tE2, tF2, tG2, tH2] = [E2, F2, G2, H2].map((p) =>
      transform(project(p))
    );
    const overlayTop = pointsToString([tE2, tF2, tG2, tH2]);
    const overlayLeft = pointsToString([tG2, tH2, tH, tG]);
    const overlayRight = pointsToString([tF2, tG2, tG, tF]);
    overlayPolygons = (
      <>
        <polygon
          points={overlayLeft}
          fill={overlay.colors.left}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
        <polygon
          points={overlayRight}
          fill={overlay.colors.right}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
        <polygon
          points={overlayTop}
          fill={overlay.colors.top}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      </>
    );
  }

  // 🌾 Rice generation
  const ricePolygons = [];
  const oh = overlay.thickness * side;
  const stageData = riceStages[Math.max(0, Math.min(4, growthStage))];
  const riceHeight = side * stageData.height/2;
  const riceColor = stageData.color;
  const strokeColor = darkenColor(riceColor, 0.4); // ✅ make stroke darker
  const riceSpacing = side * 0.025;
  const ditchEvery = 4;

  if (growthStage > 0) {
    let rowIndex = 0;
    for (let y = riceSpacing / 2; y < s; y += riceSpacing) {
      rowIndex++;
      if (rowIndex % ditchEvery === 0) continue; // horizontal ditch
      for (let x = riceSpacing / 2; x < s; x += riceSpacing) {
        const colIndex = Math.round(x / riceSpacing);
        if (colIndex % ditchEvery === 0) continue; // vertical ditch

        const X = x + (Math.random() - 0.5) * riceSpacing * 0.2;
        const Y = y + (Math.random() - 0.5) * riceSpacing * 0.2;
        const Z = h + oh;
        const base = transform(project([X, Y, Z]));
        const top1 = transform(
          project([X, Y, Z + riceHeight * (0.9 + Math.random() * 0.3)])
        );
        const top2 = transform(
          project([
            X + (Math.random() - 0.5) * side * 0.08,
            Y + (Math.random() - 0.5) * side * 0.08,
            Z + riceHeight * (0.7 + Math.random() * 0.4),
          ])
        );

        ricePolygons.push(
          <polygon
            key={`rice-${x}-${y}`}
            points={pointsToString([base, top1, top2])}
            fill={riceColor}
            stroke={strokeColor}
            strokeWidth={0.4}
          />
        );
      }
    }
  }

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Isometric rice field"
      overflow="visible"
    >
      <defs>
        <pattern id="grainy" patternUnits="userSpaceOnUse" width="8" height="8">
          <circle cx="1" cy="1" r="0.8" fill="rgba(255, 255, 255, 0.6)" />
          <circle cx="5" cy="3" r="0.6" fill="rgba(142, 66, 0, 0.85)" />
          <circle cx="3" cy="6" r="0.5" fill="rgba(255,255,255,0.3)" />
        </pattern>
      </defs>

      <g>
        <polygon
          points={leftPoints}
          fill={colors.left}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
        <polygon
          points={leftPoints}
          fill="url(#grainy)"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
        <polygon
          points={rightPoints}
          fill={colors.right}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
        <polygon
          points={rightPoints}
          fill="url(#grainy)"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
        <polygon
          points={topPoints}
          fill={colors.top}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
        {overlayPolygons}
        {ricePolygons}
      </g>
    </svg>
  );
}
