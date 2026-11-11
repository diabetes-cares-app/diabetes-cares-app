import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  Circle,
  Clock,
  Droplet,
  Pill,
  Salad,
} from 'lucide-react'
import { PageHeader, ReadingRow, ScenarioSwitch, StatTile } from '../components/ui'
import { TrendChart } from '../components/TrendChart'
import { patient } from '../lib/fixtures'
import {
  classify,
  dailyScores,
  formatDuration,
  formatTime,
  levelMeta,
  nextCheck,
  timeInRange,
  todaysChecks,
  todaysDoses,
  trendOf,
} from '../lib/health'
import { useCare } from '../lib/store'

export const Route = createFileRoute('/app/')({ component: TodayDashboard })

function greeting(now: number) {
  const h = new Date(now).getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function TodayDashboard() {
  const {
    now,
    readings,
    doses,
    notificationPermission,
    requestNotifications,
  } = useCare()
  // Leave today off the chart until its first reading, so an early-morning
  // partial day doesn't read as a sudden drop.
  const scores = dailyScores(readings, doses, now, 14).filter(
    (s, i, all) => i < all.length - 1 || s.avg !== null,
  )
  const trend = trendOf(scores)
  const good = trend.status === 'doing-well'
  const latest = readings[0]
  const latestLevel = latest ? classify(latest.value, latest.context) : null
  const tir = timeInRange(readings, now - 7 * 86_400_000)
  const checks = todaysChecks(readings, now)
  const doseList = todaysDoses(doses, now)
  const upcoming = nextCheck(now)
  const delta = trend.weekAvg - trend.previousWeekAvg

  const steps = [
    ...checks.map((c) => ({
      key: c.slot.id,
      at: c.scheduledAt,
      icon: Droplet,
      title: c.slot.label,
      detail: c.reading
        ? `${c.reading.value} mg/dL at ${formatTime(c.reading.takenAt)}`
        : c.state === 'overdue'
          ? `Overdue by ${formatDuration(now - c.scheduledAt)}`
          : `Due at ${formatTime(c.scheduledAt)}`,
      done: c.state === 'done',
      late: c.state === 'overdue',
      to: '/app/log' as const,
    })),
    ...doseList.map((d) => ({
      key: d.medication.id + d.time,
      at: d.scheduledAt,
      icon: Pill,
      title: `${d.medication.name} · ${d.medication.dose}`,
      detail:
        d.state === 'taken'
          ? `Taken at ${formatTime(d.taken!.takenAt)}`
          : d.state === 'missed'
            ? 'Missed'
            : d.state === 'due'
              ? 'Due now'
              : `Due at ${formatTime(d.scheduledAt)}`,
      done: d.state === 'taken',
      late: d.state === 'missed' || d.state === 'due',
      to: '/app/medications' as const,
    })),
  ].sort((a, b) => a.at - b.at)
  const doneCount = steps.filter((s) => s.done).length

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={new Date(now).toLocaleDateString([], {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })}
        title={`${greeting(now)}, ${patient.firstName}`}
        action={<ScenarioSwitch />}
      />

      <section
        aria-labelledby="trend-title"
        className={`rise rounded-3xl border p-5 sm:p-7 ${good ? 'bg-leaf-soft/60 border-leaf/25' : 'bg-alarm-soft/70 border-alarm/25'}`}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <span
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white ${good ? 'bg-leaf' : 'bg-alarm'}`}
            >
              {good ? (
                <ArrowUpRight className="h-7 w-7" aria-hidden />
              ) : (
                <ArrowDownRight className="h-7 w-7" aria-hidden />
              )}
            </span>
            <div>
              <p
                className={`text-sm font-semibold uppercase tracking-widest ${good ? 'text-leaf' : 'text-alarm'}`}
              >
                {good ? "You're doing well" : 'Needs attention'}
              </p>
              <h2
                id="trend-title"
                className="font-display text-2xl sm:text-3xl font-semibold mt-1 max-w-xl"
              >
                {good
                  ? 'Your sugar and routine are improving week over week.'
                  : 'Your sugar is climbing and care steps are being missed.'}
              </h2>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-ink-soft">Care score this week</p>
            <p className="font-display text-5xl font-semibold tabular-nums">
              {trend.weekAvg}
              <span className="text-xl text-ink-soft">/100</span>
            </p>
            <p
              className={`text-sm font-semibold ${delta >= 0 ? 'text-leaf' : 'text-alarm'}`}
            >
              {delta >= 0 ? '▲' : '▼'} {Math.abs(delta)} vs last week
            </p>
          </div>
        </div>
        <div className="mt-6 rounded-2xl bg-card/80 p-3 sm:p-4">
          <TrendChart scores={scores} trend={trend} />
        </div>
        {!good && (
          <p className="mt-4 text-sm">
            <strong>What helps:</strong> check at every scheduled time, take
            each dose on time, and choose the lower-carb picks in your{' '}
            <Link to="/app/meals" className="underline font-semibold">
              meal plan
            </Link>
            . If readings stay above {patient.targets.urgentHigh} mg/dL, see{' '}
            {patient.doctor.name}.
          </p>
        )}
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatTile
          label="Latest reading"
          value={latest ? `${latest.value}` : '—'}
          unit="mg/dL"
          tone={latestLevel ? levelMeta[latestLevel].tone : undefined}
          foot={
            latest && latestLevel
              ? `${levelMeta[latestLevel].label} · ${formatTime(latest.takenAt)}`
              : 'No readings yet'
          }
        />
        <StatTile
          label="Time in range · 7 days"
          value={tir === null ? '—' : `${tir}`}
          unit="%"
          tone={tir === null ? undefined : tir >= 70 ? 'good' : tir >= 50 ? 'warn' : 'bad'}
          foot="Goal: 70% or more"
        />
        <StatTile
          label="Checks today"
          value={`${checks.filter((c) => c.state === 'done').length}/${checks.length}`}
          tone={checks.some((c) => c.state === 'overdue') ? 'warn' : 'good'}
          foot={
            upcoming
              ? `Next: ${upcoming.slot.label} at ${formatTime(upcoming.scheduledAt)}`
              : ''
          }
        />
        <StatTile
          label="Doses today"
          value={`${doseList.filter((d) => d.state === 'taken').length}/${doseList.length}`}
          tone={doseList.some((d) => d.state === 'missed') ? 'bad' : 'good'}
          foot={
            doseList.find((d) => d.state === 'due' || d.state === 'upcoming')
              ? `Next: ${doseList.find((d) => d.state === 'due' || d.state === 'upcoming')!.medication.name}`
              : 'All doses handled'
          }
        />
      </section>

      <div className="grid lg:grid-cols-5 gap-6">
        <section className="lg:col-span-3 rounded-3xl bg-card border border-line p-5 sm:p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-xl font-semibold">
              Today's care steps
            </h2>
            <p className="text-sm text-ink-soft tabular-nums">
              {doneCount} of {steps.length} done
            </p>
          </div>
          <div className="mt-3 h-2 rounded-full bg-mist overflow-hidden">
            <div
              className="h-full rounded-full bg-moss transition-all"
              style={{ width: `${(doneCount / steps.length) * 100}%` }}
            />
          </div>
          <ol className="mt-4 divide-y divide-line">
            {steps.map((s) => (
              <li key={s.key}>
                <Link
                  to={s.to}
                  className="flex items-center gap-3 py-3 group"
                >
                  {s.done ? (
                    <CheckCircle2 className="h-5 w-5 text-leaf shrink-0" aria-label="Done" />
                  ) : s.late ? (
                    <Clock className="h-5 w-5 text-amber shrink-0" aria-label="Needs action" />
                  ) : (
                    <Circle className="h-5 w-5 text-line shrink-0" aria-label="Upcoming" />
                  )}
                  <s.icon className="h-4 w-4 text-ink-soft shrink-0" aria-hidden />
                  <span className="flex-1 min-w-0">
                    <span
                      className={`block font-medium ${s.done ? 'text-ink-soft line-through decoration-line' : ''}`}
                    >
                      {s.title}
                    </span>
                    <span
                      className={`block text-sm ${s.late && !s.done ? 'text-amber font-medium' : 'text-ink-soft'}`}
                    >
                      {s.detail}
                    </span>
                  </span>
                  <span className="text-sm text-ink-soft tabular-nums">
                    {formatTime(s.at)}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-3xl bg-card border border-line p-5 sm:p-6">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-xl font-semibold">
                Recent readings
              </h2>
              <Link to="/app/log" className="text-sm font-semibold text-moss underline underline-offset-2">
                See all
              </Link>
            </div>
            <ul className="mt-3 divide-y divide-line">
              {readings.slice(0, 5).map((r) => (
                <ReadingRow key={r.id} reading={r} now={now} />
              ))}
            </ul>
          </section>

          <Link
            to="/app/meals"
            className="flex items-center gap-4 rounded-3xl bg-moss text-paper p-5 hover:bg-moss-deep transition"
          >
            <Salad className="h-8 w-8 shrink-0" aria-hidden />
            <span>
              <span className="block font-semibold">Today's meal plan is ready</span>
              <span className="block text-sm text-paper/75">
                {latestLevel === 'high' || latestLevel === 'urgent-high'
                  ? 'Adjusted to lower-carb picks while your sugar is high.'
                  : 'Balanced picks for steady sugar all day.'}
              </span>
            </span>
          </Link>

          {notificationPermission !== 'granted' &&
            notificationPermission !== 'unsupported' && (
              <section className="rounded-3xl border border-dashed border-moss/40 p-5">
                <div className="flex items-start gap-3">
                  <Bell className="h-5 w-5 text-moss mt-0.5" aria-hidden />
                  <div>
                    <p className="font-semibold">Turn on reminder alerts</p>
                    <p className="text-sm text-ink-soft mt-1">
                      Get a device notification for every check and dose, and
                      every 30 minutes while a check is overdue.
                    </p>
                    <button
                      type="button"
                      onClick={requestNotifications}
                      disabled={notificationPermission === 'denied'}
                      className="mt-3 rounded-full bg-ink text-paper text-sm font-semibold px-4 py-2 disabled:opacity-50"
                    >
                      {notificationPermission === 'denied'
                        ? 'Blocked in browser settings'
                        : 'Enable notifications'}
                    </button>
                  </div>
                </div>
              </section>
            )}
        </div>
      </div>
    </div>
  )
}
