import { Clock3 } from 'lucide-react';

export type TableStatus = 'available' | 'occupied' | 'reserved';

const STATUS_CONFIG: Record<TableStatus, { label: string; pillBg: string; bodyBg: string }> = {
  occupied:  { label: 'OCCUPIED',  pillBg: '#E8AD0D', bodyBg: '#F9EFA8' },
  available: { label: 'AVAILABLE', pillBg: '#1FB711', bodyBg: '#A8F9B1' },
  reserved:  { label: 'RESERVED',  pillBg: '#0DADE8', bodyBg: '#C5F0FB' },
};

interface TableCardProps {
  name: string;
  zone: string;
  status: TableStatus;
  bill?: string;
  time?: string;
}

export function TableCard({ name, zone, status, bill, time }: TableCardProps) {
  const { label, pillBg, bodyBg } = STATUS_CONFIG[status];

  const railStyle: React.CSSProperties = {
    backgroundColor: bodyBg,
    borderColor: '#B9B9B9',
  };

  return (
    <div className="relative h-[186px] w-full max-w-[301px]">

      {/* Left vertical rail */}
      <div
        className="absolute left-0 top-[32px] h-[calc(100%-64px)] w-[13px] rounded-[48px] border"
        style={railStyle}
      />

      {/* Right vertical rail */}
      <div
        className="absolute right-0 top-[32px] h-[calc(100%-64px)] w-[13px] rounded-[48px] border"
        style={railStyle}
      />

      {/* Top horizontal rail */}
      <div
        className="absolute left-1/2 top-0 h-[13px] w-[52%] -translate-x-1/2 rounded-[48px] border"
        style={railStyle}
      />

      {/* Bottom horizontal rail */}
      <div
        className="absolute bottom-0 left-1/2 h-[13px] w-[52%] -translate-x-1/2 rounded-[48px] border"
        style={railStyle}
      />

      {/* Main table body */}
      <div
        className="absolute inset-x-[21px] inset-y-[21px] overflow-hidden rounded-lg border border-[#B9B9B9]"
        style={{ backgroundColor: bodyBg }}
      >
        <span className="absolute left-2.5 top-[42px] text-[12px] font-medium leading-[1.4] text-[#6E727A]">
          {zone}
        </span>

        <div className="absolute left-2.5 right-2.5 top-2.5 flex items-center justify-between gap-2">
          <span className="truncate font-satoshi text-[16px] font-medium leading-[1.4] text-black">
            {name}
          </span>
          <span
            className="inline-flex h-[24px] shrink-0 items-center justify-center rounded-[37px] px-2.5 text-[10px] font-medium leading-[1.4] text-white"
            style={{ backgroundColor: pillBg }}
          >
            {label}
          </span>
        </div>

        {(bill || time) && (
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
            {bill && (
              <span className="text-[17px] font-semibold leading-[1.4] text-[#026F4F]">
                {bill}
              </span>
            )}
            {time && (
              <div className="flex items-center gap-1">
                <Clock3 size={14} className="shrink-0 text-[#989898]" />
                <span className="text-[12px] leading-[1.4] text-[#989898]">{time}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
