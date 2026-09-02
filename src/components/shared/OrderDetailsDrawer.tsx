'use client';

import Image from 'next/image';
import { ArrowLeft, X, Phone, Mail, FileText, CookingPot, Check, BadgeCheck } from 'lucide-react';
import { Order, FlowStep } from '@/components/shared/OrderCard';
import { cn } from '@/lib/utils';

const STEPS = [
  { key: 'placed', label: 'Placed', icon: FileText },
  { key: 'preparing', label: 'Preparing', icon: CookingPot },
  { key: 'ready', label: 'Ready', icon: Check },
  { key: 'served', label: 'Served', icon: BadgeCheck },
];

const ACTIVE_STEPS = ['placed', 'preparing'];

function parsePrice(p: string): number {
  return parseFloat(p.replace(/[$,\s]/g, ''));
}

export function OrderDetailsModal({
  open,
  order,
  action,
  onConfirm,
  onClose,
}: {
  open: boolean;
  order: Order | null;
  action?: string;
  onConfirm?: (nextStep: FlowStep) => void;
  onClose: () => void;
}) {
  if (!order) return null;

  const itemCount = order.items.reduce((s, i) => s + i.qty, 0);
  const subtotal = order.items.reduce((s, i) => s + parsePrice(i.price) * i.qty, 0);
  const service = subtotal * 0.1;
  const total = subtotal + service;
  const money = (n: number) => `$${n.toFixed(2)}`;

  const handleConfirm = (nextStep: FlowStep) => {
    onConfirm?.(nextStep);
    onClose();
  };

  const handleCancel = () => {
    onConfirm?.(action === 'complete' ? 'ready' : 'new');
    onClose();
  };

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40 transition-opacity duration-300',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-full flex-col rounded-tl-3xl rounded-bl-3xl bg-[#F2F2F2] shadow-[-2px_0px_12px_rgba(0,0,0,0.10)] transition-transform duration-300 sm:w-[619px]',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between px-5 pt-6">
          <button
            onClick={onClose}
            aria-label="Back"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E9E9E9] text-black transition-colors hover:bg-[#DCDCDC]"
          >
            <ArrowLeft size={22} />
          </button>
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-[33px] font-medium leading-[46px] text-black">Order {order.orderNo}</h2>
            <p className="text-[19px] leading-[26.6px] text-[#686868]">Table: {order.table.replace('Table ', '')}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E85E5E] text-white transition-colors hover:bg-[#d94a4a]"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-[15px] overflow-y-auto px-5 pb-5 pt-8">
          <section className="rounded-[10px] bg-white p-5">
            <h3 className="text-[19px] font-medium leading-[26px] text-[#2D2F33]">{order.customer}</h3>
            <div className="mt-3.5 flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <Phone size={22} className="text-[#989898]" />
                <span className="text-[16px] leading-[22px] text-[#989898]">{order.phone ?? '+01284980'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={22} className="text-[#989898]" />
                <span className="text-[16px] leading-[22px] text-[#989898]">{order.email ?? 'mike.t@example.com'}</span>
              </div>
            </div>
          </section>

          <section className="rounded-[10px] bg-white px-5 pb-4 pt-2.5">
            <h3 className="text-[19px] font-medium leading-[26px] text-[#2D2F33]">Status</h3>
            <div className="relative mt-7 flex justify-between px-2">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                const active = ACTIVE_STEPS.includes(step.key);
                return (
                  <div key={step.key} className="flex flex-col items-center">
                    <span
                      className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-white"
                      style={{
                        border: `1px ${active ? '#358C72' : '#B9B9B9'} solid`,
                        boxShadow: i < 2 ? '0 0 0 3px rgba(53,140,114,0.15)' : undefined,
                      }}
                    >
                      <Icon size={20} className={active ? 'text-[#358C72]' : 'text-[#B9B9B9]'} />
                    </span>
                    <span className={cn('mt-1.5 text-[12px] leading-[16.8px]', active ? 'text-[#026F4F]' : 'text-[#B9B9B9]')}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-[13px] bg-white px-5 py-[17px]">
            <h3 className="text-[19px] font-semibold leading-[26px] text-[#2D2F33]">Order Summary</h3>
            <div className="mt-6 space-y-6">
              {order.items.map((item) => (
                <div key={item.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-5">
                      <div className="relative h-[70px] w-[70px] shrink-0 overflow-hidden rounded-[7px] bg-[#F2F2F2]">
                        <Image src="/images/food-41e5d7.png" alt={item.name} fill sizes="70px" className="object-cover" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[16px] font-medium leading-[22px] text-[#2D2F33]">{item.name}</span>
                        {item.modifiers?.map((m, idx) => (
                          <span key={idx} className="text-[13px] leading-[18px]">
                            <span className="text-[16px] text-[#2DC35F]">+</span>{' '}
                            <span className="text-[#989898]">{m}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-3">
                      <span className="text-[18px] font-semibold leading-[25px] text-[#026F4F]">{item.price}</span>
                      <span className="text-[15px] font-medium leading-[21px] text-[#686868]">Qty: {item.qty}</span>
                    </div>
                  </div>
                  {item.note && (
                    <div className="mt-3 flex items-center gap-2 rounded-[5px] bg-[#F2F2F2] px-3 py-2.5 outline outline-1 outline-[#B9B9B9]">
                      <span className="h-[15px] w-[15px] shrink-0 bg-[#E5BA42]" />
                      <span className="text-[13px] font-medium leading-[18px] text-[#989898]">NOTE:</span>
                      <span className="text-[13px] font-medium leading-[18px] text-[#2D2F33]">{item.note}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[13px] bg-white px-5 py-[17px] outline outline-1 outline-[#E9E9E9]">
            <h3 className="text-[19px] font-semibold leading-[26px] text-[#2D2F33]">Payments Details</h3>
            <div className="mt-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[16px] leading-[22px] text-[#989898]">Subtotal ({itemCount} items)</span>
                <span className="text-[16px] font-semibold leading-[22px] text-[#686868]">{money(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[16px] leading-[22px] text-[#989898]">Service Charge (10%)</span>
                <span className="text-[16px] font-semibold leading-[22px] text-[#686868]">{money(service)}</span>
              </div>
              <div className="flex items-center justify-between pt-4">
                <span className="text-[19px] font-medium leading-[26px] text-black">Total</span>
                <span className="text-[19px] font-semibold leading-[26px] text-[#026F4F]">{money(total)}</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-[16px] leading-[22px] text-[#989898]">Status</span>
                <span className={cn('inline-flex items-center rounded-full px-2 py-1 text-[13px] leading-[18px] text-white', order.status === 'paid' ? 'bg-[#16C722]' : 'bg-[#D75F3B]')}>
                  {order.status === 'paid' ? 'Paid' : 'Unpaid'}
                </span>
              </div>
            </div>
          </section>
        </div>

        <div className="shrink-0 border-t border-[#E2E2E2] px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            {action === 'mark_ready' && (
              <>
                <button
                  onClick={handleCancel}
                  className="flex h-[59px] flex-1 items-center justify-center rounded-[30px] bg-[#E9E9E9] text-[19px] font-medium text-[#2D2F33] outline outline-1 outline-offset-[-1px] outline-[#B9B9B9] transition-colors hover:bg-[#DCDCDC]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleConfirm('ready')}
                  className="flex h-[59px] flex-1 items-center justify-center rounded-[30px] bg-[#F97316] text-[19px] font-medium text-white shadow-[0px_4px_16.3px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#ea690b]"
                >
                  Mark Ready
                </button>
              </>
            )}
            {action === 'complete' && (
              <>
                <button
                  onClick={handleCancel}
                  className="flex h-[59px] flex-1 items-center justify-center rounded-[30px] bg-[#E9E9E9] text-[19px] font-medium text-[#2D2F33] outline outline-1 outline-offset-[-1px] outline-[#B9B9B9] transition-colors hover:bg-[#DCDCDC]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleConfirm('complete')}
                  className="flex h-[59px] flex-1 items-center justify-center rounded-[30px] bg-[#026F4F] text-[19px] font-medium text-white shadow-[0px_4px_16.3px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#015c42]"
                >
                  Mark Paid
                </button>
              </>
            )}
            {!action && (
              <button
                onClick={onClose}
                className="flex h-[59px] w-full items-center justify-center rounded-[30px] bg-[#026F4F] text-[19px] font-medium text-white shadow-[0px_4px_16.3px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#015c42]"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
