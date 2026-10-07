'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { OrderCard, Order, OrderState, OrderFlowStep } from '@/components/shared/OrderCard';
import { OrderDetailsModal } from '@/components/shared/OrderDetailsDrawer';
import { cn } from '@/lib/utils';

const ORDERS: Order[] = [
  {
    id: '1',
    customer: 'Mike Thompson',
    customer_ar: 'مايك طومسون',
    phone: '+01 284 980',
    email: 'mike.t@example.com',
    orderNo: '#0044',
    status: 'paid',
    state: 'in_progress',
    time: '7 Apr, 11:30 AM',
    time_ar: '7 أبريل، 11:30 ص',
    table: 'Table 03',
    table_ar: 'طاولة 03',
    extraItems: 2,
    total: '$45.99',
    items: [
      {
        id: 'a',
        name: 'Shoyu Ramen',
        name_ar: 'شويو رامين',
        modifiers: ['Mayo', 'Extra Chili'],
        modifiers_ar: ['مايونيز', 'فلفل إضافي'],
        note: 'Cut in Half',
        note_ar: 'مقطوع إلى نصفين',
        price: '$15.99',
        qty: 1,
      },
      {
        id: 'b',
        name: 'Iced Green Tea',
        name_ar: 'شاي أخضر مثلج',
        modifiers: ['Mayo'],
        modifiers_ar: ['مايونيز'],
        note: 'Cut in Half',
        note_ar: 'مقطوع إلى نصفين',
        price: '$15.99',
        qty: 1,
      },
    ],
  },
  {
    id: '2',
    customer: 'Jenny Wilson',
    customer_ar: 'جيني ويلسون',
    orderNo: '#043',
    status: 'unpaid',
    state: 'pending',
    time: '7 Apr, 11:12 AM',
    time_ar: '7 أبريل، 11:12 ص',
    table: 'Table 07',
    table_ar: 'طاولة 07',
    extraItems: 1,
    total: '$24.50',
    items: [
      { id: 'c', name: 'Beef Burger', name_ar: 'برجر لحم بقري', note: 'Extra Cheese', note_ar: 'جبن إضافي', price: '$11.20', qty: 2 },
      { id: 'd', name: 'Fries', name_ar: 'بطاطس مقلية', note: '', price: '$4.50', qty: 1 },
    ],
  },
  {
    id: '7',
    customer: 'Kristin Watson',
    customer_ar: 'كريستين واتسون',
    orderNo: '#045',
    status: 'unpaid',
    state: 'preparing',
    time: '7 Apr, 11:45 AM',
    time_ar: '7 أبريل، 11:45 ص',
    table: 'Table 09',
    table_ar: 'طاولة 09',
    extraItems: 1,
    total: '$32.40',
    items: [
      { id: 'm', name: 'Shoyu Ramen', name_ar: 'شويو رامين', note: 'Extra Spicy', note_ar: 'حار جداً', price: '$15.99', qty: 1 },
      { id: 'n', name: 'Gyoza', name_ar: 'غيوزا', note: '', price: '$6.50', qty: 2 },
    ],
  },
  {
    id: '3',
    customer: 'Guy Hawkins',
    customer_ar: 'جاي هوكينز',
    orderNo: '#042',
    status: 'paid',
    state: 'ready',
    time: '7 Apr, 10:48 AM',
    time_ar: '7 أبريل، 10:48 ص',
    table: 'Table 11',
    table_ar: 'طاولة 11',
    extraItems: 3,
    total: '$41.80',
    items: [
      { id: 'e', name: 'Chicken Biryani', name_ar: 'برياني دجاج', note: 'Mild', note_ar: 'معتدل', price: '$12.50', qty: 2 },
      { id: 'f', name: 'Mango Lassi', name_ar: 'مانجو لاسي', note: '', price: '$6.20', qty: 1 },
    ],
  },
  {
    id: '4',
    customer: 'Esther Howard',
    customer_ar: 'إستر هوارد',
    orderNo: '#041',
    status: 'paid',
    state: 'completed',
    time: '7 Apr, 10:15 AM',
    time_ar: '7 أبريل، 10:15 ص',
    table: 'Table 02',
    table_ar: 'طاولة 02',
    extraItems: 2,
    total: '$28.40',
    items: [
      { id: 'g', name: 'Pasta Alfredo', name_ar: 'باستا ألفريدو', note: 'No Garlic', note_ar: 'بدون ثوم', price: '$13.40', qty: 1 },
      { id: 'h', name: 'Garlic Bread', name_ar: 'خبز بالثوم', note: '', price: '$5.00', qty: 1 },
    ],
  },
  {
    id: '5',
    customer: 'Brooklyn Simmons',
    customer_ar: 'بروكلين سيمونز',
    orderNo: '#040',
    status: 'unpaid',
    state: 'canceled',
    time: '7 Apr, 09:52 AM',
    time_ar: '7 أبريل، 09:52 ص',
    table: 'Table 05',
    table_ar: 'طاولة 05',
    extraItems: 1,
    total: '$19.75',
    items: [
      { id: 'i', name: 'Greek Salad', name_ar: 'سلطة يونانية', note: 'No Onion', note_ar: 'بدون بصل', price: '$8.40', qty: 1 },
      { id: 'j', name: 'Lemonade', name_ar: 'عصير ليمون', note: '', price: '$4.30', qty: 1 },
    ],
  },
  {
    id: '6',
    customer: 'Cameron Will',
    customer_ar: 'كاميرون ويل',
    orderNo: '#039',
    status: 'paid',
    state: 'refunded',
    time: '7 Apr, 09:20 AM',
    time_ar: '7 أبريل، 09:20 ص',
    table: 'Table 14',
    table_ar: 'طاولة 14',
    extraItems: 2,
    total: '$35.20',
    items: [
      { id: 'k', name: 'Beef Steak', name_ar: 'ستيك لحم بقري', note: 'Medium', note_ar: 'متوسط النضج', price: '$18.90', qty: 1 },
      { id: 'l', name: 'Mushroom Soup', name_ar: 'شوربة فطر', note: '', price: '$6.99', qty: 1 },
    ],
  },
];

const FILTER_IDS = ['all', 'pending', 'preparing', 'ready', 'completed', 'canceled', 'refunded'] as const;
type FilterId = typeof FILTER_IDS[number];

const FILTER_MATCH: Record<FilterId, (o: Order) => boolean> = {
  all:       () => true,
  pending:   (o) => o.state === 'pending',
  preparing: (o) => o.state === 'preparing',
  ready:     (o) => o.state === 'ready',
  completed: (o) => o.state === 'completed',
  canceled:  (o) => o.state === 'canceled',
  refunded:  (o) => o.state === 'refunded',
};

export default function OrdersPage() {
  const t = useTranslations('orders');
  const [active, setActive] = useState<FilterId>('all');
  const [selected, setSelected] = useState<Order | null>(null);
  const [steps, setSteps] = useState<Record<string, OrderFlowStep>>({});
  const [paidMap, setPaidMap] = useState<Record<string, boolean>>({});

  const filtered = ORDERS.filter((o) => FILTER_MATCH[active](o));

  const getStep = (id: string): OrderFlowStep => steps[id] ?? 'new';
  const setStep = (id: string, step: OrderFlowStep) =>
    setSteps((prev) => ({ ...prev, [id]: step }));
  const isPaid = (o: Order) => paidMap[o.id] ?? o.status === 'paid';

  return (
    <main className="flex flex-col gap-5">
      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-[28px] font-medium leading-[38px] text-[#2D2F33] sm:text-[34px] sm:leading-[44px] xl:text-[40px] xl:leading-[56px]">
            {t('title')}
          </h1>
          <p className="text-[15px] leading-[21px] text-[#989898] sm:text-[18px] xl:text-[23px] xl:leading-[32px]">{t('subtitle')}</p>
        </div>
      </div>

      {/* Status filter bar */}
      <div className="-mx-3 flex gap-3 overflow-x-auto px-3 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 lg:gap-4">
        {FILTER_IDS.map((id) => {
          const match = FILTER_MATCH[id];
          const count = ORDERS.filter(match).length;
          const isActive = id === active;
          return (
            <button
              key={id}
              onClick={() => setActive(id)}
              aria-pressed={isActive}
              className={cn(
                'flex h-[44px] shrink-0 items-center gap-2.5 rounded-[33px] ps-[18px] pe-[6px] transition-colors xl:h-[50px]',
                isActive ? 'bg-[#026F4F]' : 'bg-white hover:bg-[#F7F7F7]',
              )}
            >
              <span className={cn('whitespace-nowrap text-[15px] leading-none sm:text-[17px] xl:text-[24px]', isActive ? 'text-white' : 'text-[#686868]')}>
                {t(`filters.${id}`)}
              </span>
              <span
                className={cn(
                  'flex size-8 items-center justify-center rounded-full text-[13px] font-medium leading-none xl:size-[40px] xl:text-[13.5px]',
                  isActive ? 'bg-white text-black' : 'bg-[#E6F1ED] text-[#026F4F]',
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
        <div className="grid grid-cols-1 items-stretch justify-items-center gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((order) => (
            <div key={order.id} className="h-full w-full max-w-[417px] rounded-2xl transition-transform hover:-translate-y-0.5">
              <OrderCard
                order={{ ...order, status: isPaid(order) ? 'paid' : 'unpaid' }}
                step={getStep(order.id)}
                onStepChange={(s) => setStep(order.id, s)}
                onOpen={setSelected}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl bg-white py-16 text-center text-[17px] text-[#989898]">
          {t('noOrdersForStatus')}
        </div>
      )}

      <OrderDetailsModal
        open={!!selected}
        order={selected}
        step={selected ? getStep(selected.id) : 'new'}
        paid={selected ? isPaid(selected) : false}
        onStepChange={(s) => selected && setStep(selected.id, s)}
        onMarkPaid={() => selected && setPaidMap((prev) => ({ ...prev, [selected.id]: true }))}
        onClose={() => setSelected(null)}
      />
    </main>
  );
}