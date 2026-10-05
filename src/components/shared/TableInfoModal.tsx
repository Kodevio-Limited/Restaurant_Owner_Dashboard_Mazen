'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useLocale } from 'next-intl';
import { cn, lockPageScroll } from '@/lib/utils';

export interface TableInfoData {
  id: string;
  name: string;
  name_ar?: string;
  zone: 'Indoor' | 'Outdoor' | 'Patio';
  zone_ar?: string;
  status: 'available' | 'occupied' | 'reserved';
  bill?: string;
  time?: string;
  time_ar?: string;
  capacity: number;
  orderNumbers?: string[];
}

const STATUS_STYLES: Record<string, { label: string; label_ar: string; bg: string }> = {
  occupied: { label: 'OCCUPIED', label_ar: 'مشغول', bg: '#E8AD0D' },
  available: { label: 'AVAILABLE', label_ar: 'متاح', bg: '#1FB711' },
  reserved: { label: 'RESERVED', label_ar: 'محجوز', bg: '#0DADE8' },
};

// Order-progress steps (Figma 421:2215) — ring + glyph swap per state.
const STEPS = [
  { key: 'placed', label: 'Placed', label_ar: 'تم الطلب', active: true, doneIcon: '/images/figma/step-placed.svg', todoIcon: '/images/figma/step-placed-grey.svg' },
  { key: 'preparing', label: 'Preparing', label_ar: 'قيد التحضير', active: true, doneIcon: '/images/figma/step-cooking.svg', todoIcon: '/images/figma/step-cooking-grey.svg' },
  { key: 'ready', label: 'Ready', label_ar: 'جاهز', active: false, doneIcon: '/images/figma/step-check-green.svg', todoIcon: '/images/figma/step-check.svg' },
  { key: 'served', label: 'Served', label_ar: 'تم التقديم', active: false, doneIcon: '/images/figma/step-served-green.svg', todoIcon: '/images/figma/step-served.svg' },
];

export function TableInfoModal({
  open,
  table,
  onClose,
  onEdit,
  onDelete,
  onClearTable,
}: {
  open: boolean;
  table: TableInfoData | null;
  onClose: () => void;
  onEdit?: (table: TableInfoData) => void;
  onDelete?: (table: TableInfoData) => void;
  onClearTable?: (table: TableInfoData) => void;
}) {
  const locale = useLocale();
  const isAr = locale === 'ar';

  useEffect(() => {
    lockPageScroll(open);
    return () => lockPageScroll(false);
  }, [open]);

  if (!table) return null;

  const occupied = table.status === 'occupied';
  const s = STATUS_STYLES[table.status];
  const displayName = isAr ? (table.name_ar ?? table.name) : table.name;
  const displayZone = isAr ? (table.zone_ar ?? table.zone) : table.zone;
  const displayTime = isAr ? (table.time_ar ?? table.time) : table.time;

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
          'fixed end-0 top-0 z-50 flex h-full w-full flex-col bg-[#F2F2F2] shadow-[-2px_0px_12px_rgba(0,0,0,0.10)] transition-transform duration-300 sm:w-[620px]',
          open ? 'translate-x-0' : 'ltr:translate-x-full rtl:-translate-x-full',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — back, centered title + status pill, delete */}
        <div className="flex shrink-0 items-start justify-between px-[30px] pt-[50px]">
          <button
            onClick={onClose}
            aria-label={isAr ? 'رجوع' : 'Back'}
            className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#E9E9E9] text-black transition-colors hover:bg-[#DCDCDC]"
          >
            <ArrowLeft size={22} className="rtl:scale-x-[-1]" />
          </button>

          <div className="flex flex-col items-center gap-[12px]">
            <h2 className="text-center text-[33px] font-medium leading-[1.4] text-black">{displayName}</h2>
            <span
              className="inline-flex h-[30px] items-center justify-center rounded-[37px] px-[12px] py-[6px] text-[13px] font-medium leading-[1.4] text-white"
              style={{ backgroundColor: s.bg }}
            >
              {isAr ? s.label_ar : s.label}
            </span>
          </div>

          <button
            onClick={() => onDelete?.(table)}
            aria-label={isAr ? 'حذف' : 'Delete'}
            className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#FBEAEA] text-[#E85E5E] transition-colors hover:bg-[#f8d9d9]"
          >
            <Trash2 size={22} />
          </button>
        </div>

        {/* QR Code */}
        <div className="flex shrink-0 flex-col items-center gap-[19px] px-4 pt-[18px]">
          <Image src="/images/figma/table-qr.png" alt="Table QR code" width={154} height={154} className="size-[154px]" />
          <button className="inline-flex items-center gap-[7px] rounded-[44px] bg-[rgba(242,211,255,0.54)] px-[10px] py-[7px] text-[16px] font-medium leading-[1.4] text-[#961D6E] transition-colors hover:bg-[rgba(242,211,255,0.8)]">
            <Image src="/images/figma/download.svg" alt="" width={24} height={24} className="size-6" />
            {isAr ? 'تخصيص وتنزيل رمز QR' : 'Customize & Download Printable QR'}
          </button>
        </div>

        {/* Body */}
        <div className="flex min-h-0 flex-1 flex-col gap-[17px] overflow-y-auto overscroll-contain px-[30px] pb-5 pt-[18px]">
          {/* Time & Bill (occupied only) */}
          {occupied && (table.bill || displayTime) && (
            <section className="rounded-[13px] bg-white px-5 py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col items-start gap-[17px]">
                  <span className="text-[15px] font-medium leading-[1.4] text-[#686868]">
                    {isAr ? 'وقت الجلوس' : 'TIME SEATED'}
                  </span>
                  <span className="text-[28px] font-semibold leading-[1.4] text-black">{displayTime}</span>
                </div>
                <div className="flex flex-col items-end gap-[17px] text-right">
                  <span className="text-[15px] font-medium leading-[1.4] text-[#686868]">
                    {isAr ? 'الفاتورة الحالية' : 'CURRENT BILL'}
                  </span>
                  <span dir="ltr" className="text-[28px] font-semibold leading-[1.4] text-[#026F4F]">{table.bill}</span>
                </div>
              </div>
            </section>
          )}

          {/* Active Order (occupied only) */}
          {occupied && (
            <section className="rounded-[10px] bg-white px-5 pb-4 pt-4">
              <div className="flex items-end justify-between gap-4">
                <h3 className="text-[19px] font-medium leading-[1.4] text-[#2D2F33]">
                  {isAr ? 'الطلب النشط' : 'Active Order'}
                </h3>
                <button className="flex items-center gap-[7px] text-[13px] font-medium leading-[1.4] text-[#026F4F]">
                  {isAr ? 'عرض التفاصيل' : 'View Details'}
                  <Image src="/images/figma/arrow-up.svg" alt="" width={22} height={22} className="size-[22px] rotate-90 rtl:-rotate-90" />
                </button>
              </div>

              <div className="relative mt-[18px] flex">
                {STEPS.map((step, i) => {
                  const isActive = step.active;
                  const isLast = i === STEPS.length - 1;
                  const nextDone = !isLast && STEPS[i + 1].active;
                  return (
                    <div key={step.key} className="relative flex flex-1 flex-col items-center">
                      {!isLast && (
                        <img
                          src={nextDone ? '/images/figma/connector-solid.svg' : '/images/figma/connector-dashed.svg'}
                          alt=""
                          aria-hidden="true"
                          className="absolute start-1/2 top-[18px] h-[2px] w-full"
                        />
                      )}
                      <span className="relative z-10 block size-[38px]">
                        <img
                          src={isActive ? '/images/figma/ring-green.svg' : '/images/figma/ring-grey.svg'}
                          alt=""
                          aria-hidden="true"
                          className="absolute inset-0 size-full"
                        />
                        <img
                          src={isActive ? step.doneIcon : step.todoIcon}
                          alt=""
                          aria-hidden="true"
                          className="absolute left-1/2 top-1/2 size-6 -translate-x-1/2 -translate-y-1/2"
                        />
                      </span>
                      <span
                        className={cn(
                          'mt-2 w-full text-[12px] font-normal leading-[1.4]',
                          isActive ? 'text-[#026F4F]' : 'text-[#B9B9B9]',
                          i === 0 ? 'text-left' : isLast ? 'text-right' : 'text-center',
                        )}
                      >
                        {isAr ? step.label_ar : step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Table Info */}
          <section className="rounded-[13px] bg-white px-[19px] py-[21px]">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-[19px] font-medium leading-[1.4] text-[#2D2F33]">
                {isAr ? 'معلومات الطاولة' : 'Table Info'}
              </h3>
              <button
                onClick={() => { onEdit?.(table); onClose(); }}
                className="flex items-center gap-[5px] text-[19px] font-normal leading-[1.4] text-[#026F4F]"
              >
                <Image src="/images/figma/pencil.svg" alt="" width={24} height={24} className="size-6" />
                {isAr ? 'تعديل' : 'Edit'}
              </button>
            </div>

            <div className="mt-[28px] flex flex-col gap-[15px]">
              <div className="flex flex-col gap-[8px]">
                <span className="text-[15px] font-medium leading-[1.4] text-[#686868]">
                  {isAr ? 'اسم الطاولة / الرقم' : 'Table Name / Number'}
                </span>
                <div className="flex h-[53px] items-center rounded-[87px] bg-[#F2F2F2] px-[16px]">
                  <span className="font-satoshi text-[16px] font-medium leading-[1.4] text-[#989898]">{displayName}</span>
                </div>
              </div>
              <div className="flex flex-col gap-[8px]">
                <span className="text-[15px] font-medium leading-[1.4] text-[#686868]">
                  {isAr ? 'السعة' : 'Seating Capacity'}
                </span>
                <div className="flex h-[53px] items-center rounded-[87px] bg-[#F2F2F2] px-[16px]">
                  <span className="font-satoshi text-[16px] font-medium leading-[1.4] text-[#989898]">{table.capacity}</span>
                </div>
              </div>
              <div className="flex flex-col gap-[8px]">
                <span className="text-[15px] font-medium leading-[1.4] text-[#686868]">
                  {isAr ? 'الفئة' : 'Category'}
                </span>
                <div className="flex h-[53px] items-center justify-between rounded-[87px] bg-[#F2F2F2] px-[16px]">
                  <span className="font-satoshi text-[16px] font-medium leading-[1.4] text-[#989898]">{displayZone}</span>
                  <Image src="/images/figma/chevron-down.svg" alt="" width={24} height={12} className="h-3 w-6" />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-[30px] pb-[29px] pt-4">
          <button
            onClick={() => onClearTable?.(table)}
            className="flex h-[59px] w-full items-center justify-center rounded-[30px] bg-[#026F4F] font-satoshi text-[19px] font-medium leading-[1.4] text-white shadow-[0px_4px_16.3px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#015c42]"
          >
            {isAr ? 'إخلاء الطاولة' : 'Clear table'}
          </button>
        </div>
      </div>
    </>
  );
}
