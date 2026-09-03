'use client';

import { cn } from '@/lib/utils';
import { TriangleAlert } from 'lucide-react';

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
          'fixed right-0 top-0 z-50 flex h-full w-full flex-col items-center justify-center overflow-y-auto rounded-tl-3xl rounded-bl-3xl bg-[#F2F2F2] shadow-[-2px_0px_12px_rgba(0,0,0,0.10)] transition-transform duration-300 sm:w-[619px]',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center">
          <TriangleAlert size={80} className="text-[#EAB308]" strokeWidth={1} />
        </div>

        <div className="mt-6 flex w-full max-w-[420px] flex-col items-center gap-3 px-5">
          <h3 className="text-center text-[26px] font-semibold leading-8 text-black">Remove Staff Member</h3>
          <p className="text-center text-base leading-6 text-[#686868]">
            Are you sure you want to remove {memberName}? This action cannot be undone.
          </p>
        </div>

        <div className="mt-6 flex w-full max-w-[420px] items-center justify-between gap-4 px-5">
          <button
            onClick={onCancel}
            className="flex h-12 flex-1 items-center justify-center rounded-[30px] bg-[#E9E9E9] text-base font-medium text-[#2D2F33] outline outline-1 outline-offset-[-1px] outline-[#B9B9B9] transition-colors hover:bg-[#DCDCDC]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex h-12 flex-1 items-center justify-center rounded-[30px] bg-[#DC2626] text-base font-medium text-white transition-colors hover:bg-[#b91c1c]"
          >
            Remove Member
          </button>
        </div>
      </div>
    </>
  );
}
