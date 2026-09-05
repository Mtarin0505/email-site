"use client";

import Link from "next/link";
import { WarningCircleIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const fromResend = error.name === "ResendDataError";

  return (
    <div className="flex h-full items-center justify-center p-6">
      <Empty className="max-w-md border-0">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <WarningCircleIcon />
          </EmptyMedia>
          <EmptyTitle className="font-heading text-2xl font-normal">
            {fromResend ? "Resend did not answer" : "Something went wrong"}
          </EmptyTitle>
          <EmptyDescription className="[overflow-wrap:anywhere]">
            {error.message ||
              "The page could not be loaded. Try again in a moment."}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex-row justify-center gap-2">
          <Button onClick={() => reset()}>Try again</Button>
          <Button variant="outline" render={<Link href="/settings" />} nativeButton={false}>
            Check settings
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
