import Image from 'next/image';
import { Trash2, ChevronDown } from 'lucide-react';

export type StaffRole = 'MANAGER' | 'WAITER' | 'KITCHEN STAFF' | 'CASHIER';

const ROLE_STYLES: Record<StaffRole, { bg: string }> = {
  'MANAGER': { bg: '#E8AD0D' },
  'WAITER': { bg: '#1FB711' },
  'KITCHEN STAFF': { bg: '#0DADE8' },
  'CASHIER': { bg: '#9333EA' },
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

export function StaffCard({ member, onEdit, onRemove }: { member: StaffMember; onEdit: () => void; onRemove: () => void }) {
  const s = ROLE_STYLES[member.role];
  const lastNote = member.notes[member.notes.length - 1];

  return (
    <div className="relative flex w-[384px] flex-col items-center rounded-[19.5px] bg-white pb-6">
      {/* Delete button top-right */}
      <button
        onClick={onRemove}
        aria-label="Remove staff"
        className="absolute right-[27px] top-[27px] flex h-12 w-12 items-center justify-center rounded-lg bg-[#E85E5E] text-white transition-colors hover:bg-[#d94a4a]"
      >
        <Trash2 size={24} />
      </button>

      {/* Avatar */}
      <div className="relative mt-10 h-[127px] w-[127px]">
        <Image src="/images/avatar.png" alt={member.name} fill className="rounded-full object-cover" />
        <span className={`absolute bottom-0 right-0 h-7 w-7 rounded-full border-4 border-white ${member.active ? 'bg-[#4ADE80]' : 'bg-[#D1D5DB]'}`} />
      </div>

      {/* Name */}
      <h3 className="mt-5 font-satoshi text-[32px] font-medium leading-10 text-black">{member.name}</h3>

      {/* Role pill */}
      <span
        className="mt-2 inline-flex items-center rounded-[37px] px-3 py-[6px] text-xs font-medium leading-5 text-white"
        style={{ backgroundColor: s.bg }}
      >
        {member.role}
      </span>

      {/* Divider */}
      <div className="mt-6 w-[calc(100%-26px)] border-t border-[#B9B9B9]" />

      {/* Contact */}
      <div className="mt-4 flex w-52 flex-col gap-4 self-start pl-9">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#B9B9B9]" />
          <span className="text-lg font-normal leading-6 text-[#989898]">{member.phone}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#B9B9B9]" />
          <span className="text-lg font-normal leading-6 text-[#989898]">{member.email}</span>
        </div>
      </div>

      {/* Notes */}
      {lastNote && (
        <div className="relative mt-3 flex w-[calc(100%-40px)] items-center rounded-[20px] bg-[#F2F2F2] px-[18px] py-[9px]">
          <span className="font-satoshi w-[calc(100%-24px)] text-base font-medium leading-6 text-[#989898]">
            {lastNote.text}
          </span>
          <ChevronDown size={18} className="shrink-0 text-[#989898]" />
        </div>
      )}

      {/* Actions */}
      <div className="mt-7 flex items-center gap-6">
        <button
          onClick={onEdit}
          className="flex h-14 w-40 items-center justify-center rounded-[30px] bg-[#E9E9E9] text-lg font-medium text-[#2D2F33] shadow-[0px_4px_16.3px_rgba(0,0,0,0.12)] outline outline-1 outline-offset-[-1px] outline-[#B9B9B9] transition-colors hover:bg-[#DcDcDc]"
        >
          Edit
        </button>
        <button
          onClick={onRemove}
          className={`flex h-14 w-40 items-center justify-center rounded-[30px] text-lg font-medium shadow-[0px_4px_16.3px_rgba(0,0,0,0.12)] outline outline-1 outline-offset-[-1px] outline-[#B9B9B9] transition-colors ${
            member.active
              ? 'bg-white text-[#2D2F33] hover:bg-[#F2F2F2]'
              : 'bg-[#026F4F] text-white hover:bg-[#015c42]'
          }`}
        >
          {member.active ? 'Deactivate' : 'Activate'}
        </button>
      </div>
    </div>
  );
}