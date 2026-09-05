import { notFound } from "next/navigation";
import { MailDetail } from "@/components/mail/mail-detail";
import { MailEmptyDetail } from "@/components/mail/mail-empty-detail";
import { MailList } from "@/components/mail/mail-list";
import { MailboxShell } from "@/components/mail/mailbox-shell";
import {
  countUnread,
  dataSource,
  getEmail,
  listDomains,
  listEmails,
  mailboxCounts,
} from "@/lib/data";
import type { Mailbox } from "@/lib/types";

type Props = {
  mailbox: Mailbox;
  query?: string;
  /** When set, the detail pane shows this message. */
  id?: string;
};

/**
 * Shared server component behind /inbox, /inbox/[id], /sent and /sent/[id].
 */
export async function MailboxPage({ mailbox, query, id }: Props) {
  const [emails, counts, unread, email] = await Promise.all([
    listEmails(mailbox, query),
    mailboxCounts(),
    countUnread(),
    id ? getEmail(id, mailbox) : Promise.resolve(null),
  ]);

  if (id && !email) notFound();

  const emptyHint =
    emails.length === 0 && !query ? await describeEmpty(mailbox) : undefined;

  return (
    <MailboxShell
      hasDetail={Boolean(email)}
      list={
        <MailList
          mailbox={mailbox}
          emails={emails}
          query={query}
          total={counts[mailbox]}
          unread={mailbox === "inbox" ? unread : 0}
          selectedId={email?.id}
          emptyHint={emptyHint}
        />
      }
    >
      {email ? (
        <MailDetail email={email} mailbox={mailbox} />
      ) : (
        <MailEmptyDetail mailbox={mailbox} />
      )}
    </MailboxShell>
  );
}

/**
 * When the live account has nothing to show, say why rather than leaving a
 * generic empty state.
 */
async function describeEmpty(mailbox: Mailbox): Promise<string | undefined> {
  if (dataSource() !== "resend") return undefined;
  if (mailbox === "sent") {
    return "Nothing has been sent from this Resend team yet. Messages sent from Compose, or by any app using this team, will show up here with their delivery status.";
  }
  const domains = await listDomains();
  const receiving = domains.filter((d) => d.capabilities.receiving);
  if (receiving.length === 0) {
    const names = domains.map((d) => d.name).join(", ");
    return names
      ? `No domain has receiving enabled yet (${names}). Turn on receiving for a domain in Resend and add its MX record, then inbound mail will appear here.`
      : "No domains are set up in Resend yet. Add and verify a domain with receiving enabled to get inbound mail here.";
  }
  return `No inbound mail yet. Receiving is enabled on ${receiving.map((d) => d.name).join(", ")}.`;
}

export function readQuery(params: Record<string, string | string[] | undefined>) {
  const q = params.q;
  const value = Array.isArray(q) ? q[0] : q;
  return value?.trim() ? value.trim() : undefined;
}
