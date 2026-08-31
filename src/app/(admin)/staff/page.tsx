'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { StaffCard, StaffMember } from '@/components/shared/StaffCard';
import { AddTeamMemberModal } from '@/components/shared/AddTeamMemberModal';
import { RemoveStaffModal } from '@/components/shared/RemoveStaffModal';
import { cn } from '@/lib/utils';

const STAFF: StaffMember[] = [
  {
    id: 's1',
    name: 'Alice Johnson',
    role: 'MANAGER',
    phone: '+01284980',
    email: 'mike.t@example.com',
    active: true,
    notes: [{ text: 'he broke 3 glasses or argued with the customer or whatever', date: '06-12-2026' }],
  },
  {
    id: 's2',
    name: 'Alice Johnson',
    role: 'WAITER',
    phone: '+01284980',
    email: 'mike.t@example.com',
    active: true,
    notes: [{ text: 'he broke 3 glasses or argued with the customer or whatever', date: '06-12-2026' }],
  },
  {
    id: 's3',
    name: 'Alice Johnson',
    role: 'KITCHEN STAFF',
    phone: '+01284980',
    email: 'mike.t@example.com',
    active: true,
    notes: [{ text: 'he broke 3 glasses or argued with the customer or whatever', date: '06-12-2026' }],
  },
  {
    id: 's4',
    name: 'Alice Johnson',
    role: 'CASHIER',
    phone: '+01284980',
    email: 'mike.t@example.com',
    active: false,
    notes: [{ text: 'he broke 3 glasses or argued with the customer or whatever', date: '06-12-2026' }],
  },
];

const FILTERS = [
  { label: 'All',          value: 'All' },
  { label: 'Manager',      value: 'MANAGER' },
  { label: 'Waiter',       value: 'WAITER' },
  { label: 'Kitchen Staff',value: 'KITCHEN STAFF' },
  { label: 'Cashier',      value: 'CASHIER' },
];

export default function StaffPage() {
  const [filter, setFilter]   = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<StaffMember | null>(null);
  const [removing, setRemoving] = useState<StaffMember | null>(null);

  const filtered = filter === 'All'
    ? STAFF
    : STAFF.filter((s) => s.role === filter);

  return (
    <main className="flex flex-col gap-8">

      {/* ── Header row ── */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-[5px]">
          <h1 className="text-[26px] font-medium leading-[36px] text-[#2D2F33] sm:text-[32px] sm:leading-[46px] xl:text-[40px] xl:leading-[56px]">
            Staff Management
          </h1>
          <p className="text-[15px] text-[#989898] sm:text-[19px] xl:text-[23px]">
            Manage your team, roles, and access in one place
          </p>
        </div>

        <button
          onClick={() => { setEditing(null); setShowAdd(true); }}
          className="flex h-[48px] items-center gap-3 rounded-full bg-[#026F4F] px-6 text-white transition-colors hover:bg-[#015c42] sm:h-[59px] sm:px-8"
        >
          <Plus size={26} strokeWidth={2} />
          <span className="font-satoshi text-[18px] font-medium sm:text-[23px]">Add Staff</span>
        </button>
      </div>

      {/* ── Filter pills ── */}
      <div className="flex flex-wrap items-center gap-5">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              'inline-flex h-[52px] items-center justify-center rounded-full px-[14px] text-[20.5px] leading-[1.4] transition-colors',
              filter === f.value
                ? 'bg-[#026F4F] text-white'
                : 'bg-white text-[#686868] hover:bg-[#F2F2F2]',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Staff grid ── */}
      <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {filtered.map((member) => (
          <StaffCard
            key={member.id}
            member={member}
            onEdit={() => { setEditing(member); setShowAdd(true); }}
            onRemove={() => setRemoving(member)}
          />
        ))}
      </div>

      {/* ── Modals ── */}
      <AddTeamMemberModal
        open={showAdd}
        member={editing}
        onClose={() => { setShowAdd(false); setEditing(null); }}
      />

      <RemoveStaffModal
        open={!!removing}
        memberName={removing?.name ?? ''}
        onCancel={() => setRemoving(null)}
        onConfirm={() => setRemoving(null)}
      />
    </main>
  );
}
