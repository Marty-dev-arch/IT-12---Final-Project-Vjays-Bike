import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HiOutlineSquares2X2,
  HiOutlineCube,
  HiOutlineArrowsRightLeft,
  HiOutlineClipboardDocumentList,
  HiOutlineQuestionMarkCircle,
  HiOutlineChevronRight,
} from 'react-icons/hi2';

interface MobileBottomNavProps {
  onOpenHelp?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenHelp }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [productModalOpen, setProductModalOpen] = useState(false);

  const isDashboardActive = location.pathname === '/' || location.pathname === '/dashboard';
  const isProductsActive = location.pathname.startsWith('/products');
  const isMovementActive = location.pathname === '/stock-movement';
  const isLogsActive = location.pathname === '/audit-logs';

  const productCategories = [
    {
      name: 'Braking System',
      path: '/products/braking-system',
      icon: '/icons/braking-system.png',
      iconActive: '/icons/braking-system-active.png',
      description: 'Brake pads, rotors & calipers',
    },
    {
      name: 'Drivetrain & Chains',
      path: '/products/drivetrain-chains',
      icon: '/icons/drivetrain-chains.png',
      iconActive: '/icons/drivetrain-chains-active.png',
      description: 'Chains, cassettes & derailleurs',
    },
    {
      name: 'Handle Bar & Handle Grip',
      path: '/products/handle-bar-handle-grip',
      icon: '/icons/handle-bar-handle-grip.png',
      iconActive: '/icons/handle-bar-handle-grip-active.png',
      description: 'Bars, grips, stems & tape',
    },
  ];

  // Close modal when route changes
  useEffect(() => {
    setProductModalOpen(false);
  }, [location.pathname]);

  const handleCategorySelect = (path: string) => {
    setProductModalOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* Dimmed Backdrop for Center Modal Routine */}
      {productModalOpen && (
        <div
          onClick={() => setProductModalOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 dark:bg-black/60 backdrop-blur-xs lg:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* Floating Center Product Category Modal Card (Pixel-matched with Reference Image Routine/Splits) */}
      {productModalOpen && (
        <div
          className="lg:hidden fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-[88vw] max-w-sm bg-white dark:bg-[#121212] rounded-2xl border border-brand-border dark:border-[#262626] shadow-[0_12px_40px_rgba(0,0,0,0.25)] p-2 font-poppins animate-in fade-in zoom-in-95 duration-200"
          style={{ willChange: 'transform, opacity' }}
        >
          {/* Subtle notch pointer towards center button */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-[#121212] border-b border-r border-brand-border dark:border-[#262626] rotate-45" />

          <div className="px-3 py-2 border-b border-brand-border/60 dark:border-[#262626]/80 flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-900 dark:text-[#EDEDED] uppercase tracking-wider">
              Product Categories
            </span>
            <span className="text-[10px] text-neutral-400 font-medium">
              3 Sections
            </span>
          </div>

          <div className="flex flex-col gap-1 pt-1.5 pb-0.5">
            {productCategories.map((cat) => {
              const isSelected = location.pathname === cat.path;
              return (
                <button
                  key={cat.path}
                  type="button"
                  onClick={() => handleCategorySelect(cat.path)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all cursor-pointer border text-left ${
                    isSelected
                      ? 'bg-[#FFF5ED] dark:bg-[#FB714B]/15 border-[#FB714B]/30 text-neutral-900 dark:text-white'
                      : 'bg-transparent hover:bg-neutral-50 dark:hover:bg-[#1A1A1A] border-transparent text-neutral-700 dark:text-[#D4D4D8]'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 p-1.5 transition-colors ${
                      isSelected
                        ? 'bg-[#FB714B]/20 text-[#FB714B]'
                        : 'bg-neutral-100 dark:bg-[#1C1C1C]'
                    }`}
                  >
                    <img
                      src={isSelected ? cat.iconActive : cat.icon}
                      alt={cat.name}
                      className={`w-6 h-6 object-contain ${
                        isSelected ? '' : 'dark:brightness-0 dark:invert dark:opacity-85'
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold block truncate leading-tight">
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-neutral-400 dark:text-zinc-500 block truncate mt-0.5">
                      {cat.description}
                    </span>
                  </div>

                  <HiOutlineChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected
                        ? 'text-[#FB714B] translate-x-0.5'
                        : 'text-neutral-400 dark:text-zinc-500'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile Footer Navigation Bar */}
      <nav
        aria-label="Mobile bottom navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-md border-t border-brand-border dark:border-[#262626] px-2 py-1.5 transition-colors font-poppins shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)]"
        style={{ paddingBottom: 'calc(0.375rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="flex items-center justify-around max-w-lg mx-auto relative">
          {/* 1. Dashboard */}
          <button
            type="button"
            onClick={() => {
              setProductModalOpen(false);
              navigate('/dashboard');
            }}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-200 cursor-pointer border-0 bg-transparent relative min-w-[56px] select-none ${
              isDashboardActive && !productModalOpen
                ? 'text-[#FB714B] font-semibold'
                : 'text-neutral-500 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            {isDashboardActive && !productModalOpen && (
              <span className="absolute -top-1.5 w-6 h-0.5 rounded-full bg-[#FB714B]" />
            )}
            <div className="w-7 h-7 flex items-center justify-center rounded-lg">
              <HiOutlineSquares2X2 className="w-5 h-5 stroke-[1.8]" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 leading-none">
              Dashboard
            </span>
          </button>

          {/* 2. Movement */}
          <button
            type="button"
            onClick={() => {
              setProductModalOpen(false);
              navigate('/stock-movement');
            }}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-200 cursor-pointer border-0 bg-transparent relative min-w-[56px] select-none ${
              isMovementActive && !productModalOpen
                ? 'text-[#FB714B] font-semibold'
                : 'text-neutral-500 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            {isMovementActive && !productModalOpen && (
              <span className="absolute -top-1.5 w-6 h-0.5 rounded-full bg-[#FB714B]" />
            )}
            <div className="w-7 h-7 flex items-center justify-center rounded-lg">
              <HiOutlineArrowsRightLeft className="w-5 h-5 stroke-[1.8]" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 leading-none">
              Movement
            </span>
          </button>

          {/* 3. Center Elevated Products Button (Matching reference circular red/orange button) */}
          <div className="relative flex flex-col items-center justify-center -mt-5 min-w-[62px]">
            <button
              type="button"
              onClick={() => setProductModalOpen((prev) => !prev)}
              title="Product Categories"
              aria-expanded={productModalOpen}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white cursor-pointer border-2 border-white dark:border-[#0A0A0A] shadow-[0_4px_16px_rgba(251,113,75,0.45)] transition-all duration-200 active:scale-95 ${
                productModalOpen || isProductsActive
                  ? 'bg-[#E0532B] scale-105 ring-4 ring-[#FB714B]/25'
                  : 'bg-[#FB714B] hover:bg-[#ea5832]'
              }`}
            >
              <HiOutlineCube className="w-6 h-6 stroke-[2]" />
            </button>
            <span
              className={`text-[10px] tracking-tight mt-1 leading-none font-medium select-none ${
                isProductsActive || productModalOpen
                  ? 'text-[#FB714B] font-semibold'
                  : 'text-neutral-500 dark:text-zinc-400'
              }`}
            >
              Products
            </span>
          </div>

          {/* 4. Logs */}
          <button
            type="button"
            onClick={() => {
              setProductModalOpen(false);
              navigate('/audit-logs');
            }}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-200 cursor-pointer border-0 bg-transparent relative min-w-[56px] select-none ${
              isLogsActive && !productModalOpen
                ? 'text-[#FB714B] font-semibold'
                : 'text-neutral-500 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            {isLogsActive && !productModalOpen && (
              <span className="absolute -top-1.5 w-6 h-0.5 rounded-full bg-[#FB714B]" />
            )}
            <div className="w-7 h-7 flex items-center justify-center rounded-lg">
              <HiOutlineClipboardDocumentList className="w-5 h-5 stroke-[1.8]" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 leading-none">
              Logs
            </span>
          </button>

          {/* 5. Guide / Help */}
          <button
            type="button"
            onClick={() => {
              setProductModalOpen(false);
              onOpenHelp?.();
            }}
            className="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-200 cursor-pointer border-0 bg-transparent relative min-w-[56px] select-none text-neutral-500 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-white"
          >
            <div className="w-7 h-7 flex items-center justify-center rounded-lg">
              <HiOutlineQuestionMarkCircle className="w-5 h-5 stroke-[1.8]" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 leading-none">
              Guide
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default MobileBottomNav;
