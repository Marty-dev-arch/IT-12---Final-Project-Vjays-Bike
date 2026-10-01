import React from 'react';

interface RestockItemProps {
  name: string;
  location: string;
  currentStock: number;
  minStock: number;
  severity: 'critical' | 'low';
  onIntake?: () => void;
}

const RestockItem: React.FC<RestockItemProps> = ({
  name,
  location,
  currentStock,
  minStock,
  severity,
  onIntake,
}) => {
  const percentage = Math.min((currentStock / minStock) * 100, 100);
  const barColor = severity === 'critical' ? '#C62828' : '#E98B3A';
  const textColor = severity === 'critical' ? 'text-[#C62828]' : 'text-[#E65100]';
  const badgeText = severity === 'critical' ? 'CRITICAL' : 'LOW STOCK';

  return (
    <div className="flex flex-col bg-brand-cream p-[15px] gap-2 rounded-xl border border-solid border-brand-border font-poppins">
      <div className="flex items-center gap-7">
        <div className="flex-1">
          <div className="flex flex-col items-start">
            <span className="text-neutral-900 text-xs font-bold">{name}</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[#6F6F6F] text-[11px]">{location}</span>
          </div>
        </div>
        <span className={`${textColor} text-[10px] font-bold`}>{badgeText}</span>
      </div>
      <div className="flex items-center py-1 gap-8">
        <div className="flex flex-1 items-center gap-1.5">
          <div className="flex flex-1 flex-col items-start">
            <span className={`${textColor} text-xs font-bold`}>{currentStock} in stock</span>
          </div>
          <span className="text-[#6F6F6F] text-[11px]">/ Min {minStock}</span>
        </div>
        <button
          onClick={onIntake}
          className="flex items-center bg-[#121212] hover:bg-neutral-800 text-white py-1 px-3 rounded-lg border-2 border-transparent cursor-pointer active:border-[#FB714B] active:ring-2 active:ring-[#FB714B]/30 focus:outline-none transition-all"
        >
          <span className="text-white text-[11px] font-bold">+ Intake</span>
        </button>
      </div>
      <div className="bg-neutral-200 rounded-full overflow-hidden">
        <div
          className="h-1.5 rounded-full transition-all duration-700"
          style={{ width: `${percentage}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
};

export default RestockItem;
