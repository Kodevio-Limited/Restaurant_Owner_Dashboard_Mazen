'use client';

import { TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

export function UnsavedChangesModal({
  open,
  onCancel,
  onLeave,
}: {
  open: boolean;
  onCancel: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity duration-200',
        open ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
      onClick={onCancel}
    >
      <div
        className="mx-4 flex w-full max-w-[614px] flex-col items-center rounded-[13px] bg-white p-10 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center">
          <TriangleAlert size={120} className="text-[#E85E5E]" strokeWidth={1} />
        </div>

        <div className="mt-6 flex flex-col items-center gap-4">
          <h3 className="text-[33px] font-semibold leading-[46px] text-black">Unsaved Changes</h3>
          <p className="text-center text-[23px] leading-[32px] text-[#686868]">
            You have unsaved changes. Are you sure you want to leave without saving?
          </p>
        </div>

        <div className="mt-8 flex w-full items-center justify-between gap-5">
          <button className="flex h-[59px] flex-1 items-center justify-center rounded-[30px] bg-[#E9E9E9] text-[19px] font-medium text-[#2D2F33] outline outline-1 outline-offset-[-1px] outline-[#B9B9B9] transition-colors hover:bg-[#DcDcDc]">
            Cancel
          </button>
          <button className="flex h-[59px] flex-1 items-center justify-center rounded-[30px] bg-[#D50E0E] text-[19px] font-medium text-white shadow-[0px_4px_16.3px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#b80c0c]">
            Leave Anyway
          </button>
        </div>
      </div>
    </div>
  );
}