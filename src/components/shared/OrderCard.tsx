'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CalendarDays, Table as TableIcon, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface OrderItem {
  id: string;
  name: string;
  note?: string;
  modifiers?: string[];
  price: string;
  qty: number;
}

export type OrderState = 'active' | 'in_progress' | 'paid' | 'unpaid' | 'completed';

export interface Order {
  id: string;
  customer: string;
  phone?: string;
  email?: string;
  orderNo: string;
  status: 'paid' | 'unpaid';
  state: OrderState;
  time: string;
  table: string;
  items: OrderItem[];
  extraItems: number;
  total: string;
}

export type FlowStep = 'new' | 'accepted' | 'ready' | 'complete';

interface OrderCardProps {
  order: Order;
  onOpenModal?: (order: Order, action: string, onConfirm?: (nextStep: FlowStep) => void) => void;
}

export function OrderCard({ order, onOpenModal }: OrderCardProps) {
  const paid = order.status === 'paid';
  const [step, setStep] = useState<FlowStep>('new');

  const handleAccept = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenModal?.(order, 'mark_ready', (next) => setStep(next));
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStep('new');
  };

  const handleMarkReady = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenModal?.(order, 'mark_ready', (next) => setStep(next));
  };

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenModal?.(order, 'complete', (next) => setStep(next));
  };

  return (
    <div className="flex w-full flex-col justify-between gap-4 rounded-2xl bg-white p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-[16px] font-medium leading-[22px] text-black">{order.customer}</span>
          <span
            className={cn(
              'inline shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] leading-[15px]',
              paid ? 'inline-flex bg-[#16C722] text-white' : 'inline-flex bg-[#E9E9E9] text-[#686868]',
            )}
          >
            {paid ? <Check size={11} className="text-white" strokeWidth={3} /> : <X size={11} className="text-[#686868]" />}
            {paid ? 'Paid' : 'Unpaid'}
          </span>
        </div>
        <span className="shrink-0 text-[12px] leading-[18px] text-[#989898]">{order.orderNo}</span>
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <CalendarDays size={15} strokeWidth={1.6} className="shrink-0 text-[#989898]" />
          <span className="text-[12px] leading-[17px] text-[#989898]">{order.time}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <TableIcon size={15} strokeWidth={1.6} className="shrink-0 text-[#989898]" />
          <span className="text-[12px] leading-[17px] text-[#989898]">{order.table}</span>
        </div>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-3">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="relative h-[46px] w-[42px] shrink-0 overflow-hidden rounded-md bg-[#F2F2F2]">
                <Image
                  src="/images/food-41e5d7.png"
                  alt={item.name}
                  fill
                  sizes="42px"
                  className="object-cover"
                />
              </div>
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate text-[13px] font-medium leading-[18px] text-[#2D2F33]">{item.name}</span>
                {item.note && (
                  <span className="text-[10.5px] leading-[14px] text-[#989898]">&ldquo;{item.note}&rdquo;</span>
                )}
                <span className="text-[12px] font-semibold leading-[17px] text-[#026F4F]">{item.price}</span>
              </div>
            </div>
            <span className="shrink-0 text-[10.5px] font-medium leading-[14px] text-[#686868]">
              Qty: {item.qty}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 border-t border-[#F2F2F2] pt-3">
        <div className="flex flex-col">
          <span className="text-[10.5px] leading-[15px] text-[#686868]">
            {order.extraItems > 0 ? `+${order.extraItems} Items` : '\u00A0'}
          </span>
          <span className="text-[15px] font-semibold leading-[21px] text-[#026F4F]">{order.total}</span>
        </div>

        <div className="flex items-center gap-2">
          {step === 'new' && (
            <>
              <button
                onClick={handleCancel}
                aria-label="Cancel order"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E85E5E] text-white transition-colors hover:bg-[#d94a4a]"
              >
                <X size={17} strokeWidth={2.2} />
              </button>
              <button
                onClick={handleAccept}
                aria-label="Accept order"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#64C864] text-white transition-colors hover:bg-[#4fb84f]"
              >
                <Check size={17} strokeWidth={2.6} />
              </button>
            </>
          )}

          {step === 'accepted' && (
            <>
              <button
                onClick={handleCancel}
                aria-label="Cancel order"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E85E5E] text-white transition-colors hover:bg-[#d94a4a]"
              >
                <X size={17} strokeWidth={2.2} />
              </button>
              <button
                onClick={handleMarkReady}
                className="flex h-9 shrink-0 items-center justify-center rounded-[62px] bg-[#F97316] px-4 text-[12.5px] font-medium text-white transition-colors hover:bg-[#ea690b]"
              >
                Mark Ready
              </button>
            </>
          )}

          {step === 'ready' && (
            <button
              onClick={handleComplete}
              className="flex h-9 shrink-0 items-center justify-center rounded-[62px] bg-[#16A34A] px-4 text-[12.5px] font-medium text-white transition-colors hover:bg-[#128a3e]"
            >
              Complete
            </button>
          )}

          {step === 'complete' && (
            <span className="flex h-9 items-center justify-center rounded-[62px] bg-[#9CA3AF] px-4 text-[12.5px] font-medium text-white">
              Completed
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
