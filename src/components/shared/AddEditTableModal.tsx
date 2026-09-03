'use client';

import { ArrowLeft, X, Download, ChevronDown, QrCode } from 'lucide-react';
import { QrCodePlaceholder } from '@/components/shared/QrCodePlaceholder';
import { cn } from '@/lib/utils';

interface AddEditTableData {
  name: string;
  zone: string;
  capacity: number;
}

export function AddEditTableModal({
  open,
  table,
  onClose,
  onMarkReserved,
}: {
  open: boolean;
  table?: AddEditTableData | null;
  onClose: () => void;
  onMarkReserved?: () => void;
}) {
  const editMode = !!table;

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
        <div className="flex shrink-0 items-center justify-between px-4 pt-5 sm:px-5 sm:pt-6">
          <button
            onClick={onClose}
            aria-label="Back"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E9E9E9] text-black transition-colors hover:bg-[#DCDCDC] sm:h-12 sm:w-12"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex flex-col items-center gap-2 sm:gap-3">
            <h2 className="text-[22px] font-medium leading-8 text-black sm:text-[32px] sm:leading-10">
              {editMode ? table.name : 'Add Table'}
            </h2>
            {editMode && (
              <span className="inline-flex items-center rounded-[37px] bg-[#1FB711] px-3 py-[6px] text-xs font-medium leading-5 text-white">
                AVAILABLE
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E85E5E] text-white transition-colors hover:bg-[#d94a4a] sm:h-12 sm:w-12"
          >
            <X size={20} />
          </button>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center gap-4 px-4 pt-4 sm:px-5 sm:pt-6">
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

        {editMode && (
          <div className="mt-4 flex flex-col items-center gap-2 px-4 sm:mt-5 sm:gap-3.5 sm:px-5">
            <span className="text-[22px] font-semibold leading-8 text-black sm:text-[32px] sm:leading-10">Edit Table</span>
          </div>
        )}

        {/* Form */}
        <div className={cn('px-4 sm:px-5', editMode ? 'pt-4 sm:pt-5' : 'pt-8 sm:pt-12')}>
          <div className="rounded-xl bg-white px-4 pb-4 pt-4 outline outline-1 outline-offset-[-1px] outline-[#E9E9E9] sm:px-[19px] sm:pb-5 sm:pt-[21px]">
            <h3 className="text-base font-medium leading-6 text-[#2D2F33] sm:text-lg sm:leading-7">Table Info</h3>

            <div className="mt-5 flex flex-col gap-2 sm:mt-11">
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <span className="text-sm font-medium leading-4 text-[#686868] sm:text-base sm:leading-5">Table Name / Number</span>
                <div className="flex h-11 items-center rounded-[87px] bg-[#F2F2F2] px-4 sm:h-14">
                  <span className="font-satoshi text-sm font-medium leading-5 text-[#989898] sm:text-base sm:leading-6">
                    {editMode ? table.name : 'e.g. Table 12'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <span className="text-sm font-medium leading-4 text-[#686868] sm:text-base sm:leading-5">Seating Capacity</span>
                <div className="flex h-11 items-center rounded-[87px] bg-[#F2F2F2] px-4 sm:h-14">
                  <span className="font-satoshi text-sm font-medium leading-5 text-[#989898] sm:text-base sm:leading-6">
                    {editMode ? table.capacity : '2'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <span className="text-sm font-medium leading-4 text-[#686868] sm:text-base sm:leading-5">Category</span>
                <div className="flex h-11 items-center justify-between rounded-[87px] bg-[#F2F2F2] px-4 sm:h-14">
                  <span className="font-satoshi text-sm font-medium leading-5 text-[#989898] sm:text-base sm:leading-6">
                    {editMode ? table.zone : 'Indoor'}
                  </span>
                  <ChevronDown size={16} className="text-[#989898]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-[#E2E2E2] px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <button
              onClick={() => { editMode ? onMarkReserved?.() : onClose(); }}
              className="flex h-12 flex-1 items-center justify-center rounded-[30px] bg-[#E9E9E9] text-base font-medium text-[#2D2F33] shadow-[0px_4px_16.3px_rgba(0,0,0,0.12)] outline outline-1 outline-offset-[-1px] outline-[#B9B9B9] transition-colors hover:bg-[#DCDCDC] sm:h-14 sm:text-lg"
            >
              {editMode ? 'Mark Reserved' : 'Cancel'}
            </button>
            <button className="flex h-12 flex-1 items-center justify-center rounded-[30px] bg-[#026F4F] text-base font-medium text-white shadow-[0px_4px_16.3px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#015c42] sm:h-14 sm:text-lg">
              {editMode ? 'Seat Guests' : 'Save Table'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
