'use client';

import { ArrowLeft, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SeatGuestsModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave?: () => void;
}) {
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
          'fixed right-0 top-0 z-50 flex h-full w-full flex-col overflow-y-auto rounded-tl-3xl rounded-bl-3xl bg-[#F2F2F2] shadow-[-2px_0px_12px_rgba(0,0,0,0.10)] transition-transform duration-300 sm:w-[619px]',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between px-5 pt-6">
          <button
            onClick={onClose}
            aria-label="Back"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E9E9E9] text-black transition-colors hover:bg-[#DcDcDc]"
          >
            <ArrowLeft size={22} />
          </button>
          <h2 className="text-[32px] font-medium leading-10 text-black">Add Table</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E85E5E] text-white transition-colors hover:bg-[#d94a4a]"
          >
            <X size={22} />
          </button>
        </div>

        <div className="px-5 pt-12">
          <div className="rounded-xl bg-white px-[19px] pb-5 pt-[19px] outline outline-1 outline-offset-[-1px] outline-[#E9E9E9]">
            <div className="flex w-full flex-col gap-3.5">
              <div className="flex flex-col gap-2">
                <span className="text-base font-medium leading-5 text-[#686868]">Table Name / Number</span>
                <div className="flex h-14 items-center rounded-[87px] bg-[#F2F2F2] px-4">
                  <span className="font-satoshi text-base font-medium leading-6 text-[#989898]">e.g. Table 12</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-base font-medium leading-5 text-[#686868]">Seating Capacity</span>
                <div className="flex h-14 items-center rounded-[87px] bg-[#F2F2F2] px-4">
                  <span className="font-satoshi text-base font-medium leading-6 text-[#989898]">2</span>
                </div>
              </div>
              <div className="flex h-20 flex-col gap-2">
                <span className="text-base font-medium leading-5 text-[#686868]">Category</span>
                <div className="flex h-14 items-center justify-between rounded-[87px] bg-[#F2F2F2] px-4 pl-5">
                  <span className="font-satoshi text-base font-medium leading-6 text-[#989898]">Indoor</span>
                  <ChevronDown size={18} className="text-[#989898]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 px-5 pt-6 pb-5">
          <div className="flex items-center justify-between gap-4">
            <button className="flex h-14 flex-1 items-center justify-center rounded-[30px] bg-[#E9E9E9] text-lg font-medium text-[#2D2F33] shadow-[0px_4px_16.3px_rgba(0,0,0,0.12)] outline outline-1 outline-offset-[-1px] outline-[#B9B9B9] transition-colors hover:bg-[#DcDcDc]">
              Cancel
            </button>
            <button
              onClick={() => { onSave?.(); onClose(); }}
              className="flex h-14 flex-1 items-center justify-center rounded-[30px] bg-[#026F4F] text-lg font-medium text-white shadow-[0px_4px_16.3px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#015c42]"
            >
              Save Table
            </button>
          </div>
        </div>
      </div>
    </>
  );
}