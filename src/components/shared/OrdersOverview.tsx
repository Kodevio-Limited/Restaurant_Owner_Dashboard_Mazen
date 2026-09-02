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
  { day: 'Sat', orders: 62 },
  { day: 'Sun', orders: 78 },
  { day: 'Mon', orders: 52 },
  { day: 'Tue', orders: 92 },
  { day: 'Wed', orders: 58 },
  { day: 'Thu', orders: 70 },
  { day: 'Fri', orders: 85 },
];

export function OrdersOverview() {
  return (
    <div className="flex h-full flex-col rounded-xl bg-white p-4">
      <h3 className="text-lg font-semibold leading-none text-[#2D2F33]">Orders Overview</h3>
      <div className="mt-4 min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 0, left: 4, bottom: 0 }} barCategoryGap="28%">
            <defs>
              <linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#026F4F" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#026F4F" stopOpacity={0.55} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(0,0,26,0.15)" strokeDasharray="2 3" vertical={false} />
            <XAxis
              dataKey="day"
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
              formatter={(v: number) => [v, 'Orders']}
              cursor={{ fill: 'rgba(2,111,79,0.06)' }}
              contentStyle={{ borderRadius: 10, border: '1px solid #E9E9E9', fontSize: 13 }}
              labelStyle={{ fontWeight: 600 }}
            />
            <Bar dataKey="orders" fill="url(#orderGrad)" radius={[7, 7, 0, 0]} maxBarSize={46} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}