import { ReactNode } from 'react';
import { Link } from '@/i18n/routing';
import { ArrowUpRight, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatSub {
  text: string;
  positive?: boolean;
}

interface StatCardProps {
  label: string;
  value: ReactNode;
  unit?: ReactNode;
  sub?: StatSub | string;
  icon: ReactNode;
  action?: { label: string; href?: string; onClick?: () => void };
}

export function StatCard({ label, value, unit, sub, icon, action }: StatCardProps) {
  return (
    <div className="relative flex min-h-[104px] w-full flex-1 flex-col justify-center gap-2 rounded-xl bg-white px-4 py-3 xl:min-h-[118px]">
      <span className="pe-9 text-[13px] font-medium leading-snug text-[#686868]">{label}</span>

      <div className="flex items-end gap-1">
        <span className="text-[24px] font-semibold leading-none text-[#000000] xl:text-[28px]">{value}</span>
        {unit && <span className="mb-0.5 text-[15px] font-medium leading-none text-[#989898]">{unit}</span>}
      </div>

      {sub && (
        <div className={cn('flex items-center gap-1.5', action && 'pe-20')}>
          {typeof sub === 'string' ? (
            <span className="text-[12px] leading-snug text-[#989898]">{sub}</span>
          ) : (
            <>
              <TrendingUp size={14} className={sub.positive ? 'text-[#158F15]' : 'text-[#E56767]'} />
              <span className={`text-[12px] leading-snug ${sub.positive ? 'text-[#158F15]' : 'text-[#E56767]'}`}>
                {sub.text}
              </span>
            </>
          )}
        </div>
      )}

      <div className="absolute end-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-[#E9E9E9] text-[#2D2F33] [&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </div>

      {action && (action.href ? (
        <Link
          href={action.href}
          className="absolute bottom-3 end-3 inline-flex items-center gap-1 rounded-full bg-[rgba(53,140,114,0.12)] px-3 py-1.5 text-[12px] font-medium text-[#026F4F] transition-colors hover:bg-[rgba(53,140,114,0.22)]"
        >
          <span>{action.label}</span>
          <ArrowUpRight size={13} className="rtl:scale-x-[-1]" />
        </Link>
      ) : (
        <button
          onClick={action.onClick}
          className="absolute bottom-3 end-3 inline-flex items-center gap-1 rounded-full bg-[rgba(53,140,114,0.12)] px-3 py-1.5 text-[12px] font-medium text-[#026F4F] transition-colors hover:bg-[rgba(53,140,114,0.22)]"
        >
          <span>{action.label}</span>
          <ArrowUpRight size={13} className="rtl:scale-x-[-1]" />
        </button>
      ))}
    </div>
  );
}
