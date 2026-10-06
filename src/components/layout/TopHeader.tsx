'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Bell, ChevronDown, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function TopHeader() {
  const t = useTranslations('topHeader');

  // Restaurant open/closed state — green when open, red when closed.
  // Persisted so it survives navigation; click the status to toggle.
  const [isOpen, setIsOpen] = useState(true);
  useEffect(() => {
    try {
      const v = window.localStorage.getItem('restaurant-open');
      if (v !== null) setIsOpen(v === 'true');
    } catch {
      // ignore
    }
  }, []);
  const toggleOpen = () =>
    setIsOpen((prev) => {
      const next = !prev;
      try { window.localStorage.setItem('restaurant-open', String(next)); } catch { /* ignore */ }
      return next;
    });

  return (
    <header className="flex w-full min-w-0 items-center gap-2 rounded-xl bg-white px-3 py-2.5 sm:gap-3 sm:px-4 lg:h-[76px] lg:gap-4 lg:px-5 lg:py-0 min-[1600px]:h-[92px]">
      {/* Search — icon-only until xl so it never fights the tablet center block */}
      <div className="flex h-10 min-w-0 shrink-0 items-center gap-2 rounded-full bg-[#F2F2F2] px-3 xl:w-[clamp(200px,22vw,320px)] xl:px-4">
        <Search size={17} className="shrink-0 text-[#989898]" />
        <span className="hidden truncate font-satoshi text-sm font-medium leading-none text-[#989898] xl:inline">
          {t('searchPlaceholder')}
        </span>
      </div>

      {/* Restaurant open (green) / closed (red) — click to toggle */}
      <button
        type="button"
        onClick={toggleOpen}
        className="flex shrink-0 items-center gap-2"
        aria-pressed={isOpen}
      >
        <span className={`size-2 shrink-0 rounded-full ${isOpen ? 'bg-[#1FB711]' : 'bg-[#E22A2A]'}`} />
        <span className={`hidden whitespace-nowrap text-[13px] leading-none min-[480px]:inline ${isOpen ? 'text-[#1FB711]' : 'text-[#E22A2A]'}`}>
          {isOpen ? t('restaurantOpen') : t('restaurantClosed')}
        </span>
      </button>

      {/* Center: Last Cashier | Shift Ended — shown on tablet (md+) so the info
          stays visible in tablet portrait/vertical view too */}
      <div className="hidden min-w-0 flex-1 items-center justify-center gap-2.5 md:flex lg:gap-4">
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="whitespace-nowrap text-[10px] leading-tight text-[#989898] lg:text-[11px]">{t('lastCashier')}</span>
          <span className="truncate text-[12px] font-medium leading-tight text-[#2D2F33] lg:text-sm">
            &ldquo;{t('lastCashierName')}&rdquo;
          </span>
        </div>
        <span className="h-6 w-px shrink-0 bg-[#E0E0E0]" />
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="whitespace-nowrap text-[10px] leading-tight text-[#989898] lg:text-[11px]">{t('shiftEnded')}</span>
          <span className="truncate text-[12px] font-medium leading-tight text-[#2D2F33] lg:text-sm">
            &ldquo;{t('shiftEndedTime')}&rdquo;
          </span>
        </div>
      </div>

      {/* Branch selector */}
      <button className="ms-auto flex h-10 min-w-0 shrink items-center gap-1.5 rounded-full border border-[#E0E0E0] bg-white px-3 text-[#686868] transition-colors hover:border-[#B9B9B9] xl:ms-0 xl:shrink-0 xl:px-4">
        <span className="max-w-[110px] truncate whitespace-nowrap text-[13px] sm:max-w-[150px] xl:max-w-none xl:text-sm">
          {t('branchSelector')}
        </span>
        <ChevronDown size={15} className="shrink-0" />
      </button>

      {/* Notifications */}
      <button
        className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-[#F2F2F2] text-[#2D2F33] transition-colors hover:bg-gray-200"
        aria-label={t('notifications')}
      >
        <Bell size={18} />
        <span className="absolute end-2 top-2 size-2 rounded-full bg-[#E22A2A] ring-2 ring-white" />
      </button>

      {/* Profile */}
      <div className="flex shrink-0 items-center gap-2.5">
        <div className="relative size-10 shrink-0">
          <Image src="/images/avatar.png" alt={t('profileAlt')} fill priority sizes="40px" className="rounded-full object-cover" />
        </div>
        <div className="hidden min-w-0 leading-tight min-[1600px]:block">
          <p className="truncate text-sm font-medium text-[#2D2F33]">{t('profileName')}</p>
          <p className="truncate text-xs text-[#6E727A]">{t('profileEmail')}</p>
        </div>
      </div>
    </header>
  );
}
