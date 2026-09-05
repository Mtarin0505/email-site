import type { Metadata } from "next";
import { ComposeForm } from "@/components/compose/compose-form";
import { getEmail, listSenderAddresses } from "@/lib/data";
import { formatAddress, formatFullTime } from "@/lib/format";

export const metadata: Metadata = { title: "New message" };

export default async function ComposePage({ searchParams }: PageProps<"/compose">) {
  const sp = await searchParams;
  const replyId = typeof sp.reply === "string" ? sp.reply : undefined;
  const forwardId = typeof sp.forward === "string" ? sp.forward : undefined;

  const [senders, source] = await Promise.all([
    listSenderAddresses(),
    replyId || forwardId ? getEmail((replyId ?? forwardId) as string) : null,
  ]);

  let initial = { to: "", subject: "", body: "" };
  let mode: "new" | "reply" | "forward" = "new";

  if (source && replyId) {
    mode = "reply";
    const replyTarget = source.replyTo[0] ?? source.from;
    initial = {
      to: replyTarget.email,
      subject: source.subject.startsWith("Re:") ? source.subject : `Re: ${source.subject}`,
      body: `\n\nOn ${formatFullTime(source.createdAt)}, ${formatAddress(source.from)} wrote:\n\n${quote(source.text)}`,
    };
  } else if (source && forwardId) {
    mode = "forward";
    initial = {
      to: "",
      subject: source.subject.startsWith("Fwd:") ? source.subject : `Fwd: ${source.subject}`,
      body: `\n\n---------- Forwarded message ----------\nFrom: ${formatAddress(source.from)}\nDate: ${formatFullTime(source.createdAt)}\nSubject: ${source.subject}\nTo: ${source.to.map(formatAddress).join(", ")}\n\n${source.text}`,
    };
  }

  return <ComposeForm senders={senders} initial={initial} mode={mode} />;
}

function quote(text: string): string {
  return text
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n");
}
