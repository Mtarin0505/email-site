import "server-only";
import { cache } from "react";
import { Resend } from "resend";
import type {
  Domain,
  Email,
  EmailSummary,
  Mailbox,
} from "@/lib/types";
import {
  mapDomainStatus,
  mapLastEvent,
  parseAddress,
  parseAddresses,
  worstStatus,
} from "./parse";

/**
 * Live adapter over the Resend API.
 *
 * Every call is wrapped in React `cache()` so the layout and the page share
 * one request per render instead of hitting the API twice.
 */

const PAGE_LIMIT = 100;

export class ResendDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ResendDataError";
  }
}

function client(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new ResendDataError("RESEND_API_KEY is not set.");
  return new Resend(key);
}

function fail(context: string, error: { message: string; name?: string }): never {
  throw new ResendDataError(`${context}: ${error.message}`);
}

/* ---------- Sent (outbound) ---------- */

const fetchSent = cache(async (): Promise<EmailSummary[]> => {
  const { data, error } = await client().emails.list({ limit: PAGE_LIMIT });
  if (error) fail("Could not load sent mail", error);
  return data.data.map((e) => ({
    id: e.id,
    direction: "outbound",
    from: parseAddress(e.from),
    to: parseAddresses(e.to),
    subject: e.subject ?? "",
    snippet: "",
    createdAt: e.created_at,
    status: mapLastEvent(e.last_event),
    unread: false,
    hasAttachments: false,
  }));
});

const fetchSentEmail = cache(async (id: string): Promise<Email | null> => {
  const { data, error } = await client().emails.get(id);
  if (error) {
    if (error.name === "not_found") return null;
    fail("Could not load the message", error);
  }
  return {
    id: data.id,
    direction: "outbound",
    from: parseAddress(data.from),
    to: parseAddresses(data.to),
    cc: parseAddresses(data.cc),
    bcc: parseAddresses(data.bcc),
    replyTo: parseAddresses(data.reply_to),
    subject: data.subject ?? "",
    snippet: "",
    createdAt: data.created_at,
    status: mapLastEvent(data.last_event),
    unread: false,
    hasAttachments: false,
    text: data.text ?? "",
    html: data.html ?? undefined,
    attachments: [],
  };
});

/* ---------- Inbox (inbound / receiving) ---------- */

const fetchInbox = cache(async (): Promise<EmailSummary[]> => {
  const { data, error } = await client().emails.receiving.list({
    limit: PAGE_LIMIT,
  });
  if (error) fail("Could not load the inbox", error);
  return data.data.map((e) => ({
    id: e.id,
    direction: "inbound",
    from: parseAddress(e.from),
    to: parseAddresses(e.to),
    subject: e.subject ?? "",
    snippet: "",
    createdAt: e.created_at,
    status: "received",
    unread: false,
    hasAttachments: (e.attachments?.length ?? 0) > 0,
  }));
});

const fetchInboundEmail = cache(async (id: string): Promise<Email | null> => {
  const { data, error } = await client().emails.receiving.get(id);
  if (error) {
    if (error.name === "not_found") return null;
    fail("Could not load the message", error);
  }
  return {
    id: data.id,
    direction: "inbound",
    from: parseAddress(data.from),
    to: parseAddresses(data.to),
    cc: parseAddresses(data.cc),
    bcc: parseAddresses(data.bcc),
    replyTo: parseAddresses(data.reply_to),
    subject: data.subject ?? "",
    snippet: "",
    createdAt: data.created_at,
    status: "received",
    unread: false,
    hasAttachments: data.attachments.length > 0,
    text: data.text ?? "",
    html: data.html ?? undefined,
    attachments: data.attachments.map((a) => ({
      id: a.id,
      filename: a.filename ?? "attachment",
      contentType: a.content_type,
      size: a.size,
    })),
  };
});

/* ---------- Domains ---------- */

const fetchDomains = cache(async (): Promise<Domain[]> => {
  const resend = client();
  const { data, error } = await resend.domains.list();
  if (error) fail("Could not load domains", error);

  const detailed = await Promise.all(
    data.data.map(async (d) => {
      const { data: full } = await resend.domains.get(d.id);
      const records = full?.records ?? [];
      const byType = (type: "SPF" | "DKIM" | "MX" | "DMARC") =>
        worstStatus(
          records
            .filter((r) => r.record === type)
            .map((r) => mapDomainStatus(r.status)),
        );
      return {
        id: d.id,
        name: d.name,
        status: mapDomainStatus(d.status),
        region: d.region,
        createdAt: d.created_at,
        capabilities: {
          sending: d.capabilities?.sending === "enabled",
          receiving: d.capabilities?.receiving === "enabled",
        },
        records: (["SPF", "DKIM", "MX", "DMARC"] as const).map((type) => ({
          type,
          status: byType(type),
        })),
      } satisfies Domain;
    }),
  );
  return detailed;
});

/* ---------- Public adapter ---------- */

function matches(e: EmailSummary, q: string): boolean {
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
}

export const resendAdapter = {
  async listEmails(mailbox: Mailbox, query?: string): Promise<EmailSummary[]> {
    const rows = mailbox === "inbox" ? await fetchInbox() : await fetchSent();
    const q = query?.trim().toLowerCase();
    return (q ? rows.filter((e) => matches(e, q)) : rows)
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async getEmail(id: string, mailbox?: Mailbox): Promise<Email | null> {
    if (mailbox === "inbox") return fetchInboundEmail(id);
    if (mailbox === "sent") return fetchSentEmail(id);
    return (await fetchInboundEmail(id)) ?? (await fetchSentEmail(id));
  },

  async countUnread(): Promise<number> {
    // Resend does not track read state for inbound mail.
    return 0;
  },

  async mailboxCounts(): Promise<Record<Mailbox, number>> {
    const [inbox, sent] = await Promise.all([fetchInbox(), fetchSent()]);
    return { inbox: inbox.length, sent: sent.length };
  },

  async listDomains(): Promise<Domain[]> {
    return fetchDomains();
  },

  async listSenderAddresses(): Promise<{ label: string; email: string }[]> {
    const [sent, domains] = await Promise.all([fetchSent(), fetchDomains()]);
    const seen = new Map<string, { label: string; email: string }>();
    for (const e of sent) {
      if (!seen.has(e.from.email)) {
        seen.set(e.from.email, {
          label: e.from.name ?? e.from.email,
          email: e.from.email,
        });
      }
    }
    for (const d of domains) {
      if (d.status !== "verified") continue;
      const email = `hello@${d.name}`;
      if (!seen.has(email)) seen.set(email, { label: d.name, email });
    }
    return [...seen.values()];
  },
};
