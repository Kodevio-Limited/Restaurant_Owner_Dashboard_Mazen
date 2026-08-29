export function QrCodePlaceholder({ size = 154 }: { size?: number }) {
  const cells = 21;
  const gap = 0;
  const cellSize = (size - 2 * gap) / cells;

  const blocks: { x: number; y: number }[] = [];
  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      const on =
        (r < 7 && c < 7) ||
        (r < 7 && c >= cells - 7) ||
        (r >= cells - 7 && c < 7) ||
        (r >= 10 && r <= 14 && c >= 10 && c <= 14) ||
        (r === 0 && c === 20) ||
        (r === 5 && c === 5) ||
        (r === 6 && c === 4) ||
        (r === 8 && c === 8) ||
        (r === 12 && c === 3) ||
        (r === 3 && c === 12) ||
        (r === 15 && c === 15) ||
        (r === 17 && c === 9) ||
        (r === 9 && c === 17) ||
        (r % 2 === 0 && c % 3 === 0) ||
        (r % 3 === 0 && c % 2 === 0);
      if (on) blocks.push({ x: c, y: r });
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-xl">
      {/* Background */}
      <rect width={size} height={size} fill="white" rx={8} />
      {/* Finder patterns */}
      <rect x={gap + 1} y={gap + 1} width={cellSize * 7 - 1} height={cellSize * 7 - 1} fill="black" rx={2} />
      <rect x={gap + 2.5} y={gap + 2.5} width={cellSize * 6} height={cellSize * 6} fill="white" rx={1.5} />
      <rect x={gap + 4} y={gap + 4} width={cellSize * 4} height={cellSize * 4} fill="black" rx={1} />
      <rect x={size - gap - cellSize * 7} y={gap + 1} width={cellSize * 7 - 1} height={cellSize * 7 - 1} fill="black" rx={2} />
      <rect x={size - gap - cellSize * 6} y={gap + 2.5} width={cellSize * 6} height={cellSize * 6} fill="white" rx={1.5} />
      <rect x={size - gap - cellSize * 4} y={gap + 4} width={cellSize * 4} height={cellSize * 4} fill="black" rx={1} />
      <rect x={gap + 1} y={size - gap - cellSize * 7} width={cellSize * 7 - 1} height={cellSize * 7 - 1} fill="black" rx={2} />
      <rect x={gap + 2.5} y={size - gap - cellSize * 6} width={cellSize * 6} height={cellSize * 6} fill="white" rx={1.5} />
      <rect x={gap + 4} y={size - gap - cellSize * 4} width={cellSize * 4} height={cellSize * 4} fill="black" rx={1} />
      {/* Data cells */}
      {blocks.map((b, i) => (
        <rect
          key={i}
          x={gap + b.x * cellSize + 1}
          y={gap + b.y * cellSize + 1}
          width={cellSize - 1}
          height={cellSize - 1}
          fill="black"
          rx={0.5}
        />
      ))}
    </svg>
  );
}