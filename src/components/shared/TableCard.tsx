'use client';

import { Clock3 } from 'lucide-react';
import { useLocale } from 'next-intl';

export type TableStatus = 'available' | 'occupied' | 'reserved';

const STATUS_CONFIG: Record<TableStatus, { label: string; label_ar: string; pillBg: string; bodyBg: string }> = {
  occupied:  { label: 'OCCUPIED',  label_ar: 'مشغول', pillBg: '#E8AD0D', bodyBg: '#F9EFA8' },
  available: { label: 'AVAILABLE', label_ar: 'متاح',   pillBg: '#1FB711', bodyBg: '#A8F9B1' },
  reserved:  { label: 'RESERVED',  label_ar: 'محجوز', pillBg: '#0DADE8', bodyBg: '#C5F0FB' },
};

interface TableCardProps {
  name: string;
  name_ar?: string;
  zone: string;
  zone_ar?: string;
  status: TableStatus;
  bill?: string;
  time?: string;
  time_ar?: string;
  orderNumbers?: string[];
}

export function TableCard({ name, name_ar, zone, zone_ar, status, bill, time, time_ar, orderNumbers }: TableCardProps) {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const cfg = STATUS_CONFIG[status];

  const railStyle: React.CSSProperties = {
    backgroundColor: cfg.bodyBg,
    borderColor: '#B9B9B9',
  };

  const displayName = isAr ? (name_ar ?? name) : name;
  const displayZone = isAr ? (zone_ar ?? zone) : zone;
  const displayTime = isAr ? (time_ar ?? time) : time;
  const displayLabel = isAr ? cfg.label_ar : cfg.label;

  return (
    <div className="relative h-[186px] w-full max-w-[301px]">

      {/* Start vertical rail */}
      <div
        className="absolute start-0 top-[32px] h-[calc(100%-64px)] w-[13px] rounded-[48px] border"
        style={railStyle}
      />

      {/* End vertical rail */}
      <div
        className="absolute end-0 top-[32px] h-[calc(100%-64px)] w-[13px] rounded-[48px] border"
        style={railStyle}
      />

      {/* Top horizontal rail */}
      <div
        className="absolute inset-x-0 mx-auto top-0 h-[13px] w-[52%] rounded-[48px] border"
        style={railStyle}
      />

      {/* Bottom horizontal rail */}
      <div
        className="absolute inset-x-0 mx-auto bottom-0 h-[13px] w-[52%] rounded-[48px] border"
        style={railStyle}
      />

      {/* Main table body */}
      <div
        className="absolute inset-x-[21px] inset-y-[21px] overflow-hidden rounded-lg border border-[#B9B9B9]"
        style={{ backgroundColor: cfg.bodyBg }}
      >
        <div className="absolute inset-x-2.5 top-2.5 flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-satoshi text-[16px] font-medium leading-[1.4] text-black">
              {displayName}
            </span>
            <span className="text-[12px] font-medium leading-[1.4] text-[#6E727A]">
              {displayZone}
            </span>
          </div>

          <div className="flex min-w-[70px] shrink-0 flex-col items-center gap-1">
            <span
              className="inline-flex h-[24px] w-full shrink-0 items-center justify-center rounded-[37px] px-2.5 text-[10px] font-medium leading-[1.4] text-white"
              style={{ backgroundColor: cfg.pillBg }}
            >
              {displayLabel}
            </span>

            {/* List of order numbers under occupied */}
            {status === 'occupied' && orderNumbers && orderNumbers.length > 0 && (
              <div className="flex max-h-[64px] w-full flex-col items-center gap-1 overflow-y-auto pt-0.5">
                {orderNumbers.map((orderNo, idx) => (
                  <span
                    key={idx}
                    dir="ltr"
                    className="inline-flex w-full items-center justify-center rounded-full bg-white/85 py-0.5 font-satoshi text-[11px] font-semibold leading-tight text-[#026F4F] shadow-xs"
                  >
                    {orderNo.startsWith('#') ? orderNo : `#${orderNo}`}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {(bill || time) && (
          <div className="absolute inset-x-2.5 bottom-2.5 flex items-center justify-between gap-2">
            {bill && (
              <span dir="ltr" className="text-[17px] font-semibold leading-[1.4] text-[#026F4F]">
                {bill}
              </span>
            )}
            {displayTime && (
              <div className="flex items-center gap-1">
                <Clock3 size={14} className="shrink-0 text-[#989898]" />
                <span className="text-[12px] leading-[1.4] text-[#989898]">{displayTime}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
