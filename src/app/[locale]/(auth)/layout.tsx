import Image from 'next/image';
import { LanguageToggle } from '@/components/layout/LanguageToggle';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full bg-[#F2F2F2] items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="absolute top-4 end-4 z-20">
        <LanguageToggle />
      </div>
      <div className="flex w-full max-w-[1520px] min-h-[600px] lg:min-h-[850px] items-stretch justify-center">
        <div className="hidden lg:flex flex-1 items-center justify-center p-8">
          <Image
            src="/images/food-41e5d7.png"
            alt="Restaurant"
            width={500}
            height={500}
            className="object-contain"
            priority
          />
        </div>
        <div className="w-full max-w-[930px] bg-white rounded-2xl overflow-hidden flex items-center justify-center p-4 sm:p-8 md:p-12 shadow-sm">
          <div className="w-full max-w-[617px] flex flex-col items-center gap-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}