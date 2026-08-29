import Image from 'next/image';
import { Pencil, Trash2 } from 'lucide-react';

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  available: boolean;
}

export function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <div className="flex w-[320px] flex-col rounded-3xl bg-white pb-4">
      {/* Image */}
      <div className="relative mx-[14.64px] mt-[14.64px] h-[256px] overflow-hidden rounded-xl bg-[#F2F2F2]">
        <Image src="/images/food-41e5d7.png" alt={item.name} fill sizes="288px" className="object-cover" />
        <span className="absolute left-[9px] top-[10px] inline-flex items-center gap-3 rounded-lg bg-[#026F4F] px-3 py-2.5 text-sm font-medium leading-5 text-white">
          {item.available ? 'AVAILABLE' : 'UNAVAILABLE'}
        </span>
      </div>

      {/* Info */}
      <div className="mx-[14.64px] mt-5 flex w-[288px] flex-col gap-3.5">
        <div className="flex items-start justify-between">
          <div className="flex w-[144px] flex-col gap-2">
            <h3 className="font-satoshi text-xl font-medium leading-7 text-[#2D2F33]">{item.name}</h3>
            <p className="text-sm font-medium leading-5 text-[#686868]">{item.category}</p>
          </div>
          <span className="text-2xl font-semibold leading-8 text-[#026F4F]">{item.price}</span>
        </div>
        <p className="text-sm font-normal leading-5 text-[#989898]">{item.description}</p>
      </div>

      {/* Divider */}
      <div className="mx-[11.26px] mt-3 border-t border-[#989898]" />

      {/* Actions */}
      <div className="mx-[14.64px] mt-4 flex items-center justify-between">
        {/* Toggle */}
        <div className="relative h-7 w-14 cursor-pointer">
          <span
            className={`absolute inset-0 rounded-full transition-colors ${
              item.available ? 'bg-[#026F4F]' : 'bg-[#D9D9D9]'
            }`}
          />
          <span
            className={`absolute top-[3.94px] h-5 w-5 rounded-full bg-white transition-transform ${
              item.available ? 'left-[31.52px]' : 'left-[3.94px]'
            }`}
          />
        </div>

        <div className="flex items-center gap-3.5">
          <button
            aria-label="Edit"
            className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#E9E9E9] outline outline-1 outline-[#B9B9B9] text-[#686868] transition-colors hover:bg-[#DcDcDc]"
          >
            <Pencil size={24} />
          </button>
          <button
            aria-label="Delete"
            className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#E85E5E] text-white transition-colors hover:bg-[#d94a4a]"
          >
            <Trash2 size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}