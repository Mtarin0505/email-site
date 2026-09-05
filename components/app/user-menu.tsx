"use client";

import { CaretUpDownIcon, GearSixIcon, SignOutIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { logout } from "@/app/login/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu({ username }: { username: string }) {
  const letter = username.slice(0, 1).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account menu"
        className="flex h-10 w-full items-center gap-2.5 rounded-md px-1.5 text-left text-sm outline-none transition-colors duration-150 ease-out hover:bg-sidebar-accent focus-visible:ring-3 focus-visible:ring-ring/50 aria-expanded:bg-sidebar-accent lg:px-2"
      >
        <Avatar size="sm" className="shrink-0">
          <AvatarFallback className="bg-primary text-[0.6875rem] font-semibold text-primary-foreground">
            {letter}
          </AvatarFallback>
        </Avatar>
        <span className="hidden min-w-0 flex-1 truncate font-medium lg:inline">
          {username}
        </span>
        <CaretUpDownIcon
          className="hidden size-4 shrink-0 text-muted-foreground lg:inline"
          aria-hidden="true"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-mono text-xs text-muted-foreground">
            Signed in as {username}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link href="/settings" />} nativeButton={false}>
            <GearSixIcon />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => logout()}>
            <SignOutIcon />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
