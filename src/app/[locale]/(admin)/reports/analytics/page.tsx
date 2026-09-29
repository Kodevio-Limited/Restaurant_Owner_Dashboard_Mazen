import { setRequestLocale } from 'next-intl/server';
import { AnalyticsContent } from './AnalyticsContent';

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AnalyticsContent />;
}
