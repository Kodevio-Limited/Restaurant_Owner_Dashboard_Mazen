'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  Receipt,
  Utensils,
  LayoutGrid,
  Users,
  BarChart3,
  Settings,
  DollarSign,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'orders', label: 'Orders', icon: Receipt, href: '/orders' },
  { id: 'menu', label: 'Menu', icon: Utensils, href: '/menu' },
  { id: 'tables', label: 'Tables', icon: LayoutGrid, href: '/tables' },
  { id: 'staff', label: 'Staff', icon: Users, href: '/staff' },
  { id: 'reports', label: 'Reports', icon: BarChart3, href: '/reports/analytics' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
  { id: 'billing', label: 'Billing', icon: DollarSign, href: '/billing' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

function NavItems({
  showLabels,
  onNavigate,
}: {
  showLabels: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className={cn('flex flex-col', showLabels ? 'gap-1 px-3' : 'items-center gap-2 px-2')}>
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href || (item.href !== '#' && pathname.startsWith(item.href.replace(/\/?$/, '')));
        const Icon = item.icon;
        return (
          <Link
            key={item.id}
            href={item.href}
            title={item.label}
            onClick={onNavigate}
            className={cn(
              'group relative flex items-center transition-colors',
              showLabels
                ? 'gap-2.5 py-0.5 pl-1 pr-3'
                : 'h-[44px] w-[44px] justify-center',
            )}
          >
            <span
              className={cn(
                'flex shrink-0 items-center justify-center rounded-full transition-all duration-200',
                showLabels ? 'h-10 w-10' : 'h-[44px] w-[44px]',
                active
                  ? 'bg-[#026F4F] text-white shadow-md'
                  : 'text-[#989898] group-hover:bg-[#F2F2F2] group-hover:text-[#2D2F33]',
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
            </span>
            {showLabels && (
              <span
                className={cn(
                  'whitespace-nowrap text-[15px] font-medium',
                  active ? 'text-[#026F4F]' : 'text-[#989898]',
                )}
              >
                {item.label}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar({ collapsed, onToggleCollapsed }: SidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#2D2F33] shadow xl:hidden"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          'fixed left-4 top-4 z-30 hidden h-[calc(100vh-32px)] flex-col overflow-hidden rounded-xl bg-white shadow-[1px_0_6.6px_rgba(0,0,0,0.08)] transition-[width] duration-300 xl:flex',
          collapsed ? 'w-[76px]' : 'w-[220px]',
        )}
      >
        {/* Brand row */}
        <div className={cn('flex items-center', collapsed ? 'flex-col gap-2 py-4' : 'justify-between py-4 pl-4 pr-3')}>
          <Link href="#" className={cn('relative shrink-0', collapsed ? 'h-[26px] w-[42px]' : 'h-[28px] w-[148px]')}>
            <Image
              src="/images/logo-69e842.png"
              alt="Restaurant logo"
              fill
              priority
              sizes={collapsed ? '42px' : '148px'}
              className="object-contain"
            />
          </Link>
          {collapsed ? (
            <button
              onClick={onToggleCollapsed}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#989898] transition-colors hover:bg-[#F2F2F2] hover:text-[#2D2F33]"
              aria-label="Expand sidebar"
            >
              <Menu size={18} />
            </button>
          ) : (
            <button
              onClick={onToggleCollapsed}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#989898] transition-colors hover:bg-[#F2F2F2] hover:text-[#2D2F33]"
              aria-label="Collapse sidebar"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Nav */}
        <div className={cn('flex-1 overflow-y-auto', collapsed ? 'mt-1' : 'mt-2')}>
          <NavItems showLabels={!collapsed} />
        </div>

        {/* Logout */}
        <div className={cn('border-t border-[#F2F2F2] py-2.5', collapsed ? 'flex justify-center' : 'px-3')}>
          <button
            title="Log Out"
            className={cn(
              'flex items-center transition-colors',
              collapsed
                ? 'h-[44px] w-[44px] justify-center rounded-full text-[#989898] hover:bg-[#FFE6E6] hover:text-[#E56767]'
                : 'gap-2.5 rounded-full py-1.5 pl-1.5 pr-4 text-[14px] text-[#989898] hover:bg-[#FFE6E6] hover:text-[#E56767]',
            )}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full">
              <LogOut size={20} strokeWidth={1.8} />
            </span>
            {!collapsed && <span className="whitespace-nowrap font-medium">Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile overlay (always shows labels) */}
      {open && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-4 top-4 animate-in">
            <button
              onClick={() => setOpen(false)}
              className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#2D2F33] shadow"
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
            <div className="flex h-[calc(100vh-100px)] w-[244px] flex-col overflow-hidden rounded-xl bg-white py-4 shadow">
              <div className="flex items-center gap-3 px-5 pb-3">
                <div className="relative h-[26px] w-[138px]">
                  <Image
                    src="/images/logo-69e842.png"
                    alt="Restaurant logo"
                    fill
                    priority
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                <NavItems showLabels onNavigate={() => setOpen(false)} />
              </div>
              <div className="border-t border-[#F2F2F2] px-3 py-2.5">
                <button className="flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-4 text-[14px] text-[#989898] hover:bg-[#FFE6E6] hover:text-[#E56767]">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full">
                    <LogOut size={20} strokeWidth={1.8} />
                  </span>
                  <span className="whitespace-nowrap font-medium">Log Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
