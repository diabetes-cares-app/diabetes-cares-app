# SteadySugar

A daily diabetes care companion. SteadySugar helps a patient:

- **Log every blood sugar check** (mg/dL or mmol/L, timing, optional meter photo) and get instant feedback.
- **Get urgent alerts**: a reading of 250 mg/dL or more (or a dangerous low) opens a full-screen alert telling them to contact their diabetes doctor now.
- **Never skip a check**: if a scheduled check is missed, a reminder fires every 30 minutes until a result is uploaded.
- **Take medication on time**: reminders at each dose time, repeated every 30 minutes until marked taken.
- **Eat well**: a daily meal plan that switches to lower-carb picks when sugar is running high.
- **See how they're doing**: a daily care score chart that climbs green when they're on track and drops red when they need to act.

## Tech

TanStack Start (React 19, file routes), Tailwind CSS v4, Chart.js, lucide icons, deployed on Netlify. Images are served through the Netlify Image CDN.

## Running locally

```bash
pnpm install
netlify dev     # or: pnpm dev
pnpm test       # unit tests for the health logic
```

## Status

The full product surface is live with realistic sample data (use the **Good week / Tough week** switch on the dashboard to preview both states). Reminders and alerts run in the browser while the app is open. See [PLAN.md](./PLAN.md) for what comes next: accounts, real data storage, background push reminders, care-team escalation and smarter meal plans.

SteadySugar supports — but does not replace — medical advice.