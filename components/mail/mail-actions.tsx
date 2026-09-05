"use client";

import Link from "next/link";
import {
  ArrowBendUpLeftIcon,
  ArrowBendUpRightIcon,
  ArrowLeftIcon,
  DotsThreeIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/components/ui/toast";
import type { Email, Mailbox } from "@/lib/types";

const TITLE: Record<Mailbox, string> = { inbox: "Inbox", sent: "Sent" };

export function MailActions({ email, mailbox }: { email: Email; mailbox: Mailbox }) {
  const replyHref = `/compose?reply=${encodeURIComponent(email.id)}`;
  const forwardHref = `/compose?forward=${encodeURIComponent(email.id)}`;

  return (
    <div className="flex h-(--topbar-h) shrink-0 items-center gap-1 border-b bg-card px-2 lg:bg-transparent lg:px-4">
      <Button
        variant="ghost"
        size="icon"
        className="size-10 lg:hidden"
        render={<Link href={`/${mailbox}`} />}
        nativeButton={false}
        aria-label={`Back to ${TITLE[mailbox]}`}
      >
        <ArrowLeftIcon className="size-5" />
      </Button>

      <span className="hidden text-xs font-medium tracking-[0.02em] text-muted-foreground lg:inline">
        {TITLE[mailbox]}
      </span>

      <div className="ml-auto flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="size-10 lg:size-8"
                render={<Link href={replyHref} />}
                nativeButton={false}
                aria-label="Reply"
              />
            }
          >
            <ArrowBendUpLeftIcon className="size-5 lg:size-4" />
          </TooltipTrigger>
          <TooltipContent>Reply</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="size-10 lg:size-8"
                render={<Link href={forwardHref} />}
                nativeButton={false}
                aria-label="Forward"
              />
            }
          >
            <ArrowBendUpRightIcon className="size-5 lg:size-4" />
          </TooltipTrigger>
          <TooltipContent>Forward</TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="size-10 lg:size-8"
                aria-label="More actions"
              />
            }
          >
            <DotsThreeIcon weight="bold" className="size-5 lg:size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuGroup>
              <DropdownMenuItem
                variant="destructive"
                onClick={() =>
                  toast.add({
                    title: "Cannot delete",
                    description: "Resend keeps messages for its retention period; the API has no delete endpoint.",
                  })
                }
              >
                <TrashIcon />
                Delete message
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
