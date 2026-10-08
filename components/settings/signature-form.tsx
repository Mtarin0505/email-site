"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { FloppyDiskIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { updateSignature, type SignatureState } from "@/app/(app)/settings/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import {
  type SignatureFieldName,
  type SignatureFields,
  previewDocument,
  renderSignatureHtml,
} from "@/lib/signature-html";

type Props = {
  initial: SignatureFields;
};

export function SignatureForm({ initial }: Props) {
  const [state, formAction, pending] = useActionState<SignatureState, FormData>(
    updateSignature,
    { fields: initial },
  );

  useEffect(() => {
    if (state.ok) {
      toast.add({
        type: "success",
        title: state.cleared ? "Signature removed" : "Signature saved",
      });
    }
  }, [state]);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5 px-4 py-4 lg:px-5">
      {state.error && (
        <Alert variant="destructive" role="alert">
          <WarningCircleIcon />
          <AlertTitle>Signature not saved</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      {/* Remount after each save so fields show the cleaned, stored values. */}
      <SignatureEditor
        key={JSON.stringify(state.fields)}
        initial={state.fields ?? initial}
        errors={state.fieldErrors ?? {}}
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={pending}
          className="h-9 w-full hover:bg-primary-hover active:scale-[0.98] sm:w-auto"
        >
          {pending ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <FloppyDiskIcon data-icon="inline-start" />
          )}
          {pending ? "Saving" : "Save signature"}
        </Button>
      </div>
    </form>
  );
}

type EditorProps = {
  initial: SignatureFields;
  errors: Partial<Record<SignatureFieldName, string>>;
};

function SignatureEditor({ initial, errors }: EditorProps) {
  const [fields, setFields] = useState(initial);
  const html = renderSignatureHtml(fields);
  const set = (key: SignatureFieldName) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setFields((f) => ({ ...f, [key]: e.target.value }));

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Full name" name="name" value={fields.name} onChange={set("name")} error={errors.name} placeholder="Jane Doe" autoComplete="name" />
        <TextField label="Job title" name="title" value={fields.title} onChange={set("title")} error={errors.title} placeholder="Operations Manager" />
        <TextField label="Company" name="company" value={fields.company} onChange={set("company")} error={errors.company} placeholder="Halden Studio, LLC" className="sm:col-span-2" />
        <TextField label="Address" name="address" value={fields.address} onChange={set("address")} error={errors.address} placeholder={"2090 Example Ave, Suite 250\nSanta Ana, CA 92705"} multiline className="sm:col-span-2" />
        <TextField label="Office phone" name="phone" value={fields.phone} onChange={set("phone")} error={errors.phone} placeholder="714.555.0100" inputMode="tel" />
        <TextField label="Mobile phone" name="mobile" value={fields.mobile} onChange={set("mobile")} error={errors.mobile} placeholder="Optional" inputMode="tel" />
        <TextField label="Fax" name="fax" value={fields.fax} onChange={set("fax")} error={errors.fax} placeholder="Optional" inputMode="tel" />
        <TextField label="Website" name="website" value={fields.website} onChange={set("website")} error={errors.website} placeholder="www.example.com" inputMode="url" />
        <TextField
          label="Logo image URL"
          name="logoUrl"
          value={fields.logoUrl}
          onChange={set("logoUrl")}
          error={errors.logoUrl}
          placeholder="https://example.com/logo.png"
          inputMode="url"
          description="A public https link to a PNG or JPG, shown 180px wide. Files in the project's public folder are served from your site's address."
          className="sm:col-span-2"
        />
        <AccentField value={fields.accentColor} onChange={set("accentColor")} />
        <TextField
          label="Confidentiality notice"
          name="disclaimer"
          value={fields.disclaimer}
          onChange={set("disclaimer")}
          error={errors.disclaimer}
          placeholder="CONFIDENTIALITY NOTICE: This email is intended only for the named recipient(s)…"
          multiline
          description="Optional. Shown in small grey type under a divider."
          className="sm:col-span-2"
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Preview</span>
        {html ? (
          <iframe
            title="Signature preview"
            srcDoc={previewDocument(html)}
            sandbox=""
            referrerPolicy="no-referrer"
            className="h-80 w-full rounded-md border bg-white"
          />
        ) : (
          <p className="rounded-md border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
            Fill in the fields above to build your signature. Save with every field empty to remove it.
          </p>
        )}
      </div>
    </>
  );
}

type TextFieldProps = {
  label: string;
  name: SignatureFieldName;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  description?: string;
  placeholder?: string;
  multiline?: boolean;
  className?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
};

function TextField({
  label,
  name,
  value,
  onChange,
  error,
  description,
  placeholder,
  multiline,
  className,
  inputMode,
  autoComplete,
}: TextFieldProps) {
  const id = useId();
  const common = {
    id,
    name,
    value,
    onChange,
    placeholder,
    "aria-invalid": error ? true : undefined,
  } as const;

  return (
    <Field data-invalid={error ? true : undefined} className={className}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {multiline ? (
        <Textarea {...common} rows={3} className="min-h-20 text-sm" />
      ) : (
        <Input {...common} inputMode={inputMode} autoComplete={autoComplete ?? "off"} className="h-9" />
      )}
      {description && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}

function AccentField({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const id = useId();
  return (
    <Field className="sm:col-span-2">
      <FieldLabel htmlFor={id}>Accent color</FieldLabel>
      <div className="flex items-center gap-3">
        <input
          id={id}
          name="accentColor"
          type="color"
          value={value}
          onChange={onChange}
          className="h-9 w-14 cursor-pointer rounded-md border bg-transparent p-1"
        />
        <span className="font-mono text-[0.8125rem] text-muted-foreground uppercase">{value}</span>
      </div>
      <FieldDescription>Used for the job title, divider line and website link.</FieldDescription>
    </Field>
  );
}
