import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, BellRing, Droplet, LineChart, Pill, Salad, ShieldAlert } from 'lucide-react'
import { Logo } from '../components/AppShell'

export const Route = createFileRoute('/')({ component: Landing })

const features = [
  {
    icon: Droplet,
    title: 'Upload every reading',
    body: 'Log each blood sugar check in seconds — value, timing and a photo of your meter.',
  },
  {
    icon: ShieldAlert,
    title: 'Instant high-sugar alerts',
    body: 'If a reading is too high, SteadySugar tells you right away to contact your diabetes doctor.',
  },
  {
    icon: BellRing,
    title: 'Reminders that don’t give up',
    body: 'Missed a check? You’ll get a nudge every 30 minutes until your result is uploaded.',
  },
  {
    icon: Pill,
    title: 'Medication on schedule',
    body: 'Reminders at each dose time, with a simple tap to mark it taken.',
  },
  {
    icon: Salad,
    title: 'Daily meal suggestions',
    body: 'Diabetes-friendly meals that adapt when your sugar runs high or low.',
  },
  {
    icon: LineChart,
    title: 'See how you’re doing',
    body: 'A care score that climbs green when you’re on track — and turns red when you need to act.',
  },
]

function Spark({ up }: { up: boolean }) {
  const color = up ? '#1a8f4c' : '#c9302c'
  const d = up
    ? 'M0 70 C 30 66, 50 58, 80 52 S 130 40, 160 30 S 210 14, 240 8'
    : 'M0 12 C 30 16, 50 22, 80 30 S 130 44, 160 52 S 210 64, 240 72'
  return (
    <svg viewBox="0 0 240 80" className="w-full h-20" aria-hidden>
      <defs>
        <linearGradient id={`g-${up}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.3" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L240 80 L0 80 Z`} fill={`url(#g-${up})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function Landing() {
  return (
    <div className="min-h-screen bg-paper">
      <header className="mx-auto max-w-6xl px-5 sm:px-8 py-5 flex items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-2 sm:gap-6 text-sm">
          <a href="#features" className="hidden sm:inline text-ink-soft hover:text-ink">
            Features
          </a>
          <a href="#how" className="hidden sm:inline text-ink-soft hover:text-ink">
            How it works
          </a>
          <Link to="/app" className="rounded-full bg-ink text-paper font-semibold px-4 py-2 hover:bg-moss-deep">
            Open my dashboard
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-5 sm:px-8 pt-6 pb-16 lg:pt-12 grid lg:grid-cols-2 gap-10 items-center">
        <div className="rise">
          <p className="inline-flex items-center gap-2 rounded-full bg-mist px-3 py-1 text-sm font-medium text-moss">
            <span className="h-2 w-2 rounded-full bg-leaf" /> Your daily diabetes companion
          </p>
          <h1 className="mt-5 font-display text-5xl sm:text-6xl font-semibold leading-[1.02] tracking-tight">
            Steadier sugar,
            <br />
            one check at a time.
          </h1>
          <p className="mt-5 text-lg text-ink-soft max-w-lg">
            SteadySugar reminds you to check and take your medication, reviews every reading the moment you upload it,
            suggests what to eat today — and alerts you the instant you need your doctor.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/app"
              className="inline-flex items-center gap-2 rounded-full bg-moss text-paper font-semibold px-6 py-3.5 hover:bg-moss-deep"
            >
              Start today’s plan <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              to="/app/log"
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 font-semibold px-6 py-3.5 hover:bg-card"
            >
              <Droplet className="h-4 w-4" aria-hidden /> Log a reading
            </Link>
          </div>
        </div>

        <div className="relative rise" style={{ animationDelay: '120ms' }}>
          <div className="overflow-hidden rounded-[2rem] shadow-2xl shadow-moss/15">
            <img
              src="/.netlify/images?url=/img/hero.png&w=1100&fm=webp&q=80"
              srcSet="/.netlify/images?url=/img/hero.png&w=640&fm=webp&q=75 640w, /.netlify/images?url=/img/hero.png&w=1100&fm=webp&q=80 1100w"
              sizes="(min-width: 1024px) 560px, 100vw"
              alt="A balanced breakfast of oats with berries, avocado and egg beside a glucose meter"
              className="w-full aspect-[3/2] object-cover"
              width={1100}
              height={733}
            />
          </div>
          <div className="absolute -bottom-6 left-4 sm:-left-6 w-60 rounded-2xl bg-card border border-line p-4 shadow-xl">
            <p className="text-xs uppercase tracking-widest text-ink-soft">Fasting · 7:04 am</p>
            <p className="font-display text-3xl font-semibold text-leaf">
              104 <span className="text-sm font-sans text-ink-soft">mg/dL</span>
            </p>
            <p className="text-sm text-ink-soft">In range — keep it up</p>
          </div>
          <div className="absolute -top-4 right-3 sm:-right-4 flex items-center gap-2 rounded-2xl bg-ink text-paper px-4 py-3 shadow-xl text-sm">
            <BellRing className="h-4 w-4 text-amber" aria-hidden />
            Bedtime check in 15 min
          </div>
        </div>
      </section>

      <section id="features" className="bg-card border-y border-line">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold max-w-xl">
            Everything you need to stay on top of your diabetes.
          </h2>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="rounded-3xl bg-paper p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-moss text-paper">
                  <f.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-semibold text-lg">{f.title}</h3>
                <p className="mt-1 text-ink-soft">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-5 sm:px-8 py-16 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold">Know at a glance if you’re doing fine.</h2>
          <p className="mt-4 text-ink-soft text-lg">
            Every check you upload, every dose you take and every reading in range builds your daily care score. Your
            dashboard shows the direction you’re heading — so small wins are visible and problems are caught early.
          </p>
          <ol className="mt-6 space-y-3">
            {[
              'Check your sugar at the scheduled times',
              'Upload the result — SteadySugar reviews it instantly',
              'Take your medication when reminded',
              'Eat from today’s suggested meal plan',
            ].map((s, i) => (
              <li key={s} className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-mist text-moss text-sm font-bold">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-3xl bg-leaf-soft/70 border border-leaf/20 p-5">
            <p className="text-sm font-semibold uppercase tracking-widest text-leaf">Doing well</p>
            <p className="font-display text-4xl font-semibold mt-1">86</p>
            <Spark up />
            <p className="text-sm text-ink-soft">Checks done, doses taken, sugar in range.</p>
          </div>
          <div className="rounded-3xl bg-alarm-soft/70 border border-alarm/20 p-5">
            <p className="text-sm font-semibold uppercase tracking-widest text-alarm">Needs attention</p>
            <p className="font-display text-4xl font-semibold mt-1">41</p>
            <Spark up={false} />
            <p className="text-sm text-ink-soft">Missed checks and high readings — time to act.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 sm:px-8 pb-16">
        <div className="rounded-[2rem] bg-moss-deep text-paper p-8 sm:p-12 grain flex flex-wrap items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-3xl font-semibold">Ready for today’s first check?</h2>
            <p className="mt-2 text-paper/75">Your schedule, meals and reminders are waiting.</p>
          </div>
          <Link
            to="/app"
            className="inline-flex items-center gap-2 rounded-full bg-paper text-ink font-semibold px-6 py-3.5 hover:bg-mist"
          >
            Open my dashboard <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-8 text-sm text-ink-soft flex flex-wrap justify-between gap-4">
          <Logo />
          <p className="max-w-xl">
            SteadySugar supports — but does not replace — advice from your doctor. In an emergency, call your local
            emergency number.
          </p>
        </div>
      </footer>
    </div>
  )
}
