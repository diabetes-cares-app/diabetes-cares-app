import { createFileRoute } from '@tanstack/react-router'
import { BellRing, CheckCircle2, Clock, Pill, Undo2 } from 'lucide-react'
import { PageHeader } from '../components/ui'
import { atTime, dayKey, medications, startOfDay } from '../lib/fixtures'
import { formatTime, todaysDoses, type DoseStatus } from '../lib/health'
import { useCare } from '../lib/store'

export const Route = createFileRoute('/app/medications')({
  head: () => ({ meta: [{ title: 'Medications · SteadySugar' }] }),
  component: Medications,
})

const stateStyle: Record<DoseStatus['state'], string> = {
  taken: 'bg-leaf-soft/60 border-leaf/25',
  due: 'bg-amber-soft border-amber/40 ring-2 ring-amber/30',
  missed: 'bg-alarm-soft/60 border-alarm/25',
  upcoming: 'bg-card border-line',
}

function Medications() {
  const { now, doses, markDoseTaken, undoDose } = useCare()
  const today = todaysDoses(doses, now)

  const adherence = medications.map((m) => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = startOfDay(now)
      d.setDate(d.getDate() - (6 - i))
      const due = m.times.filter((t) => atTime(d, t).getTime() <= now)
      const taken = due.filter((t) =>
        doses.some((x) => x.medicationId === m.id && x.slotKey === `${dayKey(d)} ${t}`),
      ).length
      return { key: dayKey(d), date: d, due: due.length, taken }
    })
    const due = days.reduce((n, d) => n + d.due, 0)
    const taken = days.reduce((n, d) => n + d.taken, 0)
    return { med: m, days, pct: due ? Math.round((taken / due) * 100) : 100 }
  })

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="On time, every time"
        title="Medications"
        description="You'll get a reminder at each scheduled time, repeated every 30 minutes until you mark the dose as taken."
      />

      <section aria-labelledby="today-doses">
        <h2 id="today-doses" className="font-display text-xl font-semibold">
          Today's doses
        </h2>
        <ol className="mt-4 grid sm:grid-cols-2 gap-3">
          {today.map((d) => (
            <li key={d.slotKey + d.medication.id} className={`rounded-2xl border p-4 ${stateStyle[d.state]}`}>
              <div className="flex items-start gap-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
                  style={{ background: d.medication.color }}
                >
                  <Pill className="h-5 w-5" aria-hidden />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">
                    {d.medication.name}{' '}
                    <span className="font-normal text-ink-soft">· {d.medication.dose}</span>
                  </p>
                  <p className="text-sm text-ink-soft">{d.medication.instructions}</p>
                  <p className="mt-2 flex items-center gap-1.5 text-sm font-medium">
                    {d.state === 'taken' ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-leaf" aria-hidden />
                        Taken at {formatTime(d.taken!.takenAt)}
                      </>
                    ) : d.state === 'due' ? (
                      <>
                        <BellRing className="h-4 w-4 text-amber" aria-hidden />
                        <span className="text-amber">Due now · scheduled {formatTime(d.scheduledAt)}</span>
                      </>
                    ) : d.state === 'missed' ? (
                      <span className="text-alarm">Missed · scheduled {formatTime(d.scheduledAt)}</span>
                    ) : (
                      <>
                        <Clock className="h-4 w-4 text-ink-soft" aria-hidden />
                        <span className="text-ink-soft">Scheduled {formatTime(d.scheduledAt)}</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                {d.state === 'taken' ? (
                  <button
                    type="button"
                    onClick={() => undoDose(d.medication.id, d.slotKey)}
                    className="inline-flex items-center gap-1.5 text-sm text-ink-soft underline underline-offset-2"
                  >
                    <Undo2 className="h-4 w-4" aria-hidden /> Undo
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => markDoseTaken(d.medication.id, d.slotKey)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${d.state === 'upcoming' ? 'border border-line hover:border-moss/50' : 'bg-moss text-paper hover:bg-moss-deep'}`}
                  >
                    {d.state === 'missed' ? 'I took it late' : d.state === 'upcoming' ? 'Taken early' : 'Mark as taken'}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-3xl bg-card border border-line p-5 sm:p-6">
        <h2 className="font-display text-xl font-semibold">Last 7 days</h2>
        <div className="mt-4 space-y-5">
          {adherence.map(({ med, days, pct }) => (
            <div key={med.id} className="flex flex-wrap items-center gap-4">
              <div className="w-48">
                <p className="font-semibold">{med.name}</p>
                <p className="text-sm text-ink-soft">
                  {med.times.join(' · ')}
                </p>
              </div>
              <ul className="flex gap-1.5" aria-label={`${med.name} daily adherence`}>
                {days.map((d) => {
                  const full = d.due > 0 && d.taken === d.due
                  const none = d.due > 0 && d.taken === 0
                  return (
                    <li
                      key={d.key}
                      title={`${d.date.toLocaleDateString([], { weekday: 'short', day: 'numeric' })}: ${d.taken}/${d.due}`}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold ${
                        d.due === 0
                          ? 'bg-paper text-ink-soft'
                          : full
                            ? 'bg-leaf text-white'
                            : none
                              ? 'bg-alarm text-white'
                              : 'bg-amber text-white'
                      }`}
                    >
                      <span className="sr-only">
                        {d.date.toLocaleDateString()}: {d.taken} of {d.due}
                      </span>
                      <span aria-hidden>{d.date.toLocaleDateString([], { weekday: 'narrow' })}</span>
                    </li>
                  )
                })}
              </ul>
              <p
                className={`ml-auto font-display text-2xl font-semibold tabular-nums ${pct >= 90 ? 'text-leaf' : pct >= 70 ? 'text-amber' : 'text-alarm'}`}
              >
                {pct}%
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}