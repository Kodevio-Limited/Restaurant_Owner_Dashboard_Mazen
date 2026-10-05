'use client';

import { useState, useEffect, Fragment } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import {
  ChevronRight, ChevronDown, MapPin, Phone, Mail, Globe, Camera,
  Search, Crosshair, Bell, Receipt, Building2, CreditCard,
  FileText, Plus, User, Package, Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EditBranchModal } from '@/components/shared/EditBranchModal';

// ─── Types ────────────────────────────────────────────────────────────────────

type TabId = 'general' | 'branches' | 'payment-taxes' | 'receipt' | 'notification' | 'inventory' | 'session';

// ─── Shared primitives ────────────────────────────────────────────────────────

function Toggle({ on, onChange }: { on?: boolean; onChange?: (v: boolean) => void }) {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        checked={on}
        onChange={() => onChange?.(!on)}
        className="peer sr-only"
      />
      <div className="h-[26px] w-[48px] rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-[22px] after:w-[22px] after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#026F4F] peer-checked:after:translate-x-[22px] rtl:peer-checked:after:-translate-x-[22px] peer-checked:after:border-white" />
    </label>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-sm font-medium text-[#686868]">{children}</span>;
}

function TextInput({ value, placeholder }: { value?: string; placeholder?: string }) {
  const [val, setVal] = useState(value ?? '');
  return (
    <input
      type="text"
      value={val}
      placeholder={placeholder}
      onChange={(e) => setVal(e.target.value)}
      className="h-14 w-full rounded-[87px] bg-[#F2F2F2] px-5 text-base font-medium text-[#2D2F33] outline-none transition-shadow placeholder:text-[#989898] focus:ring-2 focus:ring-[#026F4F]/30"
    />
  );
}

function NumberInput({ value, min = 0, max = 100, placeholder }: { value?: string | number; min?: number; max?: number; placeholder?: string }) {
  const [val, setVal] = useState(value ?? '');
  return (
    <input
      type="number"
      dir="ltr"
      value={val}
      min={min}
      max={max}
      placeholder={placeholder}
      onChange={(e) => setVal(e.target.value)}
      className="h-14 w-full rounded-[87px] bg-[#F2F2F2] px-5 text-base font-medium text-[#2D2F33] outline-none transition-shadow placeholder:text-[#989898] focus:ring-2 focus:ring-[#026F4F]/30"
    />
  );
}

function SelectInput({ value, valueAr, options = [], optionsAr = [] }: { value: string; valueAr?: string; options?: string[]; optionsAr?: string[] }) {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [open, setOpen] = useState(false);
  // Index-based selection so the choice survives locale switches.
  const [selectedIdx, setSelectedIdx] = useState(() => Math.max(0, options.indexOf(value)));
  const labels = isAr && optionsAr.length === options.length ? optionsAr : options;
  const selectedLabel = labels[Math.min(selectedIdx, labels.length - 1)] ?? (isAr ? (valueAr ?? value) : value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-full items-center justify-between rounded-[87px] bg-[#F2F2F2] px-5 text-start transition-colors hover:bg-[#EAEAEA]"
      >
        <span className="truncate text-base font-medium text-[#2D2F33]">{selectedLabel}</span>
        <ChevronDown
          size={16}
          className={cn('shrink-0 text-[#989898] transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute start-0 end-0 top-full z-40 mt-1 max-h-60 overflow-y-auto rounded-2xl bg-white py-1 shadow-lg outline outline-1 outline-[#E9E9E9]">
            {labels.map((option, idx) => (
              <button
                key={options[idx] ?? option}
                type="button"
                onClick={() => { setSelectedIdx(idx); setOpen(false); }}
                className={cn(
                  'block w-full truncate px-5 py-2.5 text-start text-sm transition-colors hover:bg-[#F2F2F2] sm:text-base',
                  selectedIdx === idx ? 'font-medium text-[#026F4F]' : 'text-[#2D2F33]',
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function SectionCard({ title, children, className }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-xl bg-white p-4 sm:p-5', className)}>
      {title && <h3 className="mb-4 text-lg font-medium text-[#2D2F33] sm:text-xl">{title}</h3>}
      {children}
    </div>
  );
}

type Requirement = 'required' | 'optional';

function ToggleRow({ title, desc, on, onChange }: { title: string; desc: string; on?: boolean; onChange?: (v: boolean) => void }) {
  return (
    <SectionCard>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <div>
          <h3 className="text-[15px] font-medium text-black sm:text-[17px]">{title}</h3>
          <p className="mt-0.5 text-[13px] text-[#989898] sm:text-sm">{desc}</p>
        </div>
        <Toggle on={on} onChange={onChange} />
      </div>
    </SectionCard>
  );
}

function RequirementSegment({
  value,
  onChange,
  disabled,
}: {
  value: Requirement;
  onChange: (v: Requirement) => void;
  disabled?: boolean;
}) {
  const t = useTranslations('settings');
  return (
    <div className={cn('flex rounded-full bg-[#F2F2F2] p-1', disabled && 'pointer-events-none opacity-50')}>
      {(['required', 'optional'] as Requirement[]).map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            'rounded-full px-4 py-1.5 text-[13px] font-medium transition-all',
            value === opt
              ? 'bg-[#026F4F] text-white shadow-xs'
              : 'text-[#686868] hover:text-[#2D2F33]',
          )}
        >
          {t(`general.${opt}`)}
        </button>
      ))}
    </div>
  );
}

function SaveButton() {
  const t = useTranslations('settings');
  return (
    <div
      id="save-changes-section"
      className="-mx-1 border-t border-[#E9E9E9] bg-[#F2F2F2] py-4"
    >
      <button className="h-11 w-full rounded-full bg-[#026F4F] text-[15px] font-medium text-white shadow-md transition-colors hover:bg-[#015c42] sm:w-48">
        {t('saveChanges')}
      </button>
    </div>
  );
}

// ─── Tab content ──────────────────────────────────────────────────────────────

function GeneralBrandTab() {
  const t = useTranslations('settings.general');
  const [expandMenu, setExpandMenu] = useState(true);
  const [requireCustomer, setRequireCustomer] = useState(true);
  const [customerFields, setCustomerFields] = useState<Record<'phone' | 'name' | 'email', Requirement>>(() => {
    if (typeof window === 'undefined') return { phone: 'optional', name: 'optional', email: 'optional' };
    try {
      const raw = window.localStorage.getItem('rod-customer-fields');
      if (raw) {
        const parsed = JSON.parse(raw);
        const pick = (v: unknown): Requirement => (v === 'required' ? 'required' : 'optional');
        return { phone: pick(parsed?.phone), name: pick(parsed?.name), email: pick(parsed?.email) };
      }
    } catch {
      // fall through to defaults
    }
    return { phone: 'optional', name: 'optional', email: 'optional' };
  });
  const [brandColor, setBrandColor] = useState('#026F4F');
  const [logoName, setLogoName] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [mapInteractive, setMapInteractive] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem('rod-customer-fields', JSON.stringify(customerFields));
    } catch {
      // storage unavailable — selection simply won't persist
    }
  }, [customerFields]);

  const CUSTOMER_FIELDS: { key: 'phone' | 'name' | 'email'; icon: React.ElementType }[] = [
    { key: 'phone', icon: Phone },
    { key: 'name', icon: User },
    { key: 'email', icon: Mail },
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* Business Details */}
      <SectionCard title={t('businessDetails')}>
        <div className="grid grid-cols-1 gap-5 mb-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <FieldLabel>{t('businessName')}</FieldLabel>
            <TextInput value="DineConnect Global" />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel>{t('email')}</FieldLabel>
            <TextInput placeholder={t('emailPlaceholder')} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <FieldLabel>{t('currency')}</FieldLabel>
            <SelectInput value="EGP" options={['EGP', 'USD', 'EUR', 'GBP', 'SAR', 'AED']} />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel>{t('timezone')}</FieldLabel>
            <SelectInput value="Egypt Standard Time (EET)" valueAr="توقيت مصر القياسي (EET)" options={['Egypt Standard Time (EET)', 'Eastern Time (ET)', 'Central Time (CT)', 'Mountain Time (MT)', 'Pacific Time (PT)', 'UTC']} optionsAr={['توقيت مصر القياسي (EET)', 'التوقيت الشرقي (ET)', 'التوقيت المركزي (CT)', 'التوقيت الجبلي (MT)', 'توقيت المحيط الهادئ (PT)', 'UTC']} />
          </div>
        </div>
      </SectionCard>

      {/* Branding */}
      <SectionCard title={t('branding')}>
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Logo upload */}
          <label className="flex h-44 w-72 shrink-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-[#B9B9B9] bg-[#F2F2F2] transition-colors hover:border-[#026F4F]">
            <input
              type="file"
              accept="image/png,image/jpeg"
              className="sr-only"
              onChange={(e) => setLogoName(e.target.files?.[0]?.name ?? null)}
            />
            <Camera size={44} className="text-[#686868]" />
            <span className="max-w-[90%] truncate text-base font-medium text-[#2D2F33]">
              {logoName ?? t('uploadLogo')}
            </span>
            <span className="text-xs text-[#989898]">{t('logoHint')}</span>
          </label>

          {/* Two columns: Color + Language */}
          <div className="flex flex-1 flex-col gap-6 sm:flex-row sm:gap-8">
            <div className="flex flex-1 flex-col gap-2">
              <span className="text-lg font-medium text-black">{t('brandColor')}</span>
              <span className="text-xs text-[#686868]">
                {t('brandColorDesc')}
              </span>
              <div className="mt-2 flex items-center gap-3">
                <label
                  className="relative h-11 w-11 shrink-0 cursor-pointer overflow-hidden rounded-md"
                  style={{ backgroundColor: brandColor }}
                >
                  <input
                    type="color"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    aria-label={t('brandColorAria')}
                  />
                </label>
                <div className="flex h-9 w-36 items-center rounded border border-[#B9B9B9] px-3">
                  <input
                    type="text"
                    dir="ltr"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="w-full bg-transparent text-xs text-black outline-none"
                    aria-label={t('brandColorHexAria')}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <FieldLabel>{t('language')}</FieldLabel>
              <SelectInput value="English" valueAr="الإنجليزية" options={['English', 'Arabic', 'Spanish', 'French']} optionsAr={['الإنجليزية', 'العربية', 'الإسبانية', 'الفرنسية']} />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Toggles */}
      <ToggleRow title={t('expandMenuBar')} desc={t('expandMenuBarDesc')} on={expandMenu} onChange={setExpandMenu} />
      <ToggleRow title={t('requireCustomer')} desc={t('requireCustomerDesc')} on={requireCustomer} onChange={setRequireCustomer} />

      {/* Per-field customer information requirements */}
      <SectionCard title={t('customerInfoFields')}>
        <p className="-mt-2 mb-4 text-[13px] text-[#989898] sm:text-sm">
          {t('customerInfoDesc')}
        </p>
        <div className="flex flex-col divide-y divide-[#F2F2F2]">
          {CUSTOMER_FIELDS.map((field) => {
            const Icon = field.icon;
            return (
              <div key={field.key} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F2F2F2]">
                    <Icon size={18} className="text-[#686868]" />
                  </div>
                  <div>
                    <p className="text-[15px] font-medium text-black">{t(`fields.${field.key}`)}</p>
                    <p className="text-xs text-[#989898]">{t(`fields.${field.key}Desc`)}</p>
                  </div>
                </div>
                <RequirementSegment
                  value={customerFields[field.key]}
                  disabled={!requireCustomer}
                  onChange={(v) => setCustomerFields((prev) => ({ ...prev, [field.key]: v }))}
                />
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Location */}
      <SectionCard title={t('location')}>
        <p className="mb-5 text-lg text-[#989898]">
          {t('locationDescLong')}
        </p>

        {/* Search bar + button */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex h-14 flex-1 items-center gap-2 rounded-full bg-[#F2F2F2] px-5">
            <Search size={20} className="shrink-0 text-[#989898]" />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t('searchAddress')}
              className="h-full w-full bg-transparent text-base text-[#2D2F33] outline-none placeholder:text-[#989898]"
            />
          </div>
          <button className="flex h-14 shrink-0 items-center justify-center gap-2 rounded-full bg-[#026F4F] px-6 text-white shadow-md hover:bg-[#015c42] sm:w-60">
            <Crosshair size={20} />
            <span className="text-base font-medium">{t('useCurrentLocation')}</span>
          </button>
        </div>

        {/* Map */}
        <div
          className="relative mb-5 h-96 overflow-hidden rounded-xl"
          onMouseLeave={() => setMapInteractive(false)}
        >
          <iframe
            src="https://www.openstreetmap.org/export/embed.html?bbox=31.2357%2C29.9792%2C31.2857%2C30.0192&layer=mapnik&marker=30.0%2C31.26"
            className={cn(
              'h-full w-full border-0',
              !mapInteractive && 'pointer-events-none',
            )}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={t('mapTitle')}
          />
          {!mapInteractive && (
            <div
              onClick={() => setMapInteractive(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/5 cursor-pointer transition-colors hover:bg-black/10"
            >
              <span className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-[#2D2F33] shadow-md backdrop-blur-sm transition-all hover:bg-white hover:shadow-lg">
                <MapPin size={16} className="text-[#026F4F]" />
                {t('clickToInteract')}
              </span>
            </div>
          )}
          {mapInteractive && (
            <button
              type="button"
              onClick={() => setMapInteractive(false)}
              className="absolute end-3 top-3 flex items-center gap-1.5 rounded-full bg-black/75 px-3 py-1.5 text-xs font-medium text-white shadow backdrop-blur-sm hover:bg-black/90 transition-colors"
            >
              {t('doneInteracting')}
            </button>
          )}
        </div>

        {/* Coordinates */}
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <div className="flex flex-col gap-2">
            <FieldLabel>{t('latitude')}</FieldLabel>
            <TextInput value="23.6454" />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel>{t('longitude')}</FieldLabel>
            <TextInput value="23.6454" />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel>{t('allowedRadius')}</FieldLabel>
            <SelectInput value="50 Meters" valueAr="50 متر" options={['25 Meters', '50 Meters', '100 Meters', '200 Meters']} optionsAr={['25 متر', '50 متر', '100 متر', '200 متر']} />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function BranchManagementTab({
  onEdit,
  onDelete,
}: {
  onEdit: (b: typeof BRANCHES[0]) => void;
  onDelete: () => void;
}) {
  const t = useTranslations('settings.branches');
  const locale = useLocale();
  const isArabic = locale === 'ar';
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {BRANCHES.map((b) => (
          <div key={b.id} className="flex flex-col rounded-2xl bg-white p-5">
            <h3 className="mb-4 text-[19px] font-medium text-black">
              {isArabic ? b.name_ar : b.name}
            </h3>

            <div className="flex flex-col gap-3.5 mb-5">
              <div className="flex items-center gap-2.5">
                <Phone size={17} className="shrink-0 text-[#989898]" />
                <span className="text-[13px] text-[#989898]" dir="ltr">{b.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={17} className="shrink-0 text-[#989898]" />
                <span className="text-[13px] text-[#989898]" dir="ltr">{b.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={24} className="shrink-0 text-[#989898]" />
                <span className="text-base text-[#989898]">
                  {isArabic ? b.address_ar : b.address}
                </span>
              </div>
            </div>

            <div className="border-t border-[#B9B9B9] pt-5 flex gap-4">
              <button
                onClick={() => onEdit(b)}
                className="flex-1 rounded-full border border-[#B9B9B9] bg-[#E9E9E9] py-3 text-base font-medium text-[#2D2F33] hover:bg-[#DCDCDC] transition-colors"
              >
                {t('edit')}
              </button>
              <button
                onClick={onDelete}
                className="flex-1 rounded-full bg-[#E85E5E] py-3 text-base font-medium text-white hover:bg-[#d94a4a] transition-colors"
              >
                {t('delete')}
              </button>
            </div>
          </div>
        ))}

        {/* Add branch card */}
        <button className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#B9B9B9] p-7 text-[#989898] hover:border-[#026F4F] hover:text-[#026F4F] transition-colors min-h-[250px]">
          <Plus size={36} strokeWidth={1.5} />
          <span className="text-base font-medium">{t('addBranch')}</span>
        </button>
      </div>
    </div>
  );
}

function PaymentConfigTab() {
  const t = useTranslations('settings.payment');
  const [payOnline, setPayOnline] = useState(true);
  const [getCheck, setGetCheck] = useState(true);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        <SectionCard title={t('customerPaymentOptions')}>
          <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E9E9E9]">
                  <Globe size={22} className="text-[#989898]" />
                </div>
                <div>
                  <p className="text-lg font-medium text-black">{t('payOnline')}</p>
                  <p className="text-xs text-[#989898]">{t('payOnlineDesc')}</p>
                </div>
              </div>
              <Toggle on={payOnline} onChange={setPayOnline} />
            </div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E9E9E9]">
                  <Receipt size={22} className="text-[#989898]" />
                </div>
                <div>
                  <p className="text-lg font-medium text-black">{t('getCheck')}</p>
                  <p className="text-xs text-[#989898]">{t('getCheckDesc')}</p>
                </div>
              </div>
              <Toggle on={getCheck} onChange={setGetCheck} />
            </div>
          </div>
        </SectionCard>

        {/* Behavior settings */}
        <SectionCard title={t('behaviorSettings')}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <span className="text-lg font-medium text-[#2D2F33]">{t('defaultPaymentMethod')}</span>
              <div className="w-full sm:w-52">
                <SelectInput value="Card (terminal)" valueAr="بطاقة (جهاز)" options={['Card (terminal)', 'Cash', 'Online Payment']} optionsAr={['بطاقة (جهاز)', 'نقدي', 'دفع إلكتروني']} />
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <span className="text-lg font-medium text-[#2D2F33]">{t('whenIsPaymentRequired')}</span>
              <div className="w-full sm:w-52">
                <SelectInput value="After Order" valueAr="بعد الطلب" options={['Before Order', 'After Order']} optionsAr={['قبل الطلب', 'بعد الطلب']} />
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function TaxesChargesTab() {
  const t = useTranslations('settings.payment');
  const [vatEnabled, setVatEnabled] = useState(true);
  const [serviceEnabled, setServiceEnabled] = useState(true);

  return (
    <div className="flex flex-col gap-6">
      <SectionCard>
        <div className="flex items-start justify-between gap-6 mb-5">
          <div>
            <h3 className="text-[19px] font-medium text-black">{t('vat')}</h3>
            <p className="mt-1 text-sm text-[#686868]">{t('vatDesc')}</p>
          </div>
          <Toggle on={vatEnabled} onChange={setVatEnabled} />
        </div>
        <div className="grid grid-cols-1 gap-5 mb-10 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <FieldLabel>{t('vatPercentage')}</FieldLabel>
            <TextInput value="14" />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel>{t('taxMethod')}</FieldLabel>
            <SelectInput value={t('vatInclusive')} options={[t('vatInclusive'), t('vatExclusive')]} />
          </div>
        </div>

        <div className="border-t border-[#F2F2F2] mb-8" />

        <div className="flex items-start justify-between gap-6 mb-4">
          <div>
            <h3 className="text-[19px] font-medium text-black">{t('serviceCharge')}</h3>
            <p className="mt-1 text-sm text-[#686868]">{t('serviceChargeDesc')}</p>
          </div>
          <Toggle on={serviceEnabled} onChange={setServiceEnabled} />
        </div>
        <div className="w-1/2">
          <div className="flex flex-col gap-2">
            <FieldLabel>{t('servicePercentage')}</FieldLabel>
            <NumberInput value={12} min={0} max={100} placeholder={t('enterServicePct')} />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function PaymentTaxesTab() {
  return (
    <div className="flex flex-col gap-6">
      <PaymentConfigTab />
      <TaxesChargesTab />
    </div>
  );
}

function ReceiptFormatTab() {
  const t = useTranslations('settings.receipt');
  const [showTax, setShowTax] = useState(true);
  const [showService, setShowService] = useState(true);

  return (
    <div className="flex flex-col gap-6 xl:flex-row">
      <div className="flex flex-1 flex-col gap-6">
        <SectionCard>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <FieldLabel>{t('headerText')}</FieldLabel>
              <div className="min-h-[112px] w-full rounded-2xl bg-[#F2F2F2] p-4">
                <span className="text-base font-medium text-[#989898]">
                  {t('headerSample')}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <FieldLabel>{t('footerText')}</FieldLabel>
              <div className="min-h-[112px] w-full rounded-2xl bg-[#F2F2F2] p-4">
                <span className="text-base font-medium text-[#989898]">
                  {t('footerSample')}
                </span>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-8">
              <div>
                <p className="text-xl font-medium text-black">{t('showTaxBreakdown')}</p>
                <p className="mt-1 text-base text-[#989898]">{t('showTaxDesc')}</p>
              </div>
              <Toggle on={showTax} onChange={setShowTax} />
            </div>
            <div className="flex items-center justify-between gap-8">
              <div>
                <p className="text-xl font-medium text-black">{t('showServiceCharge')}</p>
                <p className="mt-1 text-base text-[#989898]">{t('showServiceDesc')}</p>
              </div>
              <Toggle on={showService} onChange={setShowService} />
            </div>
          </div>
        </SectionCard>

      </div>

      {/* Right: receipt preview */}
      <div className="w-80 shrink-0 overflow-hidden rounded-xl bg-white py-10">
        <div className="flex flex-col items-center gap-7 px-6">
          {/* Receipt logo */}
          <div className="relative h-12 w-36">
            <Image src="/images/logo-69e842.png" alt="Restaurant logo" fill sizes="144px" className="object-contain" />
          </div>

          <p className="w-60 text-center text-base font-light text-black leading-6">
            {t('footerSample')}
          </p>

          <div className="w-full border-t border-[#686868]" />

          <div className="flex w-full flex-col gap-5" dir="ltr">
            <div className="flex items-center justify-between">
              <span className="text-base text-[#686868]">{t('lineItem', { count: 1 })}</span>
              <span className="text-base text-[#686868]">$15.00</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base text-[#686868]">{t('lineItem', { count: 2 })}</span>
              <span className="text-base text-[#686868]">$15.00</span>
            </div>
          </div>

          <div className="w-full border-t border-[#686868]" />

          <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-base text-[#686868]">{t('subtotal')}</span>
              <span className="text-base text-[#686868]">$30.00</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base text-[#686868]">{t('vatLine')}</span>
              <span className="text-base text-[#686868]">$3.00</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base text-[#686868]">{t('serviceLine')}</span>
              <span className="text-base text-[#686868]">$3.30</span>
            </div>
            <div className="flex items-center justify-between border-t border-[#686868] pt-4">
              <span className="text-xl font-medium text-black">{t('total')}</span>
              <span className="text-xl font-medium text-black">$36.30</span>
            </div>
          </div>

          <div className="w-full border-t border-[#686868]" />

          <p className="w-60 text-center text-base font-light text-black leading-6">
            {t('comeAgain')}<br />
            <span dir="ltr">{t('wifi')}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function NotificationTab() {
  const t = useTranslations('settings.notification');
  const locale = useLocale();
  const isAr = locale === 'ar';

  const notifications = [
    { name: 'Brian Griffin', name_ar: 'براين غريفين', actionKey: 'collab', timeKey: 'fiveDaysAgo', bold: true },
    { name: 'Adam', name_ar: 'آدم', from: "The Mayor's Office", from_ar: 'مكتب العمدة', actionKey: 'lookingFor', timeKey: 'oneMonthAgo' },
    { name: 'Neil', name_ar: 'نيل', actionKey: 'lookingFor', timeKey: 'oneMonthAgo' },
    { name: 'Quagmire', name_ar: 'كواغماير', from: 'Giggity Co.', from_ar: 'شركة غيغيتي', actionKey: 'lookingFor', timeKey: 'oneMonthAgo' },
    { name: 'Herbert', name_ar: 'هربرت', from: "Children's Program", from_ar: 'برنامج الأطفال', actionKey: 'lookingFor', timeKey: 'oneMonthAgo' },
    { name: 'Clevaland', name_ar: 'كليفلاند', from: 'The Post Office', from_ar: 'مكتب البريد', actionKey: 'lookingFor', timeKey: 'twoMonthsAgo' },
    { name: 'Joe', name_ar: 'جو', actionKey: 'lookingFor', timeKey: 'twoMonthsAgo' },
    { name: 'Stewie', name_ar: 'ستوي', from: 'World Takeover', from_ar: 'السيطرة على العالم', actionKey: 'lookingFor', timeKey: 'twoMonthsAgo' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <SectionCard title={t('recentTitle')}>
        <div className="rounded-xl overflow-hidden max-w-[700px]">
          <div className="flex flex-col divide-y divide-slate-100">
            {notifications.map((n, i) => {
              const displayName = isAr ? (n.name_ar ?? n.name) : n.name;
              const displayFrom = isAr && 'from_ar' in n ? ((n.from_ar as string) ?? (n as { from?: string }).from) : (n as { from?: string }).from;
              return (
              <div key={i} className="flex items-start gap-3 px-5 py-5">
                <div className="h-10 w-10 shrink-0 rounded-full bg-[#F2F2F2] flex items-center justify-center">
                  <User size={20} className="text-[#989898]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-5 text-gray-500">
                    {n.bold ? (
                      <>
                        <strong className="text-zinc-700">{displayName}</strong>
                        <span> {t(n.actionKey)}</span>
                      </>
                    ) : (
                      <>
                        {('from' in n && displayFrom
                          ? t('newOpportunity', { name: displayName, from: displayFrom, action: t(n.actionKey) })
                          : t('newOpportunityNoFrom', { name: displayName, action: t(n.actionKey) })
                        ).split(displayName).map((part, idx, arr) => (
                          <Fragment key={idx}>
                            {part}
                            {idx < arr.length - 1 && <strong className="text-zinc-600">{displayName}</strong>}
                          </Fragment>
                        ))}
                      </>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">{t(n.timeKey)}</p>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Inventory settings (owner/manager only — moved here from Cashier POS) ───

const ROD_INVENTORY_KEY = 'rod-inventory-settings';

interface RodInventorySettings {
  enableTracking: boolean;
  /** When ON, unavailable items are hidden from the customer menu. When OFF,
      they stay visible with an "Out of Stock" label and cannot be ordered. */
  autoHideUnavailable: boolean;
  lowStockAlerts: boolean;
}

const ROD_INVENTORY_DEFAULTS: RodInventorySettings = {
  enableTracking: true,
  autoHideUnavailable: true,
  lowStockAlerts: true,
};

function loadRodInventory(): RodInventorySettings {
  if (typeof window === 'undefined') return ROD_INVENTORY_DEFAULTS;
  try {
    const raw = window.localStorage.getItem(ROD_INVENTORY_KEY);
    if (!raw) return ROD_INVENTORY_DEFAULTS;
    const parsed = JSON.parse(raw);
    const pick = (v: unknown, fallback: boolean) => (typeof v === 'boolean' ? v : fallback);
    return {
      enableTracking: pick(parsed?.enableTracking, ROD_INVENTORY_DEFAULTS.enableTracking),
      autoHideUnavailable: pick(parsed?.autoHideUnavailable, ROD_INVENTORY_DEFAULTS.autoHideUnavailable),
      lowStockAlerts: pick(parsed?.lowStockAlerts, ROD_INVENTORY_DEFAULTS.lowStockAlerts),
    };
  } catch {
    return ROD_INVENTORY_DEFAULTS;
  }
}

function InventorySettingsTab() {
  const t = useTranslations('settings.inventory');
  const [values, setValues] = useState<RodInventorySettings>(loadRodInventory);

  useEffect(() => {
    try {
      window.localStorage.setItem(ROD_INVENTORY_KEY, JSON.stringify(values));
    } catch {
      // storage unavailable — selection simply won't persist
    }
  }, [values]);

  const set = (key: keyof RodInventorySettings) => (v: boolean) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  return (
    <div className="flex flex-col gap-6">
      <SectionCard title={t('title')}>
        <div className="flex flex-col gap-6">
          <ToggleRow title={t('enableTracking')} desc={t('enableTrackingDesc')} on={values.enableTracking} onChange={set('enableTracking')} />
          <ToggleRow title={t('autoHide')} desc={t('autoHideDesc')} on={values.autoHideUnavailable} onChange={set('autoHideUnavailable')} />
          <ToggleRow title={t('lowStockAlerts')} desc={t('lowStockAlertsDesc')} on={values.lowStockAlerts} onChange={set('lowStockAlerts')} />
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Session settings (owner/manager only — moved here from Cashier POS) ─────

const ROD_SESSION_KEY = 'rod-session-settings';

interface RodSessionSettings {
  requireFloat: boolean;
  requireCounted: boolean;
}

const ROD_SESSION_DEFAULTS: RodSessionSettings = {
  requireFloat: true,
  requireCounted: true,
};

function loadRodSession(): RodSessionSettings {
  if (typeof window === 'undefined') return ROD_SESSION_DEFAULTS;
  try {
    const raw = window.localStorage.getItem(ROD_SESSION_KEY);
    if (!raw) return ROD_SESSION_DEFAULTS;
    const parsed = JSON.parse(raw);
    const pick = (v: unknown, fallback: boolean) => (typeof v === 'boolean' ? v : fallback);
    return {
      requireFloat: pick(parsed?.requireFloat, ROD_SESSION_DEFAULTS.requireFloat),
      requireCounted: pick(parsed?.requireCounted, ROD_SESSION_DEFAULTS.requireCounted),
    };
  } catch {
    return ROD_SESSION_DEFAULTS;
  }
}

function SessionSettingsTab() {
  const t = useTranslations('settings.session');
  const [values, setValues] = useState<RodSessionSettings>(loadRodSession);

  useEffect(() => {
    try {
      window.localStorage.setItem(ROD_SESSION_KEY, JSON.stringify(values));
    } catch {
      // storage unavailable — selection simply won't persist
    }
  }, [values]);

  const set = (key: keyof RodSessionSettings) => (v: boolean) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  return (
    <div className="flex flex-col gap-6">
      <SectionCard title={t('title')}>
        <div className="flex flex-col gap-6">
          <ToggleRow title={t('requireFloat')} desc={t('requireFloatDesc')} on={values.requireFloat} onChange={set('requireFloat')} />
          <ToggleRow title={t('requireCounted')} desc={t('requireCountedDesc')} on={values.requireCounted} onChange={set('requireCounted')} />
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const BRANCHES = [
  { id: 'b1', name: 'Downtown (Main)', name_ar: 'وسط البلد (رئيسي)', phone: '+01284980', email: 'mike.t@example.com', address: '123 Business Rd, Metropolis', address_ar: '123 شارع الأعمال، المدينة' },
  { id: 'b2', name: 'Downtown (Main)', name_ar: 'وسط البلد (رئيسي)', phone: '+01284980', email: 'mike.t@example.com', address: '123 Business Rd, Metropolis', address_ar: '123 شارع الأعمال، المدينة' },
  { id: 'b3', name: 'Downtown (Main)', name_ar: 'وسط البلد (رئيسي)', phone: '+01284980', email: 'mike.t@example.com', address: '123 Business Rd, Metropolis', address_ar: '123 شارع الأعمال، المدينة' },
];

export default function SettingsPage() {
  const t = useTranslations('settings');
  const [active, setActive] = useState<TabId | null>('general');
  const [editBranch, setEditBranch] = useState<typeof BRANCHES[0] | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const TABS: { id: TabId; labelKey: string; icon: React.ElementType }[] = [
    { id: 'general',       labelKey: 'tabs.general',       icon: Globe      },
    { id: 'branches',      labelKey: 'tabs.branches',      icon: Building2  },
    { id: 'inventory',     labelKey: 'tabs.inventory',     icon: Package    },
    { id: 'session',       labelKey: 'tabs.session',       icon: Clock      },
    { id: 'payment-taxes', labelKey: 'tabs.paymentTaxes',  icon: CreditCard },
    { id: 'receipt',       labelKey: 'tabs.receipt',       icon: FileText   },
    { id: 'notification',  labelKey: 'tabs.notification',  icon: Bell       },
  ];

  // Tabs with a form get the sticky Save Changes footer.
  const showSave = active === 'general' || active === 'payment-taxes' || active === 'receipt' || active === 'inventory' || active === 'session';

  // Reset the scroll container to the top whenever the tab changes.
  useEffect(() => {
    const container = document.getElementById('admin-main-scroll');
    container?.scrollTo({ top: 0 });
  }, [active]);

  const tabTitle = active ? TABS.find((tb) => tb.id === active)! : null;

  return (
    <main className="flex flex-col gap-0 rounded-2xl bg-[#F2F2F2] lg:flex-row">

      {/* ── Mobile/Tablet: horizontal tab bar ── */}
      <div className="sticky top-0 z-10 lg:hidden">
        <div className="overflow-x-auto bg-white px-4 py-4 scrollbar-hide">
          <div className="flex items-center gap-2 w-max">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = active === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActive(isActive ? (null as unknown as TabId) : tab.id)}
                  className={cn(
                    'flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-[15px] font-medium transition-colors',
                    isActive
                      ? 'bg-[#026F4F] text-white'
                      : 'bg-[#F2F2F2] text-[#686868] hover:bg-[#E9E9E9]',
                  )}
                >
                  <Icon size={18} strokeWidth={1.5} />
                  <span className="whitespace-nowrap">{t(tab.labelKey)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Desktop: Settings left nav (collapsible) ── */}
      <aside className={cn(
        'sticky top-5 hidden h-[calc(100vh-40px)] shrink-0 overflow-y-auto rounded-xl bg-white m-5 transition-all duration-300 lg:block',
        sidebarOpen ? 'w-[280px]' : 'w-[72px]',
      )}>
        {/* Collapse toggle */}
        <div className="flex items-center justify-between px-4 pt-5 pb-2">
          {sidebarOpen && <h2 className="text-xl font-medium text-black">{t('title')}</h2>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F2F2F2] text-[#686868] hover:bg-[#E9E9E9]"
          >
            {sidebarOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="rtl:-scale-x-100"><path d="M15 18l-6-6 6-6" /></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="rtl:-scale-x-100"><path d="M9 18l6-6-6-6" /></svg>
            )}
          </button>
        </div>

        <nav className="mt-6 flex flex-col px-3 pb-6">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                title={!sidebarOpen ? t(tab.labelKey) : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-start text-[14px] font-normal transition-colors',
                  isActive
                    ? 'bg-[#F2F2F2] text-black font-medium'
                    : 'text-[#989898] hover:text-black',
                  !sidebarOpen && 'justify-center px-0',
                )}
              >
                <Icon size={20} strokeWidth={1.5} className="shrink-0" />
                {sidebarOpen && <span className="flex-1 truncate">{t(tab.labelKey)}</span>}
                {sidebarOpen && (
                  <ChevronRight size={15} className={cn('rtl:-scale-x-100', isActive ? 'text-black' : 'text-[#989898]')} />
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ── Content area ── */}
      <div className="flex-1 p-4 lg:py-5 lg:pe-5 lg:ps-0">
        {/* Page title (hidden on the notification tab per client) */}
        {active && tabTitle && active !== 'notification' && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 bg-[#F2F2F2] lg:sticky lg:top-0 lg:z-20 lg:py-3">
            {(() => {
              const Icon = tabTitle.icon;
              return (
                <div className="flex items-center gap-2.5">
                  <Icon size={22} className="text-[#2D2F33]" strokeWidth={1.8} />
                  <h1 className="text-[22px] font-medium leading-[30px] text-[#2D2F33] sm:text-[26px] sm:leading-[36px] xl:text-[30px] xl:leading-[40px]">
                    {active === 'receipt' ? t(tabTitle.labelKey) : t('tabsSettings', { tab: t(tabTitle.labelKey) })}
                  </h1>
                </div>
              );
            })()}
          </div>
        )}

        {active === 'general'      && <GeneralBrandTab />}
        {active === 'branches'     && (
          <BranchManagementTab
            onEdit={(b) => setEditBranch(b)}
            onDelete={() => {}}
          />
        )}
        {active === 'payment-taxes' && <PaymentTaxesTab />}
        {active === 'receipt'      && <ReceiptFormatTab />}
        {active === 'notification' && <NotificationTab />}
        {active === 'inventory'    && <InventorySettingsTab />}
        {active === 'session'      && <SessionSettingsTab />}

        {/* Save Changes — one sticky footer for every form tab */}
        {showSave && <SaveButton />}
      </div>

      <EditBranchModal
        open={!!editBranch}
        branch={editBranch}
        onClose={() => setEditBranch(null)}
      />
    </main>
  );
}
