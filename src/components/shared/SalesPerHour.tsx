'use client';

import { useState, useCallback } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { useLocale } from 'next-intl';

const data = [
  { hour: '11 AM', hour_ar: '11 ص', sales: 28 },
  { hour: '12 PM', hour_ar: '12 م', sales: 50 },
  { hour: '1 AM',  hour_ar: '1 ص',  sales: 18 },
  { hour: '2 AM',  hour_ar: '2 ص',  sales: 22 },
  { hour: '3 AM',  hour_ar: '3 ص',  sales: 9 },
  { hour: '4 AM',  hour_ar: '4 ص',  sales: 14 },
  { hour: '5 AM',  hour_ar: '5 ص',  sales: 32 },
  { hour: '6 AM',  hour_ar: '6 ص',  sales: 61 },
  { hour: '7 AM',  hour_ar: '7 ص',  sales: 42 },
  { hour: '8 AM',  hour_ar: '8 ص',  sales: 70 },
  { hour: '9 AM',  hour_ar: '9 ص',  sales: 86 },
  { hour: '10 AM', hour_ar: '10 ص', sales: 47 },
];

export function SalesPerHour() {
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const [pinnedIndex, setPinnedIndex] = useState<number | null>(null);

  const handleClick = useCallback((state: any) => {
    const idx = state?.activeTooltipIndex;
    if (idx === undefined || idx === null) return;
    setPinnedIndex((prev) => (prev === idx ? null : idx));
  }, []);

  const displayIndex = pinnedIndex;

  return (
    <div className="flex h-full flex-col rounded-xl bg-white p-4">
      <h3 className="text-lg font-semibold text-[#2D2F33]">
        {isArabic ? 'المبيعات لكل ساعة (اليوم)' : 'Sales per Hour (Today)'}
      </h3>
      <div className="mt-2 min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 4, right: 0, left: 4, bottom: 0 }}
            barCategoryGap="32%"
            onClick={handleClick}
          >
            <CartesianGrid stroke="rgba(0,0,26,0.15)" strokeDasharray="2 3" vertical={false} />
            <XAxis
              dataKey={isArabic ? 'hour_ar' : 'hour'}
              axisLine={false}
              tickLine={false}
              angle={-45}
              textAnchor="end"
              tick={{ fontSize: 12, fill: 'rgba(0,0,0,0.7)', fontWeight: 500 }}
              dy={6}
              height={46}
              interval={0}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              tickFormatter={(v) => (v === 0 ? '0' : `$ ${v}`)}
              tick={{ fontSize: 12, fill: 'rgba(0,0,0,0.7)', fontWeight: 500 }}
              width={44}
            />
            <Tooltip
              formatter={(v: number) => [`$${v}`, isArabic ? 'المبيعات' : 'Sales']}
              cursor={{ fill: 'rgba(137,121,255,0.08)' }}
              contentStyle={{ borderRadius: 10, border: '1px solid #E9E9E9', fontSize: 13 }}
              labelStyle={{ fontWeight: 600 }}
              active={displayIndex !== null}
              payload={displayIndex !== null ? [{ value: data[displayIndex].sales, name: isArabic ? 'المبيعات' : 'Sales' }] : undefined}
              label={displayIndex !== null ? (isArabic ? data[displayIndex].hour_ar : data[displayIndex].hour) : undefined}
            />
            <Bar
              dataKey="sales"
              fill="#8979FF"
              fillOpacity={0.8}
              radius={[1.5, 1.5, 0, 0]}
              maxBarSize={44}
              background={{ fill: 'rgba(214,219,237,0.4)', fillOpacity: 0.8, radius: 1.5 }}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}