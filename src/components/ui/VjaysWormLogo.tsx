import React from 'react';

interface VjaysWormLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  color?: string; // default is NASA Red #EA1D24
  withApostrophe?: boolean; // default false for exact NASA-style continuous 5-letter layout
  showSubtitle?: boolean; // "BIKE PARTS & ACCESSORIES"
  subtitleColor?: string;
  align?: 'left' | 'center' | 'right';
}

/**
 * VjaysWormLogo
 * Replicates the iconic 1975 NASA "Worm" typographic brand style:
 * - Single continuous rounded tubular stroke of uniform width
 * - Zero/ultra-tight kerning and interlocking letter spacing identical to NASA
 * - Crossbar-free signature "A" arch
 * - Smooth continuous "S" serpentine ribbon
 * - High-impact modernist NASA Red (#EA1D24)
 */
export const VjaysWormLogo: React.FC<VjaysWormLogoProps> = ({
  className = '',
  size = 'md',
  color = '#EA1D24',
  withApostrophe = false,
  showSubtitle = false,
  subtitleColor,
  align = 'left',
}) => {
  const sizeClasses = {
    xs: 'h-5',
    sm: 'h-6 sm:h-7',
    md: 'h-8 sm:h-9',
    lg: 'h-11 sm:h-12',
    xl: 'h-14 sm:h-16',
    custom: '',
  };

  const currentHeightClass = sizeClasses[size] || sizeClasses.md;

  const alignClass = 
    align === 'center' ? 'items-center text-center' :
    align === 'right' ? 'items-end text-right' : 'items-start text-left';

  return (
    <div className={`inline-flex flex-col ${alignClass} ${className} select-none`}>
      {withApostrophe ? (
        /* VJAY'S with tight apostrophe */
        <svg
          viewBox="0 0 355 116"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${currentHeightClass} w-auto max-w-full drop-shadow-sm transition-transform duration-200 hover:scale-[1.02]`}
          aria-label="Vjay's NASA Worm Style Wordmark"
          role="img"
        >
          <g
            stroke={color}
            strokeWidth="15"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* V - Tight continuous bend */}
            <path d="M 18 24 L 46 86 C 48 91 54 91 56 86 L 84 24" />

            {/* J - Hook nesting under V */}
            <path d="M 120 24 L 120 64 C 120 80 110 90 95 90 C 83 90 75 82 75 72" />

            {/* A - Iconic NASA crossbar-free arch */}
            <path d="M 132 90 L 160 30 C 163 24 171 24 174 30 L 202 90" />

            {/* Y - Symmetrical fork and center stem */}
            <path d="M 214 24 L 240 56 L 240 90" />
            <path d="M 266 24 L 240 56" />

            {/* ' - Angled tight rounded Worm apostrophe */}
            <path d="M 276 22 L 272 36" strokeWidth="11" />

            {/* S - NASA continuous serpentine curve */}
            <path d="M 334 38 C 334 27 325 24 311 24 C 295 24 288 33 288 43 C 288 54 300 59 316 63 C 330 66 338 73 338 81 C 338 88 327 90 314 90 C 300 90 290 85 290 77" />
          </g>
        </svg>
      ) : (
        /* VJAYS - Exact zero-spacing NASA 5-letter layout */
        <svg
          viewBox="10 16 308 82"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${currentHeightClass} w-auto max-w-full drop-shadow-sm transition-transform duration-200 hover:scale-[1.02]`}
          aria-label="VJAYS NASA Worm Style Wordmark"
          role="img"
        >
          <g
            stroke={color}
            strokeWidth="15"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* V - Tight continuous bend */}
            <path d="M 18 24 L 46 86 C 48 91 54 91 56 86 L 84 24" />

            {/* J - Hook nesting under V with zero wasted gap */}
            <path d="M 120 24 L 120 64 C 120 80 110 90 95 90 C 83 90 75 82 75 72" />

            {/* A - Iconic NASA crossbar-free arch */}
            <path d="M 132 90 L 160 30 C 163 24 171 24 174 30 L 202 90" />

            {/* Y - Symmetrical fork and center stem */}
            <path d="M 214 24 L 240 56 L 240 90" />
            <path d="M 266 24 L 240 56" />

            {/* S - NASA continuous serpentine curve directly snug against Y */}
            <path d="M 306 38 C 306 27 297 24 283 24 C 267 24 260 33 260 43 C 260 54 272 59 288 63 C 302 66 310 73 310 81 C 310 88 299 90 286 90 C 272 90 262 85 262 77" />
          </g>
        </svg>
      )}

      {showSubtitle && (
        <span
          className="text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.24em] font-semibold uppercase mt-0.5 transition-colors whitespace-nowrap"
          style={{ color: subtitleColor || '#888888' }}
        >
          Bike Parts & Accessories
        </span>
      )}
    </div>
  );
};

export default VjaysWormLogo;
