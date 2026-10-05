'use client';

import { useState, useEffect } from 'react';
import { usePathname } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
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
  Package,
} from 'lucide-react';
import { LanguageToggle } from './LanguageToggle';

const NAV_KEYS = [
  { id: 'orders',   icon: Receipt,   href: '/orders' },
  { id: 'menu',     icon: Utensils,  href: '/menu' },
  { id: 'inventory',icon: Package,   href: '/inventory' },
  { id: 'tables',   icon: LayoutGrid,href: '/tables' },
  { id: 'staff',    icon: Users,     href: '/staff' },
  { id: 'reports',  icon: BarChart3, href: '/reports/analytics' },
  { id: 'settings', icon: Settings,  href: '/settings' },
  { id: 'billing',  icon: DollarSign,href: '/billing' },
] as const;

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
  const t = useTranslations('nav');

  return (
    <nav className={cn('flex flex-col', showLabels ? 'gap-1 px-3' : 'items-center gap-2 px-2')}>
      {NAV_KEYS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href.replace(/\/?$/, ''));
        // href is never '#' in current NAV_KEYS; '#' guard was for old placeholder entries
        const Icon = item.icon;
        const label = t(item.id as any);
        return (
          <Link
            key={item.id}
            href={item.href}
            title={label}
            onClick={onNavigate}
            className={cn(
              'group relative flex items-center transition-colors',
              showLabels
                ? 'gap-2.5 py-0.5 ps-1 pe-3'
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
                {label}
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
  const t = useTranslations('nav');

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="fixed start-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#2D2F33] shadow lg:hidden"
        aria-label={t('openMenu')}
      >
        <Menu size={22} />
      </button>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          'fixed start-4 top-4 z-30 hidden h-[calc(100vh-32px)] flex-col overflow-hidden rounded-xl bg-white shadow-[1px_0_6.6px_rgba(0,0,0,0.08)] transition-[width] duration-300 lg:flex',
          collapsed ? 'w-[76px]' : 'w-[220px]',
        )}
      >
        {/* Brand row */}
        <div className={cn('flex items-center', collapsed ? 'flex-col gap-2 py-4' : 'justify-between py-4 ps-4 pe-3')}>
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
              aria-label={t('expandSidebar')}
            >
              <Menu size={18} />
            </button>
          ) : (
            <button
              onClick={onToggleCollapsed}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#989898] transition-colors hover:bg-[#F2F2F2] hover:text-[#2D2F33]"
              aria-label={t('collapseSidebar')}
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
            title={t('logout')}
            className={cn(
              'flex items-center transition-colors',
              collapsed
                ? 'h-[44px] w-[44px] justify-center rounded-full text-[#E22A2A] hover:bg-[#FDECEC]'
                : 'gap-2.5 rounded-full py-1.5 ps-1.5 pe-4 text-[14px] text-[#E22A2A] hover:bg-[#FDECEC]',
            )}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full">
              <LogOut size={20} strokeWidth={1.8} />
            </span>
            {!collapsed && <span className="whitespace-nowrap font-medium">{t('logout')}</span>}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute start-4 top-4 animate-in">
            <button
              onClick={() => setOpen(false)}
              className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#2D2F33] shadow"
              aria-label={t('closeMenu')}
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
              {/* Language toggle inside mobile menu */}
              <div className="px-5 pb-3">
                <LanguageToggle />
              </div>
              <div className="flex-1 overflow-y-auto">
                <NavItems showLabels onNavigate={() => setOpen(false)} />
              </div>
              <div className="border-t border-[#F2F2F2] px-3 py-2.5">
                <button className="flex items-center gap-2.5 rounded-full py-1.5 ps-1.5 pe-4 text-[14px] text-[#E22A2A] hover:bg-[#FDECEC]">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full">
                    <LogOut size={20} strokeWidth={1.8} />
                  </span>
                  <span className="whitespace-nowrap font-medium">{t('logout')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
