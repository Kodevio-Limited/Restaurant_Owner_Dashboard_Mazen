// Root layout — minimal pass-through. Real layout lives in [locale]/layout.tsx.
// This exists only to satisfy Next.js App Router's requirement that every page
// (including the root redirect page) has a root layout. The [locale] layout
// below it renders the actual <html lang dir>.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
