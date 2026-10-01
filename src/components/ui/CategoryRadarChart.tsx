import React, { useState } from 'react';

export interface CategoryValuationItem {
  id: string;
  label: string;
  skuCount: number;
  totalUnits: number;
  costBasis: number;
  sellingBasis: number;
  potentialProfit: number;
  profitMarginPercent: number;
}

export interface ValuationTotals {
  totalSkus: number;
  totalUnits: number;
  totalCostBasis: number;
  totalSellingBasis: number;
  totalProfit: number;
  totalMargin: number;
}

interface CategoryRadarChartProps {
  categories: CategoryValuationItem[];
  totals?: ValuationTotals;
}

export const CategoryRadarChart: React.FC<CategoryRadarChartProps> = ({ categories }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Exactly 3 requested categories
  const targetAxes = [
    { id: 'braking-system', label: 'Braking system', shortLabel: 'Braking system' },
    { id: 'drivetrain-chains', label: 'Drivetrain & chains', shortLabel: 'Drivetrain & chains' },
    { id: 'handle-bar-handle-grip', label: 'Handle Bar & Handle Grip', shortLabel: 'Handlebar & Grip' },
  ];

  // Match active categories or supply fallback defaults
  const radarItems = targetAxes.map((axis) => {
    const existing = categories.find(
      (c) =>
        c.id === axis.id ||
        (c.label.toLowerCase().includes('braking') && axis.id === 'braking-system') ||
        ((c.label.toLowerCase().includes('drivetrain') || c.label.toLowerCase().includes('chain')) && axis.id === 'drivetrain-chains') ||
        ((c.label.toLowerCase().includes('handle') || c.label.toLowerCase().includes('grip') || c.label.toLowerCase().includes('gear') || c.id === 'gears-sprockets') && axis.id === 'handle-bar-handle-grip')
    );
    if (existing) {
      return {
        ...existing,
        shortLabel: axis.shortLabel,
      };
    }
    return {
      id: axis.id,
      label: axis.label,
      shortLabel: axis.shortLabel,
      skuCount: 0,
      totalUnits: 0,
      costBasis: 0,
      sellingBasis: 0,
      potentialProfit: 0,
      profitMarginPercent: 0,
    };
  });

  // Radar Dimensions configured to fit mobile and desktop screens without text clipping
  const size = 360;
  const cx = size / 2;
  const cy = 175;
  const radius = 95;
  const totalAxes = radarItems.length; // 3

  const maxVal = Math.max(
    ...radarItems.map((item) => Math.max(item.sellingBasis, item.costBasis, item.totalUnits * 50)),
    1
  );

  const hasAnyData = radarItems.some((item) => item.totalUnits > 0 || item.sellingBasis > 0);

  // Concentric radar rings
  const rings = [0.25, 0.5, 0.75, 1.0];

  const getRingPoints = (level: number) => {
    return Array.from({ length: totalAxes })
      .map((_, i) => {
        const angle = i * ((2 * Math.PI) / totalAxes) - Math.PI / 2;
        const x = cx + radius * level * Math.cos(angle);
        const y = cy + radius * level * Math.sin(angle);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  };

  // Compute data polygon points
  const dataPoints = radarItems.map((item, i) => {
    const angle = i * ((2 * Math.PI) / totalAxes) - Math.PI / 2;
    const val = item.sellingBasis || item.costBasis || item.totalUnits;

    // Proportional ratio with balanced baseline so the triangle is visually appealing
    const ratio = hasAnyData && val > 0 ? Math.max(0.25, (val / maxVal) * 0.92) : hasAnyData ? 0.15 : 0.5;
    const x = cx + radius * ratio * Math.cos(angle);
    const y = cy + radius * ratio * Math.sin(angle);
    return { x, y, item, angle, val };
  });

  const polygonPointsString = dataPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const activeItem = hoveredIndex !== null ? dataPoints[hoveredIndex] : null;

  return (
    <div className="relative flex flex-col justify-between overflow-hidden bg-white dark:bg-[#0A0A0A] p-4 sm:p-6 rounded-2xl border border-brand-border dark:border-[#262626] shadow-xs font-poppins min-h-[380px] sm:min-h-[420px]">

      {/* Grid Layer matching Stock Flow Chart */}
      <div
        style={{ "--grid-color": "#80808015" } as React.CSSProperties}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full bg-transparent bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)] bg-[size:20px_20px] bg-center opacity-70 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"
      />

      {/* Subtle Radial Orange Glow matching Stock Flow Chart */}
      <div className="absolute inset-0 z-0 flex h-full w-full items-center justify-center pointer-events-none">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 360 360"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="360" height="360" fill="url(#paint_radar_ambient_glow)" />
          <defs>
            <radialGradient
              id="paint_radar_ambient_glow"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(180 180) rotate(90) scale(160 180)"
            >
              <stop stopColor="#FB714B" stopOpacity="0.22" />
              <stop offset="0.34" stopColor="#FB714B" stopOpacity="0.10" />
              <stop offset="1" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Header section */}
      <div className="relative z-10 flex flex-col mb-1">
        <span className="text-[#6F6F6F] dark:text-[#A1A1A1] text-xs font-medium block">
          by Parts
        </span>
        <h3 className="text-neutral-900 dark:text-[#EDEDED] text-sm sm:text-base font-bold tracking-tight">
          Movement performance by Category
        </h3>
      </div>

      {/* Centered Radar Chart - Fully Responsive on Mobile & Desktop */}
      <div className="relative z-10 flex-1 flex items-center justify-center py-1 sm:py-2 w-full">
        <div className="relative w-full max-w-[300px] sm:max-w-[340px] aspect-[360/340] select-none flex items-center justify-center">
          <svg
            viewBox="0 0 360 340"
            className="w-full h-full overflow-visible"
          >
            {/* Concentric Triangle Grid Rings */}
            {rings.map((ring, idx) => (
              <polygon
                key={idx}
                points={getRingPoints(ring)}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray={idx === rings.length - 1 ? 'none' : '2 2'}
                className="text-neutral-200 dark:text-[#262626]"
              />
            ))}

            {/* Radar Spokes radiating to each of the 3 categories */}
            {Array.from({ length: totalAxes }).map((_, i) => {
              const angle = i * ((2 * Math.PI) / totalAxes) - Math.PI / 2;
              const x2 = cx + radius * Math.cos(angle);
              const y2 = cy + radius * Math.sin(angle);
              return (
                <line
                  key={i}
                  x1={cx}
                  y1={cy}
                  x2={x2}
                  y2={y2}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-neutral-200 dark:text-[#262626]"
                />
              );
            })}

            {/* Radar Data Polygon with Translucent Orange Fill */}
            <polygon
              points={polygonPointsString}
              fill="rgba(251, 113, 75, 0.45)"
              stroke="#FB714B"
              strokeWidth="2"
              strokeLinejoin="round"
              className="transition-all duration-300 filter drop-shadow-xs"
            />

            {/* Interactive Points on Polygon Vertices (NO RED DOTS UNLESS HOVERED) */}
            {dataPoints.map((pt, i) => {
              const isHovered = hoveredIndex === i;
              return (
                <g key={i}>
                  {/* Active dot ONLY appears when hovered (no red dot when inactive) */}
                  {isHovered && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={6}
                      fill="#FB714B"
                      stroke="#ffffff"
                      strokeWidth={2.5}
                      className="pointer-events-none drop-shadow-sm animate-in fade-in zoom-in-75 duration-150"
                    />
                  )}
                  {/* Invisible hit-target for hover & tap */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={32}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => setHoveredIndex(hoveredIndex === i ? null : i)}
                  />
                </g>
              );
            })}

            {/* Spoke Category Labels for the 3 Categories */}
            {dataPoints.map((pt, i) => {
              const angle = pt.angle;
              const labelRadius = radius + 22;
              const lx = cx + labelRadius * Math.cos(angle);
              const ly = cy + labelRadius * Math.sin(angle);
              const isHovered = hoveredIndex === i;

              // Text alignment based on horizontal position
              let textAnchor: 'middle' | 'start' | 'end' = 'middle';
              if (Math.cos(angle) > 0.3) textAnchor = 'start';
              else if (Math.cos(angle) < -0.3) textAnchor = 'end';

              return (
                <text
                  key={i}
                  x={lx}
                  y={ly + (angle < 0 ? -6 : 8)}
                  textAnchor={textAnchor}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => setHoveredIndex(hoveredIndex === i ? null : i)}
                  className={`text-[9.5px] sm:text-[11px] font-semibold cursor-pointer transition-colors ${
                    isHovered
                      ? 'fill-brand-orange-dark dark:fill-[#FB714B]'
                      : 'fill-neutral-600 dark:fill-[#A1A1A1]'
                  }`}
                >
                  {pt.item.shortLabel}
                </text>
              );
            })}
          </svg>

          {/* Frosted Glassmorphism Floating Tooltip on Hover */}
          {activeItem && (
            <div
              className="absolute pointer-events-none z-30 backdrop-blur-xl bg-white/90 dark:bg-[#121212]/90 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-white/60 dark:border-white/10 shadow-2xl text-xs transition-all duration-150 animate-in fade-in zoom-in-95 min-w-[160px] sm:min-w-[170px]"
              style={{
                left: `${Math.min(170, Math.max(8, activeItem.x - 85))}px`,
                top: `${Math.min(190, Math.max(12, activeItem.y - 75))}px`,
              }}
            >
              <div className="flex items-center gap-1.5 mb-1.5 pb-1 border-b border-neutral-200/60 dark:border-white/10">
                <span className="font-bold text-neutral-900 dark:text-[#EDEDED] text-[11px]">
                  {activeItem.item.label}
                </span>
                <span className="text-[10px] text-neutral-400 ml-auto">
                  {activeItem.item.totalUnits} units
                </span>
              </div>

              <div className="flex flex-col gap-0.5 text-[10px]">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-xs bg-[#FB714B] shrink-0" />
                    <span className="text-neutral-500 dark:text-[#A1A1A1]">Sales:</span>
                  </div>
                  <span className="font-bold text-neutral-900 dark:text-white">
                    ₱{activeItem.item.sellingBasis.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-neutral-400 pl-3.5">Cost:</span>
                  <span className="font-medium text-neutral-700 dark:text-[#EDEDED]">
                    ₱{activeItem.item.costBasis.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 pt-0.5 border-t border-dashed border-neutral-200/60 dark:border-white/10">
                  <span className="text-neutral-400 pl-3.5">Profit:</span>
                  <span className="font-bold text-brand-orange-dark dark:text-[#FB714B]">
                    +₱{activeItem.item.potentialProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({activeItem.item.profitMarginPercent.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryRadarChart;
