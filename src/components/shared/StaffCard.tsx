'use client';

import Image from 'next/image';
import { Phone, Mail, ChevronRight, Trash2 } from 'lucide-react';

export type StaffRole = 'MANAGER' | 'WAITER' | 'KITCHEN STAFF' | 'CASHIER';

// Role badge colours from Figma
const ROLE_STYLES: Record<StaffRole, string> = {
  MANAGER:       '#E8AD0D',
  WAITER:        '#1FB711',
  'KITCHEN STAFF': '#0DADE8',
  CASHIER:       '#D60DE8',
};

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  phone: string;
  email: string;
  avatar?: string;
  active: boolean;
  notes: { text: string; date: string }[];
}

interface StaffCardProps {
  member: StaffMember;
  onEdit: () => void;
  onRemove: () => void;
}

export function StaffCard({ member, onEdit, onRemove }: StaffCardProps) {
  const roleColor = ROLE_STYLES[member.role];
  const lastNote = member.notes[member.notes.length - 1];

  return (
    <div className="relative flex w-full max-w-[418px] flex-col items-center rounded-2xl bg-white pb-4">

      {/* ── Delete btn — top-right red square ── */}
      <button
        onClick={onRemove}
        aria-label="Remove staff member"
        className="absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-md bg-[#E85E5E] text-white transition-colors hover:bg-[#d94a4a]"
      >
        <Trash2 size={15} />
      </button>

      {/* ── Avatar ── */}
      <div className="relative mt-6 h-[84px] w-[84px]">
        <Image
          src={member.avatar ?? '/images/avatar.png'}
          alt={member.name}
          fill
          className="rounded-full object-cover"
        />
        {/* Online/offline dot */}
        <span
          className={`absolute bottom-0 right-0 h-5 w-5 rounded-full border-2 border-white ${member.active ? 'bg-[#4ADE80]' : 'bg-[#D1D5DB]'}`}
        />
      </div>

      {/* ── Name ── */}
      <h3 className="mt-3 font-satoshi text-[17px] font-medium leading-[1.4] text-black">
        {member.name}
      </h3>

      {/* ── Role pill ── */}
      <span
        className="mt-1.5 inline-flex items-center rounded-[37px] px-2.5 py-1 text-[10.5px] font-medium leading-[1.4] text-white"
        style={{ backgroundColor: roleColor }}
      >
        {member.role}
      </span>

      {/* ── Divider ── */}
      <div className="mt-4 w-[calc(100%-24px)] border-t border-[#E9E9E9]" />

      {/* ── Contact info ── */}
      <div className="mt-3 flex w-[calc(100%-24px)] flex-col gap-2">
        <div className="flex items-center gap-2">
          <Phone size={13} className="shrink-0 text-[#989898]" />
          <span className="truncate text-[12px] leading-[1.4] text-[#989898]">{member.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail size={13} className="shrink-0 text-[#989898]" />
          <span className="truncate text-[12px] leading-[1.4] text-[#989898]">{member.email}</span>
        </div>
      </div>

      {/* ── Latest note pill ── */}
      {lastNote && (
        <div className="mt-3 flex w-[calc(100%-24px)] items-center justify-between rounded-2xl bg-[#F2F2F2] px-3 py-2">
          <span className="line-clamp-2 flex-1 font-satoshi text-[11.5px] font-medium leading-[1.4] text-[#989898]">
            {lastNote.text}
          </span>
          <ChevronRight size={13} className="ml-1.5 shrink-0 text-[#989898]" />
        </div>
      )}

      {/* ── Action buttons ── */}
      <div className="mt-4 flex w-[calc(100%-24px)] items-center gap-2.5">
        <button
          onClick={onEdit}
          className="flex h-9 flex-1 items-center justify-center rounded-[30px] border border-[#B9B9B9] bg-[#E9E9E9] font-satoshi text-[12.5px] font-medium text-[#2D2F33] shadow-[0px_2px_8px_rgba(0,0,0,0.08)] transition-colors hover:bg-[#DCDCDC]"
        >
          Edit
        </button>
        <button
          onClick={onRemove}
          className={`flex h-9 flex-1 items-center justify-center rounded-[30px] border border-[#B9B9B9] font-satoshi text-[12.5px] font-medium shadow-[0px_2px_8px_rgba(0,0,0,0.08)] transition-colors ${
            member.active
              ? 'bg-white text-[#2D2F33] hover:bg-[#F2F2F2]'
              : 'border-transparent bg-[#026F4F] text-white hover:bg-[#015c42]'
          }`}
        >
          {member.active ? 'Deactivate' : 'Activate'}
        </button>
      </div>
    </div>
  );
}
