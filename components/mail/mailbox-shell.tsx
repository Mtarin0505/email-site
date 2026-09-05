import { cn } from "cn";

/**
 * List-detail shell. On phones the list and the detail are separate screens
 * (the URL decides which one shows). From `lg` both panes sit side by side
 * and each owns its own scroll.
 */
export function MailboxShell({
  list,
  hasDetail,
  children,
}: {
  list: React.ReactNode;
  hasDetail: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="grid h-full min-h-0 grid-cols-1 lg:grid-cols-[var(--list-w)_minmax(0,1fr)]">
      <aside
        aria-label="Message list"
        className={cn(
          "min-h-0 bg-card lg:border-r",
          hasDetail ? "hidden lg:block" : "block",
        )}
      >
        {list}
      </aside>
      <section
        aria-label="Message"
        className={cn(
          "flex min-h-0 min-w-0 flex-col",
          hasDetail ? "flex" : "hidden lg:flex",
        )}
      >
        {children}
      </section>
    </div>
  );
}
