# SteadySugar roadmap

SteadySugar is a daily companion for people living with diabetes: it prompts blood sugar checks, reviews every uploaded result, raises urgent "see your doctor" alerts, reminds patients about medication, suggests meals, and shows whether they are doing well on a green/red trend dashboard.

## Milestone 1 — Product surface ✅
Landing page plus four working screens (Today dashboard, Log sugar, Meal plan, Medications) running on realistic sample data from `src/lib/fixtures.ts`. Reading classification, urgent alerts, care score, trend, the 30-minute overdue-check nudges and medication reminders all work in the browser while the app is open.

## Milestone 2 — Accounts & patient profile
- Netlify Identity sign-up / log-in; gate `/app/*` to signed-in users.
- Onboarding: diabetes type, target ranges, check schedule, medications and dose times, doctor contact.
- Settings screen to edit all of the above.

## Milestone 3 — Real data storage
- Netlify Database (Drizzle) tables: `profiles`, `check_slots`, `readings`, `medications`, `dose_logs`.
- Server functions to create/list readings and doses, validated on the server.
- Meter photos uploaded to Netlify Blobs and linked from readings.
- Replace `buildHistory()` and the in-memory store with these APIs; remove the sample-data switch.

## Milestone 4 — Reminders that work when the app is closed
- Service worker + Web Push subscription stored per user.
- Scheduled Netlify Function (every 5 min) that finds overdue checks and due doses and sends push notifications, repeating every 30 minutes until the reading is uploaded or the dose is marked taken.
- Optional email/SMS fallback.

## Milestone 5 — Monitoring & care-team escalation
- Server-side evaluation of each new reading; urgent results recorded as alerts.
- Pattern detection (e.g. 3 highs in 24 h, repeated missed checks) with "you're not doing fine" warnings.
- Optional: notify a nominated caregiver or the doctor's clinic on urgent readings.
- Exportable report (PDF/CSV) for clinic visits.

## Milestone 6 — Smarter meal suggestions
- Larger meal library with dietary preferences, allergies and cuisine.
- AI-assisted daily plans via Netlify AI Gateway, personalised to recent readings and carb budget.
- Log what was actually eaten to correlate meals with readings.
