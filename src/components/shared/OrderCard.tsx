'use client';

import Image from 'next/image';
import { Clock, UtensilsCrossed, ArrowRight, Check, X } from 'lucide-react';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';

function CardGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M6.5 5A3.5 3.5 0 0 0 3 8.5V9.5h18V8.5A3.5 3.5 0 0 0 17.5 5h-11Z" />
      <path d="M3 11h18v4.5A3.5 3.5 0 0 1 17.5 19h-11A3.5 3.5 0 0 1 3 15.5V11Z" />
    </svg>
  );
}

export interface OrderItem {
  id: string;
  name: string;
  name_ar?: string;
  note?: string;
  note_ar?: string;
  modifiers?: string[];
  modifiers_ar?: string[];
  price: string;
  qty: number;
}

export type OrderState = 'pending' | 'preparing' | 'in_progress' | 'ready' | 'completed' | 'canceled' | 'refunded';

export interface Order {
  id: string;
  customer: string;
  customer_ar?: string;
  phone?: string;
  email?: string;
  orderNo: string;
  status: 'paid' | 'unpaid';
  state: OrderState;
  time: string;
  time_ar?: string;
  table: string;
  table_ar?: string;
  items: OrderItem[];
  extraItems: number;
  total: string;
}

export type OrderFlowStep = 'new' | 'accepted' | 'ready' | 'served';

interface OrderCardProps {
  order: Order;
  step?: OrderFlowStep;
  onStepChange?: (step: OrderFlowStep) => void;
  onOpen?: (order: Order) => void;
}

export function OrderCard({ order, step = 'new', onStepChange, onOpen }: OrderCardProps) {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const paid = order.status === 'paid';

  // Keep every card the same height: only the first two lines render, the rest
  // fold into the +N counter.
  const MAX_VISIBLE_ITEMS = 2;
  const visibleItems = order.items.slice(0, MAX_VISIBLE_ITEMS);
  const hiddenCount = order.extraItems + Math.max(0, order.items.length - MAX_VISIBLE_ITEMS);

  const customerName = isAr ? (order.customer_ar ?? order.customer) : order.customer;
  const timeText = isAr ? (order.time_ar ?? order.time) : order.time;
  const tableText = isAr ? (order.table_ar ?? order.table) : order.table;
  const terminal = order.state === 'canceled' || order.state === 'refunded';

  return (
    <div
      onClick={() => onOpen?.(order)}
      className="@container flex h-full w-full cursor-pointer flex-col gap-4 rounded-[20px] bg-white p-5 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-md"
    >
      {/* Header: customer + status badge + order no */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="truncate text-[20px] font-medium leading-[28px] text-black">{customerName}</span>
          <span
            className={cn(
              'inline-flex shrink-0 items-center gap-1 rounded-full py-[5px] text-[13px] leading-[18px] text-white',
              paid ? 'bg-[#16C722] px-2' : 'bg-[#E85E5E] px-2.5',
            )}
          >
            {paid && <CardGlyph className="size-[15px] text-white" />}
            {paid ? (isAr ? 'مدفوع' : 'Paid') : (isAr ? 'غير مدفوع' : 'Unpaid')}
          </span>
        </div>
        <span className="shrink-0 text-[15px] leading-[21px] text-[#989898]">{order.orderNo}</span>
      </div>

      {/* Meta + View Details */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <div className="flex min-w-[140px] grow flex-col gap-2">
          <div className="flex items-center gap-2">
            <Clock size={18} strokeWidth={1.6} className="shrink-0 text-[#989898]" />
            <span className="truncate text-[14px] leading-[19px] text-[#989898]">{timeText}</span>
          </div>
          <div className="flex items-center gap-2">
            <UtensilsCrossed size={18} strokeWidth={1.6} className="shrink-0 text-[#989898]" />
            <span className="truncate text-[14px] leading-[19px] text-[#989898]">{tableText}</span>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onOpen?.(order); }}
          aria-label={isAr ? `عرض تفاصيل الطلب ${order.orderNo}` : `View details of order ${order.orderNo}`}
          className="ms-auto flex shrink-0 items-center justify-center rounded-xl bg-[#E6F1ED] px-3 py-2 text-[12px] font-semibold text-[#026F4F] transition-colors hover:bg-[#D6E9E2]"
        >
          {/* Wide: one line "View Details →" */}
          <span className="flex items-center gap-1.5 leading-[16px] @max-[300px]:hidden">
            <span>{isAr ? 'عرض التفاصيل' : 'View Details'}</span>
            <ArrowRight size={14} strokeWidth={2.4} className="rtl:rotate-180" />
          </span>
          {/* Narrow: stacked View / → / Details so long dates always fit */}
          <span className="hidden flex-col items-center gap-0.5 leading-[13px] @max-[300px]:flex">
            <span>{isAr ? 'عرض' : 'View'}</span>
            <ArrowRight size={13} strokeWidth={2.4} className="rtl:rotate-180" />
            <span>{isAr ? 'التفاصيل' : 'Details'}</span>
          </span>
        </button>
      </div>

      {/* Items — fixed two-row block so every card is the same size */}
      <div className="flex flex-col">
        {visibleItems.map((item, idx) => {
          const itemName = isAr ? (item.name_ar ?? item.name) : item.name;
          const itemNote = isAr ? (item.note_ar ?? item.note) : item.note;
          return (
            <div key={item.id}>
              {idx > 0 && <div className="border-t border-dashed border-[#E0E0E0]" />}
              <div className="flex items-center justify-between gap-3 py-3">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="relative h-[78px] w-[72px] shrink-0 overflow-hidden rounded-[8px] bg-[#F2F2F2]">
                    <Image src="/images/food-41e5d7.png" alt={itemName} fill sizes="72px" className="object-contain p-[10px]" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="truncate text-[15px] font-medium leading-[21px] text-[#2D2F33]">{itemName}</span>
                    {itemNote && (
                      <span className="truncate text-[12px] leading-[17px] text-[#989898]">&ldquo;{itemNote}&rdquo;</span>
                    )}
                    <span className="text-[15px] font-semibold leading-[21px] text-[#026F4F]">{item.price}</span>
                  </div>
                </div>
                <span className="shrink-0 self-end text-[12px] font-medium leading-[17px] text-[#686868]">
                  {isAr ? `الكمية: ${item.qty}` : `Qty: ${item.qty}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-dashed border-[#E0E0E0] pt-4">
        <div className="flex flex-col gap-1">
          <span className="text-[13px] leading-[18px] text-[#686868]">
            {hiddenCount > 0 ? (isAr ? `+${hiddenCount} أصناف` : `+${hiddenCount} Items`) : '\u00A0'}
          </span>
          <span className="text-[19px] font-semibold leading-[27px] text-[#026F4F]">{order.total}</span>
        </div>
        <div className="flex items-center gap-1.5">
            {!terminal && step === 'new' && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); onStepChange?.('new'); }}
                  aria-label={isAr ? 'رفض الطلب' : 'Reject order'}
                  className="flex h-9 shrink-0 items-center justify-center gap-1 rounded-[10px] bg-[#E85E5E] px-2.5 text-[12px] font-medium text-white transition-colors hover:bg-[#d94a4a]"
                >
                  <X size={14} strokeWidth={2.5} />
                  <span>{isAr ? 'رفض' : 'Reject'}</span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onStepChange?.('accepted'); }}
                  aria-label={isAr ? 'قبول الطلب' : 'Accept order'}
                  className="flex h-9 shrink-0 items-center justify-center gap-1 rounded-[10px] bg-[#64C864] px-2.5 text-[12px] font-medium text-white transition-colors hover:bg-[#4fb84f]"
                >
                  <Check size={14} strokeWidth={2.8} />
                  <span>{isAr ? 'قبول' : 'Accept'}</span>
                </button>
              </>
            )}
            {!terminal && step === 'accepted' && (
              <button
                onClick={(e) => { e.stopPropagation(); onStepChange?.('ready'); }}
                className="flex h-[42px] shrink-0 items-center justify-center rounded-full bg-[#F97316] px-5 text-[15px] font-medium text-white transition-colors hover:bg-[#ea690b]"
              >
                {isAr ? 'تحديد كجاهز' : 'Mark Ready'}
              </button>
            )}
            {!terminal && step === 'ready' && (
              <button
                onClick={(e) => { e.stopPropagation(); onStepChange?.('served'); }}
                className="flex h-[42px] shrink-0 items-center justify-center rounded-full bg-[#16A34A] px-6 text-[15px] font-medium text-white transition-colors hover:bg-[#128a3e]"
              >
                {isAr ? 'إكمال' : 'Complete'}
              </button>
            )}
            {!terminal && step === 'served' && (
              <button
                disabled
                aria-disabled="true"
                className="flex h-[42px] shrink-0 cursor-not-allowed items-center justify-center rounded-full bg-[#9CA3AF] px-6 text-[15px] font-medium text-white"
              >
                {isAr ? 'مكتمل' : 'Completed'}
              </button>
            )}
            {terminal && (
              <span className="inline-flex h-[30px] items-center rounded-full bg-[#E9E9E9] px-3 text-[12px] font-medium text-[#686868]">
                {isAr ? (order.state === 'canceled' ? 'ملغى' : 'مسترد') : order.state === 'canceled' ? 'Canceled' : 'Refunded'}
              </span>
            )}
        </div>
      </div>
    </div>
  );
}
