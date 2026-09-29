'use client';
import { Download } from 'lucide-react';
import { useLocale } from 'next-intl';

interface SessionRow {
  id: string;
  date: string;
  started: string;
  started_ar: string;
  ended: string | null;
  ended_ar?: string | null;
  cashier: string;
  cashier_ar: string;
  revenue: string;
  revenue_ar: string;
}

const ROWS: SessionRow[] = [
  { id: '1', date: '06-12-2025', started: '08:00 AM', started_ar: '08:00 ص', ended: null, ended_ar: null, cashier: 'Sarah Jessie', cashier_ar: 'سارة جيسي', revenue: 'Accumulating....', revenue_ar: 'جاري التجميع...' },
  { id: '2', date: '06-11-2025', started: '09:00 AM', started_ar: '09:00 ص', ended: '05:00 PM', ended_ar: '05:00 م', cashier: 'Sarah Jessie', cashier_ar: 'سارة جيسي', revenue: '$2,190.00', revenue_ar: '$2,190.00' },
  { id: '3', date: '06-10-2025', started: '08:30 AM', started_ar: '08:30 ص', ended: '06:00 PM', ended_ar: '06:00 م', cashier: 'John Carter', cashier_ar: 'جون كارتر', revenue: '$1,860.00', revenue_ar: '$1,860.00' },
  { id: '4', date: '06-09-2025', started: '10:00 AM', started_ar: '10:00 ص', ended: '07:30 PM', ended_ar: '07:30 م', cashier: 'Sarah Jessie', cashier_ar: 'سارة جيسي', revenue: '$2,420.00', revenue_ar: '$2,420.00' },
  { id: '5', date: '06-08-2025', started: '08:00 AM', started_ar: '08:00 ص', ended: '04:30 PM', ended_ar: '04:30 م', cashier: 'Emily Reed', cashier_ar: 'إميلي ريد', revenue: '$1,540.00', revenue_ar: '$1,540.00' },
];

const GRID = 'grid grid-cols-[1.3fr_1.1fr_1.2fr_1.5fr_1.3fr_56px] lg:grid-cols-[1.5fr_1.2fr_1.4fr_1.4fr_1.2fr_72px]';

export function ShiftReportTable() {
  const locale = useLocale();
  const isArabic = locale === 'ar';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-satoshi text-xl font-bold text-[#2D2F33]">
          {isArabic ? 'تقارير الوردية وجلسات الكاشير' : 'Shift Z-Reports & Cashier Sessions'}
        </h3>
        <button className="flex items-center gap-1.5 rounded-[45px] border border-[#B9B9B9] bg-white px-3.5 py-2 text-[13px] text-[#686868]">
          {isArabic ? 'شهرياً' : 'Per Month'}
        </button>
      </div>

      <div className="w-full overflow-x-auto rounded-xl bg-white">
        {/* Header */}
        <div
          className={`${GRID} min-w-[680px] items-center gap-x-4 bg-[#E9E9E9] px-5 py-3 text-start text-[12px] font-medium text-[#686868]`}
        >
          <span>{isArabic ? 'تاريخ الجلسة' : 'SESSION DATE'}</span>
          <span>{isArabic ? 'وقت البدء' : 'TIME STARTED'}</span>
          <span>{isArabic ? 'وقت الانتهاء' : 'TIME ENDED'}</span>
          <span>{isArabic ? 'الكاشير المسؤول' : 'CASHIER HANDLED'}</span>
          <span>{isArabic ? 'إجمالي الإيرادات' : 'GROSS REVENUE'}</span>
          <span>{isArabic ? 'الإجراءات' : 'ACTIONS'}</span>
        </div>

        {/* Rows */}
        <div className="min-w-[680px] divide-y divide-[#F2F2F2]">
          {ROWS.map((row) => (
            <div
              key={row.id}
              className={`${GRID} items-center gap-x-4 px-5 py-3.5 text-[13px]`}
            >
              <span className="font-medium text-[#000000]">{row.date}</span>
              <span className="font-medium text-[#000000]">
                {isArabic ? row.started_ar : row.started}
              </span>

              {row.ended === null ? (
                <span className="inline-flex w-fit items-center rounded-[22px] bg-[#E6FFEB] px-3 py-1 text-[12px] text-[#139615]">
                  {isArabic ? 'نشط' : 'ACTIVE'}
                </span>
              ) : (
                <span className="font-medium text-[#000000]">
                  {isArabic ? row.ended_ar : row.ended}
                </span>
              )}

              <span className="font-medium text-[#000000]">
                {isArabic ? row.cashier_ar : row.cashier}
              </span>

              <span
                className={row.ended === null ? 'text-[#989898]' : 'text-[15px] font-semibold text-[#026F4F]'}
              >
                {isArabic ? row.revenue_ar : row.revenue}
              </span>

              <button
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E9E9E9] text-[#2D2F33] transition-colors hover:bg-[#026F4F] hover:text-white"
                aria-label={isArabic ? 'تحميل التقرير' : 'Download report'}
              >
                <Download size={17} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}