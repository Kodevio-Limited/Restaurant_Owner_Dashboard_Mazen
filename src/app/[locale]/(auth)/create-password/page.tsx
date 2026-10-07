import { Link } from '@/i18n/routing';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import AuthShell from '@/components/auth/AuthShell';
import { AuthHeader, AuthField, AuthInput, AuthButton } from '@/components/auth/AuthFields';

export default async function CreatePasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('auth.createPassword');

  return (
    <AuthShell
      photo="/images/figma/auth/create.webp"
      photoAlt="Friends sharing a meal at a restaurant"
    >
      <div className="flex w-full flex-col gap-[clamp(32px,3.13vw,60.34px)]">
        <div className="flex w-full flex-col items-center gap-[clamp(36px,3.49vw,67px)]">
          <AuthHeader title={t('title')} subtitle={t('subtitle')} />

          <div className="flex w-full flex-col gap-[clamp(18px,1.57vw,30.223px)]">
            <AuthField label={t('newPasswordLabel')}>
              <AuthInput
                icon="/images/figma/auth/lock.svg"
                type="password"
                placeholder={t('newPasswordPlaceholder')}
                toggle
                autoComplete="new-password"
              />
            </AuthField>

            <AuthField label={t('retypePasswordLabel')}>
              <AuthInput
                icon="/images/figma/auth/lock.svg"
                type="password"
                placeholder={t('retypePasswordPlaceholder')}
                toggle
                autoComplete="new-password"
              />
            </AuthField>
          </div>
        </div>

        <Link href="/login" className="group flex w-full">
          <AuthButton>{t('update')}</AuthButton>
        </Link>
      </div>
    </AuthShell>
  );
}
