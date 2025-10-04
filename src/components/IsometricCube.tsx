import React from 'react';

const COS30 = Math.sqrt(3) / 2;
const SIN30 = 0.5;

function project([X, Y, Z]) {
  const x = (X - Y) * COS30;
  const y = (X + Y) * SIN30 - Z;
  return [x, y];
}

function pointsToString(points) {
  return points.map((p) => p.join(',')).join(' ');
}

export default function IsometricCube({
  size = 360,
  side = 180,
  thickness = 0.3,
  colors = { top: '#a96c4f', left: '#d5a888', right: '#845751' },
  overlay = { enabled: true, thickness: 0.05, colors: { top: '#77dcf5e6', left: '#5ecefea3', right: '#3496afc3' } },
  stroke = '#0f172a',
  strokeWidth = 0,
  className = '',
}) {
  const s = side;
  const h = Math.max(0, Math.min(2, thickness)) * side;

  // bottom (Z=0): A(0,0,0), B(s,0,0), C(s,s,0), D(0,s,0)
  // top    (Z=h): E(0,0,h), F(s,0,h), G(s,s,h), H(0,s,h)
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

  // offset để căn giữa
  const offsetX = (size - (viewW * scale)) / 2;
  const offsetY = (size - (viewH * scale)) / 2;

  const transform = (p) => [
    (p[0] - minX) * scale + offsetX,
    (p[1] - minY) * scale + offsetY,
  ];

  const [tA, tB, tC, tD, tE, tF, tG, tH] = pts.map(transform);

  const topPoints = pointsToString([tE, tF, tG, tH]);
  const leftPoints = pointsToString([tE, tH, tD, tA]);
  const rightPoints = pointsToString([tF, tG, tC, tB]);

  let overlayPolygons = null;
  if (overlay.enabled) {
    const oh = overlay.thickness * side;
    const E2 = [0, 0, h + oh];
    const F2 = [s, 0, h + oh];
    const G2 = [s, s, h + oh];
    const H2 = [0, s, h + oh];

    const [tE2, tF2, tG2, tH2] = [E2, F2, G2, H2].map((p) => transform(project(p)));

    const overlayTop = pointsToString([tE2, tF2, tG2, tH2]);
    const overlayLeft = pointsToString([tG2, tH2, tH, tG]);
    const overlayRight = pointsToString([tF2, tG2, tG, tF]);

    overlayPolygons = (
      <>
        <polygon points={overlayLeft} fill={overlay.colors.left} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
        <polygon points={overlayRight} fill={overlay.colors.right} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
        <polygon points={overlayTop} fill={overlay.colors.top} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
      </>
    );
  }

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Isometric cube with optional overlay"
      overflow={"visible"}
    >
      <g>
        <polygon points={leftPoints} fill={colors.left} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
        <polygon points={rightPoints} fill={colors.right} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
        <polygon points={topPoints} fill={colors.top} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
        {overlayPolygons}
      </g>
    </svg>
  );
}
