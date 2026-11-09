'use client';

import { useState, useMemo, useEffect } from 'react';
import { useLocale } from 'next-intl';
import {
  Tag,
  Search,
  Plus,
  Download,
  Copy,
  Check,
  Percent,
  Coins,
  Gift,
  Calendar,
  Clock,
  Building,
  Layers,
  UtensilsCrossed,
  X,
  ChevronDown,
  Edit2,
  Trash2,
  Eye,
  Play,
  Pause,
  AlertCircle,
  FileSpreadsheet,
  Info,
  Sparkles,
} from 'lucide-react';
import { cn, lockPageScroll } from '@/lib/utils';
import { exportTableToExcel } from '@/lib/exportExcel';
import {
  PromoCode,
  DiscountType,
  AppliesToType,
  OrderType,
  PromoStatus,
  INITIAL_PROMOTIONS,
  loadPromotions,
  savePromotions,
  generateRandomCode,
  bulkGenerateCodesCsv,
} from '@/data/promotions';

const CATEGORY_CHOICES = ['Burgers', 'Ramen', 'Sides', 'Drinks', 'Mains', 'Desserts'];
const BRANCH_CHOICES = ['All Branches', 'Dhanmondi (Main)', 'Downtown', 'New Cairo'];
const DAYS = [
  { id: 'mon', label: 'Mon', label_ar: 'إثنين' },
  { id: 'tue', label: 'Tue', label_ar: 'ثلاثاء' },
  { id: 'wed', label: 'Wed', label_ar: 'أربعاء' },
  { id: 'thu', label: 'Thu', label_ar: 'خميس' },
  { id: 'fri', label: 'Fri', label_ar: 'جمعة' },
  { id: 'sat', label: 'Sat', label_ar: 'سبت' },
  { id: 'sun', label: 'Sun', label_ar: 'أحد' },
];

export default function PromotionsPage() {
  const locale = useLocale();
  const isAr = locale === 'ar';

  const [promotions, setPromotions] = useState<PromoCode[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PromoStatus>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modals & Drawers
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  const [viewingReport, setViewingReport] = useState<PromoCode | null>(null);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);

  useEffect(() => {
    setPromotions(loadPromotions());
  }, []);

  const persistPromotions = (updated: PromoCode[]) => {
    setPromotions(updated);
    savePromotions(updated);
  };

  // KPI calculations
  const stats = useMemo(() => {
    const total = promotions.length;
    const active = promotions.filter((p) => p.status === 'active').length;
    const totalUses = promotions.reduce((acc, p) => acc + (p.currentUses || 0), 0);
    const totalDiscount = promotions.reduce((acc, p) => acc + (p.totalDiscountGiven || 0), 0);
    const totalRevenue = promotions.reduce((acc, p) => acc + (p.revenueGenerated || 0), 0);
    return { total, active, totalUses, totalDiscount, totalRevenue };
  }, [promotions]);

  // Filtered Promotions
  const filteredPromos = useMemo(() => {
    const q = search.trim().toLowerCase();
    return promotions.filter((p) => {
      const matchSearch =
        !q ||
        p.code.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        (p.name_ar && p.name_ar.includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q));

      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [promotions, search, statusFilter]);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const toggleStatus = (id: string) => {
    const updated = promotions.map((p) => {
      if (p.id !== id) return p;
      const nextStatus: PromoStatus = p.status === 'active' ? 'paused' : 'active';
      return { ...p, status: nextStatus };
    });
    persistPromotions(updated);
  };

  const deletePromo = (id: string) => {
    if (!confirm(isAr ? 'هل أنت متأكد من حذف هذا الرمز الترويجي؟' : 'Are you sure you want to delete this promo code?')) return;
    const updated = promotions.filter((p) => p.id !== id);
    persistPromotions(updated);
    if (viewingReport?.id === id) setViewingReport(null);
  };

  const handleSavePromo = (saved: PromoCode) => {
    const exists = promotions.some((p) => p.id === saved.id);
    const updated = exists
      ? promotions.map((p) => (p.id === saved.id ? saved : p))
      : [saved, ...promotions];
    persistPromotions(updated);
    setIsFormOpen(false);
    setEditingPromo(null);
    if (viewingReport?.id === saved.id) setViewingReport(saved);
  };

  // Export all promotions to Excel
  const handleExportAll = () => {
    const rows = filteredPromos.map((p) => ({
      'Promo Code': p.code,
      'Internal Name': isAr ? p.name_ar || p.name : p.name,
      'Discount Type': p.discountType,
      'Discount Value': p.discountType === 'percent' ? `${p.discountValue}%` : `EGP ${p.discountValue}`,
      'Max Cap (EGP)': p.maxDiscountCap || 'None',
      'Applies To': p.appliesTo,
      'Min Order (EGP)': p.minOrderAmount,
      'Channels': p.orderTypes.join(', '),
      'Status': p.status,
      'Uses': `${p.currentUses} / ${p.totalUsageLimit || 'Unlimited'}`,
      'Total Discount Given (EGP)': p.totalDiscountGiven,
      'Total Revenue (EGP)': p.revenueGenerated,
      'Validity': `${p.startDate} to ${p.endDate} (Cairo Time)`,
    }));
    exportTableToExcel(rows, `Promotions_Report_${new Date().toISOString().split('T')[0]}`, 'Promotions');
  };

  const openNewPromoModal = () => {
    const newPromo: PromoCode = {
      id: `pr-${Date.now()}`,
      code: generateRandomCode('OFFER'),
      name: '',
      description: '',
      discountType: 'percent',
      discountValue: 15,
      maxDiscountCap: 50,
      appliesTo: 'whole_order',
      orderTypes: ['dine_in', 'takeaway', 'delivery', 'qr'],
      minOrderAmount: 100,
      validDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
      allDay: true,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      timezone: 'Cairo Time (UTC+2)',
      totalUsageLimit: 200,
      currentUses: 0,
      canCombineWithOtherOffers: false,
      branches: 'all',
      status: 'active',
      totalDiscountGiven: 0,
      revenueGenerated: 0,
    };
    setEditingPromo(newPromo);
    setIsFormOpen(true);
  };

  return (
    <main className="flex flex-col gap-5">
      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-[22px] font-medium leading-[30px] text-[#2D2F33] sm:text-[26px] sm:leading-[36px] xl:text-[30px] xl:leading-[40px]">
            {isAr ? 'العروض والخصومات' : 'Promotions & Promo Codes'}
          </h1>
          <p className="text-[13px] text-[#989898] sm:text-[15px] xl:text-base">
            {isAr
              ? 'إنشاء أكواد الخصم، تطبيق الشروط وقواعد الخصم، ومتابعة تقارير الاستخدام والمبيعات'
              : 'Create promo codes, manage discount rules and limits, track usage revenue across POS & QR apps'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setBulkModalOpen(true)}
            className="flex h-11 items-center gap-2 rounded-[59px] border border-neutral-300 bg-white px-4 text-xs font-medium text-[#2D2F33] transition-colors hover:bg-neutral-50 sm:text-sm"
          >
            <Layers size={16} />
            <span>{isAr ? 'توليد أكواد بالجملة (CSV)' : 'Bulk Codes (CSV)'}</span>
          </button>
          <button
            onClick={handleExportAll}
            className="flex h-11 items-center gap-2 rounded-[59px] border border-neutral-300 bg-white px-4 text-xs font-medium text-[#2D2F33] transition-colors hover:bg-neutral-50 sm:text-sm"
          >
            <Download size={16} />
            <span>{isAr ? 'تصدير إكسل' : 'Export Excel'}</span>
          </button>
          <button
            onClick={openNewPromoModal}
            className="flex h-11 items-center gap-2 rounded-[59px] bg-[#026F4F] px-5 text-xs font-medium text-white shadow transition-colors hover:bg-emerald-800 sm:text-sm"
          >
            <Plus size={18} />
            <span>{isAr ? 'إنشاء كود خصم' : 'Create Promo Code'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col justify-between rounded-2xl bg-white p-5 shadow-sm">
          <span className="text-xs font-medium text-[#989898] uppercase tracking-wider">{isAr ? 'العروض النشطة' : 'Active Promotions'}</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-700">{stats.active}</span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
              {stats.total} {isAr ? 'إجمالي' : 'Total'}
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl bg-white p-5 shadow-sm">
          <span className="text-xs font-medium text-[#989898] uppercase tracking-wider">{isAr ? 'عدد مرات الاستخدام' : 'Total Redemptions'}</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#2D2F33]">{stats.totalUses.toLocaleString()}</span>
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-[#686868]">{isAr ? 'طلبات' : 'Orders'}</span>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl bg-white p-5 shadow-sm">
          <span className="text-xs font-medium text-[#989898] uppercase tracking-wider">{isAr ? 'إجمالي الخصومات الممنوحة' : 'Total Discounts Given'}</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-600">EGP {stats.totalDiscount.toLocaleString()}</span>
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">{isAr ? 'توفير للعملاء' : 'Saved'}</span>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl bg-white p-5 shadow-sm">
          <span className="text-xs font-medium text-[#989898] uppercase tracking-wider">{isAr ? 'المبيعات الناتجة عن العروض' : 'Revenue via Promos'}</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#026F4F]">EGP {stats.totalRevenue.toLocaleString()}</span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-[#026F4F]">Gross</span>
          </div>
        </div>
      </div>

      {/* Bill Calculation Sequence Alert */}
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs text-emerald-950 sm:text-sm">
        <Info size={20} className="shrink-0 text-[#026F4F]" />
        <div>
          <span className="font-bold">{isAr ? 'ترتيب احتساب الفاتورة الموحد:' : 'Bill Calculation Order:'}</span>{' '}
          <span className="font-satoshi font-semibold">Subtotal → Discount → Service Charge → VAT → Total</span>{' '}
          <span className="text-emerald-800">
            {isAr
              ? '(يتم الاحتساب بنفس المعادلة تلقائياً في تطبيق العميل QR وكاشير نقاط البيع).'
              : '(Guaranteed identical calculation across Cashier POS and Customer QR Cart).'}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm">
        <div className="relative min-w-[240px] flex-1 sm:max-w-md">
          <Search size={18} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-[#989898]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isAr ? 'بحث بالكود أو اسم العرض...' : 'Search by code or internal name...'}
            className="h-11 w-full rounded-xl border border-neutral-200 bg-[#F8F9FA] ps-10 pe-4 text-xs font-satoshi text-[#2D2F33] outline-none transition-colors focus:border-emerald-600 sm:text-sm"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap items-center rounded-xl bg-neutral-100 p-1">
          {(
            [
              { id: 'all', label: isAr ? 'الكل' : 'All' },
              { id: 'active', label: isAr ? 'نشط' : 'Active' },
              { id: 'paused', label: isAr ? 'متوقف مؤقتاً' : 'Paused' },
              { id: 'scheduled', label: isAr ? 'مجدول' : 'Scheduled' },
              { id: 'expired', label: isAr ? 'منتهي' : 'Expired' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm',
                statusFilter === tab.id
                  ? 'bg-white text-[#2D2F33] shadow-sm font-semibold'
                  : 'text-[#686868] hover:text-[#2D2F33]',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Promo Codes Cards / Table */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filteredPromos.length === 0 ? (
          <div className="col-span-full flex h-48 flex-col items-center justify-center rounded-2xl bg-white p-6 text-center shadow-sm">
            <Tag size={36} className="text-[#989898]" />
            <p className="mt-2 text-base font-semibold text-[#2D2F33]">{isAr ? 'لا توجد عروض مطابقة' : 'No promotions match your filter'}</p>
            <p className="text-xs text-[#989898]">{isAr ? 'جرّب تعديل البحث أو أنشئ كوداً جديداً' : 'Try searching for something else or create a new code'}</p>
          </div>
        ) : (
          filteredPromos.map((promo) => {
            const isPercent = promo.discountType === 'percent';
            const isFixed = promo.discountType === 'fixed';
            const isFree = promo.discountType === 'free_item';
            const isBogo = promo.discountType === 'bogo';

            const discountDisplay = isPercent
              ? `${promo.discountValue}% OFF${promo.maxDiscountCap ? ` (Max EGP ${promo.maxDiscountCap})` : ''}`
              : isFixed
                ? `EGP ${promo.discountValue} OFF`
                : isFree
                  ? `Free: ${promo.freeItemName || 'Item'}`
                  : `Buy ${promo.bogoBuyQty || 1} Get ${promo.bogoGetQty || 1} Free`;

            const usagePercent = promo.totalUsageLimit
              ? Math.min(Math.round((promo.currentUses / promo.totalUsageLimit) * 100), 100)
              : null;

            return (
              <div
                key={promo.id}
                className="flex flex-col justify-between rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm transition-all hover:border-neutral-200"
              >
                <div>
                  {/* Top row: Code + Status Badge */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 rounded-xl border border-dashed border-[#026F4F] bg-[#E6F1ED]/50 px-3 py-1 font-mono text-sm font-bold text-[#026F4F]">
                        <span>{promo.code}</span>
                        <button
                          onClick={() => copyToClipboard(promo.code)}
                          className="text-[#026F4F]/70 hover:text-[#026F4F]"
                          title="Copy code"
                        >
                          {copiedCode === promo.code ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                      <span className="text-xs font-semibold text-[#2D2F33] sm:text-sm">
                        {isAr ? promo.name_ar || promo.name : promo.name}
                      </span>
                    </div>

                    <span
                      className={cn(
                        'rounded-full px-2.5 py-0.5 text-xs font-bold uppercase',
                        promo.status === 'active' && 'bg-emerald-100 text-emerald-800',
                        promo.status === 'paused' && 'bg-amber-100 text-amber-800',
                        promo.status === 'scheduled' && 'bg-blue-100 text-blue-800',
                        promo.status === 'expired' && 'bg-neutral-100 text-[#989898]',
                      )}
                    >
                      {promo.status}
                    </span>
                  </div>

                  {/* Description */}
                  {promo.description && (
                    <p className="mt-2 text-xs text-[#686868] line-clamp-1">{promo.description}</p>
                  )}

                  {/* Discount details badge */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-[#026F4F]">
                      {isPercent && <Percent size={13} />}
                      {isFixed && <Coins size={13} />}
                      {(isFree || isBogo) && <Gift size={13} />}
                      {discountDisplay}
                    </span>

                    <span className="rounded-lg bg-neutral-100 px-2 py-1 text-xs font-medium text-[#686868]">
                      Min EGP {promo.minOrderAmount}
                    </span>

                    <span className="rounded-lg bg-neutral-100 px-2 py-1 text-xs font-medium text-[#686868]">
                      {promo.appliesTo === 'whole_order'
                        ? isAr ? 'كامل الفاتورة' : 'Whole Order'
                        : promo.selectedCategories?.join(', ') || 'Selected'}
                    </span>
                  </div>

                  {/* Validity, Cairo Time window & Channels */}
                  <div className="mt-3 space-y-1.5 border-t border-neutral-100 pt-3 text-xs text-[#686868]">
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-[#989898]" />
                      <span>
                        {promo.allDay
                          ? isAr ? 'طوال اليوم' : 'All day'
                          : `${promo.timeWindow?.start} – ${promo.timeWindow?.end}`}{' '}
                        <strong className="text-neutral-700">(Cairo Time)</strong> ·{' '}
                        {promo.validDays.length === 7
                          ? isAr ? 'جميع الأيام' : 'All days'
                          : promo.validDays.map((d) => d.toUpperCase()).join(', ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-[#989898]" />
                      <span>
                        {promo.startDate} {isAr ? 'إلى' : 'to'} {promo.endDate}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1 text-[11px] text-[#989898]">
                      <span className="font-semibold text-neutral-600">{isAr ? 'القنوات المعتمدة:' : 'Channels:'}</span>
                      {promo.orderTypes.map((ot) => (
                        <span key={ot} className="rounded bg-neutral-100 px-1.5 py-0.5 uppercase font-mono text-[10px]">
                          {ot.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Usage Progress */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-[#989898] mb-1">
                      <span>{isAr ? 'الاستخدام:' : 'Usage:'}</span>
                      <span className="font-medium text-[#2D2F33]">
                        {promo.currentUses} / {promo.totalUsageLimit ? promo.totalUsageLimit : isAr ? 'بلا حدود' : 'Unlimited'}
                      </span>
                    </div>
                    {usagePercent !== null && (
                      <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
                        <div
                          className="h-full bg-[#026F4F] transition-all"
                          style={{ width: `${usagePercent}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Actions Row */}
                <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleStatus(promo.id)}
                      className={cn(
                        'flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors',
                        promo.status === 'active'
                          ? 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100',
                      )}
                      title={promo.status === 'active' ? 'Pause promo' : 'Activate promo'}
                    >
                      {promo.status === 'active' ? <Pause size={13} /> : <Play size={13} />}
                      <span>{promo.status === 'active' ? (isAr ? 'إيقاف' : 'Pause') : (isAr ? 'تفعيل' : 'Activate')}</span>
                    </button>

                    <button
                      onClick={() => setViewingReport(promo)}
                      className="flex items-center gap-1 rounded-lg bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-[#2D2F33] hover:bg-neutral-200"
                      title="View report"
                    >
                      <Eye size={13} />
                      <span>{isAr ? 'تقرير' : 'Report'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setEditingPromo(JSON.parse(JSON.stringify(promo)));
                        setIsFormOpen(true);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-[#686868] hover:bg-neutral-100"
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => deletePromo(promo.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-[#686868] hover:bg-red-50 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create / Edit Promo Drawer */}
      {isFormOpen && editingPromo && (
        <PromoFormDrawer
          promo={editingPromo}
          isAr={isAr}
          onClose={() => {
            setIsFormOpen(false);
            setEditingPromo(null);
          }}
          onSave={handleSavePromo}
        />
      )}

      {/* Code Report Drawer */}
      {viewingReport && (
        <PromoReportDrawer
          promo={viewingReport}
          isAr={isAr}
          onClose={() => setViewingReport(null)}
          onEdit={() => {
            const p = viewingReport;
            setViewingReport(null);
            setEditingPromo(JSON.parse(JSON.stringify(p)));
            setIsFormOpen(true);
          }}
        />
      )}

      {/* Bulk Generator Modal */}
      {bulkModalOpen && (
        <BulkGeneratorModal
          isAr={isAr}
          onClose={() => setBulkModalOpen(false)}
        />
      )}
    </main>
  );
}

/**
 * Create / Edit Promo Code Drawer
 */
function PromoFormDrawer({
  promo: initialPromo,
  isAr,
  onClose,
  onSave,
}: {
  promo: PromoCode;
  isAr: boolean;
  onClose: () => void;
  onSave: (p: PromoCode) => void;
}) {
  const [data, setData] = useState<PromoCode>(initialPromo);

  useEffect(() => {
    lockPageScroll(true);
    return () => lockPageScroll(false);
  }, []);

  const handleGenerateRandom = () => {
    setData((prev) => ({ ...prev, code: generateRandomCode('PROMO') }));
  };

  const toggleDay = (dayId: string) => {
    setData((prev) => {
      const exists = prev.validDays.includes(dayId);
      const updated = exists ? prev.validDays.filter((d) => d !== dayId) : [...prev.validDays, dayId];
      return { ...prev, validDays: updated };
    });
  };

  const toggleChannel = (channel: OrderType) => {
    setData((prev) => {
      const exists = prev.orderTypes.includes(channel);
      const updated = exists ? prev.orderTypes.filter((c) => c !== channel) : [...prev.orderTypes, channel];
      return { ...prev, orderTypes: updated.length ? updated : ['dine_in'] };
    });
  };

  const toggleCategory = (cat: string) => {
    setData((prev) => {
      const list = prev.selectedCategories || [];
      const exists = list.includes(cat);
      const updated = exists ? list.filter((c) => c !== cat) : [...list, cat];
      return { ...prev, selectedCategories: updated };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.code.trim() || !data.name.trim()) {
      alert(isAr ? 'يرجى إدخال كود الخصم واسم العرض' : 'Please provide promo code and internal name');
      return;
    }
    onSave(data);
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed end-0 top-0 z-50 flex h-full w-full flex-col bg-[#F8F9FA] shadow-2xl transition-transform duration-300 sm:w-[640px]">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-[#2D2F33] hover:bg-neutral-200"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold text-[#2D2F33]">
              {data.currentUses > 0 ? (isAr ? 'تعديل كود الخصم' : 'Edit Promo Code') : (isAr ? 'إنشاء كود خصم جديد' : 'Create Promo Code')}
            </h2>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col justify-between overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Code & Name Section */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-[#2D2F33] uppercase tracking-wider">{isAr ? 'بيانات الكود' : 'Code Identification'}</h3>

              <div>
                <label className="block text-xs font-semibold text-[#2D2F33] mb-1.5">{isAr ? 'كود الخصم (Promo Code) *' : 'Promo Code *'}</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={data.code}
                    onChange={(e) => setData({ ...data, code: e.target.value.toUpperCase().replace(/\s+/g, '') })}
                    placeholder="e.g. SUMMER25"
                    className="h-11 flex-1 rounded-xl border border-neutral-200 bg-[#F8F9FA] px-3.5 font-mono text-sm font-bold text-[#2D2F33] outline-none focus:border-emerald-600 uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateRandom}
                    className="flex items-center gap-1.5 rounded-xl border border-emerald-600 bg-emerald-50 px-3.5 text-xs font-bold text-[#026F4F] hover:bg-emerald-100"
                  >
                    <Sparkles size={14} />
                    <span>{isAr ? 'توليد عشوائي' : 'Generate'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D2F33] mb-1.5">{isAr ? 'اسم العرض الداخلي *' : 'Internal Name / Description *'}</label>
                <input
                  type="text"
                  required
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  placeholder="e.g. Summer Weekend 20% Off"
                  className="h-11 w-full rounded-xl border border-neutral-200 bg-[#F8F9FA] px-3.5 text-sm text-[#2D2F33] outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D2F33] mb-1.5">{isAr ? 'وصف ترويجي (يظهر للعميل في التطبيق)' : 'Customer-Facing Description'}</label>
                <textarea
                  value={data.description || ''}
                  onChange={(e) => setData({ ...data, description: e.target.value })}
                  placeholder="e.g. Enjoy 20% off all delicious ramen and burgers on weekdays!"
                  rows={2}
                  className="w-full rounded-xl border border-neutral-200 bg-[#F8F9FA] p-3 text-xs text-[#2D2F33] outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            {/* Discount Type & Value */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-[#2D2F33] uppercase tracking-wider">{isAr ? 'نوع وقيمة الخصم' : 'Discount Rule & Type'}</h3>

              {/* Type selector */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { id: 'percent' as const, label: isAr ? 'نسبة مئوية %' : '% Off', icon: Percent },
                  { id: 'fixed' as const, label: isAr ? 'خصم ثابت (ج.م)' : 'Fixed EGP Off', icon: Coins },
                  { id: 'free_item' as const, label: isAr ? 'صنف مجاني' : 'Free Item', icon: Gift },
                  { id: 'bogo' as const, label: isAr ? 'اشترِ X واحصل على Y' : 'Buy X Get Y', icon: Tag },
                ].map((type) => {
                  const Icon = type.icon;
                  const isSelected = data.discountType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setData({ ...data, discountType: type.id })}
                      className={cn(
                        'flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 text-center transition-all',
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                          : 'border-neutral-200 bg-[#F8F9FA] text-[#686868] hover:bg-neutral-100',
                      )}
                    >
                      <Icon size={18} />
                      <span className="text-xs">{type.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Value inputs */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {data.discountType === 'percent' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-[#2D2F33] mb-1.5">{isAr ? 'نسبة الخصم (%) *' : 'Discount Percentage (%) *'}</label>
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          max="100"
                          required
                          value={data.discountValue}
                          onChange={(e) => setData({ ...data, discountValue: Number(e.target.value) })}
                          className="h-11 w-full rounded-xl border border-neutral-200 bg-[#F8F9FA] ps-3.5 pe-8 text-sm font-bold text-[#2D2F33] outline-none focus:border-emerald-600"
                        />
                        <span className="absolute end-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#989898]">%</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#2D2F33] mb-1.5">{isAr ? 'الحد الأقصى للخصم (ج.م)' : 'Maximum Discount Cap (EGP)'}</label>
                      <input
                        type="number"
                        min="0"
                        value={data.maxDiscountCap || ''}
                        onChange={(e) => setData({ ...data, maxDiscountCap: e.target.value ? Number(e.target.value) : undefined })}
                        placeholder="e.g. 50 (optional)"
                        className="h-11 w-full rounded-xl border border-neutral-200 bg-[#F8F9FA] px-3.5 text-sm text-[#2D2F33] outline-none focus:border-emerald-600"
                      />
                    </div>
                  </>
                )}

                {data.discountType === 'fixed' && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#2D2F33] mb-1.5">{isAr ? 'قيمة الخصم الثابت (ج.م) *' : 'Discount Value (EGP) *'}</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        required
                        value={data.discountValue}
                        onChange={(e) => setData({ ...data, discountValue: Number(e.target.value) })}
                        className="h-11 w-full rounded-xl border border-neutral-200 bg-[#F8F9FA] ps-3.5 pe-12 text-sm font-bold text-[#2D2F33] outline-none focus:border-emerald-600"
                      />
                      <span className="absolute end-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#026F4F]">EGP</span>
                    </div>
                  </div>
                )}

                {data.discountType === 'free_item' && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#2D2F33] mb-1.5">{isAr ? 'اسم الصنف المجاني *' : 'Free Item Name *'}</label>
                    <input
                      type="text"
                      required
                      value={data.freeItemName || ''}
                      onChange={(e) => setData({ ...data, freeItemName: e.target.value })}
                      placeholder="e.g. Truffle Fries / Iced Green Tea"
                      className="h-11 w-full rounded-xl border border-neutral-200 bg-[#F8F9FA] px-3.5 text-sm text-[#2D2F33] outline-none focus:border-emerald-600"
                    />
                  </div>
                )}

                {data.discountType === 'bogo' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-[#2D2F33] mb-1.5">{isAr ? 'كمية الشراء (Buy X)' : 'Buy Quantity (X)'}</label>
                      <input
                        type="number"
                        min="1"
                        value={data.bogoBuyQty || 1}
                        onChange={(e) => setData({ ...data, bogoBuyQty: Number(e.target.value) })}
                        className="h-11 w-full rounded-xl border border-neutral-200 bg-[#F8F9FA] px-3.5 text-sm font-bold text-[#2D2F33] outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#2D2F33] mb-1.5">{isAr ? 'كمية المجان (Get Y)' : 'Get Free Quantity (Y)'}</label>
                      <input
                        type="number"
                        min="1"
                        value={data.bogoGetQty || 1}
                        onChange={(e) => setData({ ...data, bogoGetQty: Number(e.target.value) })}
                        className="h-11 w-full rounded-xl border border-neutral-200 bg-[#F8F9FA] px-3.5 text-sm font-bold text-[#2D2F33] outline-none focus:border-emerald-600"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Scope: Applies To & Minimum Spend */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-[#2D2F33] uppercase tracking-wider">{isAr ? 'نطاق التطبيق والحد الأدنى' : 'Scope & Minimum Spend'}</h3>

              <div>
                <label className="block text-xs font-semibold text-[#2D2F33] mb-1.5">{isAr ? 'ينطبق الخصم على:' : 'Applies to:'}</label>
                <div className="flex gap-2">
                  {[
                    { id: 'whole_order' as const, label: isAr ? 'كامل الفاتورة' : 'Whole Order' },
                    { id: 'categories' as const, label: isAr ? 'فئات محددة' : 'Selected Categories' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setData({ ...data, appliesTo: s.id })}
                      className={cn(
                        'flex-1 rounded-xl border py-2.5 text-xs font-semibold transition-all',
                        data.appliesTo === s.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                          : 'border-neutral-200 bg-[#F8F9FA] text-[#686868]',
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {data.appliesTo === 'categories' && (
                <div>
                  <label className="block text-xs font-semibold text-[#2D2F33] mb-2">{isAr ? 'حدد الفئات المشمولة:' : 'Select Included Categories:'}</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORY_CHOICES.map((cat) => {
                      const isSel = (data.selectedCategories || []).includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCategory(cat)}
                          className={cn(
                            'rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors',
                            isSel ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-neutral-200 bg-neutral-50 text-[#2D2F33]',
                          )}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#2D2F33] mb-1.5">{isAr ? 'الحد الأدنى لقيمة الطلب (ج.م) *' : 'Minimum Order Amount (EGP) *'}</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={data.minOrderAmount}
                  onChange={(e) => setData({ ...data, minOrderAmount: Number(e.target.value) })}
                  className="h-11 w-full rounded-xl border border-neutral-200 bg-[#F8F9FA] px-3.5 text-sm text-[#2D2F33] outline-none focus:border-emerald-600"
                />
              </div>

              {/* Order Types */}
              <div>
                <label className="block text-xs font-semibold text-[#2D2F33] mb-2">{isAr ? 'قنوات الطلب المؤهلة:' : 'Eligible Order Channels:'}</label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[
                    { id: 'dine_in' as const, label: isAr ? 'تناول بالمطعم' : 'Dine-In' },
                    { id: 'takeaway' as const, label: isAr ? 'سفري / استلام' : 'Takeaway' },
                    { id: 'delivery' as const, label: isAr ? 'توصيل' : 'Delivery' },
                    { id: 'qr' as const, label: isAr ? 'تطبيق QR' : 'QR Ordering' },
                  ].map((ch) => {
                    const isChecked = data.orderTypes.includes(ch.id);
                    return (
                      <label
                        key={ch.id}
                        className={cn(
                          'flex cursor-pointer items-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition-all',
                          isChecked ? 'border-emerald-600 bg-emerald-50 text-emerald-900' : 'border-neutral-200 bg-neutral-50 text-[#686868]',
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleChannel(ch.id)}
                          className="accent-emerald-700"
                        />
                        <span>{ch.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Time Window, Cairo Timezone & Validity */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#2D2F33] uppercase tracking-wider">{isAr ? 'الجدول الزمني (توقيت القاهرة)' : 'Schedule & Cairo Time Window'}</h3>
                <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-[#686868]">Africa/Cairo (EET)</span>
              </div>

              {/* Days of week */}
              <div>
                <label className="block text-xs font-semibold text-[#2D2F33] mb-1.5">{isAr ? 'أيام الصلاحية:' : 'Valid Days:'}</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((d) => {
                    const isSel = data.validDays.includes(d.id);
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => toggleDay(d.id)}
                        className={cn(
                          'h-9 w-11 rounded-lg text-xs font-bold transition-colors border',
                          isSel ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-neutral-200 bg-neutral-50 text-[#686868]',
                        )}
                      >
                        {isAr ? d.label_ar : d.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Window */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#2D2F33]">{isAr ? 'طوال اليوم؟' : 'All Day Valid?'}</label>
                  <input
                    type="checkbox"
                    checked={data.allDay}
                    onChange={(e) => setData({ ...data, allDay: e.target.checked })}
                    className="accent-emerald-700 size-4 cursor-pointer"
                  />
                </div>

                {!data.allDay && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="text-xs text-[#989898]">{isAr ? 'من الساعة:' : 'From:'}</span>
                      <input
                        type="time"
                        value={data.timeWindow?.start || '12:00'}
                        onChange={(e) =>
                          setData({
                            ...data,
                            timeWindow: { start: e.target.value, end: data.timeWindow?.end || '17:00' },
                          })
                        }
                        className="h-10 w-full rounded-lg border border-neutral-200 bg-[#F8F9FA] px-3 text-xs font-semibold text-[#2D2F33] outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-[#989898]">{isAr ? 'إلى الساعة:' : 'To:'}</span>
                      <input
                        type="time"
                        value={data.timeWindow?.end || '17:00'}
                        onChange={(e) =>
                          setData({
                            ...data,
                            timeWindow: { start: data.timeWindow?.start || '12:00', end: e.target.value },
                          })
                        }
                        className="h-10 w-full rounded-lg border border-neutral-200 bg-[#F8F9FA] px-3 text-xs font-semibold text-[#2D2F33] outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Start & End Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#2D2F33] mb-1">{isAr ? 'تاريخ البدء:' : 'Start Date:'}</label>
                  <input
                    type="date"
                    required
                    value={data.startDate}
                    onChange={(e) => setData({ ...data, startDate: e.target.value })}
                    className="h-10 w-full rounded-lg border border-neutral-200 bg-[#F8F9FA] px-3 text-xs font-medium text-[#2D2F33] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2D2F33] mb-1">{isAr ? 'تاريخ الانتهاء:' : 'End Date:'}</label>
                  <input
                    type="date"
                    required
                    value={data.endDate}
                    onChange={(e) => setData({ ...data, endDate: e.target.value })}
                    className="h-10 w-full rounded-lg border border-neutral-200 bg-[#F8F9FA] px-3 text-xs font-medium text-[#2D2F33] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Limits, Branches, Status */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-[#2D2F33] uppercase tracking-wider">{isAr ? 'القيود والحالة' : 'Limits, Combination & Status'}</h3>

              <div>
                <label className="block text-xs font-semibold text-[#2D2F33] mb-1.5">{isAr ? 'الحد الأقصى لمرات الاستخدام الكلية:' : 'Total Usage Limit:'}</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    disabled={data.totalUsageLimit === null}
                    value={data.totalUsageLimit ?? ''}
                    onChange={(e) =>
                      setData({ ...data, totalUsageLimit: e.target.value ? Number(e.target.value) : null })
                    }
                    placeholder="e.g. 500"
                    className="h-11 flex-1 rounded-xl border border-neutral-200 bg-[#F8F9FA] px-3.5 text-sm text-[#2D2F33] outline-none disabled:opacity-50"
                  />
                  <label className="flex items-center gap-1.5 text-xs font-medium text-[#2D2F33] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.totalUsageLimit === null}
                      onChange={(e) => setData({ ...data, totalUsageLimit: e.target.checked ? null : 200 })}
                      className="accent-emerald-700 size-4"
                    />
                    <span>{isAr ? 'غير محدود' : 'Unlimited'}</span>
                  </label>
                </div>
              </div>

              {/* Combine with other offers */}
              <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
                <div>
                  <span className="text-xs font-semibold text-[#2D2F33]">{isAr ? 'الدمج مع عروض أخرى:' : 'Can Combine with Other Offers?'}</span>
                  <p className="text-[11px] text-[#989898]">{isAr ? 'السماح بتطبيق الكود بجانب الخصومات التلقائية' : 'Allow stacking with existing menu promotions'}</p>
                </div>
                <input
                  type="checkbox"
                  checked={data.canCombineWithOtherOffers}
                  onChange={(e) => setData({ ...data, canCombineWithOtherOffers: e.target.checked })}
                  className="accent-emerald-700 size-5 cursor-pointer"
                />
              </div>

              {/* Status */}
              <div className="border-t border-neutral-100 pt-3">
                <label className="block text-xs font-semibold text-[#2D2F33] mb-1.5">{isAr ? 'حالة الكود:' : 'Initial Status:'}</label>
                <select
                  value={data.status}
                  onChange={(e) => setData({ ...data, status: e.target.value as PromoStatus })}
                  className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-xs font-semibold text-[#2D2F33] outline-none"
                >
                  <option value="active">{isAr ? 'نشط (Active)' : 'Active'}</option>
                  <option value="paused">{isAr ? 'متوقف مؤقتاً (Paused)' : 'Paused'}</option>
                  <option value="scheduled">{isAr ? 'مجدول (Scheduled)' : 'Scheduled'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Drawer Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-neutral-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-300 px-5 py-2.5 text-sm font-medium text-[#2D2F33] hover:bg-neutral-100"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#026F4F] px-6 py-2.5 text-sm font-bold text-white shadow hover:bg-emerald-800"
            >
              {isAr ? 'حفظ العرض' : 'Save Promo Code'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

/**
 * Promo Report Drawer
 */
function PromoReportDrawer({
  promo,
  isAr,
  onClose,
  onEdit,
}: {
  promo: PromoCode;
  isAr: boolean;
  onClose: () => void;
  onEdit: () => void;
}) {
  useEffect(() => {
    lockPageScroll(true);
    return () => lockPageScroll(false);
  }, []);

  const orders = promo.recentOrders || [];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed end-0 top-0 z-50 flex h-full w-full flex-col bg-[#F8F9FA] shadow-2xl transition-transform duration-300 sm:w-[580px]">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-[#2D2F33] hover:bg-neutral-200"
            >
              <X size={20} />
            </button>
            <div>
              <h2 className="text-lg font-bold text-[#2D2F33]">{promo.code} {isAr ? '— تقرير الأداء' : '— Performance Report'}</h2>
              <p className="text-xs text-[#989898]">{isAr ? promo.name_ar || promo.name : promo.name}</p>
            </div>
          </div>
          <button
            onClick={onEdit}
            className="flex items-center gap-1 rounded-xl bg-neutral-100 px-3.5 py-1.5 text-xs font-semibold text-[#2D2F33] hover:bg-neutral-200"
          >
            <Edit2 size={14} />
            <span>{isAr ? 'تعديل' : 'Edit'}</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-center">
              <span className="text-[11px] font-medium text-[#989898] uppercase">{isAr ? 'مرات الاستخدام' : 'Total Uses'}</span>
              <p className="text-2xl font-bold text-[#2D2F33] mt-1">{promo.currentUses}</p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-center">
              <span className="text-[11px] font-medium text-[#989898] uppercase">{isAr ? 'الخصم الإجمالي' : 'Total Discount'}</span>
              <p className="text-2xl font-bold text-amber-600 mt-1">EGP {promo.totalDiscountGiven.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-center">
              <span className="text-[11px] font-medium text-[#989898] uppercase">{isAr ? 'المبيعات الناتجة' : 'Revenue Generated'}</span>
              <p className="text-2xl font-bold text-[#026F4F] mt-1">EGP {promo.revenueGenerated.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-center">
              <span className="text-[11px] font-medium text-[#989898] uppercase">{isAr ? 'متوسط قيمة الطلب' : 'Average Order'}</span>
              <p className="text-2xl font-bold text-[#2D2F33] mt-1">
                EGP {promo.currentUses > 0 ? Math.round(promo.revenueGenerated / promo.currentUses) : 0}
              </p>
            </div>
          </div>

          {/* Recent Orders Log */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h4 className="text-xs font-bold text-[#2D2F33] uppercase tracking-wider mb-3">
              {isAr ? 'سجل الطلبات الحديثة بهذا الكود' : 'Recent Promo Redemptions'}
            </h4>
            {orders.length === 0 ? (
              <p className="py-6 text-center text-xs text-[#989898]">{isAr ? 'لا توجد طلبات مسجلة بهذا الكود حتى الآن' : 'No orders recorded with this code yet'}</p>
            ) : (
              <div className="divide-y divide-neutral-100">
                {orders.map((ord) => (
                  <div key={ord.id} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                    <div>
                      <span className="font-bold text-[#2D2F33] font-mono">{ord.orderNo}</span> ·{' '}
                      <span className="text-[#686868]">{ord.customer}</span>
                      <p className="text-[11px] text-[#989898]">{ord.date} ({ord.channel})</p>
                    </div>
                    <div className="text-end">
                      <span className="text-red-600 font-semibold">-EGP {ord.discount}</span>
                      <p className="text-xs font-bold text-[#026F4F]">Paid: EGP {ord.total}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Bulk Code Generator & CSV Exporter Modal
 */
function BulkGeneratorModal({
  isAr,
  onClose,
}: {
  isAr: boolean;
  onClose: () => void;
}) {
  const [prefix, setPrefix] = useState('VIP');
  const [count, setCount] = useState(50);
  const [generatedCsv, setGeneratedCsv] = useState<string | null>(null);

  const handleGenerateAndExport = () => {
    const { codes, csvContent } = bulkGenerateCodesCsv(prefix, count);
    setGeneratedCsv(csvContent);

    // Download CSV file directly
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bulk_Promo_Codes_${prefix}_${count}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <Layers size={20} className="text-[#026F4F]" />
            <h3 className="text-base font-bold text-[#2D2F33]">{isAr ? 'توليد أكواد بالجملة (تصدير CSV)' : 'Bulk Single-Use Codes Generator'}</h3>
          </div>
          <button onClick={onClose} className="text-[#989898] hover:text-[#2D2F33]"><X size={18} /></button>
        </div>

        <p className="mt-3 text-xs text-[#686868]">
          {isAr
            ? 'توليد عدد X من أكواد الاستخدام الفردي المخصصة مع بادئة محددة، وتصديرها مباشرة في ملف CSV للطباعة أو الحملات التسويقية.'
            : 'Generate multiple unique single-use promo codes with a custom prefix, and export them as a CSV sheet for flyers or SMS campaigns.'}
        </p>

        <div className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#2D2F33] mb-1">{isAr ? 'بادئة الكود (Prefix):' : 'Code Prefix:'}</label>
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ''))}
              placeholder="e.g. VIP or EVENT"
              className="h-10 w-full rounded-xl border border-neutral-200 bg-[#F8F9FA] px-3 font-mono text-sm font-bold text-[#2D2F33] outline-none uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2D2F33] mb-1">{isAr ? 'عدد الأكواد المطلوبة:' : 'Number of Codes to Generate:'}</label>
            <input
              type="number"
              min="1"
              max="5000"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="h-10 w-full rounded-xl border border-neutral-200 bg-[#F8F9FA] px-3 text-sm font-bold text-[#2D2F33] outline-none"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-neutral-300 px-4 py-2 text-xs font-medium text-[#2D2F33] hover:bg-neutral-50 sm:text-sm"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
          <button
            onClick={handleGenerateAndExport}
            className="flex items-center gap-1.5 rounded-xl bg-[#026F4F] px-5 py-2 text-xs font-bold text-white shadow hover:bg-emerald-800 sm:text-sm"
          >
            <Download size={15} />
            <span>{isAr ? 'توليد وتصدير CSV' : 'Generate & Export CSV'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

