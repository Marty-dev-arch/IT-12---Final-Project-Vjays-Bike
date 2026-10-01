import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: React.ReactNode;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isDestructive = true,
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

  // Lock body scroll
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

  const dialogContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-poppins pointer-events-auto">
          {/* Dimmed Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 dark:bg-black/75 backdrop-blur-xs cursor-pointer"
            aria-hidden="true"
          />

          {/* Modal Dialog Card (Matching Reference Screenshots 1 & 2) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-[460px] bg-white dark:bg-[#121212] rounded-2xl sm:rounded-[24px] border border-neutral-200 dark:border-[#262626] shadow-2xl p-5 sm:p-7 z-10 flex flex-col gap-3.5 sm:gap-4 text-neutral-900 dark:text-[#EDEDED]"
          >
            {/* Title */}
            <h3 className="text-lg sm:text-[22px] font-bold tracking-tight text-neutral-900 dark:text-white leading-snug">
              {title}
            </h3>

            {/* Description */}
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-[#A1A1A1] leading-relaxed">
              {description}
            </p>

            {/* Actions: Cancel & Action Button */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 sm:gap-3 pt-2 sm:pt-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-[#333333] bg-white dark:bg-[#1A1A1A] text-neutral-800 dark:text-[#EDEDED] font-semibold text-sm hover:bg-neutral-50 dark:hover:bg-[#222222] transition-colors cursor-pointer text-center"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-all shadow-xs cursor-pointer text-center ${
                  isDestructive
                    ? 'bg-[#DC2626] hover:bg-red-700 active:bg-red-800'
                    : 'bg-[#121212] dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(dialogContent, document.body);
};

export default ConfirmDialog;
