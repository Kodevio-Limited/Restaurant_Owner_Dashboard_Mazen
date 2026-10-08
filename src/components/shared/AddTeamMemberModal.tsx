'use client';

import { useEffect } from 'react';
import { ArrowLeft, Shield, User, Phone, Mail, ChevronRight, Check, Trash2, Lock } from 'lucide-react';
import { useLocale } from 'next-intl';
import { cn, lockPageScroll } from '@/lib/utils';
import { StaffMember } from '@/components/shared/StaffCard';
import Image from 'next/image';

const PERMISSIONS = [
  { label: 'Manage Menu',     label_ar: 'إدارة القائمة',    desc: 'Add, edit, or remove menu items and categories',             desc_ar: 'إضافة وتعديل وحذف أصناف وفئات القائمة'               },
  { label: 'Manage Orders',   label_ar: 'إدارة الطلبات',    desc: 'Accept, update, and complete active orders',                 desc_ar: 'قبول وتحديث وإكمال الطلبات النشطة'                   },
  { label: 'Manage Tables',   label_ar: 'إدارة الطاولات',   desc: 'Update table status, seat guests, and clear tables',         desc_ar: 'تحديث حالة الطاولات وإجلاس الضيوف وإخلاء الطاولات'   },
  { label: 'Access Reports',  label_ar: 'الوصول للتقارير',  desc: 'View financial and performance analytics',                   desc_ar: 'عرض التحليلات المالية وتقارير الأداء'                },
  { label: 'Handle Payments', label_ar: 'معالجة المدفوعات', desc: 'Process transactions, mark orders paid, and issue refunds', desc_ar: 'معالجة المعاملات وتحديد الطلبات كمدفوعة ورد المبالغ' },
  { label: 'Manage Staff',    label_ar: 'إدارة الموظفين',   desc: 'Add, edit, or remove staff members and permissions',         desc_ar: 'إضافة وتعديل وحذف الموظفين والصلاحيات'               },
];

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
      {title && <h3 className="mb-5 text-[18px] font-medium leading-7 text-[#2D2F33]">{title}</h3>}
      {children}
    </div>
  );
}

export function AddTeamMemberModal({
  open,
  member,
  onClose,
}: {
  open: boolean;
  member: StaffMember | null;
  onClose: () => void;
}) {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const isEdit = !!member;

  useEffect(() => {
    if (!open) return;
    lockPageScroll(true);
    return () => lockPageScroll(false);
  }, [open]);

  const headerTitle = isEdit
    ? (isAr ? 'تعديل عضو الفريق' : 'Edit Team Member')
    : (isAr ? 'إضافة عضو فريق' : 'Add Team Member');

  const roleDisplay = member?.role
    ? (isAr ? (member.role_ar ?? member.role) : member.role)
    : (isAr ? 'مدير' : 'Manager');

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40 transition-opacity duration-300',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          'fixed end-0 top-0 z-50 flex h-full w-full flex-col rounded-ss-3xl rounded-es-3xl bg-[#F2F2F2] shadow-[-2px_0px_12px_rgba(0,0,0,0.10)] transition-transform duration-300 sm:w-[619px]',
          open ? 'translate-x-0' : 'ltr:translate-x-full rtl:-translate-x-full',
        )}
      >
        {/* Fixed header */}
        <div className="flex shrink-0 items-center gap-4 px-5 sm:px-[30px] pt-6 sm:pt-[50px] pb-6">
          <button
            onClick={onClose}
            aria-label={isAr ? 'رجوع' : 'Back'}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E9E9E9] transition-colors hover:bg-[#DCDCDC]"
          >
            <ArrowLeft size={22} className="text-black rtl:scale-x-[-1]" />
          </button>
          <h2 className="flex-1 text-center font-['Inter'] text-[26px] font-medium leading-10 text-black sm:text-[30px]">
            {headerTitle}
          </h2>
          <div className="h-12 w-12 shrink-0" />
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-[30px] pb-4">

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
              <div className="absolute bottom-0 end-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#026F4F]">
                <div className="relative h-4 w-4">
                  <div className="absolute inset-[2px] rounded-sm border-[1.44px] border-white" />
                  <div className="absolute start-[5.55px] top-[1.39px] h-2.5 w-2.5 border-[1.44px] border-b-0 border-white" />
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          <SectionCard title={isAr ? 'المعلومات الشخصية' : 'About'}>
            <div className="flex flex-col gap-4">
              <FieldRow
                label={isAr ? 'الاسم الكامل' : 'Full Name'}
                placeholder={isAr ? 'أدخل الاسم الكامل...' : 'Enter your Name...'}
                icon={<User size={20} className="text-[#989898]" />}
              />
              <FieldRow
                label={isAr ? 'رقم الهاتف' : 'Phone Number'}
                placeholder={isAr ? 'أدخل رقمك' : 'Enter your number'}
                icon={<Phone size={20} className="text-[#989898]" />}
              />
              <div className="flex flex-col gap-2">
                <span className="text-[15px] font-medium leading-5 text-[#686868]">
                  {isAr ? 'تعيين الدور' : 'Role Assignment'}
                </span>
                <div className="flex h-14 items-center justify-between rounded-[87px] bg-[#F2F2F2] px-4">
                  <span className="font-satoshi text-base font-medium leading-6 text-[#989898]">
                    {roleDisplay}
                  </span>
                  <ChevronRight size={16} className="rotate-90 text-[#989898]" />
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Login Credentials */}
          <div className="mt-5">
            <SectionCard title={isAr ? 'بيانات تسجيل الدخول' : 'Login Credentials'}>
              <div className="flex flex-col gap-4">
                <FieldRow
                  label={isAr ? 'البريد الإلكتروني' : 'Email'}
                  placeholder="john@example.com"
                  icon={<Mail size={20} className="text-[#989898]" />}
                />
                <FieldRow
                  label={isAr ? 'تعيين كلمة المرور' : 'Set Password'}
                  placeholder={isAr ? '8 أحرف كحد أدنى' : 'Minimum 8 characters'}
                  icon={<Lock size={20} className="text-[#989898]" />}
                />
                <FieldRow
                  label={isAr ? 'رمز PIN' : 'Pin Code'}
                  placeholder={isAr ? 'رمز مكون من 4 أرقام' : '4-digit pin'}
                  icon={<Lock size={20} className="text-[#989898]" />}
                />
              </div>
            </SectionCard>
          </div>

          {/* Permissions */}
          <div className="mt-5">
            <SectionCard title="">
              <div className="mb-4 flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <Shield size={22} className="text-[#2D2F33]" strokeWidth={1.5} />
                  <span className="text-[18px] font-medium leading-7 text-[#2D2F33]">
                    {isAr ? 'الصلاحيات' : 'Permission'}
                  </span>
                </div>
                <p className="text-xs font-normal leading-5 text-[#989898]">
                  {isAr ? 'التحكم في ما يمكن لعضو الفريق الوصول إليه.' : 'Control what this team member can access.'}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {PERMISSIONS.map((perm) => (
                  <div
                    key={perm.label}
                    className="relative h-24 overflow-hidden rounded-[10px] bg-[#E9E9E9] outline outline-2 outline-offset-[-2px] outline-[#026F4F]"
                  >
                    <div className="absolute start-[11px] top-[12px] flex items-center gap-[5px]">
                      <div className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-[#026F4F]">
                        <Check size={14} className="text-white" strokeWidth={3} />
                      </div>
                      <span className="text-[15px] font-normal leading-6 text-[#026F4F]">
                        {isAr ? perm.label_ar : perm.label}
                      </span>
                    </div>
                    <p className="absolute start-[11px] top-[44px] w-[calc(100%-22px)] text-xs font-normal leading-5 text-[#989898]">
                      {isAr ? perm.desc_ar : perm.desc}
                    </p>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Notes */}
          <div className="mt-5 w-full rounded-xl bg-white outline outline-1 outline-offset-[-1px] outline-[#E9E9E9]">
            <div className="px-[19px] pt-[18px]">
              <div className="flex flex-col gap-2">
                <span className="text-base font-medium leading-5 text-[#686868]">
                  {isAr ? 'إضافة ملاحظات جديدة' : 'Add New Notes'}
                </span>
                <div className="flex h-24 w-full items-start gap-2 rounded-[20px] bg-[#F2F2F2] p-4">
                  <span className="font-satoshi text-base font-medium leading-6 text-[#989898]">
                    {isAr ? 'أدخل ملاحظاتك' : 'Enter your notes'}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-[19px] pt-4 pb-[19px]">
              <div className="flex flex-col gap-1.5">
                <span className="text-base font-medium leading-5 text-[#686868]">
                  {isAr
                    ? `الملاحظات السابقة (${(member?.notes ?? []).length || 2})`
                    : `Previous Notes (${(member?.notes ?? []).length || 2})`}
                </span>

                {(
                  member?.notes?.length
                    ? member.notes
                    : [
                        { text: 'he broke 3 glasses or argued with the customer or whatever', text_ar: 'كسر 3 كؤوس أو تجادل مع العميل', date: '06-12-2026' },
                        { text: 'he broke 3 glasses or argued with the customer or whatever', text_ar: 'كسر 3 كؤوس أو تجادل مع العميل', date: '06-12-2026' },
                      ]
                ).map((note, i) => (
                  <div key={i} className="w-full rounded-[20px] bg-[#F2F2F2] px-[15px] py-[13px]">
                    <span className="block text-base font-medium leading-5 text-black">
                      {isAr ? 'أضيفت بواسطة: جين سميث (المشرف)' : 'Added by: Jane Smith (Admin)'}
                    </span>
                    <div className="mt-[10px] flex flex-col gap-1">
                      <span className="font-satoshi text-base font-medium leading-6 text-[#989898]">
                        {isAr ? (note.text_ar ?? note.text) : note.text}
                      </span>
                      <span className="text-xs font-normal leading-5 text-[#686868]">
                        {note.date}
                      </span>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button
                        className="flex h-5 w-5 shrink-0 items-center justify-center"
                        aria-label={isAr ? 'حذف الملاحظة' : 'Delete note'}
                      >
                        <Trash2 size={18} className="text-[#E85E5E]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Fixed footer */}
        <div className="shrink-0 px-5 sm:px-[30px] py-5">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="flex h-14 flex-1 items-center justify-center rounded-[30px] bg-[#E9E9E9] font-satoshi text-[18px] font-medium text-[#2D2F33] shadow-[0px_4px_16px_rgba(0,0,0,0.12)] outline outline-1 outline-[#B9B9B9] transition-colors hover:bg-[#DCDCDC]"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              className="flex h-14 flex-1 items-center justify-center rounded-[30px] bg-[#026F4F] font-satoshi text-[18px] font-medium text-white shadow-[0px_4px_16px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#015c42]"
            >
              {isAr ? 'حفظ الملف' : 'Save Profile'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
