import type { Metadata } from "next";
import { MailboxPage, readQuery } from "@/components/mail/mailbox-page";

export const metadata: Metadata = { title: "Sent" };

export default async function SentPage({ searchParams }: PageProps<"/sent">) {
  const query = readQuery(await searchParams);
  return <MailboxPage mailbox="sent" query={query} />;
}
