"use client";

import { useActionState, useEffect, useId, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PaperPlaneTiltIcon, WarningCircleIcon, XIcon } from "@phosphor-icons/react";
import { sendEmail, type SendState } from "@/app/(app)/compose/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { previewDocument } from "@/lib/signature-html";

type Sender = { label: string; email: string };

/** The message being replied to or forwarded, sent below the signature. */
export type Quoted = {
  style: "reply" | "forward";
  intro: string;
  text: string;
};

type Props = {
  senders: Sender[];
  initial: { to: string; subject: string };
  quoted: Quoted | null;
  /** Rendered signature for the signed-in user, or null when none is set. */
  signatureHtml: string | null;
  mode: "new" | "reply" | "forward";
};

const initialState: SendState = {};

const TITLE = {
  new: "New message",
  reply: "Reply",
  forward: "Forward",
} as const;

export function ComposeForm({ senders, initial, quoted, signatureHtml, mode }: Props) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(sendEmail, initialState);
  const [from, setFrom] = useState(senders[0]?.email ?? "");
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [includeSignature, setIncludeSignature] = useState(Boolean(signatureHtml));
  const ids = {
    from: useId(),
    to: useId(),
    cc: useId(),
    bcc: useId(),
    subject: useId(),
    body: useId(),
    signature: useId(),
  };
  const errors = state.fieldErrors ?? {};

  useEffect(() => {
    if (state.ok) {
      toast.add({
        type: "success",
        title: "Message sent",
        description: state.id ? `Resend id ${state.id}` : undefined,
      });
      router.push("/sent");
    }
  }, [state.ok, state.id, router]);

  return (
    <form
      action={formAction}
      noValidate
      className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)_auto]"
    >
      <header className="flex h-(--topbar-h) shrink-0 items-center gap-2 border-b bg-card px-2 lg:bg-transparent lg:px-6">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-10 lg:hidden"
          render={<Link href="/inbox" />}
          nativeButton={false}
          aria-label="Discard and go back"
        >
          <XIcon className="size-5" />
        </Button>
        <h1 className="font-heading text-2xl leading-none">{TITLE[mode]}</h1>
        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <Button type="button" variant="ghost" render={<Link href="/inbox" />} nativeButton={false}>
            Discard
          </Button>
          <Button
            type="submit"
            disabled={pending}
            className="hover:bg-primary-hover active:scale-[0.98]"
          >
            {pending ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <PaperPlaneTiltIcon data-icon="inline-start" />
            )}
            {pending ? "Sending" : "Send"}
          </Button>
        </div>
      </header>

      <div className="scroll-owner">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4 lg:p-6">
          {state.error && (
            <Alert variant="destructive" role="alert">
              <WarningCircleIcon />
              <AlertTitle>Message not sent</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          <div className="rounded-lg border bg-card">
            <FieldGroup className="gap-0">
              <Field
                orientation="horizontal"
                className="items-center gap-3 border-b px-4 py-2"
                data-invalid={errors.from ? true : undefined}
              >
                <FieldLabel htmlFor={ids.from} className="w-14 shrink-0 text-muted-foreground">
                  From
                </FieldLabel>
                <input type="hidden" name="from" value={from} />
                <Select value={from} onValueChange={(v) => setFrom(String(v ?? ""))}>
                  <SelectTrigger
                    id={ids.from}
                    aria-invalid={errors.from ? true : undefined}
                    className="h-9 w-full border-0 pl-0 font-mono text-[0.8125rem] lg:h-8"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {senders.map((s) => (
                        <SelectItem key={s.email} value={s.email}>
                          <span className="flex flex-col">
                            <span className="text-sm">{s.label}</span>
                            <span className="font-mono text-xs text-muted-foreground">
                              {s.email}
                            </span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.from && <FieldError>{errors.from}</FieldError>}
              </Field>

              <Field
                orientation="horizontal"
                className="items-center gap-3 border-b px-4 py-2"
                data-invalid={errors.to ? true : undefined}
              >
                <FieldLabel htmlFor={ids.to} className="w-14 shrink-0 text-muted-foreground">
                  To
                </FieldLabel>
                <Input
                  id={ids.to}
                  name="to"
                  type="text"
                  inputMode="email"
                  autoComplete="off"
                  autoCapitalize="none"
                  defaultValue={initial.to}
                  aria-invalid={errors.to ? true : undefined}
                  placeholder="name@example.com, another@example.com"
                  className="h-9 border-0 px-0 font-mono text-[0.8125rem] shadow-none focus-visible:ring-0 lg:h-8"
                />
                {!showCcBcc && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    className="shrink-0 text-muted-foreground"
                    onClick={() => setShowCcBcc(true)}
                  >
                    Cc / Bcc
                  </Button>
                )}
              </Field>
              {errors.to && (
                <p className="px-4 pt-1 pb-2 text-sm text-destructive">{errors.to}</p>
              )}

              {showCcBcc && (
                <>
                  <Field orientation="horizontal" className="items-center gap-3 border-b px-4 py-2">
                    <FieldLabel htmlFor={ids.cc} className="w-14 shrink-0 text-muted-foreground">
                      Cc
                    </FieldLabel>
                    <Input
                      id={ids.cc}
                      name="cc"
                      type="text"
                      inputMode="email"
                      autoCapitalize="none"
                      className="h-9 border-0 px-0 font-mono text-[0.8125rem] focus-visible:ring-0 lg:h-8"
                    />
                  </Field>
                  <Field orientation="horizontal" className="items-center gap-3 border-b px-4 py-2">
                    <FieldLabel htmlFor={ids.bcc} className="w-14 shrink-0 text-muted-foreground">
                      Bcc
                    </FieldLabel>
                    <Input
                      id={ids.bcc}
                      name="bcc"
                      type="text"
                      inputMode="email"
                      autoCapitalize="none"
                      className="h-9 border-0 px-0 font-mono text-[0.8125rem] focus-visible:ring-0 lg:h-8"
                    />
                  </Field>
                </>
              )}

              <Field
                orientation="horizontal"
                className="items-center gap-3 border-b px-4 py-2"
                data-invalid={errors.subject ? true : undefined}
              >
                <FieldLabel htmlFor={ids.subject} className="w-14 shrink-0 text-muted-foreground">
                  Subject
                </FieldLabel>
                <Input
                  id={ids.subject}
                  name="subject"
                  defaultValue={initial.subject}
                  aria-invalid={errors.subject ? true : undefined}
                  className="h-9 border-0 px-0 text-base focus-visible:ring-0 lg:h-8 lg:text-sm"
                />
              </Field>
              {errors.subject && (
                <p className="px-4 pt-1 pb-2 text-sm text-destructive">{errors.subject}</p>
              )}

              <Field className="px-4 py-3" data-invalid={errors.body ? true : undefined}>
                <FieldLabel htmlFor={ids.body} className="sr-only">
                  Message
                </FieldLabel>
                <Textarea
                  id={ids.body}
                  name="body"
                  aria-invalid={errors.body ? true : undefined}
                  placeholder="Write your message"
                  autoFocus={mode === "reply"}
                  className="min-h-[40vh] resize-none border-0 px-0 py-0 text-[0.9375rem] leading-[1.65] focus-visible:ring-0 lg:min-h-72"
                />
                {errors.body && <FieldError>{errors.body}</FieldError>}
              </Field>
            </FieldGroup>

            {signatureHtml ? (
              <div className="flex flex-col gap-3 border-t px-4 py-3">
                <input type="hidden" name="includeSignature" value={includeSignature ? "on" : ""} />
                <div className="flex items-center gap-3">
                  <Switch
                    id={ids.signature}
                    checked={includeSignature}
                    onCheckedChange={setIncludeSignature}
                  />
                  <label htmlFor={ids.signature} className="text-sm">
                    Include signature
                  </label>
                  <Link
                    href="/settings"
                    className="ml-auto text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    Edit
                  </Link>
                </div>
                {includeSignature && (
                  <iframe
                    title="Signature preview"
                    srcDoc={previewDocument(signatureHtml)}
                    sandbox=""
                    referrerPolicy="no-referrer"
                    className="h-56 w-full rounded-md border bg-white"
                  />
                )}
              </div>
            ) : (
              <p className="border-t px-4 py-3 text-xs text-muted-foreground">
                No signature yet.{" "}
                <Link href="/settings" className="underline underline-offset-4 hover:text-foreground">
                  Add one in Settings
                </Link>
                .
              </p>
            )}

            {quoted && (
              <details className="border-t px-4 py-3">
                <input type="hidden" name="quoteStyle" value={quoted.style} />
                <input type="hidden" name="quoteIntro" value={quoted.intro} />
                <input type="hidden" name="quoteText" value={quoted.text} />
                <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                  {quoted.style === "reply" ? "Quoted message included" : "Forwarded message included"}
                </summary>
                <div className="mt-3 border-l-2 pl-3 text-sm leading-[1.6] whitespace-pre-wrap text-muted-foreground [overflow-wrap:anywhere]">
                  {quoted.intro}
                  {"\n\n"}
                  {quoted.text}
                </div>
              </details>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Sent through Resend as formatted HTML with a plain-text copy, from the address selected above.
          </p>
        </div>
      </div>

      <footer className="flex shrink-0 items-center gap-2 border-t bg-card p-3 lg:hidden">
        <Button
          type="button"
          variant="ghost"
          className="h-11 flex-1"
          render={<Link href="/inbox" />}
          nativeButton={false}
        >
          Discard
        </Button>
        <Button
          type="submit"
          disabled={pending}
          className="h-11 flex-[2] text-[0.9375rem] hover:bg-primary-hover active:scale-[0.98]"
        >
          {pending ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <PaperPlaneTiltIcon data-icon="inline-start" />
          )}
          {pending ? "Sending" : "Send"}
        </Button>
      </footer>
    </form>
  );
}
