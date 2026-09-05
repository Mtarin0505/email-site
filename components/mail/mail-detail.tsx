import { PaperclipIcon } from "@phosphor-icons/react/ssr";
import { InitialsAvatar } from "@/components/mail/initials-avatar";
import { EmailBody } from "@/components/mail/email-body";
import { MailActions } from "@/components/mail/mail-actions";
import { StatusChip } from "@/components/mail/status-chip";
import { Separator } from "@/components/ui/separator";
import type { Address, Email, Mailbox } from "@/lib/types";
import { displayName, formatBytes, formatFullTime } from "@/lib/format";

function AddressList({ label, list }: { label: string; list: Address[] }) {
  if (list.length === 0) return null;
  return (
    <div className="flex gap-2 text-sm">
      <span className="w-10 shrink-0 text-muted-foreground">{label}</span>
      <span className="min-w-0 [overflow-wrap:anywhere] font-mono text-[0.8125rem] leading-relaxed text-foreground/90">
        {list.map((a, i) => (
          <span key={a.email}>
            {a.name ? `${a.name} <${a.email}>` : a.email}
            {i < list.length - 1 ? ", " : ""}
          </span>
        ))}
      </span>
    </div>
  );
}

/**
 * Detail pane. Header is a fixed row; the article owns the scroll.
 */
export function MailDetail({ email, mailbox }: { email: Email; mailbox: Mailbox }) {
  const subject = email.subject.trim() || "(no subject)";
  const primary = mailbox === "inbox" ? email.from : (email.to[0] ?? email.from);

  return (
    <div className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)]">
      <MailActions email={email} mailbox={mailbox} />

      <article className="scroll-owner">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4 lg:gap-5 lg:p-6">
          <header className="flex flex-col gap-4">
            <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
              <h2 className="min-w-0 flex-1 text-lg font-medium leading-snug tracking-[-0.01em] text-balance">
                {subject}
              </h2>
              <StatusChip status={email.status} className="mt-1" />
            </div>

            <div className="flex items-start gap-3">
              <InitialsAvatar address={primary} size="lg" className="mt-0.5" />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                  <span className="text-sm font-semibold">
                    {displayName(email.from)}
                  </span>
                  <time
                    dateTime={email.createdAt}
                    className="text-xs font-medium tracking-[0.02em] text-muted-foreground"
                  >
                    {formatFullTime(email.createdAt)}
                  </time>
                </div>
                <div className="flex flex-col gap-0.5">
                  <AddressList label="From" list={[email.from]} />
                  <AddressList label="To" list={email.to} />
                  <AddressList label="Cc" list={email.cc} />
                  <AddressList label="Bcc" list={email.bcc} />
                  <AddressList label="Reply" list={email.replyTo} />
                </div>
              </div>
            </div>
          </header>

          <Separator />

          <div className="rounded-lg border bg-card p-4 lg:p-6">
            <EmailBody text={email.text} html={email.html} />
          </div>

          {email.attachments.length > 0 && (
            <section aria-label="Attachments" className="flex flex-col gap-2">
              <h3 className="text-[0.6875rem] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                {email.attachments.length} attachment
                {email.attachments.length === 1 ? "" : "s"}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {email.attachments.map((att) => (
                  <li key={att.id}>
                    <a
                      href="#"
                      className="flex max-w-full items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm outline-none transition-colors duration-150 ease-out hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <PaperclipIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      <span className="min-w-0 truncate font-mono text-[0.8125rem]">
                        {att.filename}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                        {formatBytes(att.size)}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <p className="font-mono text-[0.6875rem] text-muted-foreground break-all">
            id {email.id}
          </p>
        </div>
      </article>
    </div>
  );
}
