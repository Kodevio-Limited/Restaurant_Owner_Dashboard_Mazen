'use client';

import { useState } from 'react';
import { OrderCard, Order, OrderState } from '@/components/shared/OrderCard';
import { OrderDetailsModal } from '@/components/shared/OrderDetailsDrawer';
import { cn } from '@/lib/utils';

const ORDERS: Order[] = [
  {
    id: '1',
    customer: 'Mike Thompson',
    phone: '+01 284 980',
    email: 'mike.t@example.com',
    orderNo: '#0044',
    status: 'paid',
    state: 'in_progress',
    time: '7 Apr, 11:30 AM',
    table: 'Table 03',
    extraItems: 2,
    total: '$45.99',
    items: [
      {
        id: 'a',
        name: 'Shoyu Ramen',
        modifiers: ['Mayo', 'Extra Chili'],
        note: 'Cut in Half',
        price: '$15.99',
        qty: 1,
      },
      {
        id: 'b',
        name: 'Iced Green Tea',
        modifiers: ['Mayo'],
        note: 'Cut in Half',
        price: '$15.99',
        qty: 1,
      },
    ],
  },
  {
    id: '2',
    customer: 'Jenny Wilson',
    orderNo: '#043',
    status: 'unpaid',
    state: 'unpaid',
    time: '7 Apr, 11:12 AM',
    table: 'Table 07',
    extraItems: 1,
    total: '$24.50',
    items: [
      { id: 'c', name: 'Beef Burger', note: 'Extra Cheese', price: '$11.20', qty: 2 },
      { id: 'd', name: 'Fries', note: '', price: '$4.50', qty: 1 },
    ],
  },
  {
    id: '3',
    customer: 'Guy Hawkins',
    orderNo: '#042',
    status: 'paid',
    state: 'paid',
    time: '7 Apr, 10:48 AM',
    table: 'Table 11',
    extraItems: 3,
    total: '$41.80',
    items: [
      { id: 'e', name: 'Chicken Biryani', note: 'Mild', price: '$12.50', qty: 2 },
      { id: 'f', name: 'Mango Lassi', note: '', price: '$6.20', qty: 1 },
    ],
  },
  {
    id: '4',
    customer: 'Esther Howard',
    orderNo: '#041',
    status: 'paid',
    state: 'paid',
    time: '7 Apr, 10:15 AM',
    table: 'Table 02',
    extraItems: 2,
    total: '$28.40',
    items: [
      { id: 'g', name: 'Pasta Alfredo', note: 'No Garlic', price: '$13.40', qty: 1 },
      { id: 'h', name: 'Garlic Bread', note: '', price: '$5.00', qty: 1 },
    ],
  },
  {
    id: '5',
    customer: 'Brooklyn Simmons',
    orderNo: '#040',
    status: 'unpaid',
    state: 'active',
    time: '7 Apr, 09:52 AM',
    table: 'Table 05',
    extraItems: 1,
    total: '$19.75',
    items: [
      { id: 'i', name: 'Greek Salad', note: 'No Onion', price: '$8.40', qty: 1 },
      { id: 'j', name: 'Lemonade', note: '', price: '$4.30', qty: 1 },
    ],
  },
  {
    id: '6',
    customer: 'Cameron Will',
    orderNo: '#039',
    status: 'paid',
    state: 'completed',
    time: '7 Apr, 09:20 AM',
    table: 'Table 14',
    extraItems: 2,
    total: '$35.20',
    items: [
      { id: 'k', name: 'Beef Steak', note: 'Medium', price: '$18.90', qty: 1 },
      { id: 'l', name: 'Mushroom Soup', note: '', price: '$6.99', qty: 1 },
    ],
  },
];

const FILTERS: { id: OrderState | 'all'; label: string; match: (o: Order) => boolean }[] = [
  { id: 'all', label: 'All', match: () => true },
  { id: 'active', label: 'Active', match: (o) => o.state === 'active' },
  { id: 'in_progress', label: 'In Progress', match: (o) => o.state === 'in_progress' },
  { id: 'paid', label: 'Paid', match: (o) => o.state === 'paid' },
  { id: 'unpaid', label: 'Unpaid', match: (o) => o.state === 'unpaid' },
  { id: 'completed', label: 'Completed', match: (o) => o.state === 'completed' },
];

export default function OrdersPage() {
  const [active, setActive] = useState<(typeof FILTERS)[number]['id']>('in_progress');
  const [selected, setSelected] = useState<Order | null>(null);
  const [modalAction, setModalAction] = useState<string>('');

  const activeFilter = FILTERS.find((f) => f.id === active)!;
  const filtered = ORDERS.filter((o) => activeFilter.match(o));

  const handleOpenModal = (order: Order, action: string) => {
    setSelected(order);
    setModalAction(action);
  };

  return (
    <main className="flex flex-col gap-5">
      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-[22px] font-medium leading-[30px] text-[#2D2F33] sm:text-[26px] sm:leading-[36px] xl:text-[30px] xl:leading-[40px]">
            Orders
          </h1>
          <p className="text-[13px] text-[#989898] sm:text-[15px] xl:text-base">
            Track and manage all dine-in, takeaway, and delivery orders
          </p>
        </div>
      </div>

      {/* Status filter bar */}
      <div className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {FILTERS.map((f) => {
          const count = ORDERS.filter(f.match).length;
          const isActive = f.id === active;
          return (
            <button
              key={f.id}
              onClick={() => setActive(f.id)}
              aria-pressed={isActive}
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-[33px] border bg-white py-1.5 pl-3.5 pr-1.5 transition-colors',
                isActive ? 'border-[#026F4F] shadow-sm' : 'border-[#E9E9E9] hover:border-[#B9B9B9]',
              )}
            >
              <span
                className={cn(
                  'whitespace-nowrap text-[13px] leading-[20px] sm:text-[15px]',
                  isActive ? 'font-medium text-[#2D2F33]' : 'text-[#686868]',
                )}
              >
                {f.label}
              </span>
              <span
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full text-[11.5px] font-medium leading-none',
                  isActive ? 'bg-[#026F4F] text-white' : 'bg-[#E6F1ED] text-[#026F4F]',
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Order cards */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((order) => (
            <div
              key={order.id}
              className="w-full max-w-[417px] rounded-2xl transition-transform hover:-translate-y-0.5"
            >
              <OrderCard order={order} onOpenModal={handleOpenModal} />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl bg-white py-16 text-center text-[17px] text-[#989898]">
          No orders found for this status.
        </div>
      )}

      <OrderDetailsModal open={!!selected} order={selected} action={modalAction} onClose={() => { setSelected(null); setModalAction(''); }} />
    </main>
  );
}