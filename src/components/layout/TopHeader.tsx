import Image from 'next/image';
import { Bell, ChevronDown, Search } from 'lucide-react';

export function TopHeader() {
  return (
    <header className="flex w-full flex-wrap items-center gap-x-4 gap-y-3 rounded-xl bg-white px-4 py-3 sm:px-6 lg:h-[125px] lg:flex-nowrap lg:gap-x-6 lg:py-0">
      {/* Left items (single line on desktop, wraps on small screens): Search, Open, Cashier, Shift, Branch */}
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3 lg:flex-nowrap lg:justify-between lg:gap-x-5">
        {/* 1. Search */}
        <div className="flex h-[46px] shrink-0 items-center gap-2.5 rounded-[55px] bg-[#F2F2F2] px-4 sm:px-5">
          <Search size={24} className="shrink-0 text-[#989898]" />
          <span className="whitespace-nowrap font-satoshi text-[19px] font-medium leading-none text-[#989898] sm:inline">
            Search Task...
          </span>
        </div>

        {/* 2. Restaurant Open */}
        <div className="flex shrink-0 items-center gap-2">
          <span className="whitespace-nowrap text-[15px] leading-[21px] text-[#37CE2A]">Restaurant Open</span>
          <span className="inline-block h-[18px] w-[18px] rounded-full bg-[#37CE2A]" />
        </div>

        {/* 3. Current Cashier */}
        <div className="hidden items-center gap-2 md:flex">
          <span className="whitespace-nowrap text-[13px] leading-[21.5px] text-[#989898]">Current Cashier:</span>
          <span className="whitespace-nowrap text-[19px] font-medium leading-none text-[#2D2F33]">
            &quot;Sarah Jessie&quot;
          </span>
        </div>

        {/* 4. Shift Started */}
        <div className="hidden items-center gap-2 xl:flex">
          <span className="whitespace-nowrap text-[13px] leading-[21.5px] text-[#989898]">Shift Started at:</span>
          <span className="whitespace-nowrap text-[19px] font-medium leading-none text-[#2D2F33]">&quot;8:00 AM&quot;</span>
        </div>

        {/* 5. Branch selector */}
        <button className="flex h-[46px] shrink-0 items-center gap-1.5 rounded-[59px] border border-[#B9B9B9] bg-white px-4 sm:px-5">
          <span className="max-w-[130px] truncate whitespace-nowrap text-[19px] leading-none text-[#686868] sm:max-w-none">
            Dhanmondi (This Branch)
          </span>
          <ChevronDown size={14} className="shrink-0 text-[#686868]" />
        </button>
      </div>

      {/* Right block: bell + profile */}
      <div className="flex shrink-0 items-center gap-3 sm:gap-5 lg:ml-6">
        <button
          className="relative hidden h-12 w-12 items-center justify-center rounded-xl text-[#2D2F33] sm:flex"
          aria-label="Notifications"
        >
          <Bell size={24} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#E56767]" />
        </button>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative h-12 w-12 shrink-0 lg:h-[78px] lg:w-[78px]">
            <Image src="/images/avatar.png" alt="Sarah Jessie" fill priority sizes="78px" className="rounded-full object-cover" />
          </div>
          <div className="hidden lg:block">
            <p className="font-satoshi text-[27.65px] font-medium leading-[38.7px] text-[#2D2F33]">Sarah Jessie</p>
            <p className="font-satoshi text-[18.76px] font-medium leading-[26.3px] text-[#6E727A]">Sarah@gmail.com</p>
          </div>
        </div>
      </div>
    </header>
  );
}