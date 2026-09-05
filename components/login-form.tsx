"use client";

import { useActionState, useId, useState } from "react";
import { EyeIcon, EyeSlashIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { login, type LoginState } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";

const initialState: LoginState = {};

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(login, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const usernameId = useId();
  const passwordId = useId();
  const hasError = Boolean(state.error);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <input type="hidden" name="next" value={next} />

      {hasError && (
        <Alert variant="destructive" role="alert">
          <WarningCircleIcon />
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <FieldGroup>
        <Field data-invalid={hasError || undefined}>
          <FieldLabel htmlFor={usernameId}>Username</FieldLabel>
          <Input
            id={usernameId}
            name="username"
            defaultValue={state.username ?? ""}
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            required
            aria-invalid={hasError || undefined}
            className="h-11 text-base sm:h-9 sm:text-sm"
          />
        </Field>

        <Field data-invalid={hasError || undefined}>
          <FieldLabel htmlFor={passwordId}>Password</FieldLabel>
          <InputGroup className="h-11 sm:h-9">
            <InputGroupInput
              id={passwordId}
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              aria-invalid={hasError || undefined}
              className="text-base sm:text-sm"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="button"
                size="icon-xs"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <FieldDescription>
            Credentials are set in the server environment.
          </FieldDescription>
        </Field>
      </FieldGroup>

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="h-11 w-full text-[0.9375rem] hover:bg-primary-hover active:scale-[0.98] sm:h-10"
      >
        {pending && <Spinner data-icon="inline-start" />}
        {pending ? "Signing in" : "Sign in"}
      </Button>
    </form>
  );
}
