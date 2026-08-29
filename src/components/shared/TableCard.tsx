import { Clock3 } from 'lucide-react';

export type TableStatus = 'available' | 'occupied' | 'reserved';

// Exact colours from Figma
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
    // Overall container — matches the Figma "table" shape with rails
    <div className="relative h-[232px] w-[301px]">

      {/* Left vertical rail */}
      <div
        className="absolute left-[15px] top-[39.5px] h-3.5 w-[153px] origin-top-left rotate-90 rounded-[48px] border"
        style={railStyle}
      />

      {/* Right vertical rail */}
      <div
        className="absolute left-[286px] top-[39.5px] h-3.5 w-[153px] origin-top-left rotate-90 rounded-[48px] border"
        style={railStyle}
      />

      {/* Top horizontal rail */}
      <div
        className="absolute left-[74px] top-0 h-3.5 w-[153px] rounded-[48px] border"
        style={railStyle}
      />

      {/* Bottom horizontal rail */}
      <div
        className="absolute bottom-0 left-[74px] h-3.5 w-[153px] rounded-[48px] border"
        style={railStyle}
      />

      {/* ── Main table body ── */}
      <div
        className="absolute left-[25px] top-[25px] h-[182px] w-[251px] overflow-hidden rounded-[9px] border border-[#B9B9B9]"
        style={{ backgroundColor: bodyBg }}
      >
        {/* Zone label */}
        <span className="absolute left-3 top-[51px] text-[16px] font-medium leading-[1.4] text-[#989898]">
          {zone}
        </span>

        {/* Table name + status pill */}
        <div className="absolute left-3 top-3 flex items-center gap-[26px]">
          <span className="font-satoshi text-[23px] font-medium leading-[1.4] text-black">
            {name}
          </span>
          <span
            className="inline-flex h-[30px] items-center justify-center rounded-[37px] px-3 text-[13px] font-medium leading-[1.4] text-white"
            style={{ backgroundColor: pillBg }}
          >
            {label}
          </span>
        </div>

        {/* Bill + elapsed time (occupied only) */}
        {(bill || time) && (
          <div className="absolute bottom-3 left-3 flex items-center gap-10">
            {bill && (
              <span className="text-[25px] font-semibold leading-[1.4] text-[#026F4F]">
                {bill}
              </span>
            )}
            {time && (
              <div className="flex items-center gap-1">
                <Clock3 size={22} className="shrink-0 text-[#989898]" />
                <span className="text-[18px] leading-[1.4] text-[#989898]">{time}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
