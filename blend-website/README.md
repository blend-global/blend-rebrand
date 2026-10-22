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
