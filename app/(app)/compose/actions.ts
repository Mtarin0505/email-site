"use server";

import { Resend } from "resend";

export type SendState = {
  ok?: boolean;
  id?: string;
  error?: string;
  fieldErrors?: Partial<Record<"from" | "to" | "subject" | "body", string>>;
};

const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

function parseAddresses(raw: string): string[] {
  return raw
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function sendEmail(
  _prev: SendState,
  formData: FormData,
): Promise<SendState> {
  const from = String(formData.get("from") ?? "").trim();
  const to = parseAddresses(String(formData.get("to") ?? ""));
  const cc = parseAddresses(String(formData.get("cc") ?? ""));
  const bcc = parseAddresses(String(formData.get("bcc") ?? ""));
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "");

  const fieldErrors: SendState["fieldErrors"] = {};
  if (!from || !EMAIL_RE.test(from)) fieldErrors.from = "Choose a sender address.";
  if (to.length === 0) fieldErrors.to = "Add at least one recipient.";
  const bad = [...to, ...cc, ...bcc].find((a) => !EMAIL_RE.test(a));
  if (bad) fieldErrors.to = `"${bad}" is not a valid email address.`;
  if (!subject) fieldErrors.subject = "Add a subject.";
  if (!body.trim()) fieldErrors.body = "Write a message.";

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return {
      error:
        "RESEND_API_KEY is not set on the server, so nothing was sent. Add it to .env to enable sending.",
    };
  }

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from,
    to,
    cc: cc.length ? cc : undefined,
    bcc: bcc.length ? bcc : undefined,
    subject,
    text: body,
  });

  if (error) {
    return { error: error.message };
  }

  return { ok: true, id: data?.id };
}
