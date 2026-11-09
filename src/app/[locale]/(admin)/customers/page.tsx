'use client';

import { useState, useMemo, useEffect } from 'react';
import { useLocale } from 'next-intl';
import {
  Search,
  Plus,
  Download,
  Phone,
  Mail,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  User,
  X,
  ChevronDown,
  Trash2,
  Building,
  Home,
  Briefcase,
  AlertTriangle,
  History,
  Check,
  Edit2,
  Eye,
} from 'lucide-react';
import { cn, lockPageScroll } from '@/lib/utils';
import { exportTableToExcel } from '@/lib/exportExcel';
import {
  Customer,
  CustomerAddress,
  loadCustomers,
  saveCustomers,
} from '@/data/customers';

export default function CustomersPage() {
  const locale = useLocale();
  const isAr = locale === 'ar';

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'blacklisted'>('all');
  const [sortBy, setSortBy] = useState<'spend' | 'orders' | 'name' | 'recent'>('spend');

  // Modals & Drawers
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [blacklistConfirm, setBlacklistConfirm] = useState<{ customer: Customer; reason: string } | null>(null);

  useEffect(() => {
    setCustomers(loadCustomers());
  }, []);

  const persistCustomers = (updated: Customer[]) => {
    setCustomers(updated);
    saveCustomers(updated);
  };

  // KPI Calculations
  const stats = useMemo(() => {
    const total = customers.length;
    const blacklisted = customers.filter((c) => c.isBlacklisted).length;
    const active = total - blacklisted;
    const totalSpend = customers.reduce((acc, c) => acc + (c.totalSpent || 0), 0);
    return { total, active, blacklisted, totalSpend };
  }, [customers]);

  // Filtered & Sorted Customers
  const filteredCustomers = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = customers.filter((c) => {
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        (c.name_ar && c.name_ar.includes(q)) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.addresses.some(
          (a) =>
            a.street.toLowerCase().includes(q) ||
            a.area.toLowerCase().includes(q) ||
            (a.building && a.building.toLowerCase().includes(q)),
        );

      const matchStatus =
        filterStatus === 'all' ||
        (filterStatus === 'active' && !c.isBlacklisted) ||
        (filterStatus === 'blacklisted' && c.isBlacklisted);

      return matchSearch && matchStatus;
    });

    return [...list].sort((a, b) => {
      switch (sortBy) {
        case 'spend':
          return b.totalSpent - a.totalSpent;
        case 'orders':
          return b.totalOrders - a.totalOrders;
        case 'name':
          return (isAr ? a.name_ar || a.name : a.name).localeCompare(
            isAr ? b.name_ar || b.name : b.name,
          );
        case 'recent':
        default:
          return b.id.localeCompare(a.id);
      }
    });
  }, [customers, search, filterStatus, sortBy, isAr]);

  // Blacklist Toggle
  const handleToggleBlacklist = (customer: Customer) => {
    if (customer.isBlacklisted) {
      // Un-blacklist directly
      const updated = customers.map((c) =>
        c.id === customer.id
          ? { ...c, isBlacklisted: false, blacklistReason: undefined, blacklistedAt: undefined }
          : c,
      );
      persistCustomers(updated);
    } else {
      // Prompt for reason
      setBlacklistConfirm({
        customer,
        reason: isAr ? 'سلوك غير لائق أو تكرار إلغاء الطلبات' : 'Policy violation or repeated delivery cancellation',
      });
    }
  };

  const confirmBlacklist = () => {
    if (!blacklistConfirm) return;
    const updated = customers.map((c) =>
      c.id === blacklistConfirm.customer.id
        ? {
            ...c,
            isBlacklisted: true,
            blacklistReason: blacklistConfirm.reason.trim(),
            blacklistedAt: new Date().toLocaleDateString('en-GB'),
          }
        : c,
    );
    persistCustomers(updated);
    setBlacklistConfirm(null);
  };

  // Add / Edit Customer
  const openNewCustomerDrawer = () => {
    const newCustomer: Customer = {
      id: `c-${Date.now()}`,
      name: '',
      phone: '',
      email: '',
      addresses: [
        {
          id: `a-${Date.now()}-1`,
          label: 'Home',
          street: '',
          building: '',
          floor: '',
          apartment: '',
          area: 'Cairo',
          isDefault: true,
        },
      ],
      totalOrders: 0,
      totalSpent: 0,
      lastOrderDate: 'Just added',
      isBlacklisted: false,
      source: 'manual',
    };
    setEditingCustomer(newCustomer);
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (customer: Customer) => {
    setEditingCustomer(JSON.parse(JSON.stringify(customer)));
    setIsDrawerOpen(true);
  };

  const handleSaveCustomer = (saved: Customer) => {
    const exists = customers.some((c) => c.id === saved.id);
    const updated = exists
      ? customers.map((c) => (c.id === saved.id ? saved : c))
      : [saved, ...customers];
    persistCustomers(updated);
    setIsDrawerOpen(false);
    setEditingCustomer(null);
    if (viewingCustomer?.id === saved.id) {
      setViewingCustomer(saved);
    }
  };

  const handleDeleteCustomer = (id: string) => {
    if (!confirm(isAr ? 'هل أنت متأكد من حذف هذا العميل؟' : 'Are you sure you want to delete this customer?')) return;
    const updated = customers.filter((c) => c.id !== id);
    persistCustomers(updated);
    if (viewingCustomer?.id === id) setViewingCustomer(null);
    setIsDrawerOpen(false);
  };

  // Export to Excel
  const handleExportExcel = () => {
    const rows = filteredCustomers.map((c) => {
      const primaryAddr = c.addresses.find((a) => a.isDefault) || c.addresses[0];
      return {
        'Customer ID': c.id,
        'Name': isAr ? c.name_ar || c.name : c.name,
        'Phone': c.phone,
        'Email': c.email,
        'Primary Address': primaryAddr ? `${primaryAddr.street}, ${primaryAddr.area}` : 'N/A',
        'Total Addresses': c.addresses.length,
        'Total Orders': c.totalOrders,
        'Total Spent (EGP)': c.totalSpent,
        'Status': c.isBlacklisted ? 'Blacklisted' : 'Active',
        'Blacklist Reason': c.blacklistReason || '',
        'Source': c.source,
      };
    });
    exportTableToExcel(rows, `Customers_Export_${new Date().toISOString().split('T')[0]}`, 'Customers');
  };

  return (
    <main className="flex flex-col gap-5">
      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-[22px] font-medium leading-[30px] text-[#2D2F33] sm:text-[26px] sm:leading-[36px] xl:text-[30px] xl:leading-[40px]">
            {isAr ? 'إدارة العملاء' : 'Customer Management'}
          </h1>
          <p className="text-[13px] text-[#989898] sm:text-[15px] xl:text-base">
            {isAr
              ? 'سجل العملاء المحفوظين، تفاصيل التوصيل وعناوينه المتعددة، والتحكم في حظر العملاء'
              : 'Saved customer directory, multi-address delivery records, order histories, and blacklist protection'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportExcel}
            className="flex h-11 items-center gap-2 rounded-[59px] border border-neutral-300 bg-white px-4 text-xs font-medium text-[#2D2F33] transition-colors hover:bg-neutral-50 sm:text-sm"
          >
            <Download size={16} />
            <span>{isAr ? 'تصدير إكسل' : 'Export Excel'}</span>
          </button>
          <button
            onClick={openNewCustomerDrawer}
            className="flex h-11 items-center gap-2 rounded-[59px] bg-[#026F4F] px-5 text-xs font-medium text-white shadow transition-colors hover:bg-emerald-800 sm:text-sm"
          >
            <Plus size={18} />
            <span>{isAr ? 'إضافة عميل' : 'Add Customer'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col justify-between rounded-2xl bg-white p-5 shadow-sm">
          <span className="text-xs font-medium text-[#989898] uppercase tracking-wider">{isAr ? 'إجمالي العملاء' : 'Total Customers'}</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#2D2F33]">{stats.total}</span>
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-[#686868]">{isAr ? 'محفوظين' : 'Saved'}</span>
          </div>
        </div>
        <div className="flex flex-col justify-between rounded-2xl bg-white p-5 shadow-sm">
          <span className="text-xs font-medium text-[#989898] uppercase tracking-wider">{isAr ? 'العملاء النشطون' : 'Active Customers'}</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-700">{stats.active}</span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">{isAr ? 'مسموح بالطلب' : 'Allowed'}</span>
          </div>
        </div>
        <div className="flex flex-col justify-between rounded-2xl bg-white p-5 shadow-sm border border-red-200 bg-red-50/20">
          <span className="text-xs font-medium text-red-600 uppercase tracking-wider">{isAr ? 'العملاء المحظورون' : 'Blacklisted Customers'}</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-red-600">{stats.blacklisted}</span>
            <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700">{isAr ? 'تحذير نشط' : 'Warning Active'}</span>
          </div>
        </div>
        <div className="flex flex-col justify-between rounded-2xl bg-white p-5 shadow-sm">
          <span className="text-xs font-medium text-[#989898] uppercase tracking-wider">{isAr ? 'إجمالي إنفاق العملاء' : 'Total Customer Spend'}</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#026F4F]">EGP {stats.totalSpend.toLocaleString()}</span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-[#026F4F]">LTV</span>
          </div>
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
            placeholder={isAr ? 'بحث بالاسم، رقم الهاتف، البريد، أو العنوان...' : 'Search by name, phone, email, or address...'}
            className="h-11 w-full rounded-xl border border-neutral-200 bg-[#F8F9FA] ps-10 pe-4 text-xs font-satoshi text-[#2D2F33] outline-none transition-colors focus:border-emerald-600 sm:text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center rounded-xl bg-neutral-100 p-1">
            {(
              [
                { id: 'all', label: isAr ? 'الكل' : 'All' },
                { id: 'active', label: isAr ? 'نشط' : 'Active' },
                { id: 'blacklisted', label: isAr ? 'محظور' : 'Blacklisted' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm',
                  filterStatus === tab.id
                    ? tab.id === 'blacklisted'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-white text-[#2D2F33] shadow-sm'
                    : 'text-[#686868] hover:text-[#2D2F33]',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-11 appearance-none rounded-xl border border-neutral-200 bg-white px-3.5 pe-8 text-xs font-medium text-[#2D2F33] outline-none transition-colors focus:border-emerald-600 sm:text-sm"
            >
              <option value="spend">{isAr ? 'الأعلى إنفاقاً' : 'Highest Spend'}</option>
              <option value="orders">{isAr ? 'الأكثر طلباً' : 'Most Orders'}</option>
              <option value="name">{isAr ? 'أبجدياً' : 'Alphabetical (A-Z)'}</option>
              <option value="recent">{isAr ? 'الأحدث' : 'Recently Added'}</option>
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-[#989898]" />
          </div>
        </div>
      </div>

      {/* Customer Cards List */}
      <div className="flex flex-col gap-3.5">
        {filteredCustomers.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center rounded-2xl bg-white p-6 text-center shadow-sm">
            <User size={36} className="text-[#989898]" />
            <p className="mt-2 text-base font-semibold text-[#2D2F33]">{isAr ? 'لا يوجد عملاء مطابقين' : 'No matching customers found'}</p>
            <p className="text-xs text-[#989898]">{isAr ? 'جرّب تعديل كلمات البحث أو الفلاتر' : 'Try adjusting your search criteria or filters'}</p>
          </div>
        ) : (
          filteredCustomers.map((customer) => {
            const isBlacklisted = customer.isBlacklisted;
            const primaryAddr = customer.addresses.find((a) => a.isDefault) || customer.addresses[0];
            const otherAddrsCount = customer.addresses.length - 1;

            return (
              <div
                key={customer.id}
                className={cn(
                  'flex flex-col rounded-2xl p-5 shadow-sm transition-all',
                  isBlacklisted
                    ? 'border-2 border-red-300 bg-[#FFF5F5] ring-1 ring-red-400/30'
                    : 'border border-neutral-100 bg-white hover:border-neutral-200',
                )}
              >
                {/* Blacklist Warning Banner */}
                {isBlacklisted && (
                  <div className="mb-4 flex items-center justify-between gap-3 rounded-xl bg-red-100/90 px-4 py-2.5 text-xs text-red-900 font-medium sm:text-sm">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={18} className="shrink-0 text-red-600" />
                      <span>
                        <strong>{isAr ? 'تنبيه الحظر:' : 'Blacklist Alert:'}</strong>{' '}
                        {customer.blacklistReason || (isAr ? 'محظور من الطلب أو الحجز' : 'Customer is restricted from POS, QR ordering, and table booking')}
                      </span>
                    </div>
                    {customer.blacklistedAt && (
                      <span className="shrink-0 text-xs text-red-700">{customer.blacklistedAt}</span>
                    )}
                  </div>
                )}

                {/* Main Card Content */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                  {/* Left: Info & Addresses */}
                  <div className="flex min-w-[280px] flex-1 items-start gap-4">
                    <div
                      className={cn(
                        'flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-bold',
                        isBlacklisted
                          ? 'bg-red-200 text-red-800'
                          : 'bg-[#E6F1ED] text-[#026F4F]',
                      )}
                    >
                      {customer.name
                        .split(' ')
                        .map((p) => p[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-base font-bold text-[#2D2F33] sm:text-lg">
                          {isAr ? customer.name_ar || customer.name : customer.name}
                        </h3>
                        {isBlacklisted ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-bold text-white shadow-sm">
                            <ShieldAlert size={12} />
                            {isAr ? 'محظور' : 'BLACKLISTED'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                            <ShieldCheck size={12} />
                            {isAr ? 'نشط' : 'ACTIVE'}
                          </span>
                        )}
                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-[#686868]">
                          {customer.source === 'delivery'
                            ? isAr ? 'طلب توصيل' : 'Delivery'
                            : customer.source === 'pos_reservation'
                              ? isAr ? 'حجز كاشير' : 'POS Reservation'
                              : isAr ? 'تطبيق العميل' : 'Customer QR'}
                        </span>
                      </div>

                      {/* Phone & Email */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#686868] sm:text-sm">
                        <span className="inline-flex items-center gap-1.5" dir="ltr">
                          <Phone size={14} className="text-[#989898]" />
                          <span className="font-medium text-[#2D2F33]">{customer.phone}</span>
                        </span>
                        {customer.email && (
                          <span className="inline-flex items-center gap-1.5">
                            <Mail size={14} className="text-[#989898]" />
                            <span>{customer.email}</span>
                          </span>
                        )}
                      </div>

                      {/* Delivery Addresses Preview */}
                      <div className="mt-1 flex flex-col gap-1 text-xs sm:text-sm">
                        {primaryAddr ? (
                          <div className="flex flex-wrap items-center gap-2 text-[#2D2F33]">
                            <span className="inline-flex items-center gap-1 font-semibold text-[#026F4F]">
                              <MapPin size={14} />
                              {primaryAddr.label}:
                            </span>
                            <span>
                              {primaryAddr.street}
                              {primaryAddr.building ? `, ${primaryAddr.building}` : ''}
                              {primaryAddr.apartment ? ` (${primaryAddr.apartment})` : ''} —{' '}
                              <strong className="text-neutral-700">{primaryAddr.area}</strong>
                            </span>
                            {otherAddrsCount > 0 && (
                              <button
                                onClick={() => setViewingCustomer(customer)}
                                className="inline-flex items-center gap-1 rounded-md bg-neutral-200/80 px-2 py-0.5 text-[11px] font-semibold text-[#2D2F33] transition-colors hover:bg-neutral-300"
                              >
                                +{otherAddrsCount} {isAr ? 'عناوين أخرى' : 'more address'}
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-[#989898]">{isAr ? 'لا يوجد عنوان مسجل' : 'No delivery address saved'}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Metrics & Actions */}
                  <div className="flex flex-wrap items-center gap-4 sm:flex-nowrap">
                    {/* Metrics */}
                    <div className="flex items-center gap-4 rounded-xl bg-neutral-50 px-4 py-2.5">
                      <div className="flex flex-col text-center">
                        <span className="text-[11px] font-medium text-[#989898] uppercase">{isAr ? 'الطلبات' : 'Orders'}</span>
                        <span className="text-base font-bold text-[#2D2F33]">{customer.totalOrders}</span>
                      </div>
                      <div className="h-8 w-px bg-neutral-200" />
                      <div className="flex flex-col text-center">
                        <span className="text-[11px] font-medium text-[#989898] uppercase">{isAr ? 'الإنفاق' : 'Total Spent'}</span>
                        <span className="text-base font-bold text-[#026F4F]">
                          EGP {customer.totalSpent.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      {/* Blacklist toggle button */}
                      <button
                        onClick={() => handleToggleBlacklist(customer)}
                        className={cn(
                          'flex h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold transition-all sm:text-sm',
                          isBlacklisted
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'border border-red-300 bg-white text-red-600 hover:bg-red-50',
                        )}
                        title={
                          isBlacklisted
                            ? isAr ? 'إلغاء الحظر والسماح بالطلب' : 'Remove from blacklist'
                            : isAr ? 'حظر هذا العميل' : 'Blacklist this customer'
                        }
                      >
                        {isBlacklisted ? (
                          <>
                            <ShieldCheck size={16} />
                            <span>{isAr ? 'إلغاء الحظر' : 'Remove Blacklist'}</span>
                          </>
                        ) : (
                          <>
                            <ShieldAlert size={16} />
                            <span>{isAr ? 'حظر العميل' : 'Blacklist'}</span>
                          </>
                        )}
                      </button>

                      {/* View Drawer */}
                      <button
                        onClick={() => setViewingCustomer(customer)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-[#686868] transition-colors hover:bg-neutral-100"
                        title={isAr ? 'عرض التفاصيل' : 'View customer profile'}
                      >
                        <Eye size={17} />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => openEditDrawer(customer)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-[#686868] transition-colors hover:bg-neutral-100"
                        title={isAr ? 'تعديل' : 'Edit customer'}
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Blacklist Reason Confirmation Modal */}
      {blacklistConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2D2F33]">{isAr ? 'حظر العميل' : 'Blacklist Customer'}</h3>
                <p className="text-xs text-[#989898]">{blacklistConfirm.customer.name} ({blacklistConfirm.customer.phone})</p>
              </div>
            </div>

            <p className="mt-4 text-sm text-[#686868]">
              {isAr
                ? 'عند حظر هذا العميل، سيظهر باللون الأحمر وسيتلقى الكاشير وتطبيق العميل تحذيراً فورياً عند محاولة الطلب أو الحجز.'
                : 'Blacklisting will flag this customer in RED. The Cashier POS and Customer Ordering UI will issue an immediate warning/block when an order or reservation is attempted.'}
            </p>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-[#2D2F33] mb-1.5">
                {isAr ? 'سبب الحظر:' : 'Reason for Blacklisting:'}
              </label>
              <textarea
                value={blacklistConfirm.reason}
                onChange={(e) => setBlacklistConfirm({ ...blacklistConfirm, reason: e.target.value })}
                placeholder={isAr ? 'اكتب سبب الحظر هنا...' : 'Explain why this customer is being blacklisted...'}
                rows={3}
                className="w-full rounded-xl border border-neutral-300 p-3 text-sm outline-none focus:border-red-500"
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setBlacklistConfirm(null)}
                className="rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium text-[#2D2F33] hover:bg-neutral-50"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={confirmBlacklist}
                className="rounded-xl bg-red-600 px-5 py-2 text-sm font-bold text-white hover:bg-red-700 shadow"
              >
                {isAr ? 'تأكيد الحظر' : 'Confirm Blacklist'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Customer Drawer */}
      {isDrawerOpen && editingCustomer && (
        <CustomerFormDrawer
          customer={editingCustomer}
          isAr={isAr}
          onClose={() => {
            setIsDrawerOpen(false);
            setEditingCustomer(null);
          }}
          onSave={handleSaveCustomer}
          onDelete={handleDeleteCustomer}
        />
      )}

      {/* View Customer Details Drawer */}
      {viewingCustomer && (
        <CustomerDetailsDrawer
          customer={viewingCustomer}
          isAr={isAr}
          onClose={() => setViewingCustomer(null)}
          onEdit={() => {
            const c = viewingCustomer;
            setViewingCustomer(null);
            openEditDrawer(c);
          }}
          onToggleBlacklist={() => handleToggleBlacklist(viewingCustomer)}
        />
      )}
    </main>
  );
}

/**
 * Add / Edit Customer Drawer with support for Multiple Delivery Addresses
 */
function CustomerFormDrawer({
  customer: initialCustomer,
  isAr,
  onClose,
  onSave,
  onDelete,
}: {
  customer: Customer;
  isAr: boolean;
  onClose: () => void;
  onSave: (c: Customer) => void;
  onDelete: (id: string) => void;
}) {
  const [formData, setFormData] = useState<Customer>(initialCustomer);

  useEffect(() => {
    lockPageScroll(true);
    return () => lockPageScroll(false);
  }, []);

  const addAddress = () => {
    const newAddr: CustomerAddress = {
      id: `a-${Date.now()}`,
      label: 'Home',
      street: '',
      building: '',
      floor: '',
      apartment: '',
      area: 'Cairo',
      isDefault: formData.addresses.length === 0,
    };
    setFormData((prev) => ({ ...prev, addresses: [...prev.addresses, newAddr] }));
  };

  const updateAddress = (index: number, patch: Partial<CustomerAddress>) => {
    setFormData((prev) => {
      let updatedAddrs = prev.addresses.map((addr, idx) => (idx === index ? { ...addr, ...patch } : addr));
      if (patch.isDefault) {
        updatedAddrs = updatedAddrs.map((addr, idx) => ({ ...addr, isDefault: idx === index }));
      }
      return { ...prev, addresses: updatedAddrs };
    });
  };

  const removeAddress = (index: number) => {
    setFormData((prev) => {
      const filtered = prev.addresses.filter((_, idx) => idx !== index);
      if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
        filtered[0].isDefault = true;
      }
      return { ...prev, addresses: filtered };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert(isAr ? 'يرجى إدخال اسم العميل ورقم الهاتف' : 'Please provide customer name and phone number');
      return;
    }
    onSave(formData);
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed end-0 top-0 z-50 flex h-full w-full flex-col bg-[#F8F9FA] shadow-2xl transition-transform duration-300 sm:w-[620px]">
        {/* Drawer Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-[#2D2F33] hover:bg-neutral-200"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold text-[#2D2F33]">
              {formData.totalOrders > 0
                ? isAr ? 'تعديل بيانات العميل' : 'Edit Customer'
                : isAr ? 'إضافة عميل جديد' : 'New Customer Profile'}
            </h2>
          </div>
          {formData.totalOrders > 0 && (
            <button
              type="button"
              onClick={() => onDelete(formData.id)}
              className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
            >
              <Trash2 size={14} />
              <span>{isAr ? 'حذف' : 'Delete'}</span>
            </button>
          )}
        </div>

        {/* Drawer Form Body */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col justify-between overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Basic Info Card */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-[#2D2F33] uppercase tracking-wider">{isAr ? 'المعلومات الشخصية' : 'Contact Information'}</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#2D2F33] mb-1.5">{isAr ? 'اسم العميل بالإنجليزية' : 'Customer Name (EN) *'}</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Mike Thompson"
                    className="h-11 w-full rounded-xl border border-neutral-200 bg-[#F8F9FA] px-3.5 text-sm text-[#2D2F33] outline-none focus:border-emerald-600"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#2D2F33] mb-1.5">{isAr ? 'اسم العميل بالعربية (اختياري)' : 'Customer Name (Arabic Optional)'}</label>
                  <input
                    type="text"
                    value={formData.name_ar || ''}
                    onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                    placeholder="مثال: مايك طومسون"
                    className="h-11 w-full rounded-xl border border-neutral-200 bg-[#F8F9FA] px-3.5 text-sm text-[#2D2F33] outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2D2F33] mb-1.5">{isAr ? 'رقم الهاتف *' : 'Phone Number *'}</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+20 100 000 0000"
                    className="h-11 w-full rounded-xl border border-neutral-200 bg-[#F8F9FA] px-3.5 text-sm font-satoshi text-[#2D2F33] outline-none focus:border-emerald-600"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2D2F33] mb-1.5">{isAr ? 'البريد الإلكتروني' : 'Email Address'}</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="h-11 w-full rounded-xl border border-neutral-200 bg-[#F8F9FA] px-3.5 text-sm text-[#2D2F33] outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>

            {/* Multiple Delivery Addresses Card */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#2D2F33] uppercase tracking-wider">{isAr ? 'عناوين التوصيل المتعددة' : 'Delivery Addresses'}</h3>
                  <p className="text-xs text-[#989898]">{isAr ? 'دعم حفظ أكثر من عنوان لنفس العميل' : 'Supports multiple delivery locations for auto-completion'}</p>
                </div>
                <button
                  type="button"
                  onClick={addAddress}
                  className="flex items-center gap-1 text-xs font-bold text-[#026F4F] hover:underline"
                >
                  <Plus size={15} />
                  <span>{isAr ? 'إضافة عنوان' : '+ Add Address'}</span>
                </button>
              </div>

              {formData.addresses.length === 0 ? (
                <div className="flex h-24 items-center justify-center rounded-xl bg-neutral-50 border border-dashed border-neutral-200 text-xs text-[#989898]">
                  {isAr ? 'لم تتم إضافة أي عناوين توصيل' : 'No delivery addresses added'}
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.addresses.map((addr, idx) => (
                    <div
                      key={addr.id}
                      className={cn(
                        'relative rounded-xl border p-4 transition-all',
                        addr.isDefault ? 'border-emerald-500 bg-emerald-50/20' : 'border-neutral-200 bg-[#F8F9FA]',
                      )}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {/* Label Type */}
                          <select
                            value={addr.label}
                            onChange={(e) => updateAddress(idx, { label: e.target.value as any })}
                            className="h-8 rounded-lg border border-neutral-300 bg-white px-2.5 text-xs font-semibold text-[#2D2F33] outline-none"
                          >
                            <option value="Home">{isAr ? 'المنزل' : 'Home'}</option>
                            <option value="Work">{isAr ? 'العمل' : 'Work'}</option>
                            <option value="Other">{isAr ? 'آخر' : 'Other'}</option>
                          </select>

                          {addr.isDefault && (
                            <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                              {isAr ? 'الرئيسي' : 'Default'}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {!addr.isDefault && (
                            <button
                              type="button"
                              onClick={() => updateAddress(idx, { isDefault: true })}
                              className="text-[11px] font-medium text-emerald-700 hover:underline"
                            >
                              {isAr ? 'تعيين كرئيسي' : 'Set as default'}
                            </button>
                          )}
                          {formData.addresses.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeAddress(idx)}
                              className="text-neutral-400 hover:text-red-600"
                              title="Delete address"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            value={addr.street}
                            onChange={(e) => updateAddress(idx, { street: e.target.value })}
                            placeholder={isAr ? 'اسم الشارع والحي' : 'Street address / Road'}
                            className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-xs text-[#2D2F33] outline-none focus:border-emerald-600"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={addr.building || ''}
                            onChange={(e) => updateAddress(idx, { building: e.target.value })}
                            placeholder={isAr ? 'رقم المبنى / الفيلا' : 'Building / Villa no.'}
                            className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-xs text-[#2D2F33] outline-none focus:border-emerald-600"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={addr.apartment || ''}
                            onChange={(e) => updateAddress(idx, { apartment: e.target.value })}
                            placeholder={isAr ? 'رقم الشقة / الطابق' : 'Apartment / Floor'}
                            className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-xs text-[#2D2F33] outline-none focus:border-emerald-600"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            value={addr.area}
                            onChange={(e) => updateAddress(idx, { area: e.target.value })}
                            placeholder={isAr ? 'المنطقة / المدينة (المعادي، التجمع، الزمالك...)' : 'Area / City (e.g. Maadi, New Cairo, Zamalek)'}
                            className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-xs text-[#2D2F33] outline-none focus:border-emerald-600"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Blacklist Status & Warning Switch */}
            <div className={cn(
              'rounded-2xl border p-5 shadow-sm transition-colors',
              formData.isBlacklisted ? 'border-red-300 bg-red-50/30' : 'border-neutral-200 bg-white'
            )}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#2D2F33] uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert size={16} className={formData.isBlacklisted ? 'text-red-600' : 'text-[#989898]'} />
                    <span>{isAr ? 'حظر هذا العميل' : 'Blacklist Customer'}</span>
                  </h3>
                  <p className="text-xs text-[#989898]">
                    {isAr
                      ? 'عند التفعيل، سيظهر العميل باللون الأحمر وتنبيه الكاشير لمنع الطلب'
                      : 'Flag customer red and notify cashier pos & qr ordering'}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isBlacklisted}
                  onChange={(e) => setFormData({ ...formData, isBlacklisted: e.target.checked })}
                  className="size-5 accent-red-600 cursor-pointer"
                />
              </div>

              {formData.isBlacklisted && (
                <div className="mt-4">
                  <label className="block text-xs font-semibold text-red-800 mb-1">
                    {isAr ? 'سبب الحظر:' : 'Blacklist Reason:'}
                  </label>
                  <input
                    type="text"
                    value={formData.blacklistReason || ''}
                    onChange={(e) => setFormData({ ...formData, blacklistReason: e.target.value })}
                    placeholder={isAr ? 'مثال: إلغاء متكرر للطلبات، عدم سداد...' : 'e.g. Repeated doorstep cancellation, non-payment'}
                    className="h-10 w-full rounded-lg border border-red-300 bg-white px-3 text-xs text-[#2D2F33] outline-none focus:border-red-500"
                  />
                </div>
              )}
            </div>

            {/* Internal Notes */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <label className="block text-xs font-semibold text-[#2D2F33] mb-1.5 uppercase tracking-wider">
                {isAr ? 'ملاحظات وتفضيلات العميل' : 'Customer Notes & Preferences'}
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder={isAr ? 'أضف أي ملاحظات خاصة (مثلاً: يفضل التغليف الورقي، توابل خفيفة...)' : 'Special notes (e.g. prefers paper packaging, spicy preference...)'}
                rows={2}
                className="w-full rounded-xl border border-neutral-200 bg-[#F8F9FA] p-3 text-xs text-[#2D2F33] outline-none focus:border-emerald-600"
              />
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
              {isAr ? 'حفظ البيانات' : 'Save Customer'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

/**
 * Customer View Details Drawer
 */
function CustomerDetailsDrawer({
  customer,
  isAr,
  onClose,
  onEdit,
  onToggleBlacklist,
}: {
  customer: Customer;
  isAr: boolean;
  onClose: () => void;
  onEdit: () => void;
  onToggleBlacklist: () => void;
}) {
  useEffect(() => {
    lockPageScroll(true);
    return () => lockPageScroll(false);
  }, []);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed end-0 top-0 z-50 flex h-full w-full flex-col bg-[#F8F9FA] shadow-2xl transition-transform duration-300 sm:w-[560px]">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-[#2D2F33] hover:bg-neutral-200"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold text-[#2D2F33]">{isAr ? 'ملف العميل' : 'Customer Profile'}</h2>
          </div>
          <button
            onClick={onEdit}
            className="flex items-center gap-1 rounded-xl bg-neutral-100 px-3.5 py-1.5 text-xs font-semibold text-[#2D2F33] hover:bg-neutral-200"
          >
            <Edit2 size={14} />
            <span>{isAr ? 'تعديل' : 'Edit'}</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Status Alert if Blacklisted */}
          {customer.isBlacklisted && (
            <div className="rounded-xl border border-red-300 bg-red-100 p-4 text-red-900">
              <div className="flex items-center gap-2 font-bold text-sm">
                <AlertTriangle size={18} className="text-red-600" />
                <span>{isAr ? 'هذا العميل في القائمة السوداء' : 'Blacklisted Customer'}</span>
              </div>
              <p className="mt-1 text-xs text-red-800">
                {customer.blacklistReason || (isAr ? 'محظور من إتمام الطلبات والحجز' : 'Reason: Repeated cancellations or policy breach')}
              </p>
            </div>
          )}

          {/* Customer Overview */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm text-center">
            <div
              className={cn(
                'mx-auto flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold',
                customer.isBlacklisted ? 'bg-red-200 text-red-800' : 'bg-[#E6F1ED] text-[#026F4F]',
              )}
            >
              {customer.name
                .split(' ')
                .map((p) => p[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()}
            </div>
            <h3 className="mt-3 text-lg font-bold text-[#2D2F33]">{isAr ? customer.name_ar || customer.name : customer.name}</h3>
            <p className="text-xs text-[#989898]">{customer.phone} · {customer.email}</p>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-neutral-100 pt-4 text-start">
              <div>
                <span className="text-[11px] font-medium text-[#989898] uppercase">{isAr ? 'إجمالي الطلبات' : 'Total Orders'}</span>
                <p className="text-base font-bold text-[#2D2F33]">{customer.totalOrders} {isAr ? 'طلب' : 'orders'}</p>
              </div>
              <div>
                <span className="text-[11px] font-medium text-[#989898] uppercase">{isAr ? 'إجمالي الإنفاق' : 'Total Spent'}</span>
                <p className="text-base font-bold text-[#026F4F]">EGP {customer.totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Delivery Addresses */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h4 className="text-xs font-bold text-[#2D2F33] uppercase tracking-wider mb-3">
              {isAr ? 'عناوين التوصيل المسجلة' : 'Saved Delivery Locations'} ({customer.addresses.length})
            </h4>
            <div className="space-y-3">
              {customer.addresses.map((addr) => (
                <div key={addr.id} className="flex items-start gap-3 rounded-xl bg-neutral-50 p-3.5 border border-neutral-200/70">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#026F4F] shadow-sm">
                    {addr.label === 'Work' ? <Briefcase size={16} /> : <Home size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#2D2F33]">{addr.label}</span>
                      {addr.isDefault && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          {isAr ? 'افتراضي' : 'Default'}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-[#686868]">
                      {addr.street}
                      {addr.building ? `, ${addr.building}` : ''}
                      {addr.floor ? `, ${addr.floor}` : ''}
                      {addr.apartment ? ` (${addr.apartment})` : ''}
                    </p>
                    <p className="text-xs font-semibold text-[#026F4F]">{addr.area}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Blacklist Control Button */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm flex items-center justify-between">
            <span className="text-xs font-medium text-[#686868]">
              {customer.isBlacklisted
                ? isAr ? 'العميل محظور حالياً' : 'Customer is currently blacklisted'
                : isAr ? 'العميل نشط ويمكنه الطلب' : 'Customer is currently active'}
            </span>
            <button
              onClick={onToggleBlacklist}
              className={cn(
                'rounded-xl px-4 py-2 text-xs font-bold transition-colors',
                customer.isBlacklisted
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-red-600 text-white hover:bg-red-700',
              )}
            >
              {customer.isBlacklisted ? (isAr ? 'إلغاء الحظر' : 'Remove from Blacklist') : (isAr ? 'حظر هذا العميل' : 'Blacklist Customer')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

