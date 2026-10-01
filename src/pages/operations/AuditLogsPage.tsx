import React, { useState } from 'react';
import StatsCard from '../../components/ui/StatsCard';
import { useInventory } from '../../context/InventoryContext';
import {
  HiOutlineClipboardDocumentList,
  HiOutlineMagnifyingGlass,
  HiOutlineDocumentArrowDown,
  HiOutlineArrowDownTray,
  HiOutlineArrowUpTray,
  HiOutlineCheckBadge,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineTag,
  HiOutlineBuildingStorefront,
} from 'react-icons/hi2';

const categoryLabels: Record<string, string> = {
  'braking-system': 'Braking system',
  'drivetrain-chains': 'Drivetrain & chains',
  'handle-bar-handle-grip': 'Handle Bar & Handle Grip',
  'gears-sprockets': 'Handle Bar & Handle Grip',
};

const AuditLogsPage: React.FC = () => {
  const { auditLogs, exportLogsToCSV, products } = useInventory();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'stock-in' | 'stock-out' | 'verification' | 'adjustment'>('all');

  const stockInEntries = auditLogs.filter((l) => l.type === 'stock-in').length;
  const stockOutEntries = auditLogs.filter((l) => l.type === 'stock-out').length;
  const verificationEntries = auditLogs.filter((l) => l.type === 'verification').length;

  const filteredLogs = auditLogs.filter((log) => {
    if (filterType !== 'all' && log.type !== filterType) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.productName.toLowerCase().includes(q) ||
      log.sku.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q)
    );
  });

  const formatLogDateTime = (timestampStr: string) => {
    try {
      const d = new Date(timestampStr);
      if (!isNaN(d.getTime())) {
        const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        return { dateStr, timeStr };
      }
    } catch (e) {}
    return { dateStr: timestampStr || 'Today', timeStr: '' };
  };

  const getActionBadge = (type: string) => {
    switch (type) {
      case 'stock-in':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 dark:text-emerald-400">
            <HiOutlineArrowDownTray className="w-3.5 h-3.5" /> Stock in
          </span>
        );
      case 'stock-out':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-orange-dark dark:text-[#FB714B]">
            <HiOutlineArrowUpTray className="w-3.5 h-3.5" /> Stock out
          </span>
        );
      case 'verification':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400">
            <HiOutlineCheckBadge className="w-3.5 h-3.5" /> Verified
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 dark:text-purple-400">
            <HiOutlineAdjustmentsHorizontal className="w-3.5 h-3.5" /> Adjustment
          </span>
        );
    }
  };

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 font-poppins pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
        <div>
          <h1 className="text-neutral-900 dark:text-[#EDEDED] text-xl sm:text-2xl font-bold tracking-tight">Audit logs and history</h1>
          <p className="text-neutral-500 dark:text-[#A1A1A1] text-xs sm:text-sm mt-0.5">
            Immutable log of all part additions, stock operations, and verifications
          </p>
        </div>

        {/* Export Button */}
        <button
          onClick={exportLogsToCSV}
          className="btn-adapt adapt-mobile w-auto self-end sm:self-auto flex items-center justify-center bg-white dark:bg-[#121212] text-neutral-800 dark:text-[#EDEDED] border border-brand-border dark:border-[#262626] active:border-red-500 py-1.5 px-3 sm:py-2.5 sm:px-4 gap-1.5 rounded-lg text-[11px] sm:text-xs font-semibold cursor-pointer hover:bg-neutral-50 dark:hover:bg-[#1A1A1A] active:scale-[0.98] transition-all shadow-xs"
        >
          <HiOutlineDocumentArrowDown className="w-3.5 h-3.5 text-neutral-600 dark:text-[#A1A1A1]" />
          Export (CSV)
        </button>
      </div>

      {/* Summary Metrics - Dashboard Card Layout */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-5 sm:mb-6">
        <StatsCard
          label="Total log entries"
          value={auditLogs.length}
          subtitle="Activity entries recorded"
          icon={<HiOutlineClipboardDocumentList className="w-5 h-5 text-neutral-600 dark:text-[#A1A1A1]" />}
        />
        <StatsCard
          label="Stock in entries"
          value={stockInEntries}
          subtitle="Inflow intake events"
          icon={<HiOutlineArrowDownTray className="w-5 h-5 text-neutral-600 dark:text-[#A1A1A1]" />}
        />
        <StatsCard
          label="Stock out entries"
          value={stockOutEntries}
          subtitle="Dispatched order events"
          icon={<HiOutlineArrowUpTray className="w-5 h-5 text-neutral-600 dark:text-[#A1A1A1]" />}
        />
        <StatsCard
          label="Verifications"
          value={verificationEntries}
          subtitle="Audited count checks"
          icon={<HiOutlineCheckBadge className="w-5 h-5 text-neutral-600 dark:text-[#A1A1A1]" />}
        />
      </div>

      {/* Filter and Clean Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 mb-3.5 sm:mb-5">
        {/* Clean Search Bar */}
        <div className="w-full sm:w-64 flex items-center bg-white dark:bg-[#121212] rounded-xl border border-brand-border dark:border-[#262626] px-3 py-2 sm:px-3.5 sm:py-2.5 gap-2 focus-within:border-brand-orange dark:focus-within:border-[#FB714B] shadow-xs">
          <HiOutlineMagnifyingGlass className="w-3.5 h-3.5 text-neutral-400 dark:text-[#737373] shrink-0" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="adapt-mobile w-full text-xs text-neutral-800 dark:text-[#EDEDED] bg-transparent border-0 focus:outline-none placeholder:text-neutral-400 dark:placeholder:text-[#737373] font-poppins"
          />
        </div>

        {/* Filter buttons - No ugly scrollbar on mobile */}
        <div className="flex items-center bg-white dark:bg-[#121212] rounded-xl border border-brand-border dark:border-[#262626] p-1 overflow-x-auto max-w-full shadow-xs [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {(['all', 'stock-in', 'stock-out', 'verification', 'adjustment'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`btn-adapt adapt-mobile py-1 px-2.5 text-[11px] sm:text-xs font-medium rounded-lg transition-all border-0 cursor-pointer whitespace-nowrap ${
                filterType === type
                  ? 'bg-[#FFF5ED] dark:bg-[#1A120E] text-[#C25E00] dark:text-[#FB714B] font-semibold'
                  : 'text-neutral-600 dark:text-[#A1A1A1] hover:text-neutral-900 dark:hover:text-[#EDEDED] bg-transparent'
              }`}
            >
              {type === 'all'
                ? 'All logs'
                : type === 'stock-in'
                ? 'Stock in'
                : type === 'stock-out'
                ? 'Stock out'
                : type === 'verification'
                ? 'Verified'
                : 'Adjustments'}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Table / Minimal Border Layout */}
      <div className="minimal-inventory-container rounded-xl overflow-hidden shadow-xs">
        {filteredLogs.length === 0 ? (
          <div className="py-12 px-4 text-center text-neutral-400 dark:text-[#737373]">
            <HiOutlineClipboardDocumentList className="w-10 h-10 stroke-1 mx-auto mb-2 text-neutral-300 dark:text-[#737373]" />
            <p className="text-sm font-semibold text-neutral-700 dark:text-[#EDEDED]">No audit records found</p>
            <p className="text-xs text-neutral-400 dark:text-[#A1A1A1] mt-1 max-w-sm mx-auto">
              All part registration, updates, and floor operations are automatically logged here.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm font-poppins border-collapse">
                <thead>
                  <tr className="minimal-table-header">
                    <th className="py-3 px-6 text-neutral-800 dark:text-[#EDEDED] font-semibold text-xs">Action / Event</th>
                    <th className="py-3 px-4 text-neutral-800 dark:text-[#EDEDED] font-semibold text-xs">Date & Time</th>
                    <th className="py-3 px-6 text-neutral-800 dark:text-[#EDEDED] font-semibold text-xs minimal-v-divider">Part details & SKU</th>
                    <th className="py-3 px-4 text-neutral-800 dark:text-[#EDEDED] font-semibold text-xs">Brand</th>
                    <th className="py-3 px-4 text-neutral-800 dark:text-[#EDEDED] font-semibold text-xs">Category</th>
                    <th className="py-3 px-6 text-neutral-800 dark:text-[#EDEDED] font-semibold text-xs">Event details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => {
                    const prod = products.find((p) => p.sku === log.sku || p.name === log.productName);
                    const dt = formatLogDateTime(log.timestamp);
                    const brandName = prod?.brand || log.brand || 'Generic';
                    const catKey = prod?.category || log.category;
                    const categoryName = catKey ? (categoryLabels[catKey] || catKey) : 'General';
                    return (
                      <tr key={log.id} className="minimal-row">
                        <td className="py-3.5 px-6 whitespace-nowrap">{getActionBadge(log.type)}</td>
                        <td className="py-3.5 px-4 text-xs whitespace-nowrap">
                          <span className="font-medium text-neutral-800 dark:text-[#EDEDED] block">{dt.dateStr}</span>
                          {dt.timeStr && (
                            <span className="text-[11px] text-neutral-400 dark:text-[#737373] block">{dt.timeStr}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-6 minimal-v-divider">
                          <div className="font-semibold text-neutral-900 dark:text-[#EDEDED] text-xs sm:text-sm">{log.productName}</div>
                          <div className="text-xs text-neutral-500 dark:text-[#A1A1A1] font-mono">{log.sku}</div>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-xs text-neutral-800 dark:text-[#EDEDED]">
                          {brandName}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-xs text-neutral-600 dark:text-[#A1A1A1] bg-neutral-100 dark:bg-[#121212] px-2 py-0.5 rounded border border-neutral-200 dark:border-[#262626]">
                            {categoryName}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-xs text-neutral-700 dark:text-[#EDEDED]">
                          {log.details}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Minimal List View (No Cards, Clean Border-b Rows) */}
            <div className="block md:hidden">
              {filteredLogs.map((log) => {
                const prod = products.find((p) => p.sku === log.sku || p.name === log.productName);
                const dt = formatLogDateTime(log.timestamp);
                const brandName = prod?.brand || log.brand || 'Generic';
                const catKey = prod?.category || log.category;
                const categoryName = catKey ? (categoryLabels[catKey] || catKey) : 'General';
                return (
                  <div key={log.id} className="minimal-row py-3 px-3 flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-xs text-neutral-900 dark:text-[#EDEDED] truncate">
                          {log.productName}
                        </div>
                        <div className="text-[10px] sm:text-[10.5px] text-neutral-500 dark:text-[#A1A1A1] flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                          <span className="font-mono whitespace-nowrap font-medium text-neutral-700 dark:text-[#D4D4D8]">Sku: {log.sku}</span>
                          <span>•</span>
                          <span className="truncate">{brandName}</span>
                          <span>•</span>
                          <span className="whitespace-nowrap text-neutral-400 dark:text-neutral-500">{dt.dateStr}{dt.timeStr ? ` ${dt.timeStr}` : ''}</span>
                        </div>
                      </div>

                      <div className="shrink-0 text-right minimal-v-divider pl-2">
                        {getActionBadge(log.type)}
                      </div>
                    </div>

                    {/* Metadata Badges: Storage, Category */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 text-[9.5px] sm:text-[10px] text-neutral-700 dark:text-[#D4D4D8] bg-neutral-100 dark:bg-[#1A1A1A] px-1.5 py-0.5 rounded font-medium border border-neutral-200 dark:border-[#262626]">
                        <HiOutlineBuildingStorefront className="w-3 h-3 text-neutral-400 dark:text-[#737373] shrink-0" />
                        Storage: {prod?.location || 'Warehouse bin'}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[9.5px] sm:text-[10px] text-neutral-700 dark:text-[#D4D4D8] bg-neutral-100 dark:bg-[#1A1A1A] px-1.5 py-0.5 rounded font-medium border border-neutral-200 dark:border-[#262626]">
                        <HiOutlineTag className="w-3 h-3 text-neutral-400 dark:text-[#737373] shrink-0" />
                        {categoryName}
                      </span>
                      {prod?.price && (
                        <span className="text-[9.5px] sm:text-[10px] font-semibold text-neutral-700 dark:text-[#EDEDED] px-1 py-0.5">
                          ₱{prod.price.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-neutral-600 dark:text-[#A1A1A1] bg-neutral-50 dark:bg-[#121212] px-2 py-1 rounded">
                      {log.details}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuditLogsPage;
