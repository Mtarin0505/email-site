/**
 * Domain types. Shaped to line up with the Resend API so the mock adapter
 * can be swapped for the real client without touching the UI.
 */

export type EmailDirection = "inbound" | "outbound";

/** Mirrors Resend's `last_event` values plus `received` for inbound mail. */
export type EmailStatus =
  | "received"
  | "queued"
  | "sent"
  | "delivered"
  | "delivery_delayed"
  | "opened"
  | "clicked"
  | "bounced"
  | "complained"
  | "failed"
  | "canceled";

export type Address = {
  name?: string;
  email: string;
};

export type Attachment = {
  id: string;
  filename: string;
  contentType: string;
  /** bytes */
  size: number;
};

export type EmailSummary = {
  id: string;
  direction: EmailDirection;
  from: Address;
  to: Address[];
  subject: string;
  snippet: string;
  /** ISO 8601 */
  createdAt: string;
  status: EmailStatus;
  unread: boolean;
  hasAttachments: boolean;
};

export type Email = EmailSummary & {
  cc: Address[];
  bcc: Address[];
  replyTo: Address[];
  text: string;
  html?: string;
  attachments: Attachment[];
};

export type Mailbox = "inbox" | "sent";

export type DomainStatus = "verified" | "pending" | "failed" | "not_started";

export type Domain = {
  id: string;
  name: string;
  status: DomainStatus;
  region: string;
  createdAt: string;
  capabilities: { sending: boolean; receiving: boolean };
  records: {
    type: "SPF" | "DKIM" | "MX" | "DMARC";
    status: DomainStatus;
  }[];
};
