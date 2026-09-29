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
  { day: 'Sat', day_ar: 'السبت', orders: 62 },
  { day: 'Sun', day_ar: 'الأحد', orders: 78 },
  { day: 'Mon', day_ar: 'الإثنين', orders: 52 },
  { day: 'Tue', day_ar: 'الثلاثاء', orders: 92 },
  { day: 'Wed', day_ar: 'الأربعاء', orders: 58 },
  { day: 'Thu', day_ar: 'الخميس', orders: 70 },
  { day: 'Fri', day_ar: 'الجمعة', orders: 85 },
];

export function OrdersOverview() {
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [lastClickTime, setLastClickTime] = useState<number>(0);

  const handleClick = useCallback((state: any) => {
    if (state && state.activeTooltipIndex !== undefined) {
      const now = Date.now();
      const idx = state.activeTooltipIndex;

      if (now - lastClickTime < 300) {
        setActiveIndex(null);
      } else {
        setActiveIndex((prev) => (prev === idx ? null : idx));
      }
      setLastClickTime(now);
    }
  }, [lastClickTime]);

  return (
    <div className="flex h-full flex-col rounded-xl bg-white p-4">
      <h3 className="text-lg font-semibold leading-none text-[#2D2F33]">
        {isArabic ? 'نظرة عامة على الطلبات' : 'Orders Overview'}
      </h3>
      <div className="mt-4 min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 4, right: 0, left: 4, bottom: 0 }}
            barCategoryGap="28%"
            onClick={handleClick}
          >
            <defs>
              <linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#026F4F" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#026F4F" stopOpacity={0.55} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(0,0,26,0.15)" strokeDasharray="2 3" vertical={false} />
            <XAxis
              dataKey={isArabic ? 'day_ar' : 'day'}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#989898', fontWeight: 500 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              tick={{ fontSize: 12, fill: '#989898', fontWeight: 500 }}
              width={34}
            />
            <Tooltip
              formatter={(v: number) => [v, isArabic ? 'طلبات' : 'Orders']}
              cursor={{ fill: 'rgba(2,111,79,0.06)' }}
              contentStyle={{ borderRadius: 10, border: '1px solid #E9E9E9', fontSize: 13 }}
              labelStyle={{ fontWeight: 600 }}
              active={activeIndex !== null}
              payload={activeIndex !== null ? [{ value: data[activeIndex].orders, name: isArabic ? 'طلبات' : 'Orders' }] : undefined}
              label={activeIndex !== null ? (isArabic ? data[activeIndex].day_ar : data[activeIndex].day) : undefined}
            />
            <Bar dataKey="orders" fill="url(#orderGrad)" radius={[7, 7, 0, 0]} maxBarSize={46} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
