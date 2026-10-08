'use client';

import { useEffect } from 'react';
import { cn, lockPageScroll } from '@/lib/utils';

/**
 * Centered confirmation dialog (Figma 1682:71416) — used when leaving a recipe
 * with unsaved changes. Renders in the middle of the screen, not as a drawer.
 */
export function UnsavedChangesModal({
  open,
  onCancel,
  onLeave,
  title = 'Unsaved Changes',
  message = 'You have modified this recipe. Are you sure you want to cancel? Your changes will be lost.',
  cancelLabel = 'Keep Editing',
  confirmLabel = 'Discard Changes',
}: {
  open: boolean;
  onCancel: () => void;
  onLeave: () => void;
  title?: string;
  message?: string;
  cancelLabel?: string;
  confirmLabel?: string;
}) {
  useEffect(() => {
    if (!open) return;
    lockPageScroll(true);
    return () => lockPageScroll(false);
  }, [open]);

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onCancel}
      />
      <div
        className={cn(
          'fixed inset-0 z-[70] flex items-center justify-center p-4 transition-opacity duration-300',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onCancel}
      >
        <div
          className="flex w-full max-w-[526px] flex-col items-center rounded-[22px] bg-white px-11 pb-[25px] pt-[46px] shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Warning triangle (yellow fill, red border + mark) */}
          <svg width="120" height="104" viewBox="0 0 120 104" fill="none" aria-hidden="true">
            <path d="M60 6 114 98H6L60 6Z" fill="#FFD60A" stroke="#E22A2A" strokeWidth="9" strokeLinejoin="round" />
            <rect x="55" y="34" width="10" height="34" rx="5" fill="#E22A2A" />
            <circle cx="60" cy="80" r="6" fill="#E22A2A" />
          </svg>

          <h3 className="mt-[37px] text-[28px] font-medium leading-[1.4] text-black">{title}</h3>
          <p className="mt-[19px] max-w-[438px] text-center text-[19px] leading-[1.4] text-[#989898]">{message}</p>

          <div className="mt-[41px] flex w-full items-center justify-center gap-[26px]">
            <button
              onClick={onCancel}
              className="flex h-[59px] w-[209px] max-w-[48%] items-center justify-center rounded-[30px] border border-[#B9B9B9] bg-[#E9E9E9] text-[19px] font-medium leading-[1.4] text-[#2D2F33] transition-colors hover:bg-[#DcDcDc]"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onLeave}
              className="flex h-[59px] w-[209px] max-w-[48%] items-center justify-center rounded-[30px] bg-[#EF4444] text-[19px] font-medium leading-[1.4] text-white shadow-[0px_4px_8.15px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#dc2626]"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
