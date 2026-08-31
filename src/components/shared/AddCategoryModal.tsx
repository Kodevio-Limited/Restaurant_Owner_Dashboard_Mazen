'use client';

import { ArrowLeft, X, Globe, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AddCategoryModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
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
          'fixed right-0 top-0 z-50 flex h-full w-[619px] flex-col rounded-tl-3xl rounded-bl-3xl bg-[#F2F2F2] shadow-[-2px_0px_12px_rgba(0,0,0,0.10)] transition-transform duration-300',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex shrink-0 items-center justify-between px-5 pt-6">
          <button
            onClick={onClose}
            aria-label="Back"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E9E9E9] text-black transition-colors hover:bg-[#DcDcDc]"
          >
            <ArrowLeft size={22} />
          </button>
          <h2 className="text-[32px] font-medium leading-10 text-black">Add Category</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E85E5E] text-white transition-colors hover:bg-[#d94a4a]"
          >
            <X size={22} />
          </button>
        </div>

        <div className="space-y-5 px-5 pb-5 pt-8">
          <section className="rounded-xl bg-white px-[19px] pb-5 pt-[13px] outline outline-1 outline-offset-[-1px] outline-[#E9E9E9]">
            <h3 className="text-lg font-semibold leading-7 text-[#2D2F33]">Category Image (Optional)</h3>
            <div className="mt-4 flex h-44 w-full items-center justify-center rounded-xl outline outline-2 outline-offset-[-2px] outline-[#989898]">
              <div className="flex flex-col items-center gap-4">
                <Upload size={40} className="text-[#989898]" />
                <span className="text-lg font-semibold leading-7 text-[#026F4F]">Upload Photo</span>
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-white px-[19px] py-[18px] outline outline-1 outline-offset-[-1px] outline-[#E9E9E9]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold leading-7 text-[#2D2F33]">Category Name</h3>
              <span className="inline-flex items-center gap-2 rounded-[35px] bg-[#F2F2F2] px-3 py-1.5 text-base font-medium text-[#026F4F]">
                <Globe size={22} /> EN
              </span>
            </div>
            <div className="mt-4 flex h-14 items-center rounded-[29px] bg-[#F2F2F2] px-4">
              <span className="font-satoshi text-base font-medium leading-6 text-[#989898]">e.g. Pastas</span>
            </div>
          </section>

          <section className="rounded-xl bg-white px-[19px] py-[18px] outline outline-1 outline-offset-[-1px] outline-[#E9E9E9]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold leading-7 text-[#2D2F33]">Category Name</h3>
              <span className="inline-flex h-9 w-20 items-center gap-2 rounded-[35px] bg-[#F2F2F2] px-3 py-1.5 text-base font-medium text-[#026F4F]">
                <Globe size={22} /> AR
              </span>
            </div>
            <div className="mt-4 flex h-14 items-center rounded-[29px] bg-[#F2F2F2] px-4">
              <span className="font-satoshi text-base font-medium leading-6 text-[#989898]">e.g. Pastas</span>
            </div>
          </section>
        </div>

        <div className="shrink-0 border-t border-[#E2E2E2] px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <button className="flex h-14 flex-1 items-center justify-center rounded-[30px] bg-[#E9E9E9] text-lg font-medium text-[#2D2F33] outline outline-1 outline-offset-[-1px] outline-[#B9B9B9] transition-colors hover:bg-[#DcDcDc]">
              Cancel
            </button>
            <button className="flex h-14 flex-1 items-center justify-center rounded-[30px] bg-[#026F4F] text-lg font-medium text-white shadow-[0px_4px_16.3px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#015c42]">
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}