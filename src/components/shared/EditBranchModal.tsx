'use client';

import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { cn, lockPageScroll } from '@/lib/utils';
import { useTranslations, useLocale } from 'next-intl';

export function EditBranchModal({
  open,
  branch,
  onClose,
}: {
  open: boolean;
  branch: { name: string; name_ar?: string; address: string; address_ar?: string; email: string; phone: string } | null;
  onClose: () => void;
}) {
  const t = useTranslations('settings.editBranch');
  const locale = useLocale();
  const isAr = locale === 'ar';

  const displayName = branch?.name ? (isAr ? (branch.name_ar ?? branch.name) : branch.name) : null;
  const displayAddress = branch?.address ? (isAr ? (branch.address_ar ?? branch.address) : branch.address) : null;

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
          'fixed end-0 top-0 z-50 flex h-full w-[619px] flex-col rounded-ss-3xl rounded-es-3xl bg-[#F2F2F2] shadow-[-2px_0px_12px_rgba(0,0,0,0.10)] transition-transform duration-300',
          open ? 'translate-x-0' : 'ltr:translate-x-full rtl:-translate-x-full',
        )}
      >
        <div className="flex shrink-0 items-center justify-between px-5 pt-6">
          <button onClick={onClose} aria-label={t('back')} className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E9E9E9] text-black transition-colors hover:bg-[#DcDcDc]">
            <ArrowLeft size={22} className="rtl:scale-x-[-1]" />
          </button>
          <h2 className="text-[32px] font-medium leading-10 text-black">{t('title')}</h2>
          <div className="h-12 w-12" />
        </div>

        <div className="flex-1 overflow-y-auto px-5 pt-8 pb-5">
          <section className="w-full rounded-xl bg-white px-[19px] py-[19px] outline outline-1 outline-offset-[-1px] outline-[#E9E9E9]">
            <div className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-2">
                <span className="text-base font-medium leading-5 text-[#686868]">{t('branchName')}</span>
                <div className="flex h-14 items-center rounded-[87px] bg-[#F2F2F2] px-4">
                  <span className={`font-satoshi text-base font-medium leading-6 ${displayName ? 'text-[#2D2F33]' : 'text-[#989898]'}`}>{displayName ?? t('branchNamePlaceholder')}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-base font-medium leading-5 text-[#686868]">{t('address')}</span>
                <div className="flex h-14 items-center rounded-[87px] bg-[#F2F2F2] px-4">
                  <span className={`font-satoshi text-base font-medium leading-6 ${displayAddress ? 'text-[#2D2F33]' : 'text-[#989898]'}`}>{displayAddress ?? t('addressPlaceholder')}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-base font-medium leading-5 text-[#686868]">{t('email')}</span>
                <div className="flex h-14 items-center justify-between rounded-[87px] bg-[#F2F2F2] px-4">
                  <span dir="ltr" className={`font-satoshi text-base font-medium leading-6 ${branch?.email ? 'text-[#2D2F33]' : 'text-[#989898]'}`}>{branch?.email ?? t('emailPlaceholder')}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-base font-medium leading-5 text-[#686868]">{t('phone')}</span>
                <div className="flex h-14 items-center justify-between rounded-[87px] bg-[#F2F2F2] px-4">
                  <span dir="ltr" className={`font-satoshi text-base font-medium leading-6 ${branch?.phone ? 'text-[#2D2F33]' : 'text-[#989898]'}`}>{branch?.phone ?? t('phonePlaceholder')}</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="shrink-0 border-t border-[#E2E2E2] px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <button onClick={onClose} className="flex h-14 flex-1 items-center justify-center rounded-[30px] bg-[#E9E9E9] text-lg font-medium text-[#2D2F33] shadow-[0px_4px_16.3px_rgba(0,0,0,0.12)] outline outline-1 outline-offset-[-1px] outline-[#B9B9B9] transition-colors hover:bg-[#DcDcDc]">
              {t('cancel')}
            </button>
            <button className="flex h-14 flex-1 items-center justify-center rounded-[30px] bg-[#026F4F] text-lg font-medium text-white shadow-[0px_4px_16.3px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#015c42]">
              {t('saveBranch')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}