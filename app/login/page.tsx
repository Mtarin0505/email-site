import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";
import { Wordmark } from "@/components/app/wordmark";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: PageProps<"/login">) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : "/inbox";

  return (
    <main className="grid min-h-dvh grid-rows-[auto_1fr_auto] bg-background">
      <header className="flex items-center px-6 py-5">
        <Wordmark />
      </header>

      <section className="flex items-start justify-center px-4 pt-6 pb-12 sm:items-center sm:pt-0">
        <div className="w-full max-w-[380px]">
          <div className="mb-8 flex flex-col gap-2">
            <h1 className="font-heading text-[clamp(2rem,5vw,2.75rem)] leading-[1.05] tracking-[-0.02em]">
              Welcome back.
            </h1>
            <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
              Sign in to read, search and send mail from your Resend account.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-5 sm:p-6">
            <LoginForm next={next} />
          </div>
        </div>
      </section>

      <footer className="px-6 py-5 text-xs text-muted-foreground">
        Access is limited to the account configured on this server.
      </footer>
    </main>
  );
}
