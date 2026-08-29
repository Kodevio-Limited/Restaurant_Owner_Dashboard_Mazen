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
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between px-5 pt-6">
          <button
            onClick={onClose}
            aria-label="Back"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E9E9E9] text-black transition-colors hover:bg-[#DcDcDc]"
          >
            <ArrowLeft size={22} />
          </button>

          <div className="flex flex-col items-center gap-3">
            <h2 className="text-[32px] font-medium leading-10 text-black">
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

        {editMode && (
          <div className="mt-5 flex flex-col items-center gap-3.5 px-5">
            <span className="text-[32px] font-semibold leading-10 text-black">Table is Ready</span>
          </div>
        )}

        {/* Form */}
        <div className={cn('px-5', editMode ? 'pt-8' : 'pt-12')}>
          <div className="rounded-xl bg-white px-[19px] pb-5 pt-[21px] outline outline-1 outline-offset-[-1px] outline-[#E9E9E9]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium leading-7 text-[#2D2F33]">Table Info</h3>
              {editMode && (
                <span className="flex items-center gap-[5px] text-lg font-normal leading-7 text-[#026F4F]">
                  <span className="flex h-6 w-6 items-center justify-center">
                    <span className="h-4 w-4 rounded border border-[#026F4F]" />
                    <span className="ml-1.5 h-3.5 w-3.5 border-b border-[#026F4F]" />
                  </span>
                  Edit
                </span>
              )}
            </div>

            <div className="mt-11 flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <span className="text-base font-medium leading-5 text-[#686868]">Table Name / Number</span>
                <div className="flex h-14 items-center rounded-[87px] bg-[#F2F2F2] px-4">
                  <span className="font-satoshi text-base font-medium leading-6 text-[#989898]">
                    {editMode ? table.name : 'e.g. Table 12'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-base font-medium leading-5 text-[#686868]">Seating Capacity</span>
                <div className="flex h-14 items-center rounded-[87px] bg-[#F2F2F2] px-4">
                  <span className="font-satoshi text-base font-medium leading-6 text-[#989898]">
                    {editMode ? table.capacity : '2'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-base font-medium leading-5 text-[#686868]">Category</span>
                <div className="flex h-14 items-center justify-between rounded-[87px] bg-[#F2F2F2] px-4">
                  <span className="font-satoshi text-base font-medium leading-6 text-[#989898]">
                    {editMode ? table.zone : 'Indoor'}
                  </span>
                  <ChevronDown size={18} className="text-[#989898]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={cn('shrink-0', editMode ? 'px-5 pt-6 pb-5' : 'px-5 pt-6 pb-5')}>
          <div className="flex items-center justify-between gap-4">
            <button
    onClick={() => { editMode ? onMarkReserved?.() : onClose(); }}
    className="flex h-14 flex-1 items-center justify-center rounded-[30px] bg-[#E9E9E9] text-lg font-medium text-[#2D2F33] shadow-[0px_4px_16.3px_rgba(0,0,0,0.12)] outline outline-1 outline-offset-[-1px] outline-[#B9B9B9] transition-colors hover:bg-[#DcDcDc]"
  >
    {editMode ? 'Mark Reserved' : 'Cancel'}
  </button>
            <button className="flex h-14 flex-1 items-center justify-center rounded-[30px] bg-[#026F4F] text-lg font-medium text-white shadow-[0px_4px_16.3px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#015c42]">
              {editMode ? 'Seat Guests' : 'Save Table'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}