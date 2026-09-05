"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  checkCredentials,
  createSessionToken,
} from "@/lib/auth";

export type LoginState = {
  error?: string;
  /** Echoed back so the field keeps its value after a failed attempt. */
  username?: string;
};

function safeNextPath(value: FormDataEntryValue | null): string {
  if (typeof value !== "string") return "/inbox";
  // Only allow same-origin relative paths.
  if (!value.startsWith("/") || value.startsWith("//")) return "/inbox";
  return value;
}

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(formData.get("next"));

  if (!username || !password) {
    return { error: "Enter your username and password.", username };
  }

  if (!checkCredentials(username, password)) {
    return {
      error: "That username and password combination is not right.",
      username,
    };
  }

  const token = await createSessionToken(username);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });

  redirect(next);
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/login");
}
