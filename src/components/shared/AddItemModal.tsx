'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, X, Globe, Plus, Trash2, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { cn, lockPageScroll } from '@/lib/utils';

function LangBadge({ lang, className }: { lang: 'EN' | 'AR'; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-2 rounded-[35px] bg-[#F2F2F2] px-3 py-1.5 text-sm font-medium leading-none text-[#026F4F]',
        className,
      )}
    >
      <Globe size={16} /> {lang}
    </span>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        'h-12 w-full rounded-[87px] bg-[#F2F2F2] px-4 font-satoshi text-base font-medium leading-5 text-[#2D2F33] outline-none transition-shadow placeholder:text-[#989898] focus:ring-2 focus:ring-[#026F4F]/30',
        className,
      )}
    />
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-24 w-full resize-none rounded-xl bg-[#F2F2F2] px-4 py-4 font-satoshi text-base font-medium leading-6 text-[#2D2F33] outline-none transition-shadow placeholder:text-[#989898] focus:ring-2 focus:ring-[#026F4F]/30"
    />
  );
}

function Select({
  value,
  options,
  onChange,
  className,
}: {
  value: string;
  options: { label: string; value: string }[] | string[];
  onChange: (v: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [direction, setDirection] = useState<'down' | 'up'>('down');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const normalizedOptions = options.map((opt) =>
    typeof opt === 'string' ? { label: opt, value: opt } : opt,
  );
  const currentLabel =
    normalizedOptions.find((opt) => opt.value === value)?.label ?? value;

  const toggleOpen = () => {
    if (!open && buttonRef.current) {
      // Flip upward when there is not enough room below (drawer bottom, small screens).
      // All 11 options (No Limit + 1-10) should fit without scrolling: ~41px each.
      const rect = buttonRef.current.getBoundingClientRect();
      const needed = Math.min(normalizedOptions.length * 41 + 8, 480);
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setDirection(spaceBelow < needed && spaceAbove > spaceBelow ? 'up' : 'down');
    }
    setOpen((v) => !v);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleOpen}
        className={cn(
          'flex h-12 w-full items-center justify-between rounded-[87px] bg-[#F2F2F2] px-4 text-start transition-colors hover:bg-[#EAEAEA]',
          className,
        )}
      >
        <span className="truncate font-satoshi text-base font-medium leading-5 text-[#2D2F33]">{currentLabel}</span>
        <ChevronDown size={18} className={cn('shrink-0 text-[#989898] transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className={cn(
            'absolute inset-x-0 z-40 overflow-y-auto rounded-2xl bg-white py-1 shadow-lg outline outline-1 outline-[#E9E9E9]',
            // Tall enough for all 11 options (No Limit + 1-10) with no scroll;
            // 65vh guard keeps it inside short viewports (then it scrolls).
            'max-h-[min(30rem,65vh)]',
            direction === 'down' ? 'top-full mt-1' : 'bottom-full mb-1',
          )}>
            {normalizedOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => { onChange(option.value); setOpen(false); }}
                className={cn(
                  'block w-full truncate px-4 py-2.5 text-start text-sm font-medium transition-colors hover:bg-[#F2F2F2] sm:text-base',
                  value === option.value ? 'text-[#026F4F]' : 'text-[#2D2F33]',
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

type CustomOption = { en: string; ar: string; price: string };

function CustomizationGroup({ onRemove, isAr }: { onRemove: () => void; isAr: boolean }) {
  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [options, setOptions] = useState<CustomOption[]>([
    { en: '', ar: '', price: '' },
    { en: '', ar: '', price: '' },
  ]);
  const [selectionType, setSelectionType] = useState<'Single' | 'Multi'>('Multi');
  const [required, setRequired] = useState(false);
  const [limit, setLimit] = useState('No Limit');

  const addOption = () => setOptions((p) => [...p, { en: '', ar: '', price: '' }]);
  const removeOption = (i: number) => setOptions((p) => p.filter((_, idx) => idx !== i));
  const updateOption = (i: number, key: keyof CustomOption, val: string) =>
    setOptions((p) => p.map((o, idx) => (idx === i ? { ...o, [key]: val } : o)));

  const limitOptions = [
    { label: isAr ? 'بدون حد' : 'No Limit', value: 'No Limit' },
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
    { label: '7', value: '7' },
    { label: '8', value: '8' },
    { label: '9', value: '9' },
    { label: '10', value: '10' },
  ];

  return (
    <div className="w-full rounded-[10px] outline outline-2 outline-offset-[-1.9px] outline-[#989898]">
      <div className="flex flex-col gap-5 p-[18px]">
        {/* Group name */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium leading-5 text-[#686868]">
              {isAr ? 'اسم المجموعة' : 'Group Name'}
            </span>
            <button
              onClick={onRemove}
              aria-label={isAr ? 'حذف المجموعة' : 'Remove group'}
              className="flex h-9 w-9 items-center justify-center rounded-md bg-[#E85E5E] text-white transition-colors hover:bg-[#d94a4a]"
            >
              <Trash2 size={18} />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <LangBadge lang="EN" />
            <TextInput value={nameEn} onChange={setNameEn} placeholder="e.g. Extras, Meat" />
          </div>
          <div className="flex items-center gap-3">
            <LangBadge lang="AR" />
            <TextInput value={nameAr} onChange={setNameAr} placeholder="مثال: إضافات" />
          </div>
        </div>

        {/* Selection type + Required (same row; Required sits on the right) */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex w-64 flex-col gap-2">
            <span className="text-sm font-medium leading-5 text-[#686868]">
              {isAr ? 'نوع الاختيار' : 'Selection Type'}
            </span>
            <div className="relative flex h-12 items-center rounded-[35.08px] bg-[#E9E9E9]">
              <button
                onClick={() => setSelectionType('Single')}
                className={cn(
                  'flex h-full flex-1 items-center justify-center rounded-3xl text-sm font-medium leading-5 transition-colors',
                  selectionType === 'Single' ? 'bg-[#026F4F] text-white' : 'text-[#989898]',
                )}
              >
                {isAr ? 'فردي' : 'Single'}
              </button>
              <button
                onClick={() => setSelectionType('Multi')}
                className={cn(
                  'flex h-full flex-1 items-center justify-center rounded-3xl text-sm font-medium leading-5 transition-colors',
                  selectionType === 'Multi' ? 'bg-[#026F4F] text-white' : 'text-[#989898]',
                )}
              >
                {isAr ? 'متعدد' : 'Multi'}
              </button>
            </div>
          </div>

          <div className="flex flex-nowrap items-center gap-3 pb-1">
            <span className="whitespace-nowrap text-sm font-medium leading-5 text-[#686868]">
              {isAr ? 'اختيار إلزامي' : 'Required Selection'}
            </span>
            <button
              type="button"
              onClick={() => setRequired((v) => !v)}
              aria-pressed={required}
              className={cn(
                'relative h-6 w-12 shrink-0 cursor-pointer rounded-[18.96px] transition-colors',
                required ? 'bg-[#026F4F]' : 'bg-[#989898]',
              )}
            >
              <span
                className={cn(
                  'absolute top-[3.32px] h-4 w-4 rounded-full bg-white transition-all',
                  required ? 'start-[28px]' : 'start-[3.79px]',
                )}
              />
            </button>
          </div>
        </div>

        {/* Selection limit */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium leading-5 text-[#686868]">
            {isAr ? 'حد الاختيار' : 'Selection Limit'}
          </span>
          <Select value={limit} onChange={setLimit} options={limitOptions} />
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium leading-5 text-[#686868]">
            {isAr ? 'الخيارات' : 'Options'}
          </span>
          <div className="flex flex-col gap-3">
            {options.map((opt, i) => (
              <div key={i} className="flex flex-col gap-2.5 rounded-xl border border-[#E9E9E9] p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium leading-4 text-[#989898]">
                    {isAr ? `الخيار ${i + 1}` : `Option ${i + 1}`}
                  </span>
                  <button
                    onClick={() => removeOption(i)}
                    aria-label={isAr ? 'حذف الخيار' : 'Remove option'}
                    className="flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-[#FDECEC]"
                  >
                    <X size={15} className="text-red-500" />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <LangBadge lang="EN" className="px-2.5 text-xs" />
                  <TextInput value={opt.en} onChange={(v) => updateOption(i, 'en', v)} placeholder="Option name" />
                </div>
                <div className="flex items-center gap-3">
                  <LangBadge lang="AR" className="px-2.5 text-xs" />
                  <TextInput value={opt.ar} onChange={(v) => updateOption(i, 'ar', v)} placeholder="اسم الخيار" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-10 shrink-0 text-xs font-medium leading-4 text-[#686868]">
                    {isAr ? 'السعر' : 'Price'}
                  </span>
                  <TextInput
                    type="number"
                    value={opt.price}
                    onChange={(v) => updateOption(i, 'price', v)}
                    placeholder="0.00"
                    className="w-32"
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={addOption}
            className="inline-flex items-center gap-1 self-start text-xs font-medium leading-4 text-[#026F4F]"
          >
            <Plus size={18} className="text-[#026F4F]" /> {isAr ? 'إضافة خيار' : 'Add Option'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function AddItemModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const locale = useLocale();
  const isAr = locale === 'ar';

  const [customizations, setCustomizations] = useState<number[]>([]);
  const nextId = useRef(0);
  const addCustomization = () => setCustomizations((p) => [...p, nextId.current++]);

  const [imageName, setImageName] = useState<string | null>(null);
  const [nameEn, setNameEn] = useState('');
  const [descEn, setDescEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [descAr, setDescAr] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Burgers');
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    if (!open) return;
    lockPageScroll(true);
    return () => lockPageScroll(false);
  }, [open]);

  const categoryOptions = [
    { label: isAr ? 'برجر' : 'Burgers', value: 'Burgers' },
    { label: isAr ? 'رامين' : 'Ramen', value: 'Ramen' },
    { label: isAr ? 'مشروبات' : 'Drinks', value: 'Drinks' },
    { label: isAr ? 'أطباق جانبية' : 'Sides', value: 'Sides' },
    { label: isAr ? 'أرز' : 'Rice', value: 'Rice' },
  ];

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
          'fixed end-0 top-0 z-50 flex h-full w-full flex-col rounded-ss-3xl rounded-es-3xl bg-[#F2F2F2] shadow-[-2px_0px_12px_rgba(0,0,0,0.10)] transition-transform duration-300 sm:w-[619px]',
          open ? 'translate-x-0' : 'ltr:translate-x-full rtl:-translate-x-full',
        )}
      >
        <div className="flex shrink-0 items-center justify-between px-5 pt-6">
          <button onClick={onClose} aria-label={isAr ? 'رجوع' : 'Back'} className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E9E9E9] text-black transition-colors hover:bg-[#DcDcDc]">
            <ArrowLeft size={22} className="rtl:scale-x-[-1]" />
          </button>
          <h2 className="text-[32px] font-medium leading-10 text-black">
            {isAr ? 'إضافة صنف جديد' : 'Add New Item'}
          </h2>
          <div className="h-12 w-12" />
        </div>

        <div className="space-y-5 overflow-y-auto px-5 pb-5 pt-8">
          <section className="rounded-xl bg-white p-[19px] outline outline-1 outline-offset-[-1px] outline-[#E9E9E9]">
            <h3 className="text-lg font-semibold leading-7 text-[#2D2F33]">
              {isAr ? 'صورة المنتج' : 'Product Image'}
            </h3>
            <label className="mt-4 flex min-h-[176px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-[#989898] p-6 text-center transition-colors hover:border-[#026F4F]">
              <input
                type="file"
                accept="image/png,image/jpeg"
                className="sr-only"
                onChange={(e) => setImageName(e.target.files?.[0]?.name ?? null)}
              />
              <span className="flex size-[52px] items-center justify-center">
                <Image
                  src="/images/figma/upload-gallery.svg"
                  alt=""
                  aria-hidden="true"
                  width={45}
                  height={45}
                  className="size-[44.833px]"
                />
              </span>
              <span className="block max-w-full text-lg font-semibold leading-7 text-[#026F4F]">
                {imageName ?? (isAr ? 'تحميل صورة' : 'Upload Photo')}
                {!imageName && (
                  <span className="text-base font-medium leading-6 text-[#989898]">
                    {isAr ? ' أو السحب والإفلات' : ' or drag and drop'}
                  </span>
                )}
              </span>
              <span className="text-xs font-normal leading-5 text-[#989898]">
                {isAr ? 'PNG، JPG حتى 2 ميجابايت' : 'PNG, JPG up to 2MB'}
              </span>
            </label>
          </section>

          <section className="rounded-xl bg-white outline outline-1 outline-offset-[-1px] outline-[#E9E9E9]">
            <div className="flex flex-col gap-3.5 px-[19px] py-[19px]">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium leading-5 text-[#686868]">
                    {isAr ? 'اسم الصنف' : 'Item name'}
                  </span>
                  <LangBadge lang="EN" />
                </div>
                <TextInput value={nameEn} onChange={setNameEn} placeholder="Enter item name..." className="h-14" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-base font-medium leading-5 text-[#686868]">
                  {isAr ? 'الوصف' : 'Description'}
                </span>
                <TextArea value={descEn} onChange={setDescEn} placeholder="Briefly describe the item...." />
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-white outline outline-1 outline-offset-[-1px] outline-[#E9E9E9]">
            <div className="flex flex-col gap-3.5 px-[19px] py-[19px]">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium leading-5 text-[#686868]">
                    {isAr ? 'اسم الصنف' : 'Item name'}
                  </span>
                  <LangBadge lang="AR" />
                </div>
                <TextInput value={nameAr} onChange={setNameAr} placeholder="أدخل اسم الصنف..." className="h-14" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-base font-medium leading-5 text-[#686868]">
                  {isAr ? 'الوصف' : 'Description'}
                </span>
                <TextArea value={descAr} onChange={setDescAr} placeholder="صف العنصر باختصار...." />
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-white outline outline-1 outline-offset-[-1px] outline-[#E9E9E9]">
            <div className="flex flex-col gap-6 px-[19px] py-[23px]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <div className="flex w-full flex-col gap-2 sm:w-60">
                  <span className="text-base font-medium leading-5 text-[#686868]">
                    {isAr ? 'السعر (ج.م)' : 'Price (EGP)'}
                  </span>
                  <TextInput type="number" value={price} onChange={setPrice} placeholder="0.00" className="h-14" />
                </div>
                <div className="flex w-full flex-col gap-2 sm:w-60">
                  <span className="text-base font-medium leading-5 text-[#686868]">
                    {isAr ? 'الفئة' : 'Category'}
                  </span>
                  <Select
                    value={category}
                    onChange={setCategory}
                    options={categoryOptions}
                    className="h-14"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex w-44 flex-col gap-3">
                  <span className="text-lg font-medium leading-7 text-[#2D2F33]">
                    {isAr ? 'التوفر' : 'Availability'}
                  </span>
                  <span className="text-xs font-normal leading-5 text-[#989898]">
                    {isAr ? 'إظهار الصنف في القائمة المباشرة' : 'Show item on the live menu'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setAvailable((v) => !v)}
                  aria-pressed={available}
                  className={cn(
                    'relative h-6 w-12 cursor-pointer rounded-[20px] transition-colors',
                    available ? 'bg-[#026F4F]' : 'bg-[#D9D9D9]',
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-[3.5px] h-4 w-4 rounded-full bg-white transition-all',
                      available ? 'start-[28px]' : 'start-[3.5px]',
                    )}
                  />
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-white outline outline-1 outline-offset-[-1px] outline-[#E9E9E9]">
            <div className="flex flex-col gap-4 px-[18px] py-[18px]">
              <div className="flex w-64 flex-col gap-1.5">
                <h3 className="text-lg font-semibold leading-7 text-[#2D2F33]">
                  {isAr ? 'التخصيصات' : 'Customizations'}
                </h3>
                <p className="text-xs font-normal leading-5 text-[#989898]">
                  {isAr ? 'تحديد الإضافات والتعديلات والتفضيلات.' : 'Define add-ons, modifiers, and preferences.'}
                </p>
              </div>
              {customizations.length === 0 ? (
                <div className="flex h-24 items-center justify-center rounded-xl bg-[#F2F2F2]">
                  <div className="flex flex-col items-center gap-3">
                    <Plus size={28} className="text-[#989898]" />
                    <span className="text-xs font-medium leading-5 text-[#989898]">
                      {isAr ? 'لم تتم إضافة أي تخصيصات..' : 'No customizations added..'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3.5">
                  {customizations.map((id) => (
                    <CustomizationGroup
                      key={id}
                      isAr={isAr}
                      onRemove={() => setCustomizations((p) => p.filter((x) => x !== id))}
                    />
                  ))}
                </div>
              )}
              <button
                onClick={addCustomization}
                className="flex h-14 items-center justify-center rounded-[87px] outline outline-2 outline-offset-[-2px] outline-[#989898] transition-colors hover:bg-[#F2F2F2]"
              >
                <span className="inline-flex items-center gap-1 text-base font-medium leading-6 text-[#989898]">
                  <Plus size={22} /> {isAr ? 'إضافة تخصيص' : 'Add Customization'}
                </span>
              </button>
            </div>
          </section>
        </div>

        <div className="shrink-0 border-t border-[#E2E2E2] px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={onClose}
              className="flex h-14 flex-1 items-center justify-center rounded-[30px] bg-[#E9E9E9] text-lg font-medium text-[#2D2F33] outline outline-1 outline-offset-[-1px] outline-[#B9B9B9] transition-colors hover:bg-[#DcDcDc]"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              onClick={onClose}
              className="flex h-14 flex-1 items-center justify-center rounded-[30px] bg-[#026F4F] text-lg font-medium text-white shadow-[0px_4px_16.3px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#015c42]"
            >
              {isAr ? 'حفظ' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
