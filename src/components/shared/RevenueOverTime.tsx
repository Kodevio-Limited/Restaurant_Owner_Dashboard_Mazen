'use client';

import { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const data = [
  { month: 'Jan', revenue: 9500 },
  { month: 'Feb', revenue: 12500 },
  { month: 'Mar', revenue: 11200 },
  { month: 'Apr', revenue: 17500 },
  { month: 'May', revenue: 15900 },
  { month: 'Jun', revenue: 20200 },
  { month: 'Jul', revenue: 18000 },
  { month: 'Aug', revenue: 24500 },
  { month: 'Sep', revenue: 21500 },
  { month: 'Oct', revenue: 24800 },
  { month: 'Nov', revenue: 23000 },
  { month: 'Dec', revenue: 27000 },
];

export function RevenueOverTime() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleClick = (state: any) => {
    if (state && state.activeTooltipIndex !== undefined) {
      const idx = state.activeTooltipIndex;
      setActiveIndex((prev) => (prev === idx ? null : idx));
    }
  };

  return (
    <div className="flex h-full flex-col rounded-xl bg-white p-4">
      <h3 className="text-lg font-semibold text-[#2D2F33]">Revenue Over Time</h3>
      <div className="mt-3 min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            onClick={handleClick}
          >
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#026F4F" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#026F4F" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(0,0,26,0.15)" strokeDasharray="2 3" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'rgba(0,0,0,0.4)', fontWeight: 500 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              domain={[0, 30000]}
              ticks={[0, 10000, 20000, 30000]}
              tickFormatter={(v) => (v === 0 ? '0' : `${v / 1000}K`)}
              tick={{ fontSize: 12, fill: 'rgba(0,0,0,0.4)', fontWeight: 500 }}
              width={44}
            />
            <Tooltip
              formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']}
              contentStyle={{ borderRadius: 10, border: '1px solid #E9E9E9', fontSize: 13 }}
              labelStyle={{ fontWeight: 600 }}
              active={activeIndex !== null}
              payload={activeIndex !== null ? [{ value: data[activeIndex].revenue, name: 'Revenue' }] : undefined}
              label={activeIndex !== null ? data[activeIndex].month : undefined}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#026F4F"
              strokeWidth={2.5}
              fill="url(#revGrad)"
              dot={false}
              activeDot={{ r: 5, fill: '#026F4F' }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
