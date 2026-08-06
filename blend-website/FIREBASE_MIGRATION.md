# Firebase project migration

## Scope discovered

- Confirmed source Firebase project: `blend-global`
- Historical `blend-eventlife` text is a LinkedIn/company reference, not the live
  Firebase project used by this app
- New Firebase project ID configured locally and in `.firebaserc`: `blend-website-bcdf3`
- New default Storage bucket configured locally: `blend-website-bcdf3.firebasestorage.app`
- Firebase products used by application code:
  - Cloud Firestore: yes
  - Cloud Storage for Firebase: yes
  - Firebase Authentication: yes
  - Cloud Functions for Firebase: no
  - Firebase Hosting: no configuration found; the repository documents Vercel deployment
  - Firebase Admin SDK: dependency installed, but no imports or service-account usage found

No service-account files, `GOOGLE_APPLICATION_CREDENTIALS`, Functions source, Functions
configuration, Hosting configuration, hardcoded Functions URLs, or Firebase emulator
configuration existed before this migration work.

## Migration execution status — June 22, 2026

- Firestore: 41 of 41 documents copied and canonically value-verified
- Storage: 17 of 17 objects copied; names, sizes, MD5 checksums, content types, and
  metadata verified
- Storage URLs: four confirmed old-bucket strings in Firestore were rewritten to the new
  bucket during the copy
- Authentication: 9 Google-linked users imported with matching original UIDs
- Authentication pending: 2 password users require the old project's SCRYPT hash
  parameters before safe import
- Auth providers: Email/Password and Google are enabled in the new project
- Authorized domains: preserved new defaults and added `blend-global.vercel.app` and
  `blend-rebrand.vercel.app`
- Firestore rules, Storage rules, and Firestore indexes compiled and deployed successfully
- No source or destination data was deleted

## Files changed

- `.firebaserc`: sets the new default Firebase project
- `firebase.json`: configures rules, indexes, and local emulators
- `firestore.rules`: adds least-scope rules compatible with current app behavior
- `firestore.indexes.json`: records the current empty composite-index set
- `storage.rules`: limits public reads and CMS image uploads to the known path
- `.env.example`: adds emulator variables and removes populated credentials
- `lib/firebase/client.ts`: connects Auth, Firestore, and Storage to emulators when enabled
- `lib/firestore-server.ts`: connects server Firestore reads to the emulator when enabled
- `app/api/cms/[section]/route.ts`: removes the unauthenticated, unused write endpoint
- `scripts/verify-firebase-config.mjs`: checks environment/project consistency without
  printing secrets
- `package.json` and `package-lock.json`: add Firebase CLI tooling and migration scripts
- `FIREBASE_MIGRATION.md`: this operator report and cutover checklist

## Firestore inventory

Collections and document keys used by the app:

| Collection | Document IDs | Purpose |
| --- | --- | --- |
| `cmsSettings` | `blog`, `services` | CMS section headings and labels |
| `blogPosts` | blog slug | Published and featured blog content |
| `services` | service slug | Service listing and detail content |
| `caseStudies` | case-study slug | Work/case-study content |
| `users` | Firebase Auth UID | User profile data tied to Auth identity |

All CMS list queries order by the single field `order`; no composite indexes are currently
required. There are no seed or migration scripts. The JSON files under `content/` are
runtime fallbacks and can be used as a recovery reference, but they are not a complete
replacement for an export of the live Firestore database.

The CMS save operations synchronize whole sections and delete documents absent from the
submitted section. Do not open the CMS against an incomplete production import and save
until document counts and content have been checked.

### Firestore migration checklist

1. Put the old CMS into a write freeze or maintenance window.
2. Record document counts for all five collections in the old project.
3. Create a temporary Cloud Storage export bucket in a location compatible with the old
   Firestore database. Replace the TODO values below rather than guessing them.
4. Export the old database:

   ```bash
   export OLD_PROJECT_ID=blend-global
   export NEW_PROJECT_ID=blend-website-bcdf3
   export FIRESTORE_EXPORT_BUCKET=gs://TODO_FIRESTORE_EXPORT_BUCKET
   export FIRESTORE_EXPORT_PREFIX="blend-firestore-$(date +%Y%m%d-%H%M%S)"

   gcloud config set project "$OLD_PROJECT_ID"
   gcloud firestore export "$FIRESTORE_EXPORT_BUCKET/$FIRESTORE_EXPORT_PREFIX"
   ```

5. Grant the new project's Firestore service agent access to the export bucket if the
   bucket remains in the old project. Obtain the new project number and use IAM in the
   Google Cloud Console; do not guess the service-agent address.
6. Import into the new project. Import adds/overwrites matching document IDs and does not
   delete unrelated documents, but the destination should still be empty or separately
   backed up:

   ```bash
   gcloud config set project "$NEW_PROJECT_ID"
   gcloud firestore import "$FIRESTORE_EXPORT_BUCKET/$FIRESTORE_EXPORT_PREFIX"
   ```

7. Compare collection counts and sample documents, including `users/{uid}` records.
8. Verify every imported Auth UID has the matching `users/{uid}` document where expected.
9. Deploy rules and indexes only after reviewing `firestore.rules`.

## Storage inventory

The only application-generated object path found is:

```text
cms/blog-covers/{blog-slug}-{timestamp}.{extension}
```

Firestore may contain URLs in these fields and they must be audited for references to the
old bucket after copying:

- `blogPosts.image`
- `blogPosts.author.avatar`
- `caseStudies.image`
- `caseStudies.coverVideo`
- `caseStudies.logo`
- `caseStudies.tabs.*.images[]`

### Storage migration checklist

1. Determine the exact old default bucket in the Firebase Console:

   ```bash
   export OLD_STORAGE_BUCKET=gs://TODO_OLD_BUCKET
   export NEW_STORAGE_BUCKET=gs://blend-website-bcdf3.firebasestorage.app
   ```

2. Inventory source and destination objects:

   ```bash
   gcloud storage du --summarize "$OLD_STORAGE_BUCKET"
   gcloud storage du --summarize "$NEW_STORAGE_BUCKET"
   ```

3. Preview the copy. Do not add `--delete-unmatched-destination-objects`:

   ```bash
   gcloud storage rsync "$OLD_STORAGE_BUCKET" "$NEW_STORAGE_BUCKET" --recursive --dry-run
   ```

4. Run the non-destructive copy:

   ```bash
   gcloud storage rsync "$OLD_STORAGE_BUCKET" "$NEW_STORAGE_BUCKET" --recursive
   ```

5. Compare object counts, byte totals, content types, and custom metadata.
6. Audit Firestore for old bucket URLs. Copying objects does not rewrite URLs already
   stored in Firestore. Update only confirmed old-bucket URL fields, preserve document
   IDs, and back up Firestore first.
7. Test at least one old image and one newly uploaded CMS blog cover against the new
   bucket before production cutover.

## Authentication inventory

Auth providers used by code:

- Email/password
- Google popup sign-in

The app only accepts addresses ending in `@blend.global`. Auth UIDs are a data key:
`users/{uid}` documents use the Firebase Auth UID, so users must be imported with their
original UIDs.

### Authentication migration checklist

1. In the new Firebase Console, enable Email/Password and Google providers.
2. Export users from the old project to a protected path outside the repository:

   ```bash
   firebase auth:export /secure/path/blend-auth-users.json \
     --format=json \
     --project blend-global
   ```

3. In the old Firebase Console, retrieve the password hash parameters from
   Authentication > Users > menu > Password hash parameters. These values are sensitive.
   Never place them in this repository, shell history, CI logs, or chat.
4. Import users into the new project using the exact old-project hash parameters:

   ```bash
   firebase auth:import /secure/path/blend-auth-users.json \
     --project blend-website-bcdf3 \
     --hash-algo=SCRYPT \
     --hash-key='TODO_SENSITIVE_HASH_KEY' \
     --salt-separator='TODO_SENSITIVE_SALT_SEPARATOR' \
     --rounds=TODO_ROUNDS \
     --mem-cost=TODO_MEM_COST
   ```

5. Compare user counts, UIDs, disabled states, provider links, and test accounts.
6. Configure authorized domains and OAuth redirect URLs for local, preview, and
   production domains.
7. Review Google OAuth consent-screen settings and support email.
8. Recreate/customize email sender settings, action URLs, and email templates.
9. If imported users came from a non-Firebase password algorithm, inspect export records
   with empty password hashes; those users may require password reset.

Security warning: the current app and migration rules allow any authenticated
`@blend.global` address to edit CMS data. Email/password signup does not prove ownership
until email verification is enforced. Before production, either implement email
verification and require `email_verified`, disable self-service email/password signup, or
use custom admin claims.

## Rules and local development

`firestore.rules` permits public reads for published CMS collections because the current
Next.js server uses the Firebase Web SDK without an authenticated server identity. CMS
writes require an authenticated `@blend.global` user. User profile documents are limited
to their matching UID.

`storage.rules` permits public reads only under `cms/blog-covers/`; writes require an
authenticated `@blend.global` user, image content type, and a size below 10 MiB. All
other paths are denied.

The previous unauthenticated `PUT /api/cms/[section]` handler was removed. The CMS already
writes directly through the authenticated Firebase client, and the route could write
local fallback files when Firebase environment variables were absent.

Start emulators in one terminal:

```bash
npm run firebase:emulators
```

The Firestore emulator requires a Java runtime on `PATH`. Install Java before using this
command; this workstation did not have Java available during validation.

Set `NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true` in `.env.local`, then run:

```bash
npm run dev
```

Emulator data is isolated and ephemeral because import/export persistence is not enabled.

## Deployment and verification commands

Run from `blend-website/`:

```bash
npm install
npm run firebase:verify
npm run lint
npm run build
firebase login
firebase use blend-website-bcdf3
npm run firebase:deploy:rules
```

There is no Firebase Hosting or Functions target in this repository. Deploy the Next.js
application through its existing hosting platform after recreating all six
`NEXT_PUBLIC_FIREBASE_*` environment variables there.

## Manual console steps before production cutover

- Confirm the Firestore database location and edition match operational requirements.
- Enable Email/Password and Google authentication providers.
- Configure authorized domains, OAuth redirect URLs, consent screen, sender settings,
  action URLs, and email templates.
- Import Auth users with original UIDs and exact password hash parameters.
- Import Firestore data and verify all collection counts and representative documents.
- Copy Storage objects, verify metadata, and replace confirmed old-bucket URLs in
  Firestore.
- Deploy and test Firestore and Storage rules.
- Add the new Firebase client variables to every deployment environment.
- Rotate the SMTP app password that was committed in `.env.example`; it remains exposed
  in Git history until history is separately rewritten.
- Decide whether to remove the unused `firebase-admin` dependency or implement a proper
  authenticated server-side Admin SDK boundary.

## Production switch risks

- Missing Auth user import breaks sign-in and changes UIDs if accounts are recreated.
- Wrong password hash parameters force password resets.
- Missing OAuth domains or redirect URLs breaks Google sign-in.
- Old Storage URLs in Firestore continue to depend on the old bucket.
- Saving a partially imported CMS section can delete documents missing from that section.
- Public CMS reads are intentional under the current architecture.
- Domain-only CMS authorization is insufficient for unverified password accounts.
- The app has no App Check enforcement.
- The committed SMTP credential must be considered compromised and rotated.
