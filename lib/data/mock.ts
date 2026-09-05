import type { Domain, Email } from "@/lib/types";

/**
 * Realistic sample data for the design phase. Dates are relative to "now"
 * so the list always reads naturally. Replace with the Resend adapter in
 * `lib/data/index.ts` when the API key is wired up.
 */

const now = Date.now();
const minutes = (n: number) => new Date(now - n * 60_000).toISOString();
const hours = (n: number) => minutes(n * 60);
const days = (n: number) => hours(n * 24);

const me = { name: "Halden Studio", email: "hello@haldenstudio.co" };
const billing = { name: "Halden Billing", email: "billing@haldenstudio.co" };

export const MOCK_EMAILS: Email[] = [
  {
    id: "4f2a1c9e-8b3d-4e7a-9c1f-2d5e6a7b8c90",
    direction: "inbound",
    from: { name: "Priya Natarajan", email: "priya@ferrisgrove.com" },
    to: [me],
    cc: [],
    bcc: [],
    replyTo: [],
    subject: "Revised timeline for the Ferris Grove site",
    snippet:
      "Thanks for the walkthrough yesterday. We talked internally and can push the launch to the 22nd if that gives you room for the",
    text: `Hi,

Thanks for the walkthrough yesterday. We talked internally and can push the launch to the 22nd if that gives you room for the accessibility fixes you flagged.

Two things from our side:

1. The product photography is landing on Thursday, so the catalogue pages can go in after that.
2. Legal wants the cookie banner copy back one more time before it ships.

Can you send over the updated estimate when you get a chance? Nothing formal, a short breakdown is fine.

Best,
Priya

Priya Natarajan
Head of Digital, Ferris Grove`,
    createdAt: minutes(18),
    status: "received",
    unread: true,
    hasAttachments: true,
    attachments: [
      {
        id: "att_01",
        filename: "ferris-grove-timeline-v3.pdf",
        contentType: "application/pdf",
        size: 184_320,
      },
    ],
  },
  {
    id: "a7d3e5f1-2c4b-4a6d-8e9f-0b1c2d3e4f5a",
    direction: "inbound",
    from: { name: "Northlight CI", email: "no-reply@northlight.dev" },
    to: [{ email: "dev@haldenstudio.co" }],
    cc: [],
    bcc: [],
    replyTo: [],
    subject: "Build #4821 failed on main",
    snippet:
      "1 job failed in halden-web. `typecheck` exited with code 2 after 41s. View the full log or re-run the workflow.",
    text: `Build #4821 failed on main

Repository: halden/halden-web
Commit: 9f1e2c3 "Tighten inbox row spacing"
Triggered by: tomasz

Failed job: typecheck (41s)

  components/mail/mail-row.tsx(52,7): error TS2322:
  Type 'string | undefined' is not assignable to type 'string'.

View the full log: https://northlight.dev/halden/halden-web/runs/4821
Re-run the workflow: https://northlight.dev/halden/halden-web/runs/4821/rerun`,
    createdAt: hours(1.4),
    status: "received",
    unread: true,
    hasAttachments: false,
    attachments: [],
  },
  {
    id: "b8e4f6a2-3d5c-4b7e-9f0a-1c2d3e4f5a6b",
    direction: "inbound",
    from: { name: "Tomasz Wierzbicki", email: "tomasz@haldenstudio.co" },
    to: [me],
    cc: [{ name: "Mei Lin Cho", email: "mei@haldenstudio.co" }],
    bcc: [],
    replyTo: [],
    subject: "Re: Onboarding email sequence, draft two",
    snippet:
      "Read through the second draft on the train. The welcome mail is much tighter now. I still think mail three is doing too much,",
    text: `Read through the second draft on the train. The welcome mail is much tighter now.

I still think mail three is doing too much. It tries to introduce the dashboard, the API and the billing page in one go. Could we split it, or drop billing until mail five?

Also, the plain text versions are missing the unsubscribe line. Resend will still deliver it but we want it there for the compliance check.

Tomasz`,
    createdAt: hours(3.2),
    status: "received",
    unread: false,
    hasAttachments: false,
    attachments: [],
  },
  {
    id: "c9f5a7b3-4e6d-4c8f-a01b-2d3e4f5a6b7c",
    direction: "inbound",
    from: { name: "Fathom Billing", email: "receipts@fathom-billing.com" },
    to: [billing],
    cc: [],
    bcc: [],
    replyTo: [{ email: "support@fathom-billing.com" }],
    subject: "Your receipt from Fathom (invoice 2091-4471)",
    snippet:
      "Amount paid $140.00. Team plan, 1 Sep to 30 Sep. This is an automated receipt for your records.",
    text: `Receipt

Amount paid: $140.00
Plan: Team (monthly)
Period: 1 Sep to 30 Sep
Invoice: 2091-4471
Payment method: card ending 4407

A PDF copy is attached. Reply to this mail if anything looks wrong.

Fathom Billing`,
    createdAt: hours(9),
    status: "received",
    unread: false,
    hasAttachments: true,
    attachments: [
      {
        id: "att_02",
        filename: "invoice-2091-4471.pdf",
        contentType: "application/pdf",
        size: 62_110,
      },
    ],
  },
  {
    id: "d0a6b8c4-5f7e-4d9a-b12c-3e4f5a6b7c8d",
    direction: "inbound",
    from: { name: "Aisha Bello", email: "aisha.bello@kestrelbooks.com" },
    to: [me],
    cc: [],
    bcc: [],
    replyTo: [],
    subject: "Could you quote a small brand refresh?",
    snippet:
      "We are a two-person publishing house in Leeds. Our site still runs on a theme from 2017 and the logo has never had a vector",
    text: `Hello,

We are a two-person publishing house in Leeds. Our site still runs on a theme from 2017 and the logo has never had a vector version, which is now a problem for print.

We do not need anything elaborate: a cleaned-up wordmark, a colour palette we can actually use, and a simple site with a catalogue and an order form.

Is this the kind of thing you take on, and if so what would a rough budget look like?

Kind regards,
Aisha Bello
Kestrel Books`,
    createdAt: days(1.1),
    status: "received",
    unread: false,
    hasAttachments: false,
    attachments: [],
  },
  {
    id: "e1b7c9d5-6a8f-4e0b-c23d-4f5a6b7c8d9e",
    direction: "inbound",
    from: { name: "Resend", email: "notifications@resend.com" },
    to: [{ email: "dev@haldenstudio.co" }],
    cc: [],
    bcc: [],
    replyTo: [],
    subject: "Domain haldenstudio.co is verified",
    snippet:
      "DNS records for haldenstudio.co were found and validated. You can now send from any address on this domain.",
    text: `DNS records for haldenstudio.co were found and validated.

SPF: verified
DKIM: verified
MX (receiving): verified

You can now send from any address on this domain and receive mail at addresses you route through Resend.`,
    createdAt: days(2.3),
    status: "received",
    unread: false,
    hasAttachments: false,
    attachments: [],
  },
  {
    id: "f2c8d0e6-7b9a-4f1c-d34e-5a6b7c8d9e0f",
    direction: "inbound",
    from: { name: "Marcus Oyelaran", email: "marcus@studioplatform.example" },
    to: [me],
    cc: [],
    bcc: [],
    replyTo: [],
    subject: "Podcast guest slot, second week of October?",
    snippet:
      "We are recording a short series on small studios that run their own tooling. Your inbox setup came up twice in our research.",
    text: `Hi there,

We are recording a short series on small studios that run their own tooling. Your inbox setup came up twice in our research, so I wanted to ask directly.

Would you be up for a 30 minute remote conversation in the second week of October? We record on Tuesdays and Thursdays.

Marcus`,
    createdAt: days(4),
    status: "received",
    unread: false,
    hasAttachments: false,
    attachments: [],
  },

  // Outbound
  {
    id: "0a1b2c3d-4e5f-4a6b-8c7d-9e0f1a2b3c4d",
    direction: "outbound",
    from: me,
    to: [{ name: "Priya Natarajan", email: "priya@ferrisgrove.com" }],
    cc: [],
    bcc: [],
    replyTo: [],
    subject: "Re: Revised timeline for the Ferris Grove site",
    snippet:
      "The 22nd works. I will have the updated estimate over by Friday, with the accessibility work broken out as its own line.",
    text: `Hi Priya,

The 22nd works. I will have the updated estimate over by Friday, with the accessibility work broken out as its own line so you can see what moved.

Send the cookie banner copy whenever legal is done with it. We can drop it in the day it arrives.

Thanks,
Halden Studio`,
    createdAt: minutes(6),
    status: "delivered",
    unread: false,
    hasAttachments: false,
    attachments: [],
  },
  {
    id: "1b2c3d4e-5f6a-4b7c-9d8e-0f1a2b3c4d5e",
    direction: "outbound",
    from: me,
    to: [{ name: "Aisha Bello", email: "aisha.bello@kestrelbooks.com" }],
    cc: [],
    bcc: [],
    replyTo: [],
    subject: "Re: Could you quote a small brand refresh?",
    snippet:
      "Yes, this is exactly the size of project we like. For a wordmark cleanup, a small palette and a catalogue site, a realistic",
    text: `Hi Aisha,

Yes, this is exactly the size of project we like.

For a wordmark cleanup, a small palette and a catalogue site with an order form, a realistic range is 4,800 to 6,500 depending on how much of the catalogue you want us to enter for you.

If that is in the right area, I can put together a one page proposal with a timeline. Would a call next week help?

Halden Studio`,
    createdAt: hours(20),
    status: "opened",
    unread: false,
    hasAttachments: false,
    attachments: [],
  },
  {
    id: "2c3d4e5f-6a7b-4c8d-ae9f-1a2b3c4d5e6f",
    direction: "outbound",
    from: { name: "Halden Studio", email: "newsletter@haldenstudio.co" },
    to: [{ email: "subscribers@haldenstudio.co" }],
    cc: [],
    bcc: [],
    replyTo: [me],
    subject: "September notes: what we shipped and what we cut",
    snippet:
      "Three things went out this month. One thing did not, and we think that is the more interesting story.",
    text: `September notes

Three things went out this month. One thing did not, and we think that is the more interesting story.

Shipped
- The Ferris Grove catalogue, now with keyboard-navigable filters
- A rewrite of our own inbox tool on top of Resend
- Print-ready vector logos for two clients

Cut
- The "AI summary" feature on the inbox tool. It looked good in a demo and did nothing in daily use.

Reply to this mail if you want the long version.`,
    createdAt: days(1.5),
    status: "clicked",
    unread: false,
    hasAttachments: false,
    attachments: [],
  },
  {
    id: "3d4e5f6a-7b8c-4d9e-bf0a-2b3c4d5e6f7a",
    direction: "outbound",
    from: billing,
    to: [{ name: "Accounts", email: "accounts@oldmillbakery.co.uk" }],
    cc: [],
    bcc: [],
    replyTo: [],
    subject: "Invoice HS-0148 for August",
    snippet:
      "Please find attached invoice HS-0148 covering the menu redesign and the four social templates. Payment terms are 14 days.",
    text: `Hello,

Please find attached invoice HS-0148 covering the menu redesign and the four social templates. Payment terms are 14 days.

Thanks,
Halden Billing`,
    createdAt: days(2),
    status: "bounced",
    unread: false,
    hasAttachments: true,
    attachments: [
      {
        id: "att_03",
        filename: "HS-0148.pdf",
        contentType: "application/pdf",
        size: 91_400,
      },
    ],
  },
  {
    id: "4e5f6a7b-8c9d-4e0f-a01b-3c4d5e6f7a8b",
    direction: "outbound",
    from: me,
    to: [{ name: "Marcus Oyelaran", email: "marcus@studioplatform.example" }],
    cc: [],
    bcc: [],
    replyTo: [],
    subject: "Re: Podcast guest slot, second week of October?",
    snippet: "Happy to. Thursday the 9th at 15:00 works on our side.",
    text: `Hi Marcus,

Happy to. Thursday the 9th at 15:00 works on our side.

Halden Studio`,
    createdAt: days(3.5),
    status: "queued",
    unread: false,
    hasAttachments: false,
    attachments: [],
  },
  {
    id: "5f6a7b8c-9d0e-4f1a-b12c-4d5e6f7a8b9c",
    direction: "outbound",
    from: me,
    to: [{ name: "Tomasz Wierzbicki", email: "tomasz@haldenstudio.co" }],
    cc: [],
    bcc: [],
    replyTo: [],
    subject: "Onboarding email sequence, draft two",
    snippet:
      "Second pass attached as plain text. Welcome mail is cut by a third, mail three still needs your eyes.",
    text: `Second pass attached as plain text. Welcome mail is cut by a third, mail three still needs your eyes.`,
    createdAt: days(5),
    status: "delivered",
    unread: false,
    hasAttachments: false,
    attachments: [],
  },
];

export const MOCK_DOMAINS: Domain[] = [
  {
    id: "dom_01",
    name: "haldenstudio.co",
    status: "verified",
    region: "eu-west-1",
    createdAt: days(140),
    capabilities: { sending: true, receiving: true },
    records: [
      { type: "SPF", status: "verified" },
      { type: "DKIM", status: "verified" },
      { type: "MX", status: "verified" },
      { type: "DMARC", status: "verified" },
    ],
  },
  {
    id: "dom_02",
    name: "mail.haldenstudio.co",
    status: "pending",
    region: "eu-west-1",
    createdAt: days(2),
    capabilities: { sending: true, receiving: false },
    records: [
      { type: "SPF", status: "verified" },
      { type: "DKIM", status: "pending" },
      { type: "MX", status: "not_started" },
      { type: "DMARC", status: "not_started" },
    ],
  },
];
