import { Link } from '@/i18n/routing';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import AuthShell from '@/components/auth/AuthShell';
import { AuthHeader, AuthField, AuthInput, AuthButton } from '@/components/auth/AuthFields';

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('auth.forgotPassword');

  return (
    <AuthShell
      photo="/images/figma/auth/forgot.webp"
      photoAlt="Chef cooking with flames in a restaurant kitchen"
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
          </div>
        </div>

        <Link href="/verify-email" className="group flex w-full">
          <AuthButton>{t('getCode')}</AuthButton>
        </Link>
      </div>
    </AuthShell>
  );
}
