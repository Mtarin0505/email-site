import { cookies } from "next/headers";
import { SideNav } from "@/components/app/sidenav";
import { BottomNav } from "@/components/app/bottom-nav";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { countUnread, mailboxCounts } from "@/lib/data";

export const dynamic = "force-dynamic";

/**
 * App shell. Bounded to the dynamic viewport; the body never scrolls.
 * Mobile: rows [main, bottom nav]. Tablet/desktop: columns [sidenav, main].
 */
export default async function AppLayout({ children }: LayoutProps<"/">) {
  const [counts, unread, store] = await Promise.all([
    mailboxCounts(),
    countUnread(),
    cookies(),
  ]);
  const session = await verifySessionToken(store.get(SESSION_COOKIE)?.value);
  const username = session?.u ?? "admin";

  return (
    <div className="grid h-dvh grid-rows-[minmax(0,1fr)_auto] overflow-hidden bg-background md:grid-cols-[4rem_minmax(0,1fr)] md:grid-rows-1 lg:grid-cols-[var(--sidenav-w)_minmax(0,1fr)]">
      <SideNav
        counts={counts}
        unread={unread}
        username={username}
        className="hidden md:flex"
      />
      <main className="flex min-h-0 min-w-0 flex-col">{children}</main>
      <BottomNav unread={unread} className="md:hidden" />
    </div>
  );
}
