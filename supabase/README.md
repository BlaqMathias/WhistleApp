# Supabase files

This setup targets your new, empty Supabase project. Use the root `README.md`
for the complete instructions; all terminal commands run from the project root.

1. Run `schema.sql` in Supabase SQL Editor once.
2. Fill in the root `.env.local`, including a new demo password if using samples.
3. Run `npm run setup:demo` to create sample Auth accounts and the logo bucket.
4. Run `seed.sql` in SQL Editor to populate the sample sports records once.
5. Run `npm run dev` from the project root.

`templates/confirm-signup.html` is the confirmation email template for real
student signups. The schema contains tables, constraints, RLS, protected RPCs,
standings, match controls and prediction/Ws logic. The seed requires the confirmed
demo profiles created by the helper; it does not insert Auth passwords in SQL.

No reset/cleanup is needed for this new project. `schema.sql` installs a fresh
schema; it is not a repeatable migration. If you already installed the equivalent
schema from the earlier ZIP, moving these files does not require running it again.

## Existing installations: profile/header update

After applying the prior player-details, fixture/form, squad-stats and league-logo
migrations, run `migrations/20261103223000_prediction_history.sql` before opening
Prediction history. Do not rerun `schema.sql` on an existing installation. The new
migration is repeatable, uses the existing votes/Ws tables and adds no new env
variables. History and archived voted-match access are server-side, account-scoped
reads; direct anonymous/authenticated browser RPC execution remains denied.
