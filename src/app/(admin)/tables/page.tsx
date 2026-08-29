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
  { id: 't1', name: 'Table A08', zone: 'Indoor', status: 'occupied', bill: '$65.00', time: '35 mins', capacity: 4 },
  { id: 't2', name: 'Table A09', zone: 'Indoor', status: 'available', capacity: 4 },
  { id: 't3', name: 'Table B02', zone: 'Indoor', status: 'reserved', capacity: 6 },
  { id: 't4', name: 'Table B03', zone: 'Indoor', status: 'occupied', bill: '$24.50', time: '12 mins', capacity: 4 },
  { id: 't5', name: 'Table C01', zone: 'Outdoor', status: 'available', capacity: 2 },
  { id: 't6', name: 'Table C02', zone: 'Outdoor', status: 'occupied', bill: '$81.20', time: '48 mins', capacity: 6 },
  { id: 't7', name: 'Table D01', zone: 'Patio', status: 'reserved', capacity: 4 },
  { id: 't8', name: 'Table D02', zone: 'Patio', status: 'available', capacity: 4 },
];

const ZONES = ['All', 'Indoor', 'Outdoor', 'Patio'];

export default function TablesPage() {
  const [zone, setZone] = useState<'All' | 'Indoor' | 'Outdoor' | 'Patio'>('All');
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<TableDef | null>(null);
  const [selected, setSelected] = useState<TableDef | null>(null);
  const [markReservedTable, setMarkReservedTable] = useState<TableDef | null>(null);
  const [reservedTable, setReservedTable] = useState<TableDef | null>(null);
  const [seatGuests, setSeatGuests] = useState(false);

  const filtered = TABLES.filter((t) => zone === 'All' || t.zone === zone);

  const openAdd = () => {
    setEditing(null);
    setShowAdd(true);
  };

  const openEdit = (t: TableDef) => {
    setSelected(null);
    setEditing(t);
  };

  return (
    <main className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex max-w-[774px] flex-col gap-7">
          <div className="flex flex-col gap-[5px]">
            <h1 className="text-[26px] font-medium leading-[36px] text-[#2D2F33] sm:text-[32px] sm:leading-[46px] xl:text-[40px] xl:leading-[56px]">
              Table Management
            </h1>
            <p className="text-[15px] text-[#989898] sm:text-[19px] xl:text-[23px]">
              Monitor and update table status with ease
            </p>
          </div>

          {/* Zone pills */}
          <div className="flex flex-wrap items-center gap-[21px]">
            {ZONES.map((z) => (
              <button
                key={z}
                onClick={() => setZone(z as typeof zone)}
                className={cn(
                  'inline-flex h-[52px] items-center justify-center rounded-[51.28px] px-[14px] py-[7px] text-[20.5px] leading-[29px] transition-colors',
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

        {/* Add Table */}
        <button
          onClick={openAdd}
          className="flex h-[59px] items-center gap-3 rounded-[128px] bg-[#026F4F] py-[23px] pl-[34px] pr-8 text-white transition-colors hover:bg-[#015c42]"
        >
          <Plus size={30} className="text-white" />
          <span className="whitespace-nowrap font-satoshi text-[23px] font-medium leading-[32px]">Add Table</span>
        </button>
      </div>

      {/* Table grid */}
      <div className="grid grid-cols-1 justify-items-center gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((t) => (
          <button key={t.id} onClick={() => setSelected(t)} className="cursor-pointer text-left transition-transform hover:-translate-y-0.5">
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

      {/* Add/Edit Table modal (shared) */}
      <AddEditTableModal
        open={showAdd || !!editing}
        table={editing}
        onClose={() => {
          setShowAdd(false);
          setEditing(null);
        }}
        onMarkReserved={() => {
          setMarkReservedTable(editing);
          setEditing(null);
        }}
      />

      {/* Mark Reserved modal */}
      <MarkReservedModal
        open={!!markReservedTable}
        tableName={markReservedTable?.name ?? ''}
        onClose={() => setMarkReservedTable(null)}
        onSave={() => {
          setReservedTable(markReservedTable);
          setMarkReservedTable(null);
        }}
      />

      {/* Reserved detail modal */}
      <ReservedDetailModal
        open={!!reservedTable}
        table={reservedTable}
        onClose={() => setReservedTable(null)}
        onSeatGuests={() => {
          setSeatGuests(true);
          setReservedTable(null);
        }}
      />

      {/* Seat Guests modal */}
      <SeatGuestsModal
        open={seatGuests}
        onClose={() => setSeatGuests(false)}
      />

      {/* Table detail modal */}
      <TableInfoModal
        open={!!selected}
        table={selected}
        onClose={() => setSelected(null)}
        onEdit={openEdit}
      />
    </main>
  );
}