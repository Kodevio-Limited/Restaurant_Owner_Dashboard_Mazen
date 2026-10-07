'use client';

import Image from 'next/image';
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

export function TableCard({ name, name_ar, zone, zone_ar, status, bill, time, time_ar }: TableCardProps) {
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

      {/* Main table body (Figma 421:2110) */}
      <div
        className="absolute inset-x-[21px] inset-y-[21px] overflow-hidden rounded-[9px] border border-[#B9B9B9]"
        style={{ backgroundColor: cfg.bodyBg }}
      >
        <div className="absolute inset-x-[12px] top-[12px] flex flex-wrap items-start gap-x-2 gap-y-1">
          <div className="flex min-w-0 grow flex-col">
            <span className="truncate font-satoshi text-[23px] font-medium leading-[1.4] text-black">
              {displayName}
            </span>
            <span className="mt-[7px] text-[16px] font-medium leading-[1.4] text-[#989898]">
              {displayZone}
            </span>
          </div>

          <span
            className="ms-auto inline-flex h-[30px] shrink-0 items-center justify-center rounded-[37px] px-[12px] py-[6px] text-[13px] font-medium leading-[1.4] text-white"
            style={{ backgroundColor: cfg.pillBg }}
          >
            {displayLabel}
          </span>
        </div>

        {(bill || time) && (
          <div className="absolute inset-x-[12px] bottom-[12px] flex items-center justify-between gap-2">
            {bill && (
              <span dir="ltr" className="text-[25px] font-semibold leading-[1.4] text-[#026F4F]">
                {bill}
              </span>
            )}
            {displayTime && (
              <div className="flex shrink-0 items-center gap-[5px]">
                <Image src="/images/figma/clock-light.svg" alt="" width={25} height={25} className="size-[25px]" />
                <span className="whitespace-nowrap text-[18px] leading-[1.4] text-[#989898]">{displayTime}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
