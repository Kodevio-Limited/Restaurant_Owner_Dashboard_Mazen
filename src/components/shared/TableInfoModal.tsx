'use client';

import { ArrowLeft, X, Download, ArrowUpRight, Edit3, FileText, CookingPot, Check, BadgeCheck, QrCode } from 'lucide-react';
import { QrCodePlaceholder } from '@/components/shared/QrCodePlaceholder';
import { cn } from '@/lib/utils';

interface TableInfoData {
  id: string;
  name: string;
  zone: 'Indoor' | 'Outdoor' | 'Patio';
  status: 'available' | 'occupied' | 'reserved';
  bill?: string;
  time?: string;
  capacity: number;
}

const STATUS_STYLES: Record<string, { label: string; bg: string }> = {
  occupied: { label: 'OCCUPIED', bg: '#E8AD0D' },
  available: { label: 'AVAILABLE', bg: '#1FB711' },
  reserved: { label: 'RESERVED', bg: '#0DADE8' },
};

const STEPS = [
  { key: 'placed', label: 'Placed', active: true, icon: FileText },
  { key: 'preparing', label: 'Preparing', active: true, icon: CookingPot },
  { key: 'ready', label: 'Ready', active: false, icon: Check },
  { key: 'served', label: 'Served', active: false, icon: BadgeCheck },
];

export function TableInfoModal({
  open,
  table,
  onClose,
  onEdit,
}: {
  open: boolean;
  table: TableInfoData | null;
  onClose: () => void;
  onEdit?: (table: TableInfoData) => void;
}) {
  if (!table) return null;

  const occupied = table.status === 'occupied';
  const s = STATUS_STYLES[table.status];

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

            <div className="flex flex-col items-center gap-2 sm:gap-3">
              <h2 className="text-[22px] font-medium leading-8 text-black sm:text-[32px] sm:leading-10">{table.name}</h2>
              <span
                className="inline-flex items-center rounded-[37px] px-3 py-[6px] text-xs font-medium leading-5 text-white"
                style={{ backgroundColor: s.bg }}
              >
                {s.label}
              </span>
            </div>

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

            <div className="mt-4 flex flex-col gap-3 sm:mt-4 sm:gap-4">
              {/* Time & Bill (occupied only) */}
              {occupied && (
                <section className="flex items-center justify-between rounded-xl bg-white px-4 py-4 outline outline-1 outline-offset-[-1px] outline-[#E9E9E9] sm:px-[22px] sm:py-[19px]">
                  <div className="flex flex-col gap-2 sm:w-[112px] sm:gap-4">
                    <span className="text-xs font-medium leading-4 text-[#686868] sm:text-base sm:leading-5">TIME SEATED</span>
                    <span className="text-xl font-semibold leading-7 text-black sm:text-[32px] sm:leading-10">{table.time}</span>
                  </div>
                  <div className="flex flex-col items-end gap-2 sm:w-[112px] sm:gap-4">
                    <span className="text-right text-xs font-medium leading-4 text-[#686868] sm:text-base sm:leading-5">CURRENT BILL</span>
                    <span className="text-right text-xl font-semibold leading-7 text-[#026F4F] sm:text-[32px] sm:leading-10">{table.bill}</span>
                  </div>
                </section>
              )}

              {/* Active Order (occupied only) */}
              {occupied && (
                <section className="rounded-[10px] bg-white px-4 pb-4 pt-3 outline outline-1 outline-[#E9E9E9] sm:px-5 sm:pb-5 sm:pt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-medium leading-6 text-[#2D2F33] sm:text-lg sm:leading-7">Active Order</h3>
                    <button className="flex items-center gap-1.5 text-xs font-medium leading-5 text-[#026F4F]">
                      View Details
                      <ArrowUpRight size={16} />
                    </button>
                  </div>

                  <div className="mt-5 flex items-start justify-between overflow-x-auto px-1 sm:mt-7">
                    {STEPS.map((step, i) => {
                      const Icon = step.icon;
                      const isActive = step.active;
                      const isLast = i === STEPS.length - 1;
                      return (
                        <div key={step.key} className="flex items-center">
                          <div className="flex flex-col items-center">
                            <span
                              className={cn(
                                'flex h-8 w-8 items-center justify-center rounded-full bg-white sm:h-9 sm:w-9',
                                isActive
                                  ? 'border-2 border-[#358C72] shadow-[0_0_0_3px_rgba(53,140,114,0.15)]'
                                  : 'border border-[#B9B9B9]',
                              )}
                            >
                              <Icon size={16} className={isActive ? 'text-[#358C72]' : 'text-[#B9B9B9]'} />
                            </span>
                            <span
                              className={cn(
                                'mt-1 text-[10px] font-normal leading-3 sm:mt-1.5 sm:text-xs sm:leading-4',
                                isActive ? 'text-[#026F4F]' : 'text-[#B9B9B9]',
                              )}
                            >
                              {step.label}
                            </span>
                          </div>
                          {!isLast && (
                            <div
                              className={cn(
                                'mx-0.5 h-0.5 w-5 sm:mx-1 sm:w-10',
                                STEPS[i + 1].active ? 'bg-[#358C72]' : isActive ? 'bg-[#358C72]' : 'bg-[#B9B9B9]',
                              )}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Table Info */}
              <section className="rounded-xl bg-white px-4 pb-4 pt-4 outline outline-1 outline-offset-[-1px] outline-[#E9E9E9] sm:px-[19px] sm:pb-5 sm:pt-[21px]">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium leading-6 text-[#2D2F33] sm:text-lg sm:leading-7">Table Info</h3>
                  {!occupied && (
                    <button
                      onClick={() => { onEdit?.(table); onClose(); }}
                      className="flex items-center gap-1 text-base font-normal leading-6 text-[#026F4F] sm:gap-[5px] sm:text-lg sm:leading-7"
                    >
                      <Edit3 size={20} />
                      Edit
                    </button>
                  )}
                </div>

                <div className="mt-5 flex flex-col gap-2 sm:mt-11">
                  <div className="flex flex-col gap-1.5 sm:gap-2">
                    <span className="text-sm font-medium leading-4 text-[#686868] sm:text-base sm:leading-5">Table Name / Number</span>
                    <div className="flex h-11 items-center rounded-[87px] bg-[#F2F2F2] px-4 sm:h-14">
                      <span className="font-satoshi text-sm font-medium leading-5 text-[#989898] sm:text-base sm:leading-6">{table.name}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 sm:gap-2">
                    <span className="text-sm font-medium leading-4 text-[#686868] sm:text-base sm:leading-5">Seating Capacity</span>
                    <div className="flex h-11 items-center rounded-[87px] bg-[#F2F2F2] px-4 sm:h-14">
                      <span className="font-satoshi text-sm font-medium leading-5 text-[#989898] sm:text-base sm:leading-6">{table.capacity}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 sm:gap-2">
                    <span className="text-sm font-medium leading-4 text-[#686868] sm:text-base sm:leading-5">Category</span>
                    <div className="flex h-11 items-center justify-between rounded-[87px] bg-[#F2F2F2] px-4 sm:h-14">
                      <span className="font-satoshi text-sm font-medium leading-5 text-[#989898] sm:text-base sm:leading-6">{table.zone}</span>
                      <span className="flex h-5 w-5 items-center justify-center sm:h-6 sm:w-6">
                        <span className="block h-2.5 w-2.5 rotate-45 border-b-2 border-l-2 border-[#989898] sm:h-3 sm:w-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t border-[#E2E2E2] px-4 py-3 sm:px-5 sm:py-4">
            <button className="flex h-12 w-full items-center justify-center rounded-[30px] bg-[#026F4F] text-base font-medium text-white shadow-[0px_4px_16.3px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#015c42] sm:h-14 sm:text-lg">
              Clear table
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
