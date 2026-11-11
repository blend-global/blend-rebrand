This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Project enquiries

The project modal and contact forms submit through `/api/contact`. The endpoint
continues the signed-in Blend member's Firebase session and saves a document in
`projectEnquiries` **before** sending the existing email notification. No additional
Firebase Admin credentials are needed.

Documents contain the contact and project fields, selected service slugs and labels,
`submittedBy` (the member's UID), `status: "new"`, server-generated `createdAt` and
`updatedAt`, and `emailNotification.status` (`pending`, `sent`, or `failed`).
Enquiries can be viewed in the Firebase console. All signed-in Blend members can
read enquiries, including those submitted by other members. Client deletion is denied.

If saving fails, the form retains its values and reports an error without sending
email. If email fails after saving, the API returns an accepted response and the
form confirms that the enquiry was saved; its notification status is marked
`failed` for manual follow-up. A `pending` status can also indicate an interrupted
request or a failed status update. This flow does not automatically retry email.

Deploy the updated Firestore rules before releasing the website changes:

```bash
npx firebase deploy --only firestore:rules --project blend-website-bcdf3
```

Run the enquiry validation and failure-path tests with `npm run test:enquiries`.
These tests mock Firebase and SMTP so they create no production records or emails.

## Getting Started

### Social previews and canonical URLs

Open Graph and Twitter cards are rendered on the server for the home, contact,
services, case-study, and blog pages. Detail pages use their CMS titles and
descriptions, with raster content images where available and a branded 1200×630
PNG fallback at `/og/blend-share.png`. The CMS is marked `noindex, nofollow`.

Set `NEXT_PUBLIC_SITE_URL` to the public production origin when deploying. It
defaults to `https://blend.global` and controls canonical and social-preview URLs.
Metadata is available without signing in; the existing website access gate still
limits search engines' ability to index the page content.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Regional website

The public site shares components across `/za` (South Africa) and `/uk` (United
Kingdom). ZA content continues to use the CMS. UK messaging, its eight digital
services, About copy, client list and calls to action are sourced from the existing
UK website into `content/uk.json`; the source URLs and retrieval date are recorded
in that file. UK client logo assets are stored locally in `public/uk/clients`. The root URL presents a region chooser and redirects
returning visitors using the `blend-region-choice` preference cookie (one year). The preference is written only by an explicit chooser or switcher selection,
never by visiting a regional page. Old inferred `blend-region` cookies are ignored.
Explicit regional URLs take precedence over a stored preference. Signed-out
visitors opening a regional homepage without a choice go to the chooser before
sign-in; deep links remain accessible through the existing sign-in flow. New
website accounts without an explicit choice return to the chooser after signup. The navigation and
footer switchers preserve the current page, query string and fragment. A service
that is unavailable in the other branch falls back to that branch’s service listing.

Branch contact details, social links, locale and currency live in `lib/regions.ts`.
UK contact details and social/booking links were carried over from the existing
UK website. A UK street address and approved regional policy copy still need to
be supplied; the UK version does not display the South African street address or
B-BBEE accreditation. Both versions currently use the new shared brand palette.

Enquiries store the chosen region and its currency. Configure
`CONTACT_EMAIL_TO_ZA` and `CONTACT_EMAIL_TO_UK` to override branch recipients.
An existing `CONTACT_EMAIL_TO` override applies when a branch-specific override
is absent; otherwise notifications go to the published branch email.
UK budgets accept a free-text GBP estimate; ZA retains its existing ZAR ranges.

Regional canonicals, reciprocal `en-ZA`/`en-GB` alternates and `/sitemap.xml`
identify the variants. Old unprefixed public paths redirect permanently to `/za`;
`/uk/contact-us` redirects to `/uk/contact`. The existing website sign-in gate
is retained, with the region chooser accessible before sign-in. Public launch
must address that gate before search engines can index the regional page content.

UK service links on the homepage and service listing open a native dialog with the
original service description, illustration and booking link. Escape, the close
button and backdrop clicks dismiss it; native dialog focus handling keeps keyboard
navigation inside the popup and restores focus when it closes. Modified link clicks
and direct URLs retain the service detail pages for sharing and search. ZA service
links continue to navigate normally.
