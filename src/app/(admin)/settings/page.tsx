'use client';

import { useState } from 'react';
import {
  ChevronRight, MapPin, Phone, Mail, Globe, Camera,
  Search, Crosshair, Bell, Receipt, Building2, CreditCard,
  Percent, FileText, Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EditBranchModal } from '@/components/shared/EditBranchModal';

// ─── Types ────────────────────────────────────────────────────────────────────

type TabId = 'general' | 'branches' | 'payment' | 'taxes' | 'receipt' | 'notification';

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'general',      label: 'General & Brand',    icon: Globe      },
  { id: 'branches',     label: 'Branch Management',  icon: Building2  },
  { id: 'payment',      label: 'Payment Config',      icon: CreditCard },
  { id: 'taxes',        label: 'Taxes & Charges',     icon: Percent    },
  { id: 'receipt',      label: 'Receipt Format',      icon: FileText   },
  { id: 'notification', label: 'Notification',        icon: Bell       },
];

const BRANCHES = [
  { id: 'b1', name: 'Downtown (Main)', phone: '+01284980', email: 'mike.t@example.com', address: '123 Business Rd, Metropolis' },
  { id: 'b2', name: 'Downtown (Main)', phone: '+01284980', email: 'mike.t@example.com', address: '123 Business Rd, Metropolis' },
  { id: 'b3', name: 'Downtown (Main)', phone: '+01284980', email: 'mike.t@example.com', address: '123 Business Rd, Metropolis' },
];

// ─── Shared primitives ────────────────────────────────────────────────────────

function Toggle({ on, onChange }: { on?: boolean; onChange?: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange?.(!on)}
      className={cn(
        'relative h-6 w-12 shrink-0 rounded-full transition-colors focus:outline-none',
        on ? 'bg-[#026F4F]' : 'bg-[#D1D5DB]',
      )}
      aria-checked={on}
      role="switch"
    >
      <span
        className={cn(
          'absolute top-[4px] h-4 w-4 rounded-full bg-white shadow transition-transform',
          on ? 'translate-x-[28px]' : 'translate-x-[4px]',
        )}
      />
    </button>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-sm font-medium text-[#686868]">{children}</span>;
}

function TextInput({ value, placeholder }: { value?: string; placeholder?: string }) {
  return (
    <div className="flex h-14 items-center rounded-[87px] bg-[#F2F2F2] px-5">
      <span className="text-base font-medium text-[#989898]">{value ?? placeholder}</span>
    </div>
  );
}

function SelectInput({ value }: { value: string }) {
  return (
    <div className="flex h-14 items-center justify-between rounded-[87px] bg-[#F2F2F2] px-5">
      <span className="text-base font-medium text-[#989898]">{value}</span>
      <ChevronRight size={16} className="text-[#989898] rotate-90" />
    </div>
  );
}

function SectionCard({ title, children, className }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-xl bg-white p-8', className)}>
      {title && <h3 className="mb-6 text-[28px] font-medium text-[#2D2F33]">{title}</h3>}
      {children}
    </div>
  );
}

function ToggleRow({ title, desc, on }: { title: string; desc: string; on?: boolean }) {
  return (
    <SectionCard>
      <div className="flex items-center justify-between gap-8">
        <div>
          <h3 className="text-[26px] font-medium text-black">{title}</h3>
          <p className="mt-1 text-base text-[#989898]">{desc}</p>
        </div>
        <Toggle on={on} />
      </div>
    </SectionCard>
  );
}

function SaveButton() {
  return (
    <button className="h-14 w-56 rounded-full bg-[#026F4F] text-lg font-medium text-white shadow-md transition-colors hover:bg-[#015c42]">
      Save Changes
    </button>
  );
}

// ─── Tab content ──────────────────────────────────────────────────────────────

function GeneralBrandTab() {
  return (
    <div className="flex flex-col gap-6">

      {/* Business Details */}
      <SectionCard title="Business Details">
        <div className="grid grid-cols-2 gap-5 mb-5">
          <div className="flex flex-col gap-2">
            <FieldLabel>Business Name</FieldLabel>
            <TextInput value="DineConnect Global" />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel>Email</FieldLabel>
            <TextInput placeholder="Enter your Email..." />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <FieldLabel>Currency</FieldLabel>
            <SelectInput value="EGP" />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel>TimeZone</FieldLabel>
            <SelectInput value="Eastern Time (ET)" />
          </div>
        </div>
      </SectionCard>

      {/* Branding */}
      <SectionCard title="Branding & Appearance">
        <div className="flex flex-wrap gap-8">
          {/* Logo upload */}
          <div className="flex h-44 w-72 shrink-0 flex-col items-center justify-center gap-2 rounded-lg border border-[#B9B9B9] bg-[#F2F2F2]">
            <Camera size={44} className="text-[#686868]" />
            <span className="text-base font-medium text-[#2D2F33]">Upload Logo</span>
            <span className="text-xs text-[#989898]">PNG, JPG up to 2MB</span>
          </div>

          {/* Color + Language */}
          <div className="flex flex-1 flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-lg font-medium text-black">Primary Brand Color</span>
              <span className="text-xs text-[#686868]">
                This color will be applied to buttons, links, and customer-facing menus.
              </span>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-11 w-11 rounded-md bg-[#026F4F]" />
                <div className="flex h-9 w-36 items-center rounded border border-[#B9B9B9] px-3">
                  <span className="text-xs text-black"># 026f4f</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <FieldLabel>Language</FieldLabel>
              <div className="w-64">
                <SelectInput value="English" />
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Toggles */}
      <ToggleRow
        title="Expand Menu bar"
        desc="Toggle the main navigation sidebar to show full text labels or just icons."
        on
      />
      <ToggleRow
        title="Require Customer Information from Cashier"
        desc="When enabled, cashiers must enter customer details (like name or phone number) before completing an order."
        on
      />

      {/* Location */}
      <SectionCard title="Location & QR Ordering Restriction">
        <p className="mb-5 text-lg text-[#989898]">
          Restrict customers from scanning your QR code or placing orders if they are not physically at the branch.
        </p>

        {/* Search bar + button */}
        <div className="mb-5 flex items-center gap-4">
          <div className="flex flex-1 h-14 items-center gap-2 rounded-full bg-[#F2F2F2] px-5">
            <Search size={20} className="text-[#989898]" />
            <span className="text-base text-[#989898]">Search for your branch address...</span>
          </div>
          <button className="flex h-14 w-60 shrink-0 items-center justify-center gap-2 rounded-full bg-[#026F4F] text-white shadow-md hover:bg-[#015c42]">
            <Crosshair size={20} />
            <span className="text-base font-medium">Use Current Location</span>
          </button>
        </div>

        {/* Map placeholder */}
        <div className="flex h-96 items-center justify-center rounded-xl bg-[#F2F2F2]">
          <MapPin size={44} className="text-[#B9B9B9]" />
          <span className="ml-2 text-lg text-[#989898]">Map placeholder</span>
        </div>

        {/* Coordinates */}
        <div className="mt-5 grid grid-cols-3 gap-5">
          <div className="flex flex-col gap-2">
            <FieldLabel>Latitude</FieldLabel>
            <TextInput value="23.6454" />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel>Longitude</FieldLabel>
            <TextInput value="23.6454" />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel>Allowed Radius</FieldLabel>
            <SelectInput value="50 Meters" />
          </div>
        </div>
      </SectionCard>

      <SaveButton />
    </div>
  );
}

function BranchManagementTab({
  onEdit,
  onDelete,
}: {
  onEdit: (b: typeof BRANCHES[0]) => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-6">
        {BRANCHES.map((b) => (
          <div key={b.id} className="flex w-[340px] flex-col rounded-2xl bg-white p-7">
            <h3 className="mb-6 text-[26px] font-medium text-black">{b.name}</h3>

            <div className="flex flex-col gap-5 mb-6">
              <div className="flex items-center gap-3">
                <Phone size={24} className="shrink-0 text-[#989898]" />
                <span className="text-base text-[#989898]">{b.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={24} className="shrink-0 text-[#989898]" />
                <span className="text-base text-[#989898]">{b.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={24} className="shrink-0 text-[#989898]" />
                <span className="text-base text-[#989898]">{b.address}</span>
              </div>
            </div>

            <div className="border-t border-[#B9B9B9] pt-5 flex gap-4">
              <button
                onClick={() => onEdit(b)}
                className="flex-1 rounded-full border border-[#B9B9B9] bg-[#E9E9E9] py-3 text-base font-medium text-[#2D2F33] hover:bg-[#DCDCDC] transition-colors"
              >
                Edit
              </button>
              <button
                onClick={onDelete}
                className="flex-1 rounded-full bg-[#E85E5E] py-3 text-base font-medium text-white hover:bg-[#d94a4a] transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {/* Add branch card */}
        <button className="flex w-[340px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#B9B9B9] p-7 text-[#989898] hover:border-[#026F4F] hover:text-[#026F4F] transition-colors min-h-[250px]">
          <Plus size={36} strokeWidth={1.5} />
          <span className="text-base font-medium">Add Branch</span>
        </button>
      </div>
    </div>
  );
}

function PaymentConfigTab() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* Customer payment options */}
        <SectionCard title="CUSTOMER PAYMENT OPTIONS">
          <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E9E9E9]">
                  <Globe size={22} className="text-[#989898]" />
                </div>
                <div>
                  <p className="text-lg font-medium text-black">Pay Online</p>
                  <p className="text-xs text-[#989898]">Allow customers to pay digitally before or during their order via web link.</p>
                </div>
              </div>
              <Toggle on />
            </div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E9E9E9]">
                  <Receipt size={22} className="text-[#989898]" />
                </div>
                <div>
                  <p className="text-lg font-medium text-black">Get the Check</p>
                  <p className="text-xs text-[#989898]">Allow customers to request the bill and pay physically at the restaurant.</p>
                </div>
              </div>
              <Toggle on />
            </div>
          </div>
        </SectionCard>

        {/* Behavior settings */}
        <SectionCard title="BEHAVIOR SETTINGS">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
              <span className="text-lg font-medium text-[#2D2F33]">Default Payment Method</span>
              <div className="w-52">
                <SelectInput value="Card (terminal)" />
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-lg font-medium text-[#2D2F33]">When Is Payment Required</span>
              <div className="w-52">
                <SelectInput value="After Order" />
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      <SaveButton />
    </div>
  );
}

function TaxesChargesTab() {
  return (
    <div className="flex flex-col gap-6">
      <SectionCard>
        {/* VAT section */}
        <div className="flex items-start justify-between gap-8 mb-8">
          <div>
            <h3 className="text-[28px] font-medium text-black">Value Added Tax (VAT)</h3>
            <p className="mt-1 text-base text-[#686868]">Configure automated tax calculation on orders.</p>
          </div>
          <Toggle on />
        </div>
        <div className="grid grid-cols-2 gap-5 mb-10">
          <div className="flex flex-col gap-2">
            <FieldLabel>VAT Percentage (%)</FieldLabel>
            <TextInput value="14" />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel>Tax Calculation Method</FieldLabel>
            <SelectInput value="Inclusive (VAT included in prices)" />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#F2F2F2] mb-8" />

        {/* Service charge */}
        <div className="flex items-start justify-between gap-8 mb-6">
          <div>
            <h3 className="text-[28px] font-medium text-black">Service Charge</h3>
            <p className="mt-1 text-base text-[#686868]">Apply automated gratuity or service fees.</p>
          </div>
          <Toggle on />
        </div>
        <div className="w-1/2">
          <div className="flex flex-col gap-2">
            <FieldLabel>Service Percentage (%)</FieldLabel>
            <SelectInput value="12%" />
          </div>
        </div>
      </SectionCard>

      <SaveButton />
    </div>
  );
}

function ReceiptFormatTab() {
  return (
    <div className="flex gap-6">
      {/* Left: form */}
      <div className="flex flex-1 flex-col gap-6">
        <SectionCard>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <FieldLabel>Header Text</FieldLabel>
              <div className="min-h-[112px] w-full rounded-2xl bg-[#F2F2F2] p-4">
                <span className="text-base font-medium text-[#989898]">
                  Thank you for dining with us! Follow us @DineConnect
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <FieldLabel>Footer Text</FieldLabel>
              <div className="min-h-[112px] w-full rounded-2xl bg-[#F2F2F2] p-4">
                <span className="text-base font-medium text-[#989898]">
                  Thank you for dining with us! Follow us @DineConnect
                </span>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-8">
              <div>
                <p className="text-xl font-medium text-black">Show Tax Breakdown</p>
                <p className="mt-1 text-base text-[#989898]">Print detailed VAT/Tax amounts on the receipt.</p>
              </div>
              <Toggle on />
            </div>
            <div className="flex items-center justify-between gap-8">
              <div>
                <p className="text-xl font-medium text-black">Show Service Charge</p>
                <p className="mt-1 text-base text-[#989898]">Print the service charge line item.</p>
              </div>
              <Toggle on />
            </div>
          </div>
        </SectionCard>

        <SaveButton />
      </div>

      {/* Right: receipt preview */}
      <div className="w-80 shrink-0 overflow-hidden rounded-xl bg-white py-10">
        <div className="flex flex-col items-center gap-7 px-6">
          {/* Logo placeholder */}
          <div className="h-10 w-32 rounded bg-[#F2F2F2]" />

          <p className="w-60 text-center text-base font-light text-black leading-6">
            Thank you for dining with us! Follow us @EMSA7
          </p>

          <div className="w-full border-t border-[#686868]" />

          <div className="flex w-full flex-col gap-5">
            <div className="flex items-center justify-between">
              <span className="text-base text-[#686868]">1x Classic Burger</span>
              <span className="text-base text-[#686868]">$15.00</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base text-[#686868]">2x Classic Burger</span>
              <span className="text-base text-[#686868]">$15.00</span>
            </div>
          </div>

          <div className="w-full border-t border-[#686868]" />

          <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-base text-[#686868]">Subtotal</span>
              <span className="text-base text-[#686868]">$30.00</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base text-[#686868]">VAT (10%)</span>
              <span className="text-base text-[#686868]">$3.00</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base text-[#686868]">Service (10%)</span>
              <span className="text-base text-[#686868]">$3.30</span>
            </div>
            <div className="flex items-center justify-between border-t border-[#686868] pt-4">
              <span className="text-xl font-medium text-black">Total</span>
              <span className="text-xl font-medium text-black">$36.30</span>
            </div>
          </div>

          <div className="w-full border-t border-[#686868]" />

          <p className="w-60 text-center text-base font-light text-black leading-6">
            Please Come Again<br />Wifi: 12345678
          </p>
        </div>
      </div>
    </div>
  );
}

function NotificationTab() {
  const notifications = [
    { name: 'Brian Griffin', action: 'wants to collaborate', time: '5 days ago', bold: true },
    { name: 'Adam', from: "The Mayor's Office", action: 'is looking for people like you.', time: '1 month ago' },
    { name: 'Neil', action: 'is looking for people like you.', time: '1 month ago' },
    { name: 'Quagmire', from: 'Giggity Co.', action: 'is looking for people like you.', time: '1 month ago' },
    { name: 'Herbert', from: "Children's Program", action: 'is looking for people like you.', time: '1 month ago' },
    { name: 'Clevaland', from: 'The Post Office', action: 'is looking for people like you.', time: '2 months ago' },
    { name: 'Joe', action: 'is looking for people like you.', time: '2 months ago' },
    { name: 'Stewie', from: 'World Takeover', action: 'is looking for people like you.', time: '2 months ago' },
  ];

  return (
    <div className="rounded-xl bg-white overflow-hidden max-w-[700px]">
      <div className="flex flex-col divide-y divide-slate-100">
        {notifications.map((n, i) => (
          <div key={i} className="flex items-start gap-3 px-5 py-5">
            <div className="h-10 w-10 shrink-0 rounded-full bg-[#F2F2F2]" />
            <div className="flex-1 min-w-0">
              <p className="text-sm leading-5 text-gray-500">
                {n.bold ? (
                  <>
                    <strong className="text-zinc-700">{n.name}</strong>
                    <span> {n.action}</span>
                  </>
                ) : (
                  <>
                    Hey, we've got a new opportunity for you.{' '}
                    <strong className="text-zinc-600">{n.name}</strong>
                    {n.from ? ` from ${n.from}` : ''} {n.action}
                  </>
                )}
              </p>
              <p className="mt-0.5 text-xs text-gray-400">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [active, setActive] = useState<TabId>('general');
  const [editBranch, setEditBranch] = useState<typeof BRANCHES[0] | null>(null);

  return (
    <main className="flex min-h-screen gap-0 rounded-2xl bg-[#F2F2F2]">

      {/* ── Settings left nav ── */}
      <aside className="sticky top-5 h-[calc(100vh-40px)] w-[280px] shrink-0 overflow-y-auto rounded-xl bg-white m-5">
        <div className="px-8 pt-7 pb-2">
          <h2 className="text-[32px] font-medium text-black">Settings</h2>
        </div>

        <nav className="mt-8 flex flex-col px-6 pb-6">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={cn(
                  'flex items-center justify-between rounded-xl px-3 py-3.5 text-left text-[17px] font-normal transition-colors',
                  isActive
                    ? 'bg-[#F2F2F2] text-black font-medium'
                    : 'text-[#989898] hover:text-black',
                )}
              >
                <span className="flex items-center gap-3">
                  <Icon size={20} strokeWidth={1.5} />
                  {tab.label}
                </span>
                <ChevronRight
                  size={15}
                  className={cn(isActive ? 'text-black' : 'text-[#989898]')}
                />
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ── Content area ── */}
      <div className="flex-1 overflow-y-auto py-5 pr-5">
        {/* Page title */}
        <div className="mb-7 flex items-center gap-3">
          {(() => {
            const tab = TABS.find(t => t.id === active)!;
            const Icon = tab.icon;
            return (
              <>
                <Icon size={28} className="text-[#2D2F33]" strokeWidth={1.8} />
                <h1 className="text-[40px] font-medium leading-[56px] text-[#2D2F33]">
                  {tab.label} Settings
                </h1>
              </>
            );
          })()}
        </div>

        {active === 'general'      && <GeneralBrandTab />}
        {active === 'branches'     && (
          <BranchManagementTab
            onEdit={(b) => setEditBranch(b)}
            onDelete={() => {}}
          />
        )}
        {active === 'payment'      && <PaymentConfigTab />}
        {active === 'taxes'        && <TaxesChargesTab />}
        {active === 'receipt'      && <ReceiptFormatTab />}
        {active === 'notification' && <NotificationTab />}
      </div>

      <EditBranchModal
        open={!!editBranch}
        branch={editBranch}
        onClose={() => setEditBranch(null)}
      />
    </main>
  );
}
