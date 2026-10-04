import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Lock/restore page scroll while an overlay is open.
 * The Owner dashboard scrolls inside `#admin-main-scroll` (a div), not the
 * <body>, so we must lock that container too — otherwise the background still
 * scrolls behind modals/drawers.
 */
export function lockPageScroll(locked: boolean) {
  if (typeof document === 'undefined') return;
  const main = document.getElementById('admin-main-scroll');
  if (main) {
    main.style.overflow = locked ? 'hidden' : '';
  }
  document.body.style.overflow = locked ? 'hidden' : '';
}