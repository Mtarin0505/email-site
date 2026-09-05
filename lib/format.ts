import {
  format,
  isSameYear,
  isToday,
  isYesterday,
} from "date-fns";
import type { Address, EmailStatus } from "@/lib/types";

/** Compact timestamp for list rows: "14:32", "Yesterday", "Mar 4", "Mar 4, 2025". */
export function formatListTime(iso: string, now: Date = new Date()): string {
  const d = new Date(iso);
  if (isToday(d)) return format(d, "HH:mm");
  if (isYesterday(d)) return "Yesterday";
  if (isSameYear(d, now)) return format(d, "MMM d");
  return format(d, "MMM d, yyyy");
}

/** Full timestamp for detail headers. */
export function formatFullTime(iso: string): string {
  return format(new Date(iso), "EEE, MMM d, yyyy 'at' HH:mm");
}

export function formatAddress(a: Address): string {
  return a.name ? `${a.name} <${a.email}>` : a.email;
}

export function displayName(a: Address): string {
  return a.name ?? a.email.split("@")[0];
}

export function initials(a: Address): string {
  const source = a.name ?? a.email;
  const parts = source
    .replace(/@.*$/, "")
    .split(/[\s._-]+/)
    .filter(Boolean);
  const letters = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "");
  return letters.join("") || "?";
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const STATUS_LABEL: Record<EmailStatus, string> = {
  received: "Received",
  queued: "Queued",
  sent: "Sent",
  delivered: "Delivered",
  delivery_delayed: "Delayed",
  opened: "Opened",
  clicked: "Clicked",
  bounced: "Bounced",
  complained: "Complained",
  failed: "Failed",
  canceled: "Canceled",
};

export type StatusTone = "delivered" | "opened" | "queued" | "bounced" | "neutral";

export function statusTone(status: EmailStatus): StatusTone {
  switch (status) {
    case "delivered":
      return "delivered";
    case "opened":
    case "clicked":
      return "opened";
    case "queued":
    case "sent":
    case "delivery_delayed":
      return "queued";
    case "bounced":
    case "complained":
    case "failed":
    case "canceled":
      return "bounced";
    default:
      return "neutral";
  }
}
