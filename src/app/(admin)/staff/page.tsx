'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { StaffCard, StaffMember, StaffRole } from '@/components/shared/StaffCard';
import { AddTeamMemberModal } from '@/components/shared/AddTeamMemberModal';
import { RemoveStaffModal } from '@/components/shared/RemoveStaffModal';
import { cn } from '@/lib/utils';

const STAFF: StaffMember[] = [
  { id: 's1', name: 'Alice Johnson', role: 'MANAGER', phone: '+01284980', email: 'mike.t@example.com', active: true, notes: [{ text: 'he broke 3 glasses or argued with the customer or whatever', date: '06-12-2026' }] },
  { id: 's2', name: 'Alice Johnson', role: 'WAITER', phone: '+01284980', email: 'mike.t@example.com', active: true, notes: [{ text: 'he broke 3 glasses or argued with the customer or whatever', date: '06-12-2026' }] },
  { id: 's3', name: 'Alice Johnson', role: 'KITCHEN STAFF', phone: '+01284980', email: 'mike.t@example.com', active: true, notes: [{ text: 'he broke 3 glasses or argued with the customer or whatever', date: '06-12-2026' }] },
  { id: 's4', name: 'Alice Johnson', role: 'CASHIER', phone: '+01284980', email: 'mike.t@example.com', active: false, notes: [{ text: 'he broke 3 glasses or argued with the customer or whatever', date: '06-12-2026' }] },
];

const FILTERS = ['All', 'Manager', 'Waiter', 'Kitchen Staff', 'Cashier'];

export default function StaffPage() {
  const [filter, setFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<StaffMember | null>(null);
  const [removing, setRemoving] = useState<StaffMember | null>(null);

  const filtered = STAFF.filter((s) => filter === 'All' || s.role === filter.toUpperCase().replace(' ', ' '));

  return (
    <main className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex max-w-[608px] flex-col gap-1">
          <h1 className="text-[26px] font-medium leading-[36px] text-[#2D2F33] sm:text-[32px] sm:leading-[46px] xl:text-[40px] xl:leading-[56px]">
            Staff Management
          </h1>
          <p className="text-[15px] text-[#989898] sm:text-[19px] xl:text-[24px] xl:leading-8">
            Manage your team, roles, and access in one place
          </p>
        </div>

        <button
          onClick={() => { setEditing(null); setShowAdd(true); }}
          className="flex h-14 items-center gap-3 rounded-[128px] bg-[#026F4F] px-8 text-white transition-colors hover:bg-[#015c42]"
        >
          <Plus size={28} className="text-white" />
          <span className="whitespace-nowrap font-satoshi text-2xl font-medium leading-8">Add Staff</span>
        </button>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap items-center gap-5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'inline-flex h-12 items-center justify-center rounded-[51.28px] px-3.5 py-2 text-xl font-normal leading-7 transition-colors',
              filter === f ? 'bg-[#026F4F] text-white' : 'bg-white text-[#686868] hover:bg-[#F2F2F2]',
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Staff grid */}
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