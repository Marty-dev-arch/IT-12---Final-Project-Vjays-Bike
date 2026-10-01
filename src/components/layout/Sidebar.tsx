import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SlideOver from '../ui/SlideOver';
import FAQs from '../ui/faqs-component';
import VjaysWormLogo from '../ui/VjaysWormLogo';
import { 
  HiOutlineSquares2X2, 
  HiOutlineChevronDown, 
  HiOutlineChevronRight, 
  HiOutlineArrowsRightLeft, 
  HiOutlineClipboardDocumentList, 
  HiOutlineQuestionMarkCircle,
  HiOutlineXMark
} from 'react-icons/hi2';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed = false, 
  onToggle,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [productsOpen, setProductsOpen] = useState(true);
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  const isDashboardActive = location.pathname === '/dashboard' || location.pathname === '/';
  const isStockMovementActive = location.pathname === '/stock-movement';
  const isAuditLogsActive = location.pathname === '/audit-logs';

  const productCategories = [
    { 
      name: 'Braking System', 
      path: '/products/braking-system', 
      icon: '/icons/braking-system.png',
      iconActive: '/icons/braking-system-active.png',
    },
    { 
      name: 'Drivetrain & Chains', 
      path: '/products/drivetrain-chains', 
      icon: '/icons/drivetrain-chains.png',
      iconActive: '/icons/drivetrain-chains-active.png',
    },
    { 
      name: 'Handle Bar & Handle Grip', 
      path: '/products/handle-bar-handle-grip', 
      icon: '/icons/handle-bar-handle-grip.png',
      iconActive: '/icons/handle-bar-handle-grip-active.png',
    },
  ];

  const isAnySubPartActive = productCategories.some(cat => location.pathname === cat.path);

  const handleNavigate = (path: string) => {
    navigate(path);
    onCloseMobile?.();
  };

  return (
    <>
      {/* Mobile Dimmed Backdrop Overlay (smooth fade-in on mobile screens) */}
      <div 
        onClick={onCloseMobile}
        className={`fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-xs z-50 lg:hidden transition-opacity duration-300 ${
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Adaptive Sidebar Container: Off-canvas drawer on Mobile/Tablet, Persistent on Desktop */}
      <aside 
        className={`
          bg-white dark:bg-[#0A0A0A] h-screen flex flex-col font-poppins border-r border-brand-border dark:border-[#262626] shrink-0 select-none overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out
          /* Mobile Drawer Mode */
          fixed inset-y-0 left-0 z-50 w-72 sm:w-80 shadow-2xl lg:shadow-none
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          /* Desktop Persistent Mode */
          lg:static lg:translate-x-0
          ${isCollapsed ? 'lg:w-20' : 'lg:w-80'}
        `}
        style={{ boxShadow: '0px 1px 8px #00000008' }}
      >
        {/* Brand Header with Logo, Bold Brand Name, and Close/Open Toggle Button */}
        <div className={`pt-6 pb-5 transition-all ${isCollapsed ? 'lg:px-2 lg:flex lg:justify-center px-4 sm:px-5 flex items-center justify-between' : 'px-4 sm:px-5 flex items-center justify-between'}`}>
          {/* Desktop Collapsed View Only (Icon-only mode) */}
          <div className={`${isCollapsed ? 'hidden lg:flex' : 'hidden'}`}>
            <button
              onClick={onToggle}
              title="Expand navigation bar"
              className="w-12 h-12 flex items-center justify-center text-neutral-500 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-white rounded-2xl hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-colors border-0 bg-transparent cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <rect x="3" y="3" width="18" height="18" rx="3.5" />
                <path d="M9 3v18" />
              </svg>
            </button>
          </div>

          {/* Full Brand Header (Shown on Mobile drawer ALWAYS, and Desktop when NOT collapsed) */}
          <div className={`flex items-center justify-between w-full ${isCollapsed ? 'lg:hidden' : 'flex'}`}>
            <div 
              className="flex items-center gap-3.5 min-w-0 flex-1 cursor-pointer" 
              onClick={() => handleNavigate('/dashboard')}
            >
              <div className="shrink-0 flex items-center justify-center bg-transparent overflow-visible">
                <img 
                  src="/logo.png" 
                  alt="Vjay's Logo" 
                  className="w-20 h-20 sm:w-24 sm:h-24 scale-115 sm:scale-125 object-contain select-none drop-shadow-md transition-transform duration-200 hover:scale-130" 
                />
              </div>
              <div className="flex flex-col min-w-0 justify-center">
                <VjaysWormLogo size="lg" withApostrophe={false} showSubtitle={false} />
                <span className="text-slate-500 dark:text-zinc-400 text-xs font-semibold tracking-tight leading-snug mt-1">
                  Bike Parts & Accessories
                </span>
              </div>
            </div>

            {/* Desktop Collapse Button */}
            <button
              onClick={onToggle}
              title="Collapse navigation bar"
              className="hidden lg:flex w-9 h-9 items-center justify-center text-neutral-400 dark:text-zinc-400 hover:text-neutral-800 dark:hover:text-white rounded-xl hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-colors border-0 bg-transparent cursor-pointer shrink-0 ml-1"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <rect x="3" y="3" width="18" height="18" rx="3.5" />
                <path d="M15 3v18" />
              </svg>
            </button>

            {/* Mobile Close 'X' Button */}
            <button
              onClick={onCloseMobile}
              title="Close navigation"
              className="lg:hidden w-10 h-10 flex items-center justify-center text-neutral-500 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-white rounded-xl hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-colors border-0 bg-transparent cursor-pointer shrink-0 ml-1"
            >
              <HiOutlineXMark className="w-6 h-6 stroke-[1.8]" />
            </button>
          </div>
        </div>

        {/* Navigation List */}
        <div className={`flex flex-col py-2 gap-1.5 ${isCollapsed ? 'lg:px-2 lg:items-center px-4' : 'px-4'}`}>
          {/* Dashboard */}
          <button
            onClick={() => handleNavigate('/dashboard')}
            title={isCollapsed ? 'Dashboard' : undefined}
            className={`flex items-center rounded-2xl transition-all border border-transparent cursor-pointer font-poppins ${
              isCollapsed 
                ? `lg:w-12 lg:h-12 lg:justify-center w-full px-4 py-3.5 text-left ${isDashboardActive ? 'bg-[#FFF5ED] dark:bg-[#FB714B]/15 text-[#FB714B] dark:border-[#FB714B]/30' : 'bg-transparent text-slate-500 dark:text-zinc-400 hover:bg-neutral-50 dark:hover:bg-white/[0.06] hover:text-neutral-900 dark:hover:text-white'}`
                : `w-full px-4 py-3.5 text-left ${
                    isDashboardActive
                      ? 'bg-[#FFF5ED] dark:bg-[#FB714B]/15 text-neutral-900 dark:text-white font-medium dark:border-[#FB714B]/30'
                      : 'bg-transparent text-slate-600 dark:text-zinc-400 font-normal hover:bg-neutral-50 dark:hover:bg-white/[0.06] hover:text-neutral-900 dark:hover:text-white'
                  }`
            }`}
          >
            <HiOutlineSquares2X2 className={`w-6 h-6 shrink-0 ${isCollapsed ? 'lg:mr-0 mr-3.5' : 'mr-3.5'} ${isDashboardActive ? 'text-[#FB714B]' : 'text-slate-500 dark:text-zinc-400'}`} />
            <span className={`text-[16px] tracking-tight ${isCollapsed ? 'lg:hidden block' : 'block'}`}>Dashboard</span>
          </button>

          {/* Products Accordion */}
          <div className={`flex flex-col gap-1 ${isCollapsed ? 'lg:items-center w-full' : 'w-full'}`}>
            <button
              onClick={() => setProductsOpen(!productsOpen)}
              title={isCollapsed ? 'Products' : undefined}
              className={`flex items-center rounded-2xl transition-all border border-transparent cursor-pointer font-poppins ${
                isCollapsed
                  ? `lg:w-12 lg:h-12 lg:justify-center w-full justify-between px-4 py-3.5 text-left ${isAnySubPartActive ? 'bg-[#FFF5ED] dark:bg-[#FB714B]/15 text-[#FB714B] dark:border-[#FB714B]/30' : 'bg-transparent text-slate-500 dark:text-zinc-400 hover:bg-neutral-50 dark:hover:bg-white/[0.06] hover:text-neutral-900 dark:hover:text-white'}`
                  : `w-full justify-between px-4 py-3.5 text-left ${
                      isAnySubPartActive
                        ? 'bg-[#FFF5ED] dark:bg-[#FB714B]/15 text-neutral-900 dark:text-white font-medium dark:border-[#FB714B]/30'
                        : 'bg-transparent text-slate-600 dark:text-zinc-400 font-normal hover:bg-neutral-50 dark:hover:bg-white/[0.06] hover:text-neutral-900 dark:hover:text-white'
                    }`
              }`}
            >
              <div className="flex items-center">
                <svg 
                  className={`w-6 h-6 shrink-0 ${isCollapsed ? 'lg:mr-0 mr-3.5' : 'mr-3.5'} ${isAnySubPartActive ? 'text-[#FB714B]' : 'text-slate-500 dark:text-zinc-400'}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth={1.8}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
                <span className={`text-[16px] tracking-tight ${isCollapsed ? 'lg:hidden block' : 'block'}`}>Products</span>
              </div>
              <div className={`${isCollapsed ? 'lg:hidden block' : 'block'}`}>
                {productsOpen ? (
                  <HiOutlineChevronDown className={`w-4 h-4 shrink-0 ${isAnySubPartActive ? 'text-[#FB714B]' : 'text-slate-400 dark:text-zinc-500'}`} />
                ) : (
                  <HiOutlineChevronRight className={`w-4 h-4 shrink-0 ${isAnySubPartActive ? 'text-[#FB714B]' : 'text-slate-400 dark:text-zinc-500'}`} />
                )}
              </div>
            </button>

            {/* Sub parts: Braking System, Drivetrain & Chains, Handle Bar & Handle Grip */}
            {productsOpen && (
              <div className={`flex flex-col pl-3.5 pr-2 gap-1 pt-0.5 ${isCollapsed ? 'lg:hidden flex' : 'flex'}`}>
                {productCategories.map((cat) => {
                  const isPartActive = location.pathname === cat.path;
                  return (
                    <button
                      key={cat.path}
                      onClick={() => handleNavigate(cat.path)}
                      className={`flex items-center w-full py-2.5 px-3 text-left transition-all rounded-2xl border border-transparent cursor-pointer font-poppins ${
                        isPartActive
                          ? 'bg-[#FFF5ED] dark:bg-[#FB714B]/15 text-neutral-900 dark:text-white font-medium dark:border-[#FB714B]/30'
                          : 'bg-transparent text-slate-600 dark:text-zinc-400 font-normal hover:bg-neutral-50 dark:hover:bg-white/[0.06] hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      <img 
                        src={isPartActive ? cat.iconActive : cat.icon} 
                        alt={cat.name} 
                        className={`w-7 h-7 mr-3 shrink-0 object-contain transition-all ${
                          isPartActive ? '' : 'dark:brightness-0 dark:invert dark:opacity-85'
                        }`} 
                      />
                      <span className="text-[14.5px] whitespace-nowrap tracking-tight leading-none">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Operations Header Text Section */}
          <div className={`pt-4 pb-1 ${isCollapsed ? 'lg:hidden px-4 block' : 'px-4'}`}>
            <span className="text-slate-400 dark:text-zinc-500 text-xs font-medium font-poppins">
              Operations
            </span>
          </div>

          {/* Stock Movement */}
          <button
            onClick={() => handleNavigate('/stock-movement')}
            title={isCollapsed ? 'Stock Movement' : undefined}
            className={`flex items-center rounded-2xl transition-all border border-transparent cursor-pointer font-poppins ${
              isCollapsed 
                ? `lg:w-12 lg:h-12 lg:justify-center w-full px-4 py-3.5 text-left ${isStockMovementActive ? 'bg-[#FFF5ED] dark:bg-[#FB714B]/15 text-[#FB714B] dark:border-[#FB714B]/30' : 'bg-transparent text-slate-500 dark:text-zinc-400 hover:bg-neutral-50 dark:hover:bg-white/[0.06] hover:text-neutral-900 dark:hover:text-white'}`
                : `w-full px-4 py-3.5 text-left ${
                    isStockMovementActive
                      ? 'bg-[#FFF5ED] dark:bg-[#FB714B]/15 text-neutral-900 dark:text-white font-medium dark:border-[#FB714B]/30'
                      : 'bg-transparent text-slate-600 dark:text-zinc-400 font-normal hover:bg-neutral-50 dark:hover:bg-white/[0.06] hover:text-neutral-900 dark:hover:text-white'
                  }`
            }`}
          >
            <HiOutlineArrowsRightLeft className={`w-6 h-6 shrink-0 ${isCollapsed ? 'lg:mr-0 mr-3.5' : 'mr-3.5'} ${isStockMovementActive ? 'text-[#FB714B]' : 'text-slate-500 dark:text-zinc-400'}`} />
            <span className={`text-[16px] tracking-tight ${isCollapsed ? 'lg:hidden block' : 'block'}`}>Stock Movement</span>
          </button>

          {/* Logs History */}
          <button
            onClick={() => handleNavigate('/audit-logs')}
            title={isCollapsed ? 'Logs History' : undefined}
            className={`flex items-center rounded-2xl transition-all border border-transparent cursor-pointer font-poppins ${
              isCollapsed 
                ? `lg:w-12 lg:h-12 lg:justify-center w-full px-4 py-3.5 text-left ${isAuditLogsActive ? 'bg-[#FFF5ED] dark:bg-[#FB714B]/15 text-[#FB714B] dark:border-[#FB714B]/30' : 'bg-transparent text-slate-500 dark:text-zinc-400 hover:bg-neutral-50 dark:hover:bg-white/[0.06] hover:text-neutral-900 dark:hover:text-white'}`
                : `w-full px-4 py-3.5 text-left ${
                    isAuditLogsActive
                      ? 'bg-[#FFF5ED] dark:bg-[#FB714B]/15 text-neutral-900 dark:text-white font-medium dark:border-[#FB714B]/30'
                      : 'bg-transparent text-slate-600 dark:text-zinc-400 font-normal hover:bg-neutral-50 dark:hover:bg-white/[0.06] hover:text-neutral-900 dark:hover:text-white'
                  }`
            }`}
          >
            <HiOutlineClipboardDocumentList className={`w-6 h-6 shrink-0 ${isCollapsed ? 'lg:mr-0 mr-3.5' : 'mr-3.5'} ${isAuditLogsActive ? 'text-[#FB714B]' : 'text-slate-500 dark:text-zinc-400'}`} />
            <span className={`text-[16px] tracking-tight ${isCollapsed ? 'lg:hidden block' : 'block'}`}>Logs History</span>
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Need Help Text Link */}
        <div className={`pb-6 ${isCollapsed ? 'lg:px-2 lg:flex lg:justify-center px-4' : 'px-4'}`}>
          <button
            onClick={() => {
              setHelpModalOpen(true);
              onCloseMobile?.();
            }}
            title={isCollapsed ? 'Need help' : undefined}
            className={`flex items-center rounded-2xl transition-all duration-200 cursor-pointer font-poppins bg-transparent border-0 shadow-none text-slate-600 dark:text-zinc-400 font-normal hover:text-red-600 dark:hover:text-red-400 active:text-red-600 focus:outline-none ${
              isCollapsed 
                ? 'lg:w-12 lg:h-12 lg:justify-center lg:p-0 w-full px-4 py-3 text-left' 
                : 'w-full px-4 py-3 text-left'
            }`}
          >
            <HiOutlineQuestionMarkCircle 
              className={`w-6 h-6 shrink-0 transition-colors ${
                isCollapsed ? 'lg:mr-0 mr-3.5' : 'mr-3.5'
              }`} 
            />
            <span className={`text-[16px] tracking-tight ${isCollapsed ? 'lg:hidden block' : 'block'}`}>Need help</span>
          </button>
        </div>
      </aside>

      {/* User Guide Slide-over Panel (Half Stretch Screen docked to Navbar side) */}
      <SlideOver
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
        title="User guide"
        subtitle="Step-by-step help and answers for Vjay's Bike Parts inventory system"
        side="left"
        widthClass="w-screen md:w-[50vw] md:max-w-[50vw]"
      >
        <FAQs
          title="System guide"
          subtitle="Discover step-by-step instructions on inventory registration, stock movements, and ledger tracking in Vjay's Bike Parts."
        />
      </SlideOver>
    </>
  );
};

export default Sidebar;
