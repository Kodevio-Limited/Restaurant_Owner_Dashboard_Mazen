'use client';

import { useEffect } from 'react';
import { cn, lockPageScroll } from '@/lib/utils';
import { TriangleAlert } from 'lucide-react';
import { useLocale } from 'next-intl';

export function RemoveStaffModal({
  open,
  memberName,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  memberName: string;
  onCancel: () => void;
  onConfirm: () => void;
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
        onClick={onCancel}
      />
      <div
        className={cn(
          'fixed left-1/2 top-1/2 z-50 flex w-[90vw] max-w-[420px] -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-2xl bg-[#F2F2F2] p-10 shadow-[0_0_20px_rgba(0,0,0,0.15)] transition-all duration-300',
          open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center">
          <TriangleAlert size={80} className="text-[#EAB308]" strokeWidth={1} />
        </div>

        <div className="mt-6 flex w-full flex-col items-center gap-3">
          <h3 className="text-center text-[26px] font-semibold leading-8 text-black">
            {isAr ? 'حذف عضو الفريق' : 'Remove Staff Member'}
          </h3>
          <p className="text-center text-base leading-6 text-[#686868]">
            {isAr
              ? <>هل أنت متأكد من رغبتك في حذف <bdi>{memberName}</bdi>؟ لا يمكن التراجع عن هذا الإجراء.</>
              : <>Are you sure you want to remove <bdi>{memberName}</bdi>? This action cannot be undone.</>}
          </p>
        </div>

        <div className="mt-6 flex w-full items-center justify-between gap-4">
          <button
            onClick={onCancel}
            className="flex h-12 flex-1 items-center justify-center rounded-[30px] bg-[#E9E9E9] text-base font-medium text-[#2D2F33] outline outline-1 outline-offset-[-1px] outline-[#B9B9B9] transition-colors hover:bg-[#DCDCDC]"
          >
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            onClick={onConfirm}
            className="flex h-12 flex-1 items-center justify-center rounded-[30px] bg-[#DC2626] text-base font-medium text-white transition-colors hover:bg-[#b91c1c]"
          >
            {isAr ? 'حذف العضو' : 'Remove Member'}
          </button>
        </div>
      </div>
    </>
  );
}
