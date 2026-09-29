'use client';

import { useState } from 'react';
import { useTranslations, useLocale, useMessages } from 'next-intl';
import { Download, Headphones, Check, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Static plan metadata ─────────────────────────────────────────────────────
const PLANS = [
  {
    id: 'basic' as const,
    monthlyPrice: 29,
    yearlyPrice: 23,
    buttonVariant: 'green' as const,
    current: false,
    badge: false,
    featureAvailable: [true, true, true, false],
  },
  {
    id: 'pro' as const,
    monthlyPrice: 49,
    yearlyPrice: 39,
    buttonVariant: 'dark' as const,
    current: true,
    badge: true,
    featureAvailable: [true, true, true, true, false],
  },
  {
    id: 'enterprise' as const,
    monthlyPrice: 199,
    yearlyPrice: 159,
    buttonVariant: 'green' as const,
    current: false,
    badge: false,
    featureAvailable: [true, true, true, true, true],
  },
];

const BILLING_HISTORY = [
  { date: 'Jul 25, 2026', date_ar: '25 يوليو 2026', amount: '$45.00', statusKey: 'paid' as const },
  { date: 'Jun 25, 2026', date_ar: '25 يونيو 2026', amount: '$45.00', statusKey: 'paid' as const },
  { date: 'May 25, 2026', date_ar: '25 مايو 2026', amount: '$45.00', statusKey: 'paid' as const },
  { date: 'Apr 25, 2026', date_ar: '25 أبريل 2026', amount: '$45.00', statusKey: 'paid' as const },
];

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
  const t = useTranslations('billing');
  const messages = useMessages();
  const price = billing === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;

  // Access translated features array safely
  const planMessages = (messages as Record<string, unknown>)?.billing;
  const plansMessages = (planMessages as Record<string, unknown>)?.plans;
  const planData = (plansMessages as Record<string, unknown>)?.[plan.id] as Record<string, unknown> | undefined;
  const planName = planData?.name as string ?? plan.id;
  const planTagline = planData?.tagline as string ?? '';
  const planFeatures = (planData?.features as string[]) ?? [];

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-[14px] p-5 border-2',
        plan.current
          ? 'border-[#026F4F] shadow-sm'
          : 'border-[#989898]/60',
      )}
    >
      {plan.badge && (
        <div className="absolute -top-3 inset-x-0 mx-auto flex justify-center">
          <span className="whitespace-nowrap rounded-full bg-[#026F4F] px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white">
            {t('mostPopular')}
          </span>
        </div>
      )}

      {/* Header section with consistent heights so buttons align horizontally across plans */}
      <div className="flex flex-col">
        <div className="flex h-7 items-center gap-2">
          <span className="text-[17px] font-bold text-[#2D2F33]">{planName}</span>
          {plan.current && (
            <span className="rounded-lg bg-[#E6F4F0] px-2 py-0.5 text-[11px] font-semibold text-[#026F4F]">
              {t('currentPlanBadge')}
            </span>
          )}
        </div>

        <p className="mt-1 min-h-[58px] text-[13px] leading-[1.4] text-[#989898]">
          {planTagline}
        </p>

        <div className="py-4">
          <span className="text-[28px] font-bold text-[#2D2F33]">${price}</span>
          <span className="text-[13px] text-[#989898]">{t('mo')}</span>
        </div>
      </div>

      <button
        className={cn(
          'mb-4 flex h-10 w-full items-center justify-center rounded-[9px] text-[13px] font-semibold transition-colors',
          plan.buttonVariant === 'dark'
            ? 'bg-[#2D2F33] text-white opacity-80 cursor-default'
            : 'bg-[#026F4F] text-white hover:bg-[#015c42]',
        )}
        disabled={plan.current}
      >
        {plan.current ? t('currentPlanBadge') : t('selectPlan')}
      </button>

      <div className="mb-5 border-t border-[#F0F0F0]" />

      <div className="flex flex-col gap-3">
        {planFeatures.map((featureText, idx) => (
          <PlanFeatureItem
            key={idx}
            text={featureText}
            available={plan.featureAvailable[idx] ?? false}
          />
        ))}
      </div>
    </div>
  );
}

export default function BillingPage() {
  const t = useTranslations('billing');
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const messages = useMessages();

  // Resolve current plan name from messages
  const billingMessages = (messages as Record<string, unknown>)?.billing as Record<string, unknown> | undefined;
  const currentPlanName = billingMessages?.currentPlanName as string ?? 'Pro Plan';
  const currentPlanDesc = billingMessages?.currentPlanDesc as string ?? '';
  const renewalDate = billingMessages?.renewalDate as string ?? 'Aug 25, 2026';

  const USAGE_STATS = [
    { label: t('ordersThisMonth'), used: 450, total: 500, color: 'bg-[#dbdb38]' },
    { label: t('branches'), used: 18, total: 25, color: 'bg-[#026F4F]' },
    { label: t('staffAccounts'), used: 6, total: 10, color: 'bg-[#026F4F]' },
  ];

  return (
    <main className="min-h-screen rounded-2xl bg-[#F2F2F2] p-4 sm:p-5">
      {/* Page header */}
      <div className="mb-5">
        <h1 className="text-[22px] font-medium leading-[30px] text-[#2D2F33] sm:text-[26px] sm:leading-[36px] xl:text-[30px] xl:leading-[40px]">
          {t('title')}
        </h1>
        <p className="text-[13px] text-[#989898] sm:text-[15px] xl:text-base">{t('subtitle')}</p>
      </div>

      <div className="flex flex-col gap-5">
        {/* Row 1: Current Plan + Usage */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {/* Current plan */}
          <div
            className="flex flex-col gap-4 overflow-hidden rounded-xl p-5 sm:p-6"
            style={{ background: 'linear-gradient(180deg, #484959 0%, #0E1116 100%)' }}
          >
            {/* Header: Plan info + Renewal */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[22px] font-semibold text-white sm:text-[28px]">
                    {currentPlanName}
                  </span>
                  <span className="rounded-full bg-[#1FB711] px-2.5 py-0.5 text-[11px] font-medium text-white">
                    {t('active')}
                  </span>
                </div>

                <p className="text-[13px] text-[#C8C8C8] sm:text-sm">
                  {currentPlanDesc}
                </p>
              </div>

              {/* Renewal info */}
              <div className="shrink-0 rounded-xl border border-[#989898] bg-[#2A2C37] px-4 py-2.5">
                <p className="text-[12px] text-[#989898] sm:text-[13px]">{t('nextRenewal')}</p>
                <p className="text-[15px] font-medium text-white sm:text-[19px]">{renewalDate}</p>
              </div>
            </div>

            <p>
              <span className="text-[24px] font-semibold text-white sm:text-[30px]">$49</span>
              <span className="text-[13px] text-white sm:text-[15px]">{t('perMonth')}</span>
            </p>

            <div className="border-t border-white/20" />

            <div className="flex flex-wrap gap-2.5">
              <button className="rounded-[9px] border border-white bg-white px-4 py-2.5 text-[13px] font-medium text-[#2D2F33] transition-colors hover:bg-[#F2F2F2] sm:text-[15px]">
                {t('renewAllBranches')}
              </button>
              <button className="rounded-[9px] border border-white px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-white/10 sm:text-[15px]">
                {t('renewPlan')}
              </button>
              <button className="rounded-[9px] bg-[#2C313A] px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-[#3a404a] sm:text-[15px]">
                {t('cancelSub')}
              </button>
            </div>
          </div>

          {/* Usage overview */}
          <div className="rounded-xl bg-white p-5 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold text-[#2D2F33] sm:text-xl">{t('usageOverview')}</h2>
            <div className="flex flex-col gap-5">
              {USAGE_STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-black sm:text-[15px]">{stat.label}</span>
                    <span className="text-[12px] text-[#686868] sm:text-[13px]">
                      {stat.used} / {stat.total}
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-[#E9E9E9]">
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

        {/* Row 2: Choose Your Plan */}
        <div className="rounded-xl bg-white p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[#2D2F33] sm:text-xl">{t('choosePlan')}</h2>
              <p className="text-[12px] text-[#989898] sm:text-[13px]">
                {t('choosePlanDesc')}
              </p>
            </div>

            <div className="flex items-center gap-1 rounded-[10px] border border-[#E0E0E0] bg-white p-1">
              <button
                onClick={() => setBilling('monthly')}
                className={cn(
                  'rounded-[8px] px-4 py-2 text-[13px] font-medium transition-colors sm:px-5 sm:text-[14px]',
                  billing === 'monthly'
                    ? 'bg-[#2D2F33] text-white shadow-sm'
                    : 'text-[#686868] hover:text-[#2D2F33]',
                )}
              >
                {t('monthly')}
              </button>
              <button
                onClick={() => setBilling('yearly')}
                className={cn(
                  'flex items-center gap-2 rounded-[8px] px-4 py-2 text-[13px] font-medium transition-colors sm:px-5 sm:text-[14px]',
                  billing === 'yearly'
                    ? 'bg-[#2D2F33] text-white shadow-sm'
                    : 'text-[#686868] hover:text-[#2D2F33]',
                )}
              >
                {t('yearly')}
                <span className="rounded-full bg-[#E6F4F0] px-2 py-0.5 text-[11px] font-semibold text-[#026F4F]">
                  {t('save20')}
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {PLANS.map((plan) => (
              <PlanCard key={plan.id} plan={plan} billing={billing} />
            ))}
          </div>

          <div className="mt-5">
            <button className="flex items-center gap-2 rounded-full bg-[#F2F2F2] px-5 py-2 text-[#026F4F] transition-colors hover:bg-[#E6F4F0]">
              <Headphones size={16} />
              <span className="text-[14px] font-normal">{t('contactUs')}</span>
            </button>
          </div>
        </div>

        {/* Row 3: Billing History */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-[#2D2F33] sm:text-xl">{t('billingHistory')}</h2>

          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl bg-white sm:block">
            <div className="grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-4 bg-[#E9E9E9] px-5 py-2.5 text-[12px] font-medium text-[#686868]">
              <span>{t('date')}</span>
              <span>{t('amount')}</span>
              <span>{t('status')}</span>
              <span className="w-16 text-end">{t('invoice')}</span>
            </div>

            <div className="divide-y divide-[#F2F2F2]">
              {BILLING_HISTORY.map((row, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-4 px-5 py-3.5"
                >
                  <span className="text-[13px] font-medium text-black">
                    {isArabic ? row.date_ar : row.date}
                  </span>
                  <span className="text-[13px] font-medium text-black" dir="ltr">{row.amount}</span>
                  <div>
                    <span className="rounded-full bg-[#93F696] px-3.5 py-1 text-[11.5px] font-medium text-[#075D1E]">
                      {t(row.statusKey)}
                    </span>
                  </div>
                  <button className="flex h-9 w-9 items-center justify-center justify-self-end rounded-lg bg-[#E9E9E9] transition-colors hover:bg-[#D1D5DB]">
                    <Download size={15} className="text-[#2D2F33]" />
                  </button>
                </div>
              ))}
            </div>

            {/* End cap — bold closing strip matching table header colour */}
            <div className="h-4 rounded-b-xl bg-[#E9E9E9]" />
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col gap-3 sm:hidden">
            {BILLING_HISTORY.map((row, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl bg-white px-4 py-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[14px] font-medium text-black">
                    {isArabic ? row.date_ar : row.date}
                  </span>
                  <span className="text-[12px] text-[#686868]" dir="ltr">{row.amount}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="rounded-full bg-[#93F696] px-2.5 py-1 text-[11.5px] font-medium text-[#075D1E]">
                    {t(row.statusKey)}
                  </span>
                  <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E9E9E9]">
                    <Download size={15} className="text-[#2D2F33]" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile end cap */}
          <div className="h-4 rounded-xl bg-[#E9E9E9] sm:hidden" />
        </div>
      </div>
    </main>
  );
}
