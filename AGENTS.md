# SteadySugar — agent notes

Diabetes self-management app. **Continue from [PLAN.md](./PLAN.md)** — milestone 1 (UI on sample data) is done; the next milestones add accounts, persistence, push reminders, etc.

## Architecture

- `src/routes/index.tsx` — marketing landing page (SSR, no client data).
- `src/routes/app.tsx` — `/app` layout: wraps `CareProvider` + `AppShell` (sidebar / mobile bottom nav, overdue banner, toasts, urgent alert dialog).
- `src/routes/app.index.tsx` — Today dashboard (trend chart, stat tiles, care steps, recent readings).
- `src/routes/app.log.tsx` — log-a-reading form + history.
- `src/routes/app.meals.tsx` — daily meal plan.
- `src/routes/app.medications.tsx` — today's doses + 7-day adherence.
- `src/lib/fixtures.ts` — **all sample data** (patient, targets, check schedule, medications, meal library) and `buildHistory()` which generates 14 days of readings/doses relative to now with a seeded PRNG. Swap this for DB-backed loaders in milestone 3.
- `src/lib/health.ts` — pure domain logic: `classify`, check/dose status, overdue detection, daily care score, trend, formatting. Unit tested in `health.test.ts`.
- `src/lib/store.tsx` — `CareProvider` React context: in-memory state, reminder engine (15 s tick; nudges every `REMINDER_INTERVAL_MS` = 30 min while a check is overdue or a dose is due), toasts, urgent-reading dialog, browser Notification permission.
- `src/components/` — `AppShell`, `TrendChart` (Chart.js line, green when `trend.status === 'doing-well'`, red otherwise), `ui.tsx` (PageHeader, StatTile, ReadingRow, LevelChip, ScenarioSwitch).

## Conventions & decisions

- Glucose is stored in **mg/dL**; mmol/L input is converted on entry.
- Thresholds live in `patient.targets` (urgent high 250, urgent low 54, low 70, fasting 80–130, post-meal <180).
- Care score = 50% readings in range + 25% checks done + 25% doses taken. Trend = linear slope of the last 7 day scores; "doing well" needs slope ≥ 0 and week average ≥ 65. Today is omitted from the chart until it has a reading.
- `/app` renders a loading state on the server; data is seeded in a client effect (time-relative data would otherwise cause hydration mismatches). Keep browser APIs in effects/handlers.
- Design tokens are Tailwind `@theme` colours in `src/styles.css` (paper, ink, moss, leaf, alarm, amber…). Fonts: Fraunces (display) + Figtree (body) from Google Fonts.
- Images are served directly from `public/img/`.
