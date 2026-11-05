'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Download, ChevronDown, Trash2 } from 'lucide-react';
import { useLocale } from 'next-intl';
import { TableQrCode } from '@/components/shared/TableQrCode';
import { cn, lockPageScroll } from '@/lib/utils';

interface AddEditTableData {
  name: string;
  name_ar?: string;
  zone: string;
  zone_ar?: string;
  capacity: number;
}

const CATEGORIES = [
  { label: 'Indoor', label_ar: 'داخلي', value: 'Indoor' },
  { label: 'Outdoor', label_ar: 'خارجي', value: 'Outdoor' },
  { label: 'Patio', label_ar: 'فناء', value: 'Patio' },
] as const;

export function AddEditTableModal({
  open,
  table,
  onClose,
  onSave,
  onMarkReserved,
  onDelete,
}: {
  open: boolean;
  table?: AddEditTableData | null;
  onClose: () => void;
  onSave?: (data: { name: string; capacity: number; zone: string }) => void;
  onMarkReserved?: () => void;
  onDelete?: () => void;
}) {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const editMode = !!table;

  const [tableName, setTableName] = useState(editMode ? (table?.name ?? '') : '');
  const [capacity, setCapacity] = useState<number | string>(editMode ? (table?.capacity ?? 4) : 2);
  const [category, setCategory] = useState<string>(editMode ? (table?.zone ?? 'Indoor') : 'Indoor');
  const [openDropdown, setOpenDropdown] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editMode && table) {
      setTableName(table.name);
      setCapacity(table.capacity);
      setCategory(table.zone);
    } else {
      setTableName('');
      setCapacity(2);
      setCategory('Indoor');
    }
  }, [editMode, table]);

  useEffect(() => {
    if (!open) setOpenDropdown(false);
    if (!open) return;
    lockPageScroll(true);
    return () => lockPageScroll(false);
  }, [open]);

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;
    const clone = svg.cloneNode(true) as SVGElement;
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const data = new XMLSerializer().serializeToString(clone);
    const blob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `table-qr-${(tableName || (editMode ? table?.name : 'new-table') || 'table').toLowerCase().replace(/\s+/g, '-')}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    const numCapacity = typeof capacity === 'number' ? capacity : parseInt(capacity, 10) || 2;
    onSave?.({
      name: tableName.trim() || (editMode ? (table?.name ?? 'Table') : 'New Table'),
      capacity: numCapacity,
      zone: category,
    });
    onClose();
  };

  const displayName = editMode ? (isAr ? (table?.name_ar ?? table?.name) : table?.name) : (isAr ? 'إضافة طاولة' : 'Add Table');
  const currentCategoryObj = CATEGORIES.find((c) => c.value === category);
  const displayCategoryLabel = currentCategoryObj ? (isAr ? currentCategoryObj.label_ar : currentCategoryObj.label) : (isAr ? 'اختر الفئة' : 'Select category');

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
          'fixed end-0 top-0 z-50 flex h-full w-full flex-col bg-[#F2F2F2] shadow-[-2px_0px_12px_rgba(0,0,0,0.10)] transition-transform duration-300 sm:w-[619px]',
          open ? 'translate-x-0' : 'ltr:translate-x-full rtl:-translate-x-full',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between px-5 pt-6 sm:px-6 sm:pt-7">
          <button
            onClick={onClose}
            aria-label={isAr ? 'رجوع' : 'Back'}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E9E9E9] text-black transition-colors hover:bg-[#DCDCDC]"
          >
            <ArrowLeft size={22} className="rtl:scale-x-[-1]" />
          </button>

          <div className="flex flex-col items-center gap-2">
            <h2 className="text-[24px] font-medium leading-8 text-black sm:text-[32px] sm:leading-10">
              {displayName}
            </h2>
            {editMode && (
              <span className="inline-flex items-center rounded-[37px] bg-[#1FB711] px-3.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                {isAr ? 'متاح' : 'AVAILABLE'}
              </span>
            )}
          </div>

          <div className="h-11 w-11" />
        </div>

        {/* Form & QR Content — scrollable so everything is visible and nothing is cut off */}
        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6 sm:py-6">
          {/* Prominent Figma QR Code section */}
          <div className="flex flex-col items-center gap-4 pt-1">
            <div
              ref={qrRef}
              className="flex h-[160px] w-[160px] items-center justify-center rounded-2xl bg-white p-3 shadow-[0px_2px_8px_rgba(0,0,0,0.06)] outline outline-1 outline-[#E9E9E9]"
            >
              <TableQrCode tableName={tableName || (editMode ? table?.name : '') || 'new-table'} size={138} />
            </div>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-[44px] bg-[rgba(242,211,255,0.54)] px-4 py-2 text-sm font-semibold leading-5 text-[#961D6E] transition-colors hover:bg-[rgba(242,211,255,0.8)] sm:text-base"
            >
              <Download size={18} />
              <span>{isAr ? 'تحميل' : 'Download'}</span>
            </button>
          </div>

          {editMode && (
            <div className="flex flex-col items-center">
              <span className="text-[24px] font-semibold leading-8 text-black sm:text-[30px] sm:leading-9">
                {isAr ? 'تعديل الطاولة' : 'Edit Table'}
              </span>
            </div>
          )}

          {/* Table Info Card */}
          <div className="rounded-2xl bg-white p-5 outline outline-1 outline-offset-[-1px] outline-[#E9E9E9] sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-[#2D2F33] sm:text-lg">
              {isAr ? 'معلومات الطاولة' : 'Table Info'}
            </h3>

            <div className="mt-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium leading-4 text-[#686868] sm:text-base">
                  {isAr ? 'اسم الطاولة / الرقم' : 'Table Name / Number'}
                </label>
                <input
                  type="text"
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value)}
                  placeholder={isAr ? 'مثال: طاولة 12' : 'e.g. Table 12'}
                  className="flex h-12 w-full rounded-[87px] bg-[#F2F2F2] px-4 font-satoshi text-sm font-medium text-[#2D2F33] outline-none transition-colors focus:ring-2 focus:ring-[#026F4F] sm:h-14 sm:text-base"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium leading-4 text-[#686868] sm:text-base">
                  {isAr ? 'السعة' : 'Seating Capacity'}
                </label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  min={1}
                  max={50}
                  className="flex h-12 w-full rounded-[87px] bg-[#F2F2F2] px-4 font-satoshi text-sm font-medium text-[#2D2F33] outline-none transition-colors focus:ring-2 focus:ring-[#026F4F] sm:h-14 sm:text-base"
                />
              </div>

              <div className="relative flex flex-col gap-1.5">
                <label className="text-sm font-medium leading-4 text-[#686868] sm:text-base">
                  {isAr ? 'الفئة' : 'Category'}
                </label>
                <button
                  type="button"
                  onClick={() => setOpenDropdown((v) => !v)}
                  className="flex h-12 w-full items-center justify-between rounded-[87px] bg-[#F2F2F2] px-4 text-start sm:h-14"
                >
                  <span className={cn('font-satoshi text-sm font-medium sm:text-base', category ? 'text-[#2D2F33]' : 'text-[#989898]')}>
                    {displayCategoryLabel}
                  </span>
                  <ChevronDown size={18} className={cn('text-[#989898] transition-transform', openDropdown && 'rotate-180')} />
                </button>
                {openDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(false)} />
                    <div className="absolute inset-x-0 top-full z-20 mt-1 overflow-hidden rounded-2xl bg-white shadow-lg outline outline-1 outline-[#E9E9E9]">
                      {CATEGORIES.map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => { setCategory(c.value); setOpenDropdown(false); }}
                          className={cn(
                            'block w-full px-4 py-2.5 text-start font-satoshi text-sm leading-5 transition-colors hover:bg-[#F2F2F2] sm:text-base sm:leading-6',
                            category === c.value ? 'text-[#026F4F] font-semibold' : 'text-[#2D2F33]',
                          )}
                        >
                          {isAr ? c.label_ar : c.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer (view/edit table only in Owner Dashboard — no seating or reserving tables) */}
        <div className="mt-auto shrink-0 border-t border-[#E2E2E2] px-5 py-4 sm:px-6 sm:py-5">
          {editMode && onDelete && (
            <button
              onClick={onDelete}
              className="mb-3 flex h-12 w-full items-center justify-center gap-2 rounded-[30px] bg-[#FDECEC] text-base font-semibold text-[#E85E5E] outline outline-1 outline-offset-[-1px] outline-[#E85E5E] transition-colors hover:bg-[#FBDCDC] sm:h-14 sm:text-lg"
            >
              <Trash2 size={20} strokeWidth={2} />
              {isAr ? 'حذف الطاولة' : 'Delete Table'}
            </button>
          )}
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <button
              onClick={onClose}
              className="flex h-12 flex-1 items-center justify-center rounded-[30px] bg-[#E9E9E9] text-base font-medium text-[#2D2F33] shadow-[0px_4px_16.3px_rgba(0,0,0,0.08)] outline outline-1 outline-offset-[-1px] outline-[#B9B9B9] transition-colors hover:bg-[#DCDCDC] sm:h-14 sm:text-lg"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              onClick={handleSave}
              className="flex h-12 flex-1 items-center justify-center rounded-[30px] bg-[#026F4F] text-base font-medium text-white shadow-[0px_4px_16.3px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#015c42] sm:h-14 sm:text-lg"
            >
              {editMode ? (isAr ? 'حفظ التعديلات' : 'Save Changes') : (isAr ? 'حفظ الطاولة' : 'Save Table')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
