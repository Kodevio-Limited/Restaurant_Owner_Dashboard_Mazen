'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { TableCard, TableStatus } from '@/components/shared/TableCard';
import { SeatGuestsModal } from '@/components/shared/SeatGuestsModal';
import { AddEditTableModal } from '@/components/shared/AddEditTableModal';
import { MarkReservedModal } from '@/components/shared/MarkReservedModal';
import { ReservedDetailModal } from '@/components/shared/ReservedDetailModal';
import { TableInfoModal } from '@/components/shared/TableInfoModal';
import { AddTableCategoryModal } from '@/components/shared/AddTableCategoryModal';
import { cn } from '@/lib/utils';

interface TableDef {
  id: string;
  name: string;
  zone: 'Indoor' | 'Outdoor' | 'Patio';
  status: TableStatus;
  bill?: string;
  time?: string;
  capacity: number;
}

const TABLES: TableDef[] = [
  { id: 't1', name: 'Table A08', zone: 'Indoor',  status: 'occupied',  bill: '$65.00', time: '35 mins', capacity: 4 },
  { id: 't2', name: 'Table A09', zone: 'Indoor',  status: 'available',                                   capacity: 4 },
  { id: 't3', name: 'Table B02', zone: 'Indoor',  status: 'reserved',                                    capacity: 6 },
  { id: 't4', name: 'Table B03', zone: 'Indoor',  status: 'occupied',  bill: '$24.50', time: '12 mins', capacity: 4 },
  { id: 't5', name: 'Table C01', zone: 'Outdoor', status: 'available',                                   capacity: 2 },
  { id: 't6', name: 'Table C02', zone: 'Outdoor', status: 'occupied',  bill: '$81.20', time: '48 mins', capacity: 6 },
  { id: 't7', name: 'Table D01', zone: 'Patio',   status: 'reserved',                                    capacity: 4 },
  { id: 't8', name: 'Table D02', zone: 'Patio',   status: 'available',                                   capacity: 4 },
];

const ZONES = ['All', 'Indoor', 'Outdoor', 'Patio'] as const;
type Zone = typeof ZONES[number];

export default function TablesPage() {
  const [zone, setZone]   = useState<Zone>('All');
  const [showAdd, setShowAdd]       = useState(false);
  const [editing, setEditing]       = useState<TableDef | null>(null);
  const [selected, setSelected]     = useState<TableDef | null>(null);
  const [markReservedTable, setMarkReservedTable] = useState<TableDef | null>(null);
  const [reservedTable, setReservedTable]         = useState<TableDef | null>(null);
  const [seatGuests, setSeatGuests] = useState(false);
  const [showCategory, setShowCategory] = useState(false);

  const filtered = zone === 'All' ? TABLES : TABLES.filter((t) => t.zone === zone);

  return (
    <main className="flex flex-col gap-5">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-4">
          {/* Title + subtitle */}
          <div className="flex flex-col gap-0.5">
            <h1 className="text-[22px] font-medium leading-[30px] text-[#2D2F33] sm:text-[26px] sm:leading-[36px] xl:text-[30px] xl:leading-[40px]">
              Table Management
            </h1>
            <p className="text-[13px] text-[#989898] sm:text-[15px] xl:text-base">
              Monitor and update table status with ease
            </p>
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
                {z}
              </button>
            ))}
          </div>
        </div>

        {/* Add Category + Add Table */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowCategory(true)}
            className="inline-flex h-10 items-center gap-2 rounded-[51.28px] bg-white px-3.5 outline outline-1 outline-offset-[-1px] outline-[#686868] transition-colors hover:bg-[#F2F2F2]"
          >
            <Plus size={14} className="text-[#686868]" />
            <span className="whitespace-nowrap text-sm font-normal leading-5 text-[#686868]">Add Category</span>
          </button>
          <button
            onClick={() => { setEditing(null); setShowAdd(true); }}
            className="flex h-10 items-center gap-2 rounded-full bg-[#026F4F] px-5 text-white transition-colors hover:bg-[#015c42] sm:h-11"
          >
            <Plus size={17} strokeWidth={2} />
            <span className="font-satoshi text-[14px] font-medium sm:text-[15px]">Add Table</span>
          </button>
        </div>
      </div>

      {/* ── Table grid ── */}
      <div className="grid grid-cols-1 justify-items-center gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelected(t)}
            className="w-full cursor-pointer text-left transition-transform hover:-translate-y-0.5 focus:outline-none"
          >
            <TableCard
              name={t.name}
              zone={t.zone}
              status={t.status}
              bill={t.bill}
              time={t.time}
            />
          </button>
        ))}
      </div>

      {/* ── Modals ── */}
      <AddEditTableModal
        open={showAdd || !!editing}
        table={editing}
        onClose={() => { setShowAdd(false); setEditing(null); }}
        onMarkReserved={() => {
          setMarkReservedTable(editing);
          setEditing(null);
        }}
      />

      <MarkReservedModal
        open={!!markReservedTable}
        tableName={markReservedTable?.name ?? ''}
        onClose={() => setMarkReservedTable(null)}
        onSave={() => {
          setReservedTable(markReservedTable);
          setMarkReservedTable(null);
        }}
      />

      <ReservedDetailModal
        open={!!reservedTable}
        table={reservedTable}
        onClose={() => setReservedTable(null)}
        onSeatGuests={() => {
          setSeatGuests(true);
          setReservedTable(null);
        }}
      />

      <SeatGuestsModal
        open={seatGuests}
        onClose={() => setSeatGuests(false)}
        onSave={() => {
          setSeatGuests(false);
          window.location.reload();
        }}
      />

      <TableInfoModal
        open={!!selected}
        table={selected}
        onClose={() => setSelected(null)}
        onEdit={(t) => { setSelected(null); setEditing(t); }}
      />

      <AddTableCategoryModal open={showCategory} onClose={() => setShowCategory(false)} />
    </main>
  );
}
