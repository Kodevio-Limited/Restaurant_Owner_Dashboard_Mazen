import { Link } from '@/i18n/routing';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import AuthShell from '@/components/auth/AuthShell';
import { AuthHeader, AuthField, AuthInput, AuthButton } from '@/components/auth/AuthFields';

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('auth.login');

  return (
    <AuthShell
      photo="/images/figma/auth/signin.webp"
      photoAlt="Waiter taking an order at a restaurant table"
    >
      <div className="flex w-full flex-col gap-[clamp(32px,3.13vw,60.34px)]">
        <div className="flex w-full flex-col items-center gap-[clamp(36px,3.49vw,67px)]">
          <AuthHeader title={t('title')} subtitle={t('subtitle')} />

          <div className="flex w-full flex-col gap-[clamp(18px,1.57vw,30.223px)]">
            <AuthField label={t('emailLabel')}>
              <AuthInput
                icon="/images/figma/auth/mail.svg"
                placeholder={t('emailPlaceholder')}
                autoComplete="email"
              />
            </AuthField>

            <div className="flex w-full flex-col gap-[clamp(9px,0.79vw,15.112px)]">
              <AuthField label={t('passwordLabel')}>
                <AuthInput
                  icon="/images/figma/auth/lock.svg"
                  type="password"
                  placeholder={t('passwordPlaceholder')}
                  toggle
                  autoComplete="current-password"
                />
              </AuthField>
              <Link
                href="/forgot-password"
                className="self-end font-['Poppins'] text-[clamp(13px,0.94vw,18.134px)] font-semibold text-[#026F4F] hover:underline"
              >
                {t('forgotPassword')}
              </Link>
            </div>
          </div>
        </div>

        <Link href="/choose-branch" className="group flex w-full">
          <AuthButton>{t('signIn')}</AuthButton>
        </Link>
      </div>
    </AuthShell>
  );
}
