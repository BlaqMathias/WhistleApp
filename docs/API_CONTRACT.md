# Next.js integration contract

The rebuilt frontend/API at the project root implements this schema contract.
The old application's handlers and response shapes are incompatible with it.

## Navigation and pages

- Admin: Dashboard, Teams, Leagues, Friendlies, Feedback.
- Student: Overview, Fixtures, Standings, Live, Ws leaderboard, Notifications,
  Feedback, Profile. Put pre-match predictions on Fixtures; Friendlies appear
  alongside league matches. Live shows running scores and closed prediction tallies.
- Public homepage: scores, fixtures, league snapshots and public aggregate polls;
  anonymous visitors sign in to predict. Keep visible-page refresh and the PWA.
- Remove all Fest/payment/Cup/Event pages, navigation, controls, forms and endpoints.
- Replace automatic kickoff/delay UI with Start Match. A scheduled date is
  informational and editable before Start; it does not close a poll by itself.

## Guard every route

Use the existing verified `currentAccount`/`currentAdmin` pattern. Admin APIs use
admin sessions; student APIs reject admins and use the session's student ID.
Guard mutations with same-origin checks. Use server-only service-role clients.
No RPC below should be called directly with browser credentials.

## RPCs

All argument names are the exact names in `supabase/schema.sql`.

- `admin_snapshot()` returns students, teams, team_players, leagues, league_teams,
  league_players, fixtures, polls and feedback. There is no events/registrations key.
- `admin_save_team(p_id, p_name, p_sport, p_student_ids)` creates/updates a team.
- `admin_create_league(p_name,p_sport,p_season,p_team_ids,p_best_of)` automatically
  creates home-and-away fixtures. `p_best_of` is 3 or 5 for Volleyball; NULL otherwise.
  Do not pass the old `p_pairs` argument.
- `admin_add_league_team(p_league_id,p_team_id)` creates both legs against the
  enrolled field. It rejects shared players within that league.
- `admin_add_fixture(p_league_id,p_home,p_away)` adds a manual pairing. Dates and
  venue are set by `admin_reschedule(p_fixture_id,p_scheduled_at,p_venue)`.
- `admin_create_friendly(...)` accepts existing team IDs or typed names on either
  side. Its optional `p_save_home`/`p_save_away` require the matching registered
  `p_home_student_ids`/`p_away_student_ids`. Best-of is chosen for each Volleyball
  Friendly. Return value is the **fixture ID**, not an Event ID.
- `admin_start(p_fixture_id)` atomically closes the poll and starts the match.
- `admin_score(p_fixture_id,p_side,p_increment)` uses `home`/`away`.
- `admin_end(p_fixture_id)` finalizes Football/Basketball and returns
  `{needs_result:false}`. For Volleyball it returns `{needs_result:true}` and
  marks the end time; show the final set form and call
  `admin_record_result(p_fixture_id,p_home_sets,p_away_sets)` to finalize and settle.
- `admin_correct_result(p_fixture_id,p_home,p_away,p_winner)` uses numeric score
  for Football/Basketball, numeric sets for Volleyball, or `p_winner=home|away`
  for a walkover. Ws and standings follow the corrected played result.
- `admin_walkover(p_fixture_id,p_winner)` and `admin_cancel(p_fixture_id,p_reason)`
  void predictions. Winner is a side string, because typed teams lack a team UUID.
- `admin_delete_fixture(p_fixture_id)` is only for an unstarted Scheduled fixture.
- `admin_archive(p_entity,p_id)` accepts `teams` or `leagues`.
- `admin_standings(p_league_id)` returns generic rows with rank, played, wins,
  draws, losses, scored, conceded, difference, points, pct, sets_won, sets_lost
  and set_difference. Format Football/Basketball/Volleyball columns appropriately;
  do not run the old JS points-only ranking afterward.
- `public_home()` returns teams, leagues, fixtures, standings and aggregate polls.
  It does not advance fixtures or expose student profiles/registrations/voters.
- `student_overview(p_student_id)` adds my_team_ids, my_polls and ws to public data.
- `whistle_poll_snapshot(p_fixture_id,p_student_id default null)` returns status,
  can_vote, my_choice, my_ws, total and tally. For public requests pass NULL.
- `student_vote(p_fixture_id,p_student_id,p_choice)` upserts `win_home`, `draw`
  or `win_away`. Do not offer Draw for Volleyball. Vote buttons appear on scheduled
  matches before Start, not below the Live scoreboard.
- `student_leaderboard(p_student_id)` returns the campus leaderboard; profile
  includes personal prediction totals. Do not expose raw ws_ledger records.
- `student_profile`, `student_notifications`, `student_read_notifications`,
  `student_set_notifications`, `student_submit_feedback`, `admin_review_feedback`
  keep the same argument names used in the SQL file. New notification types are
  `live_score`, `new_league`, `new_friendly`; map their labels accordingly.

## Fixture rendering

Use current team name/initials/logo when a team ID exists, otherwise the fixture's
typed name/initials. Per-side `home_logo_path`/`away_logo_path` override a team's
logo. `league_id=NULL` identifies a Friendly. There is no event_id. A scheduled
fixture may have no date. Use started_at/ended_at for real kickoff and recency.

For Volleyball final results use `home_sets`/`away_sets` and best_of; there is no
JSON set_score. For results use winner_side rather than winner_team_id. Show
Cancelled and its reason, retain its history and mark predictions Void. Show
walkovers without fabricated score or Ws.

## Logo upload handlers

Create the record first so its ID is known. Only admin sessions may request a
signed upload, complete it or remove/replace a logo. Generate a new random object
name each time. Accept PNG/JPG/WebP up to 2 MiB, validate the actual file bytes
server-side and confirm upload before calling `admin_set_logo`:

- Team: `teams/{team_id}/{random_uuid}.png|jpg|webp`.
- Temporary Friendly side: `fixtures/{fixture_id}/home|away/{random_uuid}.png|jpg|webp`.
- `admin_set_logo(p_entity,p_id,p_path,p_side)` takes `teams` or `fixtures`;
  p_side is needed only for fixtures. NULL path removes the logo and restores
  initials. SQL confirms the object's path and Storage metadata exist, but the
  HTTP handler must check file signatures and size. Do not accept arbitrary URLs.
- Public reads use the public `team-logos` bucket. Signed-upload creation and
  deletion use the service-role client after admin authorization.
- Remove superseded files using the Storage API after the new path is committed.

## Decisions carried forward as defaults

- Existing campus-only login, single-admin access, name/faculty/matric rules,
  archive controls, five-second refresh and visual style stay.
- Football/Basketball retain live increments; Volleyball retains final-only sets.
- Ws are cumulative, start at zero, and exact balance ties share leaderboard rank.
- Notification and feedback features retain their existing one-way behavior.
- Historical completed fixtures remain editable only through result correction.

Use the application and database scripts from this full package together.
