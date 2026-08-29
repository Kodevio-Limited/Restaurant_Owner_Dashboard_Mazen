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
  { hour: '11 AM', sales: 28 },
  { hour: '12 PM', sales: 50 },
  { hour: '1 AM', sales: 18 },
  { hour: '2 AM', sales: 22 },
  { hour: '3 AM', sales: 9 },
  { hour: '4 AM', sales: 14 },
  { hour: '5 AM', sales: 32 },
  { hour: '6 AM', sales: 61 },
  { hour: '7 AM', sales: 42 },
  { hour: '8 AM', sales: 70 },
  { hour: '9 AM', sales: 86 },
  { hour: '10 AM', sales: 47 },
];

export function SalesPerHour() {
  return (
    <div className="flex h-full flex-col rounded-xl bg-white px-[22px] pt-[22px]">
      <h3 className="text-[33px] font-semibold leading-[46px] text-[#2D2F33]">Sales per Hour (Today)</h3>
      <div className="mt-3 min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 0, left: 4, bottom: 0 }} barCategoryGap="32%">
            <CartesianGrid stroke="rgba(0,0,26,0.15)" strokeDasharray="2 3" vertical={false} />
            <XAxis
              dataKey="hour"
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
              formatter={(v: number) => [`$${v}`, 'Sales']}
              cursor={{ fill: 'rgba(137,121,255,0.08)' }}
              contentStyle={{ borderRadius: 10, border: '1px solid #E9E9E9', fontSize: 13 }}
              labelStyle={{ fontWeight: 600 }}
            />
            <Bar
              dataKey="sales"
              fill="#8979FF"
              fillOpacity={0.8}
              radius={[1.5, 1.5, 0, 0]}
              maxBarSize={44}
              background={{ fill: 'rgba(214,219,237,0.4)', fillOpacity: 0.8, radius: 1.5 }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}