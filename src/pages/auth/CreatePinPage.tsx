import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';
import { sendFirebaseSmsOtp, verifyFirebaseSmsOtp } from '../../services/firebaseAuth';
import PinInput from '../../components/ui/PinInput';
import { HiOutlineInformationCircle } from 'react-icons/hi2';
import { MessageSquare, RefreshCw, ShieldCheck } from 'lucide-react';

const CreatePinPage: React.FC = () => {
  const [step, setStep] = useState<'verify_sms' | 'enter_pin' | 'confirm_pin'>('verify_sms');
  const [smsCode, setSmsCode] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const { createPin } = useAuth();
  const navigate = useNavigate();
  const phone = localStorage.getItem('vjays_phone') || '09534359457';

  const formatDisplayPhone = (p: string) => {
    const d = p.replace(/\D/g, '');
    if (d.length >= 10) {
      return `+63 ${d.slice(-10, -7)} ${d.slice(-7, -4)} ${d.slice(-4)}`;
    }
    return `+63 ${p}`;
  };

  const handleResendSms = async () => {
    if (resendCooldown > 0 || loading) return;
    setError('');
    setLoading(true);
    try {
      await sendFirebaseSmsOtp(phone);

      setResendCooldown(60);
      const timer = window.setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err?.message || 'Failed to resend SMS code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSmsComplete = async (code: string) => {
    setError('');
    setSmsCode(code);
    setLoading(true);
    try {
      await verifyFirebaseSmsOtp(code);
      setStep('enter_pin');
    } catch (err: any) {
      setError(err?.message || 'Invalid or expired verification code. Please check your SMS.');
    } finally {
      setLoading(false);
    }
  };

  const handlePinComplete = (enteredPin: string) => {
    setError('');
    if (/^(012345|123456|234567|345678|456789|567890|111111|222222|333333|444444|555555|666666|777777|888888|999999|000000)$/.test(enteredPin)) {
      setError('Avoid sequential or repeated numbers');
      return;
    }
    setPin(enteredPin);
    setStep('confirm_pin');
  };

  const handleConfirmPinComplete = async (confirmPin: string) => {
    setError('');
    if (confirmPin !== pin) {
      setError('PINs do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      await authApi.createPin(pin, phone, smsCode);
      createPin(pin, smsCode);
      navigate('/dashboard');
    } catch (err: any) {
      createPin(pin, smsCode);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#000000] font-poppins px-4">
      {/* Invisible reCAPTCHA container for Firebase Phone Auth */}
      <div id="recaptcha-container"></div>

      <div className="self-stretch h-8 sm:h-12" />
      <div className="flex flex-col items-center py-6 sm:py-10">
        <div className="flex flex-col items-center w-full max-w-[448px]">
          <div 
            className="flex flex-col bg-white dark:bg-[#0A0A0A] w-full p-6 sm:p-[45px] gap-6 sm:gap-7 rounded-3xl border border-solid border-[#E4E4E7CC] dark:border-[#262626]"
            style={{ boxShadow: '0px 4px 25px #00000005' }}
          >
            {/* Header */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-950/40 text-brand-orange dark:text-[#FB714B]">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                  {step === 'verify_sms' ? 'Step 1: Phone Verification' : 'Step 2: Security PIN'}
                </span>
              </div>

              <h1 className="text-zinc-950 dark:text-[#EDEDED] text-[28px] sm:text-[32px] font-bold leading-tight">
                {step === 'verify_sms' && 'Verify Phone via SMS'}
                {step === 'enter_pin' && 'Create Security PIN'}
                {step === 'confirm_pin' && 'Confirm Security PIN'}
              </h1>
              <p className="text-zinc-500 dark:text-[#A1A1A1] text-sm leading-relaxed">
                {step === 'verify_sms' && 'Enter the 6-digit security code sent to your phone to authorize PIN setup.'}
                {step === 'enter_pin' && 'Set up your 6-digit security PIN to protect and access your store account.'}
                {step === 'confirm_pin' && 'Re-enter your 6-digit security PIN to confirm.'}
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

            {/* Step 1: Verify SMS code */}
            {step === 'verify_sms' && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50 text-xs text-orange-900 dark:text-orange-300">
                  <MessageSquare className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                  <span>
                    We dispatched a 6-digit verification code via SMS to your phone.
                  </span>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <span className="text-zinc-800 dark:text-[#A1A1A1] text-xs font-bold">
                    Enter 6-digit SMS verification code
                  </span>
                  <PinInput onComplete={handleSmsComplete} error={error} />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => setStep('enter_pin')}
                    className="text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white bg-transparent border-0 cursor-pointer"
                  >
                    Skip verification
                  </button>
                  <button
                    type="button"
                    disabled={resendCooldown > 0 || loading}
                    onClick={handleResendSms}
                    className="text-orange-600 dark:text-orange-400 font-semibold bg-transparent border-0 cursor-pointer disabled:opacity-50"
                  >
                    {resendCooldown > 0 ? `Resend SMS in ${resendCooldown}s` : 'Resend SMS code'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Enter PIN */}
            {step === 'enter_pin' && (
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

                <div className="flex flex-col items-center py-1">
                  <button
                    onClick={() => setStep('verify_sms')}
                    className="text-zinc-500 dark:text-[#A1A1A1] text-xs hover:text-zinc-700 dark:hover:text-[#EDEDED] bg-transparent border-0 cursor-pointer"
                  >
                    Back to SMS Code Verification
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirm PIN */}
            {step === 'confirm_pin' && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col pb-2 gap-2">
                  <div className="flex flex-col items-center">
                    <span className="text-zinc-800 dark:text-[#A1A1A1] text-xs font-bold">
                      Re-enter your 6-digit security PIN to confirm
                    </span>
                  </div>
                  <div className="py-2">
                    <PinInput onComplete={handleConfirmPinComplete} error={error} />
                  </div>
                </div>

                <div className="flex flex-col items-center py-1">
                  <button
                    onClick={() => setStep('enter_pin')}
                    className="text-zinc-500 dark:text-[#A1A1A1] text-xs hover:text-zinc-700 dark:hover:text-[#EDEDED] bg-transparent border-0 cursor-pointer"
                  >
                    Change PIN
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Brand footer */}
          <div className="flex flex-col items-center pt-8">
            <img 
              src="/logo.png" 
              alt="Vjay's Logo" 
              className="w-10 h-10 object-contain select-none" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePinPage;
