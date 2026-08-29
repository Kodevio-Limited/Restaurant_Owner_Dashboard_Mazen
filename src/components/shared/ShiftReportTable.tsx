import { Download } from 'lucide-react';

interface SessionRow {
  id: string;
  date: string;
  started: string;
  ended: string | null; // null => active
  cashier: string;
  revenue: string;
}

const ROWS: SessionRow[] = [
  { id: '1', date: '06-12-2025', started: '08:00 AM', ended: null, cashier: 'Sarah Jessie', revenue: 'Accumulating....' },
  { id: '2', date: '06-11-2025', started: '09:00 AM', ended: '05:00 PM', cashier: 'Sarah Jessie', revenue: '$2,190.00' },
  { id: '3', date: '06-10-2025', started: '08:30 AM', ended: '06:00 PM', cashier: 'John Carter', revenue: '$1,860.00' },
  { id: '4', date: '06-09-2025', started: '10:00 AM', ended: '07:30 PM', cashier: 'Sarah Jessie', revenue: '$2,420.00' },
  { id: '5', date: '06-08-2025', started: '08:00 AM', ended: '04:30 PM', cashier: 'Emily Reed', revenue: '$1,540.00' },
];

const GRID = 'grid grid-cols-[1.3fr_1.1fr_1.2fr_1.5fr_1.3fr_56px] lg:grid-cols-[1.5fr_1.2fr_1.4fr_1.4fr_1.2fr_72px]';

export function ShiftReportTable() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-satoshi text-[33px] font-bold text-[#2D2F33]">Shift Z-Reports &amp; Cashier Sessions</h3>
        <button className="flex items-center gap-1.5 rounded-[45px] border border-[#B9B9B9] bg-white py-[10px] pl-[15px] pr-[10px] text-sm text-[#686868]">
          Per Month
        </button>
      </div>

      <div className="w-full overflow-x-auto rounded-xl bg-white">
        {/* Header */}
        <div
          className={`${GRID} min-w-[780px] items-center gap-x-4 bg-[#E9E9E9] px-9 py-4 text-left text-[15px] font-medium text-[#686868]`}
        >
          <span>SESSION DATE</span>
          <span>TIME STARTED</span>
          <span>TIME ENDED</span>
          <span>CASHIER HANDLED</span>
          <span>GROSS REVENUE</span>
          <span>ACTIONS</span>
        </div>

        {/* Rows */}
        <div className="min-w-[780px] divide-y divide-[#F2F2F2]">
          {ROWS.map((row) => (
            <div
              key={row.id}
              className={`${GRID} items-center gap-x-4 px-9 py-6 text-[15px]`}
            >
              <span className="font-medium text-[#000000]">{row.date}</span>
              <span className="font-medium text-[#000000]">{row.started}</span>

              {row.ended === null ? (
                <span className="inline-flex w-fit items-center rounded-[22px] bg-[#E6FFEB] px-4 py-2 text-[15px] text-[#139615]">
                  ACTIVE
                </span>
              ) : (
                <span className="font-medium text-[#000000]">{row.ended}</span>
              )}

              <span className="font-medium text-[#000000]">{row.cashier}</span>

              <span
                className={row.ended === null ? 'text-[#989898]' : 'text-[19px] font-semibold text-[#026F4F]'}
              >
                {row.revenue}
              </span>

              <button
                className="flex h-[52px] w-[52px] items-center justify-center rounded-lg bg-[#E9E9E9] text-[#2D2F33] transition-colors hover:bg-[#026F4F] hover:text-white"
                aria-label="Download report"
              >
                <Download size={24} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}