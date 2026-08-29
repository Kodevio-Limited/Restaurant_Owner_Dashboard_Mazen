import { Clock3 } from 'lucide-react';

export type TableStatus = 'available' | 'occupied' | 'reserved';

const STATUS_STYLES: Record<TableStatus, { label: string; pillBg: string; bodyBg: string }> = {
  occupied: { label: 'OCCUPIED', pillBg: '#E8AD0D', bodyBg: 'bg-[#F9EFA8]' },
  available: { label: 'AVAILABLE', pillBg: '#1FB711', bodyBg: 'bg-[#A8F9B1]' },
  reserved: { label: 'RESERVED', pillBg: '#0DADE8', bodyBg: 'bg-[#C5F0FB]' },
};

interface TableCardProps {
  name: string;
  zone: string;
  status: TableStatus;
  bill?: string;
  time?: string;
}

export function TableCard({ name, zone, status, bill, time }: TableCardProps) {
  const s = STATUS_STYLES[status];

  return (
    <div className="relative h-56 w-72">
      {/* Left side bar */}
      <div
        className="absolute left-[15px] top-[39.5px] h-3.5 w-36 origin-top-left rotate-90 rounded-[48px] border border-[#B9B9B9]"
        style={{ backgroundColor: s.bodyBg }}
      />
      {/* Right side bar */}
      <div
        className="absolute left-[301px] top-[39.5px] h-3.5 w-36 origin-top-left rotate-90 rounded-[48px] border border-[#B9B9B9]"
        style={{ backgroundColor: s.bodyBg }}
      />
      {/* Top bar */}
      <div
        className="absolute left-[74px] top-0 h-3.5 w-40 rounded-[48px] border border-[#B9B9B9]"
        style={{ backgroundColor: s.bodyBg }}
      />
      {/* Bottom bar */}
      <div
        className="absolute left-[74px] top-[217px] h-3.5 w-40 rounded-[48px] border border-[#B9B9B9]"
        style={{ backgroundColor: s.bodyBg }}
      />
      {/* Main body */}
      <div
        className="absolute left-[25px] top-[25px] h-44 w-64 overflow-hidden rounded-lg outline outline-1 outline-offset-[-1px] outline-[#B9B9B9]"
        style={{ backgroundColor: s.bodyBg }}
      >
        {/* Zone label */}
        <span className="absolute left-[13px] top-[52px] text-base font-medium leading-6 text-[#989898]">
          {zone}
        </span>

        {/* Header row */}
        <div className="absolute left-[13px] top-[13px] inline-flex items-center gap-6">
          <span className="font-satoshi text-2xl font-medium leading-8 text-black">{name}</span>
          <span
            className="inline-flex h-7 w-24 items-center justify-center rounded-[37px] px-3 text-xs font-medium leading-5 text-white"
            style={{ backgroundColor: s.pillBg }}
          >
            {s.label}
          </span>
        </div>

        {/* Bill + time */}
        <div className="absolute left-[13px] top-[128px] inline-flex items-center gap-10">
          {bill && (
            <span className="text-2xl font-semibold leading-9 text-[#026F4F]">{bill}</span>
          )}
          {time && (
            <div className="flex w-24 items-start gap-[5px]">
              <Clock3 size={24} className="text-[#989898]" />
              <span className="text-lg font-normal leading-6 text-[#989898]">{time}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}