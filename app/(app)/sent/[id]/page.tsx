import type { Metadata } from "next";
import { MailboxPage, readQuery } from "@/components/mail/mailbox-page";
import { getEmail } from "@/lib/data";

export async function generateMetadata({
  params,
}: PageProps<"/sent/[id]">): Promise<Metadata> {
  const { id } = await params;
  const email = await getEmail(id, "sent");
  return { title: email?.subject?.trim() || "Message" };
}

export default async function SentMessagePage({
  params,
  searchParams,
}: PageProps<"/sent/[id]">) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  return <MailboxPage mailbox="sent" query={readQuery(sp)} id={id} />;
}
