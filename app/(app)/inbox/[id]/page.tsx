import type { Metadata } from "next";
import { MailboxPage, readQuery } from "@/components/mail/mailbox-page";
import { getEmail } from "@/lib/data";

export async function generateMetadata({
  params,
}: PageProps<"/inbox/[id]">): Promise<Metadata> {
  const { id } = await params;
  const email = await getEmail(id, "inbox");
  return { title: email?.subject?.trim() || "Message" };
}

export default async function InboxMessagePage({
  params,
  searchParams,
}: PageProps<"/inbox/[id]">) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  return <MailboxPage mailbox="inbox" query={readQuery(sp)} id={id} />;
}
