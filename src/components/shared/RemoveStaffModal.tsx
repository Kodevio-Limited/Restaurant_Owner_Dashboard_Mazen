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
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-all duration-300',
        open ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
      onClick={onCancel}
    >
      <div
        className={cn(
          'relative mx-4 flex w-full max-w-[664px] flex-col items-center rounded-xl bg-white py-12 shadow-lg transition-all duration-300',
          open ? 'translate-y-0 scale-100' : 'translate-y-8 scale-95',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center">
          <TriangleAlert size={144} className="text-[#EAB308]" strokeWidth={1} />
        </div>

        <div className="mt-8 flex w-full max-w-[480px] flex-col items-center gap-3.5">
          <h3 className="text-center text-[32px] font-semibold leading-10 text-black">Remove Staff Member</h3>
          <p className="text-center text-2xl font-normal leading-8 text-[#686868]">
            Are you sure you want to remove {memberName}? They will lose access to the dashboard immediately. This action cannot be undone.
          </p>
        </div>

        <div className="mt-8 flex w-full max-w-[560px] items-center justify-between gap-4">
          <button
            onClick={onCancel}
            className="flex h-14 flex-1 items-center justify-center rounded-[30px] bg-[#E9E9E9] text-lg font-medium text-[#2D2F33] shadow-[0px_4px_16.3px_rgba(0,0,0,0.12)] outline outline-1 outline-offset-[-1px] outline-[#B9B9B9] transition-colors hover:bg-[#DcDcDc]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex h-14 flex-1 items-center justify-center rounded-[30px] bg-[#DC2626] text-lg font-medium text-white shadow-[0px_4px_16.3px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#b91c1c]"
          >
            Remove Member
          </button>
        </div>
      </div>
    </div>
  );
}
