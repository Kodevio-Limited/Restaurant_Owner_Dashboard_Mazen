import { ChevronDown } from 'lucide-react';
import {
  DollarSign,
  Receipt,
  Flame,
  Armchair,
  CreditCard,
  Clock3,
  Timer,
  UserCheck,
  XCircle,
  Table2,
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
  { id: 't1', name: 'Shoyu Ramen', qty: 145, revenue: '$15.99' },
  { id: 't2', name: 'Chicken Biryani', qty: 132, revenue: '$12.50' },
  { id: 't3', name: 'Beef Burger', qty: 118, revenue: '$11.20' },
];

const LEAST_ITEMS = [
  { id: 'l1', name: 'Mushroom Soup', qty: 23, revenue: '$6.99' },
  { id: 'l2', name: 'Greek Salad', qty: 18, revenue: '$8.40' },
  { id: 'l3', name: 'Iced Latte', qty: 11, revenue: '$4.80' },
];

function SelectPill({
  children,
  className,
  light,
}: {
  children: React.ReactNode;
  className?: string;
  light?: boolean;
}) {
  return (
    <button
      className={cn(
        'flex items-center gap-1.5 rounded-[59px] px-4 py-2.5 text-[#686868]',
        light
          ? 'border border-[#B9B9B9] bg-white'
          : 'border border-[#B9B9B9] bg-white',
        className,
      )}
    >
      <span className="text-[13px] sm:text-sm">{children}</span>
      <ChevronDown size={14} />
    </button>
  );
}

export default function AnalyticsPage() {
  return (
    <main className="flex flex-col gap-5">
      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-[22px] font-medium leading-[30px] text-[#2D2F33] sm:text-[26px] sm:leading-[36px] xl:text-[30px] xl:leading-[40px]">
            Reports &amp; Analytics
          </h1>
          <p className="text-[13px] text-[#989898] sm:text-[15px] xl:text-base">
            Track sales, performance, and insights across your business
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <SelectPill>Dhanmondi (This Branch)</SelectPill>
          <SelectPill>Per Month</SelectPill>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3 xl:gap-4">
        <StatCard
          label="Total Revenue"
          value={<span className="flex items-end gap-1">$<span>1,250</span></span>}
          sub={{ text: '12.5% from yesterday', positive: true }}
          icon={<DollarSign size={22} />}
        />
        <StatCard label="Total Orders" value="48" sub="Today" icon={<Receipt size={22} />} />
        <StatCard label="Active Orders" value="12" sub="Kitchen is busy" icon={<Flame size={22} />} />
        <StatCard label="Active Tables" value="8" sub="Out of 20 tables" icon={<Armchair size={22} />} />
        <StatCard
          label="Pending Pay"
          value={<span className="flex items-end gap-1">$<span>250</span></span>}
          sub="Action Required"
          icon={<CreditCard size={22} />}
        />
        <StatCard
          label="Table Turnover Rate"
          value="48"
          unit="min"
          sub={{ text: '3min from yesterday', positive: true }}
          icon={<Clock3 size={22} />}
        />
        <StatCard label="Order Fulfillment Rate" value="18" unit="min" icon={<Timer size={22} />} />
        <StatCard
          label="Avg Spend per Table"
          value="$45.50"
          sub={{ text: '5.2% from yesterday', positive: true }}
          icon={<UserCheck size={22} />}
        />
        <StatCard
          label="Cancelled Order"
          value="32"
          sub={{ text: '5.2% from yesterday', positive: false }}
          icon={<XCircle size={22} />}
        />
        <StatCard
          label="Table Utilization"
          value="40%"
          sub={{ text: '5.2% from yesterday', positive: true }}
          icon={<Table2 size={22} />}
        />
      </div>

      {/* Revenue + Orders */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="h-[280px] xl:h-[300px]">
          <RevenueOverTime />
        </div>
        <div className="h-[280px] xl:h-[300px]">
          <OrdersOverview />
        </div>
      </div>

      {/* Branch performance */}
      <BranchPerformance />

      {/* Top & Least performing */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="min-h-[280px]">
          <ItemsTable title="Top Performing Items" items={TOP_ITEMS} />
        </div>
        <div className="min-h-[280px]">
          <ItemsTable title="Least Performing Items" items={LEAST_ITEMS} />
        </div>
      </div>

      {/* Sales per hour + tips */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="h-[280px] xl:h-[300px]">
          <SalesPerHour />
        </div>
        <div className="h-[280px] xl:h-[300px]">
          <TipsCollection />
        </div>
      </div>

      {/* Shift reports */}
      <ShiftReportTable />
    </main>
  );
}