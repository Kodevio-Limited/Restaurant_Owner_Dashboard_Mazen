import { Store, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const branches = [
  {
    id: 1,
    name: 'Main Branch',
    address: '123 Restaurant Street, Downtown',
  },
  {
    id: 2,
    name: 'Branch 2',
    address: '456 Food Avenue, Uptown',
  },
  {
    id: 3,
    name: 'Branch 3',
    address: '789 Dining Boulevard, Midtown',
  },
];

export default function ChooseBranchPage() {
  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <h1 className="self-stretch text-center text-zinc-800 text-5xl font-bold font-['Satoshi'] leading-[69.82px]">
          Choose a Branch
        </h1>
        <p className="w-[492.64px] text-center text-zinc-500 text-2xl font-normal font-['Satoshi'] leading-8">
          Select the branch you want to manage
        </p>
      </div>

      <div className="w-[616.56px] flex flex-col items-start gap-5">
        {branches.map((branch) => (
          <Link
            key={branch.id}
            href="/reports/analytics"
            className="self-stretch p-6 bg-gray-200 rounded-[36.27px] inline-flex items-center gap-4 hover:bg-gray-300 transition-colors"
          >
            <div className="size-14 bg-emerald-700 rounded-2xl flex items-center justify-center">
              <Store className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 flex flex-col">
              <span className="text-zinc-800 text-2xl font-semibold font-['Satoshi'] leading-8">
                {branch.name}
              </span>
              <span className="text-zinc-500 text-lg font-normal font-['Poppins']">
                {branch.address}
              </span>
            </div>
            <ChevronRight className="w-8 h-8 text-zinc-400" />
          </Link>
        ))}
      </div>
    </>
  );
}