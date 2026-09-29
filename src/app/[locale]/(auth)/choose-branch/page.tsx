import { Store, ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { setRequestLocale, getTranslations } from 'next-intl/server';

const branches = [
  {
    id: 1,
    name: 'Main Branch',
    name_ar: 'الفرع الرئيسي',
    address: '123 Restaurant Street, Downtown',
    address_ar: '123 شارع المطاعم، وسط المدينة',
  },
  {
    id: 2,
    name: 'Branch 2',
    name_ar: 'الفرع الثاني',
    address: '456 Food Avenue, Uptown',
    address_ar: '456 شارع المأكولات، أعلى المدينة',
  },
  {
    id: 3,
    name: 'Branch 3',
    name_ar: 'الفرع الثالث',
    address: '789 Dining Boulevard, Midtown',
    address_ar: '789 جادة الطعام، وسط المدينة',
  },
];

export default async function ChooseBranchPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('auth.chooseBranch');
  const isArabic = locale === 'ar';

  return (
    <>
      <div className="flex w-full flex-col items-center gap-3 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-['Satoshi'] text-zinc-800">
          {t('title')}
        </h1>
        <p className="max-w-[492px] text-sm sm:text-base md:text-lg text-zinc-500 font-normal">
          {t('subtitle')}
        </p>
      </div>

      <div className="w-full flex flex-col items-start gap-4">
        {branches.map((branch) => (
          <Link
            key={branch.id}
            href="/reports/analytics"
            className="w-full p-4 sm:p-5 bg-gray-200 rounded-2xl sm:rounded-3xl inline-flex items-center gap-4 hover:bg-gray-300 transition-colors"
          >
            <div className="w-11 h-11 sm:w-14 sm:h-14 bg-emerald-700 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
              <Store className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="flex-1 flex flex-col min-w-0">
              <span className="text-zinc-800 text-lg sm:text-xl font-semibold font-['Satoshi'] truncate">
                {isArabic ? branch.name_ar : branch.name}
              </span>
              <span className="text-zinc-500 text-xs sm:text-sm font-normal truncate">
                {isArabic ? branch.address_ar : branch.address}
              </span>
            </div>
            <ChevronRight className="w-6 h-6 text-zinc-400 shrink-0 rtl:scale-x-[-1]" />
          </Link>
        ))}
      </div>
    </>
  );
}