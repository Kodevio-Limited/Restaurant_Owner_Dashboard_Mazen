'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Plus } from 'lucide-react';
import { MenuItemCard } from '@/components/shared/MenuItemCard';
import { AddCategoryModal } from '@/components/shared/AddCategoryModal';
import { AddItemModal } from '@/components/shared/AddItemModal';
import { cn } from '@/lib/utils';
import { useQueryModal } from '@/lib/use-query-modal';
import Image from 'next/image';
import { MENU_ITEMS } from '@/data/menu';

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
  const [showCategory, setShowCategory] = useQueryModal('add-category');
  const [showItem, setShowItem] = useQueryModal('add-item');

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
      <div className="grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {filteredItems.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>

      <AddCategoryModal open={showCategory} onClose={() => setShowCategory(false)} />
      <AddItemModal open={showItem} onClose={() => setShowItem(false)} />
    </main>
  );
}