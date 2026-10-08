'use client';

import { Fragment, useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeft, Phone, Mail } from 'lucide-react';
import { useLocale } from 'next-intl';
import { Order, OrderFlowStep } from '@/components/shared/OrderCard';
import { cn, lockPageScroll } from '@/lib/utils';

// Order-progress steps — ring + glyph swap per state (Figma 295:4483).
const STEPS = [
  { key: 'placed', label: 'Placed', label_ar: 'تم الطلب', doneIcon: '/images/figma/step-placed.svg', todoIcon: '/images/figma/step-placed-grey.svg' },
  { key: 'preparing', label: 'Preparing', label_ar: 'قيد التحضير', doneIcon: '/images/figma/step-cooking.svg', todoIcon: '/images/figma/step-cooking-grey.svg' },
  { key: 'ready', label: 'Ready', label_ar: 'جاهز', doneIcon: '/images/figma/step-check-green.svg', todoIcon: '/images/figma/step-check.svg' },
  { key: 'served', label: 'Served', label_ar: 'تم التقديم', doneIcon: '/images/figma/step-served-green.svg', todoIcon: '/images/figma/step-served.svg' },
];

const STEP_PROGRESS: Record<OrderFlowStep, number> = {
  new: 1,
  accepted: 2,
  ready: 3,
  served: 4,
};

function parsePrice(p: string): number {
  return parseFloat(p.replace(/[$,\s]/g, ''));
}

export function OrderDetailsModal({
  open,
  order,
  step = 'new',
  paid,
  onStepChange,
  onMarkPaid,
  onClose,
}: {
  open: boolean;
  order: Order | null;
  step?: OrderFlowStep;
  paid?: boolean;
  onStepChange?: (step: OrderFlowStep) => void;
  onMarkPaid?: () => void;
  onClose: () => void;
}) {
  const locale = useLocale();
  const isAr = locale === 'ar';

  useEffect(() => {
    if (!open) return;
    lockPageScroll(true);
    return () => lockPageScroll(false);
  }, [open]);

  if (!order) return null;

  const isPaid = paid ?? order.status === 'paid';

  const itemCount = order.items.reduce((s, i) => s + i.qty, 0);
  const subtotal = order.items.reduce((s, i) => s + parsePrice(i.price) * i.qty, 0);
  const service = subtotal * 0.1;
  const total = subtotal + service;
  const money = (n: number) => `$${n.toFixed(2)}`;

  const progress = STEP_PROGRESS[step];

  const customerName = isAr ? (order.customer_ar ?? order.customer) : order.customer;
  const tableDisplay = isAr
    ? `طاولة: ${(order.table_ar ?? order.table).replace('طاولة ', '').replace('Table ', '')}`
    : `Table: ${order.table.replace('Table ', '')}`;

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
          'fixed end-0 top-0 z-50 flex h-full w-full flex-col rounded-ss-3xl rounded-es-3xl bg-[#F2F2F2] shadow-[-2px_0px_12px_rgba(0,0,0,0.10)] transition-transform duration-300 sm:w-[619px]',
          open ? 'translate-x-0' : 'ltr:translate-x-full rtl:-translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between px-5 pt-6">
          <button
            onClick={onClose}
            aria-label={isAr ? 'رجوع' : 'Back'}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E9E9E9] text-black transition-colors hover:bg-[#DCDCDC]"
          >
            <ArrowLeft size={22} className="rtl:scale-x-[-1]" />
          </button>
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-[33px] font-medium leading-[46px] text-black">
              {isAr ? `الطلب ${order.orderNo}` : `Order ${order.orderNo}`}
            </h2>
            <p className="text-[19px] leading-[26.6px] text-[#686868]">{tableDisplay}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center">
            <button
              aria-label={isAr ? 'مشاركة' : 'Share'}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E9E9E9] text-black transition-colors hover:bg-[#DCDCDC]"
            >
              <svg width="24" height="24" viewBox="13 13 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M33 25L26.6 18V21.5C23.4 21.5 17 23.6 17 32C17 30.833 18.92 28.5 26.6 28.5V32L33 25Z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body — flex-1 scroll region so the footer stays pinned and scrolling is contained */}
        <div className="min-h-0 flex-1 space-y-[15px] overflow-y-auto overscroll-contain px-5 pb-5 pt-8">
          <section className="rounded-[10px] bg-white p-5">
            <h3 className="text-[19px] font-medium leading-[26px] text-[#2D2F33]">{customerName}</h3>
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
            <h3 className="text-[19px] font-medium leading-[26px] text-[#2D2F33]">{isAr ? 'الحالة' : 'Status'}</h3>
            <div className="mt-7 flex items-start">
              {STEPS.map((stage, i) => {
                const active = i <= progress;
                return (
                  <Fragment key={stage.key}>
                    {i > 0 && (
                      <img
                        src={active ? '/images/figma/connector-solid.svg' : '/images/figma/connector-dashed.svg'}
                        alt=""
                        aria-hidden="true"
                        className="mx-2 mt-[18px] h-[2px] min-w-[36px] flex-1 self-start"
                      />
                    )}
                    <div className="flex shrink-0 flex-col items-center">
                      <span className="relative z-10 block size-[38px]">
                        <img
                          src={active ? '/images/figma/ring-green.svg' : '/images/figma/ring-grey.svg'}
                          alt=""
                          aria-hidden="true"
                          className="absolute inset-0 size-full"
                        />
                        <img
                          src={active ? stage.doneIcon : stage.todoIcon}
                          alt=""
                          aria-hidden="true"
                          className="absolute left-1/2 top-1/2 size-6 -translate-x-1/2 -translate-y-1/2"
                        />
                      </span>
                      <span
                        className={cn(
                          'mt-1.5 text-center text-[12px] font-normal leading-[1.4]',
                          active ? 'text-[#026F4F]' : 'text-[#B9B9B9]',
                        )}
                      >
                        {isAr ? stage.label_ar : stage.label}
                      </span>
                    </div>
                  </Fragment>
                );
              })}
            </div>
          </section>

          <section className="rounded-[13px] bg-white px-5 py-[17px]">
            <h3 className="text-[19px] font-semibold leading-[26px] text-[#2D2F33]">{isAr ? 'ملخص الطلب' : 'Order Summary'}</h3>
            <div className="mt-6 space-y-6">
              {order.items.map((item) => {
                const itemName = isAr ? (item.name_ar ?? item.name) : item.name;
                const itemModifiers = isAr && item.modifiers_ar ? item.modifiers_ar : item.modifiers;
                const itemNote = isAr ? (item.note_ar ?? item.note) : item.note;
                return (
                  <div key={item.id}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-5">
                        <div className="relative h-[70px] w-[70px] shrink-0 overflow-hidden rounded-[7px] bg-[#F2F2F2]">
                          <Image src="/images/food-41e5d7.png" alt={itemName} fill sizes="70px" className="object-cover" />
                        </div>
                      <div className="flex min-w-0 flex-col gap-[5px]">
                        <span className="text-[16px] font-medium leading-[22px] text-[#2D2F33]">{itemName}</span>
                        {itemModifiers?.map((m, idx) => (
                          <span key={idx} className="text-[13px] leading-[18px]">
                            <span className="text-[16px] text-[#2DC35F]">+</span>{' '}
                            <span className="text-[#989898]">{m}</span>
                          </span>
                        ))}
                      </div>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-3">
                        <span className="text-[18px] font-semibold leading-[25px] text-[#026F4F]">{item.price}</span>
                        <span className="text-[15px] font-medium leading-[21px] text-[#686868]">
                          {isAr ? `الكمية: ${item.qty}` : `Qty: ${item.qty}`}
                        </span>
                      </div>
                    </div>
                    {itemNote && (
                      <div className="mt-3 flex items-center gap-2 rounded-[5px] border border-[#B9B9B9] bg-[#F2F2F2] px-[9px] py-2.5">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="shrink-0" aria-hidden="true">
                          <path d="M7.5 1.5C10.8082 1.5 13.5 4.19175 13.5 7.5C13.5 10.8082 10.8082 13.5 7.5 13.5C4.19175 13.5 1.5 10.8082 1.5 7.5C1.5 4.19175 4.19175 1.5 7.5 1.5ZM7.5 0C3.35775 0 0 3.35775 0 7.5C0 11.6422 3.35775 15 7.5 15C11.6422 15 15 11.6422 15 7.5C15 3.35775 11.6422 0 7.5 0ZM8.25 9.75H6.75V11.25H8.25V9.75ZM6.75 8.25H8.25L8.625 3.75H6.375L6.75 8.25Z" fill="#E5BA42" />
                        </svg>
                        <span className="shrink-0 text-[13px] font-medium leading-[18px] text-[#989898]">{isAr ? 'ملاحظة:' : 'NOTE:'}</span>
                        <span className="min-w-0 flex-1 break-words text-[13px] font-medium leading-[18px] text-[#2D2F33]">{itemNote}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-[13px] bg-white px-5 py-[17px] outline outline-1 outline-[#E9E9E9]">
            <h3 className="text-[19px] font-semibold leading-[26px] text-[#2D2F33]">{isAr ? 'تفاصيل الدفع' : 'Payments Details'}</h3>
            <div className="mt-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[16px] leading-[22px] text-[#989898]">
                  {isAr ? `المجموع الفرعي (${itemCount} أصناف)` : `Subtotal (${itemCount} items)`}
                </span>
                <span className="text-[16px] font-semibold leading-[22px] text-[#686868]">{money(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[16px] leading-[22px] text-[#989898]">
                  {isAr ? 'رسوم الخدمة (10%)' : 'Service Charge (10%)'}
                </span>
                <span className="text-[16px] font-semibold leading-[22px] text-[#686868]">{money(service)}</span>
              </div>
              <div className="flex items-center justify-between pt-4">
                <span className="text-[19px] font-medium leading-[26px] text-black">{isAr ? 'الإجمالي' : 'Total'}</span>
                <span className="text-[19px] font-semibold leading-[26px] text-[#026F4F]">{money(total)}</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-[16px] leading-[22px] text-[#989898]">{isAr ? 'الحالة' : 'Status'}</span>
                <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-[13px] leading-[18px] text-white', isPaid ? 'bg-[#16C722]' : 'bg-[#D75F3B]')}>
                  {isPaid ? (isAr ? 'مدفوع' : 'Paid') : (isAr ? 'غير مدفوع' : 'Unpaid')}
                </span>
              </div>
            </div>
          </section>
        </div>

        <div className="shrink-0 px-5 pb-5 pt-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onStepChange?.('ready')}
              className="flex h-[59px] flex-1 items-center justify-center rounded-[30px] border border-[#B9B9B9] bg-[#F97316] text-[19px] font-medium text-white transition-colors hover:bg-[#ea690b]"
            >
              {isAr ? 'تحديد كجاهز' : 'Mark Ready'}
            </button>
            <button
              onClick={onMarkPaid}
              className="flex h-[59px] flex-1 items-center justify-center rounded-[30px] bg-[#026F4F] text-[19px] font-medium text-white shadow-[0px_4px_11px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#025c42]"
            >
              {isAr ? 'تحديد كمدفوع' : 'Mark Paid'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
