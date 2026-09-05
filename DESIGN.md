# Resend Mail Design System

## 0. Research Log

- Embedded refs: curated Layer B brand library not installed locally (only `aside.md` present). Layer A picked: `minimalist-ui` skill (warm monochrome, editorial serif, hairline borders, pastel status chips) because the brief asks for a clean mobile-first inbox with a calm desktop layout. Layer B: none available; `layout-skill.md` used for the app-shell / list-detail mechanics.
- ui-ux-pro-max `--design-system` run ("email inbox client dashboard mobile-first clean productivity"): returned Flat Design, inbox-blue accent, Plus Jakarta Sans. Kept: flat depth strategy, 150-200ms transitions, 4.5:1 contrast floor, bottom nav <= 5. Rejected: saturated blue primary (conflicts with the monochrome direction) in favour of one muted accent reserved for interactive elements.
- Lazyweb screens: skipped — network research lane not run in this session.
- Imagen drafts: skipped — image generation not available in this session.
- React dev tooling gate (react-grab / react-scan / react-doctor): skipped for the initial scaffold; can be added on request.

## 1. Atmosphere & Identity

A quiet paper inbox. Warm bone canvas, white sheets sitting on it, separated by hairline borders rather than shadows. Type does the work: an editorial serif for mailbox headings and counts, a geometric sans for everything you read, a mono face for addresses, message IDs and timestamps. Colour is rationed: the only saturated moments are the delivery-status chips (delivered, opened, bounced, queued) and a single ink accent on the active nav item and focus rings. The signature is the serif count next to each mailbox name and the mono address rows, which make the product feel like a well-set ledger rather than a generic SaaS table.

## 2. Color

### Palette

| Role | Token | Light | Dark | Usage |
|------|-------|-------|------|-------|
| Surface/canvas | `--background` | #F7F6F3 | #141311 | App canvas behind sheets |
| Surface/sheet | `--card` | #FFFFFF | #1C1B18 | List panes, detail pane, login card |
| Surface/elevated | `--popover` | #FFFFFF | #23221E | Menus, command palette, sheets |
| Surface/muted | `--muted` | #F1F0EC | #23221E | Row hover, kbd bg, avatar bg |
| Surface/nav | `--sidebar` | #F7F6F3 | #141311 | Sidenav and bottom tab bar |
| Text/primary | `--foreground` | #111111 | #F3F2EE | Headlines, body |
| Text/secondary | `--muted-foreground` | #787774 | #9C9A93 | Snippets, meta, captions |
| Border/default | `--border` | #EAEAEA | #2C2B27 | All dividers and card edges |
| Ink/accent | `--primary` | #111111 | #F3F2EE | Primary button, active nav, links |
| Ink/accent hover | `--primary-hover` | #333333 | #D9D8D3 | Primary button hover |
| Ring | `--ring` | #111111 | #F3F2EE | Focus ring |
| Status/delivered bg | `--status-delivered` | #EDF3EC | #1F2E20 | Delivered chip |
| Status/delivered fg | `--status-delivered-fg` | #346538 | #9FD3A4 | Delivered chip text |
| Status/opened bg | `--status-opened` | #E1F3FE | #14303F | Opened / clicked chip |
| Status/opened fg | `--status-opened-fg` | #1F6C9F | #8CC7EC | Opened / clicked chip text |
| Status/queued bg | `--status-queued` | #FBF3DB | #3A3012 | Queued / sent-not-delivered chip |
| Status/queued fg | `--status-queued-fg` | #956400 | #E5C36B | Queued chip text |
| Status/bounced bg | `--status-bounced` | #FDEBEC | #3F1F20 | Bounced / complained / failed chip |
| Status/bounced fg | `--status-bounced-fg` | #9F2F2D | #F0A3A1 | Bounced chip text |
| Destructive | `--destructive` | #9F2F2D | #F0A3A1 | Delete actions, form errors |
| Unread dot | `--unread` | #111111 | #F3F2EE | Unread indicator |

### Rules

- Depth comes from canvas vs sheet tonal shift plus 1px borders. No shadows on resting surfaces.
- `--primary` is ink, not a brand colour. It appears only on interactive elements.
- Status chips are the only place pastel colour is allowed. Never use them decoratively.
- No raw hex in components. Everything traces to a token in `app/globals.css`.

## 3. Typography

### Scale

| Level | Size | Weight | Line Height | Tracking | Face | Usage |
|-------|------|--------|-------------|----------|------|-------|
| Display | clamp(2rem, 5vw, 2.75rem) | 400 | 1.05 | -0.02em | serif | Login title, empty-state title |
| H1 | 1.5rem | 400 | 1.15 | -0.015em | serif | Mailbox heading (Inbox, Sent) |
| H2 | 1.125rem | 500 | 1.3 | -0.01em | sans | Detail subject, card titles |
| Body | 0.9375rem | 400 | 1.6 | 0 | sans | Message body, form labels |
| Body/sm | 0.875rem | 400 | 1.5 | 0 | sans | List row sender + snippet |
| Caption | 0.75rem | 500 | 1.4 | 0.02em | sans | Timestamps in rows |
| Overline | 0.6875rem | 600 | 1.3 | 0.08em | sans, uppercase | Chip labels, section labels |
| Mono | 0.8125rem | 400 | 1.5 | 0 | mono | Addresses, message IDs, kbd |

### Font Stack

- Sans: Geist Sans (`--font-sans`), fallback system-ui
- Serif: Instrument Serif (`--font-serif`), fallback Georgia
- Mono: Geist Mono (`--font-mono`), fallback ui-monospace

### Rules

- Serif is reserved for headings and mailbox counts. Never for body copy.
- Body text never below 14px. Chip labels are the only 11px text.
- Text colour is never pure black.

## 4. Spacing & Layout

### Base Unit

4px. Tailwind's default scale is the token set (`gap-2` = 8px, `p-4` = 16px, etc.).

| Intent | Token | Value |
|--------|-------|-------|
| Icon to label | `gap-2` | 8px |
| Row inner padding (mobile) | `px-4 py-3` | 16 / 12px |
| Row inner padding (desktop) | `px-5 py-3` | 20 / 12px |
| Sheet padding | `p-4` mobile, `p-6` desktop | 16 / 24px |
| Section gap | `gap-6` | 24px |
| Bottom nav height | `--nav-h` | 56px + safe area |
| Top bar height | `--topbar-h` | 56px |
| Sidenav width | `--sidenav-w` | 240px |
| List pane width | `--list-w` | 380px |

### Grid

- Breakpoints: `md` 768px (tablet), `lg` 1024px (desktop split view).
- Mobile (< md): single column, bottom tab bar, list and detail are separate routes.
- Tablet (md to lg): fixed sidenav 64px icon rail + full-width list or detail.
- Desktop (>= lg): `fixed-sidenav-shell` 240px + `list-detail` two panes (380px list, fluid detail).

### Scroll ownership

- Shell is bounded by `100dvh`. The `<body>` never scrolls inside the app.
- Mobile: the list pane owns scroll; top bar and bottom nav are fixed grid rows.
- Desktop: list pane and detail pane each own their own vertical scroll. Sidenav does not scroll unless the mailbox list exceeds the viewport.
- Every scroll child has `min-h-0`.

### Rules

- No horizontal scroll of primary content at 375px. Long addresses use `break-all`; subjects and snippets `truncate`.
- Safe areas: bottom nav pads with `env(safe-area-inset-bottom)`.

## 5. Components

### AppShell
- Structure: `grid` with rows `topbar / body / bottomnav` on mobile, columns `sidenav / main` on desktop.
- Layout: `scroll-body-shell` (mobile), `fixed-sidenav-shell` (desktop). Scroll owner: `main` child panes.
- States: default only.

### SideNav (desktop) / BottomNav (mobile)
- Structure: desktop sidenav is wordmark, then a full-width primary "New message" button, then the mailbox list (icon + label + serif count), then the account menu pinned to the bottom. On mobile Compose is the centre tab.
- States: default, hover (muted bg), active (ink text + muted bg, `aria-current="page"`), focus-visible ring.
- Accessibility: `<nav aria-label>`, 44px min touch targets, labels always visible on mobile.
- Motion: bg colour 150ms ease-out.

### MailListRow
- Structure: unread dot column, avatar (initials), sender + timestamp row, subject, snippet, optional status chip.
- Variants: unread (sender weight 600 + dot), read, selected (desktop, muted bg + inset ink bar).
- States: default, hover, selected, focus-visible.
- Layout: `stack` inside a `sidebar`-style row; text column has `min-w-0` and `truncate`.
- Content stress: 40-char sender truncates; missing subject shows "(no subject)"; empty snippet collapses.

### StatusChip
- Structure: `Badge` with status token pair, overline type, pill radius (chips are the one pill exception).
- Variants: delivered, opened, clicked, queued, sent, bounced, complained, failed, received.

### MailDetail
- Structure: header (subject H2, sender block with avatar, mono addresses, timestamp, chip), action cluster (reply, forward, delete), body sheet, attachments cluster.
- States: default, loading (skeleton), empty ("Select a message" on desktop only).
- Layout: `stack`; body uses `content-limiter` (max 72ch) and `overflow-wrap: anywhere`.

### ComposeForm
- Structure: `FieldGroup` of To / Cc / Bcc / From / Subject / Body inside a sheet; footer cluster with Send (primary) and Discard.
- States: default, focus, invalid (`data-invalid` + inline message), sending (spinner + disabled), sent (toast).
- Accessibility: visible labels, errors adjacent to field.

### LoginCard
- Structure: serif display title, sans description, `FieldGroup` username / password, primary button, inline error alert.
- Layout: `cover` primitive, centred, max width 380px.

### Primary Button
- Solid ink bg, 6px radius, no shadow. Hover `--primary-hover`, active `scale(0.98)`.

### Avatar (initials)
- Muted bg, ink text, 36px list / 40px detail. Always has fallback.

## 6. Motion & Interaction

| Type | Duration | Easing | Usage |
|------|----------|--------|-------|
| Micro | 150ms | ease-out | Hover bg, button press, chip |
| Standard | 200ms | ease-in-out | Sheet / drawer open, tab switch |
| Emphasis | 400ms | cubic-bezier(0.16, 1, 0.3, 1) | List rows entering after load (opacity + 8px translate) |

Rules: only `transform` and `opacity` animate. Every interactive element has hover, active and focus-visible states. `prefers-reduced-motion` disables the entry animation.

## 7. Depth & Surface

Strategy: borders-only with tonal shift. Canvas #F7F6F3 under white sheets, `1px solid var(--border)` on every sheet edge and row divider. Popovers and command palette are the single exception and may use `0 2px 8px rgba(0,0,0,0.04)`.

## 8. Accessibility Constraints & Accepted Debt

### Constraints

- WCAG 2.2 AA. Body contrast >= 4.5:1 (#111 and #787774 on white both pass). Chip text pairs are all >= 4.5:1 on their pastel bg.
- Visible focus ring on every interactive element. Full keyboard reachability. Touch targets >= 44px on mobile.
- Reduced motion honoured.

### Accepted Debt

| Item | Location | Why accepted | Owner / Exit |
|------|----------|--------------|--------------|
| Mock data instead of live Resend API | `lib/data/*` | Design phase first, per brief | Replace with Resend client in the next phase |
| Single shared admin login from `.env` | `proxy.ts`, `lib/auth.ts` | Requested by user for now | Move to proper user store later |
