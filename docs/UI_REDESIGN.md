# Whistle UI redesign

The presentation follows the supplied sports-app references: cream/forest/lime in
light mode and near-black/charcoal/lime in dark mode, with original SVG court art,
rounded cards, pill actions, circular crests, bold italic display typography and
five mobile tabs. The desktop shell uses the same navigation as a slim rail at
960px and centres content within 1040px.

## Implementation

- `app/tokens.css`: supplied semantic light/dark colours, radii and shadows.
- `app/layout.jsx`: Bricolage Grotesque/Poppins through `next/font/google`, early
  theme script and media-specific theme metadata. No remote font link or Anton.
- `components/shared/ThemeToggle.jsx`: Light/Dark/System, guarded localStorage,
  system preference handling and synchronized theme-colour metadata.
- `components/shared/AppBar.jsx`, both layouts and navigation components: native
  mobile shell, notification shortcut, account menu and desktop rail. Layouts
  retain only their existing verified-account fetch.
- Shared MatchBoard/FixtureList/PollWidget/StandingsPreview: sport courts, featured
  scores, pre-match segmented predictions, visible Ws deltas and sticky team cells.
- All public/auth/student/admin pages and forms use the new presentation; every
  loading route uses shared skeleton cards and reduced-motion handling.
- `docs/UI_COMPLETE_FILES.md`: complete presentation files in the requested order.

The required metadata/manifest colour literals are kept as explicitly specified
in the brief; component and stylesheet presentation colours use tokens.
The existing PWA icon assets are retained. No external photos, real club crests,
invented avatars, odds or new dependencies were added.

## Verification

The existing unit and HTTP suites passed before work and after every numbered
stage. Tests were not edited. Full-application browser checks covered theme
switching, System mode, persistence, metadata updates, replacing a prediction,
logout and manual Start/score/End with immediate deletion protection.

Responsive visual/layout checks used temporary 390px and 360px iframe viewports
containing the server-rendered pages with hydration scripts omitted. These frames
checked CSS, bottom tabs, forms, standings and overflow in both themes; interactive
flows were checked in the full application. With classic browser scrollbars the
usable content widths were 375px/345px. All reviewed pages had scrollWidth equal
to clientWidth after the hidden-radio positioning fix. Basketball score buttons
are stacked on phones and measured 56px tall, at least 129px wide.

Reviewed pages: public home, login, signup, all eight student routes, admin match
desk, teams/new/edit, leagues/new/detail, Friendlies/new, feedback and match day.
The temporary review harness and demo environment file are excluded from delivery.

The managed development preview used font fallback when its Google font request
failed. The production build successfully downloaded and self-hosted the requested
Bricolage Grotesque and Poppins WOFF2 assets. A real physical-device installation,
flash detection via video capture and hosted Supabase/SMTP were not verified.

## Behaviour and setup

The API, `lib/`, `supabase/`, middleware, Next configuration, `scripts/`, `tests/`
and dependency manifests match the previous reorganized ZIP. All rules and setup
steps stay as documented in the root README and REBUILD_SCOPE.md. No schema rerun
or new Supabase credentials are required for this presentation update.
