'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Download, ChevronDown } from 'lucide-react';
import { QrCodePlaceholder } from '@/components/shared/QrCodePlaceholder';
import { cn } from '@/lib/utils';

interface AddEditTableData {
  name: string;
  zone: string;
  capacity: number;
}

const CATEGORIES = ['Indoor', 'Outdoor', 'Patio'] as const;

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

  const [category, setCategory] = useState<string>(editMode ? table?.zone : 'Indoor');
  const [openDropdown, setOpenDropdown] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editMode && table) setCategory(table.zone);
  }, [editMode, table]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setOpenDropdown(false);
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;
    const clone = svg.cloneNode(true) as SVGElement;
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const data = new XMLSerializer().serializeToString(clone);
    const blob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `table-qr-${(editMode ? table?.name : 'new-table').toLowerCase().replace(/\s+/g, '-')}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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

          <div className="h-10 w-10 sm:h-12 sm:w-12" />
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center gap-4 px-4 pt-4 sm:px-5 sm:pt-6">
          <div
            ref={qrRef}
            className="flex h-[120px] w-[120px] items-center justify-center rounded-xl bg-white outline outline-1 outline-[#E9E9E9] sm:h-[154px] sm:w-[154px]"
          >
            <QrCodePlaceholder size={110} />
          </div>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 rounded-[44px] bg-[rgba(242,211,255,0.54)] px-2.5 py-1.5 text-sm font-medium leading-6 text-[#961D6E] transition-colors hover:bg-[rgba(242,211,255,0.8)] sm:text-base"
          >
            <Download size={20} />
            Download
          </button>
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
              <div className="relative flex flex-col gap-1.5 sm:gap-2">
                <span className="text-sm font-medium leading-4 text-[#686868] sm:text-base sm:leading-5">Category</span>
                <button
                  type="button"
                  onClick={() => setOpenDropdown((v) => !v)}
                  className="flex h-11 items-center justify-between rounded-[87px] bg-[#F2F2F2] px-4 text-left sm:h-14"
                >
                  <span className={cn('font-satoshi text-sm font-medium leading-5 sm:text-base sm:leading-6', category ? 'text-[#2D2F33]' : 'text-[#989898]')}>
                    {category || 'Select category'}
                  </span>
                  <ChevronDown size={16} className={cn('text-[#989898] transition-transform', openDropdown && 'rotate-180')} />
                </button>
                {openDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(false)} />
                    <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-2xl bg-white shadow-lg outline outline-1 outline-[#E9E9E9]">
                      {CATEGORIES.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => { setCategory(c); setOpenDropdown(false); }}
                          className={cn(
                            'block w-full px-4 py-2.5 text-left font-satoshi text-sm leading-5 transition-colors hover:bg-[#F2F2F2] sm:text-base sm:leading-6',
                            category === c ? 'text-[#026F4F]' : 'text-[#2D2F33]',
                          )}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-[#E2E2E2] px-4 pt-3 pb-2.5 sm:px-5 sm:pt-3.5 sm:pb-3">
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
