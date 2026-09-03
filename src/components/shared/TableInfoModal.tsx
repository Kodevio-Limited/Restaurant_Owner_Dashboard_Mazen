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

          <div className="flex flex-col items-center gap-3">
            <h2 className="text-[32px] font-medium leading-10 text-black">{table.name}</h2>
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

        {/* Body */}
        <div className="flex flex-col gap-4 px-5 pt-4 pb-5">
          {/* Time & Bill (occupied only) */}
          {occupied && (
            <section className="flex items-center justify-between rounded-xl bg-white px-[22px] py-[19px] outline outline-1 outline-offset-[-1px] outline-[#E9E9E9]">
              <div className="flex w-[112px] flex-col gap-4">
                <span className="text-base font-medium leading-5 text-[#686868]">TIME SEATED</span>
                <span className="text-[32px] font-semibold leading-10 text-black">{table.time}</span>
              </div>
              <div className="flex w-[112px] flex-col items-end gap-4">
                <span className="text-right text-base font-medium leading-5 text-[#686868]">CURRENT BILL</span>
                <span className="text-right text-[32px] font-semibold leading-10 text-[#026F4F]">{table.bill}</span>
              </div>
            </section>
          )}

          {/* Active Order (occupied only) */}
          {occupied && (
            <section className="rounded-[10px] bg-white px-5 pb-5 pt-4 outline outline-1 outline-[#E9E9E9]">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium leading-7 text-[#2D2F33]">Active Order</h3>
                <button className="flex items-center gap-1.5 text-xs font-medium leading-5 text-[#026F4F]">
                  View Details
                  <ArrowUpRight size={20} />
                </button>
              </div>

              <div className="mt-7 flex items-start justify-between overflow-x-auto px-1">
                {STEPS.map((step, i) => {
                  const Icon = step.icon;
                  const isActive = step.active;
                  const isLast = i === STEPS.length - 1;
                  return (
                    <div key={step.key} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <span
                          className={cn(
                            'flex h-9 w-9 items-center justify-center rounded-full bg-white',
                            isActive
                              ? 'border-2 border-[#358C72] shadow-[0_0_0_3px_rgba(53,140,114,0.15)]'
                              : 'border border-[#B9B9B9]',
                          )}
                        >
                          <Icon size={18} className={isActive ? 'text-[#358C72]' : 'text-[#B9B9B9]'} />
                        </span>
                        <span
                          className={cn(
                            'mt-1.5 text-xs font-normal leading-4',
                            isActive ? 'text-[#026F4F]' : 'text-[#B9B9B9]',
                          )}
                        >
                          {step.label}
                        </span>
                      </div>
                      {!isLast && (
                        <div
                          className={cn(
                            'mx-1 h-0.5 w-8 sm:w-12',
                            STEPS[i + 1].active
                              ? 'bg-[#358C72]'
                              : isActive
                                ? 'bg-[#358C72]'
                                : 'bg-[#B9B9B9]',
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
          <section className="rounded-xl bg-white px-[19px] pb-5 pt-[21px] outline outline-1 outline-offset-[-1px] outline-[#E9E9E9]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium leading-7 text-[#2D2F33]">Table Info</h3>
              {!occupied && (
                <button
                  onClick={() => { onEdit?.(table); onClose(); }}
                  className="flex items-center gap-[5px] text-lg font-normal leading-7 text-[#026F4F]"
                >
                  <Edit3 size={24} />
                  Edit
                </button>
              )}
            </div>

            <div className="mt-11 flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <span className="text-base font-medium leading-5 text-[#686868]">Table Name / Number</span>
                <div className="flex h-14 items-center rounded-[87px] bg-[#F2F2F2] px-4">
                  <span className="font-satoshi text-base font-medium leading-6 text-[#989898]">{table.name}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-base font-medium leading-5 text-[#686868]">Seating Capacity</span>
                <div className="flex h-14 items-center rounded-[87px] bg-[#F2F2F2] px-4">
                  <span className="font-satoshi text-base font-medium leading-6 text-[#989898]">{table.capacity}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-base font-medium leading-5 text-[#686868]">Category</span>
                <div className="flex h-14 items-center justify-between rounded-[87px] bg-[#F2F2F2] px-4">
                  <span className="font-satoshi text-base font-medium leading-6 text-[#989898]">{table.zone}</span>
                  <span className="flex h-6 w-6 items-center justify-center">
                    <span className="block h-3 w-3 rotate-45 border-b-2 border-l-2 border-[#989898]" />
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-5 pb-5 pt-0">
          <button className="flex h-14 w-full items-center justify-center rounded-[30px] bg-[#026F4F] text-lg font-medium text-white shadow-[0px_4px_16.3px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#015c42]">
            Clear table
          </button>
        </div>
      </div>
    </>
  );
}