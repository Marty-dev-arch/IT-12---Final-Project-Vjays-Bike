import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PinInput from '../../components/ui/PinInput';
import { HiOutlineInformationCircle } from 'react-icons/hi2';

const CreatePinPage: React.FC = () => {
  const [error, setError] = useState('');
  const { createPin } = useAuth();
  const navigate = useNavigate();
  const phone = localStorage.getItem('vjays_phone') || '09534359457';

  const handlePinComplete = (pin: string) => {
    setError('');
    if (/^(012345|123456|234567|345678|456789|567890|111111|222222|333333|444444|555555|666666|777777|888888|999999|000000)$/.test(pin)) {
      setError('Avoid sequential or repeated numbers');
      return;
    }
    const success = createPin(pin);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Failed to create PIN. Please try again.');
    }
  };

  const formatDisplayPhone = (p: string) => {
    const d = p.replace(/\D/g, '');
    if (d.length >= 10) {
      return `+63 ${d.slice(-10, -7)} ${d.slice(-7, -4)} ${d.slice(-4)}`;
    }
    return `+63 ${p}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#000000] font-poppins px-4">
      <div className="self-stretch h-8 sm:h-12" />
      <div className="flex flex-col items-center py-6 sm:py-10">
        <div className="flex flex-col items-center w-full max-w-[448px]">
          <div 
            className="flex flex-col bg-white dark:bg-[#0A0A0A] w-full p-6 sm:p-[45px] gap-6 sm:gap-7 rounded-3xl border border-solid border-[#E4E4E7CC] dark:border-[#262626]"
            style={{ boxShadow: '0px 4px 25px #00000005' }}
          >
            {/* Header */}
            <div className="flex flex-col gap-2">
              <h1 className="text-zinc-950 dark:text-[#EDEDED] text-[32px] font-bold leading-tight">
                Create PIN Code
              </h1>
              <p className="text-zinc-500 dark:text-[#A1A1A1] text-sm leading-relaxed">
                Set up your 6-digit security PIN to protect and access
                <br />your store account.
              </p>
              {/* Phone display */}
              <div className="flex items-center justify-center pt-2">
                <div className="flex items-center py-1.5 px-3.5 rounded-full bg-neutral-50 dark:bg-[#121212] border border-transparent dark:border-[#262626]">
                  <div className="w-[11px] h-[11px] rounded-full bg-green-500 mr-2" />
                  <span className="text-zinc-700 dark:text-[#EDEDED] text-xs mr-2">{formatDisplayPhone(phone)}</span>
                  <span className="text-zinc-300 dark:text-[#737373] text-xs mr-[9px]">•</span>
                  <button
                    onClick={() => navigate('/register')}
                    className="text-zinc-500 dark:text-[#A1A1A1] text-xs hover:text-zinc-700 dark:hover:text-[#EDEDED] bg-transparent border-0 cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {/* PIN Input */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col pb-2 gap-2">
                <div className="flex flex-col items-center">
                  <span className="text-zinc-800 dark:text-[#A1A1A1] text-xs font-bold">
                    Enter your 6-digit security PIN
                  </span>
                </div>
                <div className="py-2">
                  <PinInput onComplete={handlePinComplete} error={error} />
                </div>
                {/* Hint */}
                <div className="flex items-center px-[26px] gap-[5px]">
                  <HiOutlineInformationCircle className="w-2.5 h-2.5 text-zinc-400 dark:text-[#737373] shrink-0" />
                  <span className="text-zinc-400 dark:text-[#737373] text-[11px]">
                    Must be 6 digits. Avoid sequential numbers like 123456.
                  </span>
                </div>
              </div>

              {/* Submit */}
              <button
                className="flex justify-center items-center bg-[#111111] dark:bg-white text-white dark:text-[#000000] py-2.5 gap-[9px] rounded-xl border-0 hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-[0.98] transition-all cursor-pointer font-bold"
                style={{ boxShadow: '0px 1px 2px #0000000D' }}
              >
                <span className="text-sm">Create PIN & Continue</span>
                <svg className="w-[9px] h-[9px] text-white dark:text-[#000000]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>

              {/* Back link */}
              <div className="flex flex-col items-center py-1">
                <button
                  onClick={() => navigate('/register')}
                  className="text-zinc-500 dark:text-[#A1A1A1] text-xs hover:text-zinc-700 dark:hover:text-[#EDEDED] bg-transparent border-0 cursor-pointer"
                >
                  Back to Phone Registration
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePinPage;
