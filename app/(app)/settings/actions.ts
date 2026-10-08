"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { saveSignature } from "@/lib/signature";
import {
  EMPTY_SIGNATURE,
  type SignatureFieldName,
  type SignatureFields,
  isSignatureEmpty,
  normalizeSignature,
} from "@/lib/signature-html";

export type SignatureState = {
  ok?: boolean;
  cleared?: boolean;
  error?: string;
  fieldErrors?: Partial<Record<SignatureFieldName, string>>;
  /** Echoed back so the fields keep their values after a save. */
  fields?: SignatureFields;
};

export async function updateSignature(
  _prev: SignatureState,
  formData: FormData,
): Promise<SignatureState> {
  // Server actions are reachable by direct POST, so check the session here
  // too. The username comes from the signed cookie, never from the form.
  const store = await cookies();
  const session = await verifySessionToken(store.get(SESSION_COOKIE)?.value);
  if (!session) {
    return { error: "Your session has expired. Sign in again to save changes." };
  }

  const raw = Object.fromEntries(
    Object.keys(EMPTY_SIGNATURE).map((key) => [key, formData.get(key)]),
  );
  const { fields, errors } = normalizeSignature(raw);

  if (Object.keys(errors).length > 0) {
    return { fieldErrors: errors, fields };
  }

  try {
    await saveSignature(session.u, fields);
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Could not save the signature.",
      fields,
    };
  }

  revalidatePath("/settings");
  return { ok: true, cleared: isSignatureEmpty(fields), fields };
}
