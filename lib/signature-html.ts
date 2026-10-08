/**
 * Email signature model and renderers. Shared by the server (sending) and the
 * client (live previews), so it must stay free of server-only imports.
 *
 * The HTML is email-client safe: table layout, inline styles, web-safe fonts,
 * and every user value escaped. Links and images only accept http(s) URLs.
 */

export type SignatureFields = {
  name: string;
  title: string;
  company: string;
  address: string;
  phone: string;
  mobile: string;
  fax: string;
  website: string;
  logoUrl: string;
  accentColor: string;
  disclaimer: string;
};

export type SignatureFieldName = keyof SignatureFields;

export const DEFAULT_ACCENT = "#B08D3C";

export const EMPTY_SIGNATURE: SignatureFields = {
  name: "",
  title: "",
  company: "",
  address: "",
  phone: "",
  mobile: "",
  fax: "",
  website: "",
  logoUrl: "",
  accentColor: DEFAULT_ACCENT,
  disclaimer: "",
};

const MAX_LENGTH: Record<SignatureFieldName, number> = {
  name: 120,
  title: 120,
  company: 120,
  address: 300,
  phone: 40,
  mobile: 40,
  fax: 40,
  website: 300,
  logoUrl: 1000,
  accentColor: 7,
  disclaimer: 1500,
};

const FIELD_NAMES = Object.keys(EMPTY_SIGNATURE) as SignatureFieldName[];
const HEX_RE = /^#[0-9a-f]{6}$/i;

/** Adds https:// to bare domains and rejects anything that is not http(s). */
function normalizeUrl(value: string): string | null {
  if (!value) return "";
  const candidate = /^[a-z][a-z0-9+.-]*:/i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(candidate);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

/**
 * Trims, length-checks and validates raw input. Returns cleaned fields plus a
 * message per invalid field.
 */
export function normalizeSignature(raw: Partial<Record<SignatureFieldName, unknown>>): {
  fields: SignatureFields;
  errors: Partial<Record<SignatureFieldName, string>>;
} {
  const fields = { ...EMPTY_SIGNATURE };
  const errors: Partial<Record<SignatureFieldName, string>> = {};

  for (const key of FIELD_NAMES) {
    const input = raw[key];
    const value = typeof input === "string" ? input.replace(/\r\n/g, "\n").trim() : "";
    if (value.length > MAX_LENGTH[key]) {
      errors[key] = `Keep this under ${MAX_LENGTH[key]} characters.`;
    }
    fields[key] = value;
  }

  for (const key of ["website", "logoUrl"] as const) {
    const url = normalizeUrl(fields[key]);
    if (url === null) errors[key] = "Enter a web address starting with https://";
    else fields[key] = url;
  }

  if (!HEX_RE.test(fields.accentColor)) fields.accentColor = DEFAULT_ACCENT;

  return { fields, errors };
}

export function isSignatureEmpty(f: SignatureFields): boolean {
  return FIELD_NAMES.every((key) => key === "accentColor" || !f[key]);
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function lines(value: string): string[] {
  return value.split("\n").map((l) => l.trim()).filter(Boolean);
}

function websiteLabel(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function phoneParts(f: SignatureFields): string[] {
  return [
    f.phone && `${f.phone} office`,
    f.mobile && `${f.mobile} mobile`,
    f.fax && `${f.fax} fax`,
  ].filter(Boolean) as string[];
}

const FONT = "Georgia, 'Times New Roman', Times, serif";

export function renderSignatureHtml(f: SignatureFields): string {
  if (isSignatureEmpty(f)) return "";
  const accent = HEX_RE.test(f.accentColor) ? f.accentColor : DEFAULT_ACCENT;
  const e = escapeHtml;
  const row = (content: string, style = "") =>
    `<tr><td style="font-family:${FONT};font-size:14px;line-height:1.5;color:#1a1a1a;${style}">${content}</td></tr>`;

  const details: string[] = [];
  if (f.name) details.push(row(e(f.name), "font-size:20px;font-weight:bold;line-height:1.3;"));
  if (f.title) {
    details.push(row(e(f.title), `font-size:15px;font-style:italic;color:${accent};padding-bottom:6px;`));
  }
  if (f.company) {
    details.push(row(e(f.company), "font-weight:bold;text-transform:uppercase;letter-spacing:0.03em;padding-top:4px;"));
  }
  const address = lines(f.address);
  if (address.length) details.push(row(address.map(e).join("<br>")));
  const phones = phoneParts(f);
  if (phones.length) {
    details.push(row(phones.map(e).join(` <span style="color:${accent};">&nbsp;|&nbsp;</span> `)));
  }
  if (f.website) {
    details.push(
      row(
        `<a href="${e(f.website)}" style="color:${accent};text-decoration:none;">${e(websiteLabel(f.website))}</a>`,
      ),
    );
  }

  const detailsTable = `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${details.join("")}</table>`;

  const main = f.logoUrl
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr>` +
      `<td valign="middle" style="padding:0 22px 0 0;"><img src="${e(f.logoUrl)}" alt="${e(f.company || f.name)}" width="180" style="display:block;width:180px;max-width:180px;height:auto;border:0;"></td>` +
      `<td valign="middle" style="padding:2px 0 2px 22px;border-left:2px solid ${accent};">${detailsTable}</td>` +
      `</tr></table>`
    : detailsTable;

  const disclaimer = f.disclaimer
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;width:100%;max-width:640px;margin-top:16px;"><tr>` +
      `<td style="border-top:1px solid #d9d9d9;padding-top:10px;font-family:${FONT};font-size:11px;line-height:1.5;color:#777777;">${lines(f.disclaimer).map(e).join("<br>")}</td>` +
      `</tr></table>`
    : "";

  return `<div>${main}${disclaimer}</div>`;
}

export function renderSignatureText(f: SignatureFields): string {
  if (isSignatureEmpty(f)) return "";
  const phones = phoneParts(f);
  return [
    [f.name, f.title, f.company, ...lines(f.address), phones.join(" | "), f.website && websiteLabel(f.website)]
      .filter(Boolean)
      .join("\n"),
    f.disclaimer,
  ]
    .filter(Boolean)
    .join("\n\n");
}

/** Wraps an HTML fragment in a white page for sandboxed iframe previews. */
export function previewDocument(html: string): string {
  return `<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:16px;background:#ffffff;">${html}</body></html>`;
}
