'use client';

import { useLocale } from 'next-intl';
import { Clock } from 'lucide-react';

export type TableStatus = 'available' | 'occupied' | 'reserved';

const STATUS_CONFIG: Record<TableStatus, { label: string; label_ar: string; pillBg: string; bodyBg: string }> = {
  occupied:  { label: 'OCCUPIED',  label_ar: 'مشغول', pillBg: '#E8AD0D', bodyBg: '#F9EFA8' },
  available: { label: 'AVAILABLE', label_ar: 'متاح',   pillBg: '#1FB711', bodyBg: '#A8F9B1' },
  reserved:  { label: 'RESERVED',  label_ar: 'محجوز', pillBg: '#0DADE8', bodyBg: '#C5F0FB' },
};

export interface TableCardProps {
  name: string;
  name_ar?: string;
  zone: string;
  zone_ar?: string;
  status: TableStatus;
  bill?: string;
  time?: string;
  time_ar?: string;
  orderNumbers?: string[];
  capacity?: number;
  itemsCount?: number;
  reservedFor?: string;
  onClick?: () => void;
}

/**
 * Table card matching Cashier POS floor plan card:
 * - Fluid aspect ratio [256/160] with container query (cqw units).
 * - Table body fills the entire card (rail capsules removed).
 * - Same hover animation (hover:-translate-y-1 duration-200).
 * - Same typography, badge pills, spacing, and colors.
 */
export function TableCard({
  name,
  name_ar,
  zone,
  zone_ar,
  status,
  bill,
  time,
  time_ar,
  orderNumbers,
  itemsCount,
  reservedFor,
  onClick,
}: TableCardProps) {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const cfg = STATUS_CONFIG[status];

  const displayName = isAr ? (name_ar ?? name) : name;
  const displayZone = isAr ? (zone_ar ?? zone) : zone;
  const displayTime = isAr ? (time_ar ?? time) : time;
  const displayLabel = isAr ? cfg.label_ar : cfg.label;

  const count = typeof itemsCount === 'number' ? itemsCount : orderNumbers ? orderNumbers.length : undefined;

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onClick?.();
      }}
      style={{ containerType: 'inline-size' }}
      className="relative aspect-[256/160] w-full cursor-pointer transition-transform duration-200 hover:-translate-y-1 focus:outline-none"
    >
      {/* Table body fills the whole card box — rail capsules removed */}
      <div
        className="absolute inset-0 overflow-hidden rounded-[3.125cqw] border border-[#B9B9B9]"
        style={{ backgroundColor: cfg.bodyBg }}
      >
        {/* Name + badge */}
        <div className="absolute inset-x-[4.297cqw] top-[4.297cqw] flex items-center justify-between gap-2">
          <span className="font-satoshi truncate text-[7.617cqw] font-medium leading-[1.4] text-black">
            {displayName}
          </span>
          <span
            className="flex h-[10.156cqw] shrink-0 items-center justify-center whitespace-nowrap rounded-full px-[3.906cqw] text-[4.297cqw] font-medium leading-[1.4] text-white"
            style={{ backgroundColor: cfg.pillBg }}
          >
            {displayLabel}
          </span>
        </div>

        {/* Zone */}
        <p className="absolute inset-x-[4.297cqw] top-[17.188cqw] truncate text-[5.273cqw] font-medium leading-[1.4] text-[#989898]">
          {displayZone}
        </p>

        {/* Reserved info */}
        {status === 'reserved' && reservedFor && (
          <p className="absolute inset-x-[4.297cqw] top-[26.953cqw] truncate text-[5.078cqw] font-medium leading-[1.4] text-[#0D7EA8]">
            {reservedFor}
          </p>
        )}

        {/* Items count on occupied table */}
        {status === 'occupied' && typeof count === 'number' && count > 0 && (
          <p className="absolute inset-x-[4.297cqw] top-[26.953cqw] truncate text-[5.078cqw] font-medium leading-[1.4] text-[#2D2F33]">
            {isAr ? `${count} عناصر` : `${count} ${count === 1 ? 'Item' : 'Items'}`}
          </p>
        )}

        {/* Bill + time (occupied) */}
        {status === 'occupied' && (bill || displayTime) && (
          <div className="absolute inset-x-[4.297cqw] bottom-[4.297cqw] flex items-center justify-between gap-[2cqw]">
            {bill && (
              <span className="shrink-0 whitespace-nowrap text-[7.383cqw] font-semibold leading-[1.4] text-[#026F4F]">
                <bdi dir="ltr">{bill}</bdi>
              </span>
            )}
            {displayTime && (
              <span className="flex min-w-0 items-center gap-1">
                <Clock size={18} strokeWidth={1.5} className="shrink-0 text-[#989898]" />
                <span className="truncate whitespace-nowrap text-[6.055cqw] font-normal leading-[1.4] text-[#989898]">
                  {displayTime}
                </span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
