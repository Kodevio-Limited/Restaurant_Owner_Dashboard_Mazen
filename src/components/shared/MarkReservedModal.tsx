'use client';

import { ArrowLeft, X, Download, QrCode } from 'lucide-react';
import { QrCodePlaceholder } from '@/components/shared/QrCodePlaceholder';
import { cn } from '@/lib/utils';

export function MarkReservedModal({
  open,
  tableName,
  onClose,
  onSave,
}: {
  open: boolean;
  tableName: string;
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
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between px-5 pt-6">
          <button
            onClick={onClose}
            aria-label="Back"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E9E9E9] text-black transition-colors hover:bg-[#DcDcDc]"
          >
            <ArrowLeft size={22} />
          </button>

          <h2 className="text-[32px] font-medium leading-10 text-black">{tableName}</h2>

          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E85E5E] text-white transition-colors hover:bg-[#d94a4a]"
          >
            <X size={22} />
          </button>
        </div>

        {/* QR Code */}
        <div className="mt-8 flex flex-col items-center gap-5 px-5">
          <div className="flex h-[154px] w-[154px] items-center justify-center rounded-xl bg-white outline outline-1 outline-[#E9E9E9]">
            <QrCodePlaceholder size={140} />
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-1.5 rounded-[44px] bg-[rgba(242,211,255,0.54)] px-2.5 py-1.5 text-base font-medium leading-6 text-[#961D6E] transition-colors hover:bg-[rgba(242,211,255,0.8)]">
              <Download size={24} />
              Download
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-[44px] bg-[rgba(53,140,114,0.12)] px-2.5 py-1.5 text-base font-medium leading-6 text-[#026F4F] transition-colors hover:bg-[rgba(53,140,114,0.22)]">
              <QrCode size={24} />
              Generate
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="px-5 pt-8">
          <section className="rounded-xl bg-white px-[19px] pb-5 pt-[19px] outline outline-1 outline-offset-[-1px] outline-[#E9E9E9]">
            <div className="flex w-full flex-col gap-[17px]">
              <div className="flex flex-col gap-2">
                <span className="text-base font-medium leading-5 text-[#686868]">Reserved For</span>
                <div className="flex h-14 items-center rounded-[87px] bg-[#F2F2F2] px-4">
                  <span className="font-satoshi text-base font-medium leading-6 text-[#989898]">Name</span>
                </div>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <div className="flex w-full flex-col gap-2 sm:w-60">
                  <span className="text-base font-medium leading-5 text-[#686868]">Time</span>
                  <div className="flex h-14 items-center rounded-[87px] bg-[#F2F2F2] px-4">
                    <span className="font-satoshi text-base font-medium leading-6 text-[#989898]">07:30 AM</span>
                  </div>
                </div>
                <div className="flex w-60 flex-col gap-2">
                  <span className="text-base font-medium leading-5 text-[#686868]">Phone Number</span>
                  <div className="flex h-14 items-center rounded-[87px] bg-[#F2F2F2] px-4">
                    <span className="font-satoshi text-base font-medium leading-6 text-[#989898]">+155555484</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-5 pt-6 pb-5">
          <div className="flex items-center justify-between gap-4">
            <button className="flex h-14 flex-1 items-center justify-center rounded-[30px] bg-[#E9E9E9] text-lg font-medium text-[#2D2F33] shadow-[0px_4px_16.3px_rgba(0,0,0,0.12)] outline outline-1 outline-offset-[-1px] outline-[#B9B9B9] transition-colors hover:bg-[#DcDcDc]">
              Cancel
            </button>
            <button
    onClick={() => { onSave?.(); onClose(); }}
    className="flex h-14 flex-1 items-center justify-center rounded-[30px] bg-[#026F4F] text-lg font-medium text-white shadow-[0px_4px_16.3px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#015c42]"
  >
    Save
  </button>
          </div>
        </div>
      </div>
    </>
  );
}