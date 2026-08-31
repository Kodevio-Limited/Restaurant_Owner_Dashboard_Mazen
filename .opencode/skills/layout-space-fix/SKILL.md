\---

name: layout-space-fix

description: Use for this project only — a tablet/desktop-first site where the client reported content not properly occupying the screen (wasted whitespace, components not filling available space) alongside general responsive inconsistency across iPad/desktop widths. Locate Navbar, Sidebar, and layout shell components first, then audit and fix. This is a targeted fix pass on an already-built site, not a redesign.

\---



\# Layout Space Fix (Project-Specific)



This project is tablet-first / desktop-first (not mobile-primary). Apply the

base rules from the global `responsive-tablet-first` and

`responsive-desktop-first` skills (clamp() for type/spacing, relative units,

container-based sizing) — this skill adds the project-specific space-fill

audit on top of those, it does not replace them.



\## Step 1 — Locate before touching anything

Find the actual layout shell files before making any change:

\- Navbar / top bar component

\- Sidebar component

\- Root layout / AppShell wrapper that composes them with page content

Do not guess file names — search the project first.



\## Step 2 — Diagnose "not occupying space properly"

This complaint almost always traces to one of these. Check each:

1\. \*\*Fixed `max-width` too narrow for the viewport\*\* — a container capped

&#x20;  at e.g. `max-width: 1024px` on a 1440px+ screen leaves dead margin.

2\. \*\*Missing `w-full` / `flex-grow` / `flex-1` on a container that should

&#x20;  stretch\*\* — child sits at intrinsic content width inside a larger

&#x20;  flex/grid parent instead of filling it.

3\. \*\*Sidebar/Navbar fixed at a `px` width instead of responding to

&#x20;  viewport/container\*\* — causes disproportionate whitespace or cramped

&#x20;  content area at different screen sizes.

4\. \*\*Grid/flex parent without proper `grid-template-columns` or `gap`

&#x20;  rules at wider breakpoints\*\* — content stays single-column-sized even

&#x20;  though the layout has room for more.

5\. \*\*Content area not accounting for sidebar width in its own width

&#x20;  calculation\*\* — e.g. `width: 100vw` instead of `width: 100%` inside a

&#x20;  flex sibling, causing overflow or gaps next to the sidebar.



\## Step 3 — Fix at the layout-shell level first

Most of these trace back to the root layout/AppShell, not individual pages.

Fix the shell's container/grid rules first, then re-check pages — don't

patch each page independently before confirming the shell itself is sound.



\## Step 4 — Verify across the full range

After fixing, check continuously from 768px to 1920px+ (this project's

range — mobile is out of scope here). Confirm:

\- No dead whitespace margins at large widths

\- Sidebar + content together fill the viewport with no gap or overflow

\- Nav items don't wrap/collapse unnecessarily when there's room



\## Do not

\- Do not redesign colors, spacing scale, or component structure — this is

&#x20; a space-utilization and responsiveness fix only.

\- Do not modify mobile styles — this project is tablet/desktop-first,

&#x20; mobile is handled separately.

\- Do not fix page-by-page before confirming the root layout shell is

&#x20; correct — that causes the same bug to resurface per page.

