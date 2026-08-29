import { ReactNode } from 'react';
import { TrendingUp } from 'lucide-react';

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
}

export function StatCard({ label, value, unit, sub, icon }: StatCardProps) {
  return (
    <div className="relative flex min-h-[169px] w-full flex-1 flex-col justify-center gap-3 rounded-xl bg-white px-5 py-4">
      <span className="text-[19px] font-medium text-[#686868]">{label}</span>

      <div className="flex items-end gap-1">
        <span className="text-[40px] font-semibold leading-none text-[#000000]">{value}</span>
        {unit && <span className="mb-1 text-[25px] font-medium leading-none text-[#989898]">{unit}</span>}
      </div>

      {sub && (
        <div className="flex items-center gap-2.5">
          {typeof sub === 'string' ? (
            <span className="text-base text-[#989898]">{sub}</span>
          ) : (
            <>
              <TrendingUp size={20} className={sub.positive ? 'text-[#158F15]' : 'text-[#E56767]'} />
              <span className={sub.positive ? 'text-base text-[#158F15]' : 'text-base text-[#E56767]'}>
                {sub.text}
              </span>
            </>
          )}
        </div>
      )}

      <div className="absolute right-5 top-[18px] flex h-[42px] w-[45px] items-center justify-center rounded-md bg-[#E9E9E9] text-[#2D2F33]">
        {icon}
      </div>
    </div>
  );
}