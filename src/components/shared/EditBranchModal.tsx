'use client';

import { ArrowLeft, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function EditBranchModal({
  open,
  branch,
  onClose,
}: {
  open: boolean;
  branch: { name: string; address: string; email: string; phone: string } | null;
  onClose: () => void;
}) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-all duration-300',
        open ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          'relative mx-4 flex max-h-[90vh] w-full max-w-[619px] flex-col overflow-y-auto rounded-[24px] bg-[#F2F2F2] shadow-lg transition-all duration-300',
          open ? 'translate-y-0 scale-100' : 'translate-y-8 scale-95',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between px-5 pt-6">
          <button onClick={onClose} aria-label="Back" className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E9E9E9] text-black transition-colors hover:bg-[#DcDcDc]">
            <ArrowLeft size={22} />
          </button>
          <h2 className="text-[32px] font-medium leading-10 text-black">Edit Branch</h2>
          <button onClick={onClose} aria-label="Close" className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E85E5E] text-white transition-colors hover:bg-[#d94a4a]">
            <X size={22} />
          </button>
        </div>

        <div className="px-5 pt-8 pb-5">
          <section className="relative h-96 w-full overflow-hidden rounded-xl bg-white outline outline-1 outline-offset-[-1px] outline-[#E9E9E9]">
            <div className="absolute left-[19px] top-[25px] flex w-[522px] flex-col gap-3.5">
              <div className="flex flex-col gap-2">
                <span className="text-base font-medium leading-5 text-[#686868]">Branch Name</span>
                <div className="flex h-14 items-center rounded-[87px] bg-[#F2F2F2] px-4">
                  <span className="font-satoshi text-base font-medium leading-6 text-[#989898]">e.g. Downtown (Main)</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-base font-medium leading-5 text-[#686868]">Address</span>
                <div className="flex h-14 items-center rounded-[87px] bg-[#F2F2F2] px-4">
                  <span className="font-satoshi text-base font-medium leading-6 text-[#989898]">Full branch address...</span>
                </div>
              </div>
              <div className="flex h-20 flex-col gap-2">
                <span className="text-base font-medium leading-5 text-[#686868]">Email</span>
                <div className="flex h-14 items-center justify-between rounded-[87px] bg-[#F2F2F2] px-4">
                  <span className="font-satoshi text-base font-medium leading-6 text-[#989898]">Enter your Email</span>
                </div>
              </div>
              <div className="flex h-20 flex-col gap-2">
                <span className="text-base font-medium leading-5 text-[#686868]">Contact Phone</span>
                <div className="flex h-14 items-center justify-between rounded-[87px] bg-[#F2F2F2] px-4">
                  <span className="font-satoshi text-base font-medium leading-6 text-[#989898]">(555) 000000</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="shrink-0 border-t border-[#E2E2E2] px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <button className="flex h-14 flex-1 items-center justify-center rounded-[30px] bg-[#E9E9E9] text-lg font-medium text-[#2D2F33] shadow-[0px_4px_16.3px_rgba(0,0,0,0.12)] outline outline-1 outline-offset-[-1px] outline-[#B9B9B9] transition-colors hover:bg-[#DcDcDc]">
              Cancel
            </button>
            <button className="flex h-14 flex-1 items-center justify-center rounded-[30px] bg-[#026F4F] text-lg font-medium text-white shadow-[0px_4px_16.3px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#015c42]">
              Save Branch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}