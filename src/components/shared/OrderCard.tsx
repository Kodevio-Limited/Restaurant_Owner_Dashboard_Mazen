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

function getStatusBadge(state: OrderState, isAr: boolean) {
  switch (state) {
    case 'pending':
      return {
        label: isAr ? 'قيد الانتظار' : 'Pending',
        className: 'bg-amber-50 text-amber-700 border-amber-200',
      };
    case 'preparing':
    case 'in_progress':
      return {
        label: isAr ? 'قيد التحضير' : 'Preparing',
        className: 'bg-blue-50 text-blue-700 border-blue-200',
      };
    case 'ready':
      return {
        label: isAr ? 'جاهز' : 'Ready',
        className: 'bg-orange-50 text-orange-700 border-orange-200',
      };
    case 'completed':
      return {
        label: isAr ? 'مكتمل' : 'Completed',
        className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      };
    case 'canceled':
      return {
        label: isAr ? 'ملغى' : 'Canceled',
        className: 'bg-rose-50 text-rose-700 border-rose-200',
      };
    case 'refunded':
      return {
        label: isAr ? 'مسترد' : 'Refunded',
        className: 'bg-purple-50 text-purple-700 border-purple-200',
      };
    default:
      return {
        label: isAr ? 'نشط' : 'Active',
        className: 'bg-gray-50 text-gray-700 border-gray-200',
      };
  }
}

export function OrderCard({ order, onOpen }: OrderCardProps) {
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
  const statusInfo = getStatusBadge(order.state, isAr);

  return (
    <div
      onClick={() => onOpen?.(order)}
      className="flex h-full w-full cursor-pointer flex-col gap-2.5 rounded-[16px] bg-white p-3.5 shadow-[0px_1px_3px_rgba(0,0,0,0.05)] transition-all hover:shadow-md"
    >
      {/* Header: customer + status badge + order no */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-base font-semibold leading-5 text-[#2D2F33]">{customerName}</span>
          <span
            className={cn(
              'inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium leading-4 text-white',
              paid ? 'bg-[#16C722]' : 'bg-[#E85E5E]',
            )}
          >
            {paid && <CardGlyph className="size-3 text-white" />}
            {paid ? (isAr ? 'مدفوع' : 'Paid') : (isAr ? 'غير مدفوع' : 'Unpaid')}
          </span>
        </div>
        <span className="shrink-0 font-satoshi text-xs font-medium text-[#989898]">{order.orderNo}</span>
      </div>

      {/* Meta info + View Details */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3 text-xs text-[#989898]">
          <div className="flex items-center gap-1 truncate">
            <Clock size={13} strokeWidth={1.8} className="shrink-0 text-[#989898]" />
            <span className="truncate">{timeText}</span>
          </div>
          <div className="flex items-center gap-1 truncate">
            <UtensilsCrossed size={13} strokeWidth={1.8} className="shrink-0 text-[#989898]" />
            <span className="truncate">{tableText}</span>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onOpen?.(order); }}
          aria-label={isAr ? `عرض تفاصيل الطلب ${order.orderNo}` : `View details of order ${order.orderNo}`}
          className="ms-auto flex shrink-0 items-center gap-1 rounded-lg bg-[#E6F1ED] px-2 py-1 text-[11px] font-semibold text-[#026F4F] transition-colors hover:bg-[#D6E9E2]"
        >
          <span>{isAr ? 'عرض' : 'View'}</span>
          <ArrowRight size={11} strokeWidth={2.4} className="rtl:rotate-180" />
        </button>
      </div>

      {/* Items — compact two-row display */}
      <div className="flex flex-col border-t border-dashed border-[#EAEAEA] pt-1">
        {visibleItems.map((item, idx) => {
          const itemName = isAr ? (item.name_ar ?? item.name) : item.name;
          const itemNote = isAr ? (item.note_ar ?? item.note) : item.note;
          return (
            <div key={item.id}>
              {idx > 0 && <div className="border-t border-dashed border-[#F0F0F0]" />}
              <div className="flex items-center justify-between gap-2 py-1.5">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md bg-[#F4F4F4]">
                    <Image src="/images/food-41e5d7.png" alt={itemName} fill sizes="44px" className="object-contain p-1" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-xs font-semibold leading-tight text-[#2D2F33]">{itemName}</span>
                    {itemNote && (
                      <span className="truncate text-[10px] leading-tight text-[#989898]">&ldquo;{itemNote}&rdquo;</span>
                    )}
                    <span className="font-satoshi text-xs font-semibold text-[#026F4F]">{item.price}</span>
                  </div>
                </div>
                <span className="shrink-0 self-end text-[11px] font-medium text-[#686868]">
                  {isAr ? `الكمية: ${item.qty}` : `Qty: ${item.qty}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer: View-only (No editing/accepting/rejecting) */}
      <div className="mt-auto flex items-center justify-between gap-2 border-t border-dashed border-[#E0E0E0] pt-2">
        <div className="flex flex-col">
          <span className="text-[11px] text-[#888]">
            {hiddenCount > 0 ? (isAr ? `+${hiddenCount} أصناف` : `+${hiddenCount} Items`) : '\u00A0'}
          </span>
          <span className="font-satoshi text-sm font-bold text-[#026F4F]">{order.total}</span>
        </div>
        <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold', statusInfo.className)}>
          {statusInfo.label}
        </span>
      </div>
    </div>
  );
}
