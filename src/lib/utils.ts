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
 *
 * Reference-counted so stacked overlays (e.g. a confirm dialog over a drawer)
 * don't release the lock when only the inner one closes.
 */
let scrollLockCount = 0;

export function lockPageScroll(locked: boolean) {
  if (typeof document === 'undefined') return;
  scrollLockCount = locked ? scrollLockCount + 1 : Math.max(0, scrollLockCount - 1);
  const on = scrollLockCount > 0;
  const main = document.getElementById('admin-main-scroll');
  if (main) {
    main.style.overflow = on ? 'hidden' : '';
  }
  document.body.style.overflow = on ? 'hidden' : '';
}