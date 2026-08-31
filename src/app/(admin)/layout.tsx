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
          'flex flex-col gap-5 px-4 pb-10 pt-20 transition-[margin-left] duration-300 lg:pt-5',
          collapsed ? 'lg:ml-[108px]' : 'lg:ml-[260px]',
        )}
      >
        <TopHeader />
        {children}
      </div>
    </div>
  );
}