'use client';

import Image from 'next/image';
import { Bell, ChevronDown, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LanguageToggle } from './LanguageToggle';

export function TopHeader() {
  const t = useTranslations('topHeader');

  return (
    <header className="flex w-full items-center gap-2 rounded-xl bg-white px-3 py-2.5 sm:gap-3 sm:px-4 lg:h-[64px] lg:py-0">
      {/* Search — icon-only on tablet, full pill on desktop (Bug-7 minimalist) */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F2F2F2] xl:w-auto xl:rounded-[55px] xl:px-4">
        <Search size={17} className="shrink-0 text-[#989898]" />
        <span className="hidden whitespace-nowrap font-satoshi text-sm font-medium leading-none text-[#989898] xl:inline">
          {t('searchPlaceholder')}
        </span>
      </div>

      {/* Restaurant Open */}
      <div className="flex shrink-0 items-center gap-2">
        <span className="hidden whitespace-nowrap text-[12px] leading-[18px] text-[#37CE2A] min-[400px]:inline sm:text-[13px]">{t('restaurantOpen')}</span>
        <span className="inline-block h-3 w-3 rounded-full bg-[#37CE2A] sm:h-3.5 sm:w-3.5" />
      </div>

      {/* Center: Shift & Cashier — desktop only to avoid crowding (Bug-7) */}
      <div className="hidden min-w-0 flex-1 items-center justify-center gap-2.5 2xl:flex">
        <div className="flex items-baseline gap-1.5">
          <span className="whitespace-nowrap text-[12px] font-normal leading-[16px] text-[#989898]">{t('shiftStarted')}</span>
          <span className="whitespace-nowrap text-[13px] font-medium leading-[18px] text-[#2D2F33]">{t('shiftTime')}</span>
        </div>
        <span className="h-[32px] w-px shrink-0 bg-[#B9B9B9]" />
        <div className="flex min-w-0 items-baseline gap-1.5">
          <span className="whitespace-nowrap text-[12px] font-normal leading-[16px] text-[#989898]">{t('currentCashier')}</span>
          <span className="truncate whitespace-nowrap text-[13px] font-medium leading-[18px] text-[#2D2F33]">{t('cashierName')}</span>
        </div>
      </div>

      {/* Branch selector — desktop only (Bug-7) */}
      <button className="ms-auto hidden h-10 shrink-0 items-center gap-1.5 rounded-[59px] border border-[#B9B9B9] bg-white px-3.5 xl:flex sm:px-4">
        <span className="max-w-[130px] truncate whitespace-nowrap text-[13px] leading-none text-[#686868] sm:text-sm">
          {t('branchSelector')}
        </span>
        <ChevronDown size={14} className="shrink-0 text-[#686868]" />
      </button>

      {/* Language toggle (desktop / tablet) */}
      <div className="ms-auto flex shrink-0 items-center xl:ms-0">
        <LanguageToggle />
      </div>

      {/* Right: Bell + Profile */}
      <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-xl text-[#2D2F33] sm:h-10 sm:w-10"
          aria-label={t('notifications')}
        >
          <Bell size={19} />
          <span className="absolute end-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#E56767]" />
        </button>

        <div className="relative h-9 w-9 shrink-0 sm:h-10 sm:w-10 lg:h-11 lg:w-11">
          <Image src="/images/avatar.png" alt={t('profileAlt')} fill priority sizes="44px" className="rounded-full object-cover" />
        </div>
      </div>
    </header>
  );
}
