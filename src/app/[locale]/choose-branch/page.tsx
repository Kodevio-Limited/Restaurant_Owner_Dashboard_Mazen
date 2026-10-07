'use client';

import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { BranchCards, type Branch } from '@/components/auth/BranchCards';

const BRANCHES: Branch[] = [
  {
    id: 1,
    name: 'Downtown (Main)',
    name_ar: 'وسط المدينة (الرئيسي)',
    address: '123 Business Rd, Metropolis',
    address_ar: '123 شارع الأعمال، متروبوليس',
  },
  {
    id: 2,
    name: 'Uptown Plaza',
    name_ar: 'بلازا أعلى المدينة',
    address: '123 Business Rd, Metropolis',
    address_ar: '123 شارع الأعمال، متروبوليس',
  },
  {
    id: 3,
    name: 'Harbour Branch',
    name_ar: 'فرع الميناء',
    address: '123 Business Rd, Metropolis',
    address_ar: '123 شارع الأعمال، متروبوليس',
  },
  {
    id: 4,
    name: 'Airport Branch',
    name_ar: 'فرع المطار',
    address: '123 Business Rd, Metropolis',
    address_ar: '123 شارع الأعمال، متروبوليس',
  },
];

// Figma 1594:1493 — full-screen #F2F2F2 page: 53px padding, logo + Reports
// pill header, welcome block, and a row of four 434×441 branch cards.
export default function ChooseBranchPage() {
  const t = useTranslations('auth.chooseBranch');
  const locale = useLocale();
  const isArabic = locale === 'ar';

  return (
    <div className="min-h-screen w-full bg-[#F2F2F2] p-[clamp(24px,2.76vw,53px)]">
      {/* Header — Figma 1679:70968 */}
      <div className="flex w-full items-center justify-between gap-4">
        <Image
          src="/images/logo-69e842.png"
          alt="EMSA"
          width={125}
          height={37}
          priority
          className="h-[37px] w-auto"
        />
        <Link
          href="/reports/analytics"
          className="inline-flex items-center gap-2.5 rounded-[41px] border border-[#026F4F] bg-white px-3 py-2.5 transition-colors hover:bg-[#E6F1ED]"
        >
          <span className="flex size-[27px] items-center justify-center">
            <Image
              src="/images/figma/auth/reports.svg"
              alt=""
              aria-hidden="true"
              width={21}
              height={21}
              className="size-[20.25px]"
            />
          </span>
          <span className="whitespace-nowrap font-['Satoshi'] text-[16px] font-medium leading-[1.4] text-black">
            {t('reportsAnalytics')}
          </span>
        </Link>
      </div>

      {/* Welcome — Figma 1594:1627 (title top 133 = header 100 + 33) */}
      <div className="mt-[clamp(20px,1.72vw,33px)] flex w-full max-w-[541px] flex-col gap-[21px]">
        <h1 className="w-full whitespace-nowrap text-center text-[clamp(32px,2.6vw,50px)] font-semibold leading-[1.4] text-[#2D2F33]">
          {t('title')}
        </h1>
        <p className="w-full text-[clamp(16px,1.2vw,23px)] font-normal leading-[1.4] text-[#989898]">
          {t('subtitle')}
        </p>
      </div>

      {/* Cards — Figma 1594:1728 */}
      <div className="mt-[clamp(24px,2.24vw,43px)]">
        <BranchCards
          branches={BRANCHES}
          isArabic={isArabic}
          revenueLabel={t('todayRevenue')}
        />
      </div>
    </div>
  );
}
