import type { Metadata } from "next";
import { cookies } from "next/headers";
import { KeyIcon, ShieldCheckIcon, UserCircleIcon } from "@phosphor-icons/react/ssr";
import { PageHeader } from "@/components/app/page-header";
import { SignOutButton } from "@/components/app/sign-out-button";
import { Badge } from "@/components/ui/badge";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { dataSource } from "@/lib/data";

export const metadata: Metadata = { title: "Settings" };

function SettingRow({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof KeyIcon;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-5">
      <div className="flex items-start gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-md bg-muted">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-sm font-medium">{title}</span>
          <span className="text-sm text-muted-foreground">{description}</span>
        </div>
      </div>
      {children && <div className="shrink-0 sm:pl-4">{children}</div>}
    </div>
  );
}

export default async function SettingsPage() {
  const store = await cookies();
  const session = await verifySessionToken(store.get(SESSION_COOKIE)?.value);
  const hasApiKey = dataSource() === "resend";

  return (
    <div className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)]">
      <PageHeader
        title="Settings"
        description="Account access and the Resend connection for this dashboard."
      />
      <div className="scroll-owner">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 lg:p-6">
          <section className="flex flex-col gap-2">
            <h2 className="px-1 text-[0.6875rem] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
              Account
            </h2>
            <div className="divide-y rounded-lg border bg-card">
              <SettingRow
                icon={UserCircleIcon}
                title="Signed in as"
                description="Credentials are read from AUTH_USERNAME and AUTH_PASSWORD on the server."
              >
                <span className="font-mono text-[0.8125rem]">{session?.u ?? "admin"}</span>
              </SettingRow>
              <SettingRow
                icon={ShieldCheckIcon}
                title="Session"
                description="Signed cookie, valid for seven days. Signing out clears it on this device."
              >
                <SignOutButton />
              </SettingRow>
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="px-1 text-[0.6875rem] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
              Resend
            </h2>
            <div className="divide-y rounded-lg border bg-card">
              <SettingRow
                icon={KeyIcon}
                title="API key"
                description={
                  hasApiKey
                    ? "RESEND_API_KEY is set. Inbox, Sent and Domains show live data from Resend."
                    : "RESEND_API_KEY is not set. Sample data is shown and sending is disabled."
                }
              >
                <Badge
                  variant="secondary"
                  className={
                    hasApiKey
                      ? "h-[1.125rem] bg-status-delivered px-1.5 text-[0.6875rem] font-semibold tracking-[0.08em] text-status-delivered-fg uppercase"
                      : "h-[1.125rem] bg-status-queued px-1.5 text-[0.6875rem] font-semibold tracking-[0.08em] text-status-queued-fg uppercase"
                  }
                >
                  {hasApiKey ? "Connected" : "Not set"}
                </Badge>
              </SettingRow>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
