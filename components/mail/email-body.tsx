"use client";

import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type Props = {
  text: string;
  html?: string;
};

/**
 * Message body. HTML mail renders in a fully sandboxed iframe (no scripts,
 * no same-origin access, no navigation) so nothing in the message can touch
 * the dashboard. Plain text renders directly.
 */
export function EmailBody({ text, html }: Props) {
  const hasHtml = Boolean(html?.trim());
  const hasText = Boolean(text.trim());
  const [view, setView] = useState<"html" | "text">(hasHtml ? "html" : "text");

  if (!hasHtml && !hasText) {
    return (
      <p className="text-sm text-muted-foreground">This message has no body.</p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {hasHtml && hasText && (
        <ToggleGroup
          value={[view]}
          onValueChange={(v) => {
            const next = v[0];
            if (next === "html" || next === "text") setView(next);
          }}
          aria-label="Body format"
          className="self-start"
        >
          <ToggleGroupItem value="html" aria-label="Rendered HTML">
            Rendered
          </ToggleGroupItem>
          <ToggleGroupItem value="text" aria-label="Plain text">
            Plain text
          </ToggleGroupItem>
        </ToggleGroup>
      )}

      {view === "html" && hasHtml ? (
        <iframe
          title="Message content"
          srcDoc={html}
          sandbox=""
          referrerPolicy="no-referrer"
          className="h-[70vh] w-full rounded-md border bg-white lg:h-[60vh]"
        />
      ) : (
        <div className="max-w-[72ch] text-[0.9375rem] leading-[1.65] whitespace-pre-wrap [overflow-wrap:anywhere]">
          {text}
        </div>
      )}
    </div>
  );
}
