'use client';

import { useState } from 'react';
import { Plus, Search, ArrowLeft, X, ChevronDown, Trash2, Pencil, Warehouse, TrendingUp, ClipboardList, PackageOpen, FileWarning, ScrollText } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

interface Ingredient {
  id: string;
  name: string;
  currentStock: number;
  unit: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  lastUpdate: string;
}

interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
}

interface Recipe {
  id: string;
  name: string;
  status: 'available' | 'out-of-stock';
  ingredients: RecipeIngredient[];
  image?: string;
}

interface Purchase {
  id: string;
  orderId: string;
  date: string;
  ingredient: string;
  quantity: number;
  unit: string;
  avgCost: number;
  total: number;
  supplier: string;
}

interface Transfer {
  id: string;
  transferId: string;
  date: string;
  ingredient: string;
  quantity: number;
  unit: string;
  from: string;
  to: string;
  status: 'completed' | 'pending' | 'cancelled';
}

interface CountRecord {
  id: string;
  date: string;
  ingredient: string;
  theo: number;
  phys: number;
  variance: number;
}

interface WasteRecord {
  id: string;
  date: string;
  item: string;
  qtyWasted: string;
  notes: string;
  reason: string;
  loggedBy: string;
}

// ──────────────────────────────────────────────
// Mock Data
// ──────────────────────────────────────────────

const INGREDIENTS: Ingredient[] = [
  { id: 'i1', name: 'Beef Patties', currentStock: 200, unit: 'pcs', status: 'in-stock', lastUpdate: '2026-08-27' },
  { id: 'i2', name: 'Buns', currentStock: 45, unit: 'pcs', status: 'low-stock', lastUpdate: '2026-08-27' },
  { id: 'i3', name: 'Lettuce', currentStock: 0, unit: 'kg', status: 'out-of-stock', lastUpdate: '2026-08-26' },
  { id: 'i4', name: 'Cheese Slices', currentStock: 120, unit: 'pcs', status: 'in-stock', lastUpdate: '2026-08-27' },
  { id: 'i5', name: 'Tomato', currentStock: 15, unit: 'kg', status: 'low-stock', lastUpdate: '2026-08-26' },
  { id: 'i6', name: 'Onion', currentStock: 8, unit: 'kg', status: 'low-stock', lastUpdate: '2026-08-25' },
  { id: 'i7', name: 'French Fries', currentStock: 300, unit: 'kg', status: 'in-stock', lastUpdate: '2026-08-27' },
  { id: 'i8', name: 'Chicken Breast', currentStock: 0, unit: 'kg', status: 'out-of-stock', lastUpdate: '2026-08-24' },
];

const RECIPES: Recipe[] = [
  {
    id: 'r1',
    name: 'Classic Burger',
    status: 'available',
    ingredients: [
      { name: 'Beef Patties', quantity: 1, unit: 'pcs' },
      { name: 'Buns', quantity: 1, unit: 'pcs' },
      { name: 'Cheese Slices', quantity: 1, unit: 'pcs' },
      { name: 'Lettuce', quantity: 50, unit: 'g' },
    ],
  },
  {
    id: 'r2',
    name: 'Double Cheese Burger',
    status: 'out-of-stock',
    ingredients: [
      { name: 'Beef Patties', quantity: 2, unit: 'pcs' },
      { name: 'Buns', quantity: 1, unit: 'pcs' },
      { name: 'Cheese Slices', quantity: 2, unit: 'pcs' },
    ],
  },
  {
    id: 'r3',
    name: 'Chicken Sandwich',
    status: 'available',
    ingredients: [],
  },
  {
    id: 'r4',
    name: 'Veggie Wrap',
    status: 'available',
    ingredients: [
      { name: 'Lettuce', quantity: 100, unit: 'g' },
      { name: 'Tomato', quantity: 80, unit: 'g' },
      { name: 'Onion', quantity: 30, unit: 'g' },
    ],
  },
  {
    id: 'r5',
    name: 'French Fries',
    status: 'available',
    ingredients: [
      { name: 'French Fries', quantity: 200, unit: 'g' },
    ],
  },
];

const PURCHASES: Purchase[] = [
  { id: 'p1', orderId: 'PO-886', date: 'Jul 28, 2026', ingredient: 'Beef Patties', quantity: 120, unit: 'pcs', avgCost: 1.5, total: 180.0, supplier: 'General Supplier' },
  { id: 'p2', orderId: 'PO-887', date: 'Jul 28, 2026', ingredient: 'Buns', quantity: 200, unit: 'pcs', avgCost: 0.45, total: 90.0, supplier: 'Baker’s Co.' },
  { id: 'p3', orderId: 'PO-888', date: 'Jul 27, 2026', ingredient: 'Lettuce', quantity: 25, unit: 'kg', avgCost: 2.2, total: 55.0, supplier: 'Fresh Farms' },
  { id: 'p4', orderId: 'PO-889', date: 'Jul 27, 2026', ingredient: 'Cheese Slices', quantity: 150, unit: 'pcs', avgCost: 0.8, total: 120.0, supplier: 'Dairy Goods Inc.' },
];

const TRANSFERS: Transfer[] = [
  { id: 't1', transferId: 'TR-001', date: 'Jul 28, 2026', ingredient: 'Beef Patties', quantity: 30, unit: 'pcs', from: 'Downtown', to: 'Uptown', status: 'completed' },
  { id: 't2', transferId: 'TR-002', date: 'Jul 27, 2026', ingredient: 'Buns', quantity: 50, unit: 'pcs', from: 'Main Kitchen', to: 'Downtown', status: 'pending' },
  { id: 't3', transferId: 'TR-003', date: 'Jul 26, 2026', ingredient: 'Cheese Slices', quantity: 20, unit: 'pcs', from: 'Downtown', to: 'Airport', status: 'completed' },
  { id: 't4', transferId: 'TR-004', date: 'Jul 25, 2026', ingredient: 'Lettuce', quantity: 5, unit: 'kg', from: 'Uptown', to: 'Main Kitchen', status: 'cancelled' },
];

const COUNTS: CountRecord[] = [
  { id: 'c1', date: '2023-10-25', ingredient: 'Beef Patties', theo: 125, phys: 120, variance: -5 },
  { id: 'c2', date: '2023-10-25', ingredient: 'Buns', theo: 80, phys: 78, variance: -2 },
  { id: 'c3', date: '2023-10-25', ingredient: 'Cheese Slices', theo: 95, phys: 95, variance: 0 },
  { id: 'c4', date: '2023-10-25', ingredient: 'Lettuce', theo: 12, phys: 10, variance: -2 },
  { id: 'c5', date: '2023-10-25', ingredient: 'Tomato', theo: 8, phys: 7, variance: -1 },
  { id: 'c6', date: '2023-10-25', ingredient: 'French Fries', theo: 50, phys: 45, variance: -5 },
];

const WASTE_RECORDS: WasteRecord[] = [
  { id: 'w1', date: '2023-10-25', item: 'Beef Patties', qtyWasted: '3 pcs', notes: 'Grill was too hot', reason: 'Burned', loggedBy: 'John. D' },
  { id: 'w2', date: '2023-10-25', item: 'Lettuce', qtyWasted: '1 kg', notes: 'Shelf life expired', reason: 'Spoiled', loggedBy: 'Sarah. M' },
  { id: 'w3', date: '2023-10-25', item: 'Buns', qtyWasted: '5 pcs', notes: 'Damaged during delivery', reason: 'Damaged', loggedBy: 'John. D' },
  { id: 'w4', date: '2023-10-25', item: 'Tomato', qtyWasted: '0.5 kg', notes: 'Overripe', reason: 'Spoiled', loggedBy: 'Sarah. M' },
];

const TABS = [
  { id: 'Stock', icon: Warehouse },
  { id: 'Recipe', icon: ScrollText },
  { id: 'Purchases', icon: PackageOpen },
  { id: 'Transfers', icon: TrendingUp },
  { id: 'Physical Count', icon: ClipboardList },
  { id: 'Waste log', icon: FileWarning },
];

// ──────────────────────────────────────────────
// Modals
// ──────────────────────────────────────────────

function AddIngredientModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40 transition-opacity duration-300',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-[619px] flex-col overflow-y-auto rounded-tl-3xl rounded-bl-3xl bg-[#F2F2F2] shadow-[-2px_0px_12px_rgba(0,0,0,0.10)] transition-transform duration-300',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between px-[30px] pt-[50px]">
          <button onClick={onClose} aria-label="Back" className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 transition-colors hover:bg-gray-300">
            <ArrowLeft size={22} />
          </button>
          <h2 className="absolute left-[192px] top-[52px] text-center text-3xl font-medium text-black leading-10">Add Ingredient</h2>
        </div>

        <div className="space-y-5 px-[30px] pb-5 pt-[147px]">
          <section className="relative h-44 w-full rounded-xl bg-white outline outline-1 outline-offset-[-1px] overflow-hidden">
            <div className="px-[19px] pt-[21px]">
              <h3 className="text-lg font-medium text-zinc-800 leading-7">Basic Info</h3>
            </div>
            <div className="px-[19px] pt-[47px] flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-base font-medium leading-5 text-stone-500">Ingredient Name</span>
                <div className="flex h-14 w-full items-center rounded-[87px] bg-zinc-100 px-4">
                  <span className="font-satoshi text-base font-medium leading-6 text-neutral-400">Beef Patties</span>
                </div>
              </div>
            </div>
          </section>

          <section className="relative h-72 w-full rounded-xl bg-white outline outline-1 outline-offset-[-1px] overflow-hidden">
            <div className="px-[19px] pt-[19px]">
              <h3 className="text-lg font-medium text-zinc-800 leading-7">Stock Tracking</h3>
            </div>
            <div className="px-[19px] pt-[44px] flex flex-col gap-3.5">
              <div className="flex items-start gap-6">
                <div className="flex w-60 flex-col gap-2">
                  <span className="text-base font-medium leading-5 text-stone-500">Initial Quantity</span>
                  <div className="flex h-14 w-full items-center rounded-[87px] bg-zinc-100 px-4">
                    <span className="font-satoshi text-base font-medium leading-6 text-neutral-400">120</span>
                  </div>
                </div>
                <div className="flex w-60 flex-col gap-2">
                  <span className="text-base font-medium leading-5 text-stone-500">Unit Type</span>
                  <div className="flex h-14 w-full items-center justify-between rounded-[87px] bg-zinc-100 px-4">
                    <span className="font-satoshi text-base font-medium leading-6 text-neutral-400">Pcs</span>
                    <ChevronDown size={18} className="text-neutral-400" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-base font-medium leading-5 text-stone-500">Low Stock Threshold</span>
                <div className="flex h-14 w-full items-center rounded-[87px] bg-zinc-100 px-4">
                  <span className="font-satoshi text-base font-medium leading-6 text-neutral-400">50</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="shrink-0 px-[30px] py-4">
          <div className="flex items-center justify-between gap-5">
            <button className="flex h-14 w-72 items-center justify-center rounded-[30px] bg-gray-200 text-lg font-medium text-zinc-800 shadow-[0px_4px_16.3px_11px_rgba(0,0,0,0.12)] outline outline-1 outline-offset-[-1px] outline-zinc-400 transition-colors hover:bg-gray-300">
              Cancel
            </button>
            <button className="flex h-14 w-72 items-center justify-center rounded-[30px] bg-emerald-700 text-lg font-medium text-white shadow-[0px_4px_16.3px_11px_rgba(0,0,0,0.12)] transition-colors hover:bg-emerald-800">
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function RecipeMappingModal({ open, onClose, recipe }: { open: boolean; onClose: () => void; recipe: Recipe | null }) {
  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40 transition-opacity duration-300',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-[619px] flex-col overflow-y-auto rounded-tl-3xl rounded-bl-3xl bg-[#F2F2F2] shadow-[-2px_0px_12px_rgba(0,0,0,0.10)] transition-transform duration-300',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between px-[30px] pt-[50px]">
          <button onClick={onClose} aria-label="Back" className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 transition-colors hover:bg-gray-300">
            <ArrowLeft size={22} />
          </button>
          <h2 className="absolute left-[182px] top-[52px] text-center text-3xl font-medium text-black leading-10">Recipe Mapping</h2>
        </div>

        <div className="px-[30px] pt-[65px]">
          <h3 className="text-center text-xl font-medium text-zinc-800 leading-7 font-satoshi">{recipe?.name ?? 'Classic Burger'}</h3>
        </div>

        <div className="px-[30px] pb-5 pt-[32px]">
          <section className="relative h-56 w-full rounded-xl bg-white outline outline-1 outline-offset-[-1px] overflow-hidden">
            <div className="px-[18px] pt-[18px]">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-zinc-800 leading-7">Ingredients</h3>
                <button className="flex items-center gap-[4.75px] rounded-[5px]">
                  <span className="flex h-5 w-5 items-center justify-center">
                    <Plus size={16} className="text-emerald-700" />
                  </span>
                  <span className="text-base font-medium leading-6 text-emerald-700">Add Row</span>
                </button>
              </div>
            </div>

            <div className="px-[18px] pt-[32px] flex flex-col gap-[22px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-96 items-center justify-between rounded-[87px] bg-zinc-100 px-4">
                      <span className="font-satoshi text-base font-medium leading-6 text-neutral-400">Beef Patties</span>
                      <ChevronDown size={18} className="text-neutral-400" />
                    </div>
                    <div className="flex items-center gap-3.5">
                      <div className="relative flex h-14 w-14 items-center justify-center rounded-[87px] bg-zinc-100">
                        <span className="font-satoshi text-base font-medium leading-6 text-neutral-400">1</span>
                      </div>
                      <span className="text-xs font-medium leading-5 text-neutral-400">pcs</span>
                    </div>
                  </div>
                  <ChevronDown size={14} className="text-neutral-400" />
                </div>
                <button className="flex h-7 w-7 items-center justify-center">
                  <Trash2 size={18} className="text-red-600" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-96 items-center justify-between rounded-[87px] bg-rose-100 px-4">
                      <span className="font-satoshi text-base font-medium leading-6 text-neutral-400">Beef Patties</span>
                      <ChevronDown size={18} className="text-neutral-400" />
                    </div>
                    <div className="flex items-center gap-3.5">
                      <div className="relative flex h-14 w-14 items-center justify-center rounded-[87px] bg-rose-100">
                        <span className="font-satoshi text-base font-medium leading-6 text-neutral-400">1</span>
                      </div>
                      <span className="text-xs font-medium leading-5 text-neutral-400">liter</span>
                    </div>
                  </div>
                  <ChevronDown size={14} className="text-neutral-400" />
                </div>
                <button className="flex h-7 w-7 items-center justify-center">
                  <Trash2 size={18} className="text-red-600" />
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="shrink-0 px-[30px] py-4">
          <div className="flex items-center justify-between gap-5">
            <button className="flex h-14 w-72 items-center justify-center rounded-[30px] bg-gray-200 text-lg font-medium text-zinc-800 shadow-[0px_4px_16.3px_11px_rgba(0,0,0,0.12)] outline outline-1 outline-offset-[-1px] outline-zinc-400 transition-colors hover:bg-gray-300">
              Cancel
            </button>
            <button className="flex h-14 w-72 items-center justify-center rounded-[30px] bg-emerald-700 text-lg font-medium text-white shadow-[0px_4px_16.3px_11px_rgba(0,0,0,0.12)] transition-colors hover:bg-emerald-800">
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function LogPurchaseModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40 transition-opacity duration-300',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-[619px] flex-col overflow-y-auto rounded-tl-3xl rounded-bl-3xl bg-[#F2F2F2] shadow-[-2px_0px_12px_rgba(0,0,0,0.10)] transition-transform duration-300',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between px-[30px] pt-[50px]">
          <button onClick={onClose} aria-label="Back" className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 transition-colors hover:bg-gray-300">
            <ArrowLeft size={22} />
          </button>
          <h2 className="absolute left-[152px] top-[52px] text-center text-3xl font-medium text-black leading-10">Log Purchase Order</h2>
        </div>

        <div className="px-[30px] pb-5 pt-[97px]">
          <section className="relative h-96 w-full rounded-xl bg-white outline outline-1 outline-offset-[-1px] overflow-hidden">
            <div className="px-[19px] py-[25px] flex flex-col gap-3.5">
              <div className="flex flex-col gap-2">
                <span className="text-base font-medium leading-5 text-stone-500">Ingredient Name</span>
                <div className="flex h-14 w-full items-center justify-between rounded-[87px] bg-zinc-100 px-4">
                  <span className="font-satoshi text-base font-medium leading-6 text-neutral-400">Beef Patties</span>
                  <ChevronDown size={18} className="text-neutral-400" />
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex w-60 flex-col gap-2">
                  <span className="text-base font-medium leading-5 text-stone-500">Quantity</span>
                  <div className="flex h-14 w-full items-center rounded-[87px] bg-zinc-100 px-4">
                    <span className="font-satoshi text-base font-medium leading-6 text-neutral-400">120</span>
                  </div>
                </div>
                <div className="flex w-60 flex-col gap-2">
                  <span className="text-base font-medium leading-5 text-stone-500">Total Cost ($)</span>
                  <div className="flex h-14 w-full items-center justify-between rounded-[87px] bg-zinc-100 px-4">
                    <span className="font-satoshi text-base font-medium leading-6 text-neutral-400">$120.00</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-base font-medium leading-5 text-stone-500">Supplier (Optional)</span>
                <div className="flex h-14 w-full items-center rounded-[87px] bg-zinc-100 px-4">
                  <span className="font-satoshi text-base font-medium leading-6 text-neutral-400">e.g. Metro Meats Co.</span>
                </div>
              </div>
            </div>
            <div className="px-[19px] pb-[19px]">
              <p className="text-xs font-normal leading-5 text-green-400">Logging this purchase will automatically update your current stock and recalculate the Average Cost per unit for profit margin tracking.</p>
            </div>
          </section>
        </div>

        <div className="shrink-0 px-[30px] py-4">
          <div className="flex items-center justify-between gap-5">
            <button className="flex h-14 w-72 items-center justify-center rounded-[30px] bg-gray-200 text-lg font-medium text-zinc-800 shadow-[0px_4px_16.3px_11px_rgba(0,0,0,0.12)] outline outline-1 outline-offset-[-1px] outline-zinc-400 transition-colors hover:bg-gray-300">
              Cancel
            </button>
            <button className="flex h-14 w-72 items-center justify-center rounded-[30px] bg-emerald-700 text-lg font-medium text-white shadow-[0px_4px_16.3px_11px_rgba(0,0,0,0.12)] transition-colors hover:bg-emerald-800">
              Log Purchase
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function TransferStockModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40 transition-opacity duration-300',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-[619px] flex-col overflow-y-auto rounded-tl-3xl rounded-bl-3xl bg-[#F2F2F2] shadow-[-2px_0px_12px_rgba(0,0,0,0.10)] transition-transform duration-300',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between px-[30px] pt-[50px]">
          <button onClick={onClose} aria-label="Back" className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 transition-colors hover:bg-gray-300">
            <ArrowLeft size={22} />
          </button>
          <h2 className="absolute left-[194px] top-[52px] text-center text-3xl font-medium text-black leading-10">Transfer Stock</h2>
        </div>

        <div className="px-[30px] pb-5 pt-[97px]">
          <section className="relative h-80 w-full rounded-xl bg-white outline outline-1 outline-offset-[-1px] overflow-hidden">
            <div className="px-[19px] py-[28px] flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-base font-medium leading-5 text-stone-500">Ingredient Name</span>
                <div className="flex h-14 w-full items-center justify-between rounded-[87px] bg-zinc-100 px-4">
                  <span className="font-satoshi text-base font-medium leading-6 text-neutral-400">Beef Patties</span>
                  <ChevronDown size={18} className="text-neutral-400" />
                </div>
              </div>
            </div>
            <div className="px-[19px] flex flex-col gap-3.5">
              <div className="flex flex-col gap-2">
                <span className="text-base font-medium leading-5 text-stone-500">Quantity</span>
                <div className="flex h-14 w-full items-center rounded-[87px] bg-zinc-100 px-4">
                  <span className="font-satoshi text-base font-medium leading-6 text-neutral-400">120</span>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="flex w-60 flex-col gap-2">
                  <span className="text-base font-medium leading-5 text-stone-500">From Location</span>
                  <div className="flex h-14 w-full items-center justify-between rounded-[87px] bg-zinc-100 px-4">
                    <span className="font-satoshi text-base font-medium leading-6 text-neutral-400">Downtown</span>
                    <ChevronDown size={18} className="text-neutral-400" />
                  </div>
                </div>
                <div className="flex w-60 flex-col gap-2">
                  <span className="text-base font-medium leading-5 text-stone-500">To Location</span>
                  <div className="flex h-14 w-full items-center justify-between rounded-[87px] bg-zinc-100 px-4">
                    <span className="font-satoshi text-base font-medium leading-6 text-neutral-400">Downtown</span>
                    <ChevronDown size={18} className="text-neutral-400" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="shrink-0 px-[30px] py-4">
          <div className="flex items-center justify-between gap-5">
            <button className="flex h-14 w-72 items-center justify-center rounded-[30px] bg-gray-200 text-lg font-medium text-zinc-800 shadow-[0px_4px_16.3px_11px_rgba(0,0,0,0.12)] outline outline-1 outline-offset-[-1px] outline-zinc-400 transition-colors hover:bg-gray-300">
              Cancel
            </button>
            <button className="flex h-14 w-72 items-center justify-center rounded-[30px] bg-emerald-700 text-lg font-medium text-white shadow-[0px_4px_16.3px_11px_rgba(0,0,0,0.12)] transition-colors hover:bg-emerald-800">
              Execute Transfer
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function LogPhysicalCount({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40 transition-opacity duration-300',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-[619px] flex-col overflow-y-auto rounded-tl-3xl rounded-bl-3xl bg-[#F2F2F2] shadow-[-2px_0px_12px_rgba(0,0,0,0.10)] transition-transform duration-300',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-[22.69px] pt-[21.17px]">
          <h2 className="text-center text-2xl font-medium text-black leading-8">Log Physical Count</h2>
        </div>

        <div className="px-[22.69px] pt-[66.55px] flex flex-col gap-9">
          <div className="flex flex-col gap-2">
            <span className="text-base font-medium leading-5 text-stone-500">Quantity</span>
            <div className="flex h-16 w-full items-center justify-between rounded-[87.84px] bg-zinc-100 px-4">
              <span className="font-satoshi text-base font-medium leading-6 text-neutral-400">Choose</span>
              <ChevronDown size={18} className="text-neutral-400" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-base font-medium leading-5 text-stone-500">Actual Physical Count</span>
            <div className="flex h-16 w-full items-center rounded-[87.84px] bg-zinc-100 px-4">
              <span className="font-satoshi text-base font-medium leading-6 text-neutral-400">$120.00</span>
            </div>
          </div>
        </div>

        <div className="px-[22.69px] py-[30px]">
          <button className="flex h-14 w-96 items-center justify-center rounded-[30.29px] bg-emerald-700 text-xl font-medium text-white shadow-[0px_4.04px_16.46px_11.11px_rgba(0,0,0,0.12)] transition-colors hover:bg-emerald-800">
            <span className="font-satoshi">Submit Count</span>
          </button>
        </div>
      </div>
    </>
  );
}

function LogWastedItem({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40 transition-opacity duration-300',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-[619px] flex-col overflow-y-auto rounded-tl-3xl rounded-bl-3xl bg-[#F2F2F2] shadow-[-2px_0px_12px_rgba(0,0,0,0.10)] transition-transform duration-300',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-[22.69px] pt-[21.17px]">
          <h2 className="text-center text-2xl font-medium text-black leading-8">Log Wasted Item</h2>
        </div>

        <div className="px-[22.69px] pt-[66.55px] flex flex-col gap-5">
          <div className="flex w-96 flex-col gap-2">
            <span className="text-base font-medium leading-5 text-stone-500">Ingredient</span>
            <div className="flex h-16 w-full items-center justify-between rounded-[87.84px] bg-zinc-100 px-4">
              <span className="font-satoshi text-base font-medium leading-6 text-neutral-400">Lettuce</span>
              <ChevronDown size={18} className="text-neutral-400" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-base font-medium leading-5 text-stone-500">Quantity Wasted</span>
            <div className="flex h-16 w-full items-center justify-between rounded-[87.84px] bg-zinc-100 px-4">
              <span className="font-satoshi text-base font-medium leading-6 text-neutral-400">e.g. 2</span>
              <span className="font-satoshi text-base font-medium leading-6 text-neutral-400">KG</span>
            </div>
          </div>
          <div className="flex w-96 flex-col gap-2">
            <span className="text-base font-medium leading-5 text-stone-500">Reason for Waste</span>
            <div className="flex h-16 w-full items-center justify-between rounded-[87.84px] bg-zinc-100 px-4">
              <span className="font-satoshi text-base font-medium leading-6 text-neutral-400">Choose reason</span>
              <ChevronDown size={18} className="text-neutral-400" />
            </div>
          </div>
          <div className="flex w-96 flex-col gap-2">
            <span className="text-base font-medium leading-5 text-stone-500">Responsible</span>
            <div className="flex h-16 w-full items-center rounded-[87.84px] bg-zinc-100 px-4">
              <span className="font-satoshi text-base font-medium leading-6 text-neutral-400">Choose who is responsible for</span>
            </div>
          </div>
          <div className="flex w-96 flex-col gap-2">
            <span className="text-base font-medium leading-5 text-stone-500">Notes (Optional)</span>
            <div className="flex h-28 w-full items-start rounded-xl bg-zinc-100 px-4 py-4">
              <span className="font-satoshi text-base font-medium leading-6 text-neutral-400">Add Context...</span>
            </div>
          </div>
        </div>

        <div className="px-[22.69px] py-[30px]">
          <button className="flex h-14 w-96 items-center justify-center rounded-[30.29px] bg-emerald-700 text-xl font-medium text-white shadow-[0px_4.04px_16.46px_11.11px_rgba(0,0,0,0.12)] transition-colors hover:bg-emerald-800">
            <span className="font-satoshi">Submit Count</span>
          </button>
        </div>
      </div>
    </>
  );
}

// ──────────────────────────────────────────────
// Tab views
// ──────────────────────────────────────────────

function StockTab() {
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = INGREDIENTS.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()),
  );

  const statusBadge = (status: Ingredient['status']) => {
    switch (status) {
      case 'in-stock':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700"><span className="h-2 w-2 rounded-full bg-green-500" /> In Stock</span>;
      case 'low-stock':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700"><span className="h-2 w-2 rounded-full bg-yellow-500" /> Low Stock</span>;
      case 'out-of-stock':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700"><span className="h-2 w-2 rounded-full bg-red-500" /> Out of Stock</span>;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search ingredients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 w-full rounded-xl border border-neutral-200 bg-white pl-12 pr-4 text-base outline-none transition-colors focus:border-emerald-500"
          />
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex h-12 items-center gap-2 rounded-[30px] bg-emerald-700 px-6 text-white transition-colors hover:bg-emerald-800"
        >
          <Plus size={20} />
          <span className="text-lg font-medium leading-7">Add Ingredient</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-neutral-100 bg-gray-200">
              <th className="px-6 py-4 text-left text-base font-medium leading-6 text-stone-500">Ingredient Name</th>
              <th className="px-6 py-4 text-left text-base font-medium leading-6 text-stone-500">Current Stock Status</th>
              <th className="px-6 py-4 text-left text-base font-medium leading-6 text-stone-500">Last Update</th>
              <th className="px-6 py-4 text-right text-base font-medium leading-6 text-stone-500">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ing) => (
              <tr key={ing.id} className="border-b border-neutral-50 transition-colors hover:bg-neutral-50">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100">
                      <PackageOpen size={18} className="text-neutral-400" />
                    </div>
                    <div>
                      <div className="text-base font-medium text-zinc-800">{ing.name}</div>
                      <div className="text-sm text-neutral-400">{ing.currentStock} {ing.unit}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">{statusBadge(ing.status)}</td>
                <td className="px-6 py-5 text-sm text-neutral-500">{ing.lastUpdate}</td>
                <td className="px-6 py-5">
                  <div className="flex items-center justify-end gap-2">
                    <button className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-zinc-100 hover:text-emerald-600">
                      <Pencil size={18} />
                    </button>
                    <button className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-neutral-400">No ingredients found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddIngredientModal open={showAdd} onClose={() => setShowAdd(false)} />
    </div>
  );
}

function RecipeTab() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search recipes..."
            className="h-12 w-full rounded-xl border border-neutral-200 bg-white pl-12 pr-4 text-base outline-none transition-colors focus:border-emerald-500"
          />
        </div>
        <button className="flex h-12 items-center gap-2 rounded-[30px] bg-emerald-700 px-6 text-white transition-colors hover:bg-emerald-800">
          <Plus size={20} />
          <span className="text-lg font-medium leading-7">Add Recipe</span>
        </button>
      </div>

      <div className="grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
        {RECIPES.map((recipe) => (
          <div key={recipe.id} className="flex w-full max-w-80 flex-col overflow-hidden rounded-2xl bg-white">
            <div className="relative flex flex-col gap-2.5 p-[14.64px]">
              <div className="relative h-64 w-full overflow-hidden rounded-xl bg-zinc-100">
                <div className="flex h-full w-full items-center justify-center">
                  <Image
                    src="https://placehold.co/182x182"
                    alt={recipe.name}
                    width={182}
                    height={182}
                    className="object-cover"
                  />
                </div>
                <div
                  className={cn(
                    'absolute left-[9.01px] top-[10.13px] inline-flex items-center gap-3 rounded-lg px-3 py-2.5',
                    recipe.status === 'available' ? 'bg-green-500' : 'bg-red-600',
                  )}
                >
                  <span className="text-sm font-medium leading-5 text-white">
                    {recipe.status === 'available' ? 'AVAILABLE' : 'OUT OF STOCK'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-medium leading-7 text-zinc-800 font-satoshi">{recipe.name}</h3>
                <div className="relative h-20 w-full overflow-hidden rounded-[5px] bg-zinc-100">
                  {recipe.ingredients.length > 0 ? (
                    <div className="absolute left-[10px] top-[11px] flex flex-col gap-3">
                      {recipe.ingredients.slice(0, 2).map((ing, idx) => (
                        <div key={idx} className="flex items-center gap-36">
                          <span className={cn(
                            'text-base font-normal leading-6',
                            recipe.status === 'available' ? 'text-neutral-400' : 'text-red-600',
                          )}>{ing.name}</span>
                          <span className={cn(
                            'text-base font-normal leading-6',
                            recipe.status === 'available' ? 'text-neutral-400' : 'text-red-600',
                          )}>{ing.quantity} {ing.unit}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="absolute left-[13.84px] top-[10.92px] text-base font-normal leading-6 text-neutral-400">No Ingredients mapped</div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-[14.64px] pb-[14.64px]">
              <button
                onClick={() => setSelectedRecipe(recipe)}
                className="flex h-14 w-full items-center justify-center rounded-[30px] bg-emerald-700 text-lg font-medium text-white shadow-[0px_4px_16.3px_11px_rgba(0,0,0,0.12)] transition-colors hover:bg-emerald-800"
              >
                Edit Recipe
              </button>
            </div>
          </div>
        ))}
      </div>

      <RecipeMappingModal open={!!selectedRecipe} onClose={() => setSelectedRecipe(null)} recipe={selectedRecipe} />
    </div>
  );
}

function PurchasesTab() {
  const [showLog, setShowLog] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative w-72">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search purchases..."
              className="h-12 w-full rounded-xl border border-neutral-200 bg-white pl-12 pr-4 text-base outline-none transition-colors focus:border-emerald-500"
            />
          </div>
          <div className="flex h-12 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 text-neutral-400">
            <span className="text-base">All Time</span>
            <ChevronDown size={16} />
          </div>
        </div>
        <button
          onClick={() => setShowLog(true)}
          className="flex h-12 items-center gap-2 rounded-[30px] bg-emerald-700 px-6 text-white transition-colors hover:bg-emerald-800"
        >
          <Plus size={20} />
          <span className="text-lg font-medium leading-7">Log Purchase</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full min-w-[1200px]">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-6 py-4 text-left text-base font-medium leading-6 text-stone-500">ORDER ID/ DATE</th>
              <th className="px-6 py-4 text-left text-base font-medium leading-6 text-stone-500">INGREDIENT</th>
              <th className="px-6 py-4 text-left text-base font-medium leading-6 text-stone-500">QUANTITY BOUGHT</th>
              <th className="px-6 py-4 text-left text-base font-medium leading-6 text-stone-500">TOTAL</th>
              <th className="px-6 py-4 text-left text-base font-medium leading-6 text-stone-500">SUPPLIER</th>
            </tr>
          </thead>
          <tbody>
            {PURCHASES.map((p) => (
              <tr key={p.id} className="border-b border-neutral-50 transition-colors hover:bg-neutral-50">
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-1">
                    <span className="text-lg font-medium leading-7 text-zinc-800">{p.orderId}</span>
                    <span className="text-sm leading-5 text-neutral-400">{p.date}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col items-start gap-1.5">
                    <span className="text-lg font-medium leading-7 text-zinc-800">{p.ingredient}</span>
                    <span className="inline-flex rounded-3xl bg-green-200 px-2.5 py-1.5 text-sm font-normal leading-5 text-green-700">Avg Cost: ${p.avgCost.toFixed(2)}/{p.unit}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-base font-normal leading-6 text-neutral-400">{p.quantity} {p.unit}</span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-lg font-semibold leading-6 text-emerald-700">${p.total.toFixed(2)}</span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <div className="relative flex h-6 w-6 items-center justify-center">
                      <div className="absolute left-[3px] top-[3px] h-4 w-3.5 outline outline-1 outline-offset-[-0.5px] outline-black" />
                      <div className="absolute left-[3px] top-[3px] h-0 w-4 outline outline-1 outline-offset-[-0.5px] outline-black" />
                      <div className="absolute left-[9px] top-[8px] h-0 w-px outline outline-1 outline-offset-[-0.5px] outline-black" />
                      <div className="absolute left-[9px] top-[12px] h-0 w-px outline outline-1 outline-offset-[-0.5px] outline-black" />
                      <div className="absolute left-[9px] top-[16px] h-0 w-px outline outline-1 outline-offset-[-0.5px] outline-black" />
                      <div className="absolute left-[14px] top-[8px] h-0 w-px outline outline-1 outline-offset-[-0.5px] outline-black" />
                      <div className="absolute left-[14px] top-[12px] h-0 w-px outline outline-1 outline-offset-[-0.5px] outline-black" />
                      <div className="absolute left-[14px] top-[16px] h-0 w-px outline outline-1 outline-offset-[-0.5px] outline-black" />
                    </div>
                    <span className="text-lg font-normal leading-7 text-zinc-800">{p.supplier}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <LogPurchaseModal open={showLog} onClose={() => setShowLog(false)} />
    </div>
  );
}

function TransfersTab() {
  const [showTransfer, setShowTransfer] = useState(false);

  const statusBadge = (status: Transfer['status']) => {
    switch (status) {
      case 'completed':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700"><span className="h-2 w-2 rounded-full bg-green-500" /> Completed</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700"><span className="h-2 w-2 rounded-full bg-yellow-500" /> Pending</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700"><span className="h-2 w-2 rounded-full bg-red-500" /> Cancelled</span>;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-72">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search transfers..."
            className="h-12 w-full rounded-xl border border-neutral-200 bg-white pl-12 pr-4 text-base outline-none transition-colors focus:border-emerald-500"
          />
        </div>
        <button
          onClick={() => setShowTransfer(true)}
          className="flex h-12 items-center gap-2 rounded-[30px] bg-emerald-700 px-6 text-white transition-colors hover:bg-emerald-800"
        >
          <Plus size={20} />
          <span className="text-lg font-medium leading-7">New Transfer</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-6 py-4 text-left text-base font-medium leading-6 text-stone-500">Transfer ID</th>
              <th className="px-6 py-4 text-left text-base font-medium leading-6 text-stone-500">Date</th>
              <th className="px-6 py-4 text-left text-base font-medium leading-6 text-stone-500">Ingredient</th>
              <th className="px-6 py-4 text-left text-base font-medium leading-6 text-stone-500">Quantity</th>
              <th className="px-6 py-4 text-left text-base font-medium leading-6 text-stone-500">From</th>
              <th className="px-6 py-4 text-left text-base font-medium leading-6 text-stone-500">To</th>
              <th className="px-6 py-4 text-left text-base font-medium leading-6 text-stone-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {TRANSFERS.map((t) => (
              <tr key={t.id} className="border-b border-neutral-50 transition-colors hover:bg-neutral-50">
                <td className="px-6 py-5 text-base font-medium text-zinc-800">{t.transferId}</td>
                <td className="px-6 py-5 text-sm text-neutral-500">{t.date}</td>
                <td className="px-6 py-5 text-base font-medium text-zinc-800">{t.ingredient}</td>
                <td className="px-6 py-5 text-base text-neutral-500">{t.quantity} {t.unit}</td>
                <td className="px-6 py-5 text-base text-neutral-500">{t.from}</td>
                <td className="px-6 py-5 text-base text-neutral-500">{t.to}</td>
                <td className="px-6 py-5">{statusBadge(t.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TransferStockModal open={showTransfer} onClose={() => setShowTransfer(false)} />
    </div>
  );
}

function PhysicalCountTab() {
  const [showLog, setShowLog] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-medium leading-8 text-black">Weekly Variance Trend (Spoilage/Overportioning)</h2>
        <div className="flex items-center gap-2 rounded-lg bg-gray-200/40 px-7 py-2.5">
          <span className="text-2xl font-normal leading-8 text-stone-500">Week</span>
          <ChevronDown size={16} className="text-stone-500" />
        </div>
      </div>

      {/* Chart */}
      <div className="h-[496px] w-full rounded-2xl bg-white p-[22.69px] overflow-hidden">
        <div className="flex h-full flex-col">
          <div className="flex flex-1">
            {/* Y-axis labels */}
            <div className="flex flex-col justify-between py-2.5 pr-1.5">
              <span className="text-lg font-normal leading-6 text-black/70">100</span>
              <span className="text-lg font-normal leading-6 text-black/70">80</span>
              <span className="text-lg font-normal leading-6 text-black/70">60</span>
              <span className="text-lg font-normal leading-6 text-black/70">40</span>
              <span className="text-lg font-normal leading-6 text-black/70">20</span>
              <span className="text-lg font-normal leading-6 text-black/70">0</span>
            </div>

            {/* Chart area */}
            <div className="relative flex-1">
              {/* Horizontal grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between px-[1.51px] py-2.5">
                <div className="h-0 border-t border-slate-950/20" />
                <div className="h-0 border-t border-slate-950/20" />
                <div className="h-0 border-t border-slate-950/20" />
                <div className="h-0 border-t border-slate-950/20" />
                <div className="h-0 border-t border-slate-950/20" />
                <div className="h-0 border-t border-slate-950/30" />
              </div>

              {/* Bars */}
              <div className="absolute bottom-0 left-0 right-0 top-[9.07px] border-b border-slate-950/30">
                <div className="flex h-full items-end">
                  {/* Week groups - 5 weeks, 3 bars each */}
                  {[
                    [
                      { height: 14, color: 'bg-indigo-400/80' },
                      { height: 28, color: 'bg-red-300/80' },
                      { height: 44, color: 'bg-sky-400/80' },
                    ],
                    [
                      { height: 32, color: 'bg-indigo-400/80' },
                      { height: 56, color: 'bg-red-300/80' },
                      { height: 48, color: 'bg-sky-400/80' },
                    ],
                    [
                      { height: 20, color: 'bg-indigo-400/80' },
                      { height: 24, color: 'bg-red-300/80' },
                      { height: 64, color: 'bg-sky-400/80' },
                    ],
                    [
                      { height: 14, color: 'bg-indigo-400/80' },
                      { height: 16, color: 'bg-red-300/80' },
                      { height: 32, color: 'bg-sky-400/80' },
                    ],
                    [
                      { height: 20, color: 'bg-indigo-400/80' },
                      { height: 20, color: 'bg-red-300/80' },
                      { height: 52, color: 'bg-sky-400/80' },
                    ],
                  ].map((group, wi) => (
                    <div key={wi} className="flex flex-1 items-end justify-center gap-[3.02px] px-8">
                      {group.map((bar, bi) => (
                        <div key={bi} className="relative flex flex-1 items-end justify-center">
                          <div className="absolute inset-0 bg-zinc-200/40" />
                          <div
                            className={`w-full ${bar.color}`}
                            style={{ height: `${bar.height * 4}px` }}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* X-axis labels */}
          <div className="flex pl-11 pr-3">
            {['Figma', 'Sketch', 'XD', 'PS', 'AI'].map((label) => (
              <div key={label} className="flex-1 text-center text-lg font-normal leading-6 text-black/70">
                {label}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {[
              { color: 'bg-indigo-400/80', label: 'Beef Patties' },
              { color: 'bg-red-300/80', label: 'Buns' },
              { color: 'bg-sky-400/80', label: 'Cheese' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5 p-1.5">
                <div className={`h-5 w-5 rounded-sm ${item.color} border border-white`} />
                <span className="text-lg font-normal leading-6 text-black/70">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Counts section */}
      <div className="flex items-start gap-6">
        <div className="flex-1 overflow-x-auto rounded-2xl bg-white p-[22.69px]">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-medium leading-8 text-black">Recent Counts</h2>
          </div>

          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-6 py-4 text-left text-base font-medium leading-6 text-stone-500">DATE</th>
                <th className="px-6 py-4 text-left text-base font-medium leading-6 text-stone-500">INGREDIENT</th>
                <th className="px-6 py-4 text-left text-base font-medium leading-6 text-stone-500">THEO</th>
                <th className="px-6 py-4 text-left text-base font-medium leading-6 text-stone-500">PHYS</th>
                <th className="px-6 py-4 text-left text-base font-medium leading-6 text-stone-500">VARIANCE</th>
              </tr>
            </thead>
            <tbody>
              {COUNTS.map((c) => (
                <tr key={c.id} className="border-b border-neutral-50 transition-colors hover:bg-neutral-50">
                  <td className="px-6 py-5 text-base font-medium leading-6 text-black">{c.date}</td>
                  <td className="px-6 py-5 text-base font-medium leading-6 text-black">{c.ingredient}</td>
                  <td className="px-6 py-5 text-base font-medium leading-6 text-black">{c.theo}</td>
                  <td className="px-6 py-5 text-base font-medium leading-6 text-black">{c.phys}</td>
                  <td className={cn(
                    'px-6 py-5 text-base font-medium leading-6',
                    c.variance < 0 ? 'text-red-500' : c.variance > 0 ? 'text-green-500' : 'text-black',
                  )}>
                    {c.variance > 0 ? `+${c.variance}` : c.variance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="w-[400px] shrink-0">
          <button
            onClick={() => setShowLog(true)}
            className="flex h-14 w-full items-center justify-center rounded-[30.29px] bg-emerald-700 text-xl font-medium text-white shadow-[0px_4.04px_16.46px_11.11px_rgba(0,0,0,0.12)] transition-colors hover:bg-emerald-800"
          >
            <span className="font-satoshi">Log Physical Count</span>
          </button>
        </div>
      </div>

      <LogPhysicalCount open={showLog} onClose={() => setShowLog(false)} />
    </div>
  );
}

function WasteLogTab() {
  const [showWaste, setShowWaste] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-6">
        {/* Waste form */}
        <div className="w-[400px] shrink-0 rounded-2xl bg-white p-[22.69px]">
          <h2 className="text-center text-2xl font-medium leading-8 text-black">Log Wasted Item</h2>

          <div className="mt-[66.55px] flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <span className="text-base font-medium leading-5 text-stone-500">Ingredient</span>
              <div className="flex h-16 w-full items-center justify-between rounded-[87.84px] bg-zinc-100 px-4">
                <span className="font-satoshi text-base font-medium leading-6 text-neutral-400">Lettuce</span>
                <ChevronDown size={18} className="text-neutral-400" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-base font-medium leading-5 text-stone-500">Quantity Wasted</span>
              <div className="flex h-16 w-full items-center justify-between rounded-[87.84px] bg-zinc-100 px-4">
                <span className="font-satoshi text-base font-medium leading-6 text-neutral-400">e.g. 2</span>
                <span className="font-satoshi text-base font-medium leading-6 text-neutral-400">KG</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-base font-medium leading-5 text-stone-500">Reason for Waste</span>
              <div className="flex h-16 w-full items-center justify-between rounded-[87.84px] bg-zinc-100 px-4">
                <span className="font-satoshi text-base font-medium leading-6 text-neutral-400">Choose reason</span>
                <ChevronDown size={18} className="text-neutral-400" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-base font-medium leading-5 text-stone-500">Responsible</span>
              <div className="flex h-16 w-full items-center rounded-[87.84px] bg-zinc-100 px-4">
                <span className="font-satoshi text-base font-medium leading-6 text-neutral-400">Choose who is responsible for</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-base font-medium leading-5 text-stone-500">Notes (Optional)</span>
              <div className="flex h-28 w-full items-start rounded-xl bg-zinc-100 px-4 py-4">
                <span className="font-satoshi text-base font-medium leading-6 text-neutral-400">Add Context...</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowWaste(true)}
            className="mt-[30px] flex h-14 w-full items-center justify-center rounded-[30.29px] bg-emerald-700 text-xl font-medium text-white shadow-[0px_4.04px_16.46px_11.11px_rgba(0,0,0,0.12)] transition-colors hover:bg-emerald-800"
          >
            <span className="font-satoshi">Submit Count</span>
          </button>
        </div>

        {/* Waste history */}
        <div className="flex-1 overflow-x-auto rounded-2xl bg-white p-[22.69px]">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-medium leading-8 text-black">Waste Log History</h2>
            <div className="flex items-center gap-[4.86px] rounded-[47.75px] bg-white px-4 py-2.5 outline outline-[0.81px] outline-offset-[-0.81px] outline-zinc-400">
              <span className="text-base font-normal leading-5 text-stone-500">Per Month</span>
              <ChevronDown size={12} className="text-stone-500" />
            </div>
          </div>

          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-6 py-4 text-left text-base font-medium leading-6 text-stone-500">DATE</th>
                <th className="px-6 py-4 text-left text-base font-medium leading-6 text-stone-500">ITEM</th>
                <th className="px-6 py-4 text-left text-base font-medium leading-6 text-stone-500">QTY WASTED</th>
                <th className="px-6 py-4 text-left text-base font-medium leading-6 text-stone-500">REASON</th>
                <th className="px-6 py-4 text-left text-base font-medium leading-6 text-stone-500">LOGGED BY</th>
              </tr>
            </thead>
            <tbody>
              {WASTE_RECORDS.map((w) => (
                <tr key={w.id} className="border-b border-neutral-50 transition-colors hover:bg-neutral-50">
                  <td className="px-6 py-5 text-base font-medium leading-6 text-black">{w.date}</td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col items-start gap-3.5">
                      <span className="text-lg font-medium leading-6 text-black">{w.item}</span>
                      <span className="text-base font-normal leading-6 text-neutral-400">{w.notes}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-lg font-medium leading-6 text-red-500">{w.qtyWasted}</td>
                  <td className="px-6 py-5 text-base font-medium leading-6 text-black">{w.reason}</td>
                  <td className="px-6 py-5 text-lg font-medium leading-6 text-zinc-800">{w.loggedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <LogWastedItem open={showWaste} onClose={() => setShowWaste(false)} />
    </div>
  );
}

// ──────────────────────────────────────────────
// Main Page
// ──────────────────────────────────────────────

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState('Stock');

  return (
    <main className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-0.5">
        <h1 className="text-[22px] font-medium leading-[30px] text-[#2D2F33] sm:text-[26px] sm:leading-[36px] xl:text-[30px] xl:leading-[40px]">
          Inventory & Recipes
        </h1>
        <p className="text-[13px] text-[#989898] sm:text-[15px] xl:text-base">
          Manage your inventory, recipes, purchases, transfers and more
        </p>
      </div>

      {/* Filter tabs */}
      <div className="inline-flex flex-wrap items-center gap-1.5">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'inline-flex h-10 items-center justify-center gap-2 rounded-3xl px-4 transition-colors',
                activeTab === tab.id
                  ? 'bg-white text-emerald-700'
                  : 'text-neutral-400 hover:bg-gray-100',
              )}
            >
              <Icon size={15} />
              <span className="text-center text-sm font-normal leading-5">{tab.id}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'Stock' && <StockTab />}
        {activeTab === 'Recipe' && <RecipeTab />}
        {activeTab === 'Purchases' && <PurchasesTab />}
        {activeTab === 'Transfers' && <TransfersTab />}
        {activeTab === 'Physical Count' && <PhysicalCountTab />}
        {activeTab === 'Waste log' && <WasteLogTab />}
      </div>
    </main>
  );
}
