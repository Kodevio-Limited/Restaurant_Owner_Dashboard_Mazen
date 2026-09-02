'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopHeader } from '@/components/layout/TopHeader';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#F2F2F2]">
      <Sidebar collapsed={collapsed} onToggleCollapsed={() => setCollapsed((c) => !c)} />
      <div
        className={cn(
          'flex flex-col gap-4 px-3 pb-8 pt-16 transition-[margin-left] duration-300 sm:px-4 xl:pt-4',
          collapsed ? 'xl:ml-[108px]' : 'xl:ml-[252px]',
        )}
      >
        <TopHeader />
        {children}
      </div>
    </div>
  );
}