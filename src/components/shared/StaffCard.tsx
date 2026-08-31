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
    <div className="relative flex w-full max-w-[418px] flex-col items-center rounded-[19.5px] bg-white pb-7">

      {/* ── Delete btn — top-right red square ── */}
      <button
        onClick={onRemove}
        aria-label="Remove staff member"
        className="absolute right-[27px] top-[27px] flex h-[46.7px] w-[46.7px] items-center justify-center rounded-[7px] bg-[#E85E5E] text-white transition-colors hover:bg-[#d94a4a]"
      >
        <Trash2 size={22} />
      </button>

      {/* ── Avatar ── */}
      <div className="relative mt-10 h-[127px] w-[127px]">
        <Image
          src={member.avatar ?? '/images/avatar.png'}
          alt={member.name}
          fill
          className="rounded-full object-cover"
        />
        {/* Online/offline dot */}
        <span
          className={`absolute bottom-0 right-0 h-[30px] w-[30px] rounded-full border-[3px] border-white ${member.active ? 'bg-[#4ADE80]' : 'bg-[#D1D5DB]'}`}
        />
      </div>

      {/* ── Name ── */}
      <h3 className="mt-5 font-satoshi text-[28px] font-medium leading-[1.4] text-black">
        {member.name}
      </h3>

      {/* ── Role pill ── */}
      <span
        className="mt-2 inline-flex items-center rounded-[37px] px-3 py-1.5 text-[13px] font-medium leading-[1.4] text-white"
        style={{ backgroundColor: roleColor }}
      >
        {member.role}
      </span>

      {/* ── Divider ── */}
      <div className="mt-6 w-[calc(100%-26px)] border-t border-[#B9B9B9]" />

      {/* ── Contact info ── */}
      <div className="mt-5 flex flex-col gap-4 self-start pl-9">
        <div className="flex items-center gap-3">
          <Phone size={22} className="shrink-0 text-[#989898]" />
          <span className="text-[17px] leading-[1.4] text-[#989898]">{member.phone}</span>
        </div>
        <div className="flex items-center gap-3">
          <Mail size={22} className="shrink-0 text-[#989898]" />
          <span className="text-[17px] leading-[1.4] text-[#989898]">{member.email}</span>
        </div>
      </div>

      {/* ── Latest note pill ── */}
      {lastNote && (
        <div className="mt-4 flex w-[calc(100%-40px)] items-center justify-between rounded-[20px] bg-[#F2F2F2] px-[18px] py-[9px]">
          <span className="line-clamp-2 flex-1 font-satoshi text-[16px] font-medium leading-[1.4] text-[#989898]">
            {lastNote.text}
          </span>
          <ChevronRight size={18} className="ml-2 shrink-0 text-[#989898]" />
        </div>
      )}

      {/* ── Action buttons ── */}
      <div className="mt-6 flex items-center gap-6">
        <button
          onClick={onEdit}
          className="flex h-[59px] w-40 items-center justify-center rounded-[30px] border border-[#B9B9B9] bg-[#E9E9E9] font-satoshi text-[19px] font-medium text-[#2D2F33] shadow-[0px_4px_16px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#DCDCDC]"
        >
          Edit
        </button>
        <button
          onClick={onRemove}
          className={`flex h-[59px] w-40 items-center justify-center rounded-[30px] border border-[#B9B9B9] font-satoshi text-[19px] font-medium shadow-[0px_4px_16px_rgba(0,0,0,0.12)] transition-colors ${
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
