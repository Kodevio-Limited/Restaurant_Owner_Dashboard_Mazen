import Image from 'next/image';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F2F2F2] items-center justify-center p-4">
      <div className="flex w-full max-w-[1520px] h-[1033px]">
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <Image
            src="/images/food-41e5d7.png"
            alt="Restaurant"
            width={500}
            height={500}
            className="object-contain"
            priority
          />
        </div>
        <div className="w-[930px] bg-white rounded-xl overflow-hidden flex items-center justify-center">
          <div className="w-[617px] flex flex-col items-center gap-3.5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}