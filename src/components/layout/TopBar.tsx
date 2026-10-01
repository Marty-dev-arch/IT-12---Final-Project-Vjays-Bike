import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useInventory } from '../../context/InventoryContext';
import SearchBar from '@/components/ui/SearchBar';
import { AnimatedThemeToggle } from '@/components/ui/animated-theme-toggle';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { NotificationAlertModal } from '@/components/ui/NotificationAlertModal';
import VjaysWormLogo from '../ui/VjaysWormLogo';
import type { AppNotification } from '../../types';
import { 
  HiOutlineBell, 
  HiOutlineCalendar, 
  HiOutlineArrowRightOnRectangle,
  HiOutlineCheck,
  HiOutlineTrash,
  HiOutlineClock,
  HiOutlineBars3
} from 'react-icons/hi2';

interface TopBarProps {
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  onOpenMobileSidebar?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onOpenMobileSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    searchQuery, 
    setSearchQuery,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications
  } = useInventory();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [selectedNotifForModal, setSelectedNotifForModal] = useState<AppNotification | null>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const isDashboard = location.pathname === '/' || location.pathname === '/dashboard';

  const today = new Date().toLocaleDateString('en-US', { 
    month: 'short', day: 'numeric', year: 'numeric' 
  });

  // Close notifications dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    if (notifOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [notifOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="shrink-0 z-20 flex items-center justify-between bg-brand-cream/90 dark:bg-[#0A0A0A]/90 backdrop-blur-sm py-2.5 sm:py-3 px-3 sm:px-6 font-poppins transition-colors duration-300">
      {/* Left Area: Mobile Logo + Brand Name (Reference style) & Desktop Searchbar */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 pr-2">
        {/* Mobile Vjay's Logo + Brand Name */}
        <div 
          onClick={() => navigate('/dashboard')}
          className="lg:hidden flex items-center gap-2.5 cursor-pointer shrink-0 select-none group"
          title="Vjay's Bike Parts & Accessories"
        >
          <div className="w-9 h-9 flex items-center justify-center overflow-visible shrink-0">
            <img 
              src="/logo.png" 
              alt="Vjay's Logo" 
              className="w-8 h-8 object-contain scale-115 drop-shadow-sm transition-transform duration-200 group-hover:scale-125" 
            />
          </div>
          <div className="flex items-center">
            <VjaysWormLogo size="xs" withApostrophe={true} showSubtitle={false} />
          </div>
        </div>

        {/* Desktop Searchbar: Clean & spacious on Dashboard */}
        {isDashboard && (
          <div className="hidden lg:block w-full max-w-[240px] xs:max-w-xs sm:max-w-sm md:w-80 transition-all">
            <SearchBar
              placeholder="Search parts, sku..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
        )}
      </div>

      {/* Right side: Controls & Utilities */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Notification Bell with Badge and Popover */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => {
              // Show the alert modal directly when clicking notification icon
              const target = notifications.find((n) => !n.read) || notifications[0];
              if (target) {
                setSelectedNotifForModal(target);
                if (!target.read) {
                  markNotificationAsRead(target.id);
                }
              } else {
                setSelectedNotifForModal({
                  id: 'all_clear_alert',
                  title: 'All caught up!',
                  message: 'No pending alerts or restocking notices right now. All inventory safety buffers are healthy.',
                  type: 'info',
                  timestamp: today,
                  read: true,
                });
              }
            }}
            className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-white dark:bg-[#121212] rounded-lg sm:rounded-xl border border-brand-border dark:border-[#262626] hover:bg-neutral-50 dark:hover:bg-[#1C1C1C] transition-colors cursor-pointer text-slate-600 dark:text-[#EDEDED] shadow-xs"
            style={{ boxShadow: '0px 1px 2px #0000000D' }}
            title="Notifications"
          >
            <HiOutlineBell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600 dark:text-[#A1A1A1]" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-xs animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Popover */}
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#121212] rounded-2xl border border-brand-border dark:border-[#262626] shadow-2xl z-50 overflow-hidden font-poppins">
              <div className="flex items-center justify-between p-4 border-b border-brand-border dark:border-[#262626]">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-neutral-900 dark:text-[#EDEDED]">
                    Notifications
                  </span>
                  {unreadNotificationsCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
                      {unreadNotificationsCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadNotificationsCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] font-semibold text-brand-orange-dark dark:text-[#FB714B] hover:underline cursor-pointer bg-transparent border-0"
                    >
                      Mark all read
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-[11px] font-medium text-neutral-400 hover:text-neutral-700 dark:hover:text-white cursor-pointer bg-transparent border-0"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-brand-border/60 dark:divide-[#262626]/60">
                {notifications.length === 0 ? (
                  <div className="py-8 px-4 text-center text-xs text-neutral-400 dark:text-[#737373]">
                    <HiOutlineClock className="w-8 h-8 mx-auto mb-2 opacity-50 stroke-1" />
                    No notifications right now.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        setSelectedNotifForModal(notif);
                        if (!notif.read) {
                          markNotificationAsRead(notif.id);
                        }
                        setNotifOpen(false);
                      }}
                      className={`p-3.5 transition-colors flex items-start gap-3 cursor-pointer hover:bg-neutral-50 dark:hover:bg-[#1A1A1A] group/notif ${
                        notif.read
                          ? 'bg-transparent opacity-75'
                          : 'bg-orange-50/50 dark:bg-[#1A120E]/40'
                      }`}
                    >
                      <div className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 bg-brand-orange dark:bg-[#FB714B]" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-neutral-900 dark:text-[#EDEDED] group-hover/notif:text-brand-orange-dark dark:group-hover/notif:text-[#FB714B] transition-colors">
                            {notif.title}
                          </span>
                          <span className="text-[10px] text-neutral-400 shrink-0">
                            {notif.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-600 dark:text-[#A1A1A1] mt-0.5 leading-snug line-clamp-2">
                          {notif.message}
                        </p>
                      </div>
                      {!notif.read && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            markNotificationAsRead(notif.id);
                          }}
                          title="Mark as read"
                          className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#1E1E1E] cursor-pointer bg-transparent border-0 shrink-0"
                        >
                          <HiOutlineCheck className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <div className="p-2.5 px-3.5 bg-neutral-50/80 dark:bg-[#161616] border-t border-brand-border/60 dark:border-[#262626]/60 flex items-center justify-between">
                  <span className="text-[10px] text-neutral-400">Click any notification to expand</span>
                  <button
                    type="button"
                    onClick={() => {
                      const target = notifications.find((n) => !n.read) || notifications[0];
                      if (target) {
                        setSelectedNotifForModal(target);
                        if (!target.read) markNotificationAsRead(target.id);
                        setNotifOpen(false);
                      }
                    }}
                    className="text-[11px] font-bold text-brand-orange-dark dark:text-[#FB714B] hover:underline cursor-pointer bg-transparent border-0"
                  >
                    View alert message
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Date Badge */}
        <div 
          className="hidden sm:flex items-center bg-white dark:bg-[#121212] py-1.5 px-3 gap-1.5 rounded-xl border border-brand-border dark:border-[#262626] select-none shadow-xs"
          style={{ boxShadow: '0px 1px 2px #0000000D' }}
        >
          <HiOutlineCalendar className="w-4 h-4 text-slate-500 dark:text-[#A1A1A1]" />
          <span className="text-slate-700 dark:text-[#EDEDED] text-xs font-semibold">{today}</span>
        </div>

        {/* Animated Theme Toggle */}
        <AnimatedThemeToggle className="w-8 h-8 sm:w-9 sm:h-9 p-0 rounded-lg sm:rounded-xl border border-brand-border dark:border-[#262626] bg-white dark:bg-[#121212] hover:bg-neutral-50 dark:hover:bg-[#1C1C1C] shadow-xs cursor-pointer flex items-center justify-center text-slate-600 dark:text-[#EDEDED]" />

        {/* Profile / Logout */}
        <button
          onClick={() => setLogoutModalOpen(true)}
          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-white dark:bg-[#121212] rounded-lg sm:rounded-xl border border-brand-border dark:border-[#262626] hover:bg-red-50 dark:hover:bg-red-950/40 hover:border-red-200 dark:hover:border-red-900 transition-colors group cursor-pointer text-slate-600 dark:text-[#EDEDED] shadow-xs"
          title="Logout"
        >
          <HiOutlineArrowRightOnRectangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600 dark:text-[#A1A1A1] group-hover:text-red-500 dark:group-hover:text-red-400" />
        </button>
      </div>

      {/* Logout Confirmation Dialog (Pixel-matched with Reference Screenshot 2) */}
      <ConfirmDialog
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Log out?"
        description="You’ll need to sign in again to get back to your sessions."
        confirmLabel="Log out"
        cancelLabel="Cancel"
        isDestructive={true}
      />

      {/* Alert / Notification Message Modal (Matching user reference layout with project UI styling) */}
      <NotificationAlertModal
        isOpen={!!selectedNotifForModal}
        onClose={() => setSelectedNotifForModal(null)}
        title={selectedNotifForModal?.title || 'Notification alert'}
        message={selectedNotifForModal?.message || ''}
        timestamp={selectedNotifForModal?.timestamp}
        buttonText="Okay, I Understand"
      />
    </header>
  );
};

export default TopBar;
