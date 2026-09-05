import { EnvelopeSimpleIcon } from "@phosphor-icons/react/ssr";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Kbd, KbdGroup } from "@/components/ui/kbd";

/** Desktop-only placeholder shown in the detail pane when nothing is selected. */
export function MailEmptyDetail({ mailbox }: { mailbox: "inbox" | "sent" }) {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <Empty className="max-w-sm border-0">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <EnvelopeSimpleIcon />
          </EmptyMedia>
          <EmptyTitle className="font-heading text-2xl font-normal">
            Select a message
          </EmptyTitle>
          <EmptyDescription>
            {mailbox === "inbox"
              ? "Pick something from the list to read it here."
              : "Pick a sent message to see who received it and its delivery events."}
          </EmptyDescription>
        </EmptyHeader>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>New message</span>
          <KbdGroup>
            <Kbd>C</Kbd>
          </KbdGroup>
        </div>
      </Empty>
    </div>
  );
}
