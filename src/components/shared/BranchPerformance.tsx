'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { cn } from '@/lib/utils';

type MetricId = 'revenue' | 'orders' | 'turnover' | 'aov' | 'refund' | 'waiting';

interface Metric {
  id: MetricId;
  label: string;
  chip: string;
  bar: string;
  tint: string;
}

const METRICS: Metric[] = [
  { id: 'revenue', label: 'Revenue', chip: '#9E92FE', bar: '#8979FF', tint: 'rgba(158,146,254,0.17)' },
  { id: 'orders', label: 'Total Orders', chip: '#FCA6A0', bar: '#FF928A', tint: 'rgba(252,166,160,0.17)' },
  { id: 'turnover', label: 'Table Turnover', chip: '#E637B2', bar: '#E637B2', tint: 'rgba(230,55,178,0.17)' },
  { id: 'aov', label: 'Avg Order Value', chip: '#54D267', bar: '#54D267', tint: 'rgba(84,210,103,0.17)' },
  { id: 'refund', label: 'Refund Rate', chip: '#E56767', bar: '#E56767', tint: 'rgba(229,103,103,0.17)' },
  { id: 'waiting', label: 'Avg Waittime', chip: '#CCD54B', bar: '#C2CB4A', tint: 'rgba(247,254,146,0.47)' },
];

interface BranchMetric {
  branch: string;
  revenue: number;
  orders: number;
  turnover: number;
  aov: number;
  refund: number;
  waiting: number;
}

const DATA: BranchMetric[] = [
  { branch: 'Dhanmondi', revenue: 62, orders: 48, turnover: 51, aov: 70, refund: 36, waiting: 44 },
  { branch: 'Dhaka', revenue: 70, orders: 56, turnover: 62, aov: 64, refund: 28, waiting: 52 },
  { branch: 'Mohammadpur', revenue: 45, orders: 68, turnover: 40, aov: 74, refund: 12, waiting: 66 },
  { branch: 'Keraniganj', revenue: 90, orders: 62, turnover: 48, aov: 58, refund: 40, waiting: 38 },
  { branch: 'Savar', revenue: 48, orders: 72, turnover: 55, aov: 66, refund: 24, waiting: 60 },
  { branch: 'Narayanganj', revenue: 88, orders: 40, turnover: 70, aov: 52, refund: 32, waiting: 72 },
  { branch: 'Uttara', revenue: 92, orders: 74, turnover: 60, aov: 80, refund: 18, waiting: 34 },
  { branch: 'Gulshan', revenue: 58, orders: 44, turnover: 38, aov: 60, refund: 44, waiting: 48 },
  { branch: 'Mirpur', revenue: 66, orders: 84, turnover: 74, aov: 46, refund: 30, waiting: 58 },
  { branch: 'Motijheel', revenue: 74, orders: 50, turnover: 44, aov: 68, refund: 26, waiting: 42 },
];

function Chip({
  metric,
  tone,
  onToggle,
}: {
  metric: Metric;
  tone: 'active' | 'add';
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      aria-label={tone === 'active' ? `Remove ${metric.label}` : `Add ${metric.label}`}
      className={cn(
        'flex items-center gap-3 rounded-[30px] px-[17px] py-2 text-sm transition-opacity hover:opacity-90',
        tone === 'active' ? 'text-[#000000]' : 'text-[#000000]',
      )}
    >
      <span className="h-[15px] w-[15px] rounded-full" style={{ backgroundColor: metric.chip }} />
      <span className="whitespace-nowrap text-[16px] leading-[22.4px]">{metric.label}</span>
      {tone === 'active' ? (
        <X size={16} className="text-[#000000]" />
      ) : (
        <Plus size={16} className="text-[#000000]" />
      )}
    </button>
  );
}

export function BranchPerformance() {
  const [selected, setSelected] = useState<MetricId[]>(['revenue']);

  const selectedMetrics = METRICS.filter((m) => selected.includes(m.id));
  const addable = METRICS.filter((m) => !selected.includes(m.id));

  const toggle = (id: MetricId) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  // Sizing so grouped bars stay distinct with a clean gap between branch groups
  const sizeMap: Record<number, { maxBar: number; gap: number }> = {
    1: { maxBar: 55, gap: 6 },
    2: { maxBar: 42, gap: 4 },
    3: { maxBar: 34, gap: 3 },
    4: { maxBar: 28, gap: 3 },
    5: { maxBar: 24, gap: 2 },
    6: { maxBar: 20, gap: 2 },
  };
  const n = selected.length;
  const cfg = sizeMap[Math.min(n, 6)] ?? sizeMap[1];

  return (
    <div className="w-full rounded-xl bg-white px-4 pb-5 pt-[18px] sm:px-8 sm:pt-[22px]">
      <h3 className="text-[33px] font-semibold text-[#2D2F33]">Branch Performance Overview</h3>

      <p className="mt-2 text-center text-base leading-7 text-[#989898]">
        Click a chip to add or remove its metric from the chart. Add up to 6 metrics at once.
      </p>

      {/* Active chips (above the line) */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {selectedMetrics.map((m) => (
          <div key={m.id} className="rounded-[30px]" style={{ backgroundColor: m.tint }}>
            <Chip metric={m} tone="active" onToggle={() => toggle(m.id)} />
          </div>
        ))}
      </div>

      {/* Horizontal divider */}
      <div className="mt-4 border-t border-dashed border-[#989898]" />

      {/* Add-area (below the line) */}
      {addable.length > 0 ? (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-2 text-lg font-medium text-[#000000]">ADD ANALYTIC</span>
          {addable.map((m) => (
            <div key={m.id} className="rounded-[30px]" style={{ backgroundColor: m.tint }}>
              <Chip metric={m} tone="add" onToggle={() => toggle(m.id)} />
            </div>
          ))}
        </div>
      ) : null}

      <div className={cn('mt-5 transition-all', n >= 4 ? 'h-[420px]' : 'h-[340px]')}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DATA} margin={{ top: 8, right: 8, left: 4, bottom: 0 }} barGap={cfg.gap}>
            {n > 1 && (
              <CartesianGrid stroke="rgba(0,0,26,0.15)" strokeDasharray="2 3" vertical={false} />
            )}
            <XAxis
              dataKey="branch"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12.5, fill: 'rgba(0,0,0,0.7)', fontWeight: 500 }}
              angle={-32}
              textAnchor="end"
              height={52}
              interval={0}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              tick={{ fontSize: 12, fill: 'rgba(0,0,0,0.7)', fontWeight: 500 }}
              width={34}
            />
            <Tooltip
              cursor={{ fill: 'rgba(137,121,255,0.06)' }}
              contentStyle={{ borderRadius: 10, border: '1px solid #E9E9E9', fontSize: 13 }}
              labelStyle={{ fontWeight: 600 }}
            />
            {selectedMetrics.map((m) => (
              <Bar
                key={m.id}
                dataKey={m.id}
                name={m.label}
                fill={m.bar}
                fillOpacity={0.8}
                radius={[2, 2, 0, 0]}
                maxBarSize={cfg.maxBar}
                barSize={cfg.maxBar}
                background={{ fill: 'rgba(214,219,237,0.4)', fillOpacity: 0.8, radius: 2 }}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      {selectedMetrics.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
          {selectedMetrics.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-1.5 text-xs font-medium text-[rgba(0,0,0,0.7)]"
            >
              <span
                className="inline-block h-3 w-3 rounded-full border border-white"
                style={{ backgroundColor: m.bar }}
              />
              {m.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}