import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (pin: string) => boolean;
  logout: () => void;
  register: (phone: string) => boolean;
  createPin: (pin: string) => boolean;
  resetPin: (newPin: string, confirmPin: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const isAuth = sessionStorage.getItem('vjays_authenticated') === 'true';
    if (isAuth) {
      return {
        id: '1',
        name: 'Vjay',
        phone: localStorage.getItem('vjays_phone') || '',
        role: 'owner',
      };
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('vjays_authenticated') === 'true';
  });

  const [storedPin, setStoredPin] = useState<string | null>(() => {
    let pin = localStorage.getItem('vjays_pin');
    if (!pin) {
      pin = '123456';
      localStorage.setItem('vjays_pin', pin);
    }
    return pin;
  });

  const login = useCallback((pin: string): boolean => {
    const saved = localStorage.getItem('vjays_pin') || '123456';
    if (saved && pin === saved) {
      setUser({
        id: '1',
        name: 'Vjay',
        phone: localStorage.getItem('vjays_phone') || '',
        role: 'owner',
      });
      setIsAuthenticated(true);
      sessionStorage.setItem('vjays_authenticated', 'true');
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('vjays_authenticated');
  }, []);

  const register = useCallback((phone: string): boolean => {
    if (phone.length >= 10) {
      localStorage.setItem('vjays_phone', phone);
      return true;
    }
    return false;
  }, []);

  const createPin = useCallback((pin: string): boolean => {
    if (pin.length === 6 && !/^(012345|123456|234567|345678|456789|567890)$/.test(pin)) {
      localStorage.setItem('vjays_pin', pin);
      setStoredPin(pin);
      setUser({
        id: '1',
        name: 'Vjay',
        phone: localStorage.getItem('vjays_phone') || '',
        role: 'owner',
      });
      setIsAuthenticated(true);
      sessionStorage.setItem('vjays_authenticated', 'true');
      return true;
    }
    return false;
  }, []);

  const resetPin = useCallback((newPin: string, confirmPin: string): boolean => {
    if (newPin.length === 6 && newPin === confirmPin) {
      localStorage.setItem('vjays_pin', newPin);
      setStoredPin(newPin);
      return true;
    }
    return false;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register, createPin, resetPin }}>
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
