'use client';

import Image from 'next/image';
import { ArrowRight, CalendarDays, Table as TableIcon, Check, X } from 'lucide-react';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';

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

  // Cards stay identical in size no matter how big the order is: only the
  // first two lines render, anything beyond that folds into the +N counter.
  const MAX_VISIBLE_ITEMS = 2;
  const visibleItems = order.items.slice(0, MAX_VISIBLE_ITEMS);
  const hiddenCount = order.extraItems + Math.max(0, order.items.length - MAX_VISIBLE_ITEMS);

  const handleAccept = () => {
    onStepChange?.('accepted');
  };

  const handleCancel = () => {
    onStepChange?.('new');
  };

  const handleMarkReady = () => {
    onStepChange?.('ready');
  };

  const handleServe = () => {
    onStepChange?.('served');
  };

  const customerName = isAr ? (order.customer_ar ?? order.customer) : order.customer;
  const timeText = isAr ? (order.time_ar ?? order.time) : order.time;
  const tableText = isAr ? (order.table_ar ?? order.table) : order.table;

  return (
    <div
      onClick={() => onOpen?.(order)}
      className="flex h-full w-full cursor-pointer flex-col justify-between gap-4 rounded-2xl bg-white p-4 transition-shadow hover:shadow-md"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-[16px] font-medium leading-[22px] text-black">{customerName}</span>
          <span
            className={cn(
              'inline shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] leading-[15px]',
              paid ? 'inline-flex bg-[#16C722] text-white' : 'inline-flex bg-[#E9E9E9] text-[#686868]',
            )}
          >
            {paid ? <Check size={11} className="text-white" strokeWidth={3} /> : <X size={11} className="text-[#686868]" />}
            {paid ? (isAr ? 'مدفوع' : 'Paid') : (isAr ? 'غير مدفوع' : 'Unpaid')}
          </span>
        </div>
        <span className="shrink-0 text-[12px] leading-[18px] text-[#989898]">{order.orderNo}</span>
      </div>

      {/* Meta + View Details (same row) */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <CalendarDays size={15} strokeWidth={1.6} className="shrink-0 text-[#989898]" />
            <span className="truncate text-[12px] leading-[17px] text-[#989898]">{timeText}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TableIcon size={15} strokeWidth={1.6} className="shrink-0 text-[#989898]" />
            <span className="truncate text-[12px] leading-[17px] text-[#989898]">{tableText}</span>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onOpen?.(order); }}
          aria-label={isAr ? `عرض تفاصيل الطلب ${order.orderNo}` : `View details of order ${order.orderNo}`}
          className="flex shrink-0 flex-col items-center justify-center rounded-xl bg-[#FEF6D8] px-3.5 py-2 text-center text-[#8A6D00] transition-colors hover:bg-[#FCEFB4]"
        >
          <span className="text-[12px] font-semibold leading-[16px]">{isAr ? 'عرض' : 'View'}</span>
          <span className="flex items-center justify-center gap-1 text-[12px] font-semibold leading-[16px]">
            {isAr ? 'التفاصيل' : 'Details'}
            <ArrowRight size={13} strokeWidth={2.4} className="rtl:rotate-180" />
          </span>
        </button>
      </div>

      {/* Items — fixed two-row block so every card is the same size */}
      <div className="flex min-h-[116px] flex-col gap-3">
        {visibleItems.map((item) => {
          const itemName = isAr ? (item.name_ar ?? item.name) : item.name;
          const itemNote = isAr ? (item.note_ar ?? item.note) : item.note;
          return (
            <div key={item.id} className="flex h-[52px] items-center justify-between gap-2 overflow-hidden">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="relative h-[52px] w-[42px] shrink-0 overflow-hidden rounded-md bg-[#F2F2F2]">
                  <Image
                    src="/images/food-41e5d7.png"
                    alt={itemName}
                    fill
                    sizes="42px"
                    className="object-cover"
                  />
                </div>
                <div className="flex min-w-0 flex-col justify-center gap-0.5">
                  <span className="truncate text-[13px] font-medium leading-[18px] text-[#2D2F33]">{itemName}</span>
                  {itemNote && (
                    <span className="truncate text-[10.5px] leading-[14px] text-[#989898]">&ldquo;{itemNote}&rdquo;</span>
                  )}
                  <span className="text-[12px] font-semibold leading-[17px] text-[#026F4F]">{item.price}</span>
                </div>
              </div>
              <span className="shrink-0 text-[10.5px] font-medium leading-[14px] text-[#686868]">
                {isAr ? `الكمية: ${item.qty}` : `Qty: ${item.qty}`}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-2 border-t border-[#F2F2F2] pt-3">
        <div className="flex shrink-0 flex-col">
          <span className="text-[10.5px] leading-[15px] text-[#686868]">
            {hiddenCount > 0 ? (isAr ? `+${hiddenCount} أصناف` : `+${hiddenCount} Items`) : '\u00A0'}
          </span>
          <span className="text-[15px] font-semibold leading-[21px] text-[#026F4F]">{order.total}</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {step === 'new' && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); handleCancel(); }}
                aria-label={isAr ? 'رفض الطلب' : 'Cancel order'}
                className="flex h-9 shrink-0 items-center justify-center gap-1 rounded-[10px] bg-[#E85E5E] px-2.5 text-[11.5px] font-medium text-white transition-colors hover:bg-[#d94a4a]"
              >
                <X size={14} strokeWidth={2.5} />
                <span>{isAr ? 'رفض' : 'Reject'}</span>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleAccept(); }}
                aria-label={isAr ? 'قبول الطلب' : 'Accept order'}
                className="flex h-9 shrink-0 items-center justify-center gap-1 rounded-[10px] bg-[#64C864] px-2.5 text-[11.5px] font-medium text-white transition-colors hover:bg-[#4fb84f]"
              >
                <Check size={14} strokeWidth={2.8} />
                <span>{isAr ? 'قبول' : 'Accept'}</span>
              </button>
            </>
          )}

          {step === 'accepted' && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); handleCancel(); }}
                aria-label={isAr ? 'رفض الطلب' : 'Cancel order'}
                className="flex h-9 shrink-0 items-center justify-center gap-1 rounded-[10px] bg-[#E85E5E] px-2.5 text-[11.5px] font-medium text-white transition-colors hover:bg-[#d94a4a]"
              >
                <X size={14} strokeWidth={2.5} />
                <span>{isAr ? 'رفض' : 'Reject'}</span>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleMarkReady(); }}
                className="flex h-9 shrink-0 items-center justify-center rounded-[62px] bg-[#F97316] px-3.5 text-[12px] font-medium text-white transition-colors hover:bg-[#ea690b]"
              >
                {isAr ? 'تحديد كجاهز' : 'Mark Ready'}
              </button>
            </>
          )}

          {step === 'ready' && (
            <button
              onClick={(e) => { e.stopPropagation(); handleServe(); }}
              className="flex h-9 shrink-0 items-center justify-center rounded-[62px] bg-[#16A34A] px-4 text-[12px] font-medium text-white transition-colors hover:bg-[#128a3e]"
            >
              {isAr ? 'تقديم' : 'Serve'}
            </button>
          )}

          {step === 'served' && (
            <button
              disabled
              aria-disabled="true"
              className="flex h-9 cursor-not-allowed items-center justify-center rounded-[62px] bg-[#9CA3AF] px-4 text-[12px] font-medium text-white"
            >
              {isAr ? 'تم التقديم' : 'Served'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
