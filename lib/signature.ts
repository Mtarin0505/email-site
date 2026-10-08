import "server-only";
import { Resend } from "resend";
import {
  type SignatureFields,
  isSignatureEmpty,
  normalizeSignature,
  renderSignatureHtml,
  renderSignatureText,
} from "@/lib/signature-html";

/**
 * Per-user email signature, editable from Settings without a redeploy.
 *
 * There is no database, so the signature is stored in the Resend account as a
 * template whose alias is derived from the username. The template's HTML is
 * the rendered signature (so it previews in the Resend dashboard) prefixed
 * with an HTML comment carrying the editable fields as base64 JSON.
 *
 * Without RESEND_API_KEY it falls back to process memory so the UI still works
 * on sample data; that copy is lost on restart.
 */

const DATA_PREFIX = "<!--signature-data:";
const DATA_SUFFIX = "-->";

const memoryStore = new Map<string, SignatureFields>();

function client(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

function templateAlias(username: string): string {
  const slug = username.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `dashboard-signature-${slug || "user"}`;
}

function encodeFields(fields: SignatureFields): string {
  return Buffer.from(JSON.stringify(fields), "utf8").toString("base64url");
}

function decodeFields(html: string): SignatureFields | null {
  if (!html.startsWith(DATA_PREFIX)) return null;
  const end = html.indexOf(DATA_SUFFIX, DATA_PREFIX.length);
  if (end === -1) return null;
  try {
    const raw = JSON.parse(
      Buffer.from(html.slice(DATA_PREFIX.length, end), "base64url").toString("utf8"),
    );
    // Re-validate on read; the template can also be edited in the Resend dashboard.
    return normalizeSignature(raw).fields;
  } catch {
    return null;
  }
}

/** The user's saved signature, or null when none is set. */
export async function getSignature(username: string): Promise<SignatureFields | null> {
  const resend = client();
  if (!resend) return memoryStore.get(username) ?? null;

  const { data, error } = await resend.templates.get(templateAlias(username));
  if (error) {
    if (error.name === "not_found") return null;
    throw new Error(`Could not load signature: ${error.message}`);
  }
  const fields = decodeFields(data.html);
  return fields && !isSignatureEmpty(fields) ? fields : null;
}

/** Saves already-normalized fields. An empty signature removes it. */
export async function saveSignature(username: string, fields: SignatureFields): Promise<void> {
  const empty = isSignatureEmpty(fields);
  const resend = client();
  if (!resend) {
    if (empty) memoryStore.delete(username);
    else memoryStore.set(username, fields);
    return;
  }

  const alias = templateAlias(username);

  if (empty) {
    const { error } = await resend.templates.remove(alias);
    if (error && error.name !== "not_found") {
      throw new Error(`Could not clear signature: ${error.message}`);
    }
    return;
  }

  const content = {
    html: `${DATA_PREFIX}${encodeFields(fields)}${DATA_SUFFIX}${renderSignatureHtml(fields)}`,
    text: renderSignatureText(fields),
  };
  const updated = await resend.templates.update(alias, content);
  if (!updated.error) return;
  if (updated.error.name !== "not_found") {
    throw new Error(`Could not save signature: ${updated.error.message}`);
  }

  const created = await resend.templates.create({
    name: `Dashboard signature (${username})`,
    alias,
    ...content,
  });
  if (created.error) {
    throw new Error(`Could not save signature: ${created.error.message}`);
  }
}
