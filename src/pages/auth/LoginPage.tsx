import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';
import PinInput from '../../components/ui/PinInput';
import { ShieldCheck, Smartphone, KeyRound, RefreshCw, MessageSquare } from 'lucide-react';

type LoginMode = 'pin' | 'phone_sms';

const LoginPage: React.FC = () => {
  const [mode, setMode] = useState<LoginMode>('pin');
  const [error, setError] = useState('');
  const [phone, setPhone] = useState(localStorage.getItem('vjays_phone') || '');
  const [smsSent, setSmsSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const { login, loginWithSms } = useAuth();
  const navigate = useNavigate();

  const handlePinComplete = (pin: string) => {
    setError('');
    const success = login(pin, phone);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid PIN. Please try again or reset using your phone number.');
    }
  };

  const handleRequestSmsCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');

    const cleanPhone = phone.trim().replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setError('Please enter a valid Philippine mobile number (e.g. 09171234567).');
      return;
    }

    setLoading(true);
    try {
      await authApi.requestPinCode(cleanPhone, 'login');
      setSmsSent(true);
      startCooldown();
    } catch (err: any) {
      setError(err?.message || 'Could not send SMS verification code. Please check your number.');
    } finally {
      setLoading(false);
    }
  };

  const handleSmsPinComplete = async (code: string) => {
    setError('');
    setLoading(true);
    try {
      const cleanPhone = phone.trim().replace(/\s+/g, '');
      const ok = await loginWithSms(cleanPhone, code);
      if (ok) {
        navigate('/dashboard');
      } else {
        setError('Invalid or expired verification code. Please check your SMS.');
      }
    } catch (err: any) {
      setError('Login verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startCooldown = () => {
    setCooldown(60);
    const interval = window.setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-cream dark:bg-[#000000] text-neutral-900 dark:text-[#EDEDED] font-poppins px-4">
      <div className="self-stretch h-8 sm:h-[60px]" />
      <div className="flex flex-col items-center py-4 sm:py-[50px]">
        <div 
          className="flex flex-col bg-white dark:bg-[#0A0A0A] w-full max-w-[448px] p-6 sm:p-[42px] gap-6 rounded-3xl border border-solid border-brand-border dark:border-[#262626]"
          style={{ boxShadow: '0px 4px 25px #00000005' }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center justify-center -mb-2">
            <img 
              src="/logo.png" 
              alt="Vjay's Logo" 
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-md select-none" 
            />
          </div>

          {/* Header */}
          <div className="flex flex-col gap-1 text-center">
            <h1 className="text-zinc-950 dark:text-[#EDEDED] text-[26px] sm:text-[28px] font-bold leading-tight">
              Welcome back
            </h1>
            <p className="text-zinc-500 dark:text-[#A1A1A1] text-xs sm:text-sm">
              Sign in to manage Vjay's Bike Inventory
            </p>
          </div>

          {/* Login Mode Tabs */}
          <div className="flex bg-neutral-100 dark:bg-[#161616] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setMode('pin');
                setError('');
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all border-0 cursor-pointer ${
                mode === 'pin'
                  ? 'bg-white dark:bg-[#262626] text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-500 dark:text-[#A1A1A1] bg-transparent'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>PIN Login</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('phone_sms');
                setError('');
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all border-0 cursor-pointer ${
                mode === 'phone_sms'
                  ? 'bg-white dark:bg-[#262626] text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-500 dark:text-[#A1A1A1] bg-transparent'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Phone SMS</span>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Mode 1: Fast PIN Login */}
          {mode === 'pin' && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col items-center">
                  <span className="text-zinc-800 dark:text-[#A1A1A1] text-xs font-bold">
                    Enter your 6-digit security PIN
                  </span>
                </div>
                <div className="py-2">
                  <PinInput onComplete={handlePinComplete} error={error} />
                </div>
              </div>

              {/* Forgot PIN / Reset Link */}
              <div className="flex flex-col items-center gap-1 pt-1">
                <button
                  type="button"
                  onClick={() => navigate('/reset-pin')}
                  className="text-zinc-500 dark:text-[#A1A1A1] text-xs hover:text-zinc-700 dark:hover:text-[#EDEDED] transition-colors cursor-pointer bg-transparent border-0"
                >
                  Forgot PIN?
                </button>
                <span className="text-zinc-400 dark:text-[#737373] text-[11px]">
                  Request security reset code via SMS
                </span>
              </div>
            </div>
          )}

          {/* Mode 2: Phone SMS Login */}
          {mode === 'phone_sms' && (
            <div className="flex flex-col gap-4">
              {!smsSent ? (
                <form onSubmit={handleRequestSmsCode} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-neutral-700 dark:text-[#A1A1A1] text-xs font-medium">
                      Registered Mobile Number
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm font-medium">
                        🇵🇭 +63
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="917 123 4567"
                        className="w-full pl-16 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121212] text-neutral-900 dark:text-white text-sm outline-none focus:border-neutral-900 dark:focus:border-neutral-400 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-sm border-0 hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
                    <span>Request Login PIN via SMS</span>
                  </button>
                </form>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50 text-xs text-orange-900 dark:text-orange-300">
                    <MessageSquare className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                    <span>
                      One-time login PIN dispatched to <strong>{phone}</strong>. Enter below:
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <span className="text-zinc-800 dark:text-[#A1A1A1] text-xs font-bold">
                      Enter 6-digit SMS login code
                    </span>
                    <PinInput onComplete={handleSmsPinComplete} error={error} />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setSmsSent(false)}
                      className="text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white bg-transparent border-0 cursor-pointer"
                    >
                      Change phone
                    </button>
                    <button
                      type="button"
                      disabled={cooldown > 0 || loading}
                      onClick={() => handleRequestSmsCode()}
                      className="text-orange-600 dark:text-orange-400 font-semibold bg-transparent border-0 cursor-pointer disabled:opacity-50"
                    >
                      {cooldown > 0 ? `Resend SMS in ${cooldown}s` : 'Resend SMS code'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Register link */}
        <div className="mt-6">
          <span className="text-zinc-400 dark:text-[#737373] text-xs">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-brand-orange-dark dark:text-[#FB714B] font-bold hover:underline bg-transparent border-0 cursor-pointer"
            >
              Register Phone
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
