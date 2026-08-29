'use client';

import { useState } from 'react';
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
    category: 'BURGERS',
    price: '$15.99',
    description: 'Crispy shoestring fries tossed in truffle oil and parmesan.',
    available: true,
  },
  {
    id: '2',
    name: 'Shoyu Ramen',
    category: 'RAMEN',
    price: '$15.99',
    description: 'Rich tonkotsu broth with chashu, soft egg, and nori.',
    available: true,
  },
  {
    id: '3',
    name: 'Iced Green Tea',
    category: 'DRINKS',
    price: '$4.80',
    description: 'Freshly brewed Japanese green tea served over ice.',
    available: false,
  },
  {
    id: '4',
    name: 'Truffle Fries',
    category: 'SIDES',
    price: '$6.99',
    description: 'Crispy shoestring fries tossed in truffle oil and parmesan.',
    available: true,
  },
  {
    id: '5',
    name: 'Chicken Biryani',
    category: 'RICE',
    price: '$12.50',
    description: 'Fragrant basmati layered with spiced chicken and caramelized onions.',
    available: true,
  },
  {
    id: '6',
    name: 'Mango Lassi',
    category: 'DRINKS',
    price: '$4.30',
    description: 'Creamy yogurt drink blended with ripe mango and cardamom.',
    available: true,
  },
];

const CATEGORIES = [
  { label: 'All', icon: true },
  { label: 'Ramen', icon: true },
  { label: 'Sides', icon: true },
  { label: 'Drinks', icon: true },
];

export default function MenuPage() {
  const [active, setActive] = useState('All');
  const [showCategory, setShowCategory] = useState(false);
  const [showItem, setShowItem] = useState(false);

  return (
    <main className="flex flex-col gap-7">
      {/* Header row */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex max-w-[774px] flex-col gap-7">
          <div className="flex flex-col gap-1">
            <h1 className="text-[26px] font-medium leading-[36px] text-[#2D2F33] sm:text-[32px] sm:leading-[46px] xl:text-[40px] xl:leading-[56px]">
              Menu Management
            </h1>
            <p className="text-[15px] text-[#989898] sm:text-[19px] xl:text-[24px] xl:leading-8">
              Manage your menu items, categories, and customizations
            </p>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap items-center gap-5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setActive(cat.label)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-[51.28px] px-3.5 py-2 transition-colors',
                  active === cat.label
                    ? 'bg-[#026F4F] text-white'
                    : 'bg-white text-[#686868] hover:bg-[#F2F2F2]',
                )}
              >
                <span className="flex h-9 w-9 items-center justify-center">
                  <Image src="/images/food-41e5d7.png" alt="" width={35} height={34} className="rounded-full object-cover" />
                </span>
                <span className="whitespace-nowrap text-xl font-normal leading-7">{cat.label}</span>
              </button>
            ))}
            {/* Add Category */}
            <button
              onClick={() => setShowCategory(true)}
              className="inline-flex h-12 items-center gap-2 rounded-[51.28px] bg-white px-3.5 py-2 outline outline-2 outline-offset-[-2px] outline-[#686868] transition-colors hover:bg-[#F2F2F2]"
            >
              <span className="flex h-7 w-7 items-center justify-center">
                <Plus size={16} className="text-[#686868]" />
              </span>
              <span className="whitespace-nowrap text-xl font-normal leading-7 text-[#686868]">Add Category</span>
            </button>
          </div>
        </div>

        {/* Add Item */}
        <button
          onClick={() => setShowItem(true)}
          className="flex h-14 items-center gap-3 rounded-[128px] bg-[#026F4F] px-8 text-white transition-colors hover:bg-[#015c42]"
        >
          <span className="flex h-7 w-7 items-center justify-center">
            <Plus size={16} className="text-white" />
          </span>
          <span className="whitespace-nowrap font-satoshi text-2xl font-medium leading-8">Add Item</span>
        </button>
      </div>

      {/* Menu grid */}
      <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {MENU_ITEMS.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>

      <AddCategoryModal open={showCategory} onClose={() => setShowCategory(false)} />
      <AddItemModal open={showItem} onClose={() => setShowItem(false)} />
    </main>
  );
}