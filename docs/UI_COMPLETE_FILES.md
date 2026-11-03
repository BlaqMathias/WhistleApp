# Whistle UI — complete files in review order

All files below are complete source files, not diffs. Their normal paths also exist in the ZIP. The shared CSS styles the retained form logic.

## 1. Foundations

Checklist: implementation complete; unchanged unit and HTTP suites passed after this stage.

### app/tokens.css

```css
:root {
  --bg: #F4F1E8;
  --surface: #FBFAF5;
  --surface-2: #ECE8DC;
  --ink: #0F1A14;
  --ink-muted: #5B655E;
  --line: #DAD5C6;
  --brand: #12372A;
  --on-brand: #F4F1E8;
  --accent: #C8F03C;
  --on-accent: #0F1A14;
  --link: #1B4332;
  --hot: #D6245F;
  --on-hot: #FFFFFF;
  --blue: #1F4FD8;
  --on-blue: #FFFFFF;
  --pitch: #24583C;
  --court-amber: #A35B19;
  --court-line: #FBFAF5;
  --shadow: 0 12px 32px -18px rgb(15 26 20 / .35);
  --featured: #12372A;
  --on-featured: #F4F1E8;
  --font-display: var(--font-bricolage), Arial, sans-serif;
  --font-body: var(--font-poppins), Arial, sans-serif;
  --r-card: 24px;
  --r-inner: 16px;
  --r-pill: 999px;
  color-scheme: light;
}
:root[data-theme="dark"] {
  --bg: #0D100E;
  --surface: #161A17;
  --surface-2: #1F2521;
  --ink: #F1F3EC;
  --ink-muted: #9AA39C;
  --line: #2A312C;
  --brand: #17412F;
  --on-brand: #F1F3EC;
  --accent: #C8F03C;
  --on-accent: #0F1A14;
  --link: #C8F03C;
  --hot: #FF5C7C;
  --on-hot: #0D100E;
  --blue: #6C93FF;
  --on-blue: #0D100E;
  --pitch: #24583C;
  --court-amber: #A35B19;
  --court-line: #FBFAF5;
  --shadow: none;
  --featured: #C8F03C;
  --on-featured: #0F1A14;
  color-scheme: dark;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
  --bg: #0D100E;
  --surface: #161A17;
  --surface-2: #1F2521;
  --ink: #F1F3EC;
  --ink-muted: #9AA39C;
  --line: #2A312C;
  --brand: #17412F;
  --on-brand: #F1F3EC;
  --accent: #C8F03C;
  --on-accent: #0F1A14;
  --link: #C8F03C;
  --hot: #FF5C7C;
  --on-hot: #0D100E;
  --blue: #6C93FF;
  --on-blue: #0D100E;
  --pitch: #24583C;
  --court-amber: #A35B19;
  --court-line: #FBFAF5;
  --shadow: none;
  --featured: #C8F03C;
  --on-featured: #0F1A14;
    color-scheme: dark;
  }
}
```

### app/globals.css

```css
@import "./tokens.css";

* { box-sizing: border-box; }
html { font-size: 16px; scroll-behavior: smooth; }
body { margin: 0; background: var(--bg); color: var(--ink); font-family: var(--font-body); font-size: 14px; line-height: 1.6; }
a { color: var(--link); text-underline-offset: 4px; }
button, input, select, textarea { font: inherit; }
button, a, input, select, textarea, summary { touch-action: manipulation; }
button { cursor: pointer; }
button:disabled { cursor: wait; opacity: .55; }
:focus-visible { outline: 2px solid var(--link); outline-offset: 4px; }
h1, h2, h3, p { margin: 0; }
h1, h2, .display, .score-number, .ws-hero strong { font-family: var(--font-display); font-weight: 800; font-style: italic; text-transform: uppercase; letter-spacing: -.04em; line-height: .95; }
h1 { font-size: 28px; }
h2 { font-size: 20px; }
h3 { font-size: 16px; line-height: 1.3; font-weight: 600; }
small, .help, .form-note { color: var(--ink-muted); font-size: 12px; }
.help { margin-top: 8px; }
button, .button, a, summary { -webkit-tap-highlight-color: transparent; }
svg { flex-shrink: 0; }
.icon { width: 24px; height: 24px; vertical-align: middle; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
.skip-link { position: fixed; top: -100px; left: 16px; padding: 12px 20px; z-index: 100; border-radius: var(--r-pill); background: var(--accent); color: var(--on-accent); }
.skip-link:focus { top: 12px; }
.wordmark { display: inline-block; font: 800 32px/.95 var(--font-display); letter-spacing: -.07em; color: inherit; }
.wordmark span { color: var(--link); }
.brand { display: inline-flex; text-decoration: none; color: var(--ink); min-height: 44px; align-items: center; }
main { width: 100%; max-width: 1040px; padding: 24px 16px 96px; margin: 0 auto; min-width: 0; }
.page-heading { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 24px; }
.page-heading > div { min-width: 0; }
.page-heading p { margin-top: 12px; color: var(--ink-muted); max-width: 56ch; }
.page-heading .actions { width: 100%; }
.section { margin-top: 32px; }
.section-title { margin-bottom: 16px; }
.section-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 16px; }
.section-header > * { min-width: 0; }
.section-header a { flex-shrink: 0; }
.quiet-link { display: inline-flex; align-items: center; min-height: 44px; font-size: 12px; font-weight: 600; }
.back-link { display: inline-flex; align-items: center; gap: 8px; min-height: 44px; margin-bottom: 12px; font-size: 12px; font-weight: 600; }
.back-link::before { content: '‹'; font-size: 24px; }
.actions { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
.button { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 48px; padding: 12px 24px; border: 1px solid transparent; border-radius: var(--r-pill); background: var(--accent); color: var(--on-accent); font-size: 13px; font-weight: 600; line-height: 1.4; text-decoration: none; text-align: center; transition: transform 180ms ease, background 180ms ease; }
.button:active:not(:disabled), .icon-button:active, .tab-bar a:active { transform: scale(.97); }
.button.secondary { background: var(--surface-2); color: var(--ink); border-color: var(--line); }
.button.small { min-height: 44px; padding: 10px 16px; font-size: 12px; }
.button.danger { background: transparent; border-color: var(--hot); color: var(--hot); }
.button.end-match { background: var(--hot); color: var(--on-hot); }
.icon-button { display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; padding: 0; border: 1px solid var(--line); border-radius: 50%; background: var(--surface); color: var(--ink); flex-shrink: 0; transition: transform 180ms ease; text-decoration: none; }
.chip-row { display: flex; align-items: center; gap: 8px; overflow-x: auto; scrollbar-width: none; padding: 4px 0 8px; }
.chip-row > * { flex-shrink: 0; }
.chip-row::-webkit-scrollbar { display: none; }
.chip { display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-height: 44px; padding: 8px 16px; border: 1px solid var(--line); border-radius: var(--r-pill); background: var(--surface-2); color: var(--ink); font-size: 12px; font-weight: 500; white-space: nowrap; text-decoration: none; transition: background 180ms ease; }
.chip[aria-current="page"], .chip[aria-pressed="true"] { background: var(--ink); color: var(--bg); border-color: var(--ink); }
.badge { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 5px 10px; border: 1px solid var(--line); border-radius: var(--r-pill); font-size: 10px; font-weight: 600; line-height: 1.2; text-transform: uppercase; letter-spacing: .04em; color: var(--ink-muted); background: var(--surface-2); }
.badge.live { background: var(--hot); color: var(--on-hot); border-color: var(--hot); }
.badge.open, .badge.active, .badge.new { background: var(--accent); color: var(--on-accent); border-color: var(--accent); }
.badge.scheduled { background: transparent; color: inherit; border-color: currentColor; }
.live-dot { width: 6px; height: 6px; background: currentColor; border-radius: 50%; animation: pulse 1.8s ease infinite; }
@keyframes pulse { 50% { opacity: .3; } }

input, select, textarea { width: 100%; min-width: 0; min-height: 48px; padding: 12px 16px; border: 1px solid var(--line); border-radius: var(--r-inner); background: var(--surface-2); color: var(--ink); font-size: 16px; }
input::placeholder, textarea::placeholder { color: var(--ink-muted); }
input[type="checkbox"], input[type="radio"] { width: 20px; min-height: 20px; height: 20px; flex-shrink: 0; accent-color: var(--link); }
input[type="file"] { font-size: 12px; padding: 10px; }
input::file-selector-button { border: 0; border-radius: var(--r-pill); background: var(--surface); color: var(--ink); padding: 8px 12px; margin-right: 8px; }
label { display: grid; gap: 8px; font-size: 12px; font-weight: 600; }
textarea { min-height: 144px; resize: vertical; }
fieldset { margin: 0; border: 0; padding: 0; min-width: 0; }
legend { font-size: 14px; font-weight: 600; margin-bottom: 12px; }
.form-stack { display: grid; gap: 20px; }
.form-panel { border: 1px solid var(--line); border-radius: var(--r-card); background: var(--surface); padding: 20px; min-width: 0; box-shadow: var(--shadow); }
.form-grid, .split-panel, .friendly-sides { display: grid; gap: 20px; min-width: 0; }
.form-message { padding: 12px 16px; border: 1px solid var(--line); border-left: 3px solid var(--link); border-radius: var(--r-inner); background: var(--surface-2); color: var(--ink); font-size: 13px; overflow-wrap: anywhere; }
.form-message.error { color: var(--hot); border-left-color: var(--hot); }
.inline-check, .student-choice, .selection-list label { display: flex; align-items: center; gap: 12px; min-height: 48px; }
.search-results { display: grid; max-height: 280px; overflow-y: auto; margin: 12px 0; }
.student-choice { padding: 12px; border-bottom: 1px solid var(--line); }
.student-choice small { display: block; font-weight: 400; margin-top: 4px; }
.selected-roster, .selection-list { display: flex; flex-wrap: wrap; gap: 8px; }
.selection-list label { padding: 8px 12px; border: 1px solid var(--line); border-radius: var(--r-inner); background: var(--surface-2); }
.roster-chip { display: inline-flex; align-items: center; padding-left: 12px; border-radius: var(--r-pill); background: var(--surface-2); font-size: 12px; }
.roster-chip button { width: 44px; height: 44px; border: 0; border-radius: 50%; background: transparent; color: var(--ink); }
.fixture-filters { display: grid; gap: 16px; border: 1px solid var(--line); border-radius: var(--r-card); padding: 16px; background: var(--surface); }
.fixture-filters .chip-row { grid-column: 1 / -1; }
.fixture-filters select { border-radius: var(--r-pill); }
.fixture-filters .actions { grid-column: 1 / -1; }
details { min-width: 0; }
summary { min-height: 48px; display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 12px; font-weight: 600; color: var(--link); padding: 12px 0; list-style: none; }
summary::-webkit-details-marker { display: none; }
summary::after { content: '+'; margin-left: auto; font-size: 20px; }
details[open] > summary::after { content: '−'; }
.archive-section, .league-tools, .secondary-flows { border: 1px solid var(--line); border-radius: var(--r-card); padding: 12px 20px; margin-top: 24px; background: var(--surface); }
.secondary-flows { display: grid; gap: 12px; }

.empty-state { display: grid; justify-items: center; text-align: center; gap: 12px; padding: 32px 20px; border: 1px dashed var(--line); border-radius: var(--r-card); background: var(--surface); }
.empty-state h3 { font-family: var(--font-display); font-style: italic; font-weight: 800; text-transform: uppercase; font-size: 20px; }
.empty-state p { font-size: 12px; color: var(--ink-muted); max-width: 38ch; }
.empty-mark { display: grid; place-items: center; width: 48px; height: 48px; border-radius: 50%; color: var(--link); background: var(--surface-2); }
.skeleton-stack { display: grid; gap: 20px; }
.skeleton { position: relative; overflow: hidden; border-radius: var(--r-card); background: var(--surface-2); }
.skeleton::after { content: ''; position: absolute; inset: 0; background: linear-gradient(100deg, transparent, color-mix(in srgb, var(--surface) 65%, transparent), transparent); transform: translateX(-100%); animation: shimmer 1.5s infinite; }
.skeleton-title { height: 32px; width: 65%; }
.skeleton-hero { height: 180px; }
.skeleton-tile { height: 112px; }
.skeleton-match { height: 220px; }
@keyframes shimmer { 100% { transform: translateX(100%); } }
.offline-notice { position: fixed; left: 16px; right: 16px; bottom: calc(88px + env(safe-area-inset-bottom)); z-index: 80; max-width: 520px; margin: 0 auto; padding: 16px 20px; border: 1px solid var(--line); border-radius: var(--r-inner); background: var(--ink); color: var(--bg); box-shadow: var(--shadow); font-size: 12px; }

.app-shell { min-height: 100dvh; }
.app-bar { position: sticky; top: 0; z-index: 30; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 16px; border-bottom: 1px solid var(--line); background: var(--bg); }
.app-bar .actions { flex-wrap: nowrap; gap: 8px; }
.app-brand small { display: block; color: var(--ink-muted); font-size: 10px; letter-spacing: .04em; }
.app-brand .brand { min-height: 32px; }
.app-menu { position: relative; }
.app-menu summary { color: var(--ink); }
.app-menu summary::after { display: none; }
.app-menu-panel { position: absolute; top: 52px; right: 0; width: 220px; padding: 16px; border-radius: var(--r-inner); background: var(--surface); border: 1px solid var(--line); box-shadow: var(--shadow); }
.app-menu-panel form { margin-top: 12px; }
.tab-bar { position: fixed; z-index: 50; bottom: 0; left: 0; right: 0; display: grid; grid-template-columns: repeat(5, minmax(0,1fr)); height: calc(64px + env(safe-area-inset-bottom)); padding: 6px 8px calc(6px + env(safe-area-inset-bottom)); border-top: 1px solid var(--line); background: var(--surface); }
.tab-bar a { display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 2px; min-width: 0; min-height: 48px; color: var(--ink-muted); text-decoration: none; font-size: 10px; transition: transform 180ms ease; }
.tab-icon { display: grid; place-items: center; min-width: 48px; height: 30px; border-radius: var(--r-pill); }
.tab-bar a.active { color: var(--ink); font-weight: 700; }
.tab-bar a.active .tab-icon { color: var(--on-accent); background: var(--accent); }
.rail-brand { display: none; }
.sign-out { min-height: 48px; width: 100%; border: 1px solid var(--hot); border-radius: var(--r-pill); padding: 12px; background: transparent; color: var(--hot); font-weight: 600; }

.quick-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 8px; margin: 24px 0; }
.quick-tile { position: relative; min-width: 0; display: flex; flex-direction: column; align-items: flex-start; justify-content: space-between; gap: 12px; min-height: 120px; padding: 16px 12px; border-radius: var(--r-inner); background: var(--accent); color: var(--on-accent); text-decoration: none; }
.quick-tile:nth-child(3n+2) { background: var(--blue); color: var(--on-blue); }
.quick-tile:nth-child(3n) { background: var(--hot); color: var(--on-hot); }
.quick-tile > span { font-size: 11px; font-weight: 600; line-height: 1.4; }
.quick-tile strong { font-family: var(--font-display); font-size: 24px; font-weight: 800; line-height: 1; }
.tile-count { position: absolute; top: 12px; right: 12px; padding: 2px 7px; border: 1px solid currentColor; border-radius: var(--r-pill); font-size: 10px; }
.hero-card { position: relative; isolation: isolate; overflow: hidden; border-radius: var(--r-card); padding: 28px 24px; background: var(--brand); color: var(--on-brand); }
.hero-card h1, .hero-card h2 { position: relative; font-size: 40px; max-width: 13ch; }
.hero-card h1 em, .hero-card h2 em { color: var(--accent); }
.hero-card p { margin: 16px 0 20px; max-width: 40ch; font-size: 13px; }
.hero-card .quiet-link { color: var(--on-brand); }
.hero-kicker { display: block; margin-bottom: 16px; text-transform: uppercase; letter-spacing: .08em; font-size: 10px; font-weight: 500; }
.hero-card > .court-art { position: absolute; inset: 0; height: auto; opacity: .2; z-index: -1; }
.greeting-row { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
.initial-avatar { display: grid; place-items: center; width: 44px; height: 44px; flex-shrink: 0; border-radius: 50%; border: 1px solid var(--line); color: var(--link); background: var(--surface-2); font-weight: 600; }
.greeting-row p { color: var(--ink-muted); font-size: 11px; }
.greeting-row h1 { font-size: 24px; }
.ws-pill { display: inline-flex; align-items: center; gap: 4px; margin-left: auto; min-height: 44px; padding: 8px 12px; border-radius: var(--r-pill); background: var(--accent); color: var(--on-accent); text-decoration: none; font-size: 12px; font-weight: 600; white-space: nowrap; }
.ws-balance { display: inline-flex; flex-direction: column; color: var(--link); text-decoration: none; min-height: 44px; }
.ws-balance span { font-size: 10px; text-transform: uppercase; letter-spacing: .04em; }
.ws-balance strong { font-family: var(--font-display); font-size: 24px; }

.court-art { height: 48px; overflow: hidden; background: var(--pitch); color: var(--court-line); }
.court-art.basketball { background: var(--court-amber); }
.court-art.volleyball { background: var(--blue); color: var(--on-blue); }
.court-art svg { width: 100%; height: 100%; stroke: currentColor; stroke-width: 1.2; opacity: .55; }
.live-board { display: block; margin: 16px 0; overflow: hidden; border-radius: var(--r-card); border: 1px solid var(--line); color: var(--ink); background: var(--surface); box-shadow: var(--shadow); text-decoration: none; }
.board-content { padding: 16px 20px; }
.board-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 10px; }
.board-meta > span:not(.badge) { max-width: 100%; overflow-wrap: anywhere; }
.score-line { display: grid; grid-template-columns: minmax(0,1fr) auto minmax(0,1fr); align-items: center; gap: 12px; margin: 24px 0; }
.score-team { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; min-width: 0; }
.score-team > span:last-child { font-family: var(--font-display); font-size: 16px; font-weight: 800; text-transform: uppercase; font-style: italic; letter-spacing: -.03em; line-height: 1.05; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; overflow-wrap: anywhere; }
.team-mark { display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; flex-shrink: 0; border-radius: 50%; border: 1px solid var(--line); background: var(--surface-2); color: var(--ink); font: italic 800 18px/1 var(--font-display); overflow: hidden; }
.team-mark img { width: 100%; height: 100%; object-fit: cover; }
.score-number { font-size: 36px; white-space: nowrap; font-variant-numeric: tabular-nums; }
.score-state { font-size: 18px; }
.board-footer { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; padding-top: 12px; border-top: 1px solid color-mix(in srgb, currentColor 20%, transparent); font-size: 10px; }
.board-footer > * { max-width: 55%; }
.board-footer > :last-child { text-align: right; }
.board-note { margin-top: 12px; font-size: 12px; }
.featured-match { background: var(--featured); color: var(--on-featured); }
.featured-match .court-art { height: 64px; }
.featured-match .score-number { font-size: 44px; }
.featured-match .team-mark { width: 56px; height: 56px; }
.featured-match .score-line { margin: 28px 0; }
.fixture-stack { display: grid; gap: 16px; }
.fixture-item { min-width: 0; border: 1px solid var(--line); border-radius: var(--r-card); background: var(--surface); overflow: hidden; box-shadow: var(--shadow); }
.fixture-item .live-board { border: 0; box-shadow: none; margin: 0; border-radius: 0; }
.fixture-item > .help { padding: 0 20px 16px; }
.fixture-item .prediction-details { margin: 0; padding: 0 20px 8px; border-top: 1px solid var(--line); }
.fixture-control-link { display: flex; padding: 0 20px 12px; }
.prediction-details { margin-top: 12px; }
.my-team-row { background: color-mix(in srgb, var(--accent) 12%, var(--surface)); }
.fixture-item.my-team-row { border-color: var(--link); }
.live-match { min-width: 0; }
.poll-panel { padding: 20px; background: var(--surface); color: var(--ink); border: 1px solid var(--line); border-radius: var(--r-card); margin-top: 12px; }
.prediction-details .poll-panel { padding: 12px 0; border: 0; border-radius: 0; }
.poll-choices { display: flex; padding: 4px; gap: 4px; border-radius: var(--r-pill); background: var(--surface-2); margin: 16px 0; }
.poll-choices .button { flex: 1; min-width: 0; border: 0; padding: 10px 8px; font-size: 11px; background: transparent; color: var(--ink); }
.poll-choices .button[aria-pressed="true"] { background: var(--accent); color: var(--on-accent); }
.poll-tally { display: grid; gap: 12px; margin: 16px 0; }
.poll-tally-label { display: flex; justify-content: space-between; align-items: center; gap: 12px; font-size: 11px; margin-bottom: 6px; }
.poll-tally-label > span:last-child { flex-shrink: 0; }
.poll-my-choice { display: inline-block; padding: 2px 6px; margin-left: 6px; background: var(--accent); color: var(--on-accent); border-radius: var(--r-pill); font-size: 9px; }
.progress-line { appearance: none; display: block; width: 100%; height: 8px; border: 0; border-radius: var(--r-pill); overflow: hidden; background: var(--surface-2); color: var(--link); }
.progress-line::-webkit-progress-bar { background: var(--surface-2); border-radius: var(--r-pill); }
.progress-line::-webkit-progress-value { background: var(--link); border-radius: var(--r-pill); }
.progress-line::-moz-progress-bar { background: var(--link); border-radius: var(--r-pill); }
.ws-award { font-weight: 600; font-size: 13px; margin-top: 12px; }
.ws-award.positive { color: var(--link); }
.ws-award.negative, .ws-negative { color: var(--hot); }

.table-wrap { overflow-x: auto; max-width: 100%; border: 1px solid var(--line); border-radius: var(--r-card); background: var(--surface); }
table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 12px; font-variant-numeric: tabular-nums; }
th, td { padding: 14px 12px; text-align: left; border-bottom: 1px solid var(--line); white-space: nowrap; }
th { color: var(--ink-muted); background: var(--surface-2); font-size: 10px; text-transform: uppercase; letter-spacing: .04em; font-weight: 500; }
tr:last-child td { border-bottom: 0; }
caption { padding: 16px; text-align: left; font-weight: 600; }
.numeric { text-align: right; }
td a { display: inline-flex; align-items: center; min-height: 44px; }
.standings td:first-child, .standings th:first-child { position: sticky; left: 0; z-index: 2; background: var(--surface); }
.standings th:first-child { background: var(--surface-2); }
.standings .my-team-row td { background: color-mix(in srgb, var(--accent) 16%, var(--surface)); }
.team-cell { display: flex; gap: 10px; align-items: center; }
.table-wrap .team-mark { width: 28px; height: 28px; font-size: 12px; }
.table-sub { display: block; color: var(--ink-muted); font-size: 10px; margin-top: 3px; }
.rank-mark { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border: 1px solid var(--line); border-radius: 50%; font-size: 10px; flex-shrink: 0; }
.rank-mark.top-rank { background: var(--accent); color: var(--on-accent); border-color: var(--accent); }
.student-teams { display: flex; overflow-x: auto; gap: 12px; padding-bottom: 8px; scroll-snap-type: x mandatory; }
.student-team { display: flex; align-items: center; gap: 12px; flex-shrink: 0; padding: 12px 16px; min-width: 180px; border: 1px solid var(--line); border-radius: var(--r-inner); background: var(--surface); scroll-snap-align: start; }
.student-team strong { font-size: 12px; }
.meta-grid { display: grid; gap: 20px; margin: 24px 0; }
dt { color: var(--ink-muted); font-size: 11px; }
dd { margin: 4px 0 0; font-weight: 500; overflow-wrap: anywhere; }
.profile-email { overflow-wrap: anywhere; }
.message-row { position: relative; padding: 20px; background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-card); margin-top: 16px; }
.message-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
.feedback-message { margin: 16px 0; white-space: pre-wrap; overflow-wrap: anywhere; }
.notification-feed { list-style: none; margin: 0; padding: 0; }
.notification-meta { display: flex; justify-content: space-between; gap: 12px; align-items: center; margin-top: 16px; }
.notification-unread::before { content: ''; position: absolute; top: 22px; left: 7px; width: 6px; height: 6px; border-radius: 50%; background: var(--link); }
.notification-unread { border-color: var(--link); }
.theme-options { display: flex; padding: 4px; background: var(--surface-2); border-radius: var(--r-pill); }
.theme-options button { flex: 1; min-height: 44px; border: 0; border-radius: var(--r-pill); background: transparent; color: var(--ink); font-size: 12px; }
.theme-options button[aria-pressed="true"] { background: var(--ink); color: var(--bg); }
.ws-hero { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 12px; padding: 24px 16px; border-radius: var(--r-card); background: var(--brand); color: var(--on-brand); }
.ws-hero span { display: block; font-size: 10px; margin-bottom: 12px; }
.ws-hero strong { font-size: 24px; display: block; overflow-wrap: anywhere; }
.ws-hero small { color: inherit; font-size: 12px; }
.leader-list { list-style: none; display: grid; gap: 8px; padding: 0; }
.leader-row { display: flex; align-items: center; gap: 12px; min-height: 80px; padding: 16px; border: 1px solid var(--line); border-radius: var(--r-inner); background: var(--surface); }
.leader-row.my-team-row { background: color-mix(in srgb, var(--accent) 14%, var(--surface)); border-color: var(--link); }
.leader-details { flex: 1; min-width: 0; }
.leader-details strong { display: block; font-size: 13px; overflow-wrap: anywhere; }
.leader-details small { display: block; font-size: 10px; }
.leader-ws { font-weight: 600; white-space: nowrap; font-size: 13px; }
.podium { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); align-items: end; gap: 8px; margin: 24px 0; }
.podium-card { display: grid; justify-items: center; text-align: center; gap: 10px; padding: 20px 8px; background: var(--surface-2); border-radius: var(--r-inner); border: 1px solid var(--line); min-width: 0; }
.podium-card:first-child { padding-top: 36px; background: var(--accent); color: var(--on-accent); }
.podium-card strong { font-size: 11px; overflow-wrap: anywhere; }
.podium-card span { font-size: 11px; }
.pinned-rank { position: sticky; top: 76px; z-index: 10; }
.profile-links { display: grid; gap: 8px; }
.profile-link { display: flex; align-items: center; gap: 12px; min-height: 64px; padding: 16px; border: 1px solid var(--line); border-radius: var(--r-inner); background: var(--surface); text-decoration: none; font-size: 13px; font-weight: 500; }
.profile-link .icon:last-child { margin-left: auto; }
.match-actions { padding: 20px; border-radius: var(--r-card); border: 1px solid var(--line); background: var(--surface); }
.score-controls { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 12px; margin: 24px 0; }
.score-controls legend { font-size: 12px; }
.score-buttons { display: flex; gap: 6px; }
.score-buttons .button { flex: 1; min-width: 0; min-height: 56px; padding: 10px 8px; font-size: 20px; }
.match-actions > .button, .match-start > .button { width: 100%; margin-top: 20px; }
.match-start { padding: 24px; border: 1px solid var(--line); border-radius: var(--r-card); background: var(--surface); }
.match-sticky { position: sticky; top: 76px; z-index: 20; }

.login-page { padding: 0 0 32px; max-width: 560px; min-height: 100dvh; }
.login-identity { position: relative; overflow: hidden; padding: 24px 24px 72px; border-radius: 0 0 40px 40px; background: var(--brand); color: var(--on-brand); }
.login-identity .brand { color: var(--on-brand); }
.login-identity .wordmark span { color: var(--accent); }
.login-identity h1 { font-size: 40px; margin: 36px 0 16px; }
.login-identity p, .login-identity > span { font-size: 12px; opacity: .9; }
.login-identity > span { display: block; margin-top: 24px; }
.login-form { position: relative; margin: -40px 16px 0; padding: 24px; border: 1px solid var(--line); border-radius: var(--r-card); background: var(--surface); box-shadow: var(--shadow); }
.login-form h2 { margin-bottom: 24px; }
.login-form .button { width: 100%; }
.auth-theme { position: absolute; top: 20px; right: 20px; }
.auth-theme .icon-button { color: var(--on-brand); border-color: color-mix(in srgb, var(--on-brand) 30%, transparent); background: transparent; }

@media (min-width: 480px) {
  main { padding-left: 20px; padding-right: 20px; }
  .app-bar { padding-left: 20px; padding-right: 20px; }
  .form-grid, .friendly-sides, .split-panel { grid-template-columns: repeat(2,minmax(0,1fr)); }
  .fixture-filters { grid-template-columns: repeat(2,minmax(0,1fr)); }
  .quick-tile { padding: 20px; }
}
@media (min-width: 720px) {
  .fixture-stack { grid-template-columns: repeat(2,minmax(0,1fr)); }
  .page-heading .actions { width: auto; }
  .quick-grid { gap: 16px; }
  .live-grid, .overview-hero-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 20px; align-items: start; }
  .hero-card { min-height: 240px; display: flex; flex-direction: column; justify-content: center; }
}
@media (min-width: 960px) {
  .app-shell { padding-left: 104px; }
  .tab-bar { top: 0; bottom: 0; right: auto; width: 104px; height: 100dvh; display: flex; flex-direction: column; padding: 20px 8px; border-top: 0; border-right: 1px solid var(--line); gap: 8px; }
  .tab-bar a { min-height: 68px; }
  .tab-bar .rail-brand { display: grid; font: 800 32px/1 var(--font-display); color: var(--link); min-height: 60px; margin-bottom: 24px; }
  .app-bar { padding-left: max(24px, calc((100vw - 1144px)/2 + 20px)); padding-right: max(24px, calc((100vw - 1144px)/2 + 20px)); }
  main { padding-top: 32px; padding-bottom: 48px; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; animation: none !important; transition: none !important; }
}
.login-identity { isolation: isolate; }
.login-identity > .court-art { position: absolute; inset: 0; height: 100%; z-index: -1; opacity: .15; }
.login-identity .wordmark { font-size: 36px; }
.login-form .form-stack > label { gap: 8px; }

.app-greeting { display: flex; align-items: center; gap: 12px; min-height: 44px; text-decoration: none; color: var(--ink); }
.app-greeting small { display: block; font-size: 10px; }
.app-greeting strong { display: block; font-size: 13px; }

.filter-chips { grid-column: 1 / -1; width: 100%; min-width: 0; }
.filter-chips legend { font-size: 12px; margin-bottom: 4px; }
.chip:has(input:checked) { background: var(--ink); color: var(--bg); border-color: var(--ink); }
.chip:has(input:focus-visible) { outline: 2px solid var(--link); outline-offset: 3px; }
.chip:has(input:disabled) { opacity: .55; }
.standings .team-cell strong { display: inline-block; max-width: 130px; overflow: hidden; text-overflow: ellipsis; }

.team-card-grid, .league-card-grid { display: grid; gap: 12px; }
.team-card { display: block; min-width: 0; padding: 20px; border: 1px solid var(--line); border-radius: var(--r-card); background: var(--surface); color: var(--ink); text-decoration: none; }
.team-card-top, .team-card-bottom { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.team-card h3 { font: italic 800 24px/1 var(--font-display); text-transform: uppercase; margin: 20px 0 12px; }
.team-card-bottom { font-size: 12px; color: var(--ink-muted); }
.league-card { display: block; overflow: hidden; color: var(--ink); border: 1px solid var(--line); border-radius: var(--r-card); text-decoration: none; background: var(--surface); }
.league-card .court-art { height: 80px; }
.league-card-content { padding: 20px; }
.league-card-stats { display: flex; flex-wrap: wrap; gap: 16px; margin: 20px 0 4px; font-size: 12px; }
.league-card-stats > span { display: inline-flex; align-items: center; gap: 6px; }
.league-card-stats .icon { width: 18px; height: 18px; }
@media (min-width: 640px) { .team-card-grid, .league-card-grid { grid-template-columns: repeat(2,minmax(0,1fr)); } }

.tab-bar .rail-brand { display: none; }
.app-brand .brand { min-height: 44px; }
.login-form p a { display: inline-flex; align-items: center; min-height: 44px; }
.match-actions select { min-height: 56px; }
.match-sticky .live-board { margin-top: 0; }
.schedule-details > summary { font-size: 13px; }
@media (min-width: 960px) { .tab-bar .rail-brand { display: grid; } }

.chip { position: relative; }
input.sr-only { position: absolute; top: 0; left: 0; width: 1px; height: 1px; min-height: 0; padding: 0; margin: 0; border: 0; clip-path: inset(50%); }
.score-buttons { display: grid; grid-template-columns: 1fr; }
@media (min-width: 480px) { .score-buttons { display: flex; } }
.ws-balance { padding: 8px 16px; border-radius: var(--r-pill); background: var(--accent); color: var(--on-accent); }
.ws-balance strong { font-size: 20px; }
```

### app/home.css

```css
.public-site { max-width: 1040px; margin: 0 auto; }
.public-header { position: sticky; top: 0; z-index: 30; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 16px; background: var(--bg); border-bottom: 1px solid var(--line); }
.public-campus { display: block; font-size: 10px; font-family: var(--font-body); font-weight: 400; letter-spacing: 0; color: var(--ink-muted); margin-top: 6px; }
.public-header .brand { display: block; }
.public-header .actions { gap: 8px; }
.public-header .button { padding: 10px 16px; }
.public-nav { display: flex; gap: 8px; width: 100%; }
.public-nav a { display: inline-flex; align-items: center; min-height: 44px; padding: 8px 16px; font-size: 12px; border-radius: var(--r-pill); background: var(--surface-2); text-decoration: none; }
.public-home { padding-top: 20px; }
.home-intro { display: grid; gap: 24px; }
.home-intro-copy { padding: 32px 24px; border-radius: var(--r-card); background: var(--brand); color: var(--on-brand); position: relative; isolation: isolate; overflow: hidden; }
.home-intro-copy > .court-art { position: absolute; inset: 0; height: auto; opacity: .18; z-index: -1; }
.home-intro h1 { font-size: 40px; }
.home-intro h1 em { color: var(--accent); }
.home-campus-line { font-size: 10px; letter-spacing: .06em; text-transform: uppercase; margin-bottom: 20px; }
.home-intro-description { font-size: 13px; max-width: 40ch; margin: 20px 0 24px; }
.home-intro-copy .quiet-link { color: var(--on-brand); }
.home-feature { min-width: 0; }
.home-feature-caption { display: flex; align-items: center; justify-content: space-between; font-size: 12px; font-weight: 600; }
.home-feature .live-board { margin-bottom: 0; }
.home-pitch { padding: 24px; border-radius: var(--r-card); background: var(--surface-2); }
.home-pitch .court-art { border-radius: var(--r-inner); height: 120px; margin-bottom: 20px; }
.home-pitch h2 { font-size: 28px; }
.home-pitch p { margin-top: 12px; color: var(--ink-muted); }
.home-section { padding-top: 32px; scroll-margin-top: 160px; }
.home-section-heading { display: grid; gap: 16px; margin-bottom: 16px; }
.home-sports { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 8px; scrollbar-width: none; }
.home-sports a { display: inline-flex; align-items: center; gap: 6px; min-height: 44px; padding: 8px 16px; white-space: nowrap; border-radius: var(--r-pill); border: 1px solid var(--line); background: var(--surface-2); font-size: 12px; color: var(--ink); text-decoration: none; }
.home-sports a[aria-current="page"] { background: var(--ink); color: var(--bg); border-color: var(--ink); }
.home-live-grid, .home-fixture-grid { display: grid; gap: 16px; }
.home-live-grid .live-board { margin: 0; }
.home-recent { margin-top: 32px; }
.home-recent > h3 { font: italic 800 20px/.95 var(--font-display); text-transform: uppercase; margin-bottom: 16px; }
.home-result-grid { display: flex; gap: 12px; overflow-x: auto; scroll-snap-type: x mandatory; padding-bottom: 12px; }
.home-result { min-width: 270px; flex: 0 0 80%; max-width: 360px; padding: 20px; background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-card); scroll-snap-align: start; }
.home-result-meta { display: flex; justify-content: space-between; gap: 12px; font-size: 10px; margin-bottom: 16px; }
.home-result h3 { font-size: 14px; }
.home-versus { color: var(--ink-muted); font-size: 11px; }
.home-result-score { font: italic 800 40px/1 var(--font-display); margin: 16px 0; }
.home-fixture { padding: 20px; border: 1px solid var(--line); border-radius: var(--r-card); background: var(--surface); }
.home-fixture h3 { margin: 16px 0; font-family: var(--font-display); text-transform: uppercase; font-weight: 800; font-style: italic; }
.home-fixture-versus { display: inline-block; padding: 0 8px; color: var(--ink-muted); font-family: var(--font-body); font-size: 10px; font-style: normal; }
.home-fixture > p { font-size: 12px; }
.home-league { margin-top: 24px; }
.home-league-name { font-size: 12px; font-weight: 500; margin-bottom: 16px; }
.home-invitation { display: grid; gap: 24px; padding: 32px 24px; margin-top: 32px; border-radius: var(--r-card); background: var(--brand); color: var(--on-brand); }
.home-invitation h2 { font-size: 36px; }
.home-invitation h2 em { color: var(--accent); }
.home-invitation p { margin-top: 20px; max-width: 54ch; font-size: 13px; }
.public-footer { display: grid; gap: 16px; padding: 24px 16px 40px; border-top: 1px solid var(--line); }
.public-footer p { font-size: 12px; color: var(--ink-muted); }
@media (min-width: 480px) { .public-header { padding-left: 20px; padding-right: 20px; } }
@media (min-width: 720px) {
  .home-intro { grid-template-columns: 1fr 1fr; align-items: stretch; }
  .home-intro-copy { display: flex; flex-direction: column; justify-content: center; }
  .home-live-grid, .home-fixture-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
  .home-invitation { grid-template-columns: 1fr auto; align-items: center; }
  .public-nav { width: auto; }
  .public-footer { display: flex; justify-content: space-between; align-items: center; }
}
```

### app/layout.jsx

```jsx
import "./globals.css";
import {Bricolage_Grotesque, Poppins} from "next/font/google";
import PWA from "@/components/shared/PWA";
const display = Bricolage_Grotesque({subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-bricolage", display: "swap"});
const body = Poppins({subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-poppins", display: "swap"});
const themeScript = `(function(){try{var t=localStorage.getItem('whistle-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t;}catch(e){}var c=getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();if(c)document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){m.content=c;m.removeAttribute('media');});})();`;
export const metadata = {
  title: {default: "Whistle | Topfaith campus sports", template: "%s | Whistle"},
  description: "Live scores, upcoming fixtures, league tables, and campus sports at Topfaith University.",
};
export const viewport = {
  width: "device-width", initialScale: 1, viewportFit: "cover",
  themeColor: [{media: "(prefers-color-scheme: light)", color: "#F4F1E8"}, {media: "(prefers-color-scheme: dark)", color: "#0D100E"}],
};
export default function RootLayout({children}) {
  return <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning><head>
    <link rel="manifest" href="/manifest.json"/><link rel="icon" href="/icons/whistle.svg" type="image/svg+xml"/><link rel="apple-touch-icon" href="/icons/icon-192.png"/>
    <meta name="mobile-web-app-capable" content="yes"/><meta name="apple-mobile-web-app-capable" content="yes"/><meta name="apple-mobile-web-app-title" content="Whistle"/><meta name="apple-mobile-web-app-status-bar-style" content="default"/>
    <script dangerouslySetInnerHTML={{__html: themeScript}}/>
  </head><body><a className="skip-link" href="#main">Skip to content</a><PWA/>{children}</body></html>;
}
```

### components/shared/Icon.jsx

```jsx
const paths = {
  home: "m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z",
  calendar: "M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM7 3v4m10-4v4M3 11h18m-14 4h2m6 0h2m-10 3h2",
  live: "M4 10v4m4-7v10m4-13v16m4-13v10m4-7v4",
  trophy: "M8 3h8v7a4 4 0 0 1-8 0ZM8 5H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4m-4 2v6m-4 1h8",
  user: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2",
  bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Zm-8 12a2 2 0 0 0 4 0",
  sun: "M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1",
  moon: "M21 13A9 9 0 0 1 11 3a9 9 0 1 0 10 10Z",
  'chevron-left': "m15 5-7 7 7 7",
  'chevron-right': "m9 5 7 7-7 7",
  filter: "M4 7h16M7 12h10m-7 5h4",
  plus: "M12 4v16M4 12h16",
  check: "m5 12 4 4L19 6",
  users: "M14 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM2 21v-2a7 7 0 0 1 14 0v2m1-17a4 4 0 0 1 0 8m2 4a6 6 0 0 1 3 5",
  whistle: "M4 9h10l3-5h4l-3 8h-4a6 6 0 1 1-10-3Zm5 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z",
};
export default function Icon({name, className = ""}) {
  return <svg className={`icon ${className}`} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.whistle}/></svg>;
}
```

### components/shared/ThemeToggle.jsx

```jsx
"use client";
import {useEffect, useState} from "react";
import Icon from "./Icon";
export default function ThemeToggle({segmented = false}) {
  const [choice, setChoice] = useState("system");
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    function sync(event) {
      let saved = "system";
      try { saved = localStorage.getItem("whistle-theme") || "system"; } catch {}
      if (event?.type === "whistle-theme-change") saved = event.detail;
      if (!["light", "dark"].includes(saved)) saved = "system";
      const root = document.documentElement;
      if (saved === "system") root.removeAttribute("data-theme");
      else root.dataset.theme = saved;
      setChoice(saved);
      setDark(saved === "dark" || (saved === "system" && media.matches));
      const colour = getComputedStyle(root).getPropertyValue("--bg").trim();
      document.querySelectorAll('meta[name="theme-color"]').forEach(meta => { meta.content = colour; meta.removeAttribute("media"); });
    }
    sync();
    media.addEventListener("change", sync);
    window.addEventListener("storage", sync);
    window.addEventListener("whistle-theme-change", sync);
    return () => {
      media.removeEventListener("change", sync);
      window.removeEventListener("storage", sync);
      window.removeEventListener("whistle-theme-change", sync);
    };
  }, []);
  function choose(value) {
    try {
      if (value === "system") localStorage.removeItem("whistle-theme");
      else localStorage.setItem("whistle-theme", value);
    } catch {}
    const root = document.documentElement;
    if (value === "system") root.removeAttribute("data-theme");
    else root.dataset.theme = value;
    setChoice(value);
    const isDark = value === "dark" || (value === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(isDark);
    const colour = getComputedStyle(root).getPropertyValue("--bg").trim();
    document.querySelectorAll('meta[name="theme-color"]').forEach(meta => {meta.content = colour; meta.removeAttribute("media");});
    window.dispatchEvent(new CustomEvent("whistle-theme-change", {detail: value}));
  }
  if (segmented) return <div className="theme-options" role="group" aria-label="Appearance">{["light", "dark", "system"].map(value => <button key={value} type="button" aria-pressed={choice === value} onClick={() => choose(value)}>{value[0].toUpperCase() + value.slice(1)}</button>)}</div>;
  return <button type="button" className="icon-button" aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} onClick={() => choose(dark ? "light" : "dark")}><Icon name={dark ? "sun" : "moon"}/></button>;
}
```

### components/shared/AppBar.jsx

```jsx
"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useEffect, useState} from "react";
import Logo from "./Logo";
import Icon from "./Icon";
import ThemeToggle from "./ThemeToggle";
export default function AppBar({name, admin = false}) {
  const path = usePathname();
  const [greeting, setGreeting] = useState("Good morning");
  useEffect(() => {
    const hour = Number(new Intl.DateTimeFormat("en-GB", {timeZone: "Africa/Lagos", hour: "numeric", hourCycle: "h23"}).format(new Date()));
    setGreeting(hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening");
  }, []);
  const home = path === "/student" && !admin;
  const initials = name.split(/\s+/).filter(Boolean).slice(0,2).map(n => n[0]).join("");
  return <header className="app-bar">{home ? <Link className="app-greeting" href="/student/profile"><span className="initial-avatar">{initials}</span><span><small>{greeting}</small><strong>{name.split(" ")[0]}</strong></span></Link> : <div className="app-brand"><Link className="brand" href={admin ? "/dashboard" : "/student"} aria-label={admin ? "Whistle match desk" : "Whistle student overview"}><Logo/></Link><small>{admin ? "Campus sports / Admin" : "Topfaith campus sports"}</small></div>}<div className="actions"><ThemeToggle/>{admin ? <details className="app-menu"><summary className="icon-button" aria-label="Admin account"><Icon name="user"/></summary><div className="app-menu-panel"><strong>{name}</strong><form action="/api/auth/logout" method="post"><button type="submit" className="sign-out">Sign out</button></form></div></details> : <Link className="icon-button" href="/student/notifications" aria-label="Notifications"><Icon name="bell"/></Link>}</div></header>;
}
```

### components/shared/Court.jsx

```jsx
export default function Court({sport = "football"}) {
  return <div className={`court-art ${sport}`} aria-hidden="true"><svg viewBox="0 0 360 120" fill="none" preserveAspectRatio="xMidYMid slice"><rect x="18" y="12" width="324" height="96" rx="3"/><path d="M180 12v96"/>{sport === "football" ? <><circle cx="180" cy="60" r="25"/><path d="M18 30h45v60H18m324-60h-45v60h45M18 45h18v30H18m324-30h-18v30h18"/></> : sport === "basketball" ? <><circle cx="180" cy="60" r="19"/><path d="M18 31h48v58H18m324-58h-48v58h48M66 31a33 33 0 0 1 0 58m228-58a33 33 0 0 0 0 58"/></> : <><path d="M115 12v96m130-96v96M18 36h324M18 84h324"/></>}</svg></div>;
}
```

### components/shared/Button.jsx

```jsx
export default function Button({
  variant = "",
  className = "",
  children,
  ...props
}) {
  return (
    <button className={`button ${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}
```

### components/shared/Badge.jsx

```jsx
import { STATUS_NAMES } from "@/lib/constants";
export default function Badge({ status, children }) {
  return (
    <span className={`badge ${status}`}>
      {status === "live" && <span className="live-dot" />}
      {children || STATUS_NAMES[status] || status}
    </span>
  );
}
```

### components/shared/TeamMark.jsx

```jsx
'use client';
import {useState,useEffect} from 'react';
import {logoUrl} from '@/lib/sports';
export default function TeamMark({name,initials,path}) {
 const [failed,setFailed]=useState(false);
 useEffect(()=>setFailed(false),[path]);
 return <span className="team-mark" aria-label={`${name} logo`}>{path&&!failed?<img src={logoUrl(path)} alt="" onError={()=>setFailed(true)} width="48" height="48"/>:initials}</span>;
}
```

### components/shared/EmptyState.jsx

```jsx
import Icon from "./Icon";
export default function EmptyState({title, children}) {
  return <div className="empty-state"><span className="empty-mark"><Icon name="whistle"/></span><h3>{title}</h3>{children && <p>{children}</p>}</div>;
}
```

### components/shared/Skeleton.jsx

```jsx
export default function Skeleton({title = "Loading campus sports"}) {
  return <div className="skeleton-stack" role="status"><span className="sr-only">{title}</span><div className="skeleton skeleton-title"/><div className="skeleton skeleton-hero"/><div className="quick-grid">{[0,1,2].map(i => <div className="skeleton skeleton-tile" key={i}/>)}</div><div className="skeleton skeleton-match"/><div className="skeleton skeleton-match"/></div>;
}
```

### components/shared/PWA.jsx

```jsx
"use client";
import { useEffect, useState } from "react";
export default function PWA() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator)
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  return online ? null : (
    <div className="offline-notice" role="alert">
      You’re offline. Reconnect before making changes. Match information may be
      out of date.
    </div>
  );
}
```

### public/manifest.json

```json
{
  "name": "Whistle",
  "short_name": "Whistle",
  "description": "Topfaith University campus sports, scores and fixtures",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#F4F1E8",
  "theme_color": "#12372A",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

## 2. Public home

Checklist: implementation complete; unchanged unit and HTTP suites passed after this stage.

### components/shared/PublicHomepage.jsx

```jsx
'use client';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import {SPORTS,SPORT_NAMES} from '@/lib/constants';
import {fixtureTime,sideTeam,fixtureScore,competition} from '@/lib/sports';
import {dateTime} from '@/lib/format';
import {accountHome} from '@/lib/account';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import Court from './Court';
import Icon from './Icon';
import MatchBoard from './MatchBoard';
import StandingsPreview from './StandingsPreview';
import EmptyState from './EmptyState';
import Refresh from './Refresh';
import RefreshButton from './RefreshButton';
import Badge from './Badge';
import PollWidget from '@/components/student/PollWidget';
export default function PublicHomepage({data:d,account}){
 const query=useSearchParams(),sport=SPORTS.includes(query.get('sport'))?query.get('sport'):'';
 const fixtures=d?d.fixtures.filter(f=>!sport||f.sport===sport):[],live=fixtures.filter(f=>f.status==='live'),recent=fixtures.filter(f=>['completed','walkover'].includes(f.status)).sort((a,b)=>fixtureTime(b)-fixtureTime(a)).slice(0,3),upcoming=fixtures.filter(f=>f.status==='scheduled').sort((a,b)=>fixtureTime(a)-fixtureTime(b)).slice(0,6);
 const feature=live[0]||upcoming[0]||recent[0],destination=account?accountHome(account):'/signup';
 const filter=e=>{if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();window.history.pushState(null,'',e.currentTarget.href);};
 const board=(f,featured=false)=><MatchBoard fixture={f} teams={d.teams} leagues={d.leagues} featured={featured}/>;
 return <div className="public-site"><Refresh/><header className="public-header"><Link className="brand" href="/" aria-label="Whistle home"><Logo/><span className="public-campus">Topfaith University</span></Link><nav className="public-nav" aria-label="Homepage navigation"><a href="#scores">Scores</a><a href="#fixtures">Fixtures</a><a href="#standings">Standings</a></nav><div className="actions"><ThemeToggle/>{!account&&<Link href="/login" className="quiet-link">Log in</Link>}<Link href={destination} className="button">{account?'Open your overview':'Join Whistle'}</Link></div></header>
 <main id="main" className="public-home"><section className="home-intro"><div className="home-intro-copy"><Court/><p className="home-campus-line">Campus sports, all in one place.</p><h1>Every match.<br/>Our <em>campus.</em></h1><p className="home-intro-description">Follow the score, pick your winners, and see who’s climbing the league tables. This is Topfaith matchday.</p><div className="actions"><a className="button" href="#scores">Find the action</a><Link className="quiet-link" href={account?.is_admin?'/dashboard':account?'/student/fixtures':'/login'}>Make your next prediction</Link></div></div><div className="home-feature">{feature?<><div className="home-feature-caption">{feature.status==='live'?'On the field right now':feature.status==='scheduled'?'The next matchup':'From the last whistle'}</div>{board(feature,true)}</>:<div className="home-pitch"><Court/><div><h2>The next whistle<br/>is coming.</h2><p>The campus schedule starts here. Check back for the next matchup.</p></div></div>}</div></section>
 {d?<><section id="scores" className="home-section"><div className="home-section-heading"><div><h2>Match centre</h2><p className="help">Live scores and predictions. Refreshed every 5 seconds.</p></div><nav className="home-sports" aria-label="Filter sports"><a href="/#scores" onClick={filter} aria-current={!sport?'page':undefined}>All sports</a>{SPORTS.map(s=><a key={s} href={`/?sport=${s}#scores`} onClick={filter} aria-current={sport===s?'page':undefined}><Icon name={s==='football'?'whistle':s==='basketball'?'live':'users'}/>{SPORT_NAMES[s]}</a>)}</nav></div>{live.length?<div className="home-live-grid">{live.map(f=><article key={f.id}>{board(f,true)}<details className="prediction-details"><summary>View prediction tally</summary><PollWidget fixture={f} teams={d.teams} poll={d.polls.find(p=>p.fixture_id===f.id)} publicView/></details></article>)}</div>:<EmptyState title="Between whistles">The next match and latest results are right below.</EmptyState>}{recent.length>0&&<div className="home-recent"><h3>Latest results</h3><div className="home-result-grid">{recent.map(f=><article className="home-result" key={f.id}><div className="home-result-meta"><span>{SPORT_NAMES[f.sport]}</span><Badge status={f.status}/></div><h3>{sideTeam(f,d.teams,'home').name} <span className="home-versus">vs</span> {sideTeam(f,d.teams,'away').name}</h3><p className="home-result-score">{fixtureScore(f)}</p><p className="help">{competition(f,d.leagues)}<br/>{dateTime(f.ended_at||f.scheduled_at)} WAT</p><details className="prediction-details"><summary>Final predictions</summary><PollWidget fixture={f} teams={d.teams} poll={d.polls.find(p=>p.fixture_id===f.id)} publicView/></details></article>)}</div></div>}</section>
 <section id="fixtures" className="home-section"><div className="home-section-heading"><div><h2>Next on campus</h2><p className="help">Predictions open before kickoff. The first whistle closes voting.</p></div><Link className="quiet-link" href={account?.is_admin?'/friendlies':account?'/student/fixtures':'/login'}>{account?'Full schedule':'Log in for the full schedule'}</Link></div>{upcoming.length?<div className="home-fixture-grid">{upcoming.map(f=><article className="home-fixture" key={f.id}><p className="help">{SPORT_NAMES[f.sport]} / {competition(f,d.leagues)}</p><h3>{sideTeam(f,d.teams,'home').name}<span className="home-fixture-versus">vs</span>{sideTeam(f,d.teams,'away').name}</h3><p>{dateTime(f.scheduled_at)}{f.scheduled_at?' WAT':''}</p><p className="help">{f.venue||'Venue pending'}</p><details className="prediction-details"><summary>Predictions</summary><PollWidget fixture={f} teams={d.teams} poll={d.polls.find(p=>p.fixture_id===f.id)} publicView/></details></article>)}</div>:<EmptyState title="The schedule is taking shape">Upcoming league matches and Friendlies appear here.</EmptyState>}</section>
 <section id="standings" className="home-section"><div className="home-section-heading"><div><h2>The race for the top</h2><p className="help">The latest active league in each sport.</p></div><Link className="quiet-link" href={account?.is_admin?'/leagues':account?'/student/standings':'/login'}>All league tables</Link></div>{SPORTS.filter(s=>!sport||s===sport).map(s=>{const l=[...d.leagues].filter(l=>l.sport===s).sort((a,b)=>b.created_at.localeCompare(a.created_at))[0];return <section className="home-league" key={s}><h3 className="section-title">{SPORT_NAMES[s]}</h3>{l?<><p className="home-league-name">{l.name} / {l.season}</p><StandingsPreview league={l} standings={d.standings.filter(r=>r.league_id===l.id)} maxRows={5}/></>:<EmptyState title="A new season awaits">No active league for this sport yet.</EmptyState>}</section>;})}</section></>:<section className="home-section"><EmptyState title="Scores are temporarily unavailable">We couldn’t load the latest updates. Please try again.</EmptyState><RefreshButton/></section>}
 <section className="home-invitation"><div><h2>Pick your side.<br/><em>Earn your Ws</em>.</h2><p>Predict the winner before play begins. A correct pick earns 50 Ws; a wrong pick deducts 25. Find your place on the campus leaderboard.</p></div><Link href={destination} className="button">{account?'Open your overview':'Create your account'}</Link></section></main><footer className="public-footer"><Link href="/" className="brand"><Logo/></Link><p>Made for matchdays at Topfaith University.</p><a className="quiet-link" href="#main">Back to top</a></footer></div>;
}
```

### components/shared/MatchBoard.jsx

```jsx
import Link from 'next/link';
import Badge from './Badge';
import TeamMark from './TeamMark';
import Court from './Court';
import {SPORT_NAMES} from '@/lib/constants';
import {sideTeam, fixtureScore, competition, outcome} from '@/lib/sports';
import {dateTime} from '@/lib/format';
export default function MatchBoard({fixture: f, teams, leagues = [], linked = false, featured = false}) {
  const home = sideTeam(f, teams, 'home'), away = sideTeam(f, teams, 'away');
  const state = f.sport === 'volleyball' || ['cancelled', 'walkover'].includes(f.status);
  const content = <><Court sport={f.sport}/><div className="board-content">
    <div className="board-meta"><Badge status={f.status}/><span>{SPORT_NAMES[f.sport]}</span><span>{competition(f, leagues)}</span>{f.best_of && <span>Best of {f.best_of}</span>}</div>
    <div className="score-line"><div className="score-team"><TeamMark name={home.name} initials={home.initials} path={home.logo}/><span>{home.name}</span></div><div className="score-number">{state ? <span className="score-state">{fixtureScore(f)}</span> : fixtureScore(f)}</div><div className="score-team"><TeamMark name={away.name} initials={away.initials} path={away.logo}/><span>{away.name}</span></div></div>
    <div className="board-footer"><span>{f.venue || 'Venue to be assigned'}</span><span>{f.started_at ? 'Started ' : ''}{dateTime(f.started_at || f.scheduled_at)}{(f.started_at || f.scheduled_at) ? ' WAT' : ''}</span></div>
    {f.status === 'walkover' && <p className="board-note">{outcome(f, teams)}</p>}
    {f.status === 'cancelled' && <p className="board-note">{f.cancellation_reason}</p>}
  </div></>;
  const className = `live-board${featured ? ' featured-match' : ''}`;
  return linked ? <Link className={className} href={`/fixtures/${f.id}`}>{content}</Link> : <div className={className}>{content}</div>;
}
```

### app/page.jsx

```jsx
import "./home.css";
import { currentAccount } from "@/lib/auth";
import { getPublicHome } from "@/lib/publicData";
import PublicHomepage from "@/components/shared/PublicHomepage";

export const dynamic = "force-dynamic";
export default async function Index() {
  const [data, account] = await Promise.all([getPublicHome(), currentAccount()]);
  return <PublicHomepage data={data} account={account ? { is_admin: account.is_admin } : null} />;
}
```

## 3. Authentication

Checklist: implementation complete; unchanged unit and HTTP suites passed after this stage.

### app/(public)/login/page.jsx

```jsx
import { redirect } from "next/navigation";
import Link from "next/link";
import { currentAccount } from "@/lib/auth";
import { accountHome } from "@/lib/account";
import { configured } from "@/lib/supabase/server";
import LoginForm from "@/components/admin/LoginForm";
import Logo from "@/components/shared/Logo";
import ThemeToggle from "@/components/shared/ThemeToggle";
import Court from "@/components/shared/Court";
export const dynamic = "force-dynamic";
export default async function Login({ searchParams }) {
  const query = await searchParams;
  const account = await currentAccount();
  if (account) redirect(accountHome(account));
  return (
    <main id="main" className="login-page">
      <section className="login-identity"><Court/><div className="auth-theme"><ThemeToggle/></div>
        <Link href="/" className="brand" aria-label="Whistle home"><Logo /></Link>
        <div>
          <h1>
            The match
            <br />
            starts here.
          </h1>
          <p>
            Topfaith University
            <br />
            Campus sports
          </p>
        </div>
        <span>Football / Basketball / Volleyball</span>
      </section>
      <section className="login-form">
        <h2>Sign in to Whistle</h2>
        {query?.confirmation === "failed" && <p className="form-message error" role="alert">This confirmation link is invalid or has expired. Try signing in if you already confirmed your email, or return to signup to request another email.</p>}
        {configured() ? (
          <LoginForm />
        ) : (
          <p className="form-message">
            Sign in is temporarily unavailable. Please try again later.
          </p>
        )}
      </section>
    </main>
  );
}
```

### app/(public)/signup/page.jsx

```jsx
import { redirect } from "next/navigation";
import Link from "next/link";
import { currentAccount } from "@/lib/auth";
import { accountHome } from "@/lib/account";
import { configured } from "@/lib/supabase/server";
import SignupForm from "@/components/shared/SignupForm";
import Logo from "@/components/shared/Logo";
import ThemeToggle from "@/components/shared/ThemeToggle";
import Court from "@/components/shared/Court";

export const dynamic = "force-dynamic";
export const metadata = { title: "Create account" };
export default async function Signup() {
  const account = await currentAccount();
  if (account) redirect(accountHome(account));
  return (
    <main id="main" className="login-page">
      <section className="login-identity"><Court/><div className="auth-theme"><ThemeToggle/></div><Link href="/" className="brand" aria-label="Whistle home"><Logo /></Link><div><h1>Your campus.<br />Your game.</h1><p>Topfaith University<br />Campus sports</p></div><span>Football / Basketball / Volleyball</span></section>
      <section className="login-form"><h2>Join Whistle</h2>{configured() ? <SignupForm /> : <p className="form-message">Signup is temporarily unavailable. Please try again later.</p>}</section>
    </main>
  );
}
```

### components/admin/LoginForm.jsx

```jsx
"use client";
import { useState } from "react";
import Link from "next/link";
import Button from "@/components/shared/Button";
import { send, FormStatus } from "@/components/shared/FormState";
export default function LoginForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function submit(e) {
    e.preventDefault();
    setPending(true);
    setError("");
    const data = new FormData(e.currentTarget);
    try {
      const result = await send("/api/auth/login", {
        email: data.get("email"),
        password: data.get("password"),
      });
      window.location.assign(result.redirect);
    } catch (e) {
      setError(e.message);
      setPending(false);
    }
  }
  return (
    <form onSubmit={submit} className="form-stack">
      <label>
        University email
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
          placeholder="name@topfaith.edu.ng"
        />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>
      <FormStatus error={error} />
      <Button disabled={pending}>{pending ? "Signing in…" : "Sign in"}</Button>
      <p className="help">
        New to Whistle? <Link href="/signup">Create your student account</Link>.
      </p>
    </form>
  );
}
```

### components/shared/SignupForm.jsx

```jsx
"use client";
import Link from "next/link";
import { useState } from "react";
import Button from "./Button";
import { send, FormStatus } from "./FormState";
import { FACULTIES } from "@/lib/constants";
import { campusEmail } from "@/lib/account";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  async function submit(event) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      if (form.get("password") !== form.get("confirmPassword")) throw new Error("Your passwords do not match.");
      const result = await send("/api/auth/signup", Object.fromEntries(form));
      if (result.redirect) window.location.assign(result.redirect);
      else { setSent(true); setPending(false); }
    } catch (error) { setError(error.message); setPending(false); }
  }
  if (sent) return (
    <div className="form-stack">
      <FormStatus success="Check your university inbox for a confirmation email. Follow the link to finish signing up. If you already have an account, sign in." />
      <p className="help">Check your spam folder too. If the link has expired, submit the signup form again to request another email.</p>
      <Button onClick={() => setSent(false)} variant="secondary">Back to signup</Button>
      <Link href="/login" className="quiet-link">Return to sign in</Link>
    </div>
  );
  return (
    <form onSubmit={submit} className="form-stack">
      <label>Full name<input name="name" autoComplete="name" maxLength={120} required /></label>
      <label>University email<input name="email" type="email" autoComplete="username" placeholder="matric@topfaith.edu.ng" value={email} onChange={(event) => setEmail(event.target.value)} required aria-describedby="matric-preview" /></label>
      <p id="matric-preview" className="help">{campusEmail(email) ? `Matric number: ${campusEmail(email).split("@")[0]}` : "Your matric number is taken automatically from your university email."}</p>
      <label>Faculty<select name="faculty" defaultValue="" required><option value="" disabled>Select your faculty</option>{FACULTIES.map((faculty) => <option key={faculty}>{faculty}</option>)}</select></label>
      <label>Password<input name="password" type="password" autoComplete="new-password" minLength={8} maxLength={128} aria-describedby="password-help" required /></label>
      <p id="password-help" className="help">Use at least 8 characters.</p>
      <label>Confirm password<input name="confirmPassword" type="password" autoComplete="new-password" minLength={8} maxLength={128} required /></label>
      <FormStatus error={error} />
      <Button disabled={pending}>{pending ? "Creating account…" : "Create account"}</Button>
      <p className="help">Already registered? <Link href="/login">Sign in</Link>.</p>
    </form>
  );
}
```

## 4. Student home

Checklist: implementation complete; unchanged unit and HTTP suites passed after this stage.

### app/(student)/student/layout.jsx

```jsx
import {redirect} from "next/navigation";
import {currentAccount} from "@/lib/auth";
import Sidebar from "@/components/student/Sidebar";
import AppBar from "@/components/shared/AppBar";
export const dynamic = "force-dynamic";
export default async function StudentLayout({children}) {
  const account = await currentAccount();
  if (!account) redirect("/login");
  if (account.is_admin) redirect("/dashboard");
  return <div className="app-shell"><AppBar name={account.name}/><main id="main">{children}</main><Sidebar/></div>;
}
```

### components/student/Sidebar.jsx

```jsx
"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import Icon from "@/components/shared/Icon";
const items = [["/student", "Home", "home"], ["/student/fixtures", "Fixtures", "calendar"], ["/student/live", "Live", "live"], ["/student/standings", "Table", "trophy"], ["/student/profile", "Me", "user"]];
export default function Sidebar() {
  const path = usePathname();
  return <nav className="tab-bar" aria-label="Student navigation"><Link href="/student" className="rail-brand" aria-label="Whistle student overview">w.</Link>{items.map(([href, label, icon]) => {
    const active = href === "/student" ? path === href : path.startsWith(href);
    return <Link href={href} key={href} className={active ? "active" : ""} aria-current={active ? "page" : undefined}><span className="tab-icon"><Icon name={icon}/></span><span>{label}</span></Link>;
  })}</nav>;
}
```

### app/(student)/student/page.jsx

```jsx
import Link from 'next/link';
import {getStudentOverview} from '@/lib/studentData';
import {fixtureTime, wsText} from '@/lib/sports';
import {SPORT_NAMES} from '@/lib/constants';
import MatchBoard from '@/components/shared/MatchBoard';
import TeamMark from '@/components/shared/TeamMark';
import FixtureList from '@/components/shared/FixtureList';
import StandingsPreview from '@/components/shared/StandingsPreview';
import Refresh from '@/components/shared/Refresh';
import EmptyState from '@/components/shared/EmptyState';
import Court from '@/components/shared/Court';
import Icon from '@/components/shared/Icon';
export const metadata = {title: 'Your campus sports'};
export default async function Overview() {
  const {account, data: d} = await getStudentOverview(), mine = f => d.my_team_ids.includes(f.home_team_id) || d.my_team_ids.includes(f.away_team_id);
  const live = d.fixtures.filter(f => f.status === 'live').sort((a,b) => Number(mine(b)) - Number(mine(a))), upcoming = d.fixtures.filter(f => f.status === 'scheduled').sort((a,b) => fixtureTime(a) - fixtureTime(b));
  const recent = d.fixtures.filter(f => ['completed','walkover'].includes(f.status)).sort((a,b) => Number(mine(b)) - Number(mine(a)) || fixtureTime(b) - fixtureTime(a)).slice(0,3);
  const leagues = [...d.leagues].sort((a,b) => Number(d.standings.some(r => r.league_id === b.id && d.my_team_ids.includes(r.team_id))) - Number(d.standings.some(r => r.league_id === a.id && d.my_team_ids.includes(r.team_id))) || b.created_at.localeCompare(a.created_at));
  const glance = leagues.filter((l,i) => leagues.findIndex(x => x.sport === l.sport) === i), feature = live[0] || upcoming[0];
  const tiles = [['Fixtures', upcoming.length, '/student/fixtures', 'calendar'], ['Live now', live.length, '/student/live', 'live'], ['League tables', d.leagues.length, '/student/standings', 'trophy']];
  return <><Refresh/><div className="greeting-row"><div><p>{account.name}'s campus sports</p><h1>Your matchday.</h1></div><Link className="ws-pill" href="/student/leaderboard">{wsText(d.ws)}<Icon name="chevron-right"/></Link></div>
    <div className="overview-hero-grid"><section className="hero-card"><Court/><span className="hero-kicker">Topfaith University / {live.length} live now</span><h2>Back your side.<br/><em>Own the call.</em></h2><p>{d.my_polls.filter(p => p.can_vote).length} open predictions. Make your pick before the first whistle.</p><div><Link className="button" href="/student/fixtures?status=scheduled">Make your predictions <Icon name="chevron-right"/></Link></div></section>
    {feature ? <section><div className="section-header"><h2>{feature.status === 'live' ? 'On the field' : 'Up next'}</h2><Link className="quiet-link" href="/student/live">Match centre</Link></div><MatchBoard fixture={feature} teams={d.teams} leagues={d.leagues} featured/></section> : <EmptyState title="Between whistles">Make your predictions before the next match starts.</EmptyState>}</div>
    <div className="quick-grid">{tiles.map(([label, count, href, icon]) => <Link className="quick-tile" href={href} key={label}><Icon name={icon}/><span className="tile-count">{count}</span><span>{label}</span></Link>)}</div>
    {live.length > 1 && <div className="live-grid">{live.slice(1,3).map(f => <MatchBoard fixture={f} teams={d.teams} leagues={d.leagues} key={f.id}/>)}</div>}
    <section className="section" id="my-teams"><h2 className="section-title">My teams</h2>{d.my_team_ids.length ? <div className="student-teams">{d.teams.filter(t => d.my_team_ids.includes(t.id)).map(t => <div className="student-team" key={t.id}><TeamMark name={t.name} initials={t.logo_initials} path={t.logo_path}/><div><strong>{t.name}</strong><span className="table-sub">{SPORT_NAMES[t.sport]}</span></div></div>)}</div> : <EmptyState title="Follow the campus action">When the administrator adds you to a roster, your team appears here.</EmptyState>}</section>
    <section className="section"><div className="section-header"><h2>Make your call</h2><Link href="/student/fixtures" className="quiet-link">All fixtures</Link></div><FixtureList fixtures={upcoming.slice(0,4)} teams={d.teams} leagues={d.leagues} polls={d.my_polls} myTeamIds={d.my_team_ids} predictions/></section>
    <Link href="/student/leaderboard" className="profile-link section"><Icon name="trophy"/><span>Campus Ws leaderboard<span className="table-sub">Your balance: {wsText(d.ws)}</span></span><Icon name="chevron-right"/></Link>
    {recent.length > 0 && <section className="section"><h2 className="section-title">Latest results</h2><FixtureList fixtures={recent} teams={d.teams} leagues={d.leagues} polls={d.my_polls} myTeamIds={d.my_team_ids} predictions/></section>}
    <section className="section"><div className="section-header"><h2>Standings glance</h2><Link href="/student/standings" className="quiet-link">All tables</Link></div>{glance.length ? glance.map(l => <section className="section" key={l.id}><h3 className="section-title">{l.name}</h3><StandingsPreview league={l} standings={d.standings.filter(r => r.league_id === l.id)} myTeamIds={d.my_team_ids} maxRows={5}/></section>) : <EmptyState title="A new season awaits">League tables appear when competitions are created.</EmptyState>}</section>
  </>;
}
```

### components/shared/FixtureList.jsx

```jsx
import Link from "next/link";
import EmptyState from "./EmptyState";
import MatchBoard from "./MatchBoard";
import PollWidget from "@/components/student/PollWidget";
export default function FixtureList({fixtures, teams, leagues = [], polls = [], myTeamIds = [], admin = false, predictions = false}) {
  if (!fixtures.length) return <EmptyState title="No fixtures here yet">Matches will appear as the schedule is prepared.</EmptyState>;
  return <div className="fixture-stack">{fixtures.map(f => {
    const mine = myTeamIds.includes(f.home_team_id) || myTeamIds.includes(f.away_team_id);
    return <article className={`fixture-item${mine ? ' my-team-row' : ''}`} key={f.id}>
      <MatchBoard fixture={f} teams={teams} leagues={leagues} linked={admin}/>
      {(mine || f.round_number) && <p className="help">{mine ? 'Your team' : ''}{mine && f.round_number ? ' / ' : ''}{f.round_number ? `Round ${f.round_number}` : ''}</p>}
      {admin && <div className="fixture-control-link"><Link href={`/fixtures/${f.id}`} className="quiet-link">Open match controls</Link></div>}
      {predictions && <details className="prediction-details"><summary>{f.status === 'scheduled' ? 'Predict this match' : 'View predictions and result'}</summary><PollWidget fixture={f} teams={teams} poll={polls.find(p => p.fixture_id === f.id)}/></details>}
    </article>;
  })}</div>;
}
```

## 5. Student screens

Checklist: implementation complete; unchanged unit and HTTP suites passed after this stage.

### components/shared/FixtureFilters.jsx

```jsx
"use client";
import {useState} from "react";
import Link from "next/link";
import {SPORTS, SPORT_NAMES} from "@/lib/constants";
import Button from "./Button";
import Icon from "./Icon";
export default function FixtureFilters({selection, action = '/student/fixtures', friendlyOnly = false}) {
  const [sport, setSport] = useState(selection.sport), [league, setLeague] = useState(selection.league), [type, setType] = useState(selection.type);
  return <form action={action} className="fixture-filters" method="get">
    <fieldset className="filter-chips"><legend>Sport</legend><div className="chip-row">{[['', 'All sports'], ...SPORTS.map(s => [s, SPORT_NAMES[s]])].map(([value, label]) => <label className="chip" key={value}><input className="sr-only" type="radio" name="sport" value={value} checked={sport === value} onChange={() => {setSport(value); setLeague('');}}/><span>{label}</span></label>)}</div></fieldset>
    {!friendlyOnly && <><label>Competition type<select name="type" value={type} onChange={e => {setType(e.target.value); setLeague('');}}><option value="">All competitions</option><option value="league">Leagues</option><option value="friendly">Friendlies</option></select></label><label>League<select name="league" value={league} disabled={type === 'friendly'} onChange={e => setLeague(e.target.value)}><option value="">All leagues</option>{selection.leagues.filter(l => !sport || l.sport === sport).map(l => <option value={l.id} key={l.id}>{l.name}</option>)}</select></label></>}
    <fieldset className="filter-chips"><legend>Status</legend><div className="chip-row">{['', 'scheduled', 'unscheduled', 'live', 'completed', 'walkover', 'cancelled'].map(s => <label className="chip" key={s}><input className="sr-only" type="radio" name="status" value={s} defaultChecked={selection.status === s}/><span>{!s ? 'All statuses' : s === 'unscheduled' ? 'Without a date' : s[0].toUpperCase() + s.slice(1)}</span></label>)}</div></fieldset>
    <div className="actions"><Button><Icon name="filter"/>Apply filters</Button><Link className="quiet-link" href={action}>Clear filters</Link></div>
  </form>;
}
```

### components/shared/StandingsPreview.jsx

```jsx
import TeamMark from './TeamMark';
const columns={football:[['played','MP'],['wins','W'],['draws','D'],['losses','L'],['scored','GF'],['conceded','GA'],['difference','GD'],['points','Pts']],basketball:[['played','GP'],['wins','W'],['losses','L'],['draws','D'],['pct','PCT'],['scored','PF'],['conceded','PA'],['difference','Diff']],volleyball:[['played','MP'],['wins','W'],['losses','L'],['sets_won','SW'],['sets_lost','SL'],['set_difference','SD'],['points','Pts']]};
export default function StandingsPreview({league,standings,myTeamIds=[],maxRows,caption}) {
 const rows=maxRows?standings.slice(0,maxRows):standings;
 return <><div className="table-wrap standings"><table>{caption&&<caption>{caption}</caption>}<thead><tr><th>Team / Rank</th>{columns[league.sport].map(([key,label])=><th key={key} className="numeric">{label}</th>)}</tr></thead><tbody>{rows.map(r=><tr key={r.team_id} className={myTeamIds.includes(r.team_id)?'my-team-row':undefined}><td><span className="team-cell"><span className={`rank-mark${r.rank<=3?' top-rank':''}`}>{r.rank}</span><TeamMark name={r.name} initials={r.logo_initials} path={r.logo_path}/><strong>{r.name}</strong>{myTeamIds.includes(r.team_id)&&<span className="table-sub">Your team</span>}</span></td>{columns[league.sport].map(([key])=><td className="numeric" key={key}>{key==='pct'?Number(r[key]).toFixed(3):r[key]}</td>)}</tr>)}</tbody></table></div><p className="help">{league.sport==='football'?'Win 3 / Draw 1 / Loss 0. Ranked by points, goal difference, then goals scored.':league.sport==='basketball'?'PCT = W / (W + L + D). Ties use point difference, then points scored.':'Clean sweep 3/0; any dropped set 2/1. Ties use wins, set difference, then sets won.'} Equal totals across every tie-break share a rank.</p></>;
}
```

### components/student/PollWidget.jsx

```jsx
'use client';
import Link from 'next/link';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import {useMutation,send,FormStatus} from '@/components/shared/FormState';
import {sideTeam,outcome,wsText} from '@/lib/sports';
export default function PollWidget({fixture,teams,poll,publicView=false,adminView=false}) {
 const m=useMutation();
 if(!poll) return null;
 const open=poll.can_vote&&fixture.status==='scheduled';
 const choices=[['win_home',`${sideTeam(fixture,teams,'home').name} win`],...(fixture.sport==='volleyball'?[]:[['draw','Draw']]),['win_away',`${sideTeam(fixture,teams,'away').name} win`]];
 return <section className="poll-panel" aria-label="Match predictions"><div className="section-header"><h3>Who takes the win?</h3><Badge status={poll.status}/></div>
  <p className="help">{open?'Choose the outcome before Start Match. You can change your pick until then.':outcome(fixture,teams)}</p>
  {open&&(adminView?<p className="help">Voting is open to students.</p>:publicView?<p className="section"><Link className="button secondary" href="/login">Sign in to predict</Link></p>:<div className="poll-choices" role="group" aria-label="Predict match outcome">{choices.map(([choice,label])=><Button key={choice} variant="secondary" aria-label={label} aria-pressed={poll.my_choice===choice} disabled={m.pending} onClick={()=>m.run(()=>send(`/api/polls/${fixture.id}/vote`,{choice}),'Prediction saved.')}>{choice==='win_home'?'Home':choice==='win_away'?'Away':'Draw'}</Button>)}</div>)}
  <div className="poll-tally">{choices.map(([choice,label])=>{const votes=poll.tally[choice]||0,percentage=poll.total?Math.round(votes*100/poll.total):0;return <div key={choice}><div className="poll-tally-label"><span>{label}{poll.my_choice===choice&&<strong className="poll-my-choice">Your pick</strong>}</span><span>{votes} {votes===1?'vote':'votes'} / {percentage}%</span></div><progress value={votes} max={poll.total||1} className="progress-line" aria-label={`${label}: ${votes} votes`}/></div>;})}</div>
  <p className="help">{poll.total} predictions. Correct +50 Ws / Wrong −25 Ws.{poll.status==='void'?' This prediction is void.':''}</p>
  {poll.my_ws!=null&&<p className={`ws-award ${poll.my_ws>0?'positive':'negative'}`}>{wsText(poll.my_ws)} from this prediction</p>}
  <FormStatus {...m}/>
 </section>;
}
```

### app/(student)/student/fixtures/page.jsx

```jsx
import {getStudentOverview} from '@/lib/studentData';
import {selectFixtures} from '@/lib/fixtures';
import FixtureFilters from '@/components/shared/FixtureFilters';
import FixtureList from '@/components/shared/FixtureList';
import Refresh from '@/components/shared/Refresh';
export const metadata={title:'Fixtures & predictions'};
export default async function Fixtures({searchParams}){const {data:d}=await getStudentOverview(),s=selectFixtures(d,await searchParams);return <><Refresh/><div className="page-heading"><div><h1>Fixtures & predictions</h1><p>Pick an outcome before Start Match. Correct +50 Ws / Wrong −25 Ws.</p></div></div><FixtureFilters key={`${s.sport}:${s.type}:${s.league}:${s.status}`} selection={s}/><section className="section"><div className="section-header"><h2>Match schedule</h2><span className="help">{s.fixtures.length} fixtures / WAT</span></div><FixtureList fixtures={s.fixtures} teams={d.teams} leagues={d.leagues} polls={d.my_polls} myTeamIds={d.my_team_ids} predictions/></section></>;}
```

### app/(student)/student/live/page.jsx

```jsx
import Link from 'next/link';
import {getStudentOverview} from '@/lib/studentData';
import {fixtureTime} from '@/lib/sports';
import MatchBoard from '@/components/shared/MatchBoard';
import PollWidget from '@/components/student/PollWidget';
import Refresh from '@/components/shared/Refresh';
import EmptyState from '@/components/shared/EmptyState';
export const metadata={title:'Live matches'};
export default async function Live(){const {data:d}=await getStudentOverview(),live=d.fixtures.filter(f=>f.status==='live'),recent=d.fixtures.filter(f=>['completed','walkover','cancelled'].includes(f.status)).sort((a,b)=>fixtureTime(b)-fixtureTime(a)).slice(0,6);const match=f=><article className="live-match section" key={f.id}><MatchBoard fixture={f} teams={d.teams} leagues={d.leagues} featured={f.status==='live'}/><PollWidget fixture={f} teams={d.teams} poll={d.my_polls.find(p=>p.fixture_id===f.id)}/></article>;return <><Refresh/><div className="page-heading"><div><h1>Live matches</h1><p>Follow the score. Predictions are locked once play begins.</p></div><Link className="button secondary" href="/student/fixtures?status=scheduled">Predict upcoming matches</Link></div><section><h2>On the field</h2>{live.length?live.map(match):<EmptyState title="No matches live right now">Find the next match on Fixtures.</EmptyState>}</section><section className="section"><h2>Final whistle</h2>{recent.length?recent.map(match):<EmptyState title="No results yet">Final results, predictions and your Ws changes appear here.</EmptyState>}</section></>;}
```

### app/(student)/student/standings/page.jsx

```jsx
import Link from 'next/link';
import {getStudentOverview} from '@/lib/studentData';
import {SPORTS,SPORT_NAMES} from '@/lib/constants';
import StandingsPreview from '@/components/shared/StandingsPreview';
import Refresh from '@/components/shared/Refresh';
import EmptyState from '@/components/shared/EmptyState';
import Button from '@/components/shared/Button';
export const metadata={title:'Standings'};
export default async function Standings({searchParams}){const {data:d}=await getStudentOverview(),q=await searchParams,sport=SPORTS.includes(q.sport)?q.sport:'',available=d.leagues.filter(l=>!sport||l.sport===sport),league=available.some(l=>l.id===q.league)?q.league:'',leagues=available.filter(l=>!league||l.id===league);return <><Refresh/><div className="page-heading"><div><h1>Standings</h1><p>The league tables, with your teams highlighted.</p></div></div><form className="fixture-filters" method="get" action="/student/standings" key={`${sport}:${league}`}><fieldset className="filter-chips"><legend>Sport</legend><div className="chip-row">{[["","All sports"],...SPORTS.map(s=>[s,SPORT_NAMES[s]])].map(([value,label])=><label className="chip" key={value}><input className="sr-only" type="radio" name="sport" value={value} defaultChecked={sport===value}/>{label}</label>)}</div></fieldset><label>League<select name="league" defaultValue={league}><option value="">All leagues</option>{available.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}</select></label><div className="actions"><Button>Apply filters</Button><Link className="quiet-link" href="/student/standings">Clear filters</Link></div></form>{leagues.length?leagues.map(l=><section className="section" key={l.id}><div className="section-header"><div><h2>{l.name}</h2><p className="help">{SPORT_NAMES[l.sport]} / {l.season}</p></div><Link className="quiet-link" href={`/student/fixtures?league=${l.id}`}>View fixtures</Link></div><StandingsPreview league={l} standings={d.standings.filter(r=>r.league_id===l.id)} myTeamIds={d.my_team_ids}/></section>):<EmptyState title="No matching active leagues">Choose another filter or return when a league is created.</EmptyState>}<p className="help section">Only completed league results and walkovers count. Friendlies and cancelled matches have no table effect.</p></>;}
```

### app/(student)/student/leaderboard/page.jsx

```jsx
import Link from 'next/link';
import {getStudentLeaderboard} from '@/lib/studentData';
import {wsText} from '@/lib/sports';
import Refresh from '@/components/shared/Refresh';
import EmptyState from '@/components/shared/EmptyState';
import Icon from '@/components/shared/Icon';
export const metadata = {title: 'Ws leaderboard'};
function RankRow({row: r, pinned = false}) {
  return <div className={`leader-row${r.is_me ? ' my-team-row' : ''}${pinned ? ' pinned-rank' : ''}`}><span className={`rank-mark${r.rank <= 3 ? ' top-rank' : ''}`}>{r.rank}</span><div className="leader-details"><strong>{r.name}{r.is_me ? ' · You' : ''}</strong><small>{r.faculty} / {r.correct} correct of {r.predictions} settled</small></div><span className={`leader-ws${r.ws < 0 ? ' ws-negative' : ''}`}>{wsText(r.ws)}</span></div>;
}
export default async function Leaderboard() {
  const {data: rows} = await getStudentLeaderboard(), me = rows.find(r => r.is_me);
  return <><Refresh/><div className="page-heading"><div><h1>Ws leaderboard</h1><p>One campus. Every prediction counts.</p></div><Link className="button" href="/student/fixtures?status=scheduled">Make a prediction</Link></div>
    <section className="ws-hero"><div><span>Your balance</span><strong>{wsText(me?.ws)}</strong></div><div><span>Campus rank</span><strong>{me?.rank || '—'}</strong></div><div><span>Correct predictions</span><strong>{me?.correct || 0}<small> / {me?.predictions || 0}</small></strong></div></section>
    <div className="podium">{rows.filter(r => r.rank <= 3).slice(0,3).map((r,i) => <article className="podium-card" key={`${r.name}-${i}`}><Icon name="trophy"/><span className="rank-mark">{r.rank}</span><strong>{r.name}</strong><span>{wsText(r.ws)}</span></article>)}</div>
    {me && <RankRow row={me} pinned/>}
    <p className="form-note section">Correct prediction +50 Ws. Wrong prediction −25 Ws. Balances can go below zero. Walkovers and cancelled matches are void. Exact balance ties share a rank.</p>
    <section className="section"><h2 className="section-title">Campus standings</h2>{rows.length ? <ol className="leader-list">{rows.map((r,i) => <li key={`${r.name}-${i}`}><RankRow row={r}/></li>)}</ol> : <EmptyState title="The leaderboard is ready">Students start at 0 Ws.</EmptyState>}</section>
  </>;
}
```

### app/(student)/student/notifications/page.jsx

```jsx
import Link from 'next/link';
import {getStudentNotifications} from '@/lib/studentData';
import {dateTime} from '@/lib/format';
import Badge from '@/components/shared/Badge';
import Refresh from '@/components/shared/Refresh';
import EmptyState from '@/components/shared/EmptyState';
import NotificationPreference from '@/components/student/NotificationPreference';
import MarkNotificationsRead from '@/components/student/MarkNotificationsRead';
export const metadata={title:'Notifications'};
const labels={live_score:'Live score',new_league:'New league',new_friendly:'New Friendly'};
export default async function Notifications(){const {data:d}=await getStudentNotifications();return <><Refresh/><div className="page-heading"><div><h1>Notifications</h1><p>The latest from campus sports.</p></div></div><NotificationPreference enabled={d.notifications_enabled}/><MarkNotificationsRead ids={d.notifications.filter(n=>!n.read).map(n=>n.id)}/><section className="section"><h2 className="section-title">Your updates</h2>{d.notifications.length?<ol className="notification-feed">{d.notifications.map(n=><li key={n.id} className={`message-row${n.read?'':' notification-unread'}`}><div className="message-heading"><h3>{labels[n.type]||'Campus update'}</h3><Badge status={n.read?'closed':'new'}>{n.read?'Read':'Unread'}</Badge></div><p>{n.message}</p><div className="notification-meta"><span className="help">{dateTime(n.created_at)} WAT</span><Link className="quiet-link" href={n.type==='live_score'?'/student/live':'/student/fixtures'}>View matches</Link></div></li>)}</ol>:<EmptyState title="You’re all caught up">New leagues, Friendlies and score updates appear here when notifications are on.</EmptyState>}</section></>;}
```

### app/(student)/student/feedback/page.jsx

```jsx
import FeedbackForm from "@/components/student/FeedbackForm";

export const metadata = { title: "Feedback" };
export default function Feedback() {
  return <>
    <div className="page-heading"><div><h1>Feedback</h1><p>Suggestions, complaints, and bug reports for campus sports.</p></div></div>
    <FeedbackForm />
  </>;
}
```

### app/(student)/student/profile/page.jsx

```jsx
import Link from 'next/link';
import {getStudentProfile} from '@/lib/studentData';
import {SPORT_NAMES} from '@/lib/constants';
import {wsText} from '@/lib/sports';
import TeamMark from '@/components/shared/TeamMark';
import Badge from '@/components/shared/Badge';
import NotificationPreference from '@/components/student/NotificationPreference';
import Refresh from '@/components/shared/Refresh';
import ThemeToggle from '@/components/shared/ThemeToggle';
import Icon from '@/components/shared/Icon';
import EmptyState from '@/components/shared/EmptyState';
export const metadata={title:'Profile'};
export default async function Profile(){const {data:d}=await getStudentProfile(),p=d.profile;return <><Refresh/><div className="page-heading"><div><h1>Profile</h1><p>Your campus details and team memberships.</p></div><Link className="ws-balance" href="/student/leaderboard"><span>Your balance</span><strong>{wsText(d.prediction?.ws)}</strong></Link></div><div className="split-panel"><section className="form-panel"><h2>Student details</h2><dl className="meta-grid">{[['Full name',p.name],['Matric number',p.matric_number],['Faculty',p.faculty],['University email',p.email]].map(([label,value])=><div key={label}><dt>{label}</dt><dd className="profile-email">{value}</dd></div>)}</dl><p className="help">Your team roster and account details are managed by the administrator.</p></section><NotificationPreference enabled={p.notifications_enabled}/></div>{['active','archived'].map(status=><section className="section" key={status}><h2 className="section-title">{status==='active'?'Your teams':'Archived memberships'}</h2>{d.teams.some(t=>t.status===status)?<div className="student-teams">{d.teams.filter(t=>t.status===status).map(t=><div className="student-team" key={t.id}><TeamMark name={t.name} initials={t.logo_initials} path={t.logo_path}/><div><strong>{t.name}</strong><span className="table-sub">{SPORT_NAMES[t.sport]}</span></div><Badge status={t.status}/></div>)}</div>:<EmptyState title={status==='active'?'No active team memberships':'No archived memberships'}>Your roster memberships appear here when the admin adds you.</EmptyState>}</section>)}<section className="section form-panel form-stack"><div><h2>Appearance</h2><p className="help">Choose your matchday look.</p></div><ThemeToggle segmented/></section><div className="profile-links section"><Link className="profile-link" href="/student/leaderboard"><Icon name="trophy"/>Ws leaderboard<Icon name="chevron-right"/></Link><Link className="profile-link" href="/student/notifications"><Icon name="bell"/>Notifications<Icon name="chevron-right"/></Link><Link className="profile-link" href="/student/feedback"><Icon name="whistle"/>Share feedback<Icon name="chevron-right"/></Link></div><form className="section" action="/api/auth/logout" method="post"><button className="sign-out" type="submit">Sign out</button></form></>;}
```

### components/student/FeedbackForm.jsx

```jsx
"use client";
import { useRef, useState } from "react";
import Button from "@/components/shared/Button";
import { useMutation, send, FormStatus } from "@/components/shared/FormState";
import { FEEDBACK_CATEGORIES, FEEDBACK_MAX_LENGTH } from "@/lib/constants";
import { feedbackDetails } from "@/lib/feedback";

export default function FeedbackForm() {
  const mutation = useMutation();
  const [message, setMessage] = useState("");
  const draft = useRef(null);
  async function submit(event) {
    event.preventDefault();
    if (mutation.pending) return;
    const form = event.currentTarget;
    const body = Object.fromEntries(new FormData(form));
    await mutation.run(async () => {
      const details = feedbackDetails(body);
      if (!draft.current || draft.current.category !== details.category || draft.current.message !== details.message)
        draft.current = { ...details, id: crypto.randomUUID() };
      await send("/api/feedback", draft.current);
      form.reset();
      setMessage("");
      draft.current = null;
    }, "Feedback sent. Thank you for sharing it with the sports administrator.");
  }
  return (
    <form onSubmit={submit} className="form-panel form-stack">
      <h2>Share your feedback</h2>
      <fieldset><legend>Category</legend><div className="chip-row">{Object.entries(FEEDBACK_CATEGORIES).map(([value, label]) => <label className="chip" key={value}><input className="sr-only" type="radio" name="category" value={value} required disabled={mutation.pending}/>{label}</label>)}</div></fieldset>
      <label>Message
        <textarea name="message" value={message} onChange={(event) => setMessage(event.target.value)} maxLength={FEEDBACK_MAX_LENGTH} required disabled={mutation.pending} aria-describedby="feedback-help feedback-count" placeholder="Tell us what would help, what went wrong, or how to reproduce a bug." />
      </label>
      <div><p className="help" id="feedback-help">Include enough detail for the sports administrator to understand your feedback.</p><p className="help" id="feedback-count">{message.length.toLocaleString("en-NG")} / {FEEDBACK_MAX_LENGTH.toLocaleString("en-NG")} characters</p></div>
      <p className="form-note">Your feedback is linked to your student account and sent to the sports administrator. Replies are not available in the app.</p>
      <FormStatus error={mutation.error} success={mutation.success} />
      <Button disabled={mutation.pending}>{mutation.pending ? "Sending…" : "Send feedback"}</Button>
    </form>
  );
}
```

### components/student/NotificationPreference.jsx

```jsx
"use client";
import Button from "@/components/shared/Button";
import { useMutation, send, FormStatus } from "@/components/shared/FormState";

export default function NotificationPreference({ enabled }) {
  const mutation = useMutation();
  return (
    <section className="form-panel form-stack" aria-label="Notification preference">
      <div><h2>Stay in the game</h2><p className="help">Receive live score updates and announcements about new leagues and Friendlies.</p></div>
      <div className="actions">
        <Button role="switch" aria-checked={enabled} aria-label="Sports notifications" disabled={mutation.pending}
          onClick={() => mutation.run(() => send("/api/notifications/preferences", { notifications_enabled: !enabled }, "PATCH"), enabled ? "Notifications turned off." : "Notifications turned on.")}>
          {mutation.pending ? "Saving…" : enabled ? "Notifications on" : "Notifications off"}
        </Button>
        <span className="help">{enabled ? "New updates will appear in your feed." : "New updates are paused. Your earlier notifications remain in your feed."}</span>
      </div>
      <FormStatus error={mutation.error} success={mutation.success} />
    </section>
  );
}
```

### components/student/MarkNotificationsRead.jsx

```jsx
"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/shared/Button";
import { send, FormStatus } from "@/components/shared/FormState";

export default function MarkNotificationsRead({ ids }) {
  const router = useRouter();
  const key = ids.join(",");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const markRead = useCallback(async () => {
    if (!key) return;
    setPending(true);
    setError("");
    try {
      const unread = key.split(",");
      for (let i = 0; i < unread.length; i += 200)
        await send("/api/notifications", { notification_ids: unread.slice(i, i + 200) });
      router.refresh();
    } catch (error) { setError(error.message); }
    finally { setPending(false); }
  }, [key, router]);
  useEffect(() => {
    let attempted = false;
    function opened() {
      if (!attempted && document.visibilityState === "visible") {
        attempted = true;
        markRead();
      }
    }
    opened();
    document.addEventListener("visibilitychange", opened);
    return () => document.removeEventListener("visibilitychange", opened);
  }, [markRead]);
  return error ? <div className="section"><FormStatus error={error} /><div className="actions section"><Button variant="secondary" disabled={pending} onClick={markRead}>Retry marking as read</Button></div></div> : null;
}
```

### app/(student)/student/feedback/loading.jsx

```jsx
import Skeleton from "@/components/shared/Skeleton";
export default function Loading() {
  return <Skeleton title="Loading feedback"/>;
}
```

### app/(student)/student/fixtures/loading.jsx

```jsx
import Skeleton from "@/components/shared/Skeleton";
export default function Loading() {
  return <Skeleton title="Loading fixtures"/>;
}
```

### app/(student)/student/live/loading.jsx

```jsx
import Skeleton from "@/components/shared/Skeleton";
export default function Loading() {
  return <Skeleton title="Loading live"/>;
}
```

### app/(student)/student/loading.jsx

```jsx
import Skeleton from "@/components/shared/Skeleton";
export default function Loading() {
  return <Skeleton title="Loading campus sports"/>;
}
```

### app/(student)/student/notifications/loading.jsx

```jsx
import Skeleton from "@/components/shared/Skeleton";
export default function Loading() {
  return <Skeleton title="Loading notifications"/>;
}
```

### app/(student)/student/profile/loading.jsx

```jsx
import Skeleton from "@/components/shared/Skeleton";
export default function Loading() {
  return <Skeleton title="Loading profile"/>;
}
```

### app/(student)/student/standings/loading.jsx

```jsx
import Skeleton from "@/components/shared/Skeleton";
export default function Loading() {
  return <Skeleton title="Loading standings"/>;
}
```

## 6. Admin

Checklist: implementation complete; unchanged unit and HTTP suites passed after this stage.

### app/(admin)/layout.jsx

```jsx
import {redirect} from "next/navigation";
import {currentAdmin} from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";
import AppBar from "@/components/shared/AppBar";
export const dynamic = "force-dynamic";
export default async function AdminLayout({children}) {
  const admin = await currentAdmin();
  if (!admin) redirect("/login");
  return <div className="app-shell"><AppBar name={admin.name} admin/><main id="main">{children}</main><AdminNav/></div>;
}
```

### components/admin/AdminNav.jsx

```jsx
"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import Icon from "@/components/shared/Icon";
const items = [["/dashboard", "Match desk", "home"], ["/teams", "Teams", "users"], ["/leagues", "Leagues", "trophy"], ["/friendlies", "Friendlies", "calendar"], ["/feedback", "Feedback", "whistle"]];
export default function AdminNav() {
  const path = usePathname();
  return <nav className="tab-bar" aria-label="Admin navigation"><Link href="/dashboard" className="rail-brand" aria-label="Whistle match desk">w.</Link>{items.map(([href, label, icon]) => <Link href={href} key={href} className={path.startsWith(href) ? "active" : ""} aria-current={path.startsWith(href) ? "page" : undefined}><span className="tab-icon"><Icon name={icon}/></span><span>{label}</span></Link>)}</nav>;
}
```

### app/(admin)/dashboard/page.jsx

```jsx
import Link from 'next/link';
import {getData} from '@/lib/data';
import Refresh from '@/components/shared/Refresh';
import MatchBoard from '@/components/shared/MatchBoard';
import FixtureList from '@/components/shared/FixtureList';
import EmptyState from '@/components/shared/EmptyState';
import Icon from '@/components/shared/Icon';
import Court from '@/components/shared/Court';
export default async function Dashboard(){
 const d=await getData(),live=d.fixtures.filter(f=>f.status==='live'),unscheduled=d.fixtures.filter(f=>f.status==='scheduled'&&!f.scheduled_at&&(!f.league_id||d.leagues.some(l=>l.id===f.league_id&&l.status==='active')));
 const cards=[['Live now',live.length,'#live-now','live'],['Need a date',unscheduled.length,'#unscheduled','calendar'],['Active leagues',d.leagues.filter(l=>l.status==='active').length,'/leagues','trophy']];
 return <><Refresh/><div className="page-heading"><div><h1>Match desk</h1><p>Set the schedule. Call the first whistle.</p></div><div className="actions"><Link className="button secondary" href="/friendlies/new">Create Friendly</Link><Link className="button" href="/leagues/new">Create league</Link></div></div><section className="hero-card"><Court/><span className="hero-kicker">Topfaith sports administration</span><h2>Set the stage.<br/><em>Call the whistle.</em></h2><p>{d.polls.filter(p=>p.status==='open').length} open predictions. Matchday starts when you say so.</p></section><div className="quick-grid">{cards.map(([label,count,href,icon])=><Link className="quick-tile" href={href} key={label}><Icon name={icon}/><span className="tile-count">{count}</span><span>{label}</span></Link>)}</div><section id="live-now"><div className="section-header"><h2>On the field</h2></div>{live.length?live.map(f=><MatchBoard key={f.id} fixture={f} teams={d.teams} leagues={d.leagues} linked featured/>):<EmptyState title="No matches live right now">Open a fixture and click Start Match when play begins.</EmptyState>}</section><section className="section" id="unscheduled"><div className="section-header"><h2>Build the matchday</h2><Link className="quiet-link" href="/leagues">View leagues</Link></div><FixtureList fixtures={unscheduled} teams={d.teams} leagues={d.leagues} admin/></section></>;
}
```

### app/(admin)/teams/page.jsx

```jsx
import Link from 'next/link';
import {getData} from '@/lib/data';
import {SPORTS, SPORT_NAMES} from '@/lib/constants';
import TeamMark from '@/components/shared/TeamMark';
import Badge from '@/components/shared/Badge';
import EmptyState from '@/components/shared/EmptyState';
import Icon from '@/components/shared/Icon';
function TeamsTable({teams, data}) {
  return <div className="team-card-grid">{teams.map(t => <Link className="team-card" key={t.id} href={`/teams/${t.id}`}><div className="team-card-top"><TeamMark name={t.name} initials={t.logo_initials} path={t.logo_path}/><Badge status={t.status}/></div><h3>{t.name}</h3><div className="team-card-bottom"><span>{data.team_players.filter(p => p.team_id === t.id).length} players</span><span className="quiet-link">Open team <Icon name="chevron-right"/></span></div></Link>)}</div>;
}
export default async function Teams() {
  const d = await getData();
  return <><div className="page-heading"><div><h1>Teams</h1><p>The players behind every match.</p></div><Link className="button" href="/teams/new"><Icon name="plus"/>Create team</Link></div>{SPORTS.map(s => {
    const teams = d.teams.filter(t => t.sport === s && t.status === 'active').sort((a,b) => a.name.localeCompare(b.name));
    return <section className="section" key={s}><div className="section-header"><h2>{SPORT_NAMES[s]}</h2><span className="help">{teams.length} teams</span></div>{teams.length ? <TeamsTable teams={teams} data={d}/> : <EmptyState title={`No ${SPORT_NAMES[s]} teams yet`}>Create a team with at least one registered player.</EmptyState>}</section>;
  })}<details className="archive-section"><summary>Archived teams</summary><TeamsTable teams={d.teams.filter(t => t.status === 'archived')} data={d}/></details></>;
}
```

### app/(admin)/teams/new/page.jsx

```jsx
import Link from "next/link";
import { getData } from "@/lib/data";
import TeamForm from "@/components/admin/TeamForm";
export default async function NewTeam() {
  const d = await getData();
  return (
    <>
      <Link className="back-link" href="/teams">
        Back to teams
      </Link>
      <div className="page-heading">
        <h1>Create team</h1>
      </div>
      <TeamForm students={d.students} />
    </>
  );
}
```

### app/(admin)/teams/[teamId]/page.jsx

```jsx
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {getData} from '@/lib/data';
import {SPORT_NAMES} from '@/lib/constants';
import TeamForm from '@/components/admin/TeamForm';
import LogoEditor from '@/components/admin/LogoEditor';
import ArchiveButton from '@/components/admin/ArchiveButton';
import TeamMark from '@/components/shared/TeamMark';
import Badge from '@/components/shared/Badge';
export default async function Team({params}){
 const {teamId}=await params,d=await getData(),t=d.teams.find(t=>t.id===teamId);if(!t)notFound();
 const ids=d.team_players.filter(p=>p.team_id===t.id).map(p=>p.student_id);
 return <><Link className="back-link" href="/teams">Back to teams</Link><div className="page-heading"><div className="team-cell"><TeamMark name={t.name} initials={t.logo_initials} path={t.logo_path}/><div><h1>{t.name}</h1><p>{SPORT_NAMES[t.sport]} / {ids.length} players</p></div></div><Badge status={t.status}/></div>{t.status==='active'?<><div className="split-panel"><TeamForm students={d.students} team={t} playerIds={ids}/><LogoEditor entity="teams" id={t.id} path={t.logo_path}/></div><ArchiveButton entity="teams" id={t.id} label="Team"/></>:<section><h2>Archived roster</h2><ul>{d.students.filter(s=>ids.includes(s.id)).map(s=><li key={s.id}>{s.name} / {s.matric_number}</li>)}</ul></section>}</>;
}
```

### components/admin/TeamForm.jsx

```jsx
'use client';
import {useState,useRef} from 'react';
import RosterEditor from './RosterEditor';
import Button from '@/components/shared/Button';
import {useMutation,send,FormStatus} from '@/components/shared/FormState';
import {SPORTS,SPORT_NAMES} from '@/lib/constants';
import {uploadLogo} from '@/lib/logoUpload';
export default function TeamForm({students,team,playerIds=[]}){
 const [selected,setSelected]=useState(playerIds),[sport,setSport]=useState(team?.sport||'football');
 const savedId=useRef(team?.id),[created,setCreated]=useState(false),m=useMutation();
 async function submit(e){e.preventDefault();const f=new FormData(e.currentTarget);await m.run(async()=>{
  if(!selected.length)throw new Error('Add at least one registered student.');
  const result=await send(savedId.current?`/api/teams/${savedId.current}`:'/api/teams',{name:f.get('name'),sport,student_ids:selected},savedId.current?'PATCH':'POST');
  savedId.current=result.id;setCreated(true);
  const logo=f.get('logo');if(logo?.size)await uploadLogo(logo,'teams',result.id);
  m.router.push(`/teams/${result.id}`);
 },'Team saved.');}
 return <form onSubmit={submit} className="form-panel form-stack"><div className="form-grid"><label>Team name<input name="name" required maxLength={120} defaultValue={team?.name}/></label><label>Sport<select value={sport} disabled={!!team||created} onChange={e=>setSport(e.target.value)}>{SPORTS.map(s=><option value={s} key={s}>{SPORT_NAMES[s]}</option>)}</select></label></div>
  {!team&&<label>Team logo (optional)<input type="file" name="logo" accept="image/png,image/jpeg,image/webp"/><span className="help">Use PNG, JPG or WebP up to 2 MB, or leave empty for initials.</span></label>}
  <RosterEditor students={students} selected={selected} onChange={setSelected}/><FormStatus {...m}/><Button disabled={m.pending}>{m.pending?'Saving…':team||created?'Save team':'Create team'}</Button>
 </form>;
}
```

### components/admin/RosterEditor.jsx

```jsx
"use client";
import { useState } from "react";
export default function RosterEditor({ students, selected, onChange }) {
  const [query, setQuery] = useState("");
  const available = students.filter((s) => !s.is_admin);
  const results = available.filter((s) =>
    `${s.name} ${s.matric_number}`.toLowerCase().includes(query.toLowerCase()),
  );
  function toggle(id) {
    onChange(
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id],
    );
  }
  return (
    <fieldset>
      <legend>
        Roster <small>({selected.length} selected)</small>
      </legend>
      <label>
        Find a registered student
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Name or matric number"
        />
      </label>
      <div className="search-results">
        {results.map((s) => (
          <label className="student-choice" key={s.id}>
            <input
              type="checkbox"
              checked={selected.includes(s.id)}
              onChange={() => toggle(s.id)}
            />
            <span>
              {s.name}
              <small>
                {s.matric_number} / {s.faculty}
              </small>
            </span>
          </label>
        ))}
        {!results.length && (
          <p className="form-note">No registered students match that search.</p>
        )}
      </div>
      <div className="selected-roster">
        {available
          .filter((s) => selected.includes(s.id))
          .map((s) => (
            <span className="roster-chip" key={s.id}>
              {s.name}
              <button
                type="button"
                aria-label={`Remove ${s.name}`}
                onClick={() => toggle(s.id)}
              >
                ×
              </button>
            </span>
          ))}
      </div>
      <p className="help">
        At least one registered student is required. There is no roster limit.
      </p>
    </fieldset>
  );
}
```

### components/admin/LogoEditor.jsx

```jsx
'use client';
import Button from '@/components/shared/Button';
import {useMutation,send,FormStatus} from '@/components/shared/FormState';
import {uploadLogo} from '@/lib/logoUpload';
export default function LogoEditor({entity,id,side,path,label='Team logo'}){
 const m=useMutation();
 async function submit(e){e.preventDefault();const form=e.currentTarget,file=new FormData(form).get('logo');await m.run(async()=>{await uploadLogo(file,entity,id,side);form.reset();},'Logo updated.');}
 return <form className="form-panel form-stack" onSubmit={submit}><h3>{label}</h3><label>Logo image<input type="file" name="logo" accept="image/png,image/jpeg,image/webp" required/></label><p className="help">PNG, JPG or WebP up to 2 MB. Initials appear when no logo is set.</p><div className="actions"><Button disabled={m.pending}>Upload logo</Button>{path&&<Button type="button" variant="secondary" disabled={m.pending} onClick={()=>m.run(()=>send('/api/logos',{entity,id,side},'DELETE'),'Logo removed. Initials restored.')}>Use initials</Button>}</div><FormStatus {...m}/></form>;
}
```

### app/(admin)/leagues/page.jsx

```jsx
import Link from 'next/link';
import {getData} from '@/lib/data';
import {SPORT_NAMES} from '@/lib/constants';
import Badge from '@/components/shared/Badge';
import EmptyState from '@/components/shared/EmptyState';
import Court from '@/components/shared/Court';
import Icon from '@/components/shared/Icon';
function Table({leagues, data}) {
  return <div className="league-card-grid">{leagues.map(l => <Link className="league-card" key={l.id} href={`/leagues/${l.id}`}><Court sport={l.sport}/><div className="league-card-content"><div className="section-header"><span className="help">{SPORT_NAMES[l.sport]}</span><Badge status={l.status}/></div><h2>{l.name}</h2><p className="help">{l.season}{l.best_of ? ` / Best of ${l.best_of}` : ''}</p><div className="league-card-stats"><span><Icon name="users"/>{data.league_teams.filter(t => t.league_id === l.id).length} teams</span><span><Icon name="check"/>{data.fixtures.filter(f => f.league_id === l.id && ['completed','walkover'].includes(f.status)).length} / {data.fixtures.filter(f => f.league_id === l.id && f.status !== 'cancelled').length} played</span></div><span className="quiet-link">Open league <Icon name="chevron-right"/></span></div></Link>)}</div>;
}
export default async function Leagues() {
  const d = await getData();
  return <><div className="page-heading"><div><h1>Leagues</h1><p>Home and away. Every point counts.</p></div><Link className="button" href="/leagues/new"><Icon name="plus"/>Create league</Link></div>{d.leagues.some(l => l.status === 'active') ? <Table leagues={d.leagues.filter(l => l.status === 'active')} data={d}/> : <EmptyState title="No active leagues">Enrol teams to draft their home-and-away fixtures.</EmptyState>}<details className="archive-section"><summary>Archived leagues</summary><Table leagues={d.leagues.filter(l => l.status === 'archived')} data={d}/></details></>;
}
```

### app/(admin)/leagues/new/page.jsx

```jsx
import Link from "next/link";
import { getData } from "@/lib/data";
import LeagueForm from "@/components/admin/LeagueForm";
export default async function NewLeague() {
  const d = await getData();
  return (
    <>
      <Link className="back-link" href="/leagues">
        Back to leagues
      </Link>
      <div className="page-heading">
        <h1>Create league</h1>
      </div>
      <LeagueForm teams={d.teams} />
    </>
  );
}
```

### app/(admin)/leagues/[leagueId]/page.jsx

```jsx
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {getData,getStandings} from '@/lib/data';
import {SPORT_NAMES} from '@/lib/constants';
import Badge from '@/components/shared/Badge';
import Refresh from '@/components/shared/Refresh';
import StandingsPreview from '@/components/shared/StandingsPreview';
import FixtureList from '@/components/shared/FixtureList';
import LeagueTools from '@/components/admin/LeagueTools';
import ArchiveButton from '@/components/admin/ArchiveButton';
export default async function League({params}){
 const {leagueId}=await params,d=await getData(),l=d.leagues.find(l=>l.id===leagueId);if(!l)notFound();
 const ids=d.league_teams.filter(t=>t.league_id===l.id).map(t=>t.team_id),standings=await getStandings(l.id),fixtures=d.fixtures.filter(f=>f.league_id===l.id).sort((a,b)=>(a.round_number||999)-(b.round_number||999)||a.created_at.localeCompare(b.created_at));
 return <><Refresh/><Link className="back-link" href="/leagues">Back to leagues</Link><div className="page-heading"><div><h1>{l.name}</h1><p>{SPORT_NAMES[l.sport]} / {l.season} / {ids.length} teams{l.best_of?` / Best of ${l.best_of}`:''}</p></div><Badge status={l.status}/></div><section><h2 className="section-title">Standings</h2><StandingsPreview league={l} standings={standings}/></section>{l.status==='active'&&<LeagueTools league={l} teams={d.teams} enrolledIds={ids}/>}<section className="section"><div className="section-header"><h2>Fixtures</h2><span className="help">{fixtures.length} matches / Home and away</span></div><FixtureList fixtures={fixtures} teams={d.teams} leagues={d.leagues} admin/></section>{l.status==='active'&&<ArchiveButton entity="leagues" id={l.id} label="League"/>}</>;
}
```

### components/admin/LeagueForm.jsx

```jsx
'use client';
import {useState} from 'react';
import Button from '@/components/shared/Button';
import {useMutation,send,FormStatus} from '@/components/shared/FormState';
import {SPORTS,SPORT_NAMES} from '@/lib/constants';
export default function LeagueForm({teams}){
 const [sport,setSport]=useState('football'),[selected,setSelected]=useState([]),m=useMutation();
 const choices=teams.filter(t=>t.sport===sport&&t.status==='active');
 async function submit(e){e.preventDefault();const f=new FormData(e.currentTarget);await m.run(async()=>{
  if(selected.length<2)throw new Error('Choose at least two active teams.');
  const result=await send('/api/leagues',{name:f.get('name'),sport,season:f.get('season'),best_of:f.get('best_of'),team_ids:selected});m.router.push(`/leagues/${result.id}`);
 },'League and fixtures created.');}
 return <form className="form-panel form-stack" onSubmit={submit}><label>League name<input name="name" maxLength={160} required/></label><div className="form-grid"><label>Sport<select value={sport} onChange={e=>{setSport(e.target.value);setSelected([]);}}>{SPORTS.map(s=><option key={s} value={s}>{SPORT_NAMES[s]}</option>)}</select></label><label>Season / session<input name="season" placeholder="2026/2027" maxLength={80} required/></label></div>{sport==='volleyball'&&<label>Volleyball format<select name="best_of" defaultValue="3"><option value="3">Best of three</option><option value="5">Best of five</option></select></label>}<fieldset><legend>Enrolled teams</legend><div className="selection-list">{choices.map(t=><label key={t.id}><input type="checkbox" checked={selected.includes(t.id)} onChange={()=>setSelected(selected.includes(t.id)?selected.filter(id=>id!==t.id):[...selected,t.id])}/>{t.name}</label>)}</div>{!choices.length&&<p className="help">Create active {SPORT_NAMES[sport]} teams first.</p>}</fieldset><p className="form-note">{selected.length} teams / {selected.length*(selected.length-1)} home-and-away fixtures. You can edit dates, add matches or remove unstarted fixtures afterward. A player can represent one team in this league.</p><FormStatus {...m}/><Button disabled={m.pending}>Create league and draft fixtures</Button></form>;
}
```

### components/admin/LeagueTools.jsx

```jsx
'use client';
import Button from '@/components/shared/Button';
import {useMutation,send,FormStatus} from '@/components/shared/FormState';
export default function LeagueTools({league,teams,enrolledIds}){
 const m=useMutation(),enrolled=teams.filter(t=>enrolledIds.includes(t.id)),available=teams.filter(t=>t.sport===league.sport&&t.status==='active'&&!enrolledIds.includes(t.id));
 async function addTeam(e){e.preventDefault();const f=new FormData(e.currentTarget);await m.run(()=>send(`/api/leagues/${league.id}/teams`,{team_id:f.get('team')}),'Team enrolled; both legs added.');}
 async function addFixture(e){e.preventDefault();const f=new FormData(e.currentTarget);await m.run(async()=>{const result=await send('/api/fixtures',{league_id:league.id,home_team_id:f.get('home'),away_team_id:f.get('away')});m.router.push(`/fixtures/${result.id}`);},'Fixture added.');}
 return <section className="section league-tools"><details><summary>Add another team</summary><form className="form-stack section" onSubmit={addTeam}>{available.length?<><label>Active team<select name="team" required>{available.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></label><p className="help">Home-and-away matches are added against the enrolled teams. Existing fixtures stay as they are.</p><Button disabled={m.pending}>Add team to league</Button></>:<p className="help">All active teams for this sport are already enrolled.</p>}</form></details><details><summary>Add a fixture</summary><form className="form-stack section" onSubmit={addFixture}><div className="form-grid">{['home','away'].map(side=><label key={side}>{side==='home'?'Home team':'Away team'}<select name={side} required defaultValue=""><option value="">Choose team</option>{enrolled.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></label>)}</div><Button disabled={m.pending}>Add fixture</Button></form></details><FormStatus {...m}/></section>;
}
```

### app/(admin)/friendlies/page.jsx

```jsx
import Link from 'next/link';
import {getData} from '@/lib/data';
import {selectFixtures} from '@/lib/fixtures';
import FixtureList from '@/components/shared/FixtureList';
import FixtureFilters from '@/components/shared/FixtureFilters';
import Refresh from '@/components/shared/Refresh';
export default async function Friendlies({searchParams}){const d=await getData(),selection=selectFixtures({...d,fixtures:d.fixtures.filter(f=>!f.league_id)},await searchParams);return <><Refresh/><div className="page-heading"><div><h1>Friendlies</h1><p>One-off matchups, with existing teams or typed club names.</p></div><Link className="button" href="/friendlies/new">Create Friendly</Link></div><FixtureFilters selection={selection} action="/friendlies" friendlyOnly/><section className="section"><FixtureList fixtures={selection.fixtures} teams={d.teams} admin/></section></>;}
```

### app/(admin)/friendlies/new/page.jsx

```jsx
import Link from 'next/link';
import {getData} from '@/lib/data';
import FriendlyForm from '@/components/admin/FriendlyForm';
export default async function NewFriendly(){const d=await getData();return <><Link href="/friendlies" className="back-link">Back to Friendlies</Link><div className="page-heading"><div><h1>Create Friendly</h1><p>Choose teams or type the club names. Save a typed team when you want to reuse it.</p></div></div><FriendlyForm teams={d.teams} students={d.students}/></>;}
```

### components/admin/FriendlyForm.jsx

```jsx
'use client';
import {useState} from 'react';
import Button from '@/components/shared/Button';
import RosterEditor from './RosterEditor';
import {useMutation,send,FormStatus} from '@/components/shared/FormState';
import {SPORTS,SPORT_NAMES} from '@/lib/constants';
import {fromInput} from '@/lib/format';
const empty=()=>({mode:'existing',team:'',name:'',save:false,players:[]});
export default function FriendlyForm({teams,students}){
 const [sport,setSport]=useState('football'),[sides,setSides]=useState({home:empty(),away:empty()}),m=useMutation();
 const update=(side,key,value)=>setSides(previous=>({...previous,[side]:{...previous[side],[key]:value}}));
 async function submit(e){e.preventDefault();const f=new FormData(e.currentTarget);await m.run(async()=>{
  const body={sport,best_of:f.get('best_of'),scheduled_at:fromInput(f.get('scheduled_at')),venue:f.get('venue')};
  for(const side of ['home','away']){const x=sides[side];body[`${side}_team_id`]=x.mode==='existing'?x.team:null;body[`${side}_name`]=x.name;body[`save_${side}`]=x.mode==='typed'&&x.save;body[`${side}_student_ids`]=x.players;if(x.mode==='typed'&&x.save&&!x.players.length)throw new Error('Choose at least one registered player when saving a reusable team.');}
  const result=await send('/api/friendlies',body);m.router.push(`/fixtures/${result.id}`);
 },'Friendly created.');}
 return <form className="form-stack" onSubmit={submit}><div className="form-panel form-stack"><label>Sport<select value={sport} onChange={e=>{setSport(e.target.value);setSides({home:empty(),away:empty()});}}>{SPORTS.map(s=><option key={s} value={s}>{SPORT_NAMES[s]}</option>)}</select></label>{sport==='volleyball'&&<label>Volleyball format<select name="best_of" defaultValue="3"><option value="3">Best of three</option><option value="5">Best of five</option></select></label>}</div><div className="friendly-sides">{['home','away'].map(side=>{
  const x=sides[side];return <section className="form-panel form-stack" key={side}><h2>{side==='home'?'Home team':'Away team'}</h2><label>Team source<select value={x.mode} onChange={e=>update(side,'mode',e.target.value)}><option value="existing">Choose an existing team</option><option value="typed">Type a club name</option></select></label>{x.mode==='existing'?<label>Team<select required value={x.team} onChange={e=>update(side,'team',e.target.value)}><option value="">Select a team</option>{teams.filter(t=>t.sport===sport&&t.status==='active').map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></label>:<><label>Club name<input required maxLength={120} value={x.name} onChange={e=>update(side,'name',e.target.value)}/></label><label className="inline-check"><input type="checkbox" checked={x.save} onChange={e=>update(side,'save',e.target.checked)}/>Save as a reusable team</label>{x.save&&<RosterEditor students={students} selected={x.players} onChange={ids=>update(side,'players',ids)}/>}<p className="help">{x.save?'A saved team needs a registered player.':'This name stays within this Friendly.'} You can upload a logo on the match page.</p></>}</section>;
 })}</div><div className="form-panel form-stack"><div className="form-grid"><label>Kick-off (WAT, optional)<input type="datetime-local" name="scheduled_at"/></label><label>Venue (optional)<input name="venue" maxLength={200}/></label></div><p className="form-note">Predictions open when you create this Friendly. Start Match closes voting.</p><FormStatus {...m}/><Button disabled={m.pending}>Create Friendly</Button></div></form>;
}
```

### app/(admin)/feedback/page.jsx

```jsx
import { getData } from "@/lib/data";
import FeedbackReview from "@/components/admin/FeedbackReview";
import EmptyState from "@/components/shared/EmptyState";
export default async function Feedback() {
  const d = await getData();
  const items = d.feedback.sort(
    (a, b) =>
      ({ new: 0, reviewed: 1, resolved: 2 })[a.status] -
        { new: 0, reviewed: 1, resolved: 2 }[b.status] ||
      b.created_at.localeCompare(a.created_at),
  );
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Feedback</h1>
          <p>Suggestions, complaints, and bug reports.</p>
        </div>
      </div>
      {items.length ? (
        items.map((item) => (
          <FeedbackReview
            key={item.id}
            item={item}
            student={d.students.find((s) => s.id === item.student_id)}
          />
        ))
      ) : (
        <EmptyState title="No feedback to review">
          Submitted feedback will appear here, tied to the student’s account.
        </EmptyState>
      )}
    </>
  );
}
```

### components/admin/FeedbackReview.jsx

```jsx
"use client";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";
import { useMutation, send, FormStatus } from "@/components/shared/FormState";
import { dateTime } from "@/lib/format";
import { FEEDBACK_CATEGORIES } from "@/lib/constants";
export default function FeedbackReview({ item, student }) {
  const m = useMutation();
  return (
    <article className="message-row">
      <div className="message-heading">
        <h3>{FEEDBACK_CATEGORIES[item.category]}</h3>
        <Badge status={item.status} />
      </div>
      <small>
        {student?.name} / {student?.matric_number}
        <br />
        {dateTime(item.created_at)} WAT
      </small>
      <p className="feedback-message">{item.message}</p>
      <div className="actions">
        {[
          ["reviewed", "Mark Reviewed"],
          ["resolved", "Mark Resolved"],
        ].map(([status, label]) => (
          <Button
            key={status}
            variant="small secondary"
            disabled={m.pending || item.status === status}
            onClick={() =>
              m.run(
                () => send(`/api/feedback/${item.id}`, { status }, "PATCH"),
                "Feedback updated.",
              )
            }
          >
            {label}
          </Button>
        ))}
      </div>
      <FormStatus {...m} />
    </article>
  );
}
```

### components/admin/ArchiveButton.jsx

```jsx
"use client";
import Button from "@/components/shared/Button";
import { useMutation, send, FormStatus } from "@/components/shared/FormState";
export default function ArchiveButton({ entity, id, label }) {
  const m = useMutation();
  return (
    <div className="archive-section">
      <p className="help">
        Archiving keeps this {label.toLowerCase()} and its history.
      </p>
      <div className="actions section">
        <Button
          disabled={m.pending}
          variant="secondary"
          onClick={() => {
            if (
              window.confirm(
                `Archive this ${label.toLowerCase()}? Its history will be preserved.`,
              )
            )
              m.run(
                () =>
                  send(`/api/${entity}/${id}`, { action: "archive" }, "PATCH"),
                `${label} archived.`,
              );
          }}
        >
          Archive {label.toLowerCase()}
        </Button>
      </div>
      <FormStatus {...m} />
    </div>
  );
}
```

## 7. Match controls

Checklist: implementation complete; unchanged unit and HTTP suites passed after this stage.

### app/(admin)/fixtures/[fixtureId]/page.jsx

```jsx
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {getData} from '@/lib/data';
import {adminClient} from '@/lib/supabase/admin';
import {rpc} from '@/lib/api';
import MatchBoard from '@/components/shared/MatchBoard';
import Refresh from '@/components/shared/Refresh';
import MatchControls from '@/components/admin/MatchControls';
import LogoEditor from '@/components/admin/LogoEditor';
import PollWidget from '@/components/student/PollWidget';
export default async function Fixture({params}){
 const {fixtureId}=await params,d=await getData(),f=d.fixtures.find(f=>f.id===fixtureId);if(!f)notFound();
 const l=d.leagues.find(l=>l.id===f.league_id),archived=l?.status==='archived';
 const poll=archived?null:await rpc(adminClient(),'whistle_poll_snapshot',{p_fixture_id:f.id,p_student_id:null});
 return <><Refresh/><Link className="back-link" href={l?`/leagues/${l.id}`:'/friendlies'}>Back to {l?'league':'Friendlies'}</Link><div className="page-heading"><h1>Match day</h1></div><div className="match-sticky"><MatchBoard fixture={f} teams={d.teams} leagues={d.leagues} featured/></div>{archived&&<p className="form-message">This league is archived. Its match history is retained.</p>}<MatchControls fixture={f} teams={d.teams} archived={archived}/><section className="section"><PollWidget fixture={f} teams={d.teams} poll={poll} publicView adminView/></section>{!f.league_id&&<section className="section"><h2 className="section-title">Friendly logos</h2><div className="friendly-sides">{['home','away'].map(side=>{const team=d.teams.find(t=>t.id===f[`${side}_team_id`]);return <LogoEditor key={side} entity={team?'teams':'fixtures'} id={team?.id||f.id} side={team?undefined:side} path={team?.logo_path||f[`${side}_logo_path`]} label={`${side==='home'?'Home':'Away'} team logo${team?' (reusable)':''}`}/>;})}</div></section>}</>;
}
```

### components/admin/MatchControls.jsx

```jsx
'use client';
import {useState} from 'react';
import Button from '@/components/shared/Button';
import {useMutation,send,FormStatus} from '@/components/shared/FormState';
import {sideTeam,SET_SCORES} from '@/lib/sports';
import {toInput,fromInput} from '@/lib/format';
function ResultForm({fixture,teams,correction=false}){
 const m=useMutation(),home=sideTeam(fixture,teams,'home'),away=sideTeam(fixture,teams,'away');
 async function submit(e){e.preventDefault();const f=new FormData(e.currentTarget);let body;
  if(fixture.status==='walkover')body={winner:f.get('winner')};
  else if(fixture.sport==='volleyball'){const [h,a]=f.get('sets').split('-').map(Number);body=correction?{home:h,away:a}:{home_sets:h,away_sets:a};}
  else body={home:Number(f.get('home')),away:Number(f.get('away'))};
  await m.run(()=>send(`/api/fixtures/${fixture.id}/${correction?'correct-result':'record-result'}`,body),correction?'Result corrected. Standings and Ws updated.':'Final result saved. Ws awarded.');
 }
 return <form className="form-stack section" onSubmit={submit}>{fixture.status==='walkover'?<label>Walkover winner<select name="winner" defaultValue={fixture.winner_side}><option value="home">{home.name}</option><option value="away">{away.name}</option></select></label>:fixture.sport==='volleyball'?<label>Final sets: {home.name} / {away.name}<select name="sets" required defaultValue={fixture.home_sets!=null?`${fixture.home_sets}-${fixture.away_sets}`:''}><option value="" disabled>Select final set score</option>{SET_SCORES(fixture.best_of).map(s=><option key={s} value={s}>{s.replace('-', ' : ')}</option>)}</select></label>:<div className="form-grid">{['home','away'].map(side=><label key={side}>{side==='home'?home.name:away.name} final score<input type="number" name={side} min="0" max="2147483647" step="1" defaultValue={fixture[`${side}_score`]} required/></label>)}</div>}<FormStatus {...m}/><Button disabled={m.pending}>{correction?'Save corrected result':'Confirm final result'}</Button></form>;
}
export default function MatchControls({fixture:f,teams,archived=false}){
 const m=useMutation(),[resultOpen,setResultOpen]=useState(!!f.ended_at),home=sideTeam(f,teams,'home'),away=sideTeam(f,teams,'away');
 const finalize=['completed','walkover'].includes(f.status);
 async function schedule(e){e.preventDefault();const v=new FormData(e.currentTarget);await m.run(()=>send(`/api/fixtures/${f.id}/reschedule`,{scheduled_at:fromInput(v.get('scheduled_at')),venue:v.get('venue')}),'Schedule saved. Kick-off remains manual.');}
 async function end(){if(!confirm('End this match and confirm its final score?'))return;const result=await m.run(()=>send(`/api/fixtures/${f.id}/end`,{}),f.sport==='volleyball'?'Match ended. Enter the final sets.':'Match completed. Standings and Ws updated.');if(result?.needs_result)setResultOpen(true);}
 async function cancel(e){e.preventDefault();const v=new FormData(e.currentTarget);if(confirm('Cancel this match? Predictions will be void and history retained.'))await m.run(()=>send(`/api/fixtures/${f.id}/cancel`,{reason:v.get('reason')}),'Match cancelled. Predictions void.');}
 async function walkover(e){e.preventDefault();const v=new FormData(e.currentTarget);if(confirm('Record a walkover without a score? Predictions will be void.'))await m.run(()=>send(`/api/fixtures/${f.id}/walkover`,{winner:v.get('winner')}),'Walkover recorded. Ws unchanged.');}
 return <>
  {f.status==='scheduled'&&!archived&&<><details className="archive-section schedule-details"><summary>Reschedule match</summary><form className="form-stack section" onSubmit={schedule}><h2>Schedule</h2><div className="form-grid"><label>Kick-off (WAT, optional)<input type="datetime-local" name="scheduled_at" defaultValue={toInput(f.scheduled_at)}/></label><label>Venue<input name="venue" maxLength={200} defaultValue={f.venue||''}/></label></div><p className="help">An empty date leaves the fixture undated. The match begins when you click Start Match.</p><Button disabled={m.pending}>Save schedule</Button></form></details><div className="match-start section"><div><h2>Ready to play?</h2><p className="help">Start Match closes predictions and permanently locks fixture deletion.</p></div><Button disabled={m.pending} onClick={()=>{if(confirm('Start this match? Predictions close and deletion locks immediately.'))m.run(()=>send(`/api/fixtures/${f.id}/start`,{}),'Match started. Predictions closed.');}}>Start Match</Button></div></>}
  {f.status==='live'&&<section className="match-actions section"><h2>{f.sport==='volleyball'?'Volleyball result':'Live scoring'}</h2>{f.sport!=='volleyball'?<><div className="score-controls">{[['home',home],['away',away]].map(([side,team])=><fieldset key={side}><legend>{team.name}</legend><div className="score-buttons">{(f.sport==='football'?[1]:[1,2,3]).map(n=><Button key={n} disabled={m.pending} aria-label={`Add ${n} to ${team.name}`} onClick={()=>m.run(()=>send(`/api/fixtures/${f.id}/score`,{side,increment:n}),'Score updated.')}>+{n}</Button>)}</div></fieldset>)}</div><Button className="end-match" disabled={m.pending} onClick={end}>End Match</Button></>:resultOpen?<ResultForm fixture={f} teams={teams}/>:<><p className="help">Best of {f.best_of}. End Match opens the final set result.</p><Button className="end-match" disabled={m.pending} onClick={end}>End Match</Button></>}</section>}
  {['scheduled','live'].includes(f.status)&&!archived&&<div className="secondary-flows"><details><summary>Record a walkover</summary><form className="form-stack" onSubmit={walkover}><label>Winning team<select name="winner" required defaultValue=""><option value="" disabled>Choose winner</option><option value="home">{home.name}</option><option value="away">{away.name}</option></select></label><p className="help">Standings record the win without invented scores. All predictions are void.</p><Button disabled={m.pending} variant="secondary">Record walkover</Button></form></details><details><summary>Cancel unfinished match</summary><form className="form-stack" onSubmit={cancel}><label>Reason<textarea name="reason" required maxLength={1000}/></label><Button disabled={m.pending} variant="danger">Cancel match</Button></form></details>{f.status==='scheduled'&&<Button variant="danger" disabled={m.pending} onClick={()=>{if(confirm('Delete this unstarted fixture and its predictions?'))m.run(async()=>{await send(`/api/fixtures/${f.id}`,{},'DELETE');m.router.push(f.league_id?`/leagues/${f.league_id}`:'/friendlies');},'Fixture deleted.');}}>Delete unstarted fixture</Button>}</div>}
  {finalize&&<details className="archive-section"><summary>Correct finalized result</summary><p className="help section">Correcting a played result recalculates standings and reverses the old Ws scoring before applying the new result.</p><ResultForm fixture={f} teams={teams} correction/></details>}
  {f.status==='cancelled'&&<p className="form-message section">This cancelled match is retained in history. It has no standings or Ws effect.</p>}
  <FormStatus {...m}/>
 </>;
}
```

## 8. Cleanup and verification

- Removed the old sidebar selectors and old font links.
- Centralized presentation colours in the semantic tokens; required browser metadata and manifest use their specified colour values.
- Preserved APIs, Supabase schema, helpers, middleware, Next configuration, dependency files and tests byte-for-byte.
- Mobile theme/layout checks and final validation are documented in UI_REDESIGN.md and VALIDATION.md.
