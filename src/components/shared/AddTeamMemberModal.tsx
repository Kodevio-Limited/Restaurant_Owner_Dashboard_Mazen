'use client';

import { ArrowLeft, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StaffMember } from '@/components/shared/StaffCard';
import Image from 'next/image';

const PERM_DESC: Record<string, string> = {
  'Manage Menu': 'Add, edit, or remove menu items and categories',
  'Manage Orders': 'Accept, update, and complete active orders',
  'Manage Tables': 'Update table status, seat guests, and clear tables',
  'Access Reports': 'View financial and performance analytics',
  'Handle Payments': 'Process transactions, mark orders paid, and issue refunds',
  'Manage Staff': 'Add, edit, or remove staff members and permissions',
};

export function AddTeamMemberModal({
  open,
  member,
  onClose,
}: {
  open: boolean;
  member: StaffMember | null;
  onClose: () => void;
}) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-all duration-300',
        open ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          'relative mx-4 flex max-h-[90vh] w-full max-w-[619px] flex-col overflow-y-auto rounded-[24px] bg-[#F2F2F2] shadow-lg transition-all duration-300',
          open ? 'translate-y-0 scale-100' : 'translate-y-8 scale-95',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between px-5 pt-6">
          <button onClick={onClose} aria-label="Back" className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E9E9E9] text-black transition-colors hover:bg-[#DcDcDc]">
            <ArrowLeft size={22} />
          </button>
          <h2 className="text-[32px] font-medium leading-10 text-black">Add team Member</h2>
          <button onClick={onClose} aria-label="Close" className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E85E5E] text-white transition-colors hover:bg-[#d94a4a]">
            <X size={22} />
          </button>
        </div>

        {/* Avatar */}
        <div className="relative flex justify-center px-5 pt-8">
          <div className="relative h-[127px] w-[127px]">
            <Image src="/images/avatar.png" alt="" fill className="rounded-full object-cover" />
          </div>
          <div className="absolute right-[140px] top-[170px] z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#026F4F] border-2 border-white">
            <span className="flex h-4 w-4 items-center justify-center">
              <span className="h-3 w-3 rounded-full border border-white" />
              <span className="absolute ml-2.5 mt-[-1px] h-2.5 w-2.5 border-b border-white" />
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-5 px-5 pb-5 pt-5">
          {/* About */}
          <div className="relative h-96 w-full overflow-hidden rounded-xl bg-white outline outline-1 outline-offset-[-1px] outline-[#E9E9E9]">
            <div className="absolute left-[19px] top-[21px]">
              <span className="text-lg font-medium leading-7 text-[#2D2F33]">About</span>
            </div>
            <div className="absolute left-[19px] top-[68px] flex w-[522px] flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-base font-medium leading-5 text-[#686868]">Full Name</span>
                <div className="flex h-14 items-center gap-2 rounded-[87px] bg-[#F2F2F2] px-4">
                  <div className="flex h-7 w-7 flex-col items-center gap-1">
                    <div className="relative h-7 w-7">
                      <div className="absolute left-[4.83px] top-[16.92px] h-2 w-5 outline outline-2 outline-offset-[-1px] outline-[#989898]" />
                      <div className="absolute left-[10.88px] top-[4.83px] h-2 w-2 outline outline-2 outline-offset-[-1px] outline-[#989898]" />
                    </div>
                  </div>
                  <span className="font-satoshi w-80 text-base font-medium leading-6 text-[#989898]">Enter your Name...</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-base font-normal leading-6 text-[#686868]">Phone Number</span>
                <div className="flex h-14 items-center gap-2 rounded-[87px] bg-[#F2F2F2] px-4">
                  <div className="relative h-6 w-6">
                    <div className="absolute left-[4px] top-[2px] h-4 w-4 outline outline-[1.5px] outline-offset-[-0.75px] outline-[#989898]" />
                    <div className="absolute left-[4px] top-[5.75px] h-3.5 w-3.5 opacity-50 outline outline-[1.5px] outline-offset-[-0.75px] outline-[#989898]" />
                    <div className="absolute left-[10px] top-[7.48px] h-1.5 w-1.5 opacity-50 outline outline-[1.5px] outline-offset-[-0.75px] outline-[#989898]" />
                  </div>
                  <span className="font-satoshi text-base font-medium leading-6 text-[#989898]">Enter your number</span>
                </div>
              </div>
              <div className="flex h-20 flex-col gap-2">
                <span className="text-base font-medium leading-5 text-[#686868]">Role Assignment</span>
                <div className="relative h-14 w-full rounded-[87px] bg-[#F2F2F2]">
                  <div className="absolute left-[16px] top-[15px] flex items-center gap-3">
                    <span className="font-satoshi text-base font-medium leading-6 text-[#989898]">Manager</span>
                  </div>
                  <div className="absolute left-[498px] top-[21px] h-6 w-0 origin-top-left rotate-90">
                    <div className="absolute left-[18.48px] top-[9.59px] h-2 w-3 origin-top-left -rotate-180 bg-[#989898]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Login Credentials */}
          <div className="relative h-96 w-full overflow-hidden rounded-xl bg-white outline outline-1 outline-offset-[-1px] outline-[#E9E9E9]">
            <div className="absolute left-[19px] top-[21px]">
              <span className="text-lg font-medium leading-7 text-[#2D2F33]">Login Credentials</span>
            </div>
            <div className="absolute left-[19px] top-[68px] flex w-[522px] flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-base font-medium leading-5 text-[#686868]">Email</span>
                <div className="flex h-14 items-center gap-2 rounded-[87px] bg-[#F2F2F2] px-4">
                  <div className="h-6 w-6 rounded bg-[#D1D5DB]" />
                  <span className="font-satoshi text-base font-medium leading-6 text-[#989898]">john@example.com.</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-base font-normal leading-6 text-[#686868]">Set Password</span>
                <div className="flex h-14 items-center rounded-[87px] bg-[#F2F2F2] px-4">
                  <span className="font-satoshi text-base font-medium leading-6 text-[#989898]">Minimum 8 characters</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-base font-normal leading-6 text-[#686868]">Pin code</span>
                <div className="flex h-14 items-center rounded-[87px] bg-[#F2F2F2] px-4">
                  <span className="font-satoshi text-base font-medium leading-6 text-[#989898]">Minimum 8 characters</span>
                </div>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="relative h-96 w-full overflow-hidden rounded-xl bg-white outline outline-1 outline-offset-[-1px] outline-[#E9E9E9]">
            <div className="absolute left-[19px] top-[18px] flex w-72 flex-col gap-1.5">
              <div className="flex items-center gap-[5px]">
                <div className="relative h-7 w-7">
                  <div className="absolute left-[3.77px] top-[3.75px] h-6 w-6 outline outline-1 outline-offset-[-0.5px] outline-black" />
                </div>
                <span className="text-lg font-medium leading-7 text-[#2D2F33]">Permission</span>
              </div>
              <span className="text-xs font-normal leading-5 text-[#989898]">Control what this team member can access.</span>
            </div>

            <div className="absolute left-[19px] top-[95px] flex w-[522px] flex-col gap-5">
              {[
                ['Manage Menu', 'Manage Orders'],
                ['Manage Tables', 'Access Reports'],
                ['Handle Payments', 'Manage Staff'],
              ].map((row, ri) => (
                <div key={ri} className="flex items-center gap-5">
                  {[
                    { label: row[0], desc: PERM_DESC[row[0]] },
                    { label: row[1], desc: PERM_DESC[row[1]] },
                  ].map((perm) => (
                    <div key={perm.label} className="relative h-24 w-64 overflow-hidden rounded-[10px] bg-[#E9E9E9] outline outline-2 outline-offset-[-2px] outline-[#026F4F]">
                      <div className="absolute left-[11px] top-[12px] flex items-center gap-[5px]">
                        <div className="relative h-5 w-5">
                          <div className="absolute left-[2.38px] top-[2.38px] h-3.5 w-3.5 bg-[#026F4F]" />
                        </div>
                        <span className="text-base font-normal leading-6 text-[#026F4F]">{perm.label}</span>
                      </div>
                      <div className="absolute left-[35px] top-[44px] w-52 text-xs font-normal leading-5 text-[#989898]">{perm.desc}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="relative h-96 w-full overflow-hidden rounded-xl bg-white outline outline-1 outline-offset-[-1px] outline-[#E9E9E9]">
            <div className="absolute left-[19px] top-[18px] flex w-[522px] flex-col gap-2">
              <span className="text-base font-medium leading-5 text-[#686868]">Add New Notes</span>
              <div className="flex h-24 w-full items-start gap-2 rounded-[20px] bg-[#F2F2F2] p-4">
                <span className="font-satoshi w-80 text-base font-medium leading-6 text-[#989898]">Enter your notes</span>
              </div>
            </div>
            <div className="absolute left-[19px] top-[165px] flex w-[522px] flex-col gap-1.5">
              <span className="text-base font-medium leading-5 text-[#686868]">Previous Notes (2)</span>
              {[0, 1].map((i) => (
                <div key={i} className="relative h-28 w-[522px] rounded-[20px] bg-[#F2F2F2]">
                  <div className="absolute left-[15px] top-[13px] text-base font-medium leading-5 text-black">Added by: Jane Smith (Admin)</div>
                  <div className="absolute left-[15px] top-[43px] flex w-[491px] items-end justify-between">
                    <div className="flex w-96 flex-col gap-1">
                      <span className="font-satoshi text-base font-medium leading-6 text-[#989898]">he broke 3 glasses or argued with the customer or whatever</span>
                      <span className="text-xs font-normal leading-5 text-[#686868]">06-12-2026</span>
                    </div>
                    <div className="relative h-5 w-5">
                      <div className="absolute left-[2.41px] top-[2.57px] h-4 w-4 outline outline-[1.31px] outline-offset-[-0.66px] outline-red-600" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-[#E2E2E2] px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <button className="flex h-14 flex-1 items-center justify-center rounded-[30px] bg-[#E9E9E9] text-lg font-medium text-[#2D2F33] shadow-[0px_4px_16.3px_rgba(0,0,0,0.12)] outline outline-1 outline-offset-[-1px] outline-[#B9B9B9] transition-colors hover:bg-[#DcDcDc]">
              Cancel
            </button>
            <button className="flex h-14 flex-1 items-center justify-center rounded-[30px] bg-[#026F4F] text-lg font-medium text-white shadow-[0px_4px_16.3px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#015c42]">
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}