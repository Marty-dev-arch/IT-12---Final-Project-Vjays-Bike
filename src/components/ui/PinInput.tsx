import React, { useRef, useEffect, useState, useCallback } from 'react';

interface PinInputProps {
  length?: number;
  onComplete: (pin: string) => void;
  error?: string;
  disabled?: boolean;
}

const PinInput: React.FC<PinInputProps> = ({ length = 6, onComplete, error, disabled = false }) => {
  const [values, setValues] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = useCallback((index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newValues = [...values];
    newValues[index] = value.slice(-1);
    setValues(newValues);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    const pin = newValues.join('');
    if (pin.length === length && newValues.every(v => v !== '')) {
      onComplete(pin);
    }
  }, [values, length, onComplete]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newValues = [...values];
      newValues[index - 1] = '';
      setValues(newValues);
    }
  }, [values]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    const newValues = Array(length).fill('');
    pasted.split('').forEach((char, i) => {
      newValues[i] = char;
    });
    setValues(newValues);
    if (pasted.length === length) {
      onComplete(pasted);
    } else {
      inputRefs.current[pasted.length]?.focus();
    }
  }, [length, onComplete]);

  const reset = useCallback(() => {
    setValues(Array(length).fill(''));
    inputRefs.current[0]?.focus();
  }, [length]);

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div className="flex justify-center items-center gap-1.5 sm:gap-2.5 max-w-full" onPaste={handlePaste}>
        {values.map((value, index) => (
          <input
            key={index}
            ref={el => { inputRefs.current[index] = el; }}
            type="password"
            inputMode="numeric"
            maxLength={1}
            value={value}
            onChange={e => handleChange(index, e.target.value)}
            onKeyDown={e => handleKeyDown(index, e)}
            disabled={disabled}
            className={`w-9 h-10 xs:w-10 xs:h-11 sm:w-[46px] sm:h-[46px] text-center text-lg sm:text-xl font-bold rounded-xl border transition-all
              ${value 
                ? 'border-neutral-900 dark:border-white bg-white dark:bg-[#121212] text-neutral-900 dark:text-[#EDEDED] shadow-sm' 
                : 'border-brand-border dark:border-[#262626] bg-white dark:bg-[#121212] text-neutral-900 dark:text-[#EDEDED] shadow-sm'
              }
              ${error ? 'border-red-400 shake' : ''}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-neutral-400 dark:hover:border-[#737373]'}
              focus:border-neutral-900 dark:focus:border-[#FB714B] focus:ring-0 focus:outline-none
              font-poppins
            `}
            style={{ boxShadow: '0px 1px 2px #0000000D' }}
          />
        ))}
      </div>
      {error && (
        <span className="text-red-500 text-xs font-poppins mt-1">{error}</span>
      )}
    </div>
  );
};

export default PinInput;
