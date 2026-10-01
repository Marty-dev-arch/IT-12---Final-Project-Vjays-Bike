import React from 'react';
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = 'Search...', 
  value, 
  onChange,
}) => {
  return (
    <div 
      className="flex items-center bg-white dark:bg-[#121212] gap-2 rounded-xl border border-brand-border dark:border-[#262626] px-3 py-1.5 font-poppins transition-colors focus-within:border-brand-orange dark:focus-within:border-[#FB714B]"
      style={{ boxShadow: '0px 1px 2px #0000000D' }}
    >
      <HiOutlineMagnifyingGlass className="w-4 h-4 text-neutral-400 dark:text-[#A1A1A1] shrink-0" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full text-xs text-slate-700 dark:text-[#EDEDED] bg-transparent border-0 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-[#737373] font-poppins"
      />
    </div>
  );
};

export default SearchBar;
