import { Link } from '@/i18n/routing';
import { setRequestLocale, getTranslations } from 'next-intl/server';

export default async function VerifyEmailPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('auth.verifyEmail');

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

      {/* OTP Input */}
      <div className="w-full flex flex-col items-center gap-6">
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4" dir="ltr">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="w-12 h-14 sm:w-16 sm:h-20 bg-gray-200 rounded-xl sm:rounded-2xl flex items-center justify-center text-zinc-800 text-2xl sm:text-3xl font-bold"
            >
              <input
                type="text"
                maxLength={1}
                className="w-full h-full bg-transparent text-center outline-none text-zinc-800 text-2xl sm:text-3xl font-bold"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Verify Button */}
      <button className="w-full h-12 sm:h-14 bg-emerald-700 hover:bg-emerald-800 transition-colors rounded-full shadow-md flex justify-center items-center">
        <span className="text-white text-base sm:text-lg font-medium">
          {t('verify')}
        </span>
      </button>

      <div className="flex flex-col items-center gap-1.5 text-center">
        <button className="text-emerald-700 text-sm sm:text-base font-semibold hover:underline">
          {t('sendAgain')}
        </button>
      </div>

      <Link
        href="/login"
        className="text-center text-emerald-700 text-sm sm:text-base font-semibold hover:underline"
      >
        {t('back')}
      </Link>
    </>
  );
}