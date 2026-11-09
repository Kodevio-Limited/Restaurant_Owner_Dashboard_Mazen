'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import {
  SlidersHorizontal,
  Search,
  Check,
  RotateCcw,
  TrendingUp,
  Percent,
  Coins,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { exportTableToExcel } from '@/lib/exportExcel';

export type SortField =
  | 'name'
  | 'category'
  | 'cogs'
  | 'fcp'
  | 'contributionMargin'
  | 'popularity'
  | 'grossRevenue'
  | 'grossProfit'
  | 'addonRate'
  | 'refundRate';

export interface MenuItemMetric {
  id: string;
  name: string;
  name_ar: string;
  category: string;
  category_ar: string;
  image: string;
  sellingPrice: number;
  cogs: number; // Cost of Goods Sold (EGP)
  fcp: number; // Food Cost Percentage (%)
  contributionMargin: number; // Contribution Margin (EGP)
  popularityScore: number; // Popularity Index (0 - 100)
  popularityRank: number; // Rank #1, #2, etc.
  grossRevenue: number; // Gross Revenue (EGP)
  grossProfit: number; // Gross Profit (EGP)
  addonRate: number; // Add-on Rate (%)
  refundRate: number; // Refund Rate (%)
}

const MENU_ITEM_METRICS: MenuItemMetric[] = [
  {
    id: 'm1',
    name: 'Classic Burger',
    name_ar: 'برجر كلاسيك',
    category: 'Burgers',
    category_ar: 'برجر',
    image: '/images/food-41e5d7.png',
    sellingPrice: 150.0,
    cogs: 42.0,
    fcp: 28.0,
    contributionMargin: 108.0,
    popularityScore: 98,
    popularityRank: 1,
    grossRevenue: 45600,
    grossProfit: 32832,
    addonRate: 48.5,
    refundRate: 0.4,
  },
  {
    id: 'm2',
    name: 'Shoyu Ramen',
    name_ar: 'شويو رامن',
    category: 'Ramen',
    category_ar: 'رامن',
    image: '/images/food-41e5d7.png',
    sellingPrice: 185.0,
    cogs: 51.8,
    fcp: 28.0,
    contributionMargin: 133.2,
    popularityScore: 94,
    popularityRank: 2,
    grossRevenue: 38850,
    grossProfit: 27972,
    addonRate: 42.0,
    refundRate: 0.6,
  },
  {
    id: 'm3',
    name: 'Chicken Biryani',
    name_ar: 'برياني دجاج',
    category: 'Mains',
    category_ar: 'أطباق رئيسية',
    image: '/images/food-41e5d7.png',
    sellingPrice: 165.0,
    cogs: 49.5,
    fcp: 30.0,
    contributionMargin: 115.5,
    popularityScore: 91,
    popularityRank: 3,
    grossRevenue: 34650,
    grossProfit: 24255,
    addonRate: 36.2,
    refundRate: 0.8,
  },
  {
    id: 'm4',
    name: 'Double Cheese Burger',
    name_ar: 'دبل تشيز برجر',
    category: 'Burgers',
    category_ar: 'برجر',
    image: '/images/food-41e5d7.png',
    sellingPrice: 210.0,
    cogs: 67.2,
    fcp: 32.0,
    contributionMargin: 142.8,
    popularityScore: 88,
    popularityRank: 4,
    grossRevenue: 29400,
    grossProfit: 19992,
    addonRate: 54.0,
    refundRate: 0.5,
  },
  {
    id: 'm5',
    name: 'Truffle Fries',
    name_ar: 'بطاطس بالكمأة',
    category: 'Sides',
    category_ar: 'أطباق جانبية',
    image: '/images/food-41e5d7.png',
    sellingPrice: 85.0,
    cogs: 18.7,
    fcp: 22.0,
    contributionMargin: 66.3,
    popularityScore: 85,
    popularityRank: 5,
    grossRevenue: 23800,
    grossProfit: 18564,
    addonRate: 68.4,
    refundRate: 0.2,
  },
  {
    id: 'm6',
    name: 'Grilled Salmon',
    name_ar: 'سلمون مشوي',
    category: 'Mains',
    category_ar: 'أطباق رئيسية',
    image: '/images/food-41e5d7.png',
    sellingPrice: 280.0,
    cogs: 98.0,
    fcp: 35.0,
    contributionMargin: 182.0,
    popularityScore: 79,
    popularityRank: 6,
    grossRevenue: 22400,
    grossProfit: 14560,
    addonRate: 31.0,
    refundRate: 1.2,
  },
  {
    id: 'm7',
    name: 'Iced Green Tea',
    name_ar: 'شاي أخضر مثلج',
    category: 'Drinks',
    category_ar: 'مشروبات',
    image: '/images/food-41e5d7.png',
    sellingPrice: 55.0,
    cogs: 8.25,
    fcp: 15.0,
    contributionMargin: 46.75,
    popularityScore: 76,
    popularityRank: 7,
    grossRevenue: 18150,
    grossProfit: 15427,
    addonRate: 19.5,
    refundRate: 0.1,
  },
  {
    id: 'm8',
    name: 'Mushroom Soup',
    name_ar: 'شوربة فطر',
    category: 'Sides',
    category_ar: 'أطباق جانبية',
    image: '/images/food-41e5d7.png',
    sellingPrice: 70.0,
    cogs: 21.0,
    fcp: 30.0,
    contributionMargin: 49.0,
    popularityScore: 68,
    popularityRank: 8,
    grossRevenue: 12600,
    grossProfit: 8820,
    addonRate: 24.8,
    refundRate: 0.9,
  },
];

type MetricColumnKey =
  | 'category'
  | 'cogs'
  | 'fcp'
  | 'contributionMargin'
  | 'popularity'
  | 'grossRevenue'
  | 'grossProfit'
  | 'addonRate'
  | 'refundRate';

interface ColumnDef {
  key: MetricColumnKey;
  label: string;
  label_ar: string;
  tooltip: string;
  tooltip_ar: string;
}

const ALL_COLUMNS: ColumnDef[] = [
  {
    key: 'category',
    label: 'Category',
    label_ar: 'الفئة',
    tooltip: 'Menu category of the item',
    tooltip_ar: 'فئة عنصر القائمة',
  },
  {
    key: 'cogs',
    label: 'COGS',
    label_ar: 'تكلفة المبيعات',
    tooltip: 'Cost of Goods Sold per item (ingredients cost)',
    tooltip_ar: 'تكلفة البضائع المباعة لكل عنصر',
  },
  {
    key: 'fcp',
    label: 'Food Cost %',
    label_ar: 'نسبة تكلفة الطعام',
    tooltip: 'Food Cost Percentage = (COGS / Selling Price) × 100',
    tooltip_ar: 'نسبة تكلفة الطعام من سعر البيع',
  },
  {
    key: 'contributionMargin',
    label: 'Contribution Margin',
    label_ar: 'هامش المساهمة',
    tooltip: 'Profit contribution per unit = Selling Price - COGS (in EGP)',
    tooltip_ar: 'هامش الربح لكل وحدة بعد خصم تكلفة المبيعات بالجنيه',
  },
  {
    key: 'popularity',
    label: 'Popularity Index',
    label_ar: 'مؤشر الشعبية',
    tooltip: 'Sales frequency rank & volume score',
    tooltip_ar: 'ترتيب ونسبة تكرار مبيعات العنصر',
  },
  {
    key: 'grossRevenue',
    label: 'Gross Revenue',
    label_ar: 'إجمالي الإيرادات',
    tooltip: 'Total sales revenue generated by this item',
    tooltip_ar: 'إجمالي المبيعات التي حققها هذا العنصر',
  },
  {
    key: 'grossProfit',
    label: 'Gross Profit',
    label_ar: 'إجمالي الربح',
    tooltip: 'Gross profit = Gross Revenue - Total COGS',
    tooltip_ar: 'إجمالي الربح الناتج عن هذا العنصر',
  },
  {
    key: 'addonRate',
    label: 'Add-on Rate',
    label_ar: 'معدل الإضافات',
    tooltip: 'How often ordering this dish drives the purchase of an extra or add-on',
    tooltip_ar: 'نسبة تحفيز الطبق لطلب إضافات أو أطباق جانبية',
  },
  {
    key: 'refundRate',
    label: 'Refund Rate',
    label_ar: 'معدل الاسترجاع',
    tooltip: 'Percentage of orders for this item that resulted in a refund or cancellation',
    tooltip_ar: 'نسبة الطلبات المسترجعة أو الملغاة لهذا العنصر',
  },
];

const DEFAULT_VISIBLE: Record<MetricColumnKey, boolean> = {
  category: true,
  cogs: true,
  fcp: true,
  contributionMargin: true,
  popularity: true,
  grossRevenue: true,
  grossProfit: true,
  addonRate: true,
  refundRate: true,
};

export function MenuItemAnalyticsTable() {
  const locale = useLocale();
  const isAr = locale === 'ar';

  const [visibleColumns, setVisibleColumns] = useState<Record<MetricColumnKey, boolean>>(DEFAULT_VISIBLE);
  const [showColumnPicker, setShowColumnPicker] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const categories = useMemo(() => {
    const set = new Set(MENU_ITEM_METRICS.map((m) => m.category));
    return ['All', ...Array.from(set)];
  }, []);

  const toggleColumn = (key: MetricColumnKey) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const showAllColumns = () => {
    const allTrue = { ...visibleColumns };
    for (const k of Object.keys(allTrue) as MetricColumnKey[]) {
      allTrue[k] = true;
    }
    setVisibleColumns(allTrue);
  };

  const resetDefaultColumns = () => {
    setVisibleColumns(DEFAULT_VISIBLE);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortField(field);
      // Default to ascending for text, descending (highest first) for metrics
      setSortDirection(field === 'name' || field === 'category' ? 'asc' : 'desc');
    }
  };

  const sortedAndFilteredItems = useMemo(() => {
    const list = MENU_ITEM_METRICS.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.name_ar.includes(search);
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCat;
    });

    if (!sortField) return list;

    return [...list].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'name': {
          const aVal = isAr ? a.name_ar : a.name;
          const bVal = isAr ? b.name_ar : b.name;
          cmp = aVal.localeCompare(bVal);
          break;
        }
        case 'category': {
          const aVal = isAr ? a.category_ar : a.category;
          const bVal = isAr ? b.category_ar : b.category;
          cmp = aVal.localeCompare(bVal);
          break;
        }
        case 'cogs':
          cmp = a.cogs - b.cogs;
          break;
        case 'fcp':
          cmp = a.fcp - b.fcp;
          break;
        case 'contributionMargin':
          cmp = a.contributionMargin - b.contributionMargin;
          break;
        case 'popularity':
          cmp = a.popularityScore - b.popularityScore;
          break;
        case 'grossRevenue':
          cmp = a.grossRevenue - b.grossRevenue;
          break;
        case 'grossProfit':
          cmp = a.grossProfit - b.grossProfit;
          break;
        case 'addonRate':
          cmp = a.addonRate - b.addonRate;
          break;
        case 'refundRate':
          cmp = a.refundRate - b.refundRate;
          break;
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [search, selectedCategory, sortField, sortDirection, isAr]);

  const handleExportExcel = () => {
    const exportRows = sortedAndFilteredItems.map((item) => ({
      'Menu Item': isAr ? item.name_ar : item.name,
      'Category': isAr ? item.category_ar : item.category,
      'Selling Price (EGP)': item.sellingPrice,
      'COGS (EGP)': item.cogs,
      'Food Cost %': `${item.fcp}%`,
      'Contribution Margin (EGP)': item.contributionMargin,
      'Popularity Score': item.popularityScore,
      'Popularity Rank': `#${item.popularityRank}`,
      'Gross Revenue (EGP)': item.grossRevenue,
      'Gross Profit (EGP)': item.grossProfit,
      'Add-on Rate %': `${item.addonRate}%`,
      'Refund Rate %': `${item.refundRate}%`,
    }));
    exportTableToExcel(
      exportRows,
      `Menu_Item_Analytics_${new Date().toISOString().split('T')[0]}`,
      'Item Economics',
    );
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-[0px_1px_2px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-[#2D2F33] sm:text-xl">
              {isAr ? 'اقتصاديات وأداء عناصر القائمة' : 'Menu Item Performance & Unit Economics'}
            </h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#E6F1ED] px-2.5 py-0.5 text-xs font-semibold text-[#026F4F]">
              <Coins size={12} />
              EGP
            </span>
          </div>
          <p className="mt-1 text-xs text-[#989898] sm:text-sm">
            {isAr
              ? 'تحليل تكلفة المبيعات، نسبة تكلفة الطعام، هامش المساهمة، الشعبية، ومعدل الإضافات'
              : 'Detailed breakdown of COGS, food cost percentage, contribution margin, popularity index, and add-on rates'}
          </p>
        </div>

        {/* Column Picker Trigger & Category / Search Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search box */}
          <div className="relative">
            <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-[#989898]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isAr ? 'بحث عن عنصر...' : 'Search item...'}
              className="h-10 w-40 rounded-xl border border-neutral-200 bg-[#F8F9FA] ps-9 pe-3 text-xs text-[#2D2F33] outline-none transition-all focus:w-56 focus:border-emerald-600 sm:text-sm"
            />
          </div>

          {/* Export to Excel (Bug-11) */}
          <button
            type="button"
            onClick={handleExportExcel}
            className="flex h-10 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 text-xs font-medium text-[#2D2F33] transition-colors hover:bg-neutral-50 sm:text-sm"
            title={isAr ? 'تصدير كملف إكسل' : 'Export as Excel spreadsheet'}
          >
            <Download size={15} />
            <span>{isAr ? 'تصدير إكسل' : 'Export Excel'}</span>
          </button>

          {/* Pick & Hide Analytics Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowColumnPicker((v) => !v)}
              className={cn(
                'flex h-10 items-center gap-2 rounded-xl border px-3 text-xs font-medium transition-colors sm:text-sm',
                showColumnPicker
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                  : 'border-neutral-200 bg-white text-[#2D2F33] hover:bg-neutral-50',
              )}
            >
              <SlidersHorizontal size={15} />
              <span>{isAr ? 'تخصيص المؤشرات' : 'Customize Analytics'}</span>
              <ChevronDown size={14} className={cn('transition-transform', showColumnPicker && 'rotate-180')} />
            </button>

            {/* Dropdown Menu */}
            {showColumnPicker && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setShowColumnPicker(false)} />
                <div className="absolute end-0 top-full z-30 mt-2 w-72 rounded-2xl border border-neutral-100 bg-white p-3 shadow-xl">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                    <span className="text-xs font-bold text-[#2D2F33]">
                      {isAr ? 'إظهار / إخفاء المؤشرات' : 'Show / Hide Analytics'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={showAllColumns}
                        className="text-[11px] font-medium text-emerald-700 hover:underline"
                      >
                        {isAr ? 'الكل' : 'All'}
                      </button>
                      <span className="text-neutral-300">|</span>
                      <button
                        onClick={resetDefaultColumns}
                        className="flex items-center gap-1 text-[11px] font-medium text-neutral-500 hover:underline"
                      >
                        <RotateCcw size={10} />
                        {isAr ? 'افتراضي' : 'Reset'}
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 flex max-h-64 flex-col gap-1 overflow-y-auto pr-1">
                    {ALL_COLUMNS.map((col) => {
                      const isChecked = visibleColumns[col.key];
                      return (
                        <label
                          key={col.key}
                          className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 transition-colors hover:bg-neutral-50"
                        >
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-[#2D2F33]">
                              {isAr ? col.label_ar : col.label}
                            </span>
                            <span className="text-[10px] text-[#989898]">
                              {isAr ? col.tooltip_ar : col.tooltip}
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleColumn(col.key)}
                            className="size-4 rounded accent-emerald-700"
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              selectedCategory === cat
                ? 'bg-[#026F4F] text-white'
                : 'bg-neutral-100 text-[#686868] hover:bg-neutral-200',
            )}
          >
            {cat === 'All' ? (isAr ? 'الكل' : 'All') : cat}
          </button>
        ))}
      </div>

      {/* Analytics Table */}
      <div className="overflow-x-auto rounded-xl border border-neutral-100">
        <table className="w-full min-w-[960px] table-auto text-start">
          <thead>
            <tr className="border-b border-neutral-200 bg-[#F8F9FA] text-xs font-semibold uppercase tracking-wider text-[#686868]">
              {/* Fixed Item column */}
              <th
                onClick={() => handleSort('name')}
                className={cn(
                  'group cursor-pointer select-none px-4 py-3.5 text-start transition-colors hover:bg-neutral-100',
                  sortField === 'name' && 'bg-emerald-50 text-emerald-800',
                )}
                title={isAr ? 'اضغط للترتيب حسب اسم العنصر' : 'Click to sort by menu item'}
              >
                <div className="inline-flex items-center gap-1.5">
                  <span>{isAr ? 'العنصر' : 'Menu Item'}</span>
                  {sortField === 'name' ? (
                    sortDirection === 'asc' ? <ArrowUp size={13} className="text-emerald-700" /> : <ArrowDown size={13} className="text-emerald-700" />
                  ) : (
                    <ArrowUpDown size={12} className="opacity-0 transition-opacity text-neutral-400 group-hover:opacity-60" />
                  )}
                </div>
              </th>

              {visibleColumns.category && (
                <th
                  onClick={() => handleSort('category')}
                  className={cn(
                    'group cursor-pointer select-none px-3 py-3.5 text-center transition-colors hover:bg-neutral-100',
                    sortField === 'category' && 'bg-emerald-50 text-emerald-800',
                  )}
                  title={isAr ? 'اضغط للترتيب حسب الفئة' : 'Click to sort by category'}
                >
                  <div className="inline-flex items-center justify-center gap-1.5">
                    <span>{isAr ? 'الفئة' : 'Category'}</span>
                    {sortField === 'category' ? (
                      sortDirection === 'asc' ? <ArrowUp size={13} className="text-emerald-700" /> : <ArrowDown size={13} className="text-emerald-700" />
                    ) : (
                      <ArrowUpDown size={12} className="opacity-0 transition-opacity text-neutral-400 group-hover:opacity-60" />
                    )}
                  </div>
                </th>
              )}

              {visibleColumns.cogs && (
                <th
                  onClick={() => handleSort('cogs')}
                  className={cn(
                    'group cursor-pointer select-none px-3 py-3.5 text-center transition-colors hover:bg-neutral-100',
                    sortField === 'cogs' && 'bg-emerald-50 text-emerald-800',
                  )}
                  title={isAr ? 'اضغط للترتيب حسب تكلفة المبيعات' : 'Click to sort by COGS'}
                >
                  <div className="inline-flex items-center justify-center gap-1.5">
                    <span>{isAr ? 'تكلفة المبيعات (COGS)' : 'COGS'}</span>
                    {sortField === 'cogs' ? (
                      sortDirection === 'asc' ? <ArrowUp size={13} className="text-emerald-700" /> : <ArrowDown size={13} className="text-emerald-700" />
                    ) : (
                      <ArrowUpDown size={12} className="opacity-0 transition-opacity text-neutral-400 group-hover:opacity-60" />
                    )}
                  </div>
                </th>
              )}

              {visibleColumns.fcp && (
                <th
                  onClick={() => handleSort('fcp')}
                  className={cn(
                    'group cursor-pointer select-none px-3 py-3.5 text-center transition-colors hover:bg-neutral-100',
                    sortField === 'fcp' && 'bg-emerald-50 text-emerald-800',
                  )}
                  title={isAr ? 'اضغط للترتيب حسب نسبة تكلفة الطعام' : 'Click to sort by Food Cost %'}
                >
                  <div className="inline-flex items-center justify-center gap-1.5">
                    <span>{isAr ? 'نسبة تكلفة الطعام (FCP)' : 'Food Cost %'}</span>
                    {sortField === 'fcp' ? (
                      sortDirection === 'asc' ? <ArrowUp size={13} className="text-emerald-700" /> : <ArrowDown size={13} className="text-emerald-700" />
                    ) : (
                      <ArrowUpDown size={12} className="opacity-0 transition-opacity text-neutral-400 group-hover:opacity-60" />
                    )}
                  </div>
                </th>
              )}

              {visibleColumns.contributionMargin && (
                <th
                  onClick={() => handleSort('contributionMargin')}
                  className={cn(
                    'group cursor-pointer select-none px-3 py-3.5 text-center transition-colors hover:bg-neutral-100',
                    sortField === 'contributionMargin' && 'bg-emerald-50 text-emerald-800',
                  )}
                  title={isAr ? 'اضغط للترتيب حسب هامش المساهمة' : 'Click to sort by Contribution Margin'}
                >
                  <div className="inline-flex items-center justify-center gap-1.5">
                    <span>{isAr ? 'هامش المساهمة' : 'Contrib. Margin'}</span>
                    {sortField === 'contributionMargin' ? (
                      sortDirection === 'asc' ? <ArrowUp size={13} className="text-emerald-700" /> : <ArrowDown size={13} className="text-emerald-700" />
                    ) : (
                      <ArrowUpDown size={12} className="opacity-0 transition-opacity text-neutral-400 group-hover:opacity-60" />
                    )}
                  </div>
                </th>
              )}

              {visibleColumns.popularity && (
                <th
                  onClick={() => handleSort('popularity')}
                  className={cn(
                    'group cursor-pointer select-none px-3 py-3.5 text-center transition-colors hover:bg-neutral-100',
                    sortField === 'popularity' && 'bg-emerald-50 text-emerald-800',
                  )}
                  title={isAr ? 'اضغط للترتيب حسب مؤشر الشعبية' : 'Click to sort by Popularity Index'}
                >
                  <div className="inline-flex items-center justify-center gap-1.5">
                    <span>{isAr ? 'مؤشر الشعبية' : 'Popularity Index'}</span>
                    {sortField === 'popularity' ? (
                      sortDirection === 'asc' ? <ArrowUp size={13} className="text-emerald-700" /> : <ArrowDown size={13} className="text-emerald-700" />
                    ) : (
                      <ArrowUpDown size={12} className="opacity-0 transition-opacity text-neutral-400 group-hover:opacity-60" />
                    )}
                  </div>
                </th>
              )}

              {visibleColumns.grossRevenue && (
                <th
                  onClick={() => handleSort('grossRevenue')}
                  className={cn(
                    'group cursor-pointer select-none px-3 py-3.5 text-center transition-colors hover:bg-neutral-100',
                    sortField === 'grossRevenue' && 'bg-emerald-50 text-emerald-800',
                  )}
                  title={isAr ? 'اضغط للترتيب حسب إجمالي الإيرادات' : 'Click to sort by Gross Revenue'}
                >
                  <div className="inline-flex items-center justify-center gap-1.5">
                    <span>{isAr ? 'إجمالي الإيرادات' : 'Gross Revenue'}</span>
                    {sortField === 'grossRevenue' ? (
                      sortDirection === 'asc' ? <ArrowUp size={13} className="text-emerald-700" /> : <ArrowDown size={13} className="text-emerald-700" />
                    ) : (
                      <ArrowUpDown size={12} className="opacity-0 transition-opacity text-neutral-400 group-hover:opacity-60" />
                    )}
                  </div>
                </th>
              )}

              {visibleColumns.grossProfit && (
                <th
                  onClick={() => handleSort('grossProfit')}
                  className={cn(
                    'group cursor-pointer select-none px-3 py-3.5 text-center transition-colors hover:bg-neutral-100',
                    sortField === 'grossProfit' && 'bg-emerald-50 text-emerald-800',
                  )}
                  title={isAr ? 'اضغط للترتيب حسب إجمالي الربح' : 'Click to sort by Gross Profit'}
                >
                  <div className="inline-flex items-center justify-center gap-1.5">
                    <span>{isAr ? 'إجمالي الربح' : 'Gross Profit'}</span>
                    {sortField === 'grossProfit' ? (
                      sortDirection === 'asc' ? <ArrowUp size={13} className="text-emerald-700" /> : <ArrowDown size={13} className="text-emerald-700" />
                    ) : (
                      <ArrowUpDown size={12} className="opacity-0 transition-opacity text-neutral-400 group-hover:opacity-60" />
                    )}
                  </div>
                </th>
              )}

              {visibleColumns.addonRate && (
                <th
                  onClick={() => handleSort('addonRate')}
                  className={cn(
                    'group cursor-pointer select-none px-3 py-3.5 text-center transition-colors hover:bg-neutral-100',
                    sortField === 'addonRate' && 'bg-emerald-50 text-emerald-800',
                  )}
                  title={isAr ? 'اضغط للترتيب حسب معدل الإضافات' : 'Click to sort by Add-on Rate'}
                >
                  <div className="inline-flex items-center justify-center gap-1.5">
                    <span>{isAr ? 'معدل الإضافات' : 'Add-on Rate'}</span>
                    {sortField === 'addonRate' ? (
                      sortDirection === 'asc' ? <ArrowUp size={13} className="text-emerald-700" /> : <ArrowDown size={13} className="text-emerald-700" />
                    ) : (
                      <ArrowUpDown size={12} className="opacity-0 transition-opacity text-neutral-400 group-hover:opacity-60" />
                    )}
                  </div>
                </th>
              )}

              {visibleColumns.refundRate && (
                <th
                  onClick={() => handleSort('refundRate')}
                  className={cn(
                    'group cursor-pointer select-none px-3 py-3.5 text-center transition-colors hover:bg-neutral-100',
                    sortField === 'refundRate' && 'bg-emerald-50 text-emerald-800',
                  )}
                  title={isAr ? 'اضغط للترتيب حسب معدل الاسترجاع' : 'Click to sort by Refund Rate'}
                >
                  <div className="inline-flex items-center justify-center gap-1.5">
                    <span>{isAr ? 'معدل الاسترجاع' : 'Refund Rate'}</span>
                    {sortField === 'refundRate' ? (
                      sortDirection === 'asc' ? <ArrowUp size={13} className="text-emerald-700" /> : <ArrowDown size={13} className="text-emerald-700" />
                    ) : (
                      <ArrowUpDown size={12} className="opacity-0 transition-opacity text-neutral-400 group-hover:opacity-60" />
                    )}
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 text-sm">
            {sortedAndFilteredItems.map((item) => {
              const displayName = isAr ? item.name_ar : item.name;
              const displayCategory = isAr ? item.category_ar : item.category;

              // Food cost health badge
              const fcpBadge =
                item.fcp <= 25
                  ? 'bg-emerald-50 text-emerald-700'
                  : item.fcp <= 30
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-amber-50 text-amber-700';

              return (
                <tr key={item.id} className="transition-colors hover:bg-neutral-50/70">
                  {/* Item info */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                        <Image
                          src={item.image}
                          alt={displayName}
                          fill
                          sizes="40px"
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#2D2F33]">{displayName}</span>
                        <span className="font-satoshi text-xs text-[#026F4F]">
                          EGP {item.sellingPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  {visibleColumns.category && (
                    <td className="px-3 py-3 text-center">
                      <span className="inline-flex rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs text-[#686868]">
                        {displayCategory}
                      </span>
                    </td>
                  )}

                  {/* COGS (in EGP) */}
                  {visibleColumns.cogs && (
                    <td className="px-3 py-3 text-center font-satoshi font-medium text-[#2D2F33]">
                      EGP {item.cogs.toFixed(2)}
                    </td>
                  )}

                  {/* Food Cost Percentage */}
                  {visibleColumns.fcp && (
                    <td className="px-3 py-3 text-center">
                      <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold', fcpBadge)}>
                        {item.fcp.toFixed(1)}%
                      </span>
                    </td>
                  )}

                  {/* Contribution Margin (in EGP) */}
                  {visibleColumns.contributionMargin && (
                    <td className="px-3 py-3 text-center font-satoshi font-semibold text-[#026F4F]">
                      EGP {item.contributionMargin.toFixed(2)}
                    </td>
                  )}

                  {/* Popularity Index */}
                  {visibleColumns.popularity && (
                    <td className="px-3 py-3 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <span className="font-semibold text-amber-600">#{item.popularityRank}</span>
                        <span className="text-xs text-[#989898]">({item.popularityScore}/100)</span>
                      </div>
                    </td>
                  )}

                  {/* Gross Revenue */}
                  {visibleColumns.grossRevenue && (
                    <td className="px-3 py-3 text-center font-satoshi font-semibold text-[#2D2F33]">
                      EGP {item.grossRevenue.toLocaleString()}
                    </td>
                  )}

                  {/* Gross Profit */}
                  {visibleColumns.grossProfit && (
                    <td className="px-3 py-3 text-center font-satoshi font-bold text-[#026F4F]">
                      EGP {item.grossProfit.toLocaleString()}
                    </td>
                  )}

                  {/* Add-on Rate */}
                  {visibleColumns.addonRate && (
                    <td className="px-3 py-3 text-center font-satoshi text-xs font-medium text-indigo-700">
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-indigo-50 px-2 py-0.5">
                        <TrendingUp size={11} />
                        {item.addonRate.toFixed(1)}%
                      </span>
                    </td>
                  )}

                  {/* Refund Rate */}
                  {visibleColumns.refundRate && (
                    <td className="px-3 py-3 text-center font-satoshi text-xs text-[#989898]">
                      {item.refundRate.toFixed(1)}%
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

