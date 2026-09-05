import { cn } from "cn";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Address } from "@/lib/types";
import { initials } from "@/lib/format";

export function InitialsAvatar({
  address,
  size = "default",
  className,
}: {
  address: Address;
  size?: "default" | "lg";
  className?: string;
}) {
  return (
    <Avatar size={size} className={cn("shrink-0", className)}>
      <AvatarFallback className="bg-muted text-xs font-semibold tracking-[0.02em] text-foreground group-data-[size=lg]/avatar:text-sm">
        {initials(address)}
      </AvatarFallback>
    </Avatar>
  );
}
