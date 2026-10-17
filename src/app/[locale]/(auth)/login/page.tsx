'use client';

import { useState } from 'react';
import { Link, useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import AuthShell from '@/components/auth/AuthShell';
import { AuthHeader, AuthField, AuthInput, AuthButton } from '@/components/auth/AuthFields';
import { setAuthSession } from '@/lib/auth-session';

export default function LoginPage() {
  const t = useTranslations('auth.login');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Mock auth: any non-empty credentials sign the owner in.
    setAuthSession(email.trim());
    // Default landing page after login is the Orders tab.
    router.push('/orders');
  }

  return (
    <AuthShell
      photo="/images/figma/auth/signin.webp"
      photoAlt="Waiter taking an order at a restaurant table"
    >
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-[clamp(32px,3.13vw,60.34px)]"
      >
        <div className="flex w-full flex-col items-center gap-[clamp(36px,3.49vw,67px)]">
          <AuthHeader title={t('title')} subtitle={t('subtitle')} />

          <div className="flex w-full flex-col gap-[clamp(18px,1.57vw,30.223px)]">
            <AuthField label={t('emailLabel')}>
              <AuthInput
                icon="/images/figma/auth/mail.svg"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={t('emailPlaceholder')}
                autoComplete="email"
              />
            </AuthField>

            <div className="flex w-full flex-col gap-[clamp(9px,0.79vw,15.112px)]">
              <AuthField label={t('passwordLabel')}>
                <AuthInput
                  icon="/images/figma/auth/lock.svg"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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

        <button type="submit" className="group flex w-full">
          <AuthButton>{t('signIn')}</AuthButton>
        </button>
      </form>
    </AuthShell>
  );
}
