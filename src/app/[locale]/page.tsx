import { redirect } from '@/i18n/routing';

export default async function LocaleHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Locale-aware redirect: keeps /ar on the Arabic page (as-needed prefix
  // drops /en for the default locale automatically). The Orders tab is the
  // default landing page once the dashboard guard lets you in.
  redirect({ href: '/orders', locale });
}
