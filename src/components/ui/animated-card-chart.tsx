"use client";

import * as React from "react";
import { useState } from "react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { cn } from "@/lib/utils";
export { cn };

// --- Card Components ---

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AnimatedCard({ className, ...props }: CardProps) {
  return (
    <div
      role="region"
      aria-labelledby="card-title"
      aria-describedby="card-description"
      className={cn(
        "group/animated-card relative w-full overflow-hidden rounded-2xl border border-brand-border dark:border-[#262626] bg-white dark:bg-[#0A0A0A] shadow-xs transition-colors",
        className
      )}
      {...props}
    />
  );
}

export function CardBody({ className, ...props }: CardProps) {
  return (
    <div
      role="group"
      className={cn(
        "flex flex-col space-y-1 border-t border-brand-border dark:border-[#262626] p-4 sm:p-5 bg-white dark:bg-[#0A0A0A]",
        className
      )}
      {...props}
    />
  );
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <h3
      className={cn(
        "text-base font-semibold leading-tight tracking-tight text-neutral-900 dark:text-[#EDEDED]",
        className
      )}
      {...props}
    />
  );
}

interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <p
      className={cn(
        "text-xs text-neutral-500 dark:text-[#A1A1A1]",
        className
      )}
      {...props}
    />
  );
}

export function CardVisual({ className, ...props }: CardProps) {
  return (
    <div
      className={cn("relative h-[180px] w-full overflow-hidden bg-white dark:bg-[#0A0A0A]", className)}
      {...props}
    />
  );
}

// --- Visual3 Component (Exact Reference from Prompt) ---

interface Visual3Props {
  mainColor?: string;
  secondaryColor?: string;
  gridColor?: string;
}

export function Visual3({
  mainColor = "#ff6900",
  secondaryColor = "#71717A",
  gridColor = "#80808015",
}: Visual3Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <div
        className="absolute inset-0 z-20 cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={
          {
            "--color": mainColor,
            "--secondary-color": secondaryColor,
          } as React.CSSProperties
        }
      />

      <div className="relative h-[180px] w-full overflow-hidden bg-white flex items-center justify-center">
        <Layer4
          color={mainColor}
          secondaryColor={secondaryColor}
          hovered={hovered}
        />
        <Layer3 color={mainColor} />
        <Layer2 color={mainColor} />
        <Layer1 color={mainColor} secondaryColor={secondaryColor} />
        <EllipseGradient color={mainColor} />
        <GridLayer color={gridColor} />
      </div>
    </>
  );
}

interface LayerProps {
  color: string;
  secondaryColor?: string;
  hovered?: boolean;
}

const GridLayer: React.FC<{ color: string }> = ({ color }) => {
  return (
    <div
      style={{ "--grid-color": color } as React.CSSProperties}
      className="pointer-events-none absolute inset-0 z-[4] h-full w-full bg-transparent bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)] bg-[size:20px_20px] bg-center opacity-70 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"
    />
  );
};

const EllipseGradient: React.FC<{ color: string }> = ({ color }) => {
  return (
    <div className="absolute inset-0 z-[5] flex h-full w-full items-center justify-center pointer-events-none">
      <svg
        width="356"
        height="180"
        viewBox="0 0 356 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="356" height="180" fill="url(#paint0_radial_12_207)" />
        <defs>
          <radialGradient
            id="paint0_radial_12_207"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(178 98) rotate(90) scale(98 178)"
          >
            <stop stopColor={color} stopOpacity="0.22" />
            <stop offset="0.34" stopColor={color} stopOpacity="0.12" />
            <stop offset="1" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
};

const Layer1: React.FC<LayerProps> = ({ color, secondaryColor }) => {
  return (
    <div
      className="absolute top-4 left-4 z-[10] flex items-center gap-1.5 pointer-events-none"
      style={
        {
          "--color": color,
          "--secondary-color": secondaryColor,
        } as React.CSSProperties
      }
    >
      <div className="flex shrink-0 items-center rounded-full border border-zinc-200 bg-white px-2 py-0.5 shadow-2xs transition-opacity duration-300 ease-in-out group-hover/animated-card:opacity-0">
        <div className="h-1.5 w-1.5 rounded-full bg-[var(--color)]" />
        <span className="ml-1 text-[11px] font-medium text-neutral-800">
          +15,2%
        </span>
      </div>
      <div className="flex shrink-0 items-center rounded-full border border-zinc-200 bg-white px-2 py-0.5 shadow-2xs transition-opacity duration-300 ease-in-out group-hover/animated-card:opacity-0">
        <div className="h-1.5 w-1.5 rounded-full bg-[var(--secondary-color)]" />
        <span className="ml-1 text-[11px] font-medium text-neutral-800">
          +18,7%
        </span>
      </div>
    </div>
  );
};

const Layer2: React.FC<{ color: string }> = ({ color }) => {
  return (
    <div
      className="group relative h-full w-full pointer-events-none"
      style={{ "--color": color } as React.CSSProperties}
    >
      <div className="ease-[cubic-bezier(0.6, 0.6, 0, 1)] absolute inset-0 z-[12] flex w-full translate-y-full items-start justify-center bg-transparent pt-3 px-4 transition-transform duration-500 group-hover/animated-card:translate-y-0">
        <div className="ease-[cubic-bezier(0.6, 0, 1)] rounded-full border border-zinc-200 bg-white px-3 py-1 opacity-0 shadow-xs transition-opacity duration-500 group-hover/animated-card:opacity-100 flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-[var(--color)]" />
          <p className="text-[11px] font-semibold text-neutral-900">
            Stock Distribution
          </p>
          <span className="text-[10px] text-neutral-400">•</span>
          <p className="text-[11px] text-neutral-500 font-medium">
            Active Velocity Stats
          </p>
        </div>
      </div>
    </div>
  );
};

const Layer3: React.FC<{ color: string }> = ({ color }) => {
  return (
    <div className="ease-[cubic-bezier(0.6, 0.6, 0, 1)] absolute inset-0 z-[6] flex translate-y-full items-center justify-center opacity-0 transition-all duration-500 group-hover/animated-card:translate-y-0 group-hover/animated-card:opacity-100 pointer-events-none">
      <svg
        width="356"
        height="180"
        viewBox="0 0 356 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="356" height="180" fill="url(#paint0_linear_29_3)" />
        <defs>
          <linearGradient
            id="paint0_linear_29_3"
            x1="178"
            y1="0"
            x2="178"
            y2="180"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.35" stopColor={color} stopOpacity="0" />
            <stop offset="1" stopColor={color} stopOpacity="0.15" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

const Layer4: React.FC<LayerProps> = ({ color, secondaryColor, hovered }) => {
  const rectsData = [
    { width: 14, height: 20, y: 110, hoverHeight: 20, hoverY: 130, x: 40, fill: "currentColor", hoverFill: secondaryColor },
    { width: 14, height: 20, y: 90, hoverHeight: 20, hoverY: 130, x: 60, fill: color, hoverFill: color },
    { width: 14, height: 40, y: 70, hoverHeight: 30, hoverY: 120, x: 80, fill: color, hoverFill: color },
    { width: 14, height: 30, y: 80, hoverHeight: 50, hoverY: 100, x: 100, fill: color, hoverFill: color },
    { width: 14, height: 30, y: 110, hoverHeight: 40, hoverY: 110, x: 120, fill: "currentColor", hoverFill: secondaryColor },
    { width: 14, height: 50, y: 110, hoverHeight: 20, hoverY: 130, x: 140, fill: "currentColor", hoverFill: secondaryColor },
    { width: 14, height: 50, y: 60, hoverHeight: 30, hoverY: 120, x: 160, fill: color, hoverFill: color },
    { width: 14, height: 30, y: 80, hoverHeight: 20, hoverY: 130, x: 180, fill: color, hoverFill: color },
    { width: 14, height: 20, y: 110, hoverHeight: 40, hoverY: 110, x: 200, fill: "currentColor", hoverFill: secondaryColor },
    { width: 14, height: 40, y: 70, hoverHeight: 60, hoverY: 90, x: 220, fill: color, hoverFill: color },
    { width: 14, height: 30, y: 110, hoverHeight: 70, hoverY: 80, x: 240, fill: "currentColor", hoverFill: secondaryColor },
    { width: 14, height: 50, y: 110, hoverHeight: 50, hoverY: 100, x: 260, fill: "currentColor", hoverFill: secondaryColor },
    { width: 14, height: 20, y: 110, hoverHeight: 80, hoverY: 70, x: 280, fill: "currentColor", hoverFill: secondaryColor },
    { width: 14, height: 30, y: 80, hoverHeight: 90, hoverY: 60, x: 300, fill: color, hoverFill: color },
  ];

  return (
    <div className="ease-[cubic-bezier(0.6, 0.6, 0, 1)] absolute inset-0 z-[8] flex h-[180px] w-full items-center justify-center text-neutral-800/10 transition-transform duration-500 group-hover/animated-card:scale-105 pointer-events-none">
      <svg width="356" height="180" viewBox="0 0 356 180" xmlns="http://www.w3.org/2000/svg">
        {rectsData.map((rect, index) => (
          <rect
            key={index}
            width={rect.width}
            height={hovered ? rect.hoverHeight : rect.height}
            x={rect.x}
            y={hovered ? rect.hoverY : rect.y}
            fill={hovered ? rect.hoverFill : rect.fill}
            rx="2"
            ry="2"
            className="ease-[cubic-bezier(0.6, 0.6, 0, 1)] transition-all duration-500"
          />
        ))}
      </svg>
    </div>
  );
};

// --- Minimalist Stock Flow Chart (Clean White Aesthetic Matching Screenshot) ---

export interface StockDataPoint {
  label: string;
  stockIn: number;
  stockOut: number;
}

export interface MinimalStockChartProps {
  period: 'daily' | 'weekly' | 'monthly';
  onPeriodChange: (period: 'daily' | 'weekly' | 'monthly') => void;
  data: StockDataPoint[];
  totalIn: number;
  totalOut: number;
  title?: string;
  description?: string;
}

export function MinimalStockChart({
  period,
  onPeriodChange,
  data,
  totalIn,
  totalOut,
  title = "Stock Flow Distribution",
  description,
}: MinimalStockChartProps) {
  const [hovered, setHovered] = useState(false);

  const mainColor = "#FB714B"; // Brand orange matching category chart
  const secondaryColor = "#71717A"; // Neutral gray for stock out

  // Dynamic bar generator based on stock in (upward) and stock out (downward)
  const maxVal = Math.max(1, ...data.map((d) => Math.max(d.stockIn, d.stockOut)));

  const slotWidth = Math.min(74, Math.floor(480 / Math.max(1, data.length)));
  const startOffset = Math.max(28, Math.floor((540 - data.length * slotWidth) / 2));
  const baselineY = 145;
  const barWidth = 19;
  const barGap = 4;

  // Generate balanced, enlarged bars (upward Stock In, downward Stock Out)
  const rects = data.flatMap((item, idx) => {
    const xBase = startOffset + idx * slotWidth;
    const inRatio = item.stockIn / maxVal;
    const outRatio = item.stockOut / maxVal;

    // Upward bar (Stock In: orange)
    const inHeight = item.stockIn > 0 ? Math.min(95, Math.max(22, Math.round(inRatio * 90))) : (idx % 2 === 1 ? 32 : 18);
    const inHoverHeight = inHeight + 16;
    const inY = baselineY - inHeight;
    const inHoverY = baselineY - inHoverHeight;

    // Downward bar (Stock Out: neutral gray)
    const outHeight = item.stockOut > 0 ? Math.min(72, Math.max(20, Math.round(outRatio * 66))) : (idx % 3 === 0 ? 36 : 22);
    const outHoverHeight = outHeight + 12;
    const outY = baselineY + 2;
    const outHoverY = baselineY + 2;

    return [
      {
        width: barWidth,
        height: inHeight,
        hoverHeight: inHoverHeight,
        x: xBase,
        y: inY,
        hoverY: inHoverY,
        fill: mainColor,
        hoverFill: mainColor,
        isUp: true,
        label: `${item.label}: ${item.stockIn} In`,
      },
      {
        width: barWidth,
        height: outHeight,
        hoverHeight: outHoverHeight,
        x: xBase + barWidth + barGap,
        y: outY,
        hoverY: outHoverY,
        fill: "#D4D4D8",
        hoverFill: "#71717A",
        isUp: false,
        label: `${item.label}: ${item.stockOut} Out`,
      },
    ];
  });

  const netBalance = totalIn - totalOut;

  return (
    <AnimatedCard className="w-full rounded-2xl border border-brand-border dark:border-[#262626] bg-white dark:bg-[#0A0A0A] shadow-xs overflow-hidden">
      {/* Visual Area (Pure white background with subtle grid & orange glow, maximized) */}
      <CardVisual className="relative h-[240px] sm:h-[260px] w-full overflow-hidden bg-white dark:bg-[#0A0A0A] flex items-center justify-center">
        {/* Interaction trigger - handles both mouse hover and touch/click on mobile */}
        <div
          className="absolute inset-0 z-20 cursor-pointer"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => setHovered((prev) => !prev)}
        />

        {/* Minimalist Top-Left Badges - fade on hover */}
        <div className={`absolute top-3 left-3 sm:left-4 z-[10] flex items-center gap-1.5 pointer-events-none transition-opacity duration-300 ${
          hovered ? 'opacity-0' : 'opacity-100 group-hover/animated-card:opacity-0'
        }`}>
          <div className="flex shrink-0 items-center rounded-full border border-[#FB714B]/30 bg-[#FB714B]/10 dark:bg-[#FB714B]/15 px-2 py-0.5 shadow-2xs">
            <span className="text-[10px] sm:text-[11px] font-bold text-[#FB714B]">
              +{totalIn} In
            </span>
          </div>
          <div className="flex shrink-0 items-center rounded-full border border-brand-border dark:border-[#262626] bg-white dark:bg-[#121212] px-2 py-0.5 shadow-2xs">
            <span className="text-[10px] sm:text-[11px] font-medium text-neutral-600 dark:text-[#A1A1A1]">
              -{totalOut} Out
            </span>
          </div>
        </div>

        {/* Minimalist Top-Right Period Switcher (Daily / Weekly / Monthly) */}
        <div className="absolute top-3 right-3 sm:right-4 z-[25] flex items-center gap-1">
          {(['daily', 'weekly', 'monthly'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPeriodChange(p);
              }}
              className={`px-2 py-0.5 text-[9.5px] sm:text-[11px] rounded-full capitalize font-medium transition-all cursor-pointer border ${
                period === p
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-2xs'
                  : 'bg-white dark:bg-[#121212] text-neutral-500 dark:text-[#A1A1A1] hover:text-neutral-900 dark:hover:text-white border-brand-border dark:border-[#262626] hover:bg-neutral-50 dark:hover:bg-[#1C1C1C]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Clean Hover Slide-Down Overview (Positioned safely below top buttons to never overlap) */}
        <div className={`ease-[cubic-bezier(0.6, 0.6, 0, 1)] absolute inset-x-0 top-0 z-[12] flex w-full items-start justify-center bg-transparent pt-11 px-3 transition-transform duration-500 pointer-events-none ${
          hovered ? 'translate-y-0' : 'translate-y-full group-hover/animated-card:translate-y-0'
        }`}>
          <div className={`ease-[cubic-bezier(0.6, 0, 1)] rounded-full border border-brand-border dark:border-[#262626] bg-white/95 dark:bg-[#121212]/95 backdrop-blur-md px-3 py-0.5 sm:px-3.5 sm:py-1 shadow-md transition-opacity duration-500 flex items-center gap-1.5 sm:gap-2 max-w-[95%] sm:max-w-none ${
            hovered ? 'opacity-100' : 'opacity-0 group-hover/animated-card:opacity-100'
          }`}>
            <span className="text-[10px] sm:text-[11px] font-semibold text-neutral-900 dark:text-[#EDEDED] capitalize whitespace-nowrap">
              {period} Flow:
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#FB714B] font-bold whitespace-nowrap">+{totalIn} In</span>
            <span className="text-neutral-300 dark:text-neutral-600">•</span>
            <span className="text-[10px] sm:text-[11px] text-neutral-600 dark:text-[#A1A1A1] font-bold whitespace-nowrap">-{totalOut} Out</span>
            <span className="text-neutral-300 dark:text-neutral-600">•</span>
            <span className="text-[10px] sm:text-[11px] font-bold text-neutral-900 dark:text-[#EDEDED] whitespace-nowrap">
              Net {netBalance >= 0 ? `+${netBalance}` : netBalance}
            </span>
          </div>
        </div>

        {/* Subtle Radial Glow */}
        <div className="absolute inset-0 z-[5] flex h-full w-full items-center justify-center pointer-events-none">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 540 255"
            fill="none"
            className="w-full h-full max-w-[540px]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="540" height="255" fill="url(#paint_minimal_glow)" />
            <defs>
              <radialGradient
                id="paint_minimal_glow"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(270 140) rotate(90) scale(120 260)"
              >
                <stop stopColor={mainColor} stopOpacity="0.22" />
                <stop offset="0.34" stopColor={mainColor} stopOpacity="0.10" />
                <stop offset="1" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* Grid Layer */}
        <div
          style={{ "--grid-color": "#80808015" } as React.CSSProperties}
          className="pointer-events-none absolute inset-0 z-[4] h-full w-full bg-transparent bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)] bg-[size:20px_20px] bg-center opacity-70 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"
        />

        {/* SVG Dynamic Bars (Centered, Animated, Maximized) */}
        <div className={`ease-[cubic-bezier(0.6, 0.6, 0, 1)] absolute inset-0 z-[8] flex h-full w-full items-center justify-center text-neutral-800/10 transition-transform duration-500 pointer-events-none ${
          hovered ? 'scale-[1.02]' : 'group-hover/animated-card:scale-[1.02]'
        }`}>
          <svg width="100%" height="100%" viewBox="0 0 540 255" className="w-full h-full max-w-[540px] px-1" xmlns="http://www.w3.org/2000/svg">
            {/* Subtle baseline divider */}
            <line
              x1={startOffset - 16}
              y1={baselineY}
              x2={startOffset + data.length * slotWidth + 6}
              y2={baselineY}
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="3 3"
              className="text-neutral-300 dark:text-[#2E2E2E]"
            />

            {/* Bars with animated hover heights */}
            {rects.map((rect, index) => (
              <rect
                key={index}
                width={rect.width}
                height={hovered ? rect.hoverHeight : rect.height}
                x={rect.x}
                y={hovered ? rect.hoverY : rect.y}
                fill={hovered ? rect.hoverFill : rect.fill}
                rx="3"
                ry="3"
                className="ease-[cubic-bezier(0.6, 0.6, 0, 1)] transition-all duration-500 filter drop-shadow-2xs"
              >
                <title>{rect.label}</title>
              </rect>
            ))}

            {/* Time period labels under each bar pair */}
            {data.map((item, idx) => {
              const xCenter = startOffset + idx * slotWidth + barWidth + 2;
              return (
                <text
                  key={idx}
                  x={xCenter}
                  y={242}
                  textAnchor="middle"
                  className="text-[9.5px] sm:text-[11px] font-semibold fill-neutral-600 dark:fill-[#A1A1A1] select-none"
                >
                  {item.label}
                </text>
              );
            })}
          </svg>
        </div>
      </CardVisual>

      {/* Card Body - Minimalist Footer with Title, Description, and Net Balance */}
      <CardBody className="border-t border-brand-border dark:border-[#262626] p-3.5 sm:p-5 bg-white dark:bg-[#0A0A0A] space-y-0">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-sm sm:text-base font-semibold text-neutral-900 dark:text-[#EDEDED] leading-tight truncate">
              {title}
            </CardTitle>
            <CardDescription className="text-[11px] sm:text-xs text-neutral-500 dark:text-[#A1A1A1] mt-0.5 sm:mt-1 truncate">
              {description || `${totalIn} received / ${totalOut} dispatched this ${period === 'daily' ? 'week' : period === 'weekly' ? 'month' : 'half-year'}`}
            </CardDescription>
          </div>
          <div className="text-right shrink-0">
            <span
              className={`text-base sm:text-lg font-bold block ${
                netBalance >= 0 ? 'text-neutral-900 dark:text-[#EDEDED]' : 'text-neutral-700 dark:text-[#A1A1A1]'
              }`}
            >
              {netBalance >= 0 ? `+${netBalance}` : netBalance}
            </span>
            <span className="text-[10px] text-neutral-400 dark:text-[#737373] font-medium">
              Net units
            </span>
          </div>
        </div>
      </CardBody>
    </AnimatedCard>
  );
}
