"use client";

import { SignOutIcon } from "@phosphor-icons/react";
import { logout } from "@/app/login/actions";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <form action={logout}>
      <Button type="submit" variant="outline" className="h-9 w-full sm:w-auto">
        <SignOutIcon data-icon="inline-start" />
        Sign out
      </Button>
    </form>
  );
}
