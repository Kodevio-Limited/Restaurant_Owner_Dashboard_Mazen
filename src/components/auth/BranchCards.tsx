'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from '@/i18n/routing';

export interface Branch {
  id: number;
  name: string;
  name_ar: string;
  address: string;
  address_ar: string;
}

interface BranchCardsProps {
  branches: Branch[];
  isArabic: boolean;
  revenueLabel: string;
}

// Figma 1594:1493 — 434×441 cards, rounded-[20.238px], gap 26. First card is
// shown selected (#E6F1ED + #026F4F border); clicking the selected card
// enters the branch.
export function BranchCards({ branches, isArabic, revenueLabel }: BranchCardsProps) {
  const [selected, setSelected] = useState(branches[0]?.id);
  const router = useRouter();

  function handleSelect(id: number) {
    if (id === selected) {
      router.push('/reports/analytics');
    } else {
      setSelected(id);
    }
  }

  return (
    <div className="flex flex-wrap items-stretch justify-center gap-[26px]">
      {branches.map((branch) => {
        const active = branch.id === selected;
        return (
          <button
            key={branch.id}
            type="button"
            onClick={() => handleSelect(branch.id)}
            className={`relative h-[441px] w-[434px] shrink-0 overflow-hidden rounded-[20.238px] text-start transition-colors ${
              active
                ? 'border border-[#026F4F] bg-[#E6F1ED]'
                : 'border border-transparent bg-white hover:border-[#B1D2C8]'
            }`}
          >
            {/* Shop icon — Figma 1594:1638 */}
            <span
              className={`absolute left-6 top-[18px] flex size-[62px] items-center justify-center rounded-[5px] ${
                active ? 'bg-[#B1D2C8]' : 'bg-[#E6F1ED]'
              }`}
            >
              <Image
                src="/images/figma/auth/shop.svg"
                alt=""
                aria-hidden="true"
                width={33}
                height={34}
                className="h-[34.1px] w-[33px]"
              />
            </span>

            {/* Figma absolute anchors: name block bottom 174.31, divider bottom
                132.01 (w 406.286 centered), revenue row bottom 22.01 */}
            <div className="absolute bottom-[174.31px] left-[28.52px] flex w-[266.847px] flex-col gap-[36px]">
              <p className="text-[29.046px] font-medium leading-[1.4] text-black">
                {isArabic ? branch.name_ar : branch.name}
              </p>
              <div className="flex flex-col gap-[28px]">
                <span className="flex items-center gap-[10.948px]">
                  <span className="flex size-[32.843px] shrink-0 items-center justify-center">
                    <Image
                      src="/images/figma/auth/call.svg"
                      alt=""
                      aria-hidden="true"
                      width={33}
                      height={33}
                      className="size-[32.843px]"
                    />
                  </span>
                  <span className="whitespace-nowrap text-[21.895px] font-normal leading-[1.4] text-[#989898]">
                    +01284980
                  </span>
                </span>
                <span className="flex items-center gap-[10.948px]">
                  <span className="flex size-[32.843px] shrink-0 items-center justify-center">
                    <Image
                      src="/images/figma/auth/location.svg"
                      alt=""
                      aria-hidden="true"
                      width={24}
                      height={30}
                      className="h-[29.64px] w-[23.95px]"
                    />
                  </span>
                  <span className="whitespace-nowrap text-[21.895px] font-normal leading-[1.4] text-[#989898]">
                    {isArabic ? branch.address_ar : branch.address}
                  </span>
                </span>
              </div>
            </div>

            <Image
              src="/images/figma/auth/divider.svg"
              alt=""
              aria-hidden="true"
              width={407}
              height={1}
              className="absolute bottom-[132.01px] left-[13.86px] h-px w-[406.286px]"
            />

            <div className="absolute bottom-[22.01px] left-[28.51px] flex w-[377px] items-center justify-between">
              <span className="flex w-[166px] flex-col gap-[16px]">
                <span className="text-[21px] font-normal leading-[1.4] text-[#989898]">
                  {revenueLabel}
                </span>
                <span className="text-[30px] font-semibold leading-[1.4] text-[#026F4F]">
                  $15.99
                </span>
              </span>
              <Image
                src="/images/figma/auth/arrow.svg"
                alt=""
                aria-hidden="true"
                width={18}
                height={36}
                className="h-[36px] w-[18px] shrink-0 rtl:scale-x-[-1]"
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}
