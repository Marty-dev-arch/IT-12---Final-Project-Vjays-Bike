'use client'

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const defaultUserGuideItems: FAQItem[] = [
  {
    id: 'item-1',
    question: 'How do I register a new bike part in the inventory?',
    answer: 'Navigate to any category under Products in the sidebar (or click "Manage & add parts" on the dashboard). Click "+ Add new" to enter the part name, Sku number, brand, selling price, cost price, Stock Units, Safety Min Stock level, and storage bin location. You can also upload a photo of the part.',
  },
  {
    id: 'item-2',
    question: 'How do stock in and stock out floor operations work?',
    answer: 'Use the "Stock in" button on the dashboard or stock movement page when receiving new supplier deliveries. Use "Stock out" when parts are used in bike repair work orders, sold to customers, or transferred. Every intake and dispatch updates stock quantities in real time.',
  },
  {
    id: 'item-3',
    question: 'What is the safety buffer threshold and restock queue?',
    answer: 'Each bike part has a safety buffer threshold. When available units drop to or below this buffer, the part is automatically flagged in the Restock queue on your dashboard so you can promptly reorder before running out of stock.',
  },
  {
    id: 'item-4',
    question: 'How do I inspect and export the audit logs history?',
    answer: 'All catalog modifications, intake shipments, and sales dispatches are permanently recorded with timestamps in the Logs history page. You can filter by action type or click "Export (Csv)" to download a full spreadsheet report.',
  },
  {
    id: 'item-5',
    question: 'How do I switch between light mode and dark mode?',
    answer: 'Click the animated theme toggle button located on the top right of the header bar anytime. It seamlessly switches between the clean light palette and the minimal pitch-black dark theme.',
  },
  {
    id: 'item-6',
    question: 'How do I change or reset my 6-digit security pin?',
    answer: 'Click the Logout button in the header bar to return to the access screen, then click "Forgot pin?". You can securely set up a new 6-digit security pin with phone confirmation.',
  },
];

interface UserGuideProps {
  className?: string;
  items?: FAQItem[];
  title?: string;
  subtitle?: string;
}

export default function FAQs({
  className = '',
  items = defaultUserGuideItems,
  title = 'User guide',
  subtitle = 'Discover quick and comprehensive answers on how to manage inventory, floor operations, and audit records in Vjay\'s Bike Parts system.',
}: UserGuideProps) {
  return (
    <div className={`font-poppins ${className}`}>
      <div className="w-full">
        <div className="mb-6">
          <h2 className="text-neutral-900 dark:text-[#EDEDED] text-2xl font-bold tracking-tight mb-2">
            {title}
          </h2>
          <p className="text-neutral-500 dark:text-[#A1A1A1] text-xs sm:text-sm leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div>
          <Accordion
            type="single"
            collapsible
            className="bg-white dark:bg-[#121212] rounded-2xl w-full border border-brand-border dark:border-[#262626] px-5 sm:px-6 py-2 shadow-xs"
          >
            {items.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-b border-brand-border/60 dark:border-[#262626] last:border-b-0"
              >
                <AccordionTrigger className="cursor-pointer text-sm font-semibold hover:no-underline py-4 text-neutral-900 dark:text-[#EDEDED] text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-xs text-neutral-600 dark:text-[#A1A1A1] leading-relaxed pb-3">
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}

export { FAQs as UserGuide };
