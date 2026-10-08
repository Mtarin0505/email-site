"use server";

import { cookies } from "next/headers";
import { Resend } from "resend";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { getSignature } from "@/lib/signature";
import {
  escapeHtml,
  renderSignatureHtml,
  renderSignatureText,
} from "@/lib/signature-html";

export type SendState = {
  ok?: boolean;
  id?: string;
  error?: string;
  fieldErrors?: Partial<Record<"from" | "to" | "subject" | "body", string>>;
};

const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

const BODY_STYLE =
  "font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#1a1a1a;";

function parseAddresses(raw: string): string[] {
  return raw
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function textToHtml(text: string): string {
  return escapeHtml(text.replace(/\r\n/g, "\n")).replace(/\n/g, "<br>");
}

export async function sendEmail(
  _prev: SendState,
  formData: FormData,
): Promise<SendState> {
  // Server actions are reachable by direct POST, so check the session here too.
  const store = await cookies();
  const session = await verifySessionToken(store.get(SESSION_COOKIE)?.value);
  if (!session) {
    return { error: "Your session has expired. Sign in again to send." };
  }

  const from = String(formData.get("from") ?? "").trim();
  const to = parseAddresses(String(formData.get("to") ?? ""));
  const cc = parseAddresses(String(formData.get("cc") ?? ""));
  const bcc = parseAddresses(String(formData.get("bcc") ?? ""));
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").replace(/\s+$/, "");
  const includeSignature = formData.get("includeSignature") === "on";
  const quoteStyle = formData.get("quoteStyle");
  const quoteIntro = String(formData.get("quoteIntro") ?? "");
  const quoteText = String(formData.get("quoteText") ?? "");

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

  // The form only says whether to include the signature; its content is
  // loaded here for the signed-in user so it cannot be swapped client-side.
  let signatureHtml = "";
  let signatureText = "";
  if (includeSignature) {
    try {
      const signature = await getSignature(session.u);
      if (signature) {
        signatureHtml = renderSignatureHtml(signature);
        signatureText = renderSignatureText(signature);
      }
    } catch {
      return {
        error:
          "Your signature could not be loaded, so nothing was sent. Try again, or turn off Include signature.",
      };
    }
  }

  const hasQuote = (quoteStyle === "reply" || quoteStyle === "forward") && quoteText.trim();
  const quotedBody =
    quoteStyle === "reply"
      ? quoteText.split("\n").map((line) => `> ${line}`).join("\n")
      : quoteText;

  const text = [
    body,
    signatureText && `-- \n${signatureText}`,
    hasQuote && `${quoteIntro}\n\n${quotedBody}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const html =
    `<div style="${BODY_STYLE}">` +
    `<div>${textToHtml(body)}</div>` +
    (signatureHtml ? `<div style="margin-top:24px;">${signatureHtml}</div>` : "") +
    (hasQuote
      ? `<div style="margin-top:24px;color:#555555;">` +
        `<div>${textToHtml(quoteIntro)}</div>` +
        `<blockquote style="margin:8px 0 0 0;padding:0 0 0 12px;border-left:2px solid #d9d9d9;">${textToHtml(quoteText)}</blockquote>` +
        `</div>`
      : "") +
    `</div>`;

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from,
    to,
    cc: cc.length ? cc : undefined,
    bcc: bcc.length ? bcc : undefined,
    subject,
    html,
    text,
  });

  if (error) {
    return { error: error.message };
  }

  return { ok: true, id: data?.id };
}
