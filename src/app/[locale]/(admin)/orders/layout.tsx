import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { routeMetadata } from '@/lib/routeMetadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return routeMetadata(locale, 'orders');
}

export default async function OrdersLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return children;
}
