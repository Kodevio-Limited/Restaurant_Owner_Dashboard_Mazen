import Image from 'next/image';
import { CalendarDays, Table as TableIcon, Check, X } from 'lucide-react';

export interface OrderItem {
  id: string;
  name: string;
  note?: string;
  modifiers?: string[];
  price: string;
  qty: number;
}

export type OrderState = 'active' | 'in_progress' | 'paid' | 'unpaid' | 'completed';

export interface Order {
  id: string;
  customer: string;
  phone?: string;
  email?: string;
  orderNo: string;
  status: 'paid' | 'unpaid';
  state: OrderState;
  time: string;
  table: string;
  items: OrderItem[];
  extraItems: number;
  total: string;
}

export function OrderCard({ order }: { order: Order }) {
  const paid = order.status === 'paid';

  return (
    <div className="flex w-full max-w-[417px] flex-col justify-between gap-6 rounded-[19px] bg-white p-[23px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="whitespace-nowrap text-[27px] font-medium leading-[38px] text-black">{order.customer}</span>
          <span
            className={
              paid
                ? 'inline-flex items-center gap-2 rounded-full bg-[#16C722] px-2 py-1 text-[13px] leading-[18px] text-white'
                : 'inline-flex items-center gap-2 rounded-full bg-[#E9E9E9] px-2 py-1 text-[13px] leading-[18px] text-[#686868]'
            }
          >
            <span className="flex h-5 w-5 items-center justify-center">
              {paid ? <Check size={16} className="text-white" strokeWidth={3} /> : <X size={14} className="text-[#686868]" />}
            </span>
            {paid ? 'Paid' : 'Unpaid'}
          </span>
        </div>
        <span className="whitespace-nowrap text-[18.5px] leading-[26px] text-[#989898]">{order.orderNo}</span>
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-[13px]">
        <div className="flex items-center gap-2.5">
          <CalendarDays size={25} strokeWidth={1.6} className="text-[#989898]" />
          <span className="text-[18.5px] leading-[26px] text-[#989898]">{order.time}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <TableIcon size={25} strokeWidth={1.6} className="text-[#989898]" />
          <span className="text-[18.5px] leading-[26px] text-[#989898]">{order.table}</span>
        </div>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-7">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-5">
              <div className="relative h-[84px] w-[76px] shrink-0 overflow-hidden rounded-[7px] bg-[#F2F2F2]">
                <Image
                  src="/images/food-41e5d7.png"
                  alt={item.name}
                  fill
                  sizes="76px"
                  className="object-cover"
                />
              </div>
              <div className="flex max-w-[150px] flex-col gap-1">
                <span className="truncate text-[18.5px] font-medium leading-[26px] text-[#2D2F33]">{item.name}</span>
                {item.note && (
                  <span className="text-[12.7px] leading-[18px] text-[#989898]">&ldquo;{item.note}&rdquo;</span>
                )}
                <span className="text-[17.5px] font-semibold leading-[25px] text-[#026F4F]">{item.price}</span>
              </div>
            </div>
            <span className="whitespace-nowrap text-[12.7px] font-medium leading-[18px] text-[#686868]">
              Qty: {item.qty}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-4 border-t border-[#F2F2F2] pt-4">
        <div className="flex flex-col">
          <span className="text-[13.6px] leading-[19px] text-[#686868]">
            {order.extraItems > 0 ? `+${order.extraItems} Items` : '\u00A0'}
          </span>
          <span className="text-[19.5px] font-semibold leading-[27px] text-[#026F4F]">{order.total}</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Complete */}
          <button className="flex h-[48px] shrink-0 items-center justify-center rounded-[62px] bg-[#16A34A] px-6 text-[19px] font-medium leading-[27px] text-white transition-colors hover:bg-[#128a3e]">
            Complete
          </button>
          {/* Cancel */}
          <button
            aria-label="Cancel order"
            className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full bg-[#E85E5E] text-white transition-colors hover:bg-[#d94a4a] lg:h-[58px] lg:w-[58px]"
          >
            <X size={26} strokeWidth={2.2} />
          </button>
          {/* Accept */}
          <button
            aria-label="Accept order"
            className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full bg-[#64C864] text-white transition-colors hover:bg-[#4fb84f] lg:h-[58px] lg:w-[58px]"
          >
            <Check size={26} strokeWidth={2.6} />
          </button>
        </div>
      </div>
    </div>
  );
}