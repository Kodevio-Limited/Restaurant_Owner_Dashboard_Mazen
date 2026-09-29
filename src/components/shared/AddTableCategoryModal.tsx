'use client';

import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';

export function AddTableCategoryModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const locale = useLocale();
  const isAr = locale === 'ar';

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
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
          'fixed end-0 top-0 z-50 flex h-full w-full flex-col overflow-y-auto rounded-ss-3xl rounded-es-3xl bg-[#F2F2F2] shadow-[-2px_0px_12px_rgba(0,0,0,0.10)] transition-transform duration-300 sm:w-[619px]',
          open ? 'translate-x-0' : 'ltr:translate-x-full rtl:-translate-x-full',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between px-5 pt-6">
          <button
            onClick={onClose}
            aria-label={isAr ? 'رجوع' : 'Back'}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E9E9E9] text-black transition-colors hover:bg-[#DCDCDC]"
          >
            <ArrowLeft size={22} className="rtl:scale-x-[-1]" />
          </button>
          <h2 className="text-[32px] font-medium leading-10 text-black">
            {isAr ? 'إضافة فئة' : 'Add Category'}
          </h2>
          <div className="h-12 w-12" />
        </div>

        {/* Form */}
        <div className="flex-1 space-y-5 overflow-y-auto px-5 pt-8 pb-5">
          <section className="rounded-xl bg-white px-[19px] py-[18px] outline outline-1 outline-offset-[-1px] outline-[#E9E9E9]">
            <h3 className="text-lg font-semibold leading-7 text-[#2D2F33]">
              {isAr ? 'اسم الفئة' : 'Category Name'}
            </h3>
            <div className="mt-4 flex h-14 items-center rounded-[29px] bg-[#F2F2F2] px-4">
              <span className="font-satoshi text-base font-medium leading-6 text-[#989898]">
                {isAr ? 'مثال: داخلي، خارجي' : 'e.g. Indoor, Outdoor'}
              </span>
            </div>
          </section>

          <section className="rounded-xl bg-white px-[19px] py-[18px] outline outline-1 outline-offset-[-1px] outline-[#E9E9E9]">
            <h3 className="text-lg font-semibold leading-7 text-[#2D2F33]">
              {isAr ? 'الوصف (اختياري)' : 'Description (Optional)'}
            </h3>
            <div className="mt-4 flex h-14 items-center rounded-[29px] bg-[#F2F2F2] px-4">
              <span className="font-satoshi text-base font-medium leading-6 text-[#989898]">
                {isAr ? 'مثال: منطقة جلوس داخلية' : 'e.g. Indoor seating area'}
              </span>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-[#E2E2E2] px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={onClose}
              className="flex h-14 flex-1 items-center justify-center rounded-[30px] bg-[#E9E9E9] text-lg font-medium text-[#2D2F33] outline outline-1 outline-offset-[-1px] outline-[#B9B9B9] transition-colors hover:bg-[#DCDCDC]"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              onClick={onClose}
              className="flex h-14 flex-1 items-center justify-center rounded-[30px] bg-[#026F4F] text-lg font-medium text-white shadow-[0px_4px_16.3px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#015c42]"
            >
              {isAr ? 'حفظ' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
