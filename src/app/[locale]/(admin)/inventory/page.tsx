'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, ArrowLeft, X, ChevronDown, Trash2, Warehouse, TrendingUp, ClipboardList, PackageOpen, FileWarning, ScrollText } from 'lucide-react';
import { useQueryModal } from '@/lib/use-query-modal';
import { cn, lockPageScroll } from '@/lib/utils';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';

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
  kind: 'main' | 'addon';
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
    kind: 'main',
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
    kind: 'main',
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
    kind: 'main',
    ingredients: [],
  },
  {
    id: 'r4',
    name: 'Veggie Wrap',
    status: 'available',
    kind: 'main',
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
    kind: 'main',
    ingredients: [
      { name: 'French Fries', quantity: 200, unit: 'g' },
    ],
  },
  {
    id: 'a1',
    name: 'Extra Cheese (Cheddar)',
    status: 'available',
    kind: 'addon',
    ingredients: [{ name: 'Cheese Slices', quantity: 2, unit: 'pcs' }],
  },
  {
    id: 'a2',
    name: 'Extra Patty',
    status: 'available',
    kind: 'addon',
    ingredients: [{ name: 'Beef Patties', quantity: 1, unit: 'pcs' }],
  },
  {
    id: 'a3',
    name: 'Avocado Add-on',
    status: 'available',
    kind: 'addon',
    ingredients: [{ name: 'Tomato', quantity: 2, unit: 'pcs' }],
  },
  {
    id: 'a4',
    name: 'Bacon Strips',
    status: 'out-of-stock',
    kind: 'addon',
    ingredients: [{ name: 'Beef Patties', quantity: 2, unit: 'pcs' }],
  },
  {
    id: 'a5',
    name: 'Extra Sauce',
    status: 'available',
    kind: 'addon',
    ingredients: [{ name: 'Cheese Slices', quantity: 1, unit: 'pcs' }],
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
  { id: 'stock', icon: Warehouse },
  { id: 'recipe', icon: ScrollText },
  { id: 'purchases', icon: PackageOpen },
  { id: 'transfers', icon: TrendingUp },
  { id: 'physicalCount', icon: ClipboardList },
  { id: 'wasteLog', icon: FileWarning },
] as const;

type TabId = (typeof TABS)[number]['id'];

// ──────────────────────────────────────────────
// Modals
// ──────────────────────────────────────────────

function AddIngredientModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations('inventory');
  const tc = useTranslations('common');
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
          'fixed end-0 top-0 z-50 flex h-full w-[619px] flex-col bg-[#F2F2F2] shadow-[-2px_0px_12px_rgba(0,0,0,0.10)] transition-transform duration-300',
          open ? 'translate-x-0' : 'ltr:translate-x-full rtl:-translate-x-full',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between px-[30px] pt-[50px]">
          <button onClick={onClose} aria-label={tc('actions.back')} className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 transition-colors hover:bg-gray-300">
            <ArrowLeft size={22} className="rtl:scale-x-[-1]" />
          </button>
          <h2 className="absolute start-[192px] top-[52px] text-center text-3xl font-medium text-black leading-10">{t('modals.addIngredient.title')}</h2>
        </div>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-[30px] pb-5 pt-8">
          <section className="relative flex w-full flex-col justify-center rounded-xl bg-white px-[19px] py-[21px] outline outline-1 outline-offset-[-1px] overflow-hidden">
            <div>
              <h3 className="text-lg font-medium text-zinc-800 leading-7">{t('modals.addIngredient.basicInfo')}</h3>
            </div>
            <div className="pt-4 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-base font-medium leading-5 text-zinc-800">{t('labels.ingredientName')}</span>
                <div className="flex h-14 w-full items-center rounded-[87px] bg-zinc-100 px-4">
                  <span className="font-satoshi text-base font-medium leading-6 text-[#686868]">Beef Patties</span>
                </div>
              </div>
            </div>
          </section>

          <section className="relative h-72 w-full rounded-xl bg-white outline outline-1 outline-offset-[-1px] overflow-hidden">
            <div className="px-[19px] pt-[19px]">
              <h3 className="text-lg font-medium text-zinc-800 leading-7">{t('modals.addIngredient.stockTracking')}</h3>
            </div>
            <div className="px-[19px] pt-[44px] flex flex-col gap-3.5">
              <div className="flex items-start gap-6">
                <div className="flex w-60 flex-col gap-2">
                  <span className="text-base font-medium leading-5 text-zinc-800">{t('modals.addIngredient.initialQuantity')}</span>
                  <div className="flex h-14 w-full items-center rounded-[87px] bg-zinc-100 px-4">
                    <span className="font-satoshi text-base font-medium leading-6 text-[#686868]">120</span>
                  </div>
                </div>
                <div className="flex w-60 flex-col gap-2">
                  <span className="text-base font-medium leading-5 text-zinc-800">{t('modals.addIngredient.unitType')}</span>
                  <div className="flex h-14 w-full items-center justify-between rounded-[87px] bg-zinc-100 px-4">
                    <span className="font-satoshi text-base font-medium leading-6 text-[#686868]">Pcs</span>
                    <ChevronDown size={18} className="text-[#686868]" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-base font-medium leading-5 text-zinc-800">{t('modals.addIngredient.lowStockThreshold')}</span>
                <div className="flex h-14 w-full items-center rounded-[87px] bg-zinc-100 px-4">
                  <span className="font-satoshi text-base font-medium leading-6 text-[#686868]">50</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="shrink-0 px-[30px] py-4">
          <div className="flex items-center justify-between gap-5">
            <button className="flex h-14 w-72 items-center justify-center rounded-[30px] bg-gray-200 text-lg font-medium text-zinc-800 shadow-[0px_4px_16.3px_11px_rgba(0,0,0,0.12)] outline outline-1 outline-offset-[-1px] outline-zinc-400 transition-colors hover:bg-gray-300">
              {tc('actions.cancel')}
            </button>
            <button className="flex h-14 w-72 items-center justify-center rounded-[30px] bg-emerald-700 text-lg font-medium text-white shadow-[0px_4px_16.3px_11px_rgba(0,0,0,0.12)] transition-colors hover:bg-emerald-800">
              {tc('actions.save')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function RecipeMappingModal({
  open,
  onClose,
  onSave,
  recipe,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (rows: RecipeIngredient[]) => void;
  recipe: Recipe | null;
}) {
  const t = useTranslations('inventory');
  const tc = useTranslations('common');
  const [rows, setRows] = useState<RecipeIngredient[]>([]);
  const [dirty, setDirty] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Seed the rows from the recipe each time it opens.
  useEffect(() => {
    if (open) {
      setRows(recipe?.ingredients ? [...recipe.ingredients] : []);
      setDirty(false);
      setConfirmOpen(false);
    }
  }, [open, recipe]);

  useEffect(() => {
    lockPageScroll(open);
    return () => lockPageScroll(false);
  }, [open]);

  const addRow = () => {
    setRows((prev) => [...prev, { name: INGREDIENTS[0]?.name ?? '', quantity: 1, unit: INGREDIENTS[0]?.unit ?? 'pcs' }]);
    setDirty(true);
  };
  const updateRow = (i: number, patch: Partial<RecipeIngredient>) => {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
    setDirty(true);
  };
  const removeRow = (i: number) => {
    setRows((prev) => prev.filter((_, idx) => idx !== i));
    setDirty(true);
  };

  const requestClose = () => {
    if (dirty) setConfirmOpen(true);
    else onClose();
  };
  const save = () => {
    onSave(rows);
    onClose();
  };

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40 transition-opacity duration-300',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={requestClose}
      />
      <div
        className={cn(
          'fixed end-0 top-0 z-50 flex h-full w-full flex-col bg-[#F2F2F2] shadow-[-2px_0px_12px_rgba(0,0,0,0.10)] transition-transform duration-300 sm:w-[619px]',
          open ? 'translate-x-0' : 'ltr:translate-x-full rtl:-translate-x-full',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between px-[30px] pt-[50px]">
          <button onClick={requestClose} aria-label={tc('actions.back')} className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#E9E9E9] transition-colors hover:bg-[#DcDcDc]">
            <ArrowLeft size={22} className="rtl:scale-x-[-1]" />
          </button>
          <h2 className="text-center text-[33px] font-medium leading-[1.4] text-black">{t('modals.recipeMapping.title')}</h2>
          <span className="w-[50px]" />
        </div>
        <p className="mt-[11px] shrink-0 text-center font-satoshi text-[21.4px] font-medium leading-[1.4] text-[#2D2F33]">
          {recipe?.name ?? ''}
        </p>

        {/* Ingredients card */}
        <div className="mt-8 min-h-0 flex-1 overflow-y-auto overscroll-contain px-[30px]">
          <section className="rounded-[13px] bg-white p-[18px]">
            <div className="flex items-center justify-between">
              <h3 className="text-[19px] font-medium leading-[1.4] text-[#2D2F33]">{t('recipe.ingredients')}</h3>
              <button onClick={addRow} className="flex items-center gap-[4.75px] rounded-[5px] text-[#026F4F] transition-opacity hover:opacity-80">
                <Plus size={19} />
                <span className="text-[16px] font-medium leading-[1.4]">{t('recipe.addRow')}</span>
              </button>
            </div>

            {rows.length === 0 ? (
              <div className="mt-[19px] flex h-[104px] flex-col items-center justify-center gap-[11px] rounded-[7px] bg-[#F2F2F2] px-4 text-center">
                <p className="text-[16px] font-medium leading-[1.4] text-[#989898]">{t('modals.recipeMapping.emptyTitle')}</p>
                <p className="text-[13px] font-normal leading-[1.4] text-[#989898]">{t('modals.recipeMapping.emptyDesc')}</p>
              </div>
            ) : (
              <div className="mt-[19px] flex flex-col gap-[17px]">
                {rows.map((row, i) => (
                  <div key={i} className="flex items-center justify-between gap-[10px]">
                    <div className="flex min-w-0 flex-1 items-center gap-[14px]">
                      {/* Ingredient */}
                      <div className="relative min-w-0 flex-1">
                        <select
                          aria-label={t('recipe.ingredients')}
                          value={row.name}
                          onChange={(e) => {
                            const ing = INGREDIENTS.find((x) => x.name === e.target.value);
                            updateRow(i, { name: e.target.value, unit: ing?.unit ?? row.unit });
                          }}
                          className="h-[53px] w-full appearance-none rounded-[87px] bg-[#F2F2F2] ps-[16px] pe-[40px] font-satoshi text-[16px] font-medium leading-[1.4] text-[#989898] outline-none focus:ring-2 focus:ring-[#026F4F]"
                        >
                          {INGREDIENTS.map((ing) => (
                            <option key={ing.id} value={ing.name}>{ing.name}</option>
                          ))}
                        </select>
                        <ChevronDown size={18} className="pointer-events-none absolute end-[16px] top-1/2 -translate-y-1/2 text-[#989898]" />
                      </div>
                      {/* Qty */}
                      <input
                        value={row.quantity}
                        onChange={(e) => updateRow(i, { quantity: parseFloat(e.target.value) || 0 })}
                        inputMode="decimal"
                        dir="ltr"
                        className="h-[53px] w-[54px] shrink-0 rounded-[87px] bg-[#F2F2F2] text-center font-satoshi text-[16px] font-medium leading-[1.4] text-[#989898] outline-none focus:ring-2 focus:ring-[#026F4F]"
                      />
                      {/* Unit */}
                      <div className="relative shrink-0">
                        <select
                          aria-label="unit"
                          value={row.unit}
                          onChange={(e) => updateRow(i, { unit: e.target.value })}
                          className="h-[53px] appearance-none rounded-[87px] bg-transparent pe-[22px] ps-0 text-center text-[13px] font-medium leading-[1.4] text-[#989898] outline-none"
                        >
                          {['pcs', 'kg', 'g', 'L', 'ml'].map((u) => (
                            <option key={u} value={u}>{u}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="pointer-events-none absolute end-0 top-1/2 -translate-y-1/2 text-[#989898]" />
                      </div>
                    </div>
                    <button onClick={() => removeRow(i)} aria-label={tc('actions.delete')} className="shrink-0 transition-opacity hover:opacity-70">
                      <Trash2 size={30} className="text-[#E85E5E]" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-[30px] pb-[29px] pt-4">
          <div className="flex items-center justify-between gap-[26px]">
            <button
              onClick={requestClose}
              className="flex h-[59px] flex-1 items-center justify-center rounded-[30px] border border-[#B9B9B9] bg-[#E9E9E9] text-[19px] font-medium leading-[1.4] text-[#2D2F33] transition-colors hover:bg-[#DcDcDc]"
            >
              {tc('actions.cancel')}
            </button>
            <button
              onClick={save}
              className="flex h-[59px] flex-1 items-center justify-center rounded-[30px] bg-[#026F4F] text-[19px] font-medium leading-[1.4] text-white shadow-[0px_4px_8.15px_rgba(0,0,0,0.12)] transition-colors hover:bg-emerald-800"
            >
              {tc('actions.save')}
            </button>
          </div>
        </div>
      </div>

      {/* Centered unsaved-changes confirmation */}
      <UnsavedChangesModal
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onLeave={() => { setConfirmOpen(false); onClose(); }}
      />
    </>
  );
}

function LogPurchaseModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations('inventory');
  const tc = useTranslations('common');
  useEffect(() => {
    lockPageScroll(open);
    return () => lockPageScroll(false);
  }, [open]);
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
          'fixed end-0 top-0 z-50 flex h-full w-[619px] flex-col bg-[#F2F2F2] shadow-[-2px_0px_12px_rgba(0,0,0,0.10)] transition-transform duration-300',
          open ? 'translate-x-0' : 'ltr:translate-x-full rtl:-translate-x-full',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between px-[30px] pt-[50px]">
          <button onClick={onClose} aria-label={tc('actions.back')} className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 transition-colors hover:bg-gray-300">
            <ArrowLeft size={22} className="rtl:scale-x-[-1]" />
          </button>
          <h2 className="absolute start-[152px] top-[52px] text-center text-3xl font-medium text-black leading-10">{t('modals.logPurchase.title')}</h2>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-[30px] pb-5 pt-8">
          <section className="relative flex w-full flex-col gap-3.5 rounded-xl bg-white px-[19px] py-[25px] outline outline-1 outline-offset-[-1px]">
            <div className="flex flex-col gap-2">
              <span className="text-base font-medium leading-5 text-zinc-800">{t('labels.ingredientName')}</span>
              <div className="flex h-14 w-full items-center justify-between rounded-[87px] bg-zinc-100 px-4">
                <span className="font-satoshi text-base font-medium leading-6 text-[#686868]">Beef Patties</span>
                <ChevronDown size={18} className="text-[#686868]" />
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="flex w-60 flex-col gap-2">
                <span className="text-base font-medium leading-5 text-zinc-800">{t('labels.quantity')}</span>
                <div className="flex h-14 w-full items-center rounded-[87px] bg-zinc-100 px-4">
                  <span className="font-satoshi text-base font-medium leading-6 text-[#686868]">120</span>
                </div>
              </div>
              <div className="flex w-60 flex-col gap-2">
                <span className="text-base font-medium leading-5 text-zinc-800">{t('modals.logPurchase.totalCost')}</span>
                <div className="flex h-14 w-full items-center justify-between rounded-[87px] bg-zinc-100 px-4">
                  <span className="font-satoshi text-base font-medium leading-6 text-[#686868]">$120.00</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="flex w-60 flex-col gap-2">
                <span className="text-base font-medium leading-5 text-zinc-800">{t('modals.logPurchase.date')}</span>
                <div className="flex h-14 w-full items-center rounded-[87px] bg-zinc-100 px-4">
                  <span className="font-satoshi text-base font-medium leading-6 text-[#686868]">{t('modals.logPurchase.datePlaceholder')}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-base font-medium leading-5 text-zinc-800">{t('modals.logPurchase.supplierOptional')}</span>
              <div className="flex h-14 w-full items-center rounded-[87px] bg-zinc-100 px-4">
                <span className="font-satoshi text-base font-medium leading-6 text-[#686868]">{t('modals.logPurchase.supplierPlaceholder')}</span>
              </div>
            </div>

            <p className="text-xs font-normal leading-5 text-green-600">{t('modals.logPurchase.hint')}</p>
          </section>
        </div>

        <div className="shrink-0 border-t border-zinc-200 px-[30px] py-4">
          <div className="flex items-center justify-between gap-5">
            <button onClick={onClose} className="flex h-14 w-72 items-center justify-center rounded-[30px] bg-gray-200 text-lg font-medium text-zinc-800 shadow-[0px_4px_16.3px_11px_rgba(0,0,0,0.12)] outline outline-1 outline-offset-[-1px] outline-zinc-400 transition-colors hover:bg-gray-300">
              {tc('actions.cancel')}
            </button>
            <button className="flex h-14 w-72 items-center justify-center rounded-[30px] bg-emerald-700 text-lg font-medium text-white shadow-[0px_4px_16.3px_11px_rgba(0,0,0,0.12)] transition-colors hover:bg-emerald-800">
              {t('modals.logPurchase.submit')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function TransferStockModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations('inventory');
  const tc = useTranslations('common');
  // Lock background scroll while the drawer is open (incl. admin scroll container).
  useEffect(() => {
    lockPageScroll(open);
    return () => lockPageScroll(false);
  }, [open]);
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
          'fixed end-0 top-0 z-50 flex h-full w-[619px] flex-col bg-[#F2F2F2] shadow-[-2px_0px_12px_rgba(0,0,0,0.10)] transition-transform duration-300',
          open ? 'translate-x-0' : 'ltr:translate-x-full rtl:-translate-x-full',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between px-[30px] pt-[50px]">
          <button onClick={onClose} aria-label={tc('actions.back')} className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 transition-colors hover:bg-gray-300">
            <ArrowLeft size={22} className="rtl:scale-x-[-1]" />
          </button>
          <h2 className="absolute start-[194px] top-[52px] text-center text-3xl font-medium text-black leading-10">{t('modals.transferStock.title')}</h2>
        </div>

        {/* Form — scrolls, auto height so From/To never clip */}
        <div className="flex-1 overflow-y-auto px-[30px] pb-6 pt-8">
          <section className="relative flex w-full flex-col justify-center gap-4 rounded-xl bg-white px-[19px] py-6 outline outline-1 outline-offset-[-1px] overflow-hidden">
            <div className="flex flex-col gap-2">
              <span className="text-base font-medium leading-5 text-zinc-800">{t('labels.ingredientName')}</span>
              <div className="flex h-14 w-full items-center justify-between rounded-[87px] bg-zinc-100 px-4">
                <span className="font-satoshi text-base font-medium leading-6 text-[#686868]">Beef Patties</span>
                <ChevronDown size={18} className="text-[#686868]" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-base font-medium leading-5 text-zinc-800">{t('labels.quantity')}</span>
              <div className="flex h-14 w-full items-center rounded-[87px] bg-zinc-100 px-4">
                <span className="font-satoshi text-base font-medium leading-6 text-[#686868]">120</span>
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
              <div className="flex flex-1 flex-col gap-2">
                <span className="text-base font-medium leading-5 text-zinc-800">{t('modals.transferStock.fromLocation')}</span>
                <div className="flex h-14 w-full items-center justify-between rounded-[87px] bg-zinc-100 px-4">
                  <span className="font-satoshi text-base font-medium leading-6 text-[#686868]">Downtown</span>
                  <ChevronDown size={18} className="text-[#686868]" />
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <span className="text-base font-medium leading-5 text-zinc-800">{t('modals.transferStock.toLocation')}</span>
                <div className="flex h-14 w-full items-center justify-between rounded-[87px] bg-zinc-100 px-4">
                  <span className="font-satoshi text-base font-medium leading-6 text-[#686868]">Downtown</span>
                  <ChevronDown size={18} className="text-[#686868]" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
              <div className="flex flex-1 flex-col gap-2">
                <span className="text-base font-medium leading-5 text-zinc-800">{t('modals.transferStock.date')}</span>
                <div className="flex h-14 w-full items-center rounded-[87px] bg-zinc-100 px-4">
                  <span className="font-satoshi text-base font-medium leading-6 text-[#686868]">{t('modals.transferStock.datePlaceholder')}</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <span className="text-base font-medium leading-5 text-zinc-800">{t('modals.transferStock.responsible')}</span>
                <div className="flex h-14 w-full items-center rounded-[87px] bg-zinc-100 px-4">
                  <span className="font-satoshi text-base font-medium leading-6 text-[#686868]">{t('modals.transferStock.responsiblePlaceholder')}</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer pinned to bottom */}
        <div className="shrink-0 border-t border-zinc-200 bg-[#F2F2F2] px-[30px] py-4">
          <div className="flex items-center justify-between gap-5">
            <button onClick={onClose} className="flex h-14 w-72 items-center justify-center rounded-[30px] bg-gray-200 text-lg font-medium text-zinc-800 shadow-[0px_4px_16.3px_11px_rgba(0,0,0,0.12)] outline outline-1 outline-offset-[-1px] outline-zinc-400 transition-colors hover:bg-gray-300">
              {tc('actions.cancel')}
            </button>
            <button className="flex h-14 w-72 items-center justify-center rounded-[30px] bg-emerald-700 text-lg font-medium text-white shadow-[0px_4px_16.3px_11px_rgba(0,0,0,0.12)] transition-colors hover:bg-emerald-800">
              {t('modals.transferStock.submit')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function LogPhysicalCount({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations('inventory');
  const tc = useTranslations('common');
  // Lock background scroll while the drawer is open (incl. admin scroll container).
  useEffect(() => {
    lockPageScroll(open);
    return () => lockPageScroll(false);
  }, [open]);
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
          'fixed end-0 top-0 z-50 flex h-full w-[619px] flex-col bg-[#F2F2F2] shadow-[-2px_0px_12px_rgba(0,0,0,0.10)] transition-transform duration-300',
          open ? 'translate-x-0' : 'ltr:translate-x-full rtl:-translate-x-full',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with back arrow */}
        <div className="flex shrink-0 items-center justify-between px-[22.69px] pt-[21.17px]">
          <button
            onClick={onClose}
            aria-label={tc('actions.back')}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-200 transition-colors hover:bg-gray-300"
          >
            <ArrowLeft size={20} className="rtl:scale-x-[-1]" />
          </button>
          <h2 className="text-center text-2xl font-medium text-black leading-8">{t('modals.physicalCount.title')}</h2>
          <span className="w-11" />
        </div>

        {/* Form — scrolls, takes remaining space so submit stays pinned bottom */}
        <div className="flex-1 overflow-y-auto px-[22.69px] pb-6 pt-8">
          <div className="flex flex-col gap-6">
            <div className="flex w-full max-w-[400px] flex-col gap-2">
              <span className="text-base font-medium leading-5 text-zinc-800">{t('labels.quantity')}</span>
              <div className="flex h-16 w-full items-center justify-between rounded-[87.84px] bg-white px-4 outline outline-1 outline-zinc-200">
                <span className="font-satoshi text-base font-medium leading-6 text-[#2D2F33]">{t('modals.physicalCount.choose')}</span>
                <ChevronDown size={18} className="text-[#686868]" />
              </div>
            </div>
            <div className="flex w-full max-w-[400px] flex-col gap-2">
              <span className="text-base font-medium leading-5 text-zinc-800">{t('modals.physicalCount.actualPhysicalCount')}</span>
              <div className="flex h-16 w-full items-center rounded-[87.84px] bg-white px-4 outline outline-1 outline-zinc-200">
                <span className="font-satoshi text-base font-medium leading-6 text-[#2D2F33]">$120.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit pinned to bottom */}
        <div className="shrink-0 border-t border-zinc-200 bg-[#F2F2F2] px-[22.69px] py-6">
          <button className="flex h-14 w-full max-w-[400px] items-center justify-center rounded-[30.29px] bg-emerald-700 text-lg font-medium text-white shadow-[0px_4.04px_16.46px_11.11px_rgba(0,0,0,0.12)] transition-colors hover:bg-emerald-800">
            <span className="font-satoshi">{t('wasteForm.submit')}</span>
          </button>
        </div>
      </div>
    </>
  );
}

function LogWastedItem({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations('inventory');
  const tc = useTranslations('common');
  // Lock background scroll while the drawer is open (incl. admin scroll container).
  useEffect(() => {
    lockPageScroll(open);
    return () => lockPageScroll(false);
  }, [open]);
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
          'fixed end-0 top-0 z-50 flex h-full w-[619px] flex-col bg-[#F2F2F2] shadow-[-2px_0px_12px_rgba(0,0,0,0.10)] transition-transform duration-300',
          open ? 'translate-x-0' : 'ltr:translate-x-full rtl:-translate-x-full',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with back arrow (Bug-2) */}
        <div className="flex shrink-0 items-center justify-between px-[22.69px] pt-[21.17px]">
          <button
            onClick={onClose}
            aria-label={tc('actions.back')}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-200 transition-colors hover:bg-gray-300"
          >
            <ArrowLeft size={20} className="rtl:scale-x-[-1]" />
          </button>
          <h2 className="text-center text-2xl font-medium text-black leading-8">{t('wasteLog.logWastedItem')}</h2>
          <span className="w-11" />
        </div>

        {/* Form — scrolls, takes remaining space so submit stays pinned bottom (Bug-2) */}
        <div className="flex-1 overflow-y-auto px-[22.69px] pb-6 pt-8">
          <div className="flex flex-col gap-5">
            <div className="flex w-full max-w-[400px] flex-col gap-2">
              <span className="text-base font-medium leading-5 text-zinc-800">{t('wasteForm.ingredient')}</span>
              <div className="flex h-16 w-full items-center justify-between rounded-[87.84px] bg-white px-4 outline outline-1 outline-zinc-200">
                <span className="font-satoshi text-base font-medium leading-6 text-[#2D2F33]">Lettuce</span>
                <ChevronDown size={18} className="text-[#686868]" />
              </div>
            </div>
            <div className="flex w-full max-w-[400px] flex-col gap-2">
              <span className="text-base font-medium leading-5 text-zinc-800">{t('wasteForm.quantityWasted')}</span>
              <div className="flex h-16 w-full items-center justify-between rounded-[87.84px] bg-white px-4 outline outline-1 outline-zinc-200">
                <span className="font-satoshi text-base font-medium leading-6 text-[#2D2F33]">{t('wasteForm.exampleQty')}</span>
                <span className="font-satoshi text-base font-medium leading-6 text-[#2D2F33]">KG</span>
              </div>
            </div>
            <div className="flex w-full max-w-[400px] flex-col gap-2">
              <span className="text-base font-medium leading-5 text-zinc-800">{t('wasteForm.reasonForWaste')}</span>
              <div className="flex h-16 w-full items-center justify-between rounded-[87.84px] bg-white px-4 outline outline-1 outline-zinc-200">
                <span className="font-satoshi text-base font-medium leading-6 text-[#2D2F33]">{t('wasteForm.chooseReason')}</span>
                <ChevronDown size={18} className="text-[#686868]" />
              </div>
            </div>
            <div className="flex w-full max-w-[400px] flex-col gap-2">
              <span className="text-base font-medium leading-5 text-zinc-800">{t('wasteForm.responsible')}</span>
              <div className="flex h-16 w-full items-center rounded-[87.84px] bg-white px-4 outline outline-1 outline-zinc-200">
                <span className="font-satoshi text-base font-medium leading-6 text-[#2D2F33]">{t('wasteForm.chooseResponsible')}</span>
              </div>
            </div>
            <div className="flex w-full max-w-[400px] flex-col gap-2">
              <span className="text-base font-medium leading-5 text-zinc-800">{t('wasteForm.notesOptional')}</span>
              <div className="flex h-28 w-full items-start rounded-xl bg-white px-4 py-4 outline outline-1 outline-zinc-200">
                <span className="font-satoshi text-base font-medium leading-6 text-[#2D2F33]">{t('wasteForm.addContext')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit pinned to bottom (Bug-2) */}
        <div className="shrink-0 border-t border-zinc-200 bg-[#F2F2F2] px-[22.69px] py-6">
          <button className="flex h-14 w-full max-w-[400px] items-center justify-center rounded-[30.29px] bg-emerald-700 text-lg font-medium text-white shadow-[0px_4.04px_16.46px_11.11px_rgba(0,0,0,0.12)] transition-colors hover:bg-emerald-800">
            <span className="font-satoshi">{t('wasteForm.logWaste')}</span>
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
  const t = useTranslations('inventory');
  const [showAdd, setShowAdd] = useQueryModal('add-ingredient');
  const [search, setSearch] = useState('');

  const filtered = INGREDIENTS.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()),
  );

  const statusBadge = (status: Ingredient['status']) => {
    switch (status) {
      case 'in-stock':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700"><span className="h-2 w-2 rounded-full bg-green-500" /> {t('status.inStock')}</span>;
      case 'low-stock':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700"><span className="h-2 w-2 rounded-full bg-yellow-500" /> {t('status.lowStock')}</span>;
      case 'out-of-stock':
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700"><span className="h-2 w-2 rounded-full bg-red-500" /> {t('status.outOfStock')}</span>;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search size={20} className="absolute start-4 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder={t('stock.searchIngredients')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 w-full rounded-xl border border-neutral-200 bg-white ps-12 pe-4 text-base outline-none transition-colors focus:border-emerald-500"
          />
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex h-12 items-center gap-2 rounded-[30px] bg-emerald-700 px-6 text-white transition-colors hover:bg-emerald-800"
        >
          <Plus size={20} />
          <span className="text-lg font-medium leading-7">{t('stock.addIngredient')}</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full table-fixed">
          <colgroup>
            <col className="w-[26%]" />
            <col className="w-[15%]" />
            <col className="w-[16%]" />
            <col className="w-[19%]" />
            <col className="w-[24%]" />
          </colgroup>
          <thead>
            <tr className="divide-x divide-[#E0E0E0] border-b border-neutral-100 bg-gray-200">
              <th className="px-3 py-3 text-center text-sm font-medium leading-6 text-stone-500 sm:px-4 sm:text-base lg:px-6 lg:py-4">{t('stock.colIngredientName')}</th>
              <th className="whitespace-nowrap px-3 py-3 text-center text-sm font-medium leading-6 text-stone-500 sm:px-4 sm:text-base lg:px-6 lg:py-4">{t('stock.colCurrentStock')}</th>
              <th className="whitespace-nowrap px-3 py-3 text-center text-sm font-medium leading-6 text-stone-500 sm:px-4 sm:text-base lg:px-6 lg:py-4">{t('stock.colStatus')}</th>
              <th className="whitespace-nowrap px-3 py-3 text-center text-sm font-medium leading-6 text-stone-500 sm:px-4 sm:text-base lg:px-6 lg:py-4">{t('stock.colLastUpdate')}</th>
              <th className="whitespace-nowrap px-3 py-3 text-center text-sm font-medium leading-6 text-stone-500 sm:px-4 sm:text-base lg:px-6 lg:py-4">{t('stock.colAction')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ing) => (
              <tr key={ing.id} className="divide-x divide-[#F0F0F0] border-b border-neutral-50 transition-colors hover:bg-neutral-50">
                <td className="px-3 py-3 align-middle sm:px-4 sm:py-4 lg:px-6 lg:py-5">
                  <div className="truncate text-center text-sm font-medium text-zinc-800 sm:text-base">{ing.name}</div>
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-center align-middle text-sm font-medium text-zinc-800 sm:px-4 sm:py-4 sm:text-base lg:px-6 lg:py-5">
                  {ing.currentStock} <span className="font-normal text-neutral-400">{ing.unit}</span>
                </td>
                <td className="px-3 py-3 text-center align-middle sm:px-4 sm:py-4 lg:px-6 lg:py-5">{statusBadge(ing.status)}</td>
                <td className="whitespace-nowrap px-3 py-3 text-center align-middle text-xs text-neutral-500 sm:px-4 sm:py-4 sm:text-sm lg:px-6 lg:py-5">{ing.lastUpdate}</td>
                <td className="px-3 py-3 align-middle sm:px-4 sm:py-4 lg:px-6 lg:py-5">
                  <div className="flex items-center justify-center gap-1 sm:gap-2">
                    <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-zinc-100 hover:text-emerald-600 sm:h-9 sm:w-9">
                      <Image src="/images/figma/pencil.svg" alt="" width={18} height={18} className="size-[18px]" />
                    </button>
                    <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 sm:h-9 sm:w-9">
                      <Trash2 size={16} className="sm:size-[18px]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-neutral-400">{t('stock.noIngredients')}</td>
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
  const t = useTranslations('inventory');
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [recipes, setRecipes] = useState<Recipe[]>(RECIPES);
  const [editing, setEditing] = useState<Recipe | null>(null);
  const [subTab, setSubTab] = useState<'main' | 'addon'>('main');

  const saveMapping = (rows: RecipeIngredient[]) => {
    if (!editing) return;
    setRecipes((prev) => {
      const exists = prev.some((r) => r.id === editing.id);
      const updated: Recipe = { ...editing, ingredients: rows };
      return exists ? prev.map((r) => (r.id === editing.id ? updated : r)) : [...prev, updated];
    });
  };

  const visible = recipes.filter((r) => r.kind === subTab);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search size={20} className="absolute start-4 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder={t('recipe.searchRecipes')}
            className="h-12 w-full rounded-xl border border-neutral-200 bg-white ps-12 pe-4 text-base outline-none transition-colors focus:border-emerald-500"
          />
        </div>
        <button
          onClick={() => setEditing({ id: `r-${Date.now()}`, name: t('recipe.newRecipe'), status: 'available', kind: subTab, ingredients: [] })}
          className="flex h-12 items-center gap-2 rounded-[30px] bg-emerald-700 px-6 text-white transition-colors hover:bg-emerald-800"
        >
          <Plus size={20} />
          <span className="text-lg font-medium leading-7">{t('recipe.addRecipe')}</span>
        </button>
      </div>

      {/* Sub-tabs: Main Menu Item | Add on & Extras */}
      <div className="flex items-center gap-6 border-b border-[#B9B9B9]">
        {([
          { id: 'main' as const, label: isAr ? 'الأصناف الأساسية' : 'Main Menu Item' },
          { id: 'addon' as const, label: isAr ? 'الإضافات' : 'Add on & Extras' },
        ]).map((st) => (
          <button
            key={st.id}
            onClick={() => setSubTab(st.id)}
            className={cn(
              'border-b-2 px-1 pb-3 text-[16px] leading-[1.4] transition-colors',
              subTab === st.id ? 'border-[#026F4F] font-medium text-[#026F4F]' : 'border-transparent text-[#989898] hover:text-[#2D2F33]',
            )}
          >
            {st.label}
          </button>
        ))}
      </div>

      {subTab === 'main' ? (
        <div className="grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
          {visible.map((recipe) => (
            <div key={recipe.id} className="flex w-full max-w-[322px] flex-col gap-[18px] overflow-hidden rounded-[22.5px] bg-white p-[20px]">
              <div className="flex flex-col gap-[11px]">
                <div className="relative h-[263.5px] w-full overflow-hidden rounded-[11.26px] bg-[#F2F2F2]">
                  <Image
                    src="/images/food-41e5d7.png"
                    alt={recipe.name}
                    fill
                    sizes="(min-width:1536px) 20vw, (min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
                    className="object-cover"
                  />
                  <div
                    className={cn(
                      'absolute start-[9.01px] top-[10.13px] inline-flex items-center justify-center rounded-[7.88px] px-[11.26px] py-[9.01px]',
                      recipe.status === 'available' ? 'bg-[#10D935]' : 'bg-[#D91010]',
                    )}
                  >
                    <span className="text-[13.5px] font-medium leading-[1.4] text-white">
                      {recipe.status === 'available' ? t('status.available') : t('status.outOfStock')}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-[12px]">
                  <h3 className="truncate font-satoshi text-[21.4px] font-medium leading-[1.4] text-[#2D2F33]">{recipe.name}</h3>
                  <div className="relative h-20 w-full overflow-hidden rounded-[5px] bg-zinc-100">
                    {recipe.ingredients.length > 0 ? (
                      <div className="absolute inset-x-[9px] top-[11px] flex flex-col gap-[13px]">
                        {recipe.ingredients.slice(0, 2).map((ing, idx) => (
                          <div key={idx} className="flex items-center justify-between text-[16px] font-normal leading-[1.4]">
                            <span className={recipe.status === 'available' ? 'text-neutral-400' : 'text-red-600'}>{ing.name}</span>
                            <span className={recipe.status === 'available' ? 'text-neutral-400' : 'text-red-600'}>{ing.quantity} {ing.unit}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="absolute start-[13.84px] top-[10.92px] text-[16px] font-normal leading-[1.4] text-neutral-400">{t('recipe.noIngredientsMapped')}</div>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setEditing(recipe)}
                className="flex h-[53px] w-full items-center justify-center rounded-[30px] bg-[#026F4F] text-[19px] font-medium leading-[1.4] text-white shadow-[0px_4px_8.15px_rgba(0,0,0,0.12)] transition-colors hover:bg-emerald-800"
              >
                {t('recipe.editRecipe')}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
          {visible.map((recipe) => (
            <div key={recipe.id} className="flex w-full flex-col gap-[12px] rounded-[22.5px] bg-white p-[13.94px]">
              <span
                className={cn(
                  'inline-flex w-fit items-center justify-center rounded-[7.9px] px-[11.29px] py-[9.03px] text-[13.5px] font-medium leading-[1.4] text-white',
                  recipe.status === 'available' ? 'bg-[#10D935]' : 'bg-[#D91010]',
                )}
              >
                {recipe.status === 'available' ? t('status.available') : t('status.outOfStock')}
              </span>
              <h3 className="truncate font-satoshi text-[21.4px] font-medium leading-[1.4] text-[#2D2F33]">{recipe.name}</h3>
              <div className="flex min-h-[45px] items-center rounded-[5px] bg-zinc-100 px-[9px]">
                {recipe.ingredients.length > 0 ? (
                  <div className="flex w-full items-center justify-between text-[16px] font-normal leading-[1.4]">
                    <span className={recipe.status === 'available' ? 'text-neutral-400' : 'text-red-600'}>{recipe.ingredients[0].name}</span>
                    <span className={recipe.status === 'available' ? 'text-neutral-400' : 'text-red-600'}>{recipe.ingredients[0].quantity} {recipe.ingredients[0].unit}</span>
                  </div>
                ) : (
                  <span className="text-[16px] font-normal leading-[1.4] text-neutral-400">{t('recipe.noIngredientsMapped')}</span>
                )}
              </div>
              <button
                onClick={() => setEditing(recipe)}
                className="flex h-[53px] w-full items-center justify-center rounded-[30px] bg-[#026F4F] text-[19px] font-medium leading-[1.4] text-white shadow-[0px_4px_8.15px_rgba(0,0,0,0.12)] transition-colors hover:bg-emerald-800"
              >
                {t('recipe.editRecipe')}
              </button>
            </div>
          ))}
        </div>
      )}

      {visible.length === 0 && (
        <p className="py-10 text-center text-sm text-[#989898]">{t('recipe.noIngredientsMapped')}</p>
      )}

      <RecipeMappingModal
        open={!!editing}
        onClose={() => setEditing(null)}
        onSave={saveMapping}
        recipe={editing}
      />
    </div>
  );
}

function PurchasesTab() {
  const t = useTranslations('inventory');
  const [showLog, setShowLog] = useQueryModal('log-purchase');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative w-72">
            <Search size={20} className="absolute start-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder={t('purchases.searchPurchases')}
              className="h-12 w-full rounded-xl border border-neutral-200 bg-white ps-12 pe-4 text-base outline-none transition-colors focus:border-emerald-500"
            />
          </div>
          <div className="flex h-12 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 text-neutral-400">
            <span className="text-base">{t('purchases.allTime')}</span>
            <ChevronDown size={16} />
          </div>
        </div>
        <button
          onClick={() => setShowLog(true)}
          className="flex h-12 items-center gap-2 rounded-[30px] bg-emerald-700 px-6 text-white transition-colors hover:bg-emerald-800"
        >
          <Plus size={20} />
          <span className="text-lg font-medium leading-7">{t('purchases.logPurchase')}</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full table-fixed">
          <colgroup>
            <col className="w-[20%]" />
            <col className="w-[26%]" />
            <col className="w-[16%]" />
            <col className="w-[16%]" />
            <col className="w-[22%]" />
          </colgroup>
          <thead>
            <tr className="divide-x divide-[#E0E0E0] bg-gray-200">
              <th className="whitespace-nowrap px-3 py-3 text-center text-sm font-medium leading-6 text-stone-500 sm:px-4 sm:text-base lg:px-6 lg:py-4">{t('purchases.colOrderIdDate')}</th>
              <th className="px-3 py-3 text-center text-sm font-medium leading-6 text-stone-500 sm:px-4 sm:text-base lg:px-6 lg:py-4">{t('purchases.colIngredient')}</th>
              <th className="whitespace-nowrap px-3 py-3 text-center text-sm font-medium leading-6 text-stone-500 sm:px-4 sm:text-base lg:px-6 lg:py-4">{t('purchases.colQuantityBought')}</th>
              <th className="whitespace-nowrap px-3 py-3 text-center text-sm font-medium leading-6 text-stone-500 sm:px-4 sm:text-base lg:px-6 lg:py-4">{t('purchases.colTotal')}</th>
              <th className="whitespace-nowrap px-3 py-3 text-center text-sm font-medium leading-6 text-stone-500 sm:px-4 sm:text-base lg:px-6 lg:py-4">{t('purchases.colSupplier')}</th>
            </tr>
          </thead>
          <tbody>
            {PURCHASES.map((p) => (
              <tr key={p.id} className="divide-x divide-[#F0F0F0] border-b border-neutral-50 transition-colors hover:bg-neutral-50">
                <td className="whitespace-nowrap px-3 py-3 text-center align-middle sm:px-4 sm:py-4 lg:px-6 lg:py-5">
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-sm font-medium leading-6 text-zinc-800 sm:text-base">{p.orderId}</span>
                    <span className="text-xs leading-5 text-neutral-400 sm:text-sm">{p.date}</span>
                  </div>
                </td>
                <td className="px-3 py-3 align-middle sm:px-4 sm:py-4 lg:px-6 lg:py-5">
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="max-w-[150px] truncate text-sm font-medium leading-6 text-zinc-800 sm:max-w-[200px] sm:text-base lg:max-w-none">{p.ingredient}</span>
                    <span className="inline-flex whitespace-nowrap rounded-3xl bg-green-200 px-2.5 py-1 text-xs font-normal leading-5 text-green-700 sm:text-sm">{t('purchases.avgCost', { cost: `$${p.avgCost.toFixed(2)}`, unit: p.unit })}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-center align-middle text-sm text-neutral-400 sm:px-4 sm:py-4 sm:text-base lg:px-6 lg:py-5">{p.quantity} {p.unit}</td>
                <td className="whitespace-nowrap px-3 py-3 text-center align-middle sm:px-4 sm:py-4 lg:px-6 lg:py-5">
                  <span className="text-sm font-semibold leading-6 text-emerald-700 sm:text-base"><bdi dir="ltr">${p.total.toFixed(2)}</bdi></span>
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-center align-middle sm:px-4 sm:py-4 lg:px-6 lg:py-5">
                  <span className="block max-w-[110px] truncate text-sm font-normal leading-7 text-zinc-800 sm:max-w-[160px] sm:text-base lg:max-w-none">{p.supplier}</span>
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
  const t = useTranslations('inventory');
  const [showTransfer, setShowTransfer] = useQueryModal('transfer-stock');

  const statusBadge = (status: Transfer['status']) => {
    switch (status) {
      case 'completed':
        return <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 sm:px-3 sm:text-sm"><span className="h-2 w-2 shrink-0 rounded-full bg-green-500" /> {t('status.completed')}</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700 sm:px-3 sm:text-sm"><span className="h-2 w-2 shrink-0 rounded-full bg-yellow-500" /> {t('status.pending')}</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700 sm:px-3 sm:text-sm"><span className="h-2 w-2 shrink-0 rounded-full bg-red-500" /> {t('status.cancelled')}</span>;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-72">
          <Search size={20} className="absolute start-4 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder={t('transfers.searchTransfers')}
            className="h-12 w-full rounded-xl border border-neutral-200 bg-white ps-12 pe-4 text-base outline-none transition-colors focus:border-emerald-500"
          />
        </div>
        <button
          onClick={() => setShowTransfer(true)}
          className="flex h-12 items-center gap-2 rounded-[30px] bg-emerald-700 px-6 text-white transition-colors hover:bg-emerald-800"
        >
          <Plus size={20} />
          <span className="text-lg font-medium leading-7">{t('transfers.newTransfer')}</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full table-fixed">
          <colgroup>
            <col className="w-[15%]" />
            <col className="w-[13%]" />
            <col className="w-[18%]" />
            <col className="w-[12%]" />
            <col className="w-[14%]" />
            <col className="w-[14%]" />
            <col className="w-[14%]" />
          </colgroup>
          <thead>
            <tr className="divide-x divide-[#E0E0E0] bg-gray-200">
              <th className="whitespace-nowrap px-3 py-3 text-center text-sm font-medium leading-6 text-stone-500 sm:px-4 sm:text-base lg:px-6 lg:py-4">{t('transfers.colTransferId')}</th>
              <th className="whitespace-nowrap px-3 py-3 text-center text-sm font-medium leading-6 text-stone-500 sm:px-4 sm:text-base lg:px-6 lg:py-4">{t('transfers.colDate')}</th>
              <th className="px-3 py-3 text-center text-sm font-medium leading-6 text-stone-500 sm:px-4 sm:text-base lg:px-6 lg:py-4">{t('transfers.colIngredient')}</th>
              <th className="whitespace-nowrap px-3 py-3 text-center text-sm font-medium leading-6 text-stone-500 sm:px-4 sm:text-base lg:px-6 lg:py-4">{t('transfers.colQuantity')}</th>
              <th className="whitespace-nowrap px-3 py-3 text-center text-sm font-medium leading-6 text-stone-500 sm:px-4 sm:text-base lg:px-6 lg:py-4">{t('transfers.colFrom')}</th>
              <th className="whitespace-nowrap px-3 py-3 text-center text-sm font-medium leading-6 text-stone-500 sm:px-4 sm:text-base lg:px-6 lg:py-4">{t('transfers.colTo')}</th>
              <th className="whitespace-nowrap px-3 py-3 text-center text-sm font-medium leading-6 text-stone-500 sm:px-4 sm:text-base lg:px-6 lg:py-4">{t('transfers.colStatus')}</th>
            </tr>
          </thead>
          <tbody>
            {TRANSFERS.map((t) => (
              <tr key={t.id} className="divide-x divide-[#F0F0F0] border-b border-neutral-50 transition-colors hover:bg-neutral-50">
                <td className="whitespace-nowrap px-3 py-3 text-center align-middle text-sm font-medium text-zinc-800 sm:px-4 sm:py-4 sm:text-base lg:px-6 lg:py-5">{t.transferId}</td>
                <td className="whitespace-nowrap px-3 py-3 text-center align-middle text-xs text-neutral-500 sm:px-4 sm:py-4 sm:text-sm lg:px-6 lg:py-5">{t.date}</td>
                <td className="max-w-[110px] truncate px-3 py-3 text-center align-middle text-sm font-medium text-zinc-800 sm:max-w-[160px] sm:px-4 sm:py-4 sm:text-base lg:max-w-none lg:px-6 lg:py-5">{t.ingredient}</td>
                <td className="whitespace-nowrap px-3 py-3 text-center align-middle text-sm text-neutral-500 sm:px-4 sm:py-4 sm:text-base lg:px-6 lg:py-5">{t.quantity} {t.unit}</td>
                <td className="max-w-[90px] truncate px-3 py-3 text-center align-middle text-sm text-neutral-500 sm:max-w-[130px] sm:px-4 sm:py-4 sm:text-base lg:max-w-none lg:px-6 lg:py-5">{t.from}</td>
                <td className="max-w-[90px] truncate px-3 py-3 text-center align-middle text-sm text-neutral-500 sm:max-w-[130px] sm:px-4 sm:py-4 sm:text-base lg:max-w-none lg:px-6 lg:py-5">{t.to}</td>
                <td className="whitespace-nowrap px-3 py-3 text-center align-middle sm:px-4 sm:py-4 lg:px-6 lg:py-5">{statusBadge(t.status)}</td>
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
  const t = useTranslations('inventory');
  const [showLog, setShowLog] = useQueryModal('log-count');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-medium leading-8 text-black">{t('physicalCount.weeklyVarianceTrend')}</h2>
        <div className="flex items-center gap-2 rounded-lg bg-gray-200/40 px-7 py-2.5">
          <span className="text-2xl font-normal leading-8 text-stone-500">{t('physicalCount.week')}</span>
          <ChevronDown size={16} className="text-stone-500" />
        </div>
      </div>

      {/* Chart */}
      <div className="h-[496px] w-full rounded-2xl bg-white p-[22.69px] overflow-hidden">
        <div className="flex h-full flex-col">
          <div className="flex flex-1">
            {/* Y-axis labels — each label centered on its grid line (Bug-1) */}
            <div className="flex w-12 shrink-0 flex-col justify-between py-2.5 pe-1.5 text-right">
              <span className="flex h-0 items-center justify-end text-lg font-normal leading-none text-black/70">100</span>
              <span className="flex h-0 items-center justify-end text-lg font-normal leading-none text-black/70">80</span>
              <span className="flex h-0 items-center justify-end text-lg font-normal leading-none text-black/70">60</span>
              <span className="flex h-0 items-center justify-end text-lg font-normal leading-none text-black/70">40</span>
              <span className="flex h-0 items-center justify-end text-lg font-normal leading-none text-black/70">20</span>
              <span className="flex h-0 items-center justify-end text-lg font-normal leading-none text-black/70">0</span>
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

              {/* Bars — inset matches grid py-2.5 so bar bottoms + baseline sit exactly on the 0 line (Bug-1) */}
              <div className="absolute inset-x-0 top-2.5 bottom-2.5 border-b-2 border-slate-950/30">
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
          <div className="flex ps-11 pe-3">
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

      {/* Recent Counts section — table full width, Log Physical Count after it */}
      <div className="flex flex-col gap-4">
        <div className="overflow-x-auto rounded-2xl bg-white p-[22.69px]">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-medium leading-8 text-black">{t('physicalCount.recentCounts')}</h2>
          </div>

          <table className="w-full table-fixed">
            <colgroup>
              <col className="w-[22%]" />
              <col className="w-[30%]" />
              <col className="w-[16%]" />
              <col className="w-[16%]" />
              <col className="w-[16%]" />
            </colgroup>
            <thead>
              <tr className="divide-x divide-[#E0E0E0] bg-gray-200">
                <th className="whitespace-nowrap px-3 py-3 text-center text-sm font-medium leading-6 text-stone-500 sm:px-4 sm:text-base lg:px-6 lg:py-4">{t('physicalCount.colDate')}</th>
                <th className="px-3 py-3 text-center text-sm font-medium leading-6 text-stone-500 sm:px-4 sm:text-base lg:px-6 lg:py-4">{t('purchases.colIngredient')}</th>
                <th className="whitespace-nowrap px-3 py-3 text-center text-sm font-medium leading-6 text-stone-500 sm:px-4 sm:text-base lg:px-6 lg:py-4">{t('physicalCount.colTheo')}</th>
                <th className="whitespace-nowrap px-3 py-3 text-center text-sm font-medium leading-6 text-stone-500 sm:px-4 sm:text-base lg:px-6 lg:py-4">{t('physicalCount.colPhys')}</th>
                <th className="whitespace-nowrap px-3 py-3 text-center text-sm font-medium leading-6 text-stone-500 sm:px-4 sm:text-base lg:px-6 lg:py-4">{t('physicalCount.colVariance')}</th>
              </tr>
            </thead>
            <tbody>
              {COUNTS.map((c) => (
                <tr key={c.id} className="divide-x divide-[#F0F0F0] border-b border-neutral-50 transition-colors hover:bg-neutral-50">
                  <td className="whitespace-nowrap px-3 py-3 text-center align-middle text-sm font-medium leading-6 text-black sm:px-4 sm:py-4 sm:text-base lg:px-6 lg:py-5">{c.date}</td>
                  <td className="max-w-[140px] truncate px-3 py-3 text-center align-middle text-sm font-medium leading-6 text-black sm:max-w-[200px] sm:px-4 sm:py-4 sm:text-base lg:max-w-none lg:px-6 lg:py-5">{c.ingredient}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-center align-middle text-sm font-medium leading-6 text-black sm:px-4 sm:py-4 sm:text-base lg:px-6 lg:py-5">{c.theo}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-center align-middle text-sm font-medium leading-6 text-black sm:px-4 sm:py-4 sm:text-base lg:px-6 lg:py-5">{c.phys}</td>
                  <td className={cn(
                    'whitespace-nowrap px-3 py-3 text-center align-middle text-sm font-medium leading-6 sm:px-4 sm:py-4 sm:text-base lg:px-6 lg:py-5',
                    c.variance < 0 ? 'text-red-500' : c.variance > 0 ? 'text-green-500' : 'text-black',
                  )}>
                    {c.variance > 0 ? `+${c.variance}` : c.variance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-start">
          <button
            onClick={() => setShowLog(true)}
            className="flex h-14 w-full max-w-[400px] items-center justify-center rounded-[30.29px] bg-emerald-700 text-lg font-medium text-white shadow-[0px_4.04px_16.46px_11.11px_rgba(0,0,0,0.12)] transition-colors hover:bg-emerald-800"
          >
            <span className="font-satoshi">{t('physicalCount.logPhysicalCount')}</span>
          </button>
        </div>
      </div>

      <LogPhysicalCount open={showLog} onClose={() => setShowLog(false)} />
    </div>
  );
}

function WasteLogTab() {
  const t = useTranslations('inventory');
  const [showWaste, setShowWaste] = useQueryModal('log-waste');

  return (
    <div className="flex flex-col gap-6">
      {/* Waste history — full width (Bug-10). Logging moved to header button + drawer. */}
      <div className="overflow-x-auto rounded-2xl bg-white p-[22.69px]">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-medium leading-8 text-black">{t('wasteLog.wasteLogHistory')}</h2>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-[4.86px] rounded-[47.75px] bg-white px-4 py-2.5 outline outline-[0.81px] outline-offset-[-0.81px] outline-zinc-400">
              <span className="text-base font-normal leading-5 text-stone-500">{t('wasteLog.perMonth')}</span>
              <ChevronDown size={12} className="text-stone-500" />
            </div>
            <button
              onClick={() => setShowWaste(true)}
              className="flex h-11 items-center gap-2 rounded-[30px] bg-emerald-700 px-6 text-base font-medium text-white transition-colors hover:bg-emerald-800"
            >
              <Plus size={18} />
              <span className="font-satoshi">{t('wasteLog.logWastedItem')}</span>
            </button>
          </div>
        </div>

          <table className="w-full table-fixed">
            <colgroup>
              <col className="w-[16%]" />
              <col className="w-[28%]" />
              <col className="w-[16%]" />
              <col className="w-[16%]" />
              <col className="w-[24%]" />
            </colgroup>
            <thead>
              <tr className="divide-x divide-[#E0E0E0] bg-gray-200">
                <th className="whitespace-nowrap px-3 py-3 text-center text-sm font-medium leading-6 text-stone-500 sm:px-4 sm:text-base lg:px-6 lg:py-4">{t('physicalCount.colDate')}</th>
                <th className="px-3 py-3 text-center text-sm font-medium leading-6 text-stone-500 sm:px-4 sm:text-base lg:px-6 lg:py-4">{t('wasteLog.colItem')}</th>
                <th className="whitespace-nowrap px-3 py-3 text-center text-sm font-medium leading-6 text-stone-500 sm:px-4 sm:text-base lg:px-6 lg:py-4">{t('wasteLog.colQtyWasted')}</th>
                <th className="px-3 py-3 text-center text-sm font-medium leading-6 text-stone-500 sm:px-4 sm:text-base lg:px-6 lg:py-4">{t('wasteLog.colReason')}</th>
                <th className="whitespace-nowrap px-3 py-3 text-center text-sm font-medium leading-6 text-stone-500 sm:px-4 sm:text-base lg:px-6 lg:py-4">{t('wasteLog.colLoggedBy')}</th>
              </tr>
            </thead>
            <tbody>
              {WASTE_RECORDS.map((w) => (
                <tr key={w.id} className="divide-x divide-[#F0F0F0] border-b border-neutral-50 transition-colors hover:bg-neutral-50">
                  <td className="whitespace-nowrap px-3 py-3 text-center align-middle text-sm font-medium leading-6 text-black sm:px-4 sm:py-4 sm:text-base lg:px-6 lg:py-5">{w.date}</td>
                  <td className="px-3 py-3 align-middle sm:px-4 sm:py-4 lg:px-6 lg:py-5">
                    <div className="flex flex-col items-center gap-1">
                      <span className="max-w-[150px] truncate text-sm font-medium leading-6 text-black sm:max-w-[200px] sm:text-base lg:max-w-none">{w.item}</span>
                      <span className="max-w-[150px] truncate text-xs font-normal leading-6 text-neutral-400 sm:max-w-[200px] sm:text-sm lg:max-w-none">{w.notes}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-center align-middle text-sm font-medium leading-6 text-red-500 sm:px-4 sm:py-4 sm:text-base lg:px-6 lg:py-5">{w.qtyWasted}</td>
                  <td className="max-w-[120px] truncate px-3 py-3 text-center align-middle text-sm font-medium leading-6 text-black sm:max-w-[160px] sm:px-4 sm:py-4 sm:text-base lg:max-w-none lg:px-6 lg:py-5">{w.reason}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-center align-middle text-sm font-medium leading-6 text-zinc-800 sm:px-4 sm:py-4 sm:text-base lg:px-6 lg:py-5">{w.loggedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>

      <LogWastedItem open={showWaste} onClose={() => setShowWaste(false)} />
    </div>
  );
}

// ──────────────────────────────────────────────
// Main Page
// ──────────────────────────────────────────────

export default function InventoryPage() {
  const t = useTranslations('inventory');
  const [activeTab, setActiveTab] = useState<TabId>('stock');

  return (
    <main className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-0.5">
        <h1 className="text-[22px] font-medium leading-[30px] text-[#2D2F33] sm:text-[26px] sm:leading-[36px] xl:text-[30px] xl:leading-[40px]">
          {t('title')}
        </h1>
        <p className="text-[13px] text-[#989898] sm:text-[15px] xl:text-base">
          {t('subtitle')}
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
              <span className="text-center text-sm font-normal leading-5">{t(`tabs.${tab.id}`)}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'stock' && <StockTab />}
        {activeTab === 'recipe' && <RecipeTab />}
        {activeTab === 'purchases' && <PurchasesTab />}
        {activeTab === 'transfers' && <TransfersTab />}
        {activeTab === 'physicalCount' && <PhysicalCountTab />}
        {activeTab === 'wasteLog' && <WasteLogTab />}
      </div>
    </main>
  );
}
