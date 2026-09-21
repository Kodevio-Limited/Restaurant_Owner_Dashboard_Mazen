'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
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

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-[10px] border border-[#E9E9E9] bg-white p-3 shadow-md">
      <p className="text-sm font-semibold text-[#2D2F33]">{label}</p>
      <p className="text-sm text-[#026F4F]">${payload[0].value.toLocaleString()}</p>
    </div>
  );
}

export function RevenueOverTime() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback((state: any) => {
    const idx = state?.activeTooltipIndex;
    if (idx === undefined || idx === null) return;
    setSelectedIndex((prev) => (prev === idx ? null : idx));
  }, []);

  useEffect(() => {
    const el = chartRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      // Keep the page fixed in place; wheel only moves the pointer.
      e.preventDefault();
      // Scroll up (negative) => move right, scroll down (positive) => move left.
      const direction = Math.sign(e.deltaY);
      setSelectedIndex((prev) => {
        const base = prev ?? 0;
        const next = base - direction;
        return Math.max(0, Math.min(data.length - 1, next));
      });
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div className="flex h-full flex-col rounded-xl bg-white p-4">
      <h3 className="text-lg font-semibold text-[#2D2F33]">Revenue Over Time</h3>
      <div ref={chartRef} className="mt-3 min-h-0 flex-1 cursor-pointer">
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
              content={<CustomTooltip />}
              active={selectedIndex !== null}
              payload={selectedIndex !== null ? [{ value: data[selectedIndex].revenue, name: 'Revenue' }] : undefined}
              label={selectedIndex !== null ? data[selectedIndex].month : undefined}
            />
            {selectedIndex !== null && (
              <ReferenceLine
                x={data[selectedIndex].month}
                stroke="#026F4F"
                strokeWidth={1.5}
                strokeDasharray="4 4"
              />
            )}
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#026F4F"
              strokeWidth={2.5}
              fill="url(#revGrad)"
              isAnimationActive={false}
              activeDot={false}
              dot={(props: any) => {
                const { index, cx, cy } = props;
                if (index !== selectedIndex) return <g key={`dot-${index}`} />;
                return <circle key={`dot-${index}`} cx={cx} cy={cy} r={5} fill="#026F4F" />;
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
