import { Mail } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { setRequestLocale, getTranslations } from 'next-intl/server';

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('auth.forgotPassword');

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

      <div className="w-full flex flex-col items-start gap-5 sm:gap-6">
        {/* Email */}
        <div className="w-full flex flex-col items-start gap-2">
          <label className="text-zinc-800 text-base sm:text-xl font-medium">
            {t('emailLabel')}
          </label>
          <div className="w-full h-12 sm:h-14 px-4 bg-gray-200 rounded-full inline-flex items-center gap-3">
            <Mail className="w-5 h-5 text-neutral-400 shrink-0" />
            <input
              type="email"
              placeholder={t('emailPlaceholder')}
              className="flex-1 bg-transparent text-sm sm:text-base text-zinc-800 placeholder:text-neutral-400 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Send Code Button */}
      <button className="w-full h-12 sm:h-14 bg-emerald-700 hover:bg-emerald-800 transition-colors rounded-full shadow-md flex justify-center items-center">
        <span className="text-white text-base sm:text-lg font-medium">
          {t('getCode')}
        </span>
      </button>

      <Link
        href="/login"
        className="text-center text-emerald-700 text-sm sm:text-base font-semibold hover:underline"
      >
        {t('backToSignIn')}
      </Link>
    </>
  );
}