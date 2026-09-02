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
    <div className="flex w-full max-w-[320px] flex-col rounded-2xl bg-white pb-3">
      {/* Image */}
      <div className="relative mx-3 mt-3 aspect-[4/3] overflow-hidden rounded-xl bg-[#F2F2F2]">
        <Image src="/images/food-41e5d7.png" alt={item.name} fill sizes="(min-width:1280px) 25vw, (min-width:768px) 33vw, 50vw" className="object-cover" />
        <span className="absolute left-2 top-2 inline-flex items-center gap-3 rounded-md bg-[#026F4F] px-2 py-1 text-[10.5px] font-medium leading-4 text-white">
          {item.available ? 'AVAILABLE' : 'UNAVAILABLE'}
        </span>
      </div>

      {/* Info */}
      <div className="mx-3 mt-3 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-col gap-1">
            <h3 className="truncate font-satoshi text-[15px] font-medium leading-5 text-[#2D2F33]">{item.name}</h3>
            <p className="text-xs font-medium leading-4 text-[#686868]">{item.category}</p>
          </div>
          <span className="shrink-0 text-base font-semibold leading-5 text-[#026F4F]">{item.price}</span>
        </div>
        <p className="line-clamp-2 text-xs font-normal leading-4 text-[#989898]">{item.description}</p>
      </div>

      {/* Divider */}
      <div className="mx-2 mt-2.5 border-t border-[#E9E9E9]" />

      {/* Actions */}
      <div className="mx-3 mt-3 flex items-center justify-between">
        {/* Toggle */}
        <div className="relative h-6 w-11 cursor-pointer">
          <span
            className={`absolute inset-0 rounded-full transition-colors ${
              item.available ? 'bg-[#026F4F]' : 'bg-[#D9D9D9]'
            }`}
          />
          <span
            className={`absolute top-[3px] h-[17px] w-[17px] rounded-full bg-white transition-transform ${
              item.available ? 'left-[24px]' : 'left-[3px]'
            }`}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label="Edit"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E9E9E9] outline outline-1 outline-[#B9B9B9] text-[#686868] transition-colors hover:bg-[#DcDcDc]"
          >
            <Pencil size={15} />
          </button>
          <button
            aria-label="Delete"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E85E5E] text-white transition-colors hover:bg-[#d94a4a]"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
