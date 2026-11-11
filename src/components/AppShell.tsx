import { Link, Outlet } from '@tanstack/react-router'
import {
  Activity,
  BellRing,
  Droplet,
  LayoutDashboard,
  Phone,
  Pill,
  Salad,
  TriangleAlert,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { lowTreatment, patient } from '../lib/fixtures'
import {
  classify,
  formatCountdown,
  formatDuration,
  formatTime,
  levelMeta,
  overdueCheck,
} from '../lib/health'
import { useCare, type Toast } from '../lib/store'

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden>
        <rect width="32" height="32" rx="9" fill={light ? '#f6f3ec' : '#1e5a43'} />
        <path
          d="M16 6c-4 5.5-7 9.2-7 12.6A7 7 0 0 0 23 18.6C23 15.2 20 11.5 16 6Z"
          fill={light ? '#1e5a43' : '#f6f3ec'}
        />
        <path
          d="M11.5 19.5h2.6l1.4-2.6 2 4.4 1.3-1.8h1.7"
          fill="none"
          stroke={light ? '#f6f3ec' : '#1e5a43'}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className={`font-display text-xl font-semibold tracking-tight ${light ? 'text-paper' : 'text-ink'}`}
      >
        SteadySugar
      </span>
    </span>
  )
}

const nav = [
  { to: '/app', label: 'Today', icon: LayoutDashboard, exact: true },
  { to: '/app/log', label: 'Log sugar', icon: Droplet, exact: false },
  { to: '/app/meals', label: 'Meal plan', icon: Salad, exact: false },
  { to: '/app/medications', label: 'Medications', icon: Pill, exact: false },
] as const

export function AppShell() {
  const { ready } = useCare()
  return (
    <div className="min-h-screen bg-paper lg:flex">
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-moss-deep text-paper px-5 py-6">
        <Link to="/" className="mb-10">
          <Logo light />
        </Link>
        <nav className="flex flex-col gap-1">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.exact }}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-paper/75 hover:bg-white/5 hover:text-paper transition"
              activeProps={{ className: '!bg-white/10 !text-paper font-semibold' }}
            >
              <item.icon className="h-5 w-5" aria-hidden />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl bg-white/5 p-4 text-sm">
          <p className="text-paper/60">Your care team</p>
          <p className="mt-1 font-semibold">{patient.doctor.name}</p>
          <p className="text-paper/70">{patient.doctor.clinic}</p>
          <a
            href={`tel:${patient.doctor.phone.replace(/[^+\d]/g, '')}`}
            className="mt-3 inline-flex items-center gap-2 text-paper underline underline-offset-2"
          >
            <Phone className="h-4 w-4" aria-hidden /> {patient.doctor.phone}
          </a>
        </div>
      </aside>

      <div className="flex-1 lg:pl-64 pb-24 lg:pb-0">
        <header className="lg:hidden sticky top-0 z-20 flex items-center justify-between bg-paper/90 backdrop-blur px-4 py-3 border-b border-line">
          <Link to="/">
            <Logo />
          </Link>
          <Link
            to="/app/log"
            className="rounded-full bg-moss text-paper text-sm font-semibold px-4 py-2"
          >
            + Reading
          </Link>
        </header>
        {ready ? (
          <>
            <OverdueBanner />
            <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
              <Outlet />
            </main>
          </>
        ) : (
          <div role="status" className="mx-auto max-w-6xl px-6 py-16 text-ink-soft">
            <Activity className="h-6 w-6 animate-pulse text-moss" aria-hidden />
            <p className="mt-3">Loading your care plan…</p>
          </div>
        )}
      </div>

      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 grid grid-cols-4 bg-card border-t border-line">
        {nav.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.exact }}
            className="flex flex-col items-center gap-1 py-2.5 text-xs text-ink-soft"
            activeProps={{ className: '!text-moss font-semibold' }}
          >
            <item.icon className="h-5 w-5" aria-hidden />
            {item.label}
          </Link>
        ))}
      </nav>

      <Toasts />
      <UrgentAlert />
    </div>
  )
}

function useSecondTick() {
  const [t, setT] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setT(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])
  return t
}

function OverdueBanner() {
  const { readings, now, nextNudgeAt, nudgeCount } = useCare()
  const tick = useSecondTick()
  const overdue = overdueCheck(readings, now)
  if (!overdue) return null
  return (
    <div
      role="alert"
      className="bg-amber-soft border-b border-amber/30 text-ink"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10 py-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber text-white">
          <BellRing className="h-5 w-5" aria-hidden />
        </span>
        <p className="flex-1 min-w-[14rem] text-sm">
          <strong className="font-semibold">
            Your {overdue.slot.label.toLowerCase()} is{' '}
            {formatDuration(now - overdue.scheduledAt)} overdue.
          </strong>{' '}
          Check your sugar and upload the result.
          {nextNudgeAt && (
            <span className="text-ink-soft">
              {' '}
              Reminder {nudgeCount} sent · next in{' '}
              <span className="tabular-nums font-medium">
                {formatCountdown(nextNudgeAt - tick)}
              </span>
            </span>
          )}
        </p>
        <Link
          to="/app/log"
          className="rounded-full bg-ink text-paper text-sm font-semibold px-4 py-2 hover:bg-moss-deep"
        >
          Log reading now
        </Link>
      </div>
    </div>
  )
}

const toastTone: Record<Toast['tone'], string> = {
  good: 'border-leaf/40 bg-leaf-soft',
  warn: 'border-amber/40 bg-amber-soft',
  bad: 'border-alarm/40 bg-alarm-soft',
  info: 'border-moss/30 bg-mist',
}

function Toasts() {
  const { toasts, dismissToast } = useCare()
  return (
    <div
      aria-live="polite"
      className="fixed z-40 bottom-24 lg:bottom-6 right-4 left-4 sm:left-auto sm:w-96 flex flex-col gap-3"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`rise rounded-2xl border shadow-lg shadow-ink/5 p-4 ${toastTone[t.tone]}`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="font-semibold">{t.title}</p>
              {t.body && <p className="mt-1 text-sm text-ink-soft">{t.body}</p>}
              {t.action && (
                <Link
                  to={t.action.to}
                  onClick={() => dismissToast(t.id)}
                  className="mt-2 inline-block text-sm font-semibold text-moss underline underline-offset-2"
                >
                  {t.action.label}
                </Link>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              className="rounded-full p-1 text-ink-soft hover:bg-black/5"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

function UrgentAlert() {
  const { urgentReading, dismissUrgent } = useCare()
  if (!urgentReading) return null
  const level = classify(urgentReading.value, urgentReading.context)
  const meta = levelMeta[level]
  const isLow = level === 'urgent-low'
  const tel = patient.doctor.phone.replace(/[^+\d]/g, '')
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/60 p-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="urgent-title"
        aria-describedby="urgent-body"
        className="rise w-full max-w-md rounded-3xl bg-card overflow-hidden shadow-2xl"
      >
        <div className="bg-alarm text-white px-6 pt-6 pb-5">
          <span className="pulse-alarm inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
            <TriangleAlert className="h-6 w-6" aria-hidden />
          </span>
          <p className="mt-4 text-sm uppercase tracking-widest text-white/80">
            {meta.label} · {formatTime(urgentReading.takenAt)}
          </p>
          <h2 id="urgent-title" className="font-display text-3xl font-semibold mt-1">
            {urgentReading.value} mg/dL
          </h2>
        </div>
        <div id="urgent-body" className="px-6 py-5 space-y-3">
          {isLow ? (
            <>
              <p className="font-semibold">Treat your low right now.</p>
              <ul className="list-disc pl-5 text-sm text-ink-soft space-y-1">
                {lowTreatment.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <p className="text-sm text-ink-soft">
                Recheck in 15 minutes. If you still feel unwell, call{' '}
                {patient.doctor.name}.
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold">
                Your sugar is too high. Visit or call {patient.doctor.name}{' '}
                immediately.
              </p>
              <p className="text-sm text-ink-soft">
                Drink water and avoid sugary food. If you have vomiting,
                trouble breathing, confusion or a fruity breath smell, call
                emergency services now.
              </p>
            </>
          )}
        </div>
        <div className="px-6 pb-6 flex flex-col gap-2">
          <a
            href={`tel:${tel}`}
            className="flex items-center justify-center gap-2 rounded-full bg-alarm text-white font-semibold py-3 hover:brightness-110"
          >
            <Phone className="h-4 w-4" aria-hidden /> Call {patient.doctor.name}
          </a>
          <button
            type="button"
            onClick={dismissUrgent}
            className="rounded-full border border-line py-3 font-semibold hover:bg-paper"
          >
            I've contacted my doctor
          </button>
        </div>
      </div>
    </div>
  )
}
