import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (pin: string, phone?: string) => boolean;
  loginWithSms: (phone: string, code: string) => Promise<boolean>;
  logout: () => void;
  register: (phone: string) => boolean;
  createPin: (pin: string, code?: string) => Promise<boolean> | boolean;
  resetPin: (newPin: string, confirmPin: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const isAuth = sessionStorage.getItem('vjays_authenticated') === 'true';
      if (isAuth) {
        return {
          id: '1',
          name: 'Vjay',
          phone: localStorage.getItem('vjays_phone') || '912 345 6789',
          role: 'owner',
        };
      }
    } catch {}
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('vjays_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  const [storedPin, setStoredPin] = useState<string | null>(() => {
    try {
      return localStorage.getItem('vjays_pin');
    } catch {
      return null;
    }
  });

  const login = useCallback((pin: string, phone?: string): boolean => {
    try {
      const saved = localStorage.getItem('vjays_pin');
      if (saved && pin === saved) {
        setUser({
          id: '1',
          name: 'Vjay',
          phone: phone || localStorage.getItem('vjays_phone') || '912 345 6789',
          role: 'owner',
        });
        setIsAuthenticated(true);
        sessionStorage.setItem('vjays_authenticated', 'true');
        authApi.login(pin, phone).catch(() => {});
        return true;
      }
      // If no PIN exists yet on this device (first time), automatically register this PIN!
      if (!saved && pin.length === 6) {
        localStorage.setItem('vjays_pin', pin);
        setStoredPin(pin);
        setUser({
          id: '1',
          name: 'Vjay',
          phone: phone || localStorage.getItem('vjays_phone') || '912 345 6789',
          role: 'owner',
        });
        setIsAuthenticated(true);
        sessionStorage.setItem('vjays_authenticated', 'true');
        authApi.createPin(pin, phone).catch(() => {});
        return true;
      }
    } catch (e) {
      console.warn('Storage error during login:', e);
    }
    return false;
  }, []);

  const loginWithSms = useCallback(async (phone: string, code: string): Promise<boolean> => {
    try {
      const res = await authApi.loginWithCode(phone, code);
      if (res && res.user) {
        setUser({
          id: String(res.user.id || '1'),
          name: res.user.name || 'Vjay',
          phone: res.user.phone || phone,
          role: res.user.role || 'owner',
        });
        setIsAuthenticated(true);
        sessionStorage.setItem('vjays_authenticated', 'true');
        localStorage.setItem('vjays_phone', phone);
        return true;
      }
    } catch (err) {
      console.warn('API error during SMS login, checking local fallback:', err);
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem('vjays_authenticated');
    } catch {}
  }, []);

  const register = useCallback((phone: string): boolean => {
    if (phone.length >= 10) {
      localStorage.setItem('vjays_phone', phone);
      authApi.register(phone).catch(() => {});
      return true;
    }
    return false;
  }, []);

  const createPin = useCallback((pin: string, code?: string): boolean => {
    if (pin.length === 6 && !/^(012345|123456|234567|345678|456789|567890)$/.test(pin)) {
      localStorage.setItem('vjays_pin', pin);
      setStoredPin(pin);
      const phone = localStorage.getItem('vjays_phone') || '';
      setUser({
        id: '1',
        name: 'Vjay',
        phone: phone,
        role: 'owner',
      });
      setIsAuthenticated(true);
      sessionStorage.setItem('vjays_authenticated', 'true');
      authApi.createPin(pin, phone, code).catch(() => {});
      return true;
    }
    return false;
  }, []);

  const resetPin = useCallback((newPin: string, confirmPin: string): boolean => {
    if (newPin.length === 6 && newPin === confirmPin) {
      localStorage.setItem('vjays_pin', newPin);
      setStoredPin(newPin);
      const phone = localStorage.getItem('vjays_phone') || '09123456789';
      authApi.resetPin(newPin, confirmPin, phone).catch(() => {});
      return true;
    }
    return false;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, loginWithSms, logout, register, createPin, resetPin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
