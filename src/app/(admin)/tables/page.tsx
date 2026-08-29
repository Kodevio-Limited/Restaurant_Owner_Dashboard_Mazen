'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { TableCard, TableStatus } from '@/components/shared/TableCard';
import { SeatGuestsModal } from '@/components/shared/SeatGuestsModal';
import { AddEditTableModal } from '@/components/shared/AddEditTableModal';
import { MarkReservedModal } from '@/components/shared/MarkReservedModal';
import { ReservedDetailModal } from '@/components/shared/ReservedDetailModal';
import { TableInfoModal } from '@/components/shared/TableInfoModal';
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

  const filtered = zone === 'All' ? TABLES : TABLES.filter((t) => t.zone === zone);

  return (
    <main className="flex flex-col gap-8">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-6">
          {/* Title + subtitle */}
          <div className="flex flex-col gap-[5px]">
            <h1 className="text-[40px] font-medium leading-[56px] text-[#2D2F33]">
              Table Management
            </h1>
            <p className="text-[23px] text-[#989898]">
              Monitor and update table status with ease
            </p>
          </div>

          {/* Zone filter pills */}
          <div className="flex flex-wrap items-center gap-5">
            {ZONES.map((z) => (
              <button
                key={z}
                onClick={() => setZone(z)}
                className={cn(
                  'inline-flex h-[52px] items-center justify-center rounded-full px-[14px] text-[20.5px] leading-[1.4] transition-colors',
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

        {/* Add Table button */}
        <button
          onClick={() => { setEditing(null); setShowAdd(true); }}
          className="flex h-[59px] items-center gap-3 rounded-full bg-[#026F4F] px-8 text-white transition-colors hover:bg-[#015c42]"
        >
          <Plus size={30} strokeWidth={2} />
          <span className="font-satoshi text-[23px] font-medium">Add Table</span>
        </button>
      </div>

      {/* ── Table grid ── */}
      {/* gap-x matches the 64px gap between cards in Figma */}
      <div className="flex flex-wrap gap-x-16 gap-y-10">
        {filtered.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelected(t)}
            className="cursor-pointer text-left transition-transform hover:-translate-y-0.5 focus:outline-none"
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
      />

      <TableInfoModal
        open={!!selected}
        table={selected}
        onClose={() => setSelected(null)}
        onEdit={(t) => { setSelected(null); setEditing(t); }}
      />
    </main>
  );
}
