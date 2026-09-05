/**
 * Cookie-based admin session.
 *
 * Credentials come from AUTH_USERNAME / AUTH_PASSWORD in .env. The session
 * cookie is an HMAC-signed payload so it can be verified in `proxy.ts`
 * without any database. Uses Web Crypto so it works in both Node and Edge.
 */

export const SESSION_COOKIE = "rm_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

type SessionPayload = {
  u: string; // username
  exp: number; // unix seconds
};

const encoder = new TextEncoder();

/**
 * Signing key material. Includes the configured username and password so
 * that changing either one in .env invalidates every existing session.
 */
function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "AUTH_SECRET is missing or too short. Set a long random string in .env",
    );
  }
  return [secret, process.env.AUTH_USERNAME ?? "", process.env.AUTH_PASSWORD ?? ""].join("|");
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

async function sign(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return toBase64Url(new Uint8Array(sig));
}

/** Constant-time string comparison. */
export function safeEqual(a: string, b: string): boolean {
  const ab = encoder.encode(a);
  const bb = encoder.encode(b);
  if (ab.length !== bb.length) return false;
  let diff = 0;
  for (let i = 0; i < ab.length; i++) diff |= ab[i] ^ bb[i];
  return diff === 0;
}

export function checkCredentials(username: string, password: string): boolean {
  const expectedUser = process.env.AUTH_USERNAME ?? "";
  const expectedPass = process.env.AUTH_PASSWORD ?? "";
  if (!expectedUser || !expectedPass) return false;
  // Evaluate both so timing does not leak which one failed.
  const userOk = safeEqual(username, expectedUser);
  const passOk = safeEqual(password, expectedPass);
  return userOk && passOk;
}

export async function createSessionToken(username: string): Promise<string> {
  const payload: SessionPayload = {
    u: username,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const body = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const sig = await sign(body);
  return `${body}.${sig}`;
}

export async function verifySessionToken(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  try {
    const expected = await sign(body);
    if (!safeEqual(sig, expected)) return null;
    const payload = JSON.parse(
      new TextDecoder().decode(fromBase64Url(body)),
    ) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp < Date.now() / 1000) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
