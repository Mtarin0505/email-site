import type { Metadata } from "next";
import { CheckCircleIcon, WarningCircleIcon, ClockIcon, CircleDashedIcon } from "@phosphor-icons/react/ssr";
import { cn } from "cn";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { listDomains } from "@/lib/data";
import type { DomainStatus } from "@/lib/types";
import { format } from "date-fns";

export const metadata: Metadata = { title: "Domains" };

const STATUS: Record<
  DomainStatus,
  { label: string; className: string; icon: typeof CheckCircleIcon }
> = {
  verified: {
    label: "Verified",
    className: "bg-status-delivered text-status-delivered-fg",
    icon: CheckCircleIcon,
  },
  pending: {
    label: "Pending",
    className: "bg-status-queued text-status-queued-fg",
    icon: ClockIcon,
  },
  failed: {
    label: "Failed",
    className: "bg-status-bounced text-status-bounced-fg",
    icon: WarningCircleIcon,
  },
  not_started: {
    label: "Not started",
    className: "bg-muted text-muted-foreground",
    icon: CircleDashedIcon,
  },
};

export default async function DomainsPage() {
  const domains = await listDomains();

  return (
    <div className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)]">
      <PageHeader
        title="Domains"
        count={domains.length}
        description="Domains verified with Resend that you can send from and receive at."
      />
      <div className="scroll-owner">
        <ul className="mx-auto flex w-full max-w-3xl flex-col gap-3 p-4 lg:p-6">
          {domains.map((d, index) => {
            const s = STATUS[d.status];
            const Icon = s.icon;
            return (
              <li
                key={d.id}
                className="row-enter rounded-lg border bg-card"
                style={{ "--index": index } as React.CSSProperties}
              >
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b px-4 py-3 lg:px-5">
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate font-mono text-[0.9375rem]">{d.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {d.region} · added {format(new Date(d.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge
                      variant="outline"
                      className="h-[1.125rem] px-1.5 text-[0.6875rem] font-semibold tracking-[0.08em] uppercase"
                    >
                      {d.capabilities.sending ? "Sending on" : "Sending off"}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="h-[1.125rem] px-1.5 text-[0.6875rem] font-semibold tracking-[0.08em] uppercase"
                    >
                      {d.capabilities.receiving ? "Receiving on" : "Receiving off"}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "h-[1.125rem] px-1.5 text-[0.6875rem] font-semibold tracking-[0.08em] uppercase",
                        s.className,
                      )}
                    >
                      <Icon weight="fill" />
                      {s.label}
                    </Badge>
                  </div>
                </div>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 px-4 py-3 sm:grid-cols-4 lg:px-5">
                  {d.records.map((r) => {
                    const rs = STATUS[r.status];
                    const RIcon = rs.icon;
                    return (
                      <div key={r.type} className="flex flex-col gap-1">
                        <dt className="text-[0.6875rem] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                          {r.type}
                        </dt>
                        <dd className="flex items-center gap-1.5 text-sm">
                          <RIcon
                            weight="fill"
                            className={cn(
                              "size-4",
                              r.status === "verified" && "text-status-delivered-fg",
                              r.status === "pending" && "text-status-queued-fg",
                              r.status === "failed" && "text-status-bounced-fg",
                              r.status === "not_started" && "text-muted-foreground",
                            )}
                            aria-hidden="true"
                          />
                          {rs.label}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
