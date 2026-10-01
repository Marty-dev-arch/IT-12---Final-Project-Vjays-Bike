import React from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    direction: 'up' | 'down';
    label?: string;
  };
  valueColor?: string;
  progress?: {
    value: number;
    max: number;
    color?: string;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  subtitle,
  icon,
  trend,
  valueColor = 'text-neutral-900',
  progress,
}) => {
  return (
    <div className="flex-1 bg-white dark:bg-[#0A0A0A] p-3 sm:py-4 sm:px-5 rounded-2xl border border-brand-border dark:border-[#262626] shadow-xs font-poppins transition-colors">
      <div className="flex justify-between items-center pb-1.5 sm:pb-2.5 mb-0.5">
        <span className="text-[#6F6F6F] dark:text-[#A1A1A1] text-[10px] sm:text-xs font-medium leading-tight pr-1">
          {label}
        </span>
        <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400 dark:text-[#737373] shrink-0">
          {icon}
        </div>
      </div>
      <div className="flex flex-col items-start mb-0.5 sm:mb-1">
        <span className={`text-lg sm:text-2xl font-bold tracking-tight ${valueColor.includes('text-neutral-900') ? 'text-neutral-900 dark:text-[#EDEDED]' : valueColor}`}>
          {value}
        </span>
      </div>
      <div className="flex flex-col items-start">
        <span className="text-neutral-400 dark:text-[#737373] text-[9.5px] sm:text-xs line-clamp-1 leading-snug">
          {subtitle}
        </span>
      </div>
      {trend && (
        <div className="flex items-start pt-[25px] gap-[5px]">
          <span className={`text-xs font-bold ${trend.direction === 'up' ? 'text-[#2E7D32] dark:text-emerald-400' : 'text-[#C62828] dark:text-red-400'}`}>
            {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
          </span>
          {trend.label && (
            <span className="text-[#6F6F6F] dark:text-[#737373] text-[11px]">{trend.label}</span>
          )}
        </div>
      )}
      {progress && (
        <div className="mt-3 bg-neutral-100 dark:bg-[#262626] rounded-full overflow-hidden">
          <div
            className="h-1.5 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min((progress.value / progress.max) * 100, 100)}%`,
              backgroundColor: progress.color || '#E98B3A',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default StatsCard;
