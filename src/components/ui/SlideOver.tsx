import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineXMark } from 'react-icons/hi2';

interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  side?: 'right' | 'left';
  widthClass?: string;
  children: React.ReactNode;
}

export const SlideOver: React.FC<SlideOverProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  side = 'right',
  widthClass = 'w-screen md:w-[50vw] md:max-w-[50vw]',
  children,
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

  // Lock background scroll when drawer is open
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

  const isRight = side === 'right';

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const panelVariants = {
    hidden: { x: isRight ? '100%' : '-100%' },
    visible: {
      x: 0,
      transition: {
        type: 'spring' as const,
        damping: 32,
        stiffness: 300,
        mass: 0.8,
      },
    },
    exit: {
      x: isRight ? '100%' : '-100%',
      transition: { duration: 0.22, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] },
    },
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] overflow-hidden font-poppins">
          {/* Dimmed Translucent Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/45 dark:bg-black/70 backdrop-blur-xs cursor-pointer"
            aria-hidden="true"
          />

          {/* Slide-over Panel Container */}
          <div
            className={`fixed inset-y-0 ${
              isRight ? 'right-0' : 'left-0'
            } flex max-w-full pointer-events-none`}
          >
            <motion.div
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`${widthClass} pointer-events-auto flex flex-col bg-white dark:bg-[#0A0A0A] ${
                isRight ? 'border-l' : 'border-r'
              } border-neutral-200 dark:border-[#262626] shadow-2xl text-neutral-900 dark:text-[#EDEDED] transition-colors`}
              role="dialog"
              aria-modal="true"
              aria-labelledby="slide-over-title"
            >
              {/* Header */}
              <div className="flex items-start justify-between px-4 sm:px-8 pt-5 sm:pt-7 pb-4 sm:pb-5 border-b border-neutral-100 dark:border-[#262626] shrink-0">
                <div className="flex flex-col gap-1 pr-4">
                  <h2
                    id="slide-over-title"
                    className="text-xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-[#EDEDED]"
                  >
                    {title}
                  </h2>
                  {subtitle && (
                    <p className="text-xs sm:text-sm text-neutral-500 dark:text-[#A1A1A1] leading-relaxed">
                      {subtitle}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-9 h-9 -mr-1 rounded-xl flex items-center justify-center text-neutral-400 dark:text-[#A1A1A1] hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#1A1A1A] transition-colors cursor-pointer border-0 bg-transparent shrink-0"
                  aria-label="Close panel"
                >
                  <HiOutlineXMark className="w-6 h-6" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 sm:py-6 space-y-5 sm:space-y-6">
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default SlideOver;
