import type { Metadata } from 'next';
import { getMessages } from 'next-intl/server';

type Messages = Record<string, unknown>;

function pick(messages: Messages, path: string): string | undefined {
  return path
    .split('.')
    .reduce<unknown>((node, key) => (node && typeof node === 'object' ? (node as Messages)[key] : undefined), messages) as string | undefined;
}

/** Localized title/description from `meta.<namespace>` + hreflang alternates. */
export async function routeMetadata(
  locale: string,
  namespace: string,
): Promise<Metadata> {
  const messages = (await getMessages()) as Messages;
  const title = pick(messages, `meta.${namespace}.title`) ?? 'Restaurant Ecosystem';
  const description = pick(messages, `meta.${namespace}.description`) ?? '';

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${namespace === 'analytics' ? '/reports/analytics' : ''}`,
      languages: {
        en: `/en`,
        ar: `/ar`,
      },
    },
  };
}
