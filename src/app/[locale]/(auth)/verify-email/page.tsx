import { Link } from '@/i18n/routing';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import AuthShell from '@/components/auth/AuthShell';
import { AuthHeader, AuthButton } from '@/components/auth/AuthFields';

export default async function VerifyEmailPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('auth.verifyEmail');

  return (
    <AuthShell
      photo="/images/figma/auth/signin.webp"
      photoAlt="Waiter taking an order at a restaurant table"
    >
      <div className="flex w-full flex-col gap-[clamp(32px,3.13vw,60.34px)]">
        <div className="flex w-full flex-col items-center gap-[clamp(36px,3.49vw,67px)]">
          <AuthHeader title={t('title')} subtitle={t('subtitle')} />

          <div className="flex w-full flex-col items-center gap-[clamp(14px,1.57vw,30.223px)]">
            <div className="flex flex-wrap items-center justify-center gap-[clamp(8px,1.04vw,20px)]" dir="ltr">
              {Array.from({ length: 6 }).map((_, i) => (
                <input
                  key={i}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  aria-label={`Digit ${i + 1}`}
                  className="h-[clamp(56px,5.73vw,110px)] w-[clamp(44px,4.32vw,83px)] rounded-[clamp(12px,1.15vw,22px)] bg-[#E9E9E9] text-center font-['Satoshi'] text-[clamp(20px,1.88vw,36px)] font-bold text-[#2D2F33] outline-none focus:ring-2 focus:ring-[#026F4F]"
                />
              ))}
            </div>
            <button
              type="button"
              className="font-['Satoshi'] text-[clamp(13px,0.94vw,18.134px)] font-semibold text-[#026F4F] hover:underline"
            >
              {t('sendAgain')}
            </button>
          </div>
        </div>

        <Link href="/create-password" className="group flex w-full">
          <AuthButton>{t('verify')}</AuthButton>
        </Link>

        <Link
          href="/login"
          className="text-center font-['Satoshi'] text-[clamp(13px,0.94vw,18.134px)] font-semibold text-[#026F4F] hover:underline"
        >
          {t('back')}
        </Link>
      </div>
    </AuthShell>
  );
}
