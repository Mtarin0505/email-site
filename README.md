# Resend Mail

update email 


A mobile-first inbox and sending dashboard for a [Resend](https://resend.com) account, built with Next.js 16, Tailwind 4 and shadcn/ui (Base UI).

## Run it

```bash
npm install
cp .env.example .env   # then edit the values
npm run dev
```

Open http://localhost:3000 and sign in with the credentials from `.env` (defaults: `admin` / `123456789`).

## Environment

| Variable | Purpose |
|---|---|
| `AUTH_USERNAME`, `AUTH_PASSWORD` | The single admin login for the dashboard. |
| `AUTH_SECRET` | Long random string used to sign the session cookie. |
| `RESEND_API_KEY` | Switches every screen to live Resend data (inbox, sent, domains) and enables sending. Without it, sample data is shown. |

## Where things live

- `DESIGN.md` is the design contract: tokens, type scale, layout, components and motion. Read it before touching UI.
- `proxy.ts` guards every route except `/login` by verifying the signed session cookie.
- `lib/auth.ts` signs and verifies sessions with Web Crypto, so it runs in Node and Edge.
- `lib/data/` is the data layer. `index.ts` picks `resend.ts` (live API) when `RESEND_API_KEY` is set, otherwise the sample data in `mock.ts`.
- `app/(app)/` holds the authenticated screens: Inbox, Sent, Compose, Domains, Settings.
- `components/mail/` holds the list-detail shell, rows, status chips and the message view.

## Notes on live data

- Inbound mail only exists for domains with **receiving** enabled in Resend and an MX record in place. The Inbox empty state says which domains are missing it.
- Resend does not track read state, so unread markers only appear with sample data.
- Lists show the latest 100 messages. Resend has no delete endpoint, so Delete explains that instead of acting.
- Session cookies are signed with `AUTH_SECRET` plus the username and password, so changing any of them signs everyone out.
- Cookies are shared across ports on `localhost`; a session from another local app on the same host name is still just this app's own cookie name, `rm_session`.

## Layout

- Under 768px: single column with a five-item bottom tab bar. List and message are separate screens.
- 768px to 1024px: icon rail plus a full-width pane.
- 1024px and up: 240px side navigation, 380px list, fluid message pane. Each pane owns its own scroll.

## Scripts

```bash
npm run dev     # local server
npm run build   # production build
npx eslint .    # lint
npx tsc --noEmit
```
