import Link from 'next/link';

export default function VerifyEmailPage() {
  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <h1 className="self-stretch text-center text-zinc-800 text-5xl font-bold font-['Satoshi'] leading-[69.82px]">
          Verify Email
        </h1>
        <p className="w-[492.64px] text-center text-zinc-500 text-2xl font-normal font-['Satoshi'] leading-8">
          Enter the 6-digit code sent to your email
        </p>
      </div>

      {/* OTP Input */}
      <div className="w-[616.56px] flex flex-col items-center gap-8">
        <div className="flex items-center gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="w-20 h-24 bg-gray-200 rounded-2xl flex items-center justify-center text-zinc-800 text-4xl font-bold font-['Satoshi']"
            >
              <input
                type="text"
                maxLength={1}
                className="w-full h-full bg-transparent text-center outline-none text-zinc-800 text-4xl font-bold font-['Satoshi']"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Verify Button */}
      <button className="self-stretch h-24 px-36 py-6 bg-emerald-700 rounded-[45.26px] shadow-[0px_6.034px_24.589px_16.594px_rgba(0,0,0,0.12)] inline-flex justify-center items-center gap-8">
        <div className="flex justify-start items-center gap-3.5">
          <span className="text-center text-white text-3xl font-medium font-['Satoshi'] leading-10">
            Verify
          </span>
        </div>
      </button>

      <div className="flex flex-col items-center gap-2">
        <p className="text-zinc-500 text-lg font-normal font-['Poppins']">
          Didn&apos;t receive the code?
        </p>
        <button className="text-emerald-700 text-lg font-semibold font-['Poppins']">
          Resend Code
        </button>
      </div>

      <Link
        href="/login"
        className="text-center text-emerald-700 text-lg font-semibold font-['Poppins']"
      >
        Back to Sign In
      </Link>
    </>
  );
}