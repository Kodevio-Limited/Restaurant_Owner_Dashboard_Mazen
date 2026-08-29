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
        'flex items-center gap-1.5 rounded-[59px] px-5 py-[13px] text-[#686868]',
        light
          ? 'border border-[#B9B9B9] bg-white'
          : 'border border-[#B9B9B9] bg-white',
        className,
      )}
    >
      <span className="text-[15px]">{children}</span>
      <ChevronDown size={14} />
    </button>
  );
}

export default function AnalyticsPage() {
  return (
    <main className="flex flex-col gap-7">
      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-[26px] font-medium leading-[36px] text-[#2D2F33] sm:text-[32px] sm:leading-[46px] xl:text-[40px] xl:leading-[56px]">
            Reports &amp; Analytics
          </h1>
          <p className="text-[15px] text-[#989898] sm:text-[19px] xl:text-[23px]">
            Track sales, performance, and insights across your business
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SelectPill>Dhanmondi (This Branch)</SelectPill>
          <SelectPill>Per Month</SelectPill>
        </div>
      </div>

      {/* Stat cards */}
      <div className="flex flex-col gap-6 xl:gap-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
      </div>

      {/* Revenue + Orders */}
      <div className="grid grid-cols-1 gap-10 xl:grid-cols-2 xl:gap-7">
        <div className="h-[378px]">
          <RevenueOverTime />
        </div>
        <div className="h-[378px]">
          <OrdersOverview />
        </div>
      </div>

      {/* Branch performance */}
      <BranchPerformance />

      {/* Top & Least performing */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 xl:gap-[25px]">
        <div className="min-h-[369px] xl:h-[369px]">
          <ItemsTable title="Top Performing Items" items={TOP_ITEMS} />
        </div>
        <div className="min-h-[369px] xl:h-[369px]">
          <ItemsTable title="Least Performing Items" items={LEAST_ITEMS} />
        </div>
      </div>

      {/* Sales per hour + tips */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 xl:gap-[28px]">
        <div className="h-[369px]">
          <SalesPerHour />
        </div>
        <div className="h-[369px]">
          <TipsCollection />
        </div>
      </div>

      {/* Shift reports */}
      <ShiftReportTable />
    </main>
  );
}