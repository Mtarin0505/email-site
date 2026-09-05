import { MagnifyingGlassIcon, TrayIcon, XIcon } from "@phosphor-icons/react/ssr";
import { MailRow } from "@/components/mail/mail-row";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import type { EmailSummary, Mailbox } from "@/lib/types";
import { formatListTime } from "@/lib/format";
import Link from "next/link";

type Props = {
  mailbox: Mailbox;
  emails: EmailSummary[];
  query?: string;
  total: number;
  unread?: number;
  selectedId?: string;
  /** Extra explanation shown in the empty state when there is no search. */
  emptyHint?: string;
};

const TITLE: Record<Mailbox, string> = { inbox: "Inbox", sent: "Sent" };

/**
 * List pane. The header is a fixed row; the <ul> owns the scroll.
 */
export function MailList({
  mailbox,
  emails,
  query,
  total,
  unread = 0,
  selectedId,
  emptyHint,
}: Props) {
  const now = new Date();
  const heading = TITLE[mailbox];
  const countLabel =
    mailbox === "inbox" && unread > 0
      ? `${unread} unread`
      : `${total} message${total === 1 ? "" : "s"}`;

  return (
    <div className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)]">
      <header className="flex flex-col gap-3 border-b px-4 pt-4 pb-3 lg:px-5">
        <div className="flex items-baseline justify-between gap-3">
          <h1 className="font-heading text-2xl leading-none">
            {heading}
            <span className="ml-2 text-base text-muted-foreground tabular-nums">
              {mailbox === "inbox" && unread > 0 ? unread : total}
            </span>
          </h1>
          <span className="text-xs font-medium tracking-[0.02em] text-muted-foreground">
            {countLabel}
          </span>
        </div>

        <form action={`/${mailbox}`} method="get" role="search">
          <InputGroup className="h-10 bg-background lg:h-9">
            <InputGroupAddon>
              <MagnifyingGlassIcon aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput
              type="search"
              name="q"
              defaultValue={query ?? ""}
              placeholder={`Search ${heading.toLowerCase()}`}
              aria-label={`Search ${heading.toLowerCase()}`}
              enterKeyHint="search"
              className="text-base lg:text-sm"
            />
            {query && (
              <InputGroupAddon align="inline-end">
                <Button
                  variant="ghost"
                  size="icon-xs"
                  render={<Link href={`/${mailbox}`} />}
                  nativeButton={false}
                  aria-label="Clear search"
                >
                  <XIcon />
                </Button>
              </InputGroupAddon>
            )}
          </InputGroup>
        </form>
      </header>

      {emails.length === 0 ? (
        <div className="scroll-owner flex p-6">
          <Empty className="border-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <TrayIcon />
              </EmptyMedia>
              <EmptyTitle className="font-heading text-xl font-normal">
                {query ? "Nothing matches" : `${heading} is empty`}
              </EmptyTitle>
              <EmptyDescription>
                {query
                  ? `No messages match "${query}". Try a sender, subject or a word from the body.`
                  : (emptyHint ??
                    (mailbox === "inbox"
                      ? "Mail received through Resend will show up here."
                      : "Messages you send will show up here with their delivery status."))}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      ) : (
        <ul className="scroll-owner" aria-label={`${heading} messages`}>
          {emails.map((email, index) => (
            <MailRow
              key={email.id}
              email={email}
              mailbox={mailbox}
              index={index}
              selected={email.id === selectedId}
              query={query}
              time={formatListTime(email.createdAt, now)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
