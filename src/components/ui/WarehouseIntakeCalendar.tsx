import React, { useState } from 'react';
import type { RestockSchedule } from '../../types';
import { HiChevronLeft, HiChevronRight, HiPlus } from 'react-icons/hi2';

interface WarehouseIntakeCalendarProps {
  schedules: RestockSchedule[];
  onAddSchedule: (dateStr: string) => void;
  initialDate?: Date;
}

export const WarehouseIntakeCalendar: React.FC<WarehouseIntakeCalendarProps> = ({
  schedules,
  onAddSchedule,
  initialDate = new Date(),
}) => {
  const [viewDate, setViewDate] = useState<Date>(initialDate);
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const handlePrevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Helper to format ISO date "YYYY-MM-DD" in local time
  const formatIsoDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const selectedIsoDate = formatIsoDate(selectedDate);

  // Calculate days for monthly grid
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  // Grid cells: 7 columns (Su, Mo, Tu, We, Th, Fr, Sa)
  interface CalendarDay {
    dateObj: Date;
    dayNumber: number;
    isCurrentMonth: boolean;
    isoDate: string;
  }

  const calendarDays: CalendarDay[] = [];

  // Trailing days from previous month
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const dateObj = new Date(currentYear, currentMonth - 1, dayNum);
    calendarDays.push({
      dateObj,
      dayNumber: dayNum,
      isCurrentMonth: false,
      isoDate: formatIsoDate(dateObj),
    });
  }

  // Days of current month
  for (let i = 1; i <= daysInCurrentMonth; i++) {
    const dateObj = new Date(currentYear, currentMonth, i);
    calendarDays.push({
      dateObj,
      dayNumber: i,
      isCurrentMonth: true,
      isoDate: formatIsoDate(dateObj),
    });
  }

  // Leading days of next month (fill up to multiple of 7, typically 35 or 42)
  const remainingCells = (7 - (calendarDays.length % 7)) % 7;
  // If calendar is 35 days or 28 days, ensure at least 35 days for a stable height
  const totalTargetCells = calendarDays.length + remainingCells < 35 ? 35 : calendarDays.length + remainingCells;
  const extraNextMonthDays = totalTargetCells - calendarDays.length;

  for (let i = 1; i <= extraNextMonthDays; i++) {
    const dateObj = new Date(currentYear, currentMonth + 1, i);
    calendarDays.push({
      dateObj,
      dayNumber: i,
      isCurrentMonth: false,
      isoDate: formatIsoDate(dateObj),
    });
  }

  // Filter schedules for the selected date
  const daySchedules = schedules.filter((s) => s.scheduledDate === selectedIsoDate);

  // Selected date formatted like "September 27, 2026"
  const selectedFormattedHeader = selectedDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="flex flex-col justify-between bg-white dark:bg-[#0A0A0A] p-5 sm:p-6 rounded-2xl border border-brand-border dark:border-[#262626] font-poppins shadow-xs min-h-[420px]">
      <div>
        {/* Card Heading: Restocking Scheduled */}
        <div className="flex flex-col mb-3">
          <span className="text-[#6F6F6F] dark:text-[#A1A1A1] text-xs font-medium block">
            Warehouse calendar
          </span>
          <h3 className="text-neutral-900 dark:text-[#EDEDED] text-base font-bold tracking-tight">
            Restocking Scheduled
          </h3>
        </div>

        {/* Navigation (< September 2026 >) */}
        <div className="flex items-center justify-between px-1 mb-2.5 select-none">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="w-7 h-7 flex items-center justify-center text-neutral-600 dark:text-[#A1A1A1] hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-[#1A1A1A] cursor-pointer transition-colors"
            title="Previous month"
          >
            <HiChevronLeft className="w-4 h-4" />
          </button>
          <h4 className="text-sm font-bold text-neutral-900 dark:text-[#EDEDED] tracking-tight">
            {monthNames[currentMonth]} {currentYear}
          </h4>
          <button
            type="button"
            onClick={handleNextMonth}
            className="w-7 h-7 flex items-center justify-center text-neutral-600 dark:text-[#A1A1A1] hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-[#1A1A1A] cursor-pointer transition-colors"
            title="Next month"
          >
            <HiChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Day-of-week Headers (Su, Mo, Tu, We, Th, Fr, Sa) */}
        <div className="grid grid-cols-7 mb-1 text-center select-none">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
            <span
              key={d}
              className="text-[11px] font-medium text-neutral-400 dark:text-[#737373] py-1"
            >
              {d}
            </span>
          ))}
        </div>

        {/* Calendar Dates Grid */}
        <div className="grid grid-cols-7 gap-y-1 gap-x-1 text-center select-none">
          {calendarDays.map((cell, idx) => {
            const isSelected = cell.isoDate === selectedIsoDate;
            const hasSchedule = schedules.some((s) => s.scheduledDate === cell.isoDate);

            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedDate(cell.dateObj);
                  if (!cell.isCurrentMonth) {
                    setViewDate(new Date(cell.dateObj.getFullYear(), cell.dateObj.getMonth(), 1));
                  }
                }}
                className={`relative w-8 h-8 sm:w-9 sm:h-9 mx-auto flex flex-col items-center justify-center rounded-xl text-xs transition-all cursor-pointer border-0 ${
                  isSelected
                    ? 'bg-[#121212] dark:bg-white text-white dark:text-neutral-900 font-bold shadow-xs'
                    : cell.isCurrentMonth
                    ? 'text-neutral-800 dark:text-[#EDEDED] hover:bg-neutral-100 dark:hover:bg-[#1A1A1A] font-medium'
                    : 'text-neutral-300 dark:text-neutral-600 hover:bg-neutral-50 dark:hover:bg-[#141414]'
                }`}
              >
                <span>{cell.dayNumber}</span>
                {/* Dot for schedules */}
                {hasSchedule && (
                  <span
                    className={`w-1 h-1 rounded-full absolute bottom-1 ${
                      isSelected
                        ? 'bg-[#FB714B] dark:bg-[#FB714B]'
                        : 'bg-brand-orange dark:bg-[#FB714B]'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Thin Horizontal Divider */}
      <div className="my-3.5 border-t border-neutral-100 dark:border-[#222222]" />

      {/* Bottom Area: Selected Date Header + '+' Add Button + Intake Cards */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-[#EDEDED]">
            {selectedFormattedHeader}
          </span>
          <button
            type="button"
            onClick={() => onAddSchedule(selectedIsoDate)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-neutral-700 dark:text-[#EDEDED] hover:bg-neutral-100 dark:hover:bg-[#1A1A1A] hover:text-brand-orange-dark dark:hover:text-[#FB714B] transition-colors cursor-pointer"
            title={`Schedule intake for ${selectedFormattedHeader}`}
          >
            <HiPlus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Scheduled Intake Pill Cards (Pixel-matching Reference Screenshot) */}
        {daySchedules.length > 0 ? (
          <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto pr-0.5">
            {daySchedules.map((s, idx) => {
              // Color themes matching the screenshot (Blue, Teal/Emerald, Warm Orange)
              const colorThemes = [
                {
                  bg: 'bg-[#EBF2FE] dark:bg-[#152338]',
                  text: 'text-[#1E65D5] dark:text-[#6BA6FF]',
                  dot: 'bg-[#2563EB]',
                  badgeColor: 'text-[#3B82F6] dark:text-[#93C5FD]',
                },
                {
                  bg: 'bg-[#E6F8F3] dark:bg-[#102B24]',
                  text: 'text-[#0D9488] dark:text-[#34D399]',
                  dot: 'bg-[#0D9488]',
                  badgeColor: 'text-[#14B8A6] dark:text-[#6EE7B7]',
                },
                {
                  bg: 'bg-[#FFF3E8] dark:bg-[#2B1B10]',
                  text: 'text-[#D96B27] dark:text-[#FB714B]',
                  dot: 'bg-[#EA580C]',
                  badgeColor: 'text-[#F97316] dark:text-[#FDBA74]',
                },
              ];
              const theme = colorThemes[idx % colorThemes.length];

              return (
                <div
                  key={s.id}
                  className={`${theme.bg} ${theme.text} rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs font-semibold shadow-2xs transition-all`}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className={`w-2 h-2 rounded-full ${theme.dot} shrink-0`} />
                    <span className="truncate">{s.productName}</span>
                  </div>
                  <span className={`text-[11px] font-bold ${theme.badgeColor} shrink-0`}>
                    +{s.targetQuantity} units
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-3.5 px-3 text-center rounded-xl bg-neutral-50/70 dark:bg-[#121212] border border-dashed border-neutral-200 dark:border-[#262626] flex items-center justify-center">
            <span className="text-xs text-neutral-400 dark:text-[#737373]">
              No intake scheduled for this day
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WarehouseIntakeCalendar;
