import type { ReactNode } from 'react'
import type { Reading } from '../lib/fixtures'
import {
  classify,
  contextLabels,
  formatDay,
  formatTime,
  levelMeta,
  type ReadingLevel,
} from '../lib/health'
import { useCare } from '../lib/store'

type Tone = 'good' | 'warn' | 'bad'

const toneText: Record<Tone, string> = {
  good: 'text-leaf',
  warn: 'text-amber',
  bad: 'text-alarm',
}
const toneChip: Record<Tone, string> = {
  good: 'bg-leaf-soft text-leaf',
  warn: 'bg-amber-soft text-amber',
  bad: 'bg-alarm-soft text-alarm',
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="text-sm font-medium text-ink-soft">{eyebrow}</p>
        )}
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mt-1">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-ink-soft max-w-2xl">{description}</p>
        )}
      </div>
      {action}
    </header>
  )
}

export function StatTile({
  label,
  value,
  unit,
  tone,
  foot,
}: {
  label: string
  value: string
  unit?: string
  tone?: Tone
  foot?: string
}) {
  return (
    <div className="rounded-2xl bg-card border border-line p-4 sm:p-5">
      <p className="text-sm text-ink-soft">{label}</p>
      <p
        className={`mt-1 font-display text-3xl font-semibold tabular-nums ${tone ? toneText[tone] : ''}`}
      >
        {value}
        {unit && (
          <span className="ml-1 font-sans text-sm font-medium text-ink-soft">
            {unit}
          </span>
        )}
      </p>
      {foot && <p className="mt-1 text-xs text-ink-soft">{foot}</p>}
    </div>
  )
}

export function LevelChip({ level }: { level: ReadingLevel }) {
  const meta = levelMeta[level]
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${toneChip[meta.tone]}`}
    >
      {meta.label}
    </span>
  )
}

export function ReadingRow({ reading, now }: { reading: Reading; now: number }) {
  const level = classify(reading.value, reading.context)
  const tone = levelMeta[level].tone
  return (
    <li className="flex items-center gap-3 py-3">
      <span
        className={`w-14 font-display text-xl font-semibold tabular-nums ${toneText[tone]}`}
      >
        {reading.value}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-medium">
          {contextLabels[reading.context]}
        </span>
        <span className="block text-xs text-ink-soft truncate">
          {formatDay(reading.takenAt, now)} · {formatTime(reading.takenAt)}
          {reading.note ? ` · ${reading.note}` : ''}
        </span>
      </span>
      {reading.photoUrl && (
        <img
          src={reading.photoUrl}
          alt="Meter photo"
          className="h-9 w-9 rounded-lg object-cover border border-line"
        />
      )}
      <LevelChip level={level} />
    </li>
  )
}

export function ScenarioSwitch() {
  const { scenario, setScenario } = useCare()
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-ink-soft">Sample data:</span>
      <div
        role="radiogroup"
        aria-label="Sample data scenario"
        className="inline-flex rounded-full bg-card border border-line p-1"
      >
        {(
          [
            ['steady', 'Good week'],
            ['struggling', 'Tough week'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={scenario === id}
            onClick={() => setScenario(id)}
            className={`rounded-full px-3 py-1.5 font-medium transition ${scenario === id ? 'bg-ink text-paper' : 'text-ink-soft hover:text-ink'}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
