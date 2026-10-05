'use client';

import { useEffect } from 'react';
import { ArrowLeft, Download, ChevronDown, QrCode } from 'lucide-react';
import { useLocale } from 'next-intl';
import { QrCodePlaceholder } from '@/components/shared/QrCodePlaceholder';
import { cn, lockPageScroll } from '@/lib/utils';

interface ReservedDetailData {
  name: string;
  name_ar?: string;
  zone: string;
  zone_ar?: string;
  capacity: number;
}

export function ReservedDetailModal({
  open,
  table,
  onClose,
  onSeatGuests,
}: {
  open: boolean;
  table: ReservedDetailData | null;
  onClose: () => void;
  onSeatGuests?: () => void;
}) {
  const locale = useLocale();
  const isAr = locale === 'ar';

  useEffect(() => {
    lockPageScroll(open);
    return () => lockPageScroll(false);
  }, [open]);

  if (!table) return null;

  const displayName = isAr ? (table.name_ar ?? table.name) : table.name;
  const displayZone = isAr ? (table.zone_ar ?? table.zone) : table.zone;

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
          'fixed end-0 top-0 z-50 flex h-full w-full flex-col bg-[#F2F2F2] shadow-[-2px_0px_12px_rgba(0,0,0,0.10)] transition-transform duration-300 sm:w-[619px]',
          open ? 'translate-x-0' : 'ltr:translate-x-full rtl:-translate-x-full',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between px-4 pt-5 sm:px-5 sm:pt-6">
          <button
            onClick={onClose}
            aria-label={isAr ? 'رجوع' : 'Back'}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E9E9E9] text-black transition-colors hover:bg-[#DCDCDC] sm:h-12 sm:w-12"
          >
            <ArrowLeft size={20} className="rtl:scale-x-[-1]" />
          </button>

          <div className="flex flex-col items-center gap-2 sm:gap-3">
            <h2 className="text-[22px] font-medium leading-8 text-black sm:text-[32px] sm:leading-10">{displayName}</h2>
            <span className="inline-flex items-center rounded-[37px] bg-[#0DADE8] px-3 py-[6px] text-xs font-medium leading-5 text-white">
              {isAr ? 'محجوز' : 'RESERVED'}
            </span>
          </div>

          <div className="h-10 w-10 sm:h-12 sm:w-12" />
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center gap-4 px-4 pt-4 sm:px-5 sm:pt-6">
          <div className="flex h-[120px] w-[120px] items-center justify-center rounded-xl bg-white outline outline-1 outline-[#E9E9E9] sm:h-[154px] sm:w-[154px]">
            <QrCodePlaceholder size={110} />
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-1.5 rounded-[44px] bg-[rgba(242,211,255,0.54)] px-2.5 py-1.5 text-sm font-medium leading-6 text-[#961D6E] transition-colors hover:bg-[rgba(242,211,255,0.8)] sm:text-base">
              <Download size={20} />
              {isAr ? 'تحميل' : 'Download'}
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-[44px] bg-[rgba(53,140,114,0.12)] px-2.5 py-1.5 text-sm font-medium leading-6 text-[#026F4F] transition-colors hover:bg-[rgba(53,140,114,0.22)] sm:text-base">
              <QrCode size={20} />
              {isAr ? 'إنشاء' : 'Generate'}
            </button>
          </div>
        </div>

        {/* Body — flex-1 scroll region pushes the footer buttons to the bottom */}
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-4 pt-4 pb-4 sm:gap-4 sm:px-5 sm:pt-4 sm:pb-5">
          {/* Reservation form */}
          <section className="rounded-xl bg-white px-4 pb-4 pt-4 outline outline-1 outline-offset-[-1px] outline-[#E9E9E9] sm:px-[19px] sm:pb-5 sm:pt-[19px]">
            <div className="flex w-full flex-col gap-3 sm:gap-[17px]">
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <span className="text-sm font-medium leading-4 text-[#686868] sm:text-base sm:leading-5">
                  {isAr ? 'محجوز لـ' : 'Reserved For'}
                </span>
                <div className="flex h-11 items-center rounded-[87px] bg-[#F2F2F2] px-4 sm:h-14">
                  <span className="font-satoshi text-sm font-medium leading-5 text-[#989898] sm:text-base sm:leading-6">
                    {isAr ? 'الاسم' : 'Name'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                <div className="flex w-full flex-col gap-1.5 sm:w-60 sm:gap-2">
                  <span className="text-sm font-medium leading-4 text-[#686868] sm:text-base sm:leading-5">
                    {isAr ? 'الوقت' : 'Time'}
                  </span>
                  <div className="flex h-11 items-center rounded-[87px] bg-[#F2F2F2] px-4 sm:h-14">
                    <span className="font-satoshi text-sm font-medium leading-5 text-[#989898] sm:text-base sm:leading-6">
                      {isAr ? '07:30 ص' : '07:30 AM'}
                    </span>
                  </div>
                </div>
                <div className="flex w-full flex-col gap-1.5 sm:w-60 sm:gap-2">
                  <span className="text-sm font-medium leading-4 text-[#686868] sm:text-base sm:leading-5">
                    {isAr ? 'رقم الهاتف' : 'Phone Number'}
                  </span>
                  <div className="flex h-11 items-center rounded-[87px] bg-[#F2F2F2] px-4 sm:h-14">
                    <span className="font-satoshi text-sm font-medium leading-5 text-[#989898] sm:text-base sm:leading-6">+155555484</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Table Info */}
          <section className="rounded-xl bg-white px-4 pb-4 pt-4 outline outline-1 outline-offset-[-1px] outline-[#E9E9E9] sm:px-[19px] sm:pb-5 sm:pt-[21px]">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium leading-6 text-[#2D2F33] sm:text-lg sm:leading-7">
                {isAr ? 'معلومات الطاولة' : 'Table Info'}
              </h3>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:mt-11">
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <span className="text-sm font-medium leading-4 text-[#686868] sm:text-base sm:leading-5">
                  {isAr ? 'اسم الطاولة / الرقم' : 'Table Name / Number'}
                </span>
                <div className="flex h-11 items-center rounded-[87px] bg-[#F2F2F2] px-4 sm:h-14">
                  <span className="font-satoshi text-sm font-medium leading-5 text-[#989898] sm:text-base sm:leading-6">{displayName}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <span className="text-sm font-medium leading-4 text-[#686868] sm:text-base sm:leading-5">
                  {isAr ? 'السعة' : 'Seating Capacity'}
                </span>
                <div className="flex h-11 items-center rounded-[87px] bg-[#F2F2F2] px-4 sm:h-14">
                  <span className="font-satoshi text-sm font-medium leading-5 text-[#989898] sm:text-base sm:leading-6">{table.capacity}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <span className="text-sm font-medium leading-4 text-[#686868] sm:text-base sm:leading-5">
                  {isAr ? 'الفئة' : 'Category'}
                </span>
                <div className="flex h-11 items-center justify-between rounded-[87px] bg-[#F2F2F2] px-4 sm:h-14">
                  <span className="font-satoshi text-sm font-medium leading-5 text-[#989898] sm:text-base sm:leading-6">{displayZone}</span>
                  <ChevronDown size={16} className="text-[#989898]" />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-[#E2E2E2] px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <button
              onClick={onClose}
              className="flex h-12 flex-1 items-center justify-center rounded-[30px] bg-[#E9E9E9] text-base font-medium text-[#2D2F33] shadow-[0px_4px_16.3px_rgba(0,0,0,0.12)] outline outline-1 outline-offset-[-1px] outline-[#B9B9B9] transition-colors hover:bg-[#DCDCDC] sm:h-14 sm:text-lg"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              onClick={() => { onSeatGuests?.(); onClose(); }}
              className="flex h-12 flex-1 items-center justify-center rounded-[30px] bg-[#026F4F] text-base font-medium text-white shadow-[0px_4px_16.3px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#015c42] sm:h-14 sm:text-lg"
            >
              {isAr ? 'إجلاس الضيوف' : 'Seat Guests'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
