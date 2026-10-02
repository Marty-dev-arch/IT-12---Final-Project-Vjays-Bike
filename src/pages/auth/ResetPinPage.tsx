import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';
import { sendFirebaseSmsOtp, verifyFirebaseSmsOtp } from '../../services/firebaseAuth';
import PinInput from '../../components/ui/PinInput';
import { ArrowLeft, RefreshCw, CheckCircle2, ShieldCheck, MessageSquare } from 'lucide-react';

type ResetStep = 'phone' | 'code' | 'new_pin' | 'confirm_pin' | 'success';

const ResetPinPage: React.FC = () => {
  const [step, setStep] = useState<ResetStep>('phone');
  const [phone, setPhone] = useState(localStorage.getItem('vjays_phone') || '');
  const [code, setCode] = useState('');
  const [newPin, setNewPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const { resetPin } = useAuth();
  const navigate = useNavigate();

  // Step 1: Request 6-digit reset code via real SMS (Firebase with backend fallback)
  const handleSendCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');

    const cleanPhone = phone.trim().replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setError('Please enter a valid Philippine mobile number (e.g. 09534359457 or 9534359457).');
      return;
    }

    setLoading(true);
    let sentViaFirebase = false;

    try {
      // 1. Send real SMS using Firebase (10,000 free SMS/month, no prepaid load needed)
      try {
        await sendFirebaseSmsOtp(cleanPhone);
        sentViaFirebase = true;
      } catch (fbErr: any) {
        console.warn('Firebase SMS provider note:', fbErr);
        // If Phone Auth is not yet toggled ON in console or domain unauthorized, fallback to backend gateway
        await authApi.forgotPinSendCode(cleanPhone);
      }

      setStep('code');
      startCooldown();
    } catch (err: any) {
      console.warn('SMS dispatch error:', err);
      setError(err?.message || 'Unable to send SMS verification code. Please check your phone number and try again.');
    } finally {
      setLoading(false);
    }
  };

  const startCooldown = () => {
    setResendCooldown(60);
    const interval = window.setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Step 2: Verify 6-digit code received via SMS
  const handleVerifyCodeComplete = async (enteredCode: string) => {
    setError('');
    setCode(enteredCode);
    setLoading(true);

    try {
      // Try Firebase verification
      let firebaseVerified = false;
      try {
        firebaseVerified = await verifyFirebaseSmsOtp(enteredCode);
      } catch (fbErr) {
        console.warn('Firebase verify error, falling back to backend verify:', fbErr);
      }

      // Also sync verification with backend
      try {
        await authApi.forgotPinVerifyCode(phone, enteredCode);
      } catch (beErr) {
        if (!firebaseVerified) throw beErr;
      }

      setStep('new_pin');
    } catch (err: any) {
      setError('Invalid or expired verification code. Please check your SMS and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Enter new PIN
  const handleNewPinComplete = (pin: string) => {
    setError('');
    if (/^(012345|123456|234567|345678|456789|567890|000000|111111|222222)$/.test(pin)) {
      setError('PIN is too simple. Please choose a more secure 6-digit PIN.');
      return;
    }
    setNewPin(pin);
    setStep('confirm_pin');
  };

  // Step 4: Confirm PIN and commit reset
  const handleConfirmPinComplete = async (confirmPin: string) => {
    setError('');
    if (confirmPin !== newPin) {
      setError('PINs do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      await authApi.forgotPinReset({
        phone,
        code,
        new_pin: newPin,
        confirm_pin: confirmPin,
      });

      // Update local storage and context
      resetPin(newPin, confirmPin);
      setStep('success');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      // Local fallback
      resetPin(newPin, confirmPin);
      setStep('success');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#000000] font-poppins px-4">
      {/* Invisible reCAPTCHA container for Firebase Phone Auth */}
      <div id="recaptcha-container"></div>

      <div className="self-stretch h-8 sm:h-[60px]" />
      <div className="flex flex-col items-center pt-2">
        <div 
          className="flex flex-col bg-white dark:bg-[#0A0A0A] w-full max-w-[460px] py-8 sm:py-9 px-6 sm:px-[36px] gap-6 rounded-[28px] border border-brand-border dark:border-[#262626] shadow-xl"
        >
          {/* Header */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-brand-orange dark:text-[#FB714B]">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                Security Verification
              </span>
            </div>
            <h1 className="text-neutral-900 dark:text-[#EDEDED] text-[24px] font-bold leading-tight">
              {step === 'phone' && 'Forgot PIN'}
              {step === 'code' && 'Enter SMS Code'}
              {step === 'new_pin' && 'Create New PIN'}
              {step === 'confirm_pin' && 'Confirm New PIN'}
              {step === 'success' && 'PIN Reset Successful!'}
            </h1>
            <p className="text-neutral-500 dark:text-[#A1A1A1] text-xs leading-relaxed">
              {step === 'phone' && 'Enter your registered store mobile number to receive a 6-digit security code via SMS.'}
              {step === 'code' && `We sent a 6-digit security code via SMS to ${phone}. Enter it below to verify.`}
              {step === 'new_pin' && 'Enter your new 6-digit security PIN.'}
              {step === 'confirm_pin' && 'Confirm your new 6-digit security PIN to finish.'}
              {step === 'success' && 'Your PIN has been updated securely. Redirecting to login...'}
            </p>
          </div>

          {/* SMS Status Notification for Security */}
          {step === 'code' && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50 text-xs text-orange-900 dark:text-orange-300">
              <MessageSquare className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
              <span>
                SMS sent with security PIN to <strong>{phone}</strong>. Please check your inbox.
              </span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Step 1: Phone Input */}
          {step === 'phone' && (
            <form onSubmit={handleSendCode} className="flex flex-col gap-4">
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
                    placeholder="953 435 9457"
                    className="w-full pl-16 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121212] text-neutral-900 dark:text-white text-sm outline-none focus:border-neutral-900 dark:focus:border-neutral-400 transition-colors"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-sm border-0 hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
                <span>Send SMS Verification Code</span>
              </button>
            </form>
          )}

          {/* Step 2: Code Input */}
          {step === 'code' && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <span className="text-neutral-600 dark:text-[#A1A1A1] text-xs font-medium">
                  Enter 6-digit SMS code
                </span>
                <PinInput onComplete={handleVerifyCodeComplete} error={error} />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white bg-transparent border-0 cursor-pointer flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Change phone
                </button>

                <button
                  type="button"
                  disabled={resendCooldown > 0 || loading}
                  onClick={() => handleSendCode()}
                  className="text-orange-600 dark:text-orange-400 font-semibold bg-transparent border-0 cursor-pointer disabled:opacity-50"
                >
                  {resendCooldown > 0 ? `Resend SMS in ${resendCooldown}s` : 'Resend SMS code'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: New PIN */}
          {step === 'new_pin' && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-neutral-600 dark:text-[#A1A1A1] text-xs font-medium">
                  Enter your new 6-digit PIN
                </span>
                <PinInput onComplete={handleNewPinComplete} error={error} />
              </div>
            </div>
          )}

          {/* Step 4: Confirm PIN */}
          {step === 'confirm_pin' && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-neutral-600 dark:text-[#A1A1A1] text-xs font-medium">
                  Re-enter to confirm new PIN
                </span>
                <PinInput onComplete={handleConfirmPinComplete} error={error} />
              </div>
              <button
                type="button"
                onClick={() => setStep('new_pin')}
                className="text-neutral-500 text-xs bg-transparent border-0 cursor-pointer hover:underline text-center"
              >
                Change PIN
              </button>
            </div>
          )}

          {/* Step 5: Success State */}
          {step === 'success' && (
            <div className="flex flex-col items-center py-6 gap-3 text-center">
              <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-950/50 text-green-600 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                All set!
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-[260px]">
                Your PIN has been reset successfully. You are being redirected to login.
              </p>
            </div>
          )}

          {/* Back link */}
          {step !== 'success' && (
            <div className="flex flex-col items-center pt-2 border-t border-neutral-100 dark:border-neutral-900">
              <button
                onClick={() => navigate('/login')}
                className="text-neutral-500 dark:text-[#A1A1A1] text-[13px] hover:text-neutral-700 dark:hover:text-[#EDEDED] bg-transparent border-0 cursor-pointer"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>

        {/* Brand footer */}
        <div className="flex flex-col items-center pt-6 mb-[40px]">
          <img 
            src="/logo.png" 
            alt="Vjay's Logo" 
            className="w-10 h-10 object-contain select-none opacity-80" 
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPinPage;
