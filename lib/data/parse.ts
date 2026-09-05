import type { Address, DomainStatus, EmailStatus } from "@/lib/types";

/** Parse `Name <user@host>` or `user@host` into an Address. */
export function parseAddress(raw: string): Address {
  const value = raw.trim();
  const match = value.match(/^(.*?)\s*<([^<>]+)>$/);
  if (match) {
    const name = match[1].replace(/^"|"$/g, "").trim();
    return name ? { name, email: match[2].trim() } : { email: match[2].trim() };
  }
  return { email: value };
}

export function parseAddresses(raw: string[] | null | undefined): Address[] {
  return (raw ?? []).filter(Boolean).map(parseAddress);
}

/** Map Resend `last_event` values onto the dashboard's status set. */
export function mapLastEvent(event: string): EmailStatus {
  switch (event) {
    case "scheduled":
      return "queued";
    case "suppressed":
      return "failed";
    case "queued":
    case "sent":
    case "delivered":
    case "delivery_delayed":
    case "opened":
    case "clicked":
    case "bounced":
    case "complained":
    case "failed":
    case "canceled":
      return event;
    default:
      return "sent";
  }
}

export function mapDomainStatus(status: string): DomainStatus {
  switch (status) {
    case "verified":
      return "verified";
    case "failed":
    case "partially_failed":
      return "failed";
    case "not_started":
      return "not_started";
    default:
      // pending, partially_verified, temporary_failure
      return "pending";
  }
}

const SEVERITY: Record<DomainStatus, number> = {
  failed: 3,
  pending: 2,
  not_started: 1,
  verified: 0,
};

/** Worst status wins when a record type has several entries. */
export function worstStatus(statuses: DomainStatus[]): DomainStatus {
  if (statuses.length === 0) return "not_started";
  return statuses.reduce((worst, s) =>
    SEVERITY[s] > SEVERITY[worst] ? s : worst,
  );
}
