'use client';

import Image from 'next/image';
import { Bell, ChevronDown, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LanguageToggle } from './LanguageToggle';

export function TopHeader() {
  const t = useTranslations('topHeader');

  return (
    <header className="flex w-full items-center justify-between rounded-xl bg-white px-3 py-2.5 sm:px-4 lg:h-[64px] lg:flex-nowrap lg:py-0">
      {/* Search */}
      <div className="flex h-10 shrink-0 items-center gap-2 rounded-[55px] bg-[#F2F2F2] px-4">
        <Search size={17} className="shrink-0 text-[#989898]" />
        <span className="hidden whitespace-nowrap font-satoshi text-sm font-medium leading-none text-[#989898] md:inline">
          {t('searchPlaceholder')}
        </span>
      </div>

      {/* Restaurant Open */}
      <div className="hidden shrink-0 items-center gap-2 sm:flex">
        <span className="whitespace-nowrap text-[12px] leading-[18px] text-[#37CE2A] sm:text-[13px]">{t('restaurantOpen')}</span>
        <span className="inline-block h-3 w-3 rounded-full bg-[#37CE2A] sm:h-3.5 sm:w-3.5" />
      </div>

      {/* Center: Shift & Cashier */}
      <div className="hidden items-center gap-2.5 sm:flex">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[12px] font-normal leading-[16px] text-[#989898]">{t('shiftStarted')}</span>
          <span className="text-[13px] font-medium leading-[18px] text-[#2D2F33]">{t('shiftTime')}</span>
        </div>
        <span className="h-[32px] w-px bg-[#B9B9B9]" />
        <div className="flex items-baseline gap-1.5">
          <span className="text-[12px] font-normal leading-[16px] text-[#989898]">{t('currentCashier')}</span>
          <span className="text-[13px] font-medium leading-[18px] text-[#2D2F33]">{t('cashierName')}</span>
        </div>
      </div>

      {/* Branch selector */}
      <button className="hidden h-10 shrink-0 items-center gap-1.5 rounded-[59px] border border-[#B9B9B9] bg-white px-3.5 sm:flex sm:px-4">
        <span className="max-w-[130px] truncate whitespace-nowrap text-[13px] leading-none text-[#686868] sm:text-sm">
          {t('branchSelector')}
        </span>
        <ChevronDown size={14} className="shrink-0 text-[#686868]" />
      </button>

      {/* Language toggle (desktop / tablet) */}
      <div className="hidden sm:flex shrink-0 items-center">
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
