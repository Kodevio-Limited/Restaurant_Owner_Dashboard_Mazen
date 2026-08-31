import Image from 'next/image';
import { Bell, ChevronDown, Search } from 'lucide-react';

export function TopHeader() {
  return (
    <header className="flex w-full items-center gap-3 rounded-xl bg-white px-4 py-3 sm:px-6 lg:h-[88px] lg:flex-nowrap lg:gap-x-6 lg:py-0">
      {/* Left items */}
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3 lg:flex-nowrap lg:justify-between lg:gap-x-4">
        {/* Search */}
        <div className="flex h-[46px] shrink-0 items-center gap-2.5 rounded-[55px] bg-[#F2F2F2] px-4 sm:px-5">
          <Search size={24} className="shrink-0 text-[#989898]" />
          <span className="hidden whitespace-nowrap font-satoshi text-[19px] font-medium leading-none text-[#989898] sm:inline">
            Search Task...
          </span>
        </div>

        {/* Restaurant Open */}
        <div className="flex shrink-0 items-center gap-2">
          <span className="whitespace-nowrap text-[13px] leading-[21px] text-[#37CE2A] sm:text-[15px]">Restaurant Open</span>
          <span className="inline-block h-[14px] w-[14px] rounded-full bg-[#37CE2A] sm:h-[18px] sm:w-[18px]" />
        </div>

        {/* Branch selector */}
        <button className="flex h-[46px] shrink-0 items-center gap-1.5 rounded-[59px] border border-[#B9B9B9] bg-white px-4 sm:px-5">
          <span className="max-w-[100px] truncate whitespace-nowrap text-[15px] leading-none text-[#686868] sm:max-w-[130px] sm:text-[19px]">
            Dhanmondi
          </span>
          <ChevronDown size={14} className="shrink-0 text-[#686868]" />
        </button>
      </div>

      {/* Right block: bell + profile */}
      <div className="flex shrink-0 items-center gap-3 sm:gap-5">
        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-xl text-[#2D2F33] sm:h-12 sm:w-12"
          aria-label="Notifications"
        >
          <Bell size={22} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#E56767] sm:right-2 sm:top-2" />
        </button>

        <div className="relative h-10 w-10 shrink-0 sm:h-12 sm:w-12 lg:h-[78px] lg:w-[78px]">
          <Image src="/images/avatar.png" alt="Profile" fill priority sizes="78px" className="rounded-full object-cover" />
        </div>
      </div>
    </header>
  );
}
