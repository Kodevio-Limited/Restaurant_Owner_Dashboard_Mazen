'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopHeader } from '@/components/layout/TopHeader';
import { cn } from '@/lib/utils';
import { getAuthSession, subscribeAuthSession } from '@/lib/auth-session';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  // Auth gate: without a session every dashboard route sends you to /login.
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const check = () => {
      if (!getAuthSession()) {
        router.replace('/login');
        return;
      }
      setAuthReady(true);
    };
    check();
    return subscribeAuthSession(check);
  }, [router]);

  if (!authReady) return <div className="h-screen bg-[#F2F2F2]" />;

  return (
    <div className="h-screen overflow-hidden bg-[#F2F2F2]">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((c) => !c)}
        onNavigate={() => setCollapsed(true)}
      />
      <div
        className={cn(
          'flex h-full flex-col gap-4 px-3 transition-[margin-inline-start] duration-300 sm:px-4',
          collapsed ? 'lg:ms-[108px]' : 'lg:ms-[252px]',
        )}
      >
        {/* Pinned header — outside the scroll area so it stays visible on every page */}
        <div className="shrink-0 pt-16 lg:pt-4">
          <TopHeader />
        </div>
        <div id="admin-main-scroll" className="min-h-0 flex-1 overflow-y-auto scroll-smooth pb-20">
          {children}
        </div>
      </div>
    </div>
  );
}