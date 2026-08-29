'use client';

import { cn } from '@/lib/utils';

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Delete',
  destructive = true,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  destructive?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
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
        className="mx-4 w-full max-w-[664px] rounded-[13px] bg-white p-8 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-[22px] font-semibold leading-[31px] text-[#1A1A1A]">{title}</h3>
        <p className="mt-3 text-[15px] leading-[21px] text-[#595959]">{description}</p>

        <div className="mt-8 flex items-center justify-end gap-4">
          <button
            onClick={onCancel}
            className="flex h-12 items-center justify-center rounded-[10px] bg-[#757575] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#5a5a5a]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={cn(
              'flex h-12 items-center justify-center rounded-[10px] px-6 text-sm font-semibold text-white transition-colors',
              destructive
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-[#D4AF37] hover:bg-[#c4a030]',
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}