import { auth } from '../lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from 'firebase/auth';

let confirmationResult: ConfirmationResult | null = null;
let recaptchaVerifier: RecaptchaVerifier | null = null;

/**
 * Format any Philippine mobile number to E.164 format (+639XXXXXXXXX)
 */
export const formatToE164 = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('09') && digits.length === 11) {
    return '+63' + digits.slice(1);
  }
  if (digits.startsWith('9') && digits.length === 10) {
    return '+63' + digits;
  }
  if (digits.startsWith('639') && digits.length === 12) {
    return '+' + digits;
  }
  return phone.startsWith('+') ? phone : '+63' + digits;
};

/**
 * Create or reuse the invisible reCAPTCHA verifier for Firebase Phone Auth
 */
export const getRecaptchaVerifier = (containerId: string = 'recaptcha-container'): RecaptchaVerifier => {
  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear();
    } catch {}
    recaptchaVerifier = null;
  }

  // Ensure target container exists in DOM
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    document.body.appendChild(container);
  }

  recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved automatically
    },
    'expired-callback': () => {
      if (recaptchaVerifier) {
        try {
          recaptchaVerifier.clear();
        } catch {}
        recaptchaVerifier = null;
      }
    }
  });

  return recaptchaVerifier;
};

/**
 * Send real SMS verification OTP using Firebase
 */
export const sendFirebaseSmsOtp = async (phone: string, containerId: string = 'recaptcha-container'): Promise<boolean> => {
  const e164Phone = formatToE164(phone);
  try {
    const verifier = getRecaptchaVerifier(containerId);
    confirmationResult = await signInWithPhoneNumber(auth, e164Phone, verifier);
    return true;
  } catch (error: any) {
    // Reset recaptcha verifier on failure so next attempt works
    if (recaptchaVerifier) {
      try {
        recaptchaVerifier.clear();
      } catch {}
      recaptchaVerifier = null;
    }

    const code = error?.code || '';
    if (code === 'auth/unauthorized-domain') {
      throw new Error('This domain is not authorized in Firebase. Please add your Vercel URL to Firebase Console > Authentication > Settings > Authorized domains.');
    }
    if (code === 'auth/invalid-phone-number') {
      throw new Error('Invalid mobile number format. Please enter a valid 11-digit Philippine mobile number.');
    }
    if (code === 'auth/quota-exceeded') {
      throw new Error('Firebase SMS daily quota exceeded. Please use your test phone number in Firebase Console.');
    }
    if (code === 'auth/too-many-requests') {
      throw new Error('Too many requests sent. Please wait a minute and try again.');
    }
    throw error;
  }
};

/**
 * Confirm 6-digit code received via SMS
 */
export const verifyFirebaseSmsOtp = async (code: string): Promise<boolean> => {
  if (!confirmationResult) {
    throw new Error('No active SMS verification session. Please request a new code.');
  }
  try {
    const result = await confirmationResult.confirm(code);
    return !!result.user;
  } catch (error: any) {
    const errorCode = error?.code || '';
    if (errorCode === 'auth/invalid-verification-code') {
      throw new Error('Invalid verification code. Please check your SMS and try again.');
    }
    if (errorCode === 'auth/code-expired') {
      throw new Error('Verification code has expired. Please request a new code.');
    }
    throw error;
  }
};

