import "server-only";
import type { Domain, Email, EmailSummary, Mailbox } from "@/lib/types";
import { MOCK_DOMAINS, MOCK_EMAILS } from "./mock";
import { resendAdapter } from "./resend";

/**
 * Data access layer. Every screen reads through these functions.
 *
 * With RESEND_API_KEY set, data comes from the Resend API. Without it the
 * sample data in `mock.ts` is served so the UI can be worked on offline.
 */

export type DataSource = "resend" | "mock";

export function dataSource(): DataSource {
  return process.env.RESEND_API_KEY ? "resend" : "mock";
}

/* ---------- Mock adapter ---------- */

function toSummary(e: Email): EmailSummary {
  const { cc, bcc, replyTo, text, html, attachments, ...summary } = e;
  void cc;
  void bcc;
  void replyTo;
  void text;
  void html;
  void attachments;
  return summary;
}

const mockAdapter = {
  async listEmails(mailbox: Mailbox, query?: string): Promise<EmailSummary[]> {
    const direction = mailbox === "inbox" ? "inbound" : "outbound";
    const q = query?.trim().toLowerCase();
    return MOCK_EMAILS.filter((e) => e.direction === direction)
      .filter((e) => {
        if (!q) return true;
        const haystack = [
          e.subject,
          e.snippet,
          e.from.name,
          e.from.email,
          ...e.to.map((t) => `${t.name ?? ""} ${t.email}`),
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      })
      .map(toSummary)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async getEmail(id: string, mailbox?: Mailbox): Promise<Email | null> {
    const email = MOCK_EMAILS.find((e) => e.id === id) ?? null;
    if (!email || !mailbox) return email;
    const direction = mailbox === "inbox" ? "inbound" : "outbound";
    return email.direction === direction ? email : null;
  },

  async countUnread(): Promise<number> {
    return MOCK_EMAILS.filter((e) => e.direction === "inbound" && e.unread)
      .length;
  },

  async mailboxCounts(): Promise<Record<Mailbox, number>> {
    return {
      inbox: MOCK_EMAILS.filter((e) => e.direction === "inbound").length,
      sent: MOCK_EMAILS.filter((e) => e.direction === "outbound").length,
    };
  },

  async listDomains(): Promise<Domain[]> {
    return MOCK_DOMAINS;
  },

  async listSenderAddresses(): Promise<{ label: string; email: string }[]> {
    return [
      { label: "Halden Studio", email: "hello@haldenstudio.co" },
      { label: "Halden Billing", email: "billing@haldenstudio.co" },
      { label: "Newsletter", email: "newsletter@haldenstudio.co" },
    ];
  },
};

/* ---------- Dispatch ---------- */

function adapter() {
  return dataSource() === "resend" ? resendAdapter : mockAdapter;
}

export function listEmails(mailbox: Mailbox, query?: string) {
  return adapter().listEmails(mailbox, query);
}

export function getEmail(id: string, mailbox?: Mailbox) {
  return adapter().getEmail(id, mailbox);
}

export function countUnread() {
  return adapter().countUnread();
}

export function mailboxCounts() {
  return adapter().mailboxCounts();
}

export function listDomains() {
  return adapter().listDomains();
}

export function listSenderAddresses() {
  return adapter().listSenderAddresses();
}
