import type { Icon } from "@phosphor-icons/react";
import {
  GearSixIcon,
  GlobeSimpleIcon,
  PaperPlaneTiltIcon,
  PencilSimpleLineIcon,
  TrayIcon,
} from "@phosphor-icons/react";

export type NavItem = {
  href: string;
  label: string;
  icon: Icon;
  /** Key into the counts map for the serif count next to the label. */
  countKey?: "inbox" | "sent";
  /** Compose is a primary action, styled differently in both navs. */
  primary?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/inbox", label: "Inbox", icon: TrayIcon, countKey: "inbox" },
  { href: "/sent", label: "Sent", icon: PaperPlaneTiltIcon, countKey: "sent" },
  { href: "/compose", label: "Compose", icon: PencilSimpleLineIcon, primary: true },
  { href: "/domains", label: "Domains", icon: GlobeSimpleIcon },
  { href: "/settings", label: "Settings", icon: GearSixIcon },
];

export function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
