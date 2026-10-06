'use client';

import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';

export interface MenuItem {
  id: string;
  name: string;
  name_ar?: string;
  category: string;
  category_ar?: string;
  price: string;
  description: string;
  description_ar?: string;
  available: boolean;
}

export function MenuItemCard({ item }: { item: MenuItem }) {
  const locale = useLocale();
  const isAr = locale === 'ar';

  const name = isAr ? (item.name_ar ?? item.name) : item.name;
  const category = isAr ? (item.category_ar ?? item.category) : item.category;
  const description = isAr ? (item.description_ar ?? item.description) : item.description;

  return (
    <div className="flex w-full max-w-[324px] flex-col items-start gap-[21px] overflow-clip rounded-[22.517px] bg-white p-[14.64px]">
      {/* Image container */}
      <div className="relative aspect-[295/263] w-full overflow-clip rounded-[11.258px] bg-[#F2F2F2]">
        <div className="pointer-events-none absolute left-1/2 top-[15.38%] aspect-square w-[61.76%] -translate-x-1/2 overflow-clip">
          <img
            src="/images/figma/recipe-food.png"
            alt={name}
            className="absolute left-[-8%] top-[-1.51%] h-[110.19%] w-[110.42%] max-w-none"
          />
        </div>
        <span
          className={cn(
            'absolute start-[9.01px] top-[10.13px] inline-flex items-center justify-center rounded-[7.881px] px-[11.258px] py-[9.007px] text-[13.51px] font-medium leading-[1.4] text-white',
            item.available ? 'bg-[#10D935]' : 'bg-[#D91010]',
          )}
        >
          {item.available ? (isAr ? 'متاح' : 'AVAILABLE') : (isAr ? 'غير متاح' : 'UNAVAILABLE')}
        </span>
      </div>

      {/* Info */}
      <div className="flex w-full flex-col gap-[12px]">
        <div className="flex w-full items-start justify-between gap-2">
          <div className="flex min-w-0 flex-col gap-1">
            <h3 className="w-full truncate font-satoshi text-[21.391px] font-medium leading-[1.4] text-[#2D2F33]">{name}</h3>
            <p className="text-xs font-medium leading-4 text-[#686868]">{category}</p>
          </div>
          <span className="shrink-0 text-base font-semibold leading-5 text-[#026F4F]">{item.price}</span>
        </div>
        <p className="line-clamp-2 text-xs font-normal leading-4 text-[#989898]">{description}</p>
      </div>

      {/* Divider — dashed per Figma */}
      <div className="w-full border-t border-dashed border-[#B9B9B9]" />

      {/* Actions */}
      <div className="flex w-full items-center justify-between">
        {/* Toggle */}
        <div className="relative h-6 w-11 cursor-pointer">
          <span
            className={`absolute inset-0 rounded-full transition-colors ${
              item.available ? 'bg-[#026F4F]' : 'bg-[#D9D9D9]'
            }`}
          />
          <span
            className={`absolute top-[3px] h-[17px] w-[17px] rounded-full bg-white transition-all ${
              item.available ? 'start-[24px]' : 'start-[3px]'
            }`}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label={isAr ? 'تعديل' : 'Edit'}
            className="flex h-11 w-11 items-center justify-center rounded-[7px] bg-[#E9E9E9] text-[#686868] outline outline-1 outline-[#B9B9B9] transition-colors hover:bg-[#DcDcDc]"
          >
            <Image src="/images/figma/pencil.svg" alt="" width={16} height={16} className="size-4" />
          </button>
          <button
            aria-label={isAr ? 'حذف' : 'Delete'}
            className="flex h-11 w-11 items-center justify-center rounded-[7px] bg-[#E85E5E] text-white transition-colors hover:bg-[#d94a4a]"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
