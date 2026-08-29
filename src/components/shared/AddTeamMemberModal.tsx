'use client';

import { ArrowLeft, Shield, User, Phone, Mail, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StaffMember } from '@/components/shared/StaffCard';
import Image from 'next/image';

// ─── Permission data ──────────────────────────────────────────────────────────

const PERMISSIONS = [
  { label: 'Manage Menu',     desc: 'Add, edit, or remove menu items and categories'               },
  { label: 'Manage Orders',   desc: 'Accept, update, and complete active orders'                   },
  { label: 'Manage Tables',   desc: 'Update table status, seat guests, and clear tables'           },
  { label: 'Access Reports',  desc: 'View financial and performance analytics'                     },
  { label: 'Handle Payments', desc: 'Process transactions, mark orders paid, and issue refunds'   },
  { label: 'Manage Staff',    desc: 'Add, edit, or remove staff members and permissions'           },
];

// ─── Reusable input row ───────────────────────────────────────────────────────

function FieldRow({
  label,
  placeholder,
  icon,
}: {
  label: string;
  placeholder: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[15px] font-medium leading-5 text-[#686868]">{label}</span>
      <div className="flex h-14 items-center gap-2 rounded-[87px] bg-[#F2F2F2] px-4">
        {icon && <div className="shrink-0">{icon}</div>}
        <span className="font-satoshi text-base font-medium leading-6 text-[#989898]">
          {placeholder}
        </span>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full rounded-xl bg-white px-5 pt-5 pb-6">
      <h3 className="mb-5 text-[18px] font-medium leading-7 text-[#2D2F33]">{title}</h3>
      {children}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export function AddTeamMemberModal({
  open,
  member,
  onClose,
}: {
  open: boolean;
  member: StaffMember | null;
  onClose: () => void;
}) {
  const isEdit = !!member;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40 transition-opacity duration-300',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />

      {/* Drawer — slides in from the right */}
      <div
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-[619px] flex-col rounded-tl-3xl rounded-bl-3xl bg-[#F2F2F2] shadow-[-2px_0px_12px_rgba(0,0,0,0.10)] transition-transform duration-300',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* ── Fixed header ── */}
        <div className="flex shrink-0 items-center gap-4 px-[30px] pt-[50px] pb-6">
          <button
            onClick={onClose}
            aria-label="Back"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E9E9E9] transition-colors hover:bg-[#DCDCDC]"
          >
            <ArrowLeft size={22} className="text-black" />
          </button>
          <h2 className="flex-1 text-center font-['Inter'] text-[30px] font-medium leading-10 text-black">
            {isEdit ? 'Edit Team Member' : 'Add team Member'}
          </h2>
          {/* spacer to keep title centred */}
          <div className="h-12 w-12 shrink-0" />
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-[30px] pb-4">

          {/* Avatar */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="relative h-[127px] w-[127px]">
                <Image
                  src={member?.avatar ?? '/images/avatar.png'}
                  alt="Avatar"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              {/* Edit dot — green circle bottom-right */}
              <div className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#026F4F]">
                <div className="relative h-4 w-4">
                  {/* pencil-like edit icon using CSS */}
                  <div className="absolute inset-[2px] rounded-sm border-[1.44px] border-white" />
                  <div className="absolute left-[5.55px] top-[1.39px] h-2.5 w-2.5 border-[1.44px] border-b-0 border-white" />
                </div>
              </div>
            </div>
          </div>

          {/* ── About ── */}
          <SectionCard title="About">
            <div className="flex flex-col gap-4">
              <FieldRow
                label="Full Name"
                placeholder="Enter your Name..."
                icon={<User size={20} className="text-[#989898]" />}
              />
              <FieldRow
                label="Phone Number"
                placeholder="Enter your number"
                icon={<Phone size={20} className="text-[#989898]" />}
              />
              {/* Role Assignment */}
              <div className="flex flex-col gap-2">
                <span className="text-[15px] font-medium leading-5 text-[#686868]">Role Assignment</span>
                <div className="flex h-14 items-center justify-between rounded-[87px] bg-[#F2F2F2] px-4">
                  <span className="font-satoshi text-base font-medium leading-6 text-[#989898]">
                    {member?.role ?? 'Manager'}
                  </span>
                  <ChevronRight size={16} className="rotate-90 text-[#989898]" />
                </div>
              </div>
            </div>
          </SectionCard>

          {/* ── Login Credentials ── */}
          <div className="mt-5">
            <SectionCard title="Login Credentials">
              <div className="flex flex-col gap-4">
                <FieldRow
                  label="Email"
                  placeholder="john@example.com"
                  icon={<Mail size={20} className="text-[#989898]" />}
                />
                <FieldRow
                  label="Set Password"
                  placeholder="Minimum 8 characters"
                />
              </div>
            </SectionCard>
          </div>

          {/* ── Permissions ── */}
          <div className="mt-5">
            <SectionCard title="">
              {/* Permission header */}
              <div className="mb-4 flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <Shield size={22} className="text-[#2D2F33]" strokeWidth={1.5} />
                  <span className="text-[18px] font-medium leading-7 text-[#2D2F33]">Permission</span>
                </div>
                <p className="text-xs font-normal leading-5 text-[#989898]">
                  Control what this team member can access.
                </p>
              </div>

              {/* Permission grid — 2 columns, 3 rows */}
              <div className="flex flex-col gap-5">
                {[0, 2, 4].map((startIdx) => (
                  <div key={startIdx} className="flex items-center justify-between gap-5">
                    {PERMISSIONS.slice(startIdx, startIdx + 2).map((perm) => (
                      <div
                        key={perm.label}
                        className="relative h-24 w-[calc(50%-10px)] overflow-hidden rounded-[10px] bg-[#E9E9E9] outline outline-2 outline-offset-[-2px] outline-[#026F4F]"
                      >
                        <div className="absolute left-[11px] top-[12px] flex items-center gap-[5px]">
                          {/* Checkbox-style filled square */}
                          <div className="flex h-5 w-5 items-center justify-center">
                            <div className="h-3.5 w-3.5 bg-[#026F4F]" />
                          </div>
                          <span className="text-[15px] font-normal leading-6 text-[#026F4F]">
                            {perm.label}
                          </span>
                        </div>
                        <p className="absolute left-[35px] top-[44px] w-[calc(100%-44px)] text-xs font-normal leading-5 text-[#989898]">
                          {perm.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* ── Notes ── */}
          <div className="mt-5 w-full rounded-xl bg-white outline outline-1 outline-offset-[-1px] outline-[#E9E9E9]">

            {/* Add New Notes */}
            <div className="px-[19px] pt-[18px]">
              <div className="flex flex-col gap-2">
                <span className="text-base font-medium leading-5 text-[#686868]">Add New Notes</span>
                <div className="flex h-24 w-full items-start gap-2 rounded-[20px] bg-[#F2F2F2] p-4">
                  <span className="font-satoshi text-base font-medium leading-6 text-[#989898]">
                    Enter your notes
                  </span>
                </div>
              </div>
            </div>

            {/* Previous Notes */}
            <div className="px-[19px] pt-4 pb-[19px]">
              <div className="flex flex-col gap-1.5">
                <span className="text-base font-medium leading-5 text-[#686868]">
                  Previous Notes ({(member?.notes ?? []).length || 2})
                </span>

                {(
                  member?.notes?.length
                    ? member.notes
                    : [
                        { text: 'he broke 3 glasses or argued with the customer or whatever', date: '06-12-2026' },
                        { text: 'he broke 3 glasses or argued with the customer or whatever', date: '06-12-2026' },
                      ]
                ).map((note, i) => (
                  <div key={i} className="w-full rounded-[20px] bg-[#F2F2F2] px-[15px] py-[13px]">
                    {/* "Added by" row with delete icon */}
                    <div className="flex items-center justify-between">
                      <span className="text-base font-medium leading-5 text-black">
                        Added by: Jane Smith (Admin)
                      </span>
                      {/* Red outlined square delete icon — matches Figma exactly */}
                      <button className="relative h-5 w-5 shrink-0 overflow-hidden" aria-label="Delete note">
                        <div className="absolute left-[2.41px] top-[2.57px] h-4 w-4 outline outline-[1.31px] outline-offset-[-0.66px] outline-red-600" />
                      </button>
                    </div>
                    {/* Note text + date */}
                    <div className="mt-[10px] flex flex-col gap-1">
                      <span className="font-satoshi text-base font-medium leading-6 text-[#989898]">
                        {note.text}
                      </span>
                      <span className="text-xs font-normal leading-5 text-[#686868]">
                        {note.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Fixed footer ── */}
        <div className="shrink-0 px-[30px] py-5">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={onClose}
              className="flex h-14 w-[272px] items-center justify-center rounded-[30px] bg-[#E9E9E9] font-satoshi text-[18px] font-medium text-[#2D2F33] shadow-[0px_4px_16px_rgba(0,0,0,0.12)] outline outline-1 outline-[#B9B9B9] transition-colors hover:bg-[#DCDCDC]"
            >
              Cancel
            </button>
            <button
              className="flex h-14 w-[272px] items-center justify-center rounded-[30px] bg-[#026F4F] font-satoshi text-[18px] font-medium text-white shadow-[0px_4px_16px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#015c42]"
            >
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
