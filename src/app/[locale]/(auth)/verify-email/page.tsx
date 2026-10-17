import { Link } from '@/i18n/routing';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import AuthShell from '@/components/auth/AuthShell';
import { AuthHeader, AuthButton } from '@/components/auth/AuthFields';
import { OtpInputs } from '@/components/auth/OtpInputs';

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
      photo="/images/figma/auth/verify.webp"
      photoAlt="A dining table set with a feast of dishes"
    >
      <div className="flex w-full flex-col gap-[clamp(32px,3.13vw,60.34px)]">
        <div className="flex w-full flex-col items-center gap-[clamp(36px,3.49vw,67px)]">
          <AuthHeader title={t('title')} subtitle={t('subtitle')} />

          <div className="flex w-full flex-col gap-[clamp(12px,1.57vw,30.17px)]">
            {/* Verify OTP — Figma 1999:2651: green label + 6 boxes (86.41/88.41×96.342) */}
            <div className="flex w-full flex-col gap-[clamp(7px,0.63vw,12.089px)]">
              <span className="font-satoshi text-[clamp(17px,1.5vw,28.712px)] font-medium leading-[1.4] text-[#026F4F]">
                {t('otpLabel')}
              </span>
              <OtpInputs />
            </div>

            {/* Send again — end-aligned under the boxes (#026F4F), i.e. right in
                English and left in Arabic (logical alignment). */}
            <button
              type="button"
              className="w-full text-end font-satoshi text-[clamp(13px,0.94vw,18.134px)] font-semibold leading-[1.4] text-[#026F4F] hover:underline"
            >
              {t('sendAgain')}
            </button>
          </div>
        </div>

        <Link href="/create-password" className="group flex w-full">
          <AuthButton>{t('verify')}</AuthButton>
        </Link>
      </div>
    </AuthShell>
  );
}
