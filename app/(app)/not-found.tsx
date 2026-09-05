import Link from "next/link";
import { EnvelopeSimpleIcon } from "@phosphor-icons/react/ssr";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function NotFound() {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <Empty className="max-w-sm border-0">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <EnvelopeSimpleIcon />
          </EmptyMedia>
          <EmptyTitle className="font-heading text-2xl font-normal">
            Message not found
          </EmptyTitle>
          <EmptyDescription>
            It may have been deleted, or the link is not right.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" render={<Link href="/inbox" />} nativeButton={false}>
            Back to inbox
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
