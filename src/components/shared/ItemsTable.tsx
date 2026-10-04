'use client';
import Image from 'next/image';
import { ArrowUp } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

export interface MenuItem {
  id: string;
  name: string;
  name_ar?: string;
  qty: number;
  revenue: string;
}

interface ItemsTableProps {
  title: string;
  className?: string;
  items: MenuItem[];
}

export function ItemsTable({ title, className, items }: ItemsTableProps) {
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const t = useTranslations('analytics');

  return (
    <div className={cn('flex h-full flex-col rounded-xl bg-white px-4 pb-4 pt-4', className)}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="whitespace-nowrap text-lg font-semibold text-[#2D2F33]">{title}</h3>
        <button className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-[#026F4F]">
          {isArabic ? 'عرض القائمة الكاملة' : 'View Full List'}
          <ArrowUp size={16} />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-[minmax(0,1fr)_80px_90px] items-center bg-[#E9E9E9] px-2 py-2">
        <span className="text-[11px] font-medium text-[#686868]">{t('item').toUpperCase()}</span>
        <span className="text-center text-[11px] font-medium text-[#686868]">{t('qty').toUpperCase()}</span>
        <span className="text-end text-[11px] font-medium text-[#686868]">{t('revenue').toUpperCase()}</span>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.id} className="grid grid-cols-[minmax(0,1fr)_80px_90px] items-center">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md bg-[#F2F2F2]">
                <Image src="/images/food-41e5d7.png" alt={item.name} fill sizes="36px" className="object-cover" />
              </div>
              <span className="whitespace-nowrap text-[13px] font-medium text-[#2D2F33]">
                {isArabic ? item.name_ar || item.name : item.name}
              </span>
            </div>
            <span className="whitespace-nowrap text-center text-[13px] font-medium text-[#000000]">{item.qty}</span>
            <span className="whitespace-nowrap text-end text-[15px] font-semibold text-[#026F4F]">
              {item.revenue}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}