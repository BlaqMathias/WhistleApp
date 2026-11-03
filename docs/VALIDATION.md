# Validation — 2 November 2026

## Current mobile presentation update

- `npm test`: 13 passed, 0 failed (10 SQL scenarios, 3 domain/helper tests).
- `npm run test:http`: all 12 HTTP scenarios passed; the Node report counts
  13 tests including the parent. These exercise the real routes and schema.
- Both unchanged suites also passed before UI work and after each of the eight
  implementation stages. No test, API, Supabase, helper or dependency file changed.
- `npm run build`: passed with production Bricolage Grotesque/Poppins WOFF2 assets.
- 66 protected source/config/dependency files match the previous ZIP byte-for-byte.
- 68 complete presentation-file blocks in UI_COMPLETE_FILES.md match the files.
- Narrow 390px/light and 360px/dark review frames: public, auth, every student
  route, admin lists/new/edit/detail and match-day controls had no horizontal page
  overflow. The content widths with classic scrollbars were 375px and 345px.
- Basketball score buttons measured 56px tall and at least 129px wide on phones.
- Full-app browser interaction: persisted Light/Dark/System appearance and
  theme-colour updates, replacing predictions, logout, manual kickoff, immediate
  deletion protection, scoring and completion with result correction retained.
- Legacy sidebar/stat CSS, Anton and Google font link tags are removed. No new
  dependencies were installed. Temporary responsive-review and demo-env files
  are excluded from delivery.

UI_REDESIGN.md records the review method and limits. The managed development
preview used font fallback when its download failed; the production font build
succeeded. Physical mobile installation, video-based flash detection and hosted
Supabase/SMTP were not verified. No hosted project was reset or deployed.

## Existing application verification

SQL/HTTP scenarios cover campus confirmation and role isolation, roster
eligibility and per-league uniqueness, home-and-away rounds/byes, manual Start,
changeable pre-match voting, protected deletion, negative Ws, idempotent scoring,
corrections, cancellation/walkovers, Volleyball formats, full standings tie-breaks,
Friendly team names/saving, signed logo upload and byte validation, notification
preferences, feedback review, logout, sample data and student pages.

The earlier full rebuild also had browser checks for creating typed Friendlies,
uploading a PNG, confirming that it loaded, removing it and restoring initials.
Tests use PGlite and an isolated simulated Supabase Auth/Storage transport.
Configure your real project using the root README; no schema rerun is required
for this UI update.
