'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { TableCard, TableStatus } from '@/components/shared/TableCard';
import { SeatGuestsModal } from '@/components/shared/SeatGuestsModal';
import { AddEditTableModal } from '@/components/shared/AddEditTableModal';
import { MarkReservedModal } from '@/components/shared/MarkReservedModal';
import { ReservedDetailModal } from '@/components/shared/ReservedDetailModal';
import { TableInfoModal } from '@/components/shared/TableInfoModal';
import { AddTableCategoryModal } from '@/components/shared/AddTableCategoryModal';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { cn } from '@/lib/utils';
import { useQueryModal, readQueryParam, writeQueryParam } from '@/lib/use-query-modal';

interface TableDef {
  id: string;
  name: string;
  name_ar?: string;
  zone: 'Indoor' | 'Outdoor' | 'Patio';
  zone_ar?: string;
  status: TableStatus;
  bill?: string;
  time?: string;
  time_ar?: string;
  capacity: number;
  orderNumbers?: string[];
}

const INITIAL_TABLES: TableDef[] = [
  { id: 't1', name: 'Table A08', name_ar: 'طاولة A08', zone: 'Indoor',  zone_ar: 'داخلي', status: 'occupied',  bill: '$65.00', time: '35 mins', time_ar: '35 دقيقة', capacity: 4, orderNumbers: ['#0044', '#0048'] },
  { id: 't2', name: 'Table A09', name_ar: 'طاولة A09', zone: 'Indoor',  zone_ar: 'داخلي', status: 'available',                                          capacity: 4 },
  { id: 't3', name: 'Table B02', name_ar: 'طاولة B02', zone: 'Indoor',  zone_ar: 'داخلي', status: 'reserved',                                           capacity: 6 },
  { id: 't4', name: 'Table B03', name_ar: 'طاولة B03', zone: 'Indoor',  zone_ar: 'داخلي', status: 'occupied',  bill: '$24.50', time: '12 mins', time_ar: '12 دقيقة', capacity: 4, orderNumbers: ['#0043'] },
  { id: 't5', name: 'Table C01', name_ar: 'طاولة C01', zone: 'Outdoor', zone_ar: 'خارجي', status: 'available',                                          capacity: 2 },
  { id: 't6', name: 'Table C02', name_ar: 'طاولة C02', zone: 'Outdoor', zone_ar: 'خارجي', status: 'occupied',  bill: '$81.20', time: '48 mins', time_ar: '48 دقيقة', capacity: 6, orderNumbers: ['#0039', '#0041', '#0045'] },
  { id: 't7', name: 'Table D01', name_ar: 'طاولة D01', zone: 'Patio',   zone_ar: 'فناء',  status: 'reserved',                                           capacity: 4 },
  { id: 't8', name: 'Table D02', name_ar: 'طاولة D02', zone: 'Patio',   zone_ar: 'فناء',  status: 'available',                                          capacity: 4 },
];

const ZONES = ['All', 'Indoor', 'Outdoor', 'Patio'] as const;
type Zone = typeof ZONES[number];

export default function TablesPage() {
  const t = useTranslations('tables');
  const locale = useLocale();
  const isAr = locale === 'ar';

  const [tables, setTables] = useState<TableDef[]>(INITIAL_TABLES);
  const [zone, setZone]   = useState<Zone>('All');
  // Query-driven overlays: ?modal=<name>[&id=t1]
  // table (add/edit) · mark-reserved · reserved-detail · seat-guests ·
  // table-info · add-table-category · delete-table
  const [tableOpen, setTableOpen] = useQueryModal('table');
  const [editing, setEditing]       = useState<TableDef | null>(null);
  const [infoOpen, setInfoOpen] = useQueryModal('table-info');
  const [selected, setSelected]     = useState<TableDef | null>(null);
  const [markOpen, setMarkOpen] = useQueryModal('mark-reserved');
  const [markReservedTable, setMarkReservedTable] = useState<TableDef | null>(null);
  const [reservedOpen, setReservedOpen] = useQueryModal('reserved-detail');
  const [reservedTable, setReservedTable]         = useState<TableDef | null>(null);
  const [seatOpen, setSeatOpen] = useQueryModal('seat-guests');
  const [categoryOpen, setCategoryOpen] = useQueryModal('add-table-category');
  const [deleteOpen, setDeleteOpen] = useQueryModal('delete-table');
  const [deleteTarget, setDeleteTarget] = useState<TableDef | null>(null);

  const findTable = (id: string | null, list: TableDef[]) =>
    id ? (list.find((t) => t.id === id) ?? null) : null;

  const openTable = (t: TableDef | null) => {
    setEditing(t);
    writeQueryParam('id', t?.id ?? null, false);
    setTableOpen(true);
  };
  const closeTable = () => {
    setEditing(null);
    setTableOpen(false);
    writeQueryParam('id', null, false);
  };
  const openInfo = (t: TableDef) => {
    setSelected(t);
    writeQueryParam('id', t.id, false);
    setInfoOpen(true);
  };
  const closeInfo = () => {
    setSelected(null);
    setInfoOpen(false);
    writeQueryParam('id', null, false);
  };
  const openMarkReserved = (t: TableDef | null) => {
    setMarkReservedTable(t);
    writeQueryParam('id', t?.id ?? null, false);
    setMarkOpen(true);
  };
  const closeMarkReserved = () => {
    setMarkReservedTable(null);
    setMarkOpen(false);
    writeQueryParam('id', null, false);
  };
  const openReserved = (t: TableDef | null) => {
    setReservedTable(t);
    writeQueryParam('id', t?.id ?? null, false);
    setReservedOpen(true);
  };
  const closeReserved = () => {
    setReservedTable(null);
    setReservedOpen(false);
    writeQueryParam('id', null, false);
  };
  const openDelete = (t: TableDef) => {
    setDeleteTarget(t);
    writeQueryParam('id', t.id, false);
    setDeleteOpen(true);
  };
  const closeDelete = () => {
    setDeleteTarget(null);
    setDeleteOpen(false);
    writeQueryParam('id', null, false);
  };

  // Cold load: restore overlay payloads from ?modal=&id=
  useEffect(() => {
    const modal = readQueryParam('modal');
    const id = readQueryParam('id');
    if (!modal) return;
    const found = findTable(id, INITIAL_TABLES);
    if (modal === 'table' && id && found) setEditing(found);
    else if (modal === 'table-info' && found) setSelected(found);
    else if (modal === 'mark-reserved' && found) setMarkReservedTable(found);
    else if (modal === 'reserved-detail' && found) setReservedTable(found);
    else if (modal === 'delete-table' && found) setDeleteTarget(found);
  }, []);

  const filtered = zone === 'All' ? tables : tables.filter((t) => t.zone === zone);

  // Bidi-isolate interpolated Latin/digit runs inside Arabic sentences so
  // order counts and table codes never render reversed.
  const iso = (s: string | number) => '\u2066' + s + '\u2069';

  const handleDeleteTable = (target: TableDef | null) => {
    if (!target) return;
    setTables((prev) => prev.filter((t) => t.id !== target.id));
    setSelected((prev) => (prev && prev.id === target.id ? null : prev));
    setEditing((prev) => (prev && prev.id === target.id ? null : prev));
    setReservedTable((prev) => (prev && prev.id === target.id ? null : prev));
    setMarkReservedTable((prev) => (prev && prev.id === target.id ? null : prev));
    closeDelete();
    closeTable();
  };

  return (
    <main className="flex flex-col gap-5">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-[22px] font-medium leading-[30px] text-[#2D2F33] sm:text-[26px] sm:leading-[36px] xl:text-[30px] xl:leading-[40px]">
              {t('title')}
            </h1>
            <p className="text-[13px] text-[#989898] sm:text-[15px] xl:text-base">{t('subtitle')}</p>
          </div>

          {/* Zone filter pills */}
          <div className="flex flex-wrap items-center gap-2.5">
            {ZONES.map((z) => (
              <button
                key={z}
                onClick={() => setZone(z)}
                className={cn(
                  'inline-flex h-10 items-center justify-center rounded-full px-4 text-[13px] leading-[1.4] transition-colors sm:text-sm',
                  zone === z
                    ? 'bg-[#026F4F] text-white'
                    : 'bg-white text-[#686868] hover:bg-[#F2F2F2]',
                )}
              >
                {z === 'All' ? t('zones.all') : z === 'Indoor' ? t('zones.indoor') : z === 'Outdoor' ? t('zones.outdoor') : t('zones.patio')}
              </button>
            ))}
          </div>
        </div>

        {/* Add Category + Add Table */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCategoryOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-[51.28px] bg-white px-3.5 outline outline-1 outline-offset-[-1px] outline-[#686868] transition-colors hover:bg-[#F2F2F2]"
          >
            <Plus size={14} className="text-[#686868]" />
            <span className="whitespace-nowrap text-sm font-normal leading-5 text-[#686868]">{t('addCategory')}</span>
          </button>
          <button
            onClick={() => openTable(null)}
            className="flex h-10 items-center gap-2 rounded-full bg-[#026F4F] px-5 text-white transition-colors hover:bg-[#015c42] sm:h-11"
          >
            <Plus size={17} strokeWidth={2} />
            <span className="font-satoshi text-[14px] font-medium sm:text-[15px]">{t('addTable')}</span>
          </button>
        </div>
      </div>

      {/* ── Table grid ── */}
      <div className="grid grid-cols-1 justify-items-center gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((tab) => (
          <div key={tab.id} className="relative mx-auto w-full max-w-[301px]">
            <button
              onClick={() => openInfo(tab)}
              aria-label={isAr ? `عرض ${tab.name_ar ?? tab.name}` : `View ${tab.name}`}
              className="w-full cursor-pointer text-start transition-transform hover:-translate-y-0.5 focus:outline-none"
            >
              <TableCard
                name={tab.name}
                name_ar={tab.name_ar}
                zone={tab.zone}
                zone_ar={tab.zone_ar}
                status={tab.status}
                bill={tab.bill}
                time={tab.time}
                time_ar={tab.time_ar}
                orderNumbers={tab.orderNumbers}
              />
            </button>
            {/* Edit/delete actions are always visible — no hover needed (touch screens have no hover). */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-1 rounded-full bg-white/90 p-1 shadow-sm ring-1 ring-black/5 backdrop-blur-sm">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); openTable(tab); }}
                  aria-label={isAr ? `تعديل ${tab.name_ar ?? tab.name}` : `Edit ${tab.name}`}
                  title={isAr ? 'تعديل' : 'Edit'}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#686868] transition-colors hover:bg-[#F2F2F2] hover:text-[#026F4F] [@media(pointer:coarse)]:h-10 [@media(pointer:coarse)]:w-10"
                >
                  <Image src="/images/figma/pencil.svg" alt="" width={14} height={14} className="size-[14px]" />
                </button>
                <span className="h-4 w-px bg-black/10" aria-hidden="true" />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); openDelete(tab); }}
                  aria-label={isAr ? `حذف ${tab.name_ar ?? tab.name}` : `Delete ${tab.name}`}
                  title={isAr ? 'حذف' : 'Delete'}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#686868] transition-colors hover:bg-[#FDECEC] hover:text-[#E85E5E] [@media(pointer:coarse)]:h-10 [@media(pointer:coarse)]:w-10"
                >
                  <Trash2 size={14} strokeWidth={1.75} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Modals ── */}
      <AddEditTableModal
        open={tableOpen}
        table={editing}
        onClose={closeTable}
        onMarkReserved={() => {
          const current = editing;
          closeTable();
          openMarkReserved(current);
        }}
      />

      <MarkReservedModal
        open={markOpen}
        tableName={isAr ? (markReservedTable?.name_ar ?? markReservedTable?.name ?? '') : (markReservedTable?.name ?? '')}
        onClose={closeMarkReserved}
        onSave={() => {
          const current = markReservedTable;
          closeMarkReserved();
          openReserved(current);
        }}
      />

      <ReservedDetailModal
        open={reservedOpen}
        table={reservedTable}
        onClose={closeReserved}
        onSeatGuests={() => {
          closeReserved();
          setSeatOpen(true);
        }}
      />

      <SeatGuestsModal
        open={seatOpen}
        onClose={() => setSeatOpen(false)}
        onSave={() => {
          setSeatOpen(false);
          window.location.reload();
        }}
      />

      <TableInfoModal
        open={infoOpen}
        table={selected}
        onClose={closeInfo}
        onEdit={(tab) => { closeInfo(); openTable(tab as TableDef); }}
        onDelete={(tab) => { closeInfo(); openDelete(tab as TableDef); }}
        onClearTable={(tab) => {
          const target = tab as TableDef;
          setTables((prev) =>
            prev.map((t) =>
              t.id === target.id
                ? { ...t, status: 'available' as const, bill: undefined, time: undefined, time_ar: undefined, orderNumbers: [] }
                : t,
            ),
          );
          closeInfo();
        }}
      />

      <AddTableCategoryModal open={categoryOpen} onClose={() => setCategoryOpen(false)} />

      <ConfirmDialog
        open={deleteOpen}
        title={isAr ? `حذف ${iso(deleteTarget?.name_ar ?? deleteTarget?.name ?? 'الطاولة')}؟` : `Delete ${deleteTarget?.name ?? 'table'}?`}
        description={isAr
          ? `سيؤدي هذا إلى حذف ${iso(deleteTarget?.name_ar ?? deleteTarget?.name ?? 'هذه الطاولة')} نهائياً${deleteTarget?.orderNumbers?.length ? ` والطلبات المرتبطة بها (${iso(deleteTarget.orderNumbers.length)})` : ''}. لا يمكن التراجع عن هذا الإجراء.`
          : `This will permanently remove ${deleteTarget?.name ?? 'this table'}${deleteTarget?.orderNumbers?.length ? ` and its ${deleteTarget.orderNumbers.length} linked order${deleteTarget.orderNumbers.length > 1 ? 's' : ''}` : ''}. This action cannot be undone.`}
        confirmLabel={isAr ? 'حذف' : 'Delete'}
        cancelLabel={isAr ? 'إلغاء' : 'Cancel'}
        onCancel={closeDelete}
        onConfirm={() => handleDeleteTable(deleteTarget)}
      />
    </main>
  );
}
