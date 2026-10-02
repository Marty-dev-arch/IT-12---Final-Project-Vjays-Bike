import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';
import { HiOutlineLockClosed } from 'react-icons/hi2';
import { RefreshCw } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleContinue = async () => {
    setError('');
    const cleanPhone = phone.replace(/\s/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid Philippine mobile number (e.g. 0917 123 4567)');
      return;
    }

    setLoading(true);
    try {
      register(cleanPhone);
      navigate('/create-pin');
    } finally {
      setLoading(false);
    }
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#000000] font-poppins px-4">
      <div className="self-stretch h-8 sm:h-12 pt-4 sm:pt-8" />
      <div className="flex flex-col items-center py-6 sm:py-[41px] gap-[1px]">
        <div 
          className="w-full max-w-[460px] py-8 sm:py-10 px-6 sm:px-[41px] rounded-[28px] bg-white dark:bg-[#0A0A0A] border border-brand-border dark:border-[#262626]"
          style={{ boxShadow: '0px 2px 10px #00000005' }}
        >
          {/* Header */}
          <div className="flex flex-col mb-[25px] gap-2">
            <h1 className="text-zinc-950 dark:text-[#EDEDED] text-[28px] font-bold leading-tight">
              Register Phone Number
            </h1>
            <p className="text-zinc-500 dark:text-[#A1A1A1] text-sm leading-relaxed">
              Enter your store mobile number to register and set up your security PIN.
            </p>
          </div>

          {/* Phone Input */}
          <div className="flex flex-col pt-1 mb-6 gap-6">
            <div className="flex items-center bg-white dark:bg-[#121212] py-[1px] px-[15px] rounded-xl border border-solid border-zinc-300 dark:border-[#262626] focus-within:border-zinc-500 dark:focus-within:border-[#FB714B] transition-colors">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-zinc-700 dark:text-[#EDEDED] text-base font-bold">🇵🇭</span>
                <span className="text-zinc-800 dark:text-[#EDEDED] text-sm font-bold">+63</span>
              </div>
              <input
                type="tel"
                placeholder="0917 123 4567"
                value={phone}
                onChange={e => setPhone(formatPhone(e.target.value))}
                className="flex-1 py-4 pl-3 text-[15px] text-zinc-800 dark:text-[#EDEDED] bg-transparent border-0 focus:outline-none focus:ring-0 placeholder:text-zinc-400 dark:placeholder:text-[#737373] font-poppins"
              />
            </div>

            {error && <span className="text-red-500 text-xs -mt-4">{error}</span>}

            <button
              onClick={handleContinue}
              disabled={loading}
              className="flex items-center justify-center bg-zinc-900 dark:bg-white text-white dark:text-[#000000] py-3.5 rounded-xl border-0 hover:bg-zinc-800 dark:hover:bg-neutral-200 active:scale-[0.98] transition-all cursor-pointer font-bold disabled:opacity-50 gap-2"
              style={{ boxShadow: '0px 1px 2px #0000000D' }}
            >
              {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
              <span className="text-[15px] font-bold">Continue</span>
            </button>
          </div>

          {/* Encryption notice */}
          <div className="flex justify-center items-center pt-[22px] gap-[5px]">
            <HiOutlineLockClosed className="w-3.5 h-3.5 text-zinc-400 dark:text-[#737373]" />
            <span className="text-zinc-400 dark:text-[#737373] text-xs">
              End-to-end encrypted verification
            </span>
          </div>
        </div>

        {/* Login link */}
        <div className="mt-4">
          <span className="text-zinc-400 dark:text-[#737373] text-xs">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-brand-orange-dark dark:text-[#FB714B] font-bold hover:underline bg-transparent border-0 cursor-pointer"
            >
              Login
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
