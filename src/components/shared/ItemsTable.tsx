import Image from 'next/image';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MenuItem {
  id: string;
  name: string;
  qty: number;
  revenue: string;
}

interface ItemsTableProps {
  title: string;
  className?: string;
  items: MenuItem[];
}

export function ItemsTable({ title, className, items }: ItemsTableProps) {
  return (
    <div className={cn('flex h-full flex-col rounded-xl bg-white px-4 pb-4 pt-4', className)}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="whitespace-nowrap text-lg font-semibold text-[#2D2F33]">{title}</h3>
        <button className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-[#026F4F]">
          View Full List
          <ArrowUp size={16} />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between bg-[#E9E9E9] px-1 py-2">
        <span className="pl-1 text-[11px] font-medium text-[#686868]">ITEM NAME</span>
        <span className="pr-1 text-[11px] font-medium text-[#686868]">QTY SOLD</span>
        <span className="pr-1 text-[11px] font-medium text-[#686868]">REVENUE</span>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md bg-[#F2F2F2]">
                <Image src="/images/food-41e5d7.png" alt={item.name} fill sizes="36px" className="object-cover" />
              </div>
              <span className="whitespace-nowrap text-[13px] font-medium text-[#2D2F33]">{item.name}</span>
            </div>
            <div className="flex items-baseline gap-3 pl-3 sm:gap-8 sm:pl-4">
              <span className="whitespace-nowrap text-[13px] font-medium text-[#000000]">{item.qty}</span>
              <span className="min-w-[68px] whitespace-nowrap text-right text-[15px] font-semibold text-[#026F4F]">
                {item.revenue}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}