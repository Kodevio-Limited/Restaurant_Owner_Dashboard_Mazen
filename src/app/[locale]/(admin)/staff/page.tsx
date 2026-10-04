'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Plus } from 'lucide-react';
import { StaffCard, StaffMember } from '@/components/shared/StaffCard';
import { AddTeamMemberModal } from '@/components/shared/AddTeamMemberModal';
import { RemoveStaffModal } from '@/components/shared/RemoveStaffModal';
import { cn } from '@/lib/utils';
import { useQueryModal, readQueryParam, writeQueryParam } from '@/lib/use-query-modal';

const STAFF: StaffMember[] = [
  {
    id: 's1',
    name: 'Alice Johnson',
    name_ar: 'أليس جونسون',
    role: 'MANAGER',
    role_ar: 'مدير',
    phone: '+01284980',
    email: 'mike.t@example.com',
    active: true,
    notes: [{ text: 'he broke 3 glasses or argued with the customer or whatever', text_ar: 'كسر 3 كؤوس أو تجادل مع العميل', date: '06-12-2026' }],
  },
  {
    id: 's2',
    name: 'Alice Johnson',
    name_ar: 'أليس جونسون',
    role: 'WAITER',
    role_ar: 'نادل',
    phone: '+01284980',
    email: 'mike.t@example.com',
    active: true,
    notes: [{ text: 'he broke 3 glasses or argued with the customer or whatever', text_ar: 'كسر 3 كؤوس أو تجادل مع العميل', date: '06-12-2026' }],
  },
  {
    id: 's3',
    name: 'Alice Johnson',
    name_ar: 'أليس جونسون',
    role: 'KITCHEN STAFF',
    role_ar: 'طاقم المطبخ',
    phone: '+01284980',
    email: 'mike.t@example.com',
    active: true,
    notes: [{ text: 'he broke 3 glasses or argued with the customer or whatever', text_ar: 'كسر 3 كؤوس أو تجادل مع العميل', date: '06-12-2026' }],
  },
  {
    id: 's4',
    name: 'Alice Johnson',
    name_ar: 'أليس جونسون',
    role: 'CASHIER',
    role_ar: 'كاشير',
    phone: '+01284980',
    email: 'mike.t@example.com',
    active: false,
    notes: [{ text: 'he broke 3 glasses or argued with the customer or whatever', text_ar: 'كسر 3 كؤوس أو تجادل مع العميل', date: '06-12-2026' }],
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
  const t = useTranslations('staff');
  const locale = useLocale();
  const isAr = locale === 'ar';

  const [filter, setFilter]   = useState('All');
  // Query-driven modals: ?modal=staff-member[&id=s1] (add/edit), ?modal=remove-staff&id=s1
  const [staffOpen, setStaffOpen] = useQueryModal('staff-member');
  const [editing, setEditing] = useState<StaffMember | null>(null);
  const [removeOpen, setRemoveOpen] = useQueryModal('remove-staff');
  const [removing, setRemoving] = useState<StaffMember | null>(null);
  const [staff, setStaff] = useState<StaffMember[]>(STAFF);

  const openStaff = (m: StaffMember | null) => {
    setEditing(m);
    writeQueryParam('id', m?.id ?? null, false);
    setStaffOpen(true);
  };
  const closeStaff = () => {
    setEditing(null);
    setStaffOpen(false);
    writeQueryParam('id', null, false);
  };
  const openRemove = (m: StaffMember) => {
    setRemoving(m);
    writeQueryParam('id', m.id, false);
    setRemoveOpen(true);
  };
  const closeRemove = () => {
    setRemoving(null);
    setRemoveOpen(false);
    writeQueryParam('id', null, false);
  };

  // Cold load: restore edit/remove targets from ?modal=&id=
  useEffect(() => {
    const modal = readQueryParam('modal');
    const id = readQueryParam('id');
    if (!id) return;
    const found = STAFF.find((s) => s.id === id);
    if (!found) return;
    if (modal === 'staff-member') setEditing(found);
    else if (modal === 'remove-staff') setRemoving(found);
  }, []);

  const filtered = filter === 'All'
    ? staff
    : staff.filter((s) => s.role === filter);

  const toggleActive = (id: string) => {
    setStaff((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  return (
    <main className="flex flex-col gap-5">

      {/* ── Header row ── */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-[22px] font-medium leading-[30px] text-[#2D2F33] sm:text-[26px] sm:leading-[36px] xl:text-[30px] xl:leading-[40px]">
            {t('title')}
          </h1>
          <p className="text-[13px] text-[#989898] sm:text-[15px] xl:text-base">{t('subtitle')}</p>
        </div>

        <button
          onClick={() => openStaff(null)}
          className="flex h-10 items-center gap-2 rounded-full bg-[#026F4F] px-5 text-white transition-colors hover:bg-[#015c42] sm:h-11"
        >
          <Plus size={17} strokeWidth={2} />
          <span className="font-satoshi text-[14px] font-medium sm:text-[15px]">{t('addStaff')}</span>
        </button>
      </div>

      {/* ── Filter pills ── */}
      <div className="flex flex-wrap items-center gap-2.5">
        {(['All','Manager','Waiter','Kitchen Staff','Cashier'] as const).map((val) => {
          const label = val === 'All' ? t('filters.all')
            : val === 'Manager' ? t('filters.manager')
            : val === 'Waiter' ? t('filters.waiter')
            : val === 'Kitchen Staff' ? t('filters.kitchenStaff')
            : t('filters.cashier');
          return (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={cn(
                'inline-flex h-10 items-center justify-center rounded-full px-4 text-[13px] leading-[1.4] transition-colors sm:text-sm',
                filter === val
                  ? 'bg-[#026F4F] text-white'
                  : 'bg-white text-[#686868] hover:bg-[#F2F2F2]',
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* ── Staff grid ── */}
      <div className="grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((member) => (
          <StaffCard
            key={member.id}
            member={member}
            onEdit={() => openStaff(member)}
            onRemove={() => openRemove(member)}
            onToggleActive={() => toggleActive(member.id)}
          />
        ))}
      </div>

      {/* ── Modals ── */}
      <AddTeamMemberModal
        open={staffOpen}
        member={editing}
        onClose={closeStaff}
      />

      <RemoveStaffModal
        open={removeOpen}
        memberName={isAr ? (removing?.name_ar ?? removing?.name ?? '') : (removing?.name ?? '')}
        onCancel={closeRemove}
        onConfirm={closeRemove}
      />
    </main>
  );
}
