# Agreed scope and implementation map

The decisions in the rebuild conversation override the old documentation. This
file describes the delivered source, not a deployment on a hosted database.

## Admin

- Create teams with at least one confirmed Whistle student; maintain rosters;
  archive teams. Optional PNG/JPEG/WebP logos (2 MiB), otherwise initials.
  Sources: `components/admin/TeamForm.jsx`, `components/admin/RosterEditor.jsx`,
  `components/admin/LogoEditor.jsx`, `app/api/teams/route.js`, `lib/logoServer.js`.
- Create Football/Basketball/Volleyball leagues from registered teams; best-of-three
  or best-of-five Volleyball. Draft all home-and-away matches automatically; odd
  fields have byes. Enroll additional teams, add manual fixtures, edit date/venue
  or leave undated. Repeated generation does not restore deliberately deleted games.
  Sources: `components/admin/LeagueForm.jsx`, `components/admin/LeagueTools.jsx`,
  `app/api/leagues/route.js`, `supabase/schema.sql` (`admin_create_league`,
  `admin_generate_fixtures`, `admin_add_league_team`, `admin_add_fixture`).
- A player can represent one team per league. Roster updates synchronize active
  leagues and reject conflicts; archived league rosters keep their history.
  Source: `supabase/schema.sql` (`admin_save_team`, `league_players`).
- Create one-off Friendlies with existing teams or typed names. Typed names can
  remain match-only, or be saved with at least one registered student. Temporary
  teams can have their own uploaded logos. Source: `components/admin/FriendlyForm.jsx`,
  `app/api/friendlies/route.js`, SQL `admin_create_friendly`.
- Explicit Start Match closes voting and locks deletion immediately. Scheduled
  dates never start matches. Unstarted Scheduled matches can be deleted; Live,
  completed, walkover and cancelled records are retained. Source:
  `components/admin/MatchControls.jsx`, SQL `admin_start`, `admin_delete_fixture`.
- Score Football (+1) and Basketball (+1/+2/+3), then End Match; draws allowed.
  Volleyball uses valid final sets for its chosen format and settles only after
  those sets are entered. Source: `components/admin/MatchControls.jsx`, SQL
  `admin_score`, `admin_end`, `admin_record_result`.
- Correct a final result; standings and previous Ws deltas are replaced. Walkovers
  void predictions and add league wins without invented scores. Cancellation
  retains an unfinished match, voids predictions and excludes it from standings.
  Source: SQL `admin_correct_result`, `admin_walkover`, `admin_cancel`,
  `whistle_settle` in `supabase/schema.sql`.
- Review student feedback. Source: `app/(admin)/feedback/page.jsx`,
  `app/api/feedback/[feedbackId]/route.js`, SQL `admin_review_feedback`.

## Student and public

- Students browse fixtures, live scores and sport-specific standings, with their
  own teams highlighted. Public visitors see scores, league snapshots and aggregate
  prediction tallies. Sources: `app/(student)/student/`,
  `components/shared/PublicHomepage.jsx`, `components/shared/FixtureList.jsx`.
- Every fixture poll opens immediately, including undated fixtures. Students may
  replace predictions until Start; pick either team or Draw (no Draw in Volleyball).
  Correct predictions earn +50 Ws, incorrect predictions lose 25; balances can be
  negative. No vote means no delta. Completion scores each vote once; correction
  replaces its previous delta. Walkovers/cancellations are void. Sources:
  `components/student/PollWidget.jsx`, `app/api/polls/[fixtureId]/vote/route.js`,
  SQL `student_vote`, `whistle_settle`, `ws_ledger`.
- View personal Ws and one cumulative campus leaderboard; exact balance ties
  share rank. Sources: `app/(student)/student/leaderboard/page.jsx`,
  `app/(student)/student/profile/page.jsx`, SQL `student_leaderboard`.
- Keep in-app notifications/preferences, feedback and own profile. Sources:
  `app/(student)/student/notifications/`, `app/(student)/student/feedback/`,
  `app/(student)/student/profile/`, `lib/studentData.js`.

## Standings

All standings and ranks come from `admin_standings` in
`supabase/schema.sql`, rendered by
`components/shared/StandingsPreview.jsx`. Only completed league matches and
walkovers count; Friendlies, Live and cancelled matches do not.

- Football: 3/1/0; points, goal difference, goals scored, then share rank.
- Basketball: W/(W+L+D), then point difference, points scored, then share rank.
  Draws count in the denominator. Walkovers add W/L without artificial scores.
- Volleyball: clean sweep gives 3/0; any dropped set gives 2/1, including 3–1.
  Rank by points, wins, set difference, sets won, then share rank. A walkover
  awards 3/0 and a win/loss without invented sets.

## Platform and access

- Campus email and confirmation: `lib/auth.js`, `app/api/auth/`,
  `app/auth/confirm/route.js`, SQL `whistle_signup_profile`.
- Verified sessions, admin/student guards and same-origin mutations:
  `lib/auth.js`, `lib/api.js`, `middleware.js`, `lib/supabase/server.js`.
- Service-role-only RPCs; RLS allows a student to read only their own profile.
  No browser access to raw votes or Ws ledger. Source: final grants/policies in
  `supabase/schema.sql`; private key in `lib/supabase/admin.js`.
- Installable PWA and network-only runtime data: `public/manifest.json`,
  `components/shared/PWA.jsx`, `next.config.js`.
- No Fest/payment/proof/registration/Cup/Event routes, tables or navigation.
  No automatic kickoff, delay or pause/resume feature. Archived records remain
  available for history. Setup targets the new Supabase project; no reset or cleanup is required.

## Verification boundary

`tests/database.test.mjs` exercises SQL constraints, RLS, all sport
rankings, fixtures, Ws and correction/void rules. `tests/domain.test.mjs` checks
rendering/filter helpers and signup validation. `tests/http.test.mjs` exercises
the actual Next.js handlers against the new SQL through a simulated Supabase
transport, including login, role isolation, logo bytes and all student pages.
Browser checks cover public/student/admin pages, vote changes, Friendly creation,
logo upload/removal and the full Start/score/End interaction. A real hosted Supabase/SMTP deployment
has not been exercised because no project credentials were provided.
