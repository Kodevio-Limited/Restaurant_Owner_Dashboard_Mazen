'use client';

import { useState } from 'react';
import { Download, Headphones, Check, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Data ────────────────────────────────────────────────────────────────────

const PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    tagline: 'Essential tools for small cafes and pop-ups.',
    monthlyPrice: 29,
    yearlyPrice: 23,
    buttonLabel: 'Downgrade',
    buttonVariant: 'outline' as const,
    current: false,
    features: [
      { text: 'Up to 200 orders/mo', available: true },
      { text: '10 Tables', available: true },
      { text: 'Basic Menu Management', available: true },
      { text: 'Multi-branch Support', available: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Advanced features for busy, growing restaurants.',
    monthlyPrice: 49,
    yearlyPrice: 39,
    buttonLabel: 'Current Plan',
    buttonVariant: 'dark' as const,
    current: true,
    badge: 'Most Popular',
    features: [
      { text: 'Up to 500 orders/mo', available: true },
      { text: '25 Tables', available: true },
      { text: 'Advanced Reports', available: true },
      { text: 'Staff Roles & Permissions', available: true },
      { text: 'Multi-branch Support', available: false },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'Unlimited scale and multi-location management.',
    monthlyPrice: 199,
    yearlyPrice: 159,
    buttonLabel: 'Select Plan',
    buttonVariant: 'green' as const,
    current: false,
    features: [
      { text: 'Unlimited orders', available: true },
      { text: 'Unlimited Tables', available: true },
      { text: 'White-label QR Codes', available: true },
      { text: 'Multi-branch Support', available: true },
      { text: 'Dedicated Account Manager', available: true },
    ],
  },
];

const USAGE_STATS = [
  { label: 'Orders this month', used: 450, total: 500, color: 'bg-[#dbdb38]' },
  { label: 'Branches', used: 18, total: 25, color: 'bg-[#026F4F]' },
  { label: 'Staff Accounts', used: 6, total: 10, color: 'bg-[#026F4F]' },
];

const BILLING_HISTORY = [
  { date: 'Jul 25, 2026', amount: '$45.00', status: 'PAID' },
  { date: 'Jun 25, 2026', amount: '$45.00', status: 'PAID' },
  { date: 'May 25, 2026', amount: '$45.00', status: 'PAID' },
  { date: 'Apr 25, 2026', amount: '$45.00', status: 'PAID' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function PlanFeatureItem({ text, available }: { text: string; available: boolean }) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5 shrink-0">
        {available ? (
          <Check size={16} className="text-[#026F4F]" strokeWidth={2.5} />
        ) : (
          <Lock size={16} className="text-[#C0C0C0]" strokeWidth={2} />
        )}
      </div>
      <span className={cn('text-[13px] leading-[1.4]', available ? 'text-[#2D2F33]' : 'text-[#C0C0C0]')}>
        {text}
      </span>
    </div>
  );
}

function PlanCard({ plan, billing }: { plan: typeof PLANS[0]; billing: 'monthly' | 'yearly' }) {
  const price = billing === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-[14px] border p-6',
        plan.current
          ? 'border-2 border-[#026F4F] shadow-sm'
          : 'border border-[#989898]',
      )}
    >
      {/* Most Popular badge */}
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-[#026F4F] px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white">
            {plan.badge}
          </span>
        </div>
      )}

      {/* Plan name + current label */}
      <div className="flex items-center gap-2 pb-1">
        <span className="text-[20px] font-bold text-[#2D2F33]">{plan.name}</span>
        {plan.current && (
          <span className="rounded-lg bg-[#E6F4F0] px-2 py-0.5 text-[11px] font-semibold text-[#026F4F]">
            Current
          </span>
        )}
      </div>

      {/* Tagline */}
      <p className="pb-4 text-[13px] text-[#989898]">{plan.tagline}</p>

      {/* Price */}
      <div className="pb-5">
        <span className="text-[36px] font-bold text-[#2D2F33]">${price}</span>
        <span className="text-[15px] text-[#989898]">/mo</span>
      </div>

      {/* CTA button */}
      <button
        className={cn(
          'mb-5 w-full rounded-[9px] py-3 text-[15px] font-semibold transition-colors',
          plan.buttonVariant === 'outline'
            ? 'border border-[#2D2F33] bg-white text-[#2D2F33] hover:bg-[#F2F2F2]'
            : plan.buttonVariant === 'dark'
            ? 'bg-[#2D2F33] text-white opacity-80 cursor-default'
            : 'bg-[#026F4F] text-white hover:bg-[#015c42]',
        )}
        disabled={plan.current}
      >
        {plan.buttonLabel}
      </button>

      {/* Divider */}
      <div className="mb-5 border-t border-[#F0F0F0]" />

      {/* Features */}
      <div className="flex flex-col gap-3">
        {plan.features.map((f) => (
          <PlanFeatureItem key={f.text} text={f.text} available={f.available} />
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BillingPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <main className="min-h-screen rounded-2xl bg-[#F2F2F2] p-5">
      {/* Page header */}
      <div className="mb-7">
        <h1 className="text-[40px] font-medium leading-[56px] text-[#2D2F33]">
          Subscription &amp; Billing
        </h1>
        <p className="text-[23px] text-[#989898]">
          Manage your plan, billing details, and feature access
        </p>
      </div>

      <div className="flex flex-col gap-7">
        {/* ── Row 1: Current Plan card + Usage Overview ── */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {/* Current plan summary */}
          <div
            className="relative flex flex-col gap-5 overflow-hidden rounded-xl p-8"
            style={{ background: 'linear-gradient(180deg, #484959 0%, #0E1116 100%)' }}
          >
            {/* Plan name + ACTIVE */}
            <div className="flex items-center gap-4">
              <span className="text-[40px] font-semibold text-white">Pro Plan</span>
              <span className="rounded-full bg-[#1FB711] px-3 py-1 text-[13px] font-medium text-white">
                ACTIVE
              </span>
            </div>

            <p className="text-[16px] text-[#C8C8C8]">
              Perfect for growing restaurants managing high volumes.
            </p>

            <p className="text-[0px]">
              <span className="text-[40px] font-semibold text-white">$49</span>
              <span className="text-[23px] text-white">/Month</span>
            </p>

            {/* Renewal info */}
            <div className="absolute right-8 top-6 rounded-xl border border-[#989898] bg-[#2A2C37] px-4 py-3">
              <p className="text-[19px] text-[#989898]">Next Renewal</p>
              <p className="text-[28px] font-medium text-white">Aug 25, 2026</p>
            </div>

            {/* Divider */}
            <div className="border-t border-white/20" />

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <button className="rounded-[9px] border border-white bg-white px-6 py-4 text-[23px] font-medium text-[#2D2F33] transition-colors hover:bg-[#F2F2F2]">
                Renew All Branches
              </button>
              <button className="rounded-[9px] border border-white px-6 py-4 text-[23px] font-medium text-white transition-colors hover:bg-white/10">
                Renew Plan
              </button>
              <button className="rounded-[9px] bg-[#2C313A] px-6 py-4 text-[23px] font-medium text-white transition-colors hover:bg-[#3a404a]">
                Cancel Sub
              </button>
            </div>
          </div>

          {/* Usage overview */}
          <div className="rounded-xl bg-white p-8">
            <h2 className="mb-6 text-[33px] font-semibold text-[#2D2F33]">Usage Overview</h2>
            <div className="flex flex-col gap-8">
              {USAGE_STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[19px] font-medium text-black">{stat.label}</span>
                    <span className="text-[16px] text-[#686868]">
                      {stat.used} / {stat.total}
                    </span>
                  </div>
                  <div className="h-[15px] overflow-hidden rounded-full bg-[#E9E9E9]">
                    <div
                      className={cn('h-full rounded-full', stat.color)}
                      style={{ width: `${(stat.used / stat.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Row 2: Choose Your Plan ── */}
        <div className="rounded-xl bg-white p-8">
          {/* Header + billing toggle */}
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-[28px] font-semibold text-[#2D2F33]">Choose Your Plan</h2>
              <p className="text-[15px] text-[#989898]">
                Upgrade to unlock more tables, orders, and premium features.
              </p>
            </div>

            {/* Monthly / Yearly toggle */}
            <div className="flex items-center gap-1 rounded-[10px] border border-[#E0E0E0] bg-white p-1">
              <button
                onClick={() => setBilling('monthly')}
                className={cn(
                  'rounded-[8px] px-5 py-2 text-[14px] font-medium transition-colors',
                  billing === 'monthly'
                    ? 'bg-[#2D2F33] text-white shadow-sm'
                    : 'text-[#686868] hover:text-[#2D2F33]',
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling('yearly')}
                className={cn(
                  'flex items-center gap-2 rounded-[8px] px-5 py-2 text-[14px] font-medium transition-colors',
                  billing === 'yearly'
                    ? 'bg-[#2D2F33] text-white shadow-sm'
                    : 'text-[#686868] hover:text-[#2D2F33]',
                )}
              >
                Yearly
                <span className="rounded-full bg-[#E6F4F0] px-2 py-0.5 text-[11px] font-semibold text-[#026F4F]">
                  SAVE 20%
                </span>
              </button>
            </div>
          </div>

          {/* Plan cards */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {PLANS.map((plan) => (
              <PlanCard key={plan.id} plan={plan} billing={billing} />
            ))}
          </div>

          {/* Contact us */}
          <div className="mt-6">
            <button className="flex items-center gap-3 rounded-full bg-[#F2F2F2] px-6 py-2 text-[#026F4F] transition-colors hover:bg-[#E6F4F0]">
              <Headphones size={24} />
              <span className="text-[19px] font-normal">Contact Us</span>
            </button>
          </div>
        </div>

        {/* ── Row 3: Billing History ── */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[28px] font-semibold text-[#2D2F33]">Billing History</h2>

          <div className="overflow-hidden rounded-xl bg-white">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-4 bg-[#E9E9E9] px-8 py-4 text-[16px] font-medium text-[#686868]">
              <span>DATE</span>
              <span>AMOUNT</span>
              <span>STATUS</span>
              <span className="w-20 text-right">INVOICE</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-[#F2F2F2]">
              {BILLING_HISTORY.map((row, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-4 px-8 py-5"
                >
                  <span className="text-[19px] font-medium text-black">{row.date}</span>
                  <span className="text-[19px] font-medium text-black">{row.amount}</span>
                  <div>
                    <span className="rounded-full bg-[#93F696] px-5 py-2 text-[17px] font-medium text-[#075D1E]">
                      {row.status}
                    </span>
                  </div>
                  <button className="flex h-[52px] w-[52px] items-center justify-center rounded-lg bg-[#E9E9E9] transition-colors hover:bg-[#D1D5DB]">
                    <Download size={22} className="text-[#2D2F33]" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
