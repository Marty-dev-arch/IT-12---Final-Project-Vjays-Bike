import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineBell, HiXMark } from 'react-icons/hi2';

export interface NotificationAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
  timestamp?: string;
  onConfirm?: () => void;
}

export const NotificationAlertModal: React.FC<NotificationAlertModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  buttonText = 'Okay, I Understand',
  timestamp,
  onConfirm,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleAction = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  if (!mounted) return null;

  const content = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-poppins pointer-events-auto">
          {/* Dimmed Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-xs cursor-pointer"
            aria-hidden="true"
          />

          {/* Alert / Notification Card matched to Reference Image Layout with Project UI styling */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 14 }}
            transition={{ type: 'spring', damping: 26, stiffness: 340 }}
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-[420px] bg-white dark:bg-[#121212] rounded-[28px] border border-brand-border dark:border-[#262626] shadow-2xl p-6 sm:p-7 z-10 flex flex-col justify-between text-neutral-900 dark:text-[#EDEDED] overflow-hidden"
          >
            {/* Subtle brand ambient glow */}
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-brand-orange/10 dark:bg-brand-orange/15 rounded-full blur-2xl pointer-events-none" />

            {/* Top Row: Title + Bell Badge & Close Button */}
            <div className="relative z-10 flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 pr-1">
                <h3 className="text-xl sm:text-[22px] font-bold tracking-tight text-neutral-900 dark:text-white leading-snug">
                  {title}
                </h3>
                {timestamp && (
                  <span className="text-[11px] text-neutral-400 dark:text-[#737373] mt-0.5 block">
                    {timestamp}
                  </span>
                )}
              </div>

              {/* Bell Icon Circle Badge with Close 'X' */}
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="w-11 h-11 rounded-full flex items-center justify-center bg-brand-orange/15 dark:bg-[#FB714B]/20 text-[#FB714B] border border-brand-orange/20 shadow-xs">
                  <HiOutlineBell className="w-5 h-5 text-[#FB714B]" />
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#1E1E1E] transition-colors cursor-pointer"
                  title="Close"
                >
                  <HiXMark className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Message Body */}
            <div className="relative z-10 my-2">
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-[#A1A1A1] leading-relaxed">
                {message}
              </p>
            </div>

            {/* Bottom Full-width Pill Button: "Okay, I Understand" */}
            <div className="relative z-10 mt-6 pt-1">
              <button
                type="button"
                onClick={handleAction}
                className="w-full py-3.5 px-6 rounded-full bg-[#FB714B] hover:bg-[#ea623d] active:bg-[#d65733] text-white font-bold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer text-center"
              >
                {buttonText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
};

export default NotificationAlertModal;
