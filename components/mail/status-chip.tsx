import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import type { EmailStatus } from "@/lib/types";
import { STATUS_LABEL, statusTone, type StatusTone } from "@/lib/format";

const TONE_CLASS: Record<StatusTone, string> = {
  delivered: "bg-status-delivered text-status-delivered-fg",
  opened: "bg-status-opened text-status-opened-fg",
  queued: "bg-status-queued text-status-queued-fg",
  bounced: "bg-status-bounced text-status-bounced-fg",
  neutral: "bg-muted text-muted-foreground",
};

/**
 * Delivery status chip. The one place pastel colour is allowed.
 * Overline type: 11px, uppercase, wide tracking.
 */
export function StatusChip({
  status,
  className,
}: {
  status: EmailStatus;
  className?: string;
}) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "h-[1.125rem] px-1.5 text-[0.6875rem] font-semibold tracking-[0.08em] uppercase",
        TONE_CLASS[statusTone(status)],
        className,
      )}
    >
      {STATUS_LABEL[status]}
    </Badge>
  );
}
