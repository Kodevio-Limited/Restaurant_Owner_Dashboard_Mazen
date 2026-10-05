'use client';

import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useLocale } from 'next-intl';
import { cn, lockPageScroll } from '@/lib/utils';

/**
 * Generic right-side details drawer for stat cards' "View" action.
 * Query-driven by the caller (e.g. ?modal=total-orders) — no navigation.
 */
export function StatDetailsDrawer({
  open,
  title,
  subtitle,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const locale = useLocale();
  const isAr = locale === 'ar';

  useEffect(() => {
    lockPageScroll(open);
    return () => lockPageScroll(false);
  }, [open]);

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
        <div className="flex shrink-0 items-start gap-3 px-4 pt-5 sm:px-5 sm:pt-6">
          <button
            onClick={onClose}
            aria-label={isAr ? 'رجوع' : 'Back'}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E9E9E9] text-black transition-colors hover:bg-[#DCDCDC] sm:h-12 sm:w-12"
          >
            <ArrowLeft size={20} className="rtl:scale-x-[-1]" />
          </button>
          <div className="flex min-w-0 flex-col">
            <h2 className="text-[22px] font-medium leading-8 text-black sm:text-[28px] sm:leading-9">{title}</h2>
            {subtitle && <p className="text-[13px] leading-5 text-[#989898] sm:text-sm">{subtitle}</p>}
          </div>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6 pt-5 sm:px-5">
          {children}
        </div>
      </div>
    </>
  );
}
