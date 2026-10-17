'use client';

import { useRef } from 'react';

/** Any digit, Latin or Arabic-Indic / Extended Arabic-Indic. */
const DIGIT = /[0-9٠-٩۰-۹]/;

/**
 * 6-box one-time-code field. Typing a digit advances to the next box, Backspace
 * steps back, and digits typed on an Arabic keyboard (٠-٩ / ۰-۹) are accepted.
 * The row is forced `dir="ltr"` so the boxes always read left→right even in RTL.
 *
 * Figma 1999:2653 — boxes 96.342px tall, 88.41px wide, 17.7px gap, r-12.
 */
export function OtpInputs({ length = 6 }: { length?: number }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const focusAt = (i: number) => {
    const el = refs.current[Math.max(0, Math.min(length - 1, i))];
    el?.focus();
    el?.select();
  };

  const handleChange = (i: number, raw: string) => {
    const digit = [...raw].filter((c) => DIGIT.test(c)).slice(-1)[0] ?? '';
    const el = refs.current[i];
    if (el) el.value = digit;
    if (digit && i < length - 1) focusAt(i + 1);
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!refs.current[i]?.value && i > 0) {
        e.preventDefault();
        const prev = refs.current[i - 1];
        if (prev) prev.value = '';
        focusAt(i - 1);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      focusAt(i - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      focusAt(i + 1);
    }
  };

  const handlePaste = (i: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    const digits = [...e.clipboardData.getData('text')].filter((c) => DIGIT.test(c));
    if (digits.length === 0) return;
    e.preventDefault();
    digits.slice(0, length - i).forEach((d, k) => {
      const el = refs.current[i + k];
      if (el) el.value = d;
    });
    focusAt(Math.min(length - 1, i + digits.length));
  };

  return (
    <div className="flex w-full items-center gap-[clamp(10px,0.92vw,17.7px)]" dir="ltr">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          aria-label={`Digit ${i + 1}`}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={(e) => handlePaste(i, e)}
          onFocus={(e) => e.currentTarget.select()}
          className="h-[clamp(56px,5.02vw,96.342px)] min-w-0 flex-1 rounded-[clamp(10px,0.625vw,12px)] bg-[#E9E9E9] text-center font-satoshi text-[clamp(20px,1.88vw,36px)] font-bold text-[#2D2F33] outline-none transition-colors focus:bg-[#BDBDBD]"
        />
      ))}
    </div>
  );
}
