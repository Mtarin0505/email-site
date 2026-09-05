import type { Metadata } from "next";
import { MailboxPage, readQuery } from "@/components/mail/mailbox-page";

export const metadata: Metadata = { title: "Inbox" };

export default async function InboxPage({ searchParams }: PageProps<"/inbox">) {
  const query = readQuery(await searchParams);
  return <MailboxPage mailbox="inbox" query={query} />;
}
