"use client";

import Link from "next/link";
import { PaperclipIcon } from "@phosphor-icons/react";
import { cn } from "cn";
import { InitialsAvatar } from "@/components/mail/initials-avatar";
import { StatusChip } from "@/components/mail/status-chip";
import type { EmailSummary, Mailbox } from "@/lib/types";
import { displayName } from "@/lib/format";

type Props = {
  email: EmailSummary;
  mailbox: Mailbox;
  /** Pre-formatted on the server so list and detail agree. */
  time: string;
  index: number;
  selected: boolean;
  /** Active search, carried on the link so the list keeps its filter. */
  query?: string;
};

export function MailRow({ email, mailbox, time, index, selected, query }: Props) {
  const href = query
    ? `/${mailbox}/${email.id}?q=${encodeURIComponent(query)}`
    : `/${mailbox}/${email.id}`;
  const counterpart =
    mailbox === "inbox" ? email.from : (email.to[0] ?? email.from);
  const who =
    mailbox === "inbox"
      ? displayName(counterpart)
      : `To: ${email.to.map(displayName).join(", ")}`;
  const subject = email.subject.trim() || "(no subject)";

  return (
    <li
      className="row-enter border-b last:border-b-0"
      style={{ "--index": index } as React.CSSProperties}
    >
      <Link
        href={href}
        aria-current={selected ? "page" : undefined}
        className={cn(
          "relative flex items-start gap-3 px-4 py-3 outline-none transition-colors duration-150 ease-out lg:px-5",
          "hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:ring-inset focus-visible:ring-3 focus-visible:ring-ring/40 active:bg-muted",
          selected && "bg-muted before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-foreground",
        )}
      >
        <span
          className="mt-4 size-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: email.unread ? "var(--unread)" : "transparent" }}
          aria-hidden="true"
        />
        <InitialsAvatar address={counterpart} className="mt-0.5" />

        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="flex items-baseline justify-between gap-3">
            <span
              className={cn(
                "min-w-0 truncate text-sm",
                email.unread ? "font-semibold text-foreground" : "text-foreground",
              )}
            >
              {who}
            </span>
            <time
              dateTime={email.createdAt}
              className="shrink-0 text-xs font-medium tracking-[0.02em] text-muted-foreground tabular-nums"
            >
              {time}
            </time>
          </span>

          <span className="flex min-w-0 items-center gap-1.5">
            <span
              className={cn(
                "min-w-0 truncate text-sm",
                email.unread ? "font-medium text-foreground" : "text-foreground/90",
              )}
            >
              {subject}
            </span>
            {email.hasAttachments && (
              <PaperclipIcon
                className="size-3.5 shrink-0 text-muted-foreground"
                aria-label="Has attachment"
              />
            )}
          </span>

          {email.snippet && (
            <span className="truncate text-sm leading-snug text-muted-foreground">
              {email.snippet}
            </span>
          )}

          {mailbox === "sent" && (
            <span className="mt-1">
              <StatusChip status={email.status} />
            </span>
          )}
        </span>

        {email.unread && <span className="sr-only">Unread</span>}
      </Link>
    </li>
  );
}
