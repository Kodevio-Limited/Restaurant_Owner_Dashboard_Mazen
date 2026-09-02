'use client';

import { useState } from 'react';
import {
  ChevronRight, MapPin, Phone, Mail, Globe, Camera,
  Search, Crosshair, Bell, Receipt, Building2, CreditCard,
  Percent, FileText, Plus, User,
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
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        checked={on}
        onChange={() => onChange?.(!on)}
        className="peer sr-only"
      />
      <div className="h-[26px] w-[48px] rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-[22px] after:w-[22px] after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#026F4F] peer-checked:after:translate-x-[22px] peer-checked:after:border-white" />
    </label>
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
    <div className={cn('rounded-xl bg-white p-4 sm:p-5', className)}>
      {title && <h3 className="mb-4 text-lg font-medium text-[#2D2F33] sm:text-xl">{title}</h3>}
      {children}
    </div>
  );
}

function ToggleRow({ title, desc, on, onChange }: { title: string; desc: string; on?: boolean; onChange?: (v: boolean) => void }) {
  return (
    <SectionCard>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <div>
          <h3 className="text-[15px] font-medium text-black sm:text-[17px]">{title}</h3>
          <p className="mt-0.5 text-[13px] text-[#989898] sm:text-sm">{desc}</p>
        </div>
        <Toggle on={on} onChange={onChange} />
      </div>
    </SectionCard>
  );
}

function SaveButton() {
  return (
    <button className="h-11 w-full rounded-full bg-[#026F4F] text-[15px] font-medium text-white shadow-md transition-colors hover:bg-[#015c42] sm:w-48">
      Save Changes
    </button>
  );
}

// ─── Tab content ──────────────────────────────────────────────────────────────

function GeneralBrandTab() {
  const [expandMenu, setExpandMenu] = useState(true);
  const [requireCustomer, setRequireCustomer] = useState(true);

  return (
    <div className="flex flex-col gap-6">

      {/* Business Details */}
      <SectionCard title="Business Details">
        <div className="grid grid-cols-1 gap-5 mb-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <FieldLabel>Business Name</FieldLabel>
            <TextInput value="DineConnect Global" />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel>Email</FieldLabel>
            <TextInput placeholder="Enter your Email..." />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Logo upload */}
          <div className="flex h-44 w-72 shrink-0 flex-col items-center justify-center gap-2 rounded-lg border border-[#B9B9B9] bg-[#F2F2F2]">
            <Camera size={44} className="text-[#686868]" />
            <span className="text-base font-medium text-[#2D2F33]">Upload Logo</span>
            <span className="text-xs text-[#989898]">PNG, JPG up to 2MB</span>
          </div>

          {/* Two columns: Color + Language */}
          <div className="flex flex-1 flex-col gap-6 sm:flex-row sm:gap-8">
            <div className="flex flex-1 flex-col gap-2">
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
            <div className="flex flex-1 flex-col gap-2">
              <FieldLabel>Language</FieldLabel>
              <SelectInput value="English" />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Toggles */}
      <ToggleRow title="Expand Menu bar" desc="Toggle the main navigation sidebar to show full text labels or just icons." on={expandMenu} onChange={setExpandMenu} />
      <ToggleRow title="Require Customer Information from Cashier" desc="When enabled, cashiers must enter customer details (like name or phone number) before completing an order." on={requireCustomer} onChange={setRequireCustomer} />

      {/* Location */}
      <SectionCard title="Location & QR Ordering Restriction">
        <p className="mb-5 text-lg text-[#989898]">
          Restrict customers from scanning your QR code or placing orders if they are not physically at the branch.
        </p>

        {/* Search bar + button */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 h-14 items-center gap-2 rounded-full bg-[#F2F2F2] px-5">
            <Search size={20} className="text-[#989898]" />
            <span className="text-base text-[#989898]">Search for your branch address...</span>
          </div>
          <button className="flex h-14 shrink-0 items-center justify-center gap-2 rounded-full bg-[#026F4F] px-6 text-white shadow-md hover:bg-[#015c42] sm:w-60">
            <Crosshair size={20} />
            <span className="text-base font-medium">Use Current Location</span>
          </button>
        </div>

        {/* Map */}
        <div className="mb-5 h-96 overflow-hidden rounded-xl">
          <iframe
            src="https://www.openstreetmap.org/export/embed.html?bbox=31.2357%2C29.9792%2C31.2857%2C30.0192&layer=mapnik&marker=30.0%2C31.26"
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Branch Location Map"
          />
        </div>

        {/* Coordinates */}
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {BRANCHES.map((b) => (
          <div key={b.id} className="flex flex-col rounded-2xl bg-white p-5">
            <h3 className="mb-4 text-[19px] font-medium text-black">{b.name}</h3>

            <div className="flex flex-col gap-3.5 mb-5">
              <div className="flex items-center gap-2.5">
                <Phone size={17} className="shrink-0 text-[#989898]" />
                <span className="text-[13px] text-[#989898]">{b.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={17} className="shrink-0 text-[#989898]" />
                <span className="text-[13px] text-[#989898]">{b.email}</span>
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
        <button className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#B9B9B9] p-7 text-[#989898] hover:border-[#026F4F] hover:text-[#026F4F] transition-colors min-h-[250px]">
          <Plus size={36} strokeWidth={1.5} />
          <span className="text-base font-medium">Add Branch</span>
        </button>
      </div>
    </div>
  );
}

function PaymentConfigTab() {
  const [payOnline, setPayOnline] = useState(true);
  const [getCheck, setGetCheck] = useState(true);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

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
              <Toggle on={payOnline} onChange={setPayOnline} />
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
              <Toggle on={getCheck} onChange={setGetCheck} />
            </div>
          </div>
        </SectionCard>

        {/* Behavior settings */}
        <SectionCard title="BEHAVIOR SETTINGS">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <span className="text-lg font-medium text-[#2D2F33]">Default Payment Method</span>
              <div className="w-full sm:w-52">
                <SelectInput value="Card (terminal)" />
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <span className="text-lg font-medium text-[#2D2F33]">When Is Payment Required</span>
              <div className="w-full sm:w-52">
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
  const [vatEnabled, setVatEnabled] = useState(true);
  const [serviceEnabled, setServiceEnabled] = useState(true);

  return (
    <div className="flex flex-col gap-6">
      <SectionCard>
        <div className="flex items-start justify-between gap-6 mb-5">
          <div>
            <h3 className="text-[19px] font-medium text-black">Value Added Tax (VAT)</h3>
            <p className="mt-1 text-sm text-[#686868]">Configure automated tax calculation on orders.</p>
          </div>
          <Toggle on={vatEnabled} onChange={setVatEnabled} />
        </div>
        <div className="grid grid-cols-1 gap-5 mb-10 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <FieldLabel>VAT Percentage (%)</FieldLabel>
            <TextInput value="14" />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel>Tax Calculation Method</FieldLabel>
            <SelectInput value="Inclusive (VAT included in prices)" />
          </div>
        </div>

        <div className="border-t border-[#F2F2F2] mb-8" />

        <div className="flex items-start justify-between gap-6 mb-4">
          <div>
            <h3 className="text-[19px] font-medium text-black">Service Charge</h3>
            <p className="mt-1 text-sm text-[#686868]">Apply automated gratuity or service fees.</p>
          </div>
          <Toggle on={serviceEnabled} onChange={setServiceEnabled} />
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
  const [showTax, setShowTax] = useState(true);
  const [showService, setShowService] = useState(true);

  return (
    <div className="flex flex-col gap-6 xl:flex-row">
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
              <Toggle on={showTax} onChange={setShowTax} />
            </div>
            <div className="flex items-center justify-between gap-8">
              <div>
                <p className="text-xl font-medium text-black">Show Service Charge</p>
                <p className="mt-1 text-base text-[#989898]">Print the service charge line item.</p>
              </div>
              <Toggle on={showService} onChange={setShowService} />
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
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [staffAlerts, setStaffAlerts] = useState(true);
  const [promotions, setPromotions] = useState(false);

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
    <div className="flex flex-col gap-6">
      <SectionCard title="Notification Preferences">
        <div className="flex flex-col gap-6">
          <ToggleRow title="Order Updates" desc="Get notified when orders are placed, updated, or completed." on={orderUpdates} onChange={setOrderUpdates} />
          <ToggleRow title="Staff Alerts" desc="Receive alerts for staff check-ins, shift changes, and activity." on={staffAlerts} onChange={setStaffAlerts} />
          <ToggleRow title="Promotions & Marketing" desc="Stay updated on promotional campaigns and marketing events." on={promotions} onChange={setPromotions} />
        </div>
      </SectionCard>

      <SectionCard title="Recent Notifications">
        <div className="rounded-xl overflow-hidden max-w-[700px]">
          <div className="flex flex-col divide-y divide-slate-100">
            {notifications.map((n, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-5">
                <div className="h-10 w-10 shrink-0 rounded-full bg-[#F2F2F2] flex items-center justify-center">
                  <User size={20} className="text-[#989898]" />
                </div>
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
      </SectionCard>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [active, setActive] = useState<TabId | null>('general');
  const [editBranch, setEditBranch] = useState<typeof BRANCHES[0] | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <main className="flex min-h-screen flex-col gap-0 rounded-2xl bg-[#F2F2F2] lg:flex-row">

      {/* ── Mobile/Tablet: horizontal tab bar ── */}
      <div className="sticky top-0 z-10 lg:hidden">
        <div className="overflow-x-auto bg-white px-4 py-4 scrollbar-hide">
          <div className="flex items-center gap-2 w-max">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = active === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActive(isActive ? (null as unknown as TabId) : tab.id)}
                  className={cn(
                    'flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-[15px] font-medium transition-colors',
                    isActive
                      ? 'bg-[#026F4F] text-white'
                      : 'bg-[#F2F2F2] text-[#686868] hover:bg-[#E9E9E9]',
                  )}
                >
                  <Icon size={18} strokeWidth={1.5} />
                  <span className="whitespace-nowrap">{tab.label}</span>
                  {isActive && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="ml-1">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Desktop: Settings left nav (collapsible) ── */}
      <aside className={cn(
        'sticky top-5 hidden h-[calc(100vh-40px)] shrink-0 overflow-y-auto rounded-xl bg-white m-5 transition-all duration-300 lg:block',
        sidebarOpen ? 'w-[280px]' : 'w-[72px]',
      )}>
        {/* Collapse toggle */}
        <div className="flex items-center justify-between px-4 pt-5 pb-2">
          {sidebarOpen && <h2 className="text-xl font-medium text-black">Settings</h2>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F2F2F2] text-[#686868] hover:bg-[#E9E9E9]"
          >
            {sidebarOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            )}
          </button>
        </div>

        <nav className="mt-6 flex flex-col px-3 pb-6">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                title={!sidebarOpen ? tab.label : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[14px] font-normal transition-colors',
                  isActive
                    ? 'bg-[#F2F2F2] text-black font-medium'
                    : 'text-[#989898] hover:text-black',
                  !sidebarOpen && 'justify-center px-0',
                )}
              >
                <Icon size={20} strokeWidth={1.5} className="shrink-0" />
                {sidebarOpen && <span className="flex-1 truncate">{tab.label}</span>}
                {sidebarOpen && (
                  <ChevronRight size={15} className={cn(isActive ? 'text-black' : 'text-[#989898]')} />
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ── Content area ── */}
      <div className="flex-1 overflow-y-auto p-4 lg:py-5 lg:pr-5 lg:pl-0">
        {/* Page title */}
        {active && (
          <div className="mb-5 flex items-center gap-2.5">
            {(() => {
              const tab = TABS.find(t => t.id === active)!;
              const Icon = tab.icon;
              return (
                <>
                  <Icon size={22} className="text-[#2D2F33]" strokeWidth={1.8} />
                  <h1 className="text-[22px] font-medium leading-[30px] text-[#2D2F33] sm:text-[26px] sm:leading-[36px] xl:text-[30px] xl:leading-[40px]">
                    {tab.label} Settings
                  </h1>
                </>
              );
            })()}
          </div>
        )}

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
