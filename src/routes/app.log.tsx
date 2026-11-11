import { createFileRoute } from '@tanstack/react-router'
import { Camera, Droplet, ImagePlus, X } from 'lucide-react'
import { useMemo, useRef, useState, type FormEvent } from 'react'
import { LevelChip, PageHeader, ReadingRow } from '../components/ui'
import { checkSlots, dayKey, patient, type Reading, type ReadingContext } from '../lib/fixtures'
import {
  classify,
  contextLabels,
  formatDay,
  levelMeta,
  mgdlToMmol,
  mmolToMgdl,
  todaysChecks,
} from '../lib/health'
import { useCare } from '../lib/store'

export const Route = createFileRoute('/app/log')({
  head: () => ({ meta: [{ title: 'Log sugar · SteadySugar' }] }),
  component: LogReading,
})

function toLocalInput(ms: number) {
  const d = new Date(ms)
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

function guessContext(now: number): ReadingContext {
  const minutes = new Date(now).getHours() * 60 + new Date(now).getMinutes()
  let best: ReadingContext = 'random'
  let bestDiff = 75
  for (const s of checkSlots) {
    const [h, m] = s.time.split(':').map(Number)
    const diff = Math.abs(h * 60 + m - minutes)
    if (diff < bestDiff) {
      best = s.context
      bestDiff = diff
    }
  }
  return best
}

function LogReading() {
  const { now, readings, addReading } = useCare()
  const [unit, setUnit] = useState<'mgdl' | 'mmol'>('mgdl')
  const [value, setValue] = useState('')
  const [context, setContext] = useState<ReadingContext>(() => guessContext(Date.now()))
  const [takenAt, setTakenAt] = useState(() => toLocalInput(Date.now()))
  const [note, setNote] = useState('')
  const [photo, setPhoto] = useState<{ url: string; name: string } | null>(null)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState<Reading | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const numeric = Number(value)
  const mg = value ? (unit === 'mgdl' ? Math.round(numeric) : mmolToMgdl(numeric)) : null
  const preview = mg && mg >= 20 && mg <= 600 ? classify(mg, context) : null
  const checks = todaysChecks(readings, now)

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!value || Number.isNaN(numeric) || mg === null || mg < 20 || mg > 600) {
      setError(
        unit === 'mgdl'
          ? 'Enter a reading between 20 and 600 mg/dL.'
          : 'Enter a reading between 1.1 and 33.3 mmol/L.',
      )
      return
    }
    const t = new Date(takenAt).getTime()
    if (Number.isNaN(t) || t > Date.now() + 5 * 60_000) {
      setError('The reading time cannot be in the future.')
      return
    }
    setError('')
    const r = addReading({
      value: mg,
      context,
      takenAt: t,
      note: note.trim() || undefined,
      photoUrl: photo?.url,
    })
    setSaved(r)
    setValue('')
    setNote('')
    setPhoto(null)
    setTakenAt(toLocalInput(Date.now()))
    if (fileRef.current) fileRef.current.value = ''
  }

  const grouped = useMemo(() => {
    const map = new Map<string, Reading[]>()
    for (const r of readings.slice(0, 40)) {
      const k = dayKey(r.takenAt)
      map.set(k, [...(map.get(k) ?? []), r])
    }
    return [...map.entries()]
  }, [readings])

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Every check counts"
        title="Log your blood sugar"
        description="Upload each result as soon as you check. SteadySugar reviews it instantly and alerts you if you need to see your doctor."
      />

      <div className="grid lg:grid-cols-5 gap-6 items-start">
        <form
          onSubmit={submit}
          noValidate
          className="lg:col-span-3 rounded-3xl bg-card border border-line p-5 sm:p-7 space-y-6"
        >
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="value" className="font-semibold">
                Reading
              </label>
              <div
                role="radiogroup"
                aria-label="Unit"
                className="inline-flex rounded-full bg-paper border border-line p-1 text-sm"
              >
                {(
                  [
                    ['mgdl', 'mg/dL'],
                    ['mmol', 'mmol/L'],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={unit === id}
                    onClick={() => setUnit(id)}
                    className={`rounded-full px-3 py-1 font-medium ${unit === id ? 'bg-ink text-paper' : 'text-ink-soft'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-3 flex items-end gap-3">
              <input
                id="value"
                inputMode="decimal"
                type="number"
                step={unit === 'mgdl' ? 1 : 0.1}
                placeholder={unit === 'mgdl' ? '112' : '6.2'}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                aria-invalid={!!error}
                aria-describedby={error ? 'value-error' : undefined}
                className="w-full rounded-2xl border border-line bg-paper px-5 py-4 font-display text-5xl font-semibold tabular-nums focus:outline-none focus:ring-2 focus:ring-moss"
              />
              <span className="pb-4 text-ink-soft font-medium">
                {unit === 'mgdl' ? 'mg/dL' : 'mmol/L'}
              </span>
            </div>
            {preview && (
              <p className="mt-2 flex items-center gap-2 text-sm text-ink-soft">
                <LevelChip level={preview} />
                {unit === 'mmol' && `≈ ${mg} mg/dL · `}
                {levelMeta[preview].advice}
              </p>
            )}
            {error && (
              <p id="value-error" className="mt-2 text-sm font-medium text-alarm">
                {error}
              </p>
            )}
          </div>

          <fieldset>
            <legend className="font-semibold">When did you check?</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {(Object.keys(contextLabels) as ReadingContext[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={context === c}
                  onClick={() => setContext(c)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${context === c ? 'border-moss bg-moss text-paper' : 'border-line hover:border-moss/50'}`}
                >
                  {contextLabels[c]}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="takenAt" className="font-semibold">
                Time
              </label>
              <input
                id="takenAt"
                type="datetime-local"
                value={takenAt}
                onChange={(e) => setTakenAt(e.target.value)}
                className="mt-2 w-full rounded-xl border border-line bg-paper px-4 py-3 focus:outline-none focus:ring-2 focus:ring-moss"
              />
            </div>
            <div>
              <span className="font-semibold">Meter photo (optional)</span>
              <input
                ref={fileRef}
                id="photo"
                type="file"
                accept="image/*"
                capture="environment"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) setPhoto({ url: URL.createObjectURL(f), name: f.name })
                }}
              />
              {photo ? (
                <div className="mt-2 flex items-center gap-3 rounded-xl border border-line bg-paper p-2">
                  <img src={photo.url} alt="Selected meter photo" className="h-10 w-10 rounded-lg object-cover" />
                  <span className="flex-1 truncate text-sm">{photo.name}</span>
                  <button
                    type="button"
                    aria-label="Remove photo"
                    onClick={() => {
                      setPhoto(null)
                      if (fileRef.current) fileRef.current.value = ''
                    }}
                    className="rounded-full p-1 hover:bg-black/5"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="photo"
                  className="mt-2 flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-line bg-paper px-4 py-3 text-sm text-ink-soft hover:border-moss/50"
                >
                  <Camera className="h-4 w-4" aria-hidden /> Snap or upload your meter
                  <ImagePlus className="ml-auto h-4 w-4" aria-hidden />
                </label>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="note" className="font-semibold">
              How are you feeling? <span className="font-normal text-ink-soft">(optional)</span>
            </label>
            <input
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. after a walk, skipped snack, feeling shaky"
              className="mt-2 w-full rounded-xl border border-line bg-paper px-4 py-3 focus:outline-none focus:ring-2 focus:ring-moss"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-full bg-moss text-paper font-semibold py-4 text-lg hover:bg-moss-deep transition"
          >
            <Droplet className="h-5 w-5" aria-hidden /> Upload reading
          </button>

          {saved && (
            <SavedCard reading={saved} onClose={() => setSaved(null)} />
          )}
        </form>

        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-3xl bg-card border border-line p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold">Today's checks</h2>
            <ul className="mt-3 space-y-2">
              {checks.map((c) => (
                <li
                  key={c.slot.id}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm ${c.state === 'done' ? 'bg-leaf-soft/60' : c.state === 'overdue' ? 'bg-amber-soft' : 'bg-paper'}`}
                >
                  <span className="font-medium">
                    {c.slot.time} · {c.slot.label}
                  </span>
                  <span
                    className={`font-semibold ${c.state === 'done' ? 'text-leaf' : c.state === 'overdue' ? 'text-amber' : 'text-ink-soft'}`}
                  >
                    {c.state === 'done'
                      ? `${c.reading!.value} mg/dL`
                      : c.state === 'overdue'
                        ? 'Overdue'
                        : 'Upcoming'}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl bg-moss-deep text-paper p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold">Your targets</h2>
            <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-white/5 p-3">
                <dt className="text-paper/65">Fasting / before meals</dt>
                <dd className="mt-1 font-semibold">
                  {patient.targets.fastingLow}–{patient.targets.fastingHigh} mg/dL
                </dd>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <dt className="text-paper/65">2h after meals</dt>
                <dd className="mt-1 font-semibold">under {patient.targets.afterMealHigh} mg/dL</dd>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <dt className="text-paper/65">Low — treat now</dt>
                <dd className="mt-1 font-semibold">under {patient.targets.low} mg/dL</dd>
              </div>
              <div className="rounded-xl bg-alarm/90 p-3">
                <dt className="text-white/80">See doctor now</dt>
                <dd className="mt-1 font-semibold">{patient.targets.urgentHigh}+ mg/dL</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>

      <section className="rounded-3xl bg-card border border-line p-5 sm:p-6">
        <h2 className="font-display text-xl font-semibold">Reading history</h2>
        <div className="mt-2 grid md:grid-cols-2 gap-x-10">
          {grouped.map(([k, list]) => (
            <div key={k} className="pt-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
                {formatDay(list[0].takenAt, now)}
              </h3>
              <ul className="divide-y divide-line">
                {list.map((r) => (
                  <ReadingRow key={r.id} reading={r} now={now} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function SavedCard({ reading, onClose }: { reading: Reading; onClose: () => void }) {
  const level = classify(reading.value, reading.context)
  const meta = levelMeta[level]
  const bg =
    meta.tone === 'good'
      ? 'bg-leaf-soft border-leaf/30'
      : meta.tone === 'warn'
        ? 'bg-amber-soft border-amber/30'
        : 'bg-alarm-soft border-alarm/30'
  return (
    <div role="status" className={`rise rounded-2xl border p-4 ${bg}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">
            Saved {reading.value} mg/dL ({mgdlToMmol(reading.value)} mmol/L) · {meta.label}
          </p>
          <p className="mt-1 text-sm text-ink-soft">{meta.advice}</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Dismiss" className="rounded-full p-1 hover:bg-black/5">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
