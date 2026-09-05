import Link from "next/link";
import { cn } from "cn";

/** Product wordmark: a small ink square mark plus the serif name. */
export function Wordmark({
  className,
  compact = false,
  href = "/inbox",
}: {
  className?: string;
  compact?: boolean;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
      aria-label="Resend Mail home"
    >
      <span
        aria-hidden="true"
        className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground"
      >
        <svg viewBox="0 0 16 16" className="size-4" fill="none">
          <path
            d="M2.5 4.5h11v7h-11z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M2.5 5l5.5 4 5.5-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {!compact && (
        <span className="font-heading text-xl leading-none">Resend Mail</span>
      )}
    </Link>
  );
}
