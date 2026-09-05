"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";
import { NAV_ITEMS, isActivePath } from "@/components/app/nav-config";

type Props = {
  unread: number;
  className?: string;
};

/**
 * Mobile tab bar. Five items, labels always visible, 44px+ targets,
 * padded for the home indicator on notched phones.
 */
export function BottomNav({ unread, className }: Props) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "safe-bottom shrink-0 border-t bg-sidebar text-sidebar-foreground",
        className,
      )}
    >
      <ul className="grid h-(--nav-h) grid-cols-5">
        {NAV_ITEMS.map((item) => {
          const active = isActivePath(pathname, item.href);
          const Icon = item.icon;
          const showBadge = item.countKey === "inbox" && unread > 0;

          return (
            <li key={item.href} className="min-w-0">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-full min-w-0 flex-col items-center justify-center gap-0.5 px-1 text-[0.6875rem] font-medium tracking-[0.02em] outline-none transition-colors duration-150 ease-out",
                  "focus-visible:bg-sidebar-accent",
                  item.primary
                    ? "text-foreground"
                    : active
                      ? "text-foreground"
                      : "text-muted-foreground active:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "relative grid place-items-center rounded-md transition-colors duration-150",
                    item.primary
                      ? "size-9 bg-primary text-primary-foreground"
                      : "h-7 w-11",
                    active && !item.primary && "bg-sidebar-accent",
                  )}
                >
                  <Icon
                    weight={active && !item.primary ? "fill" : "regular"}
                    className="size-5"
                    aria-hidden="true"
                  />
                  {showBadge && (
                    <span
                      className="absolute top-0.5 right-2 size-2 rounded-full bg-unread ring-2 ring-sidebar"
                      aria-label={`${unread} unread`}
                    />
                  )}
                </span>
                {!item.primary && (
                  <span className="max-w-full truncate">{item.label}</span>
                )}
                {item.primary && <span className="sr-only">{item.label}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
