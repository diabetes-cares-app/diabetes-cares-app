import { createFileRoute } from '@tanstack/react-router'
import { Check, RefreshCw, TriangleAlert, X } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '../components/ui'
import { foodGuide, lowTreatment, meals, patient, type Meal } from '../lib/fixtures'
import { classify, levelMeta } from '../lib/health'
import { useCare } from '../lib/store'

export const Route = createFileRoute('/app/meals')({
  head: () => ({ meta: [{ title: 'Meal plan · SteadySugar' }] }),
  component: MealPlan,
})

const slots: { id: Meal['slot']; label: string; time: string }[] = [
  { id: 'breakfast', label: 'Breakfast', time: '7:30 am' },
  { id: 'lunch', label: 'Lunch', time: '12:45 pm' },
  { id: 'snack', label: 'Afternoon snack', time: '4:00 pm' },
  { id: 'dinner', label: 'Dinner', time: '7:00 pm' },
]

function MealPlan() {
  const { now, readings } = useCare()
  const latest = readings[0]
  const level = latest ? classify(latest.value, latest.context) : 'in-range'
  const runningHigh = level === 'high' || level === 'urgent-high'
  const runningLow = level === 'low' || level === 'urgent-low'
  const dayIndex = Math.floor(now / 86_400_000)
  const [offsets, setOffsets] = useState<Record<string, number>>({})

  const plan = slots.map((s) => {
    const pool = meals.filter((m) => m.slot === s.id && (!runningHigh || m.lowCarb))
    const i = (dayIndex + (offsets[s.id] ?? 0)) % pool.length
    return { ...s, meal: pool[i], poolSize: pool.length }
  })
  const totalCarbs = plan.reduce((n, p) => n + p.meal.carbs, 0)
  const totalFiber = plan.reduce((n, p) => n + p.meal.fiber, 0)
  const totalProtein = plan.reduce((n, p) => n + p.meal.protein, 0)
  const budgetPct = Math.min(100, (totalCarbs / patient.dailyCarbBudget) * 100)

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Suggested for today"
        title="Your meal plan"
        description="Balanced, diabetes-friendly meals that keep carbs steady across the day. The plan adapts to your latest reading."
      />

      {runningLow && latest && (
        <section role="alert" className="rounded-3xl bg-alarm-soft border border-alarm/30 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <TriangleAlert className="h-6 w-6 text-alarm shrink-0" aria-hidden />
            <div>
              <p className="font-semibold">
                Your last reading was {latest.value} mg/dL — treat the low before eating your next meal.
              </p>
              <ul className="mt-2 list-disc pl-5 text-sm text-ink-soft">
                {lowTreatment.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <p className="mt-2 text-sm text-ink-soft">Recheck after 15 minutes.</p>
            </div>
          </div>
        </section>
      )}

      <section className="relative overflow-hidden rounded-3xl bg-moss-deep text-paper">
        <img
          src="/img/meals.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-moss-deep via-moss-deep/85 to-transparent" />
        <div className="relative p-6 sm:p-8 max-w-xl">
          <p className="text-sm uppercase tracking-widest text-paper/70">
            {runningHigh ? 'Adjusted for a high reading' : 'Steady-sugar day'}
          </p>
          <h2 className="font-display text-3xl font-semibold mt-2">
            {runningHigh
              ? 'Lower-carb picks until your sugar settles'
              : 'About 40 g of carbs per meal, plenty of fiber'}
          </h2>
          {latest && (
            <p className="mt-3 text-paper/80 text-sm">
              Based on your latest reading of {latest.value} mg/dL (
              {levelMeta[level].label.toLowerCase()}).
            </p>
          )}
          <dl className="mt-6 grid grid-cols-3 gap-3 text-sm">
            <div>
              <dt className="text-paper/65">Carbs</dt>
              <dd className="font-display text-2xl font-semibold tabular-nums">
                {totalCarbs}
                <span className="text-sm font-sans text-paper/65"> / {patient.dailyCarbBudget} g</span>
              </dd>
            </div>
            <div>
              <dt className="text-paper/65">Fiber</dt>
              <dd className="font-display text-2xl font-semibold tabular-nums">
                {totalFiber}
                <span className="text-sm font-sans text-paper/65"> g</span>
              </dd>
            </div>
            <div>
              <dt className="text-paper/65">Protein</dt>
              <dd className="font-display text-2xl font-semibold tabular-nums">
                {totalProtein}
                <span className="text-sm font-sans text-paper/65"> g</span>
              </dd>
            </div>
          </dl>
          <div
            className="mt-4 h-2 rounded-full bg-white/15 overflow-hidden"
            role="meter"
            aria-label="Share of daily carb budget"
            aria-valuenow={Math.round(budgetPct)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="h-full rounded-full bg-paper" style={{ width: `${budgetPct}%` }} />
          </div>
        </div>
      </section>

      <section className="grid sm:grid-cols-2 gap-4">
        {plan.map((p) => (
          <article key={p.id} className="rounded-3xl bg-card border border-line p-5 flex flex-col">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold uppercase tracking-widest text-moss">{p.label}</span>
              <span className="text-ink-soft">{p.time}</span>
            </div>
            <h3 className="mt-3 font-display text-xl font-semibold">{p.meal.name}</h3>
            <p className="mt-1 text-sm text-ink-soft flex-1">{p.meal.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-mist px-2.5 py-1 text-xs font-semibold tabular-nums">
                {p.meal.carbs} g carbs
              </span>
              <span className="rounded-full bg-mist px-2.5 py-1 text-xs font-semibold tabular-nums">
                {p.meal.fiber} g fiber
              </span>
              <span className="rounded-full bg-mist px-2.5 py-1 text-xs font-semibold tabular-nums">
                {p.meal.protein} g protein
              </span>
              {p.meal.tags.map((t) => (
                <span key={t} className="rounded-full border border-line px-2.5 py-1 text-xs text-ink-soft">
                  {t}
                </span>
              ))}
            </div>
            {p.poolSize > 1 && (
              <button
                type="button"
                onClick={() => setOffsets((o) => ({ ...o, [p.id]: (o[p.id] ?? 0) + 1 }))}
                className="mt-4 self-start inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-moss/50"
              >
                <RefreshCw className="h-4 w-4" aria-hidden /> Swap meal
              </button>
            )}
          </article>
        ))}
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <div className="rounded-3xl bg-leaf-soft/60 border border-leaf/20 p-5 sm:p-6">
          <h2 className="font-display text-xl font-semibold">Fill your plate with</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {foodGuide.favour.map((f) => (
              <li key={f} className="flex gap-2">
                <Check className="h-4 w-4 text-leaf mt-0.5 shrink-0" aria-hidden />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl bg-alarm-soft/50 border border-alarm/20 p-5 sm:p-6">
          <h2 className="font-display text-xl font-semibold">Go easy on</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {foodGuide.limit.map((f) => (
              <li key={f} className="flex gap-2">
                <X className="h-4 w-4 text-alarm mt-0.5 shrink-0" aria-hidden />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <p className="text-xs text-ink-soft">
        Suggestions are general guidance. Your doctor or dietitian may set different carb targets for you.
      </p>
    </div>
  )
}