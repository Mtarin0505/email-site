import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ComposeForm, type Quoted } from "@/components/compose/compose-form";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { getEmail, listSenderAddresses } from "@/lib/data";
import { formatAddress, formatFullTime } from "@/lib/format";
import { getSignature } from "@/lib/signature";
import { renderSignatureHtml } from "@/lib/signature-html";

export const metadata: Metadata = { title: "New message" };

export default async function ComposePage({ searchParams }: PageProps<"/compose">) {
  const sp = await searchParams;
  const replyId = typeof sp.reply === "string" ? sp.reply : undefined;
  const forwardId = typeof sp.forward === "string" ? sp.forward : undefined;

  const store = await cookies();
  const session = await verifySessionToken(store.get(SESSION_COOKIE)?.value);

  const [senders, source, signature] = await Promise.all([
    listSenderAddresses(),
    replyId || forwardId ? getEmail((replyId ?? forwardId) as string) : null,
    // A missing signature should never block writing a message.
    session ? getSignature(session.u).catch(() => null) : null,
  ]);

  let initial = { to: "", subject: "" };
  let quoted: Quoted | null = null;
  let mode: "new" | "reply" | "forward" = "new";

  if (source && replyId) {
    mode = "reply";
    const replyTarget = source.replyTo[0] ?? source.from;
    initial = {
      to: replyTarget.email,
      subject: source.subject.startsWith("Re:") ? source.subject : `Re: ${source.subject}`,
    };
    quoted = {
      style: "reply",
      intro: `On ${formatFullTime(source.createdAt)}, ${formatAddress(source.from)} wrote:`,
      text: source.text,
    };
  } else if (source && forwardId) {
    mode = "forward";
    initial = {
      to: "",
      subject: source.subject.startsWith("Fwd:") ? source.subject : `Fwd: ${source.subject}`,
    };
    quoted = {
      style: "forward",
      intro: `---------- Forwarded message ----------\nFrom: ${formatAddress(source.from)}\nDate: ${formatFullTime(source.createdAt)}\nSubject: ${source.subject}\nTo: ${source.to.map(formatAddress).join(", ")}`,
      text: source.text,
    };
  }

  return (
    <ComposeForm
      senders={senders}
      initial={initial}
      quoted={quoted}
      signatureHtml={signature ? renderSignatureHtml(signature) : null}
      mode={mode}
    />
  );
}
