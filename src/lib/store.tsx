import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  buildHistory,
  type DoseLog,
  type Reading,
  type ReadingContext,
  type Scenario,
} from './fixtures'
import {
  REMINDER_INTERVAL_MS,
  classify,
  contextLabels,
  formatDuration,
  isUrgent,
  levelMeta,
  overdueCheck,
  todaysDoses,
} from './health'

export interface Toast {
  id: number
  tone: 'good' | 'warn' | 'bad' | 'info'
  title: string
  body?: string
  action?: { label: string; to: '/app/log' | '/app/medications' }
}

interface CareState {
  ready: boolean
  now: number
  scenario: Scenario
  setScenario: (s: Scenario) => void
  readings: Reading[]
  doses: DoseLog[]
  addReading: (r: {
    value: number
    context: ReadingContext
    takenAt: number
    note?: string
    photoUrl?: string
  }) => Reading
  markDoseTaken: (medicationId: string, slotKey: string) => void
  undoDose: (medicationId: string, slotKey: string) => void
  urgentReading: Reading | null
  dismissUrgent: () => void
  toasts: Toast[]
  dismissToast: (id: number) => void
  /** When the next "please check your sugar" nudge fires, if a check is overdue. */
  nextNudgeAt: number | null
  nudgeCount: number
  notificationPermission: NotificationPermission | 'unsupported'
  requestNotifications: () => void
}

const CareContext = createContext<CareState | null>(null)

const TICK_MS = 15_000

function notify(title: string, body: string) {
  if (typeof Notification === 'undefined') return
  if (Notification.permission !== 'granted') return
  try {
    new Notification(title, { body, icon: '/favicon.svg', tag: title })
  } catch {
    // Some browsers only allow notifications from a service worker.
  }
}

export function CareProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [now, setNow] = useState(0)
  const [scenario, setScenarioState] = useState<Scenario>('steady')
  const [readings, setReadings] = useState<Reading[]>([])
  const [doses, setDoses] = useState<DoseLog[]>([])
  const [urgentReading, setUrgentReading] = useState<Reading | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [lastNudgeAt, setLastNudgeAt] = useState<number | null>(null)
  const [nudgeCount, setNudgeCount] = useState(0)
  const [permission, setPermission] = useState<
    NotificationPermission | 'unsupported'
  >('default')
  const medNudges = useRef(new Map<string, number>())
  const toastId = useRef(0)

  const pushToast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = ++toastId.current
    setToasts((list) => [...list.slice(-3), { ...t, id }])
    if (t.tone !== 'bad') {
      window.setTimeout(
        () => setToasts((list) => list.filter((x) => x.id !== id)),
        9000,
      )
    }
  }, [])

  const dismissToast = useCallback(
    (id: number) => setToasts((list) => list.filter((x) => x.id !== id)),
    [],
  )

  const seed = useCallback((s: Scenario) => {
    const t = Date.now()
    const history = buildHistory(s, t)
    setReadings(history.readings)
    setDoses(history.doses)
    setNow(t)
    setLastNudgeAt(null)
    setNudgeCount(0)
    medNudges.current.clear()
    const latest = history.readings[0]
    setUrgentReading(
      latest && isUrgent(classify(latest.value, latest.context)) ? latest : null,
    )
  }, [])

  // Browser-only setup: seed sample history relative to the current time.
  useEffect(() => {
    seed('steady')
    setPermission(
      typeof Notification === 'undefined'
        ? 'unsupported'
        : Notification.permission,
    )
    setReady(true)
    const id = window.setInterval(() => setNow(Date.now()), TICK_MS)
    return () => window.clearInterval(id)
  }, [seed])

  const setScenario = useCallback(
    (s: Scenario) => {
      setScenarioState(s)
      seed(s)
    },
    [seed],
  )

  // Reminder engine: overdue sugar checks nag every 30 minutes until logged.
  const overdue = ready ? overdueCheck(readings, now) : null
  const isOverdue = overdue !== null
  useEffect(() => {
    if (!ready || !overdue) return
    if (lastNudgeAt !== null && now - lastNudgeAt < REMINDER_INTERVAL_MS) return
    const late = formatDuration(now - overdue.scheduledAt)
    const title = 'Time to check your blood sugar'
    const body = `Your ${overdue.slot.label.toLowerCase()} (${overdue.slot.time}) is ${late} overdue. Check and upload your result.`
    pushToast({
      tone: 'warn',
      title,
      body,
      action: { label: 'Log reading', to: '/app/log' },
    })
    notify(title, body)
    setLastNudgeAt(now)
    setNudgeCount((n) => n + 1)
  }, [ready, overdue, now, lastNudgeAt, pushToast])

  // Medication reminders at the scheduled time, repeated every 30 minutes while due.
  useEffect(() => {
    if (!ready) return
    for (const dose of todaysDoses(doses, now)) {
      if (dose.state !== 'due') continue
      const key = `${dose.medication.id}|${dose.slotKey}`
      const last = medNudges.current.get(key)
      if (last !== undefined && now - last < REMINDER_INTERVAL_MS) continue
      medNudges.current.set(key, now)
      const title = `Take your ${dose.medication.name}`
      const body = `${dose.medication.dose} · scheduled for ${dose.time}. ${dose.medication.instructions}.`
      pushToast({
        tone: 'info',
        title,
        body,
        action: { label: 'Mark as taken', to: '/app/medications' },
      })
      notify(title, body)
    }
  }, [ready, doses, now, pushToast])

  const addReading: CareState['addReading'] = useCallback(
    (input) => {
      const reading: Reading = {
        id: `r-${Date.now()}`,
        ...input,
      }
      setReadings((list) =>
        [reading, ...list].sort((a, b) => b.takenAt - a.takenAt),
      )
      setNow(Date.now())
      setLastNudgeAt(null)
      setNudgeCount(0)
      const level = classify(reading.value, reading.context)
      const meta = levelMeta[level]
      if (isUrgent(level)) {
        setUrgentReading(reading)
        notify(
          `${meta.label}: ${reading.value} mg/dL`,
          meta.advice,
        )
      } else {
        pushToast({
          tone: meta.tone,
          title: `${reading.value} mg/dL · ${meta.label}`,
          body: `${contextLabels[reading.context]} reading saved. ${meta.advice}`,
        })
      }
      return reading
    },
    [pushToast],
  )

  const markDoseTaken = useCallback(
    (medicationId: string, slotKey: string) => {
      setDoses((list) =>
        list.some((d) => d.medicationId === medicationId && d.slotKey === slotKey)
          ? list
          : [...list, { medicationId, slotKey, takenAt: Date.now() }],
      )
      pushToast({ tone: 'good', title: 'Dose recorded', body: 'Nice work staying on schedule.' })
    },
    [pushToast],
  )

  const undoDose = useCallback((medicationId: string, slotKey: string) => {
    setDoses((list) =>
      list.filter(
        (d) => !(d.medicationId === medicationId && d.slotKey === slotKey),
      ),
    )
  }, [])

  const requestNotifications = useCallback(() => {
    if (typeof Notification === 'undefined') return
    Notification.requestPermission().then(setPermission)
  }, [])

  const value = useMemo<CareState>(
    () => ({
      ready,
      now,
      scenario,
      setScenario,
      readings,
      doses,
      addReading,
      markDoseTaken,
      undoDose,
      urgentReading,
      dismissUrgent: () => setUrgentReading(null),
      toasts,
      dismissToast,
      nextNudgeAt:
        isOverdue && lastNudgeAt !== null
          ? lastNudgeAt + REMINDER_INTERVAL_MS
          : null,
      nudgeCount,
      notificationPermission: permission,
      requestNotifications,
    }),
    [
      ready,
      now,
      scenario,
      setScenario,
      readings,
      doses,
      addReading,
      markDoseTaken,
      undoDose,
      urgentReading,
      toasts,
      dismissToast,
      isOverdue,
      lastNudgeAt,
      nudgeCount,
      permission,
      requestNotifications,
    ],
  )

  return <CareContext.Provider value={value}>{children}</CareContext.Provider>
}

export function useCare() {
  const ctx = useContext(CareContext)
  if (!ctx) throw new Error('useCare must be used inside CareProvider')
  return ctx
}

