import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PinInput from '../../components/ui/PinInput';

const LoginPage: React.FC = () => {
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handlePinComplete = (pin: string) => {
    setError('');
    const success = login(pin);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid PIN. Please try again.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-cream dark:bg-[#000000] text-neutral-900 dark:text-[#EDEDED] font-poppins px-4">
      <div className="self-stretch h-8 sm:h-[68px]" />
      <div className="flex flex-col items-center py-6 sm:py-[73px]">
        <div 
          className="flex flex-col bg-white dark:bg-[#0A0A0A] w-full max-w-[448px] p-6 sm:p-[45px] gap-6 sm:gap-7 rounded-3xl border border-solid border-brand-border dark:border-[#262626]"
          style={{ boxShadow: '0px 4px 25px #00000005' }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center justify-center -mb-2">
            <img 
              src="/logo.png" 
              alt="Vjay's Logo" 
              className="w-24 h-24 object-contain drop-shadow-md select-none" 
            />
          </div>

          {/* Header */}
          <div className="flex flex-col gap-[7px] text-center">
            <h1 className="text-zinc-950 dark:text-[#EDEDED] text-[30px] font-bold leading-tight">
              Welcome back
            </h1>
            <p className="text-zinc-500 dark:text-[#A1A1A1] text-sm">
              Let's pick up where you left off
            </p>
          </div>

          {/* PIN Input */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-[7px]">
              <div className="flex flex-col items-center">
                <span className="text-zinc-800 dark:text-[#A1A1A1] text-xs font-bold">
                  Enter your 6-digit security PIN
                </span>
                <span className="text-zinc-400 dark:text-[#737373] text-[11px] mt-1">
                  Default PIN: <strong className="text-brand-orange-dark dark:text-[#FB714B]">123456</strong>
                </span>
              </div>
              <div className="py-2">
                <PinInput onComplete={handlePinComplete} error={error} />
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={() => {}}
              className="flex flex-col items-center bg-[#111111] dark:bg-white text-white dark:text-[#000000] py-[9px] rounded-xl border-0 hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-[0.98] transition-all cursor-pointer"
              style={{ boxShadow: '0px 1px 2px #0000000D' }}
            >
              <span className="text-sm font-bold">Authorize & Enter</span>
            </button>

            {/* Forgot PIN */}
            <div className="flex flex-col items-center gap-[5px]">
              <button
                onClick={() => navigate('/reset-pin')}
                className="text-zinc-500 dark:text-[#A1A1A1] text-xs hover:text-zinc-700 dark:hover:text-[#EDEDED] transition-colors cursor-pointer bg-transparent border-0"
              >
                Forgot PIN?
              </button>
              <span className="text-zinc-400 dark:text-[#737373] text-[11px]">
                Reset via registered phone
              </span>
            </div>
          </div>
        </div>

        {/* No account */}
        <div className="mt-6">
          <span className="text-zinc-400 dark:text-[#737373] text-xs">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-brand-orange-dark dark:text-[#FB714B] font-bold hover:underline bg-transparent border-0 cursor-pointer"
            >
              Register
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
