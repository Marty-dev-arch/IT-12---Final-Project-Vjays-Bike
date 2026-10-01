import React, { useState, useRef, useEffect } from 'react';
import {
  HiOutlineXMark,
  HiOutlineMagnifyingGlassPlus,
  HiOutlineMagnifyingGlassMinus,
  HiOutlineTag,
} from 'react-icons/hi2';

export interface ImageZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title?: string;
  brand?: string;
  sku?: string;
  category?: string;
  price?: number;
}

export const ImageZoomModal: React.FC<ImageZoomModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title = 'Part Image',
  brand,
  sku,
  category,
  price,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panPos, setPanPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeImage, setActiveImage] = useState<string>(imageUrl);

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync when input imageUrl changes
  useEffect(() => {
    setActiveImage(imageUrl);
    setZoomLevel(1);
    setPanPos({ x: 0, y: 0 });
  }, [imageUrl, isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') setZoomLevel((z) => Math.min(4, z + 0.5));
      if (e.key === '-' || e.key === '_') setZoomLevel((z) => Math.max(1, z - 0.5));
      if (e.key === '0') {
        setZoomLevel(1);
        setPanPos({ x: 0, y: 0 });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Zoom In / Out
  const handleZoomIn = () => setZoomLevel((z) => Math.min(4, Number((z + 0.5).toFixed(1))));
  const handleZoomOut = () => {
    setZoomLevel((z) => {
      const next = Math.max(1, Number((z - 0.5).toFixed(1)));
      if (next === 1) setPanPos({ x: 0, y: 0 });
      return next;
    });
  };
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanPos({ x: 0, y: 0 });
  };

  // Double click toggle
  const handleDoubleClick = () => {
    if (zoomLevel > 1.2) {
      handleResetZoom();
    } else {
      setZoomLevel(2.5);
    }
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoomLevel((z) => Math.min(4, Number((z + 0.25).toFixed(2))));
    } else {
      setZoomLevel((z) => {
        const next = Math.max(1, Number((z - 0.25).toFixed(2)));
        if (next === 1) setPanPos({ x: 0, y: 0 });
        return next;
      });
    }
  };

  // Drag to pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panPos.x, y: e.clientY - panPos.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomLevel <= 1) return;
    setPanPos({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in font-poppins"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-[#262626] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-[#262626] bg-neutral-50/80 dark:bg-[#161616]/80 backdrop-blur-sm">
          <div className="min-w-0 pr-4">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-[#EDEDED] truncate">
                {title}
              </h3>
              {brand && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FB714B]/15 text-brand-orange-dark dark:text-[#FB714B] border border-[#FB714B]/30">
                  {brand}
                </span>
              )}
              {sku && (
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-neutral-200/70 dark:bg-[#222222] text-neutral-600 dark:text-[#A1A1A1]">
                  {sku}
                </span>
              )}
            </div>
            {category && (
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-[#888888] mt-0.5">
                <HiOutlineTag className="w-3.5 h-3.5" />
                <span>{category}</span>
                {price !== undefined && (
                  <>
                    <span>•</span>
                    <span className="font-bold text-neutral-800 dark:text-[#EDEDED]">
                      ₱{price.toLocaleString()}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 dark:text-[#A1A1A1] dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#222222] transition-colors cursor-pointer border-0 bg-transparent"
              title="Close modal (Esc)"
            >
              <HiOutlineXMark className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Toolbar: Clean Zoom Controls Only */}
        <div className="flex items-center justify-end px-5 py-2.5 bg-neutral-100/60 dark:bg-[#181818]/60 border-b border-neutral-200 dark:border-[#262626] text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500 dark:text-[#A1A1A1] font-mono text-[11px] min-w-[42px] text-right">
              {Math.round(zoomLevel * 100)}%
            </span>

            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 1}
              className="p-1.5 rounded-lg bg-white dark:bg-[#121212] border border-neutral-200 dark:border-[#262626] text-neutral-700 dark:text-[#EDEDED] hover:bg-neutral-100 dark:hover:bg-[#222222] disabled:opacity-30 cursor-pointer transition-colors"
              title="Zoom Out (-)"
            >
              <HiOutlineMagnifyingGlassMinus className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleResetZoom}
              className="px-2 py-1 rounded-lg bg-white dark:bg-[#121212] border border-neutral-200 dark:border-[#262626] text-[11px] font-medium text-neutral-700 dark:text-[#EDEDED] hover:bg-neutral-100 dark:hover:bg-[#222222] cursor-pointer transition-colors"
              title="Reset Zoom (0)"
            >
              1:1
            </button>

            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 4}
              className="p-1.5 rounded-lg bg-white dark:bg-[#121212] border border-neutral-200 dark:border-[#262626] text-neutral-700 dark:text-[#EDEDED] hover:bg-neutral-100 dark:hover:bg-[#222222] disabled:opacity-30 cursor-pointer transition-colors"
              title="Zoom In (+)"
            >
              <HiOutlineMagnifyingGlassPlus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewport Canvas */}
        <div
          ref={containerRef}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onDoubleClick={handleDoubleClick}
          className={`relative w-full h-[520px] max-h-[62vh] overflow-hidden flex items-center justify-center select-none bg-neutral-100/70 dark:bg-[#151515] ${
            zoomLevel > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'
          }`}
        >
          <div
            className="transition-transform duration-75 ease-out flex items-center justify-center p-4 max-w-full max-h-full"
            style={{
              transform: `translate(${panPos.x}px, ${panPos.y}px) scale(${zoomLevel})`,
              transformOrigin: 'center center',
            }}
          >
            <img
              src={activeImage}
              alt={title}
              draggable={false}
              className="max-w-[480px] max-h-[480px] object-contain drop-shadow-xl select-none"
            />
          </div>

          {/* Quick Zoom Hint Pill */}
          <div className="absolute bottom-3 left-4 pointer-events-none px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/80 text-[11px] font-medium hidden sm:block">
            {zoomLevel > 1 ? 'Drag to pan • Double click to reset' : 'Scroll or click to zoom'}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-neutral-200 dark:border-[#262626] bg-neutral-50 dark:bg-[#141414] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-700 dark:text-[#EDEDED] bg-white dark:bg-[#222222] border border-neutral-200 dark:border-[#262626] hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageZoomModal;
