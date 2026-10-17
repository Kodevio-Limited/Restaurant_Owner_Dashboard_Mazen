'use client';

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

// Figma 1594:1728 — four 434×441 cards, gap 26 (4×434 + 3×26 = 1814 = the row
// width). The row is a 4-column grid so every viewport shows 4 branches per row
// and any extra ones wrap underneath; each card scales with its column via
// container-query units, so the internals stay proportional to the 434px design
// on iPad widths instead of clipping.
const CARD_BASE = 434; // Figma card width — every card value below is px/434*100cqw

/** px at the 434px design width → container-query percent of the card. */
const c = (px: number) => `${((px / CARD_BASE) * 100).toFixed(4)}cqw`;

export function BranchCards({ branches, isArabic, revenueLabel }: BranchCardsProps) {
  const router = useRouter();

  function handleSelect(id: number) {
    // Picking a branch drops the owner straight on the default tab (Orders).
    void id;
    router.push('/orders');
  }

  return (
    <div className="grid max-w-[1814px] grid-cols-4 gap-[26px] max-sm:grid-cols-2">
      {branches.map((branch) => (
        <button
          key={branch.id}
          type="button"
          onClick={() => handleSelect(branch.id)}
          style={{ containerType: 'inline-size' }}
          className="group relative aspect-[434/441] overflow-hidden text-start"
        >
          {/* Skin lives on a child: an element cannot size itself with its own
              container units (they'd resolve against the viewport), so the card's
              radius/background/border are painted by this layer instead. */}
          <span
            className={`absolute inset-0 rounded-[4.6631cqw] border transition-colors ${
              branch.id === branches[0]?.id
                ? 'border-[#026F4F] bg-[#E6F1ED]'
                : 'border-transparent bg-white group-hover:border-[#B1D2C8]'
            }`}
          />

          {/* Shop icon — Figma 1594:1638 (62×62 at 25,19) */}
          <span
            className={`absolute left-[5.7604cqw] top-[4.3779cqw] flex size-[14.2857cqw] items-center justify-center rounded-[1.1521cqw] ${
              branch.id === branches[0]?.id ? 'bg-[#B1D2C8]' : 'bg-[#E6F1ED]'
            }`}
          >
            <Image
              src="/images/figma/auth/shop.svg"
              alt=""
              aria-hidden="true"
              width={33}
              height={34}
              className="h-[7.8571cqw] w-[7.6037cqw]"
            />
          </span>

          {/* Figma absolute anchors: name block bottom 174.31, divider bottom
              132.01 (406.286 wide), revenue row bottom 22.01 */}
          <div className="absolute bottom-[40.1636cqw] left-[6.5714cqw] flex w-[61.4855cqw] flex-col gap-[8.295cqw]">
            <p className="text-[6.6926cqw] font-medium leading-[1.4] text-black">
              {isArabic ? branch.name_ar : branch.name}
            </p>
            <div className="flex flex-col gap-[6.4516cqw]">
              <span className="flex items-center gap-[2.5226cqw]">
                <span className="flex size-[7.5675cqw] shrink-0 items-center justify-center">
                  <Image
                    src="/images/figma/auth/call.svg"
                    alt=""
                    aria-hidden="true"
                    width={33}
                    height={33}
                    className="size-[7.5675cqw]"
                  />
                </span>
                <span dir="ltr" className="whitespace-nowrap text-[5.045cqw] font-normal leading-[1.4] text-[#989898]">
                  +01284980
                </span>
              </span>
              <span className="flex items-center gap-[2.5226cqw]">
                <span className="flex size-[7.5675cqw] shrink-0 items-center justify-center">
                  <Image
                    src="/images/figma/auth/location.svg"
                    alt=""
                    aria-hidden="true"
                    width={24}
                    height={30}
                    className="h-[6.8295cqw] w-[5.5184cqw]"
                  />
                </span>
                <span className="whitespace-nowrap text-[5.045cqw] font-normal leading-[1.4] text-[#989898]">
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
            className="absolute bottom-[30.4171cqw] left-[3.1935cqw] h-px w-[93.6143cqw]"
          />

          <div className="absolute bottom-[5.0714cqw] left-[6.5691cqw] flex w-[86.8664cqw] items-center justify-between">
            <span className="flex w-[38.2488cqw] flex-col gap-[3.6866cqw]">
              <span className="whitespace-nowrap text-[4.8387cqw] font-normal leading-[1.4] text-[#989898]">
                {revenueLabel}
              </span>
              <span className="text-[6.9124cqw] font-semibold leading-[1.4] text-[#026F4F]">
                $15.99
              </span>
            </span>
            <Image
              src="/images/figma/auth/arrow.svg"
              alt=""
              aria-hidden="true"
              width={18}
              height={36}
              className="h-[8.295cqw] w-[4.1475cqw] shrink-0 rtl:scale-x-[-1]"
            />
          </div>
        </button>
      ))}
    </div>
  );
}
