'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, X, Globe, Upload, Plus, Trash2, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  options: string[];
  onChange: (v: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex h-12 w-full items-center justify-between rounded-[87px] bg-[#F2F2F2] px-4 text-left transition-colors hover:bg-[#EAEAEA]',
          className,
        )}
      >
        <span className="truncate font-satoshi text-base font-medium leading-5 text-[#2D2F33]">{value}</span>
        <ChevronDown size={18} className={cn('shrink-0 text-[#989898] transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 right-0 top-full z-40 mt-1 max-h-60 overflow-y-auto rounded-2xl bg-white py-1 shadow-lg outline outline-1 outline-[#E9E9E9]">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => { onChange(option); setOpen(false); }}
                className={cn(
                  'block w-full truncate px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-[#F2F2F2] sm:text-base',
                  value === option ? 'text-[#026F4F]' : 'text-[#2D2F33]',
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

type CustomOption = { en: string; ar: string; price: string };

function CustomizationGroup({ onRemove }: { onRemove: () => void }) {
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

  return (
    <div className="w-full rounded-[10px] outline outline-2 outline-offset-[-1.9px] outline-[#989898]">
      <div className="flex flex-col gap-5 p-[18px]">
        {/* Group name */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium leading-5 text-[#686868]">Group Name</span>
            <button
              onClick={onRemove}
              aria-label="Remove group"
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

        {/* Selection type */}
        <div className="flex w-64 flex-col gap-2">
          <span className="text-sm font-medium leading-5 text-[#686868]">Selection Type</span>
          <div className="relative flex h-12 items-center rounded-[35.08px] bg-[#E9E9E9]">
            <button
              onClick={() => setSelectionType('Single')}
              className={cn(
                'flex h-full flex-1 items-center justify-center rounded-3xl text-sm font-medium leading-5 transition-colors',
                selectionType === 'Single' ? 'bg-[#026F4F] text-white' : 'text-[#989898]',
              )}
            >
              Single
            </button>
            <button
              onClick={() => setSelectionType('Multi')}
              className={cn(
                'flex h-full flex-1 items-center justify-center rounded-3xl text-sm font-medium leading-5 transition-colors',
                selectionType === 'Multi' ? 'bg-[#026F4F] text-white' : 'text-[#989898]',
              )}
            >
              Multi
            </button>
          </div>
        </div>

        {/* Required */}
        <div className="flex items-center gap-8">
          <span className="text-sm font-medium leading-5 text-[#686868]">Required Selection</span>
          <button
            type="button"
            onClick={() => setRequired((v) => !v)}
            aria-pressed={required}
            className={cn(
              'relative h-6 w-12 cursor-pointer rounded-[18.96px] transition-colors',
              required ? 'bg-[#026F4F]' : 'bg-[#989898]',
            )}
          >
            <span
              className={cn(
                'absolute top-[3.32px] h-4 w-4 rounded-full bg-white transition-transform',
                required ? 'left-[28px]' : 'left-[3.79px]',
              )}
            />
          </button>
        </div>

        {/* Selection limit */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium leading-5 text-[#686868]">Selection Limit</span>
          <Select value={limit} onChange={setLimit} options={['No Limit', '1', '2', '3', '4', '5']} />
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium leading-5 text-[#686868]">Options</span>
          <div className="flex flex-col gap-3">
            {options.map((opt, i) => (
              <div key={i} className="flex flex-col gap-2.5 rounded-xl border border-[#E9E9E9] p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium leading-4 text-[#989898]">Option {i + 1}</span>
                  <button
                    onClick={() => removeOption(i)}
                    aria-label="Remove option"
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
                  <span className="w-10 shrink-0 text-xs font-medium leading-4 text-[#686868]">Price</span>
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
            <Plus size={18} className="text-[#026F4F]" /> Add Option
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
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
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
          'fixed right-0 top-0 z-50 flex h-full w-full flex-col rounded-tl-3xl rounded-bl-3xl bg-[#F2F2F2] shadow-[-2px_0px_12px_rgba(0,0,0,0.10)] transition-transform duration-300 sm:w-[619px]',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex shrink-0 items-center justify-between px-5 pt-6">
          <button onClick={onClose} aria-label="Back" className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E9E9E9] text-black transition-colors hover:bg-[#DcDcDc]">
            <ArrowLeft size={22} />
          </button>
          <h2 className="text-[32px] font-medium leading-10 text-black">Add New Item</h2>
          <div className="h-12 w-12" />
        </div>

        <div className="space-y-5 overflow-y-auto px-5 pb-5 pt-8">
          <section className="rounded-xl bg-white outline outline-1 outline-offset-[-1px] outline-[#E9E9E9]">
            <div className="px-[19px] pt-[19px]">
              <h3 className="text-lg font-semibold leading-7 text-[#2D2F33]">Product Image</h3>
            </div>
            <label className="mx-[19px] mb-5 mt-4 flex h-44 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl px-4 text-center outline outline-2 outline-offset-[-2px] outline-[#989898] transition-colors hover:outline-[#026F4F]">
              <input
                type="file"
                accept="image/png,image/jpeg"
                className="sr-only"
                onChange={(e) => setImageName(e.target.files?.[0]?.name ?? null)}
              />
              <Upload size={40} className="text-[#989898]" />
              <span className="text-lg font-semibold leading-7 text-[#026F4F]">
                {imageName ?? 'Upload Photo'}
                {!imageName && (
                  <span className="text-base font-medium leading-6 text-[#989898]"> or drag and drop</span>
                )}
              </span>
              <span className="text-xs font-normal leading-5 text-[#989898]">PNG, JPG up to 2MB</span>
            </label>
          </section>

          <section className="rounded-xl bg-white outline outline-1 outline-offset-[-1px] outline-[#E9E9E9]">
            <div className="flex flex-col gap-3.5 px-[19px] py-[19px]">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium leading-5 text-[#686868]">Item name</span>
                  <LangBadge lang="EN" />
                </div>
                <TextInput value={nameEn} onChange={setNameEn} placeholder="Enter your name..." className="h-14" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-base font-medium leading-5 text-[#686868]">Description</span>
                <TextArea value={descEn} onChange={setDescEn} placeholder="Briefly describe the item...." />
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-white outline outline-1 outline-offset-[-1px] outline-[#E9E9E9]">
            <div className="flex flex-col gap-3.5 px-[19px] py-[19px]">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium leading-5 text-[#686868]">Item name</span>
                  <LangBadge lang="AR" />
                </div>
                <TextInput value={nameAr} onChange={setNameAr} placeholder="أدخل الاسم..." className="h-14" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-base font-medium leading-5 text-[#686868]">Description</span>
                <TextArea value={descAr} onChange={setDescAr} placeholder="صف العنصر باختصار...." />
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-white outline outline-1 outline-offset-[-1px] outline-[#E9E9E9]">
            <div className="flex flex-col gap-6 px-[19px] py-[23px]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <div className="flex w-full flex-col gap-2 sm:w-60">
                  <span className="text-base font-medium leading-5 text-[#686868]">Price (EGP)</span>
                  <TextInput type="number" value={price} onChange={setPrice} placeholder="0.00" className="h-14" />
                </div>
                <div className="flex w-full flex-col gap-2 sm:w-60">
                  <span className="text-base font-medium leading-5 text-[#686868]">Category</span>
                  <Select
                    value={category}
                    onChange={setCategory}
                    options={['Burgers', 'Ramen', 'Drinks', 'Sides', 'Rice']}
                    className="h-14"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex w-44 flex-col gap-3">
                  <span className="text-lg font-medium leading-7 text-[#2D2F33]">Availability</span>
                  <span className="text-xs font-normal leading-5 text-[#989898]">Show item on the live menu</span>
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
                      'absolute top-[3.5px] h-4 w-4 rounded-full bg-white transition-transform',
                      available ? 'right-[3.5px]' : 'left-[3.5px]',
                    )}
                  />
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-white outline outline-1 outline-offset-[-1px] outline-[#E9E9E9]">
            <div className="flex flex-col gap-4 px-[18px] py-[18px]">
              <div className="flex w-64 flex-col gap-1.5">
                <h3 className="text-lg font-semibold leading-7 text-[#2D2F33]">Customizations</h3>
                <p className="text-xs font-normal leading-5 text-[#989898]">Define add-ons, modifiers, and preferences.</p>
              </div>
              {customizations.length === 0 ? (
                <div className="flex h-24 items-center justify-center rounded-xl bg-[#F2F2F2]">
                  <div className="flex flex-col items-center gap-3">
                    <Plus size={28} className="text-[#989898]" />
                    <span className="text-xs font-medium leading-5 text-[#989898]">No customizations added..</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3.5">
                  {customizations.map((id) => (
                    <CustomizationGroup
                      key={id}
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
                  <Plus size={22} /> Add Customization
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
              Cancel
            </button>
            <button
              onClick={onClose}
              className="flex h-14 flex-1 items-center justify-center rounded-[30px] bg-[#026F4F] text-lg font-medium text-white shadow-[0px_4px_16.3px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#015c42]"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
