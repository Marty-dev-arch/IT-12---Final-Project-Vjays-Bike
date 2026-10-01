import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center font-poppins">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={`relative bg-white dark:bg-[#0A0A0A] border border-transparent dark:border-[#262626] rounded-2xl shadow-2xl ${maxWidth} w-full mx-4 overflow-hidden animate-in text-neutral-900 dark:text-[#EDEDED]`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-neutral-100 dark:border-[#262626]">
          <h2 className="text-lg font-bold text-[#1C1C1C] dark:text-[#EDEDED]">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100 dark:hover:bg-[#121212] transition-colors text-neutral-500 dark:text-[#A1A1A1] dark:hover:text-[#EDEDED] cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        
        {/* Body */}
        <div className="px-6 pb-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
