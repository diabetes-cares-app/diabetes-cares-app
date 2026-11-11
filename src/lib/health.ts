import {
  atTime,
  checkSlots,
  dayKey,
  medications,
  patient,
  startOfDay,
  type CheckSlot,
  type DoseLog,
  type Medication,
  type Reading,
  type ReadingContext,
} from './fixtures'

export type ReadingLevel =
  | 'urgent-low'
  | 'low'
  | 'in-range'
  | 'high'
  | 'urgent-high'

export const levelMeta: Record<
  ReadingLevel,
  { label: string; tone: 'good' | 'warn' | 'bad'; advice: string }
> = {
  'urgent-low': {
    label: 'Dangerously low',
    tone: 'bad',
    advice:
      'Treat now with 15 g of fast-acting sugar, recheck in 15 minutes and call your doctor.',
  },
  low: {
    label: 'Low',
    tone: 'warn',
    advice: 'Have 15 g of fast-acting carbs and recheck in 15 minutes.',
  },
  'in-range': {
    label: 'In range',
    tone: 'good',
    advice: 'Nicely done — keep following your plan.',
  },
  high: {
    label: 'High',
    tone: 'warn',
    advice:
      'Drink water, choose a lower-carb next meal and check again in 2 hours.',
  },
  'urgent-high': {
    label: 'Too high',
    tone: 'bad',
    advice: `Contact ${patient.doctor.name} at ${patient.doctor.clinic} now.`,
  },
}

export const contextLabels: Record<ReadingContext, string> = {
  fasting: 'Fasting',
  'before-meal': 'Before meal',
  'after-meal': 'After meal',
  bedtime: 'Bedtime',
  random: 'Other time',
}

export function classify(value: number, context: ReadingContext): ReadingLevel {
  const t = patient.targets
  if (value < t.urgentLow) return 'urgent-low'
  if (value < t.low) return 'low'
  if (value >= t.urgentHigh) return 'urgent-high'
  const high =
    context === 'after-meal' || context === 'random' || context === 'bedtime'
      ? t.afterMealHigh
      : t.fastingHigh
  if (value > high) return 'high'
  return 'in-range'
}

export function isUrgent(level: ReadingLevel) {
  return level === 'urgent-high' || level === 'urgent-low'
}

export const mmolToMgdl = (mmol: number) => Math.round(mmol * 18.0182)
export const mgdlToMmol = (mg: number) => Math.round((mg / 18.0182) * 10) / 10

// ---------------------------------------------------------------------------
// Check schedule & reminders
// ---------------------------------------------------------------------------

export const REMINDER_INTERVAL_MS = 30 * 60_000
/** A check counts as overdue this long after its scheduled time. */
export const CHECK_GRACE_MS = 15 * 60_000

export interface SlotStatus {
  slot: CheckSlot
  scheduledAt: number
  reading?: Reading
  state: 'done' | 'overdue' | 'upcoming'
}

/** Status of each of today's checks. A reading satisfies the nearest slot within ±90 minutes, or any later-unfilled overdue slot. */
export function todaysChecks(readings: Reading[], now: number): SlotStatus[] {
  const today = startOfDay(now)
  const todays = readings
    .filter((r) => dayKey(r.takenAt) === dayKey(now))
    .sort((a, b) => a.takenAt - b.takenAt)
  const used = new Set<string>()

  return checkSlots.map((slot, idx) => {
    const scheduledAt = atTime(today, slot.time).getTime()
    const nextAt =
      idx < checkSlots.length - 1
        ? atTime(today, checkSlots[idx + 1].time).getTime()
        : Infinity
    const reading = todays.find(
      (r) =>
        !used.has(r.id) &&
        r.takenAt >= scheduledAt - 90 * 60_000 &&
        r.takenAt < nextAt - 30 * 60_000,
    )
    if (reading) {
      used.add(reading.id)
      return { slot, scheduledAt, reading, state: 'done' as const }
    }
    return {
      slot,
      scheduledAt,
      state:
        now > scheduledAt + CHECK_GRACE_MS
          ? ('overdue' as const)
          : ('upcoming' as const),
    }
  })
}

/** The oldest check that is overdue with no reading logged since it was due. */
export function overdueCheck(readings: Reading[], now: number) {
  const latest = readings[0]?.takenAt ?? 0
  const today = startOfDay(now)
  const candidates: { slot: CheckSlot; scheduledAt: number }[] = []
  for (let back = 1; back >= 0; back--) {
    const day = new Date(today)
    day.setDate(day.getDate() - back)
    for (const slot of checkSlots) {
      const scheduledAt = atTime(day, slot.time).getTime()
      if (now > scheduledAt + CHECK_GRACE_MS) candidates.push({ slot, scheduledAt })
    }
  }
  const mostRecent = candidates[candidates.length - 1]
  if (!mostRecent) return null
  // Satisfied if any reading was logged within 90 minutes before the slot or after it.
  if (latest >= mostRecent.scheduledAt - 90 * 60_000) return null
  return mostRecent
}

export function nextCheck(now: number) {
  const today = startOfDay(now)
  for (let add = 0; add < 2; add++) {
    const day = new Date(today)
    day.setDate(day.getDate() + add)
    for (const slot of checkSlots) {
      const at = atTime(day, slot.time).getTime()
      if (at > now) return { slot, scheduledAt: at }
    }
  }
  return null
}

// ---------------------------------------------------------------------------
// Medications
// ---------------------------------------------------------------------------

export interface DoseStatus {
  medication: Medication
  time: string
  slotKey: string
  scheduledAt: number
  taken?: DoseLog
  state: 'taken' | 'due' | 'missed' | 'upcoming'
}

export const DOSE_DUE_WINDOW_MS = 60 * 60_000

export function todaysDoses(doses: DoseLog[], now: number): DoseStatus[] {
  const today = startOfDay(now)
  const list: DoseStatus[] = []
  for (const medication of medications) {
    for (const time of medication.times) {
      const scheduledAt = atTime(today, time).getTime()
      const slotKey = `${dayKey(today)} ${time}`
      const taken = doses.find(
        (d) => d.medicationId === medication.id && d.slotKey === slotKey,
      )
      let state: DoseStatus['state'] = 'upcoming'
      if (taken) state = 'taken'
      else if (now >= scheduledAt && now < scheduledAt + 3 * DOSE_DUE_WINDOW_MS)
        state = 'due'
      else if (now >= scheduledAt) state = 'missed'
      list.push({ medication, time, slotKey, scheduledAt, taken, state })
    }
  }
  return list.sort((a, b) => a.scheduledAt - b.scheduledAt)
}

// ---------------------------------------------------------------------------
// Daily care score & trend
// ---------------------------------------------------------------------------

export interface DayScore {
  key: string
  date: Date
  score: number
  inRangePct: number
  checksDone: number
  checksDue: number
  dosesTaken: number
  dosesDue: number
  avg: number | null
}

/**
 * 0–100 care score for a day:
 *  50% — share of readings in range
 *  25% — scheduled checks completed
 *  25% — scheduled medication doses taken
 */
export function dailyScores(
  readings: Reading[],
  doses: DoseLog[],
  now: number,
  days = 14,
): DayScore[] {
  const out: DayScore[] = []
  const today = startOfDay(now)
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const key = dayKey(date)
    const dayReadings = readings.filter((r) => dayKey(r.takenAt) === key)
    const checksDue = checkSlots.filter(
      (s) => atTime(date, s.time).getTime() + CHECK_GRACE_MS <= now,
    ).length
    const dosesDue = medications.reduce(
      (n, m) =>
        n + m.times.filter((t) => atTime(date, t).getTime() <= now).length,
      0,
    )
    const dosesTaken = doses.filter((d) => d.slotKey.startsWith(key)).length
    const inRange = dayReadings.filter(
      (r) => classify(r.value, r.context) === 'in-range',
    ).length
    const inRangePct = dayReadings.length ? inRange / dayReadings.length : 0
    const checksDone = Math.min(dayReadings.length, checksDue || dayReadings.length)
    const checkPct = checksDue ? checksDone / checksDue : 1
    const dosePct = dosesDue ? Math.min(1, dosesTaken / dosesDue) : 1
    // Early in the day with nothing due yet, carry the score from adherence only.
    const rangePart = dayReadings.length ? inRangePct : checkPct
    const score = Math.round(rangePart * 50 + checkPct * 25 + dosePct * 25)
    const avg = dayReadings.length
      ? Math.round(
          dayReadings.reduce((s, r) => s + r.value, 0) / dayReadings.length,
        )
      : null
    out.push({
      key,
      date,
      score,
      inRangePct,
      checksDone,
      checksDue,
      dosesTaken,
      dosesDue,
      avg,
    })
  }
  return out
}

export interface Trend {
  status: 'doing-well' | 'needs-attention'
  /** Score points per day over the last week. */
  slope: number
  weekAvg: number
  previousWeekAvg: number
}

export function trendOf(scores: DayScore[]): Trend {
  const last7 = scores.slice(-7)
  const prev7 = scores.slice(-14, -7)
  const n = last7.length
  const xs = last7.map((_, i) => i)
  const ys = last7.map((s) => s.score)
  const mx = xs.reduce((a, b) => a + b, 0) / n
  const my = ys.reduce((a, b) => a + b, 0) / n
  const num = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0)
  const den = xs.reduce((s, x) => s + (x - mx) ** 2, 0) || 1
  const slope = num / den
  const weekAvg = Math.round(my)
  const previousWeekAvg = prev7.length
    ? Math.round(prev7.reduce((s, d) => s + d.score, 0) / prev7.length)
    : weekAvg
  const status = slope >= 0 && weekAvg >= 65 ? 'doing-well' : 'needs-attention'
  return { status, slope, weekAvg, previousWeekAvg }
}

export function timeInRange(readings: Reading[], sinceMs: number) {
  const recent = readings.filter((r) => r.takenAt >= sinceMs)
  if (!recent.length) return null
  return Math.round(
    (recent.filter((r) => classify(r.value, r.context) === 'in-range').length /
      recent.length) *
      100,
  )
}

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

export function formatTime(ms: number) {
  return new Date(ms).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function formatDay(ms: number | Date, now: number) {
  const k = dayKey(ms)
  if (k === dayKey(now)) return 'Today'
  const y = new Date(now)
  y.setDate(y.getDate() - 1)
  if (k === dayKey(y)) return 'Yesterday'
  return new Date(ms).toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDuration(ms: number) {
  const total = Math.max(0, Math.round(ms / 60_000))
  const h = Math.floor(total / 60)
  const m = total % 60
  if (h && m) return `${h}h ${m}m`
  if (h) return `${h}h`
  return `${m}m`
}

export function formatCountdown(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
