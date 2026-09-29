'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Plus } from 'lucide-react';
import { MenuItemCard, MenuItem } from '@/components/shared/MenuItemCard';
import { AddCategoryModal } from '@/components/shared/AddCategoryModal';
import { AddItemModal } from '@/components/shared/AddItemModal';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Classic Burger',
    name_ar: 'برجر كلاسيك',
    category: 'BURGERS',
    category_ar: 'برجر',
    price: '$15.99',
    description: 'Crispy shoestring fries tossed in truffle oil and parmesan.',
    description_ar: 'بطاطس مقرمشة ممزوجة بزيت الكمأة وجبن بارميزان.',
    available: true,
  },
  {
    id: '2',
    name: 'Shoyu Ramen',
    name_ar: 'شويو رامين',
    category: 'RAMEN',
    category_ar: 'رامين',
    price: '$15.99',
    description: 'Rich tonkotsu broth with chashu, soft egg, and nori.',
    description_ar: 'مرق تونكوتسو غني مع لحم تشاشو، بيض طري، ونوري.',
    available: true,
  },
  {
    id: '3',
    name: 'Iced Green Tea',
    name_ar: 'شاي أخضر مثلج',
    category: 'DRINKS',
    category_ar: 'مشروبات',
    price: '$4.80',
    description: 'Freshly brewed Japanese green tea served over ice.',
    description_ar: 'شاي أخضر ياباني طازج يُقدم مع الثلج.',
    available: false,
  },
  {
    id: '4',
    name: 'Truffle Fries',
    name_ar: 'بطاطس الكمأة',
    category: 'SIDES',
    category_ar: 'أطباق جانبية',
    price: '$6.99',
    description: 'Crispy shoestring fries tossed in truffle oil and parmesan.',
    description_ar: 'بطاطس مقرمشة ممزوجة بزيت الكمأة وجبن بارميزان.',
    available: true,
  },
  {
    id: '5',
    name: 'Chicken Biryani',
    name_ar: 'برياني دجاج',
    category: 'RICE',
    category_ar: 'أرز',
    price: '$12.50',
    description: 'Fragrant basmati layered with spiced chicken and caramelized onions.',
    description_ar: 'أرز بسمتي عطري مع طبقات دجاج متبل وبصل مكرمل.',
    available: true,
  },
  {
    id: '6',
    name: 'Mango Lassi',
    name_ar: 'مانجو لاسي',
    category: 'DRINKS',
    category_ar: 'مشروبات',
    price: '$4.30',
    description: 'Creamy yogurt drink blended with ripe mango and cardamom.',
    description_ar: 'مشروب زبادي كريمي ممزوج بالمانجو الناضج والهيل.',
    available: true,
  },
];

const CATEGORIES = [
  { id: 'All', label: 'All', label_ar: 'الكل', icon: true },
  { id: 'Ramen', label: 'Ramen', label_ar: 'رامين', icon: true },
  { id: 'Sides', label: 'Sides', label_ar: 'أطباق جانبية', icon: true },
  { id: 'Drinks', label: 'Drinks', label_ar: 'مشروبات', icon: true },
];

export default function MenuPage() {
  const t = useTranslations('menu');
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [active, setActive] = useState('All');
  const [showCategory, setShowCategory] = useState(false);
  const [showItem, setShowItem] = useState(false);

  const filteredItems = active === 'All'
    ? MENU_ITEMS
    : MENU_ITEMS.filter((item) => item.category.toLowerCase() === active.toLowerCase());

  return (
    <main className="flex flex-col gap-5">
      {/* Header row */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex max-w-[774px] flex-col gap-4">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-[22px] font-medium leading-[30px] text-[#2D2F33] sm:text-[26px] sm:leading-[36px] xl:text-[30px] xl:leading-[40px]">
              {t('title')}
            </h1>
            <p className="text-[13px] text-[#989898] sm:text-[15px] xl:text-base">{t('subtitle')}</p>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap items-center gap-2.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-[51.28px] py-1.5 ps-1.5 pe-3.5 transition-colors',
                  active === cat.id
                    ? 'bg-[#026F4F] text-white'
                    : 'bg-white text-[#686868] hover:bg-[#F2F2F2]',
                )}
              >
                <span className="flex h-7 w-7 items-center justify-center">
                  <Image src="/images/food-41e5d7.png" alt="" width={28} height={28} className="rounded-full object-cover" />
                </span>
                <span className="whitespace-nowrap text-sm font-normal leading-5">
                  {isAr ? cat.label_ar : cat.label}
                </span>
              </button>
            ))}
            {/* Add Category */}
            <button
              onClick={() => setShowCategory(true)}
              className="inline-flex h-10 items-center gap-2 rounded-[51.28px] bg-white px-3.5 outline outline-1 outline-offset-[-1px] outline-[#686868] transition-colors hover:bg-[#F2F2F2]"
            >
              <span className="flex h-6 w-6 items-center justify-center">
                <Plus size={14} className="text-[#686868]" />
              </span>
              <span className="whitespace-nowrap text-sm font-normal leading-5 text-[#686868]">{t('addCategory')}</span>
            </button>
          </div>
        </div>

        {/* Add Item */}
        <button
          onClick={() => setShowItem(true)}
          className="flex h-10 items-center gap-2 rounded-[128px] bg-[#026F4F] px-5 text-white transition-colors hover:bg-[#015c42] sm:h-11"
        >
          <span className="flex h-5 w-5 items-center justify-center">
            <Plus size={14} className="text-white" />
          </span>
          <span className="whitespace-nowrap font-satoshi text-[15px] font-medium">{t('addItem')}</span>
        </button>
      </div>

      {/* Menu grid */}
      <div className="grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
        {filteredItems.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>

      <AddCategoryModal open={showCategory} onClose={() => setShowCategory(false)} />
      <AddItemModal open={showItem} onClose={() => setShowItem(false)} />
    </main>
  );
}