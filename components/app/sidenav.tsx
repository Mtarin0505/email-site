"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";
import { Wordmark } from "@/components/app/wordmark";
import { UserMenu } from "@/components/app/user-menu";
import { PencilSimpleLineIcon } from "@phosphor-icons/react";
import { NAV_ITEMS, isActivePath } from "@/components/app/nav-config";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type Props = {
  counts: { inbox: number; sent: number };
  unread: number;
  username: string;
  className?: string;
};

/**
 * Desktop navigation. Icon rail from `md`, full labels from `lg`.
 * Does not scroll; the main panes own scroll.
 */
export function SideNav({ counts, unread, username, className }: Props) {
  const pathname = usePathname();

  const composeLink = (
    <Link
      href="/compose"
      aria-current={isActivePath(pathname, "/compose") ? "page" : undefined}
      className="flex h-10 items-center justify-center gap-2.5 rounded-md bg-primary px-2.5 text-sm font-medium text-primary-foreground outline-none transition-colors duration-150 ease-out hover:bg-primary-hover focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.98] lg:justify-start"
    >
      <PencilSimpleLineIcon className="size-5 shrink-0" aria-hidden="true" />
      <span className="hidden lg:inline">New message</span>
      <span className="sr-only lg:hidden">New message</span>
    </Link>
  );

  return (
    <nav
      aria-label="Mailboxes"
      className={cn(
        "flex min-h-0 flex-col border-r bg-sidebar text-sidebar-foreground",
        className,
      )}
    >
      <div className="flex h-(--topbar-h) shrink-0 items-center px-3 lg:px-5">
        <Wordmark compact className="lg:hidden" />
        <Wordmark className="hidden lg:inline-flex" />
      </div>

      <div className="px-2 pt-1 pb-2 lg:px-3">
        <div className="lg:hidden">
          <Tooltip>
            <TooltipTrigger render={composeLink} />
            <TooltipContent side="right">New message</TooltipContent>
          </Tooltip>
        </div>
        <div className="hidden lg:block">{composeLink}</div>
      </div>

      <ul className="flex flex-col gap-0.5 px-2 lg:px-3">
        {NAV_ITEMS.filter((item) => !item.primary).map((item) => {
          const active = isActivePath(pathname, item.href);
          const count = item.countKey ? counts[item.countKey] : undefined;
          const Icon = item.icon;

          const link = (
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group/nav flex h-10 items-center gap-3 rounded-md px-2.5 text-sm outline-none transition-colors duration-150 ease-out",
                "focus-visible:ring-3 focus-visible:ring-ring/50",
                active
                  ? "bg-sidebar-accent font-medium text-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                "justify-center lg:justify-start",
              )}
            >
              <Icon
                weight={active ? "fill" : "regular"}
                className="size-5 shrink-0"
                aria-hidden="true"
              />
              <span className="hidden min-w-0 flex-1 truncate lg:inline">
                {item.label}
              </span>
              {count !== undefined && (
                <span
                  className={cn(
                    "hidden font-heading text-base leading-none tabular-nums lg:inline",
                    item.countKey === "inbox" && unread > 0
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                  aria-label={
                    item.countKey === "inbox" && unread > 0
                      ? `${unread} unread`
                      : `${count} messages`
                  }
                >
                  {item.countKey === "inbox" && unread > 0 ? unread : count}
                </span>
              )}
            </Link>
          );

          return (
            <li key={item.href}>
              <div className="lg:hidden">
                <Tooltip>
                  <TooltipTrigger render={link} />
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              </div>
              <div className="hidden lg:block">{link}</div>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto border-t p-2 lg:p-3">
        <UserMenu username={username} />
      </div>
    </nav>
  );
}
