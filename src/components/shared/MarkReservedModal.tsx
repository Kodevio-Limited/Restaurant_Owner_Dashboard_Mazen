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
          'fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      >
        <div
          className={cn(
            'relative flex max-h-[90vh] w-full max-w-[619px] flex-col overflow-hidden rounded-3xl bg-[#F2F2F2] shadow-[-2px_0px_12px_rgba(0,0,0,0.10)] transition-transform duration-300',
            open ? 'scale-100' : 'scale-95',
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between px-4 pt-5 sm:px-5 sm:pt-6">
            <button
              onClick={onClose}
              aria-label="Back"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E9E9E9] text-black transition-colors hover:bg-[#DCDCDC] sm:h-12 sm:w-12"
            >
              <ArrowLeft size={20} />
            </button>

            <h2 className="text-[22px] font-medium leading-8 text-black sm:text-[32px] sm:leading-10">{tableName}</h2>

            <button
              onClick={onClose}
              aria-label="Close"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E85E5E] text-white transition-colors hover:bg-[#d94a4a] sm:h-12 sm:w-12"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-4 pb-4 pt-4 sm:px-5 sm:pb-5 sm:pt-4">
            {/* QR Code */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-[120px] w-[120px] items-center justify-center rounded-xl bg-white outline outline-1 outline-[#E9E9E9] sm:h-[154px] sm:w-[154px]">
                <QrCodePlaceholder size={110} />
              </div>
              <div className="flex items-center gap-3">
                <button className="inline-flex items-center gap-1.5 rounded-[44px] bg-[rgba(242,211,255,0.54)] px-2.5 py-1.5 text-sm font-medium leading-6 text-[#961D6E] transition-colors hover:bg-[rgba(242,211,255,0.8)] sm:text-base">
                  <Download size={20} />
                  Download
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-[44px] bg-[rgba(53,140,114,0.12)] px-2.5 py-1.5 text-sm font-medium leading-6 text-[#026F4F] transition-colors hover:bg-[rgba(53,140,114,0.22)] sm:text-base">
                  <QrCode size={20} />
                  Generate
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="mt-4 sm:mt-5">
              <section className="rounded-xl bg-white px-4 pb-4 pt-4 outline outline-1 outline-offset-[-1px] outline-[#E9E9E9] sm:px-[19px] sm:pb-5 sm:pt-[19px]">
                <div className="flex w-full flex-col gap-3 sm:gap-[17px]">
                  <div className="flex flex-col gap-1.5 sm:gap-2">
                    <span className="text-sm font-medium leading-4 text-[#686868] sm:text-base sm:leading-5">Reserved For</span>
                    <div className="flex h-11 items-center rounded-[87px] bg-[#F2F2F2] px-4 sm:h-14">
                      <span className="font-satoshi text-sm font-medium leading-5 text-[#989898] sm:text-base sm:leading-6">Name</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                    <div className="flex w-full flex-col gap-1.5 sm:w-60 sm:gap-2">
                      <span className="text-sm font-medium leading-4 text-[#686868] sm:text-base sm:leading-5">Time</span>
                      <div className="flex h-11 items-center rounded-[87px] bg-[#F2F2F2] px-4 sm:h-14">
                        <span className="font-satoshi text-sm font-medium leading-5 text-[#989898] sm:text-base sm:leading-6">07:30 AM</span>
                      </div>
                    </div>
                    <div className="flex w-full flex-col gap-1.5 sm:w-60 sm:gap-2">
                      <span className="text-sm font-medium leading-4 text-[#686868] sm:text-base sm:leading-5">Phone Number</span>
                      <div className="flex h-11 items-center rounded-[87px] bg-[#F2F2F2] px-4 sm:h-14">
                        <span className="font-satoshi text-sm font-medium leading-5 text-[#989898] sm:text-base sm:leading-6">+155555484</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t border-[#E2E2E2] px-4 py-3 sm:px-5 sm:py-4">
            <div className="flex items-center justify-between gap-3 sm:gap-4">
              <button
                onClick={onClose}
                className="flex h-12 flex-1 items-center justify-center rounded-[30px] bg-[#E9E9E9] text-base font-medium text-[#2D2F33] shadow-[0px_4px_16.3px_rgba(0,0,0,0.12)] outline outline-1 outline-offset-[-1px] outline-[#B9B9B9] transition-colors hover:bg-[#DCDCDC] sm:h-14 sm:text-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => { onSave?.(); onClose(); }}
                className="flex h-12 flex-1 items-center justify-center rounded-[30px] bg-[#026F4F] text-base font-medium text-white shadow-[0px_4px_16.3px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#015c42] sm:h-14 sm:text-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
