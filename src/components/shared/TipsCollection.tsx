'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const data = [
  { day: 'Tue', tips: 62 },
  { day: 'Fri', tips: 88 },
  { day: 'Monday', tips: 40 },
  { day: 'Tuesday', tips: 76 },
  { day: 'Wednesday', tips: 58 },
  { day: 'Saturday', tips: 42 },
  { day: 'Sunday', tips: 70 },
];

export function TipsCollection() {
  return (
    <div className="flex h-full flex-col rounded-xl bg-white px-[22px] pt-[22px]">
      <h3 className="text-[33px] font-semibold leading-[46px] text-[#2D2F33]">Tips Collection</h3>
      <div className="mt-3 min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 0, left: 4, bottom: 0 }} barCategoryGap="30%">
            <defs>
              <linearGradient id="tipGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F97316" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#F97316" stopOpacity={0.5} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(0,0,26,0.15)" strokeDasharray="2 3" vertical={false} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'rgba(0,0,0,0.7)', fontWeight: 500 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              tickFormatter={(v) => `$${v}`}
              tick={{ fontSize: 12, fill: 'rgba(0,0,0,0.7)', fontWeight: 500 }}
              width={40}
            />
            <Tooltip
              formatter={(v: number) => [`$${v}`, 'Tips']}
              cursor={{ fill: 'rgba(249,115,22,0.08)' }}
              contentStyle={{ borderRadius: 10, border: '1px solid #E9E9E9', fontSize: 13 }}
              labelStyle={{ fontWeight: 600 }}
            />
            <Bar dataKey="tips" fill="url(#tipGrad)" radius={[6, 6, 0, 0]} maxBarSize={56} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}