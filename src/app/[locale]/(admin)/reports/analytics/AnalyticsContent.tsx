'use client';

import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import {
  DollarSign, Receipt, Flame, Armchair, CreditCard,
  Clock3, Timer, UserCheck, XCircle, Table2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatCard } from '@/components/shared/StatCard';
import { RevenueOverTime } from '@/components/shared/RevenueOverTime';
import { OrdersOverview } from '@/components/shared/OrdersOverview';
import { BranchPerformance } from '@/components/shared/BranchPerformance';
import { ItemsTable } from '@/components/shared/ItemsTable';
import { SalesPerHour } from '@/components/shared/SalesPerHour';
import { TipsCollection } from '@/components/shared/TipsCollection';
import { ShiftReportTable } from '@/components/shared/ShiftReportTable';

const TOP_ITEMS = [
  { id: 't1', name: 'Shoyu Ramen',     name_ar: 'شويو رامن',     qty: 145, revenue: '$15.99' },
  { id: 't2', name: 'Chicken Biryani', name_ar: 'برياني دجاج',   qty: 132, revenue: '$12.50' },
  { id: 't3', name: 'Beef Burger',     name_ar: 'برجر لحم',      qty: 118, revenue: '$11.20' },
];

const LEAST_ITEMS = [
  { id: 'l1', name: 'Mushroom Soup', name_ar: 'شوربة فطر',   qty: 23, revenue: '$6.99' },
  { id: 'l2', name: 'Greek Salad',   name_ar: 'سلطة يونانية', qty: 18, revenue: '$8.40' },
  { id: 'l3', name: 'Iced Latte',    name_ar: 'لاتيه مثلج',  qty: 11, revenue: '$4.80' },
];

// Orders by channel breakdown (Bug-11). Counts sum to Total Orders (48).
// TODO(api): replace with GET /analytics/orders-by-channel {dineIn,takeaway,delivery}x{count,revenue}.
const CHANNEL_DATA = [
  { key: 'dineIn',   label: 'Dine-in',  count: 20, revenue: '$520.00', color: '#026F4F', pct: (20 / 48) * 100 },
  { key: 'takeaway', label: 'Takeaway', count: 15, revenue: '$410.00', color: '#5B9BF5', pct: (15 / 48) * 100 },
  { key: 'delivery', label: 'Delivery', count: 13, revenue: '$320.00', color: '#F5A623', pct: (13 / 48) * 100 },
];

function OrdersByChannel() {
  const gradient = `conic-gradient(${CHANNEL_DATA.map((c, i) => {
    const start = CHANNEL_DATA.slice(0, i).reduce((s, x) => s + x.pct, 0);
    return `${c.color} ${start}% ${start + c.pct}%`;
  }).join(', ')})`;
  return (
    <div className="flex h-full flex-col rounded-xl bg-white p-4">
      <h3 className="text-lg font-semibold leading-none text-[#2D2F33]">Orders by Channel</h3>
      <p className="mt-1 text-[13px] text-[#989898]">Delivery / Takeaway / Dine-in — count and revenue each</p>
      <div className="mt-4 flex flex-1 flex-col items-center gap-5 sm:flex-row sm:gap-6">
        <div
          className="relative h-40 w-40 shrink-0 rounded-full"
          style={{ background: gradient }}
          role="img"
          aria-label="Orders by channel: Dine-in 20, Takeaway 15, Delivery 13"
        >
          <div className="absolute inset-[26px] flex flex-col items-center justify-center rounded-full bg-white">
            <span className="text-2xl font-semibold text-[#2D2F33]">48</span>
            <span className="text-xs text-[#989898]">Total Orders</span>
          </div>
        </div>
        <div className="flex w-full flex-1 flex-col gap-3">
          {CHANNEL_DATA.map((c) => (
            <div key={c.key} className="flex items-center justify-between gap-3 rounded-lg bg-[#F8F9FA] px-3 py-2.5">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="h-3.5 w-3.5 shrink-0 rounded-full" style={{ background: c.color }} />
                <span className="truncate text-sm font-medium text-[#2D2F33]">{c.label}</span>
                <span className="whitespace-nowrap text-xs text-[#989898]">{c.pct.toFixed(1)}%</span>
              </div>
              <div className="flex shrink-0 items-baseline gap-3">
                <span className="text-sm font-semibold text-[#2D2F33]">{c.count} orders</span>
                <span className="min-w-[72px] text-end text-sm font-semibold text-[#026F4F]">{c.revenue}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SelectPill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <button className={cn('flex items-center gap-1.5 rounded-[59px] border border-[#B9B9B9] bg-white px-4 py-2.5 text-[#686868]', className)}>
      <span className="text-[13px] sm:text-sm">{children}</span>
      <ChevronDown size={14} />
    </button>
  );
}

export function AnalyticsContent() {
  const t  = useTranslations('analytics');
  const tc = useTranslations('analytics.cards');
  const ta = useTranslations('common.actions');

  return (
    <main className="flex flex-col gap-5">
      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-[22px] font-medium leading-[30px] text-[#2D2F33] sm:text-[26px] sm:leading-[36px] xl:text-[30px] xl:leading-[40px]">
            {t('title')}
          </h1>
          <p className="text-[13px] text-[#989898] sm:text-[15px] xl:text-base">{t('subtitle')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <SelectPill>{t('branch')}</SelectPill>
          <SelectPill>{t('perMonth')}</SelectPill>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3 xl:gap-4">
        <StatCard
          label={tc('totalRevenue')}
          value={<span className="flex items-end gap-1">$<span>1,250</span></span>}
          sub={{ text: tc('fromYesterday', { value: '12.5%' }), positive: true }}
          icon={<DollarSign size={22} />}
        />
        <StatCard label={tc('totalOrders')} value="48" sub={tc('today')} icon={<Receipt size={22} />} action={{ label: ta('view'), href: '/orders' }} />
        <StatCard label={tc('activeOrders')} value="12" sub={tc('kitchenIsBusy')} icon={<Flame size={22} />} />
        <StatCard label={tc('activeTables')} value="8" sub={tc('outOfTables', { total: 20 })} icon={<Armchair size={22} />} />
        <StatCard
          label={tc('pendingPay')}
          value={<span className="flex items-end gap-1">$<span>250</span></span>}
          sub={tc('actionRequired')}
          icon={<CreditCard size={22} />}
        />
        <StatCard
          label={tc('tableTurnoverRate')}
          value="48" unit="min"
          sub={{ text: tc('fromYesterday', { value: '3min' }), positive: true }}
          icon={<Clock3 size={22} />}
        />
        <StatCard label={tc('orderFulfillmentRate')} value="18" unit="min" icon={<Timer size={22} />} />
        <StatCard
          label={tc('avgSpendPerTable')}
          value="$45.50"
          sub={{ text: tc('fromYesterday', { value: '5.2%' }), positive: true }}
          icon={<UserCheck size={22} />}
        />
        <StatCard
          label={tc('cancelledOrder')}
          value="32"
          sub={{ text: tc('fromYesterdayNeg', { value: '5.2%' }), positive: false }}
          icon={<XCircle size={22} />}
          action={{ label: ta('view'), href: '/orders' }}
        />
        <StatCard
          label={tc('tableUtilization')}
          value="40%"
          sub={{ text: tc('fromYesterday', { value: '5.2%' }), positive: true }}
          icon={<Table2 size={22} />}
        />
      </div>

      {/* Revenue + Orders */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="h-[280px] xl:h-[300px]"><RevenueOverTime /></div>
        <div className="h-[280px] xl:h-[300px]"><OrdersOverview /></div>
      </div>

      {/* Orders by channel breakdown (Bug-11) */}
      <div className="min-h-[260px]"><OrdersByChannel /></div>

      <BranchPerformance />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="min-h-[280px]">
          <ItemsTable title={t('topPerformingItems')} items={TOP_ITEMS} />
        </div>
        <div className="min-h-[280px]">
          <ItemsTable title={t('leastPerformingItems')} items={LEAST_ITEMS} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="h-[280px] xl:h-[300px]"><SalesPerHour /></div>
        <div className="h-[280px] xl:h-[300px]"><TipsCollection /></div>
      </div>

      <ShiftReportTable />
    </main>
  );
}
