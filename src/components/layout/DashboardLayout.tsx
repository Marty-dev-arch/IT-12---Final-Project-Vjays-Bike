import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileBottomNav from './MobileBottomNav';
import SlideOver from '../ui/SlideOver';
import FAQs from '../ui/faqs-component';
import { NotificationAlertModal } from '../ui/NotificationAlertModal';
import { useInventory } from '../../context/InventoryContext';

const DashboardLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const location = useLocation();
  const { alertModalData, closeAlertModal } = useInventory();

  // Close mobile drawer on route navigation
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-brand-cream dark:bg-[#000000] text-neutral-900 dark:text-slate-100 font-poppins transition-colors duration-300">
      {/* Sidebar: Adaptive Persistent Desktop & Mobile Drawer */}
      <Sidebar 
        isCollapsed={isCollapsed} 
        onToggle={() => setIsCollapsed(!isCollapsed)} 
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />
      
      {/* Main Content Column: exact screen height, topbar pinned */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden bg-brand-cream dark:bg-[#000000] transition-all duration-300 relative">
        {/* Top Bar: Fixed at top, with mobile logo + brand name and utilities */}
        <TopBar 
          isSidebarCollapsed={isCollapsed} 
          onToggleSidebar={() => setIsCollapsed(!isCollapsed)} 
          onOpenMobileSidebar={() => setIsMobileOpen(true)}
        />
        
        {/* Page Content: The scrollable area with bottom padding on mobile for footer nav */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden focus:outline-none pb-24 lg:pb-0">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation Bar (Footer) */}
        <MobileBottomNav onOpenHelp={() => setHelpOpen(true)} />
      </div>

      {/* Global User Guide Slide-over Panel for Guide button */}
      <SlideOver
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
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

      {/* Global Notification & Low Stock Alert Modal */}
      <NotificationAlertModal
        isOpen={!!alertModalData?.isOpen}
        onClose={closeAlertModal}
        title={alertModalData?.title || 'Notification alert'}
        message={alertModalData?.message || ''}
        buttonText={alertModalData?.buttonText || 'Okay, I Understand'}
        timestamp={alertModalData?.timestamp}
        onConfirm={alertModalData?.onConfirm}
      />
    </div>
  );
};

export default DashboardLayout;
