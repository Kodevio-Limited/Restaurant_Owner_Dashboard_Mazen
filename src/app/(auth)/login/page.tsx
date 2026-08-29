import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <h1 className="self-stretch text-center text-zinc-800 text-5xl font-bold font-['Satoshi'] leading-[69.82px]">
          Sign In
        </h1>
        <p className="w-[492.64px] text-center text-zinc-500 text-2xl font-normal font-['Satoshi'] leading-8">
          Access your account with correct information
        </p>
      </div>

      <div className="w-[616.56px] flex flex-col items-start gap-8">
        {/* Email */}
        <div className="self-stretch flex flex-col items-start gap-3">
          <label className="self-stretch text-zinc-800 text-3xl font-medium font-['Satoshi'] leading-10">
            Email
          </label>
          <div className="self-stretch p-6 bg-gray-200 rounded-[36.27px] inline-flex items-center gap-3">
            <div className="size-9 bg-zinc-300 rounded-lg" />
            <Mail className="w-8 h-6 text-neutral-400" />
            <span className="flex-1 text-neutral-400 text-2xl font-medium font-['Satoshi'] leading-8">
              Enter your email...
            </span>
          </div>
        </div>

        {/* Password */}
        <div className="self-stretch flex flex-col items-end gap-4">
          <div className="self-stretch flex flex-col items-start gap-3">
            <label className="self-stretch text-zinc-800 text-3xl font-medium font-['Satoshi'] leading-10">
              Password
            </label>
            <div className="self-stretch p-6 bg-gray-200 rounded-[36.27px] inline-flex items-center gap-3">
              <div className="size-9 bg-zinc-300 rounded-lg" />
              <Lock className="w-6 h-8 text-neutral-400" />
              <span className="flex-1 text-neutral-400 text-2xl font-normal font-['Poppins']">
                ********
              </span>
              <div className="size-9 bg-zinc-300 rounded-lg" />
              <EyeOff className="w-8 h-7 text-neutral-400" />
            </div>
          </div>
          <Link
            href="/forgot-password"
            className="self-stretch text-right text-emerald-700 text-lg font-semibold font-['Poppins']"
          >
            Forgot password?
          </Link>
        </div>
      </div>

      {/* Sign In Button */}
      <button className="self-stretch h-24 px-36 py-6 bg-emerald-700 rounded-[45.26px] shadow-[0px_6.034px_24.589px_16.594px_rgba(0,0,0,0.12)] inline-flex justify-center items-center gap-8">
        <div className="flex justify-start items-center gap-3.5">
          <span className="text-center text-white text-3xl font-medium font-['Satoshi'] leading-10">
            Sign In
          </span>
        </div>
      </button>
    </>
  );
}