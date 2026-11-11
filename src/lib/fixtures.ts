/**
 * Sample data for SteadySugar's first milestone.
 *
 * Everything the screens show comes from this module so that a later
 * milestone can swap it for real persistence (Netlify Database) without
 * touching the UI. Readings and doses are generated relative to "now"
 * with a seeded random generator, so the demo always looks current.
 */

export type ReadingContext =
  | 'fasting'
  | 'before-meal'
  | 'after-meal'
  | 'bedtime'
  | 'random'

export interface Reading {
  id: string
  /** Blood glucose in mg/dL (mmol/L input is converted on entry). */
  value: number
  takenAt: number
  context: ReadingContext
  note?: string
  /** Object URL for an attached meter photo (in-memory for now). */
  photoUrl?: string
}

export interface CheckSlot {
  id: string
  label: string
  /** 24h time "HH:MM". */
  time: string
  context: ReadingContext
}

export interface Medication {
  id: string
  name: string
  dose: string
  instructions: string
  /** Daily dose times, "HH:MM". */
  times: string[]
  color: string
}

export interface DoseLog {
  medicationId: string
  /** Scheduled time key "YYYY-MM-DD HH:MM". */
  slotKey: string
  takenAt: number
}

export interface Meal {
  id: string
  slot: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  name: string
  description: string
  carbs: number
  fiber: number
  protein: number
  /** Suitable while sugar is running high (≤ 30 g carbs, high fiber). */
  lowCarb: boolean
  tags: string[]
}

export interface Patient {
  firstName: string
  diabetesType: string
  doctor: { name: string; clinic: string; phone: string }
  targets: {
    fastingLow: number
    fastingHigh: number
    afterMealHigh: number
    /** At or above this, the app tells the patient to see their doctor now. */
    urgentHigh: number
    low: number
    urgentLow: number
  }
  dailyCarbBudget: number
}

export type Scenario = 'steady' | 'struggling'

export const patient: Patient = {
  firstName: 'Amara',
  diabetesType: 'Type 2 diabetes',
  doctor: {
    name: 'Dr. Okafor',
    clinic: 'Riverside Diabetes Clinic',
    phone: '+1 (555) 014-2290',
  },
  targets: {
    fastingLow: 80,
    fastingHigh: 130,
    afterMealHigh: 180,
    urgentHigh: 250,
    low: 70,
    urgentLow: 54,
  },
  dailyCarbBudget: 160,
}

export const checkSlots: CheckSlot[] = [
  { id: 'wake', label: 'Fasting check', time: '07:00', context: 'fasting' },
  { id: 'lunch', label: 'Before lunch', time: '12:30', context: 'before-meal' },
  { id: 'post', label: '2h after lunch', time: '14:30', context: 'after-meal' },
  { id: 'bed', label: 'Bedtime check', time: '21:30', context: 'bedtime' },
]

export const medications: Medication[] = [
  {
    id: 'metformin',
    name: 'Metformin',
    dose: '500 mg tablet',
    instructions: 'Take with breakfast and dinner',
    times: ['08:00', '19:00'],
    color: '#1e5a43',
  },
  {
    id: 'glargine',
    name: 'Insulin glargine',
    dose: '10 units',
    instructions: 'Inject at the same time each night',
    times: ['21:30'],
    color: '#c4704a',
  },
  {
    id: 'atorvastatin',
    name: 'Atorvastatin',
    dose: '20 mg tablet',
    instructions: 'Take in the evening',
    times: ['20:00'],
    color: '#b7790c',
  },
]

export const meals: Meal[] = [
  // Breakfast
  {
    id: 'b1',
    slot: 'breakfast',
    name: 'Steel-cut oats, berries & walnuts',
    description: 'Half a cup of oats cooked in water, topped with blueberries, walnuts and cinnamon.',
    carbs: 38,
    fiber: 7,
    protein: 9,
    lowCarb: false,
    tags: ['High fiber', 'Heart healthy'],
  },
  {
    id: 'b2',
    slot: 'breakfast',
    name: 'Veggie omelette & avocado',
    description: 'Two-egg omelette with spinach, peppers and onion, with a quarter avocado.',
    carbs: 9,
    fiber: 5,
    protein: 16,
    lowCarb: true,
    tags: ['Low carb', 'Keeps you full'],
  },
  {
    id: 'b3',
    slot: 'breakfast',
    name: 'Greek yogurt & chia bowl',
    description: 'Plain unsweetened Greek yogurt with chia seeds, raspberries and pumpkin seeds.',
    carbs: 18,
    fiber: 8,
    protein: 20,
    lowCarb: true,
    tags: ['Protein rich'],
  },
  {
    id: 'b4',
    slot: 'breakfast',
    name: 'Whole-grain toast with egg & tomato',
    description: 'One slice of seeded whole-grain toast, a poached egg and grilled tomato.',
    carbs: 22,
    fiber: 4,
    protein: 11,
    lowCarb: true,
    tags: ['Balanced'],
  },
  // Lunch
  {
    id: 'l1',
    slot: 'lunch',
    name: 'Lentil & vegetable soup',
    description: 'Red lentils, carrot, celery and kale, with a side salad and olive oil.',
    carbs: 34,
    fiber: 12,
    protein: 15,
    lowCarb: false,
    tags: ['High fiber', 'Plant protein'],
  },
  {
    id: 'l2',
    slot: 'lunch',
    name: 'Grilled chicken salad bowl',
    description: 'Mixed greens, grilled chicken, chickpeas, cucumber and lemon-tahini dressing.',
    carbs: 24,
    fiber: 9,
    protein: 32,
    lowCarb: true,
    tags: ['Protein rich', 'Low GI'],
  },
  {
    id: 'l3',
    slot: 'lunch',
    name: 'Tuna & bean lettuce wraps',
    description: 'Tuna with white beans, red onion and herbs wrapped in crisp lettuce leaves.',
    carbs: 16,
    fiber: 6,
    protein: 28,
    lowCarb: true,
    tags: ['Low carb', 'Omega-3'],
  },
  {
    id: 'l4',
    slot: 'lunch',
    name: 'Brown rice & black bean bowl',
    description: 'Half a cup of brown rice, black beans, salsa, lettuce and a spoon of yogurt.',
    carbs: 45,
    fiber: 11,
    protein: 14,
    lowCarb: false,
    tags: ['High fiber'],
  },
  // Dinner
  {
    id: 'd1',
    slot: 'dinner',
    name: 'Baked salmon, quinoa & broccoli',
    description: 'Salmon fillet with a third cup of quinoa and roasted broccoli.',
    carbs: 28,
    fiber: 6,
    protein: 34,
    lowCarb: true,
    tags: ['Omega-3', 'Balanced plate'],
  },
  {
    id: 'd2',
    slot: 'dinner',
    name: 'Turkey & vegetable stir-fry',
    description: 'Lean turkey strips with bok choy, mushrooms and peppers over cauliflower rice.',
    carbs: 14,
    fiber: 5,
    protein: 30,
    lowCarb: true,
    tags: ['Low carb'],
  },
  {
    id: 'd3',
    slot: 'dinner',
    name: 'Chickpea & spinach curry',
    description: 'Tomato-based chickpea curry with spinach and a small whole-wheat chapati.',
    carbs: 42,
    fiber: 13,
    protein: 15,
    lowCarb: false,
    tags: ['Plant based', 'High fiber'],
  },
  {
    id: 'd4',
    slot: 'dinner',
    name: 'Grilled fish with greens & sweet potato',
    description: 'White fish, sautéed greens and a small roasted sweet potato.',
    carbs: 30,
    fiber: 6,
    protein: 29,
    lowCarb: true,
    tags: ['Balanced plate'],
  },
  // Snacks
  {
    id: 's1',
    slot: 'snack',
    name: 'Apple slices & peanut butter',
    description: 'One small apple with a tablespoon of natural peanut butter.',
    carbs: 18,
    fiber: 4,
    protein: 4,
    lowCarb: true,
    tags: ['Satisfying'],
  },
  {
    id: 's2',
    slot: 'snack',
    name: 'Handful of almonds',
    description: 'About 20 unsalted almonds.',
    carbs: 5,
    fiber: 3,
    protein: 6,
    lowCarb: true,
    tags: ['Low carb'],
  },
  {
    id: 's3',
    slot: 'snack',
    name: 'Hummus & veggie sticks',
    description: 'Carrot, cucumber and pepper sticks with three tablespoons of hummus.',
    carbs: 12,
    fiber: 5,
    protein: 4,
    lowCarb: true,
    tags: ['Plant based'],
  },
]

export const lowTreatment = [
  'Half a cup (120 ml) of fruit juice or regular soda',
  '4 glucose tablets',
  '1 tablespoon of sugar or honey',
]

export const foodGuide = {
  favour: [
    'Non-starchy vegetables — leafy greens, broccoli, peppers',
    'Lean proteins — fish, chicken, eggs, tofu, beans',
    'Whole grains in small portions — oats, quinoa, brown rice',
    'Healthy fats — olive oil, nuts, seeds, avocado',
    'Water, unsweetened tea and coffee',
  ],
  limit: [
    'Sugary drinks, juice and sweetened coffee',
    'White bread, white rice and pastries',
    'Fried and heavily processed foods',
    'Sweets and desserts — save for small, planned portions',
  ],
}

// ---------------------------------------------------------------------------
// Generated history
// ---------------------------------------------------------------------------

const HISTORY_DAYS = 14

function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

export function atTime(day: Date, hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number)
  const d = new Date(day)
  d.setHours(h, m, 0, 0)
  return d
}

export function dayKey(d: Date | number) {
  const date = new Date(d)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

export function startOfDay(d: Date | number) {
  const date = new Date(d)
  date.setHours(0, 0, 0, 0)
  return date
}

/**
 * Builds two weeks of readings and medication doses.
 * - steady: sugars drift down into range, almost every check and dose done.
 * - struggling: sugars climb, checks and doses get skipped, latest reading spikes.
 *
 * The most recent scheduled check is always left empty, so the
 * "you haven't checked yet" reminder is visible on first load.
 */
export function buildHistory(scenario: Scenario, now = Date.now()) {
  const rand = seeded(scenario === 'steady' ? 42 : 7)
  const readings: Reading[] = []
  const doses: DoseLog[] = []
  const today = startOfDay(now)

  // Find the most recent slot whose time has passed.
  let lastDueTime = 0
  for (let back = 0; back < 2 && !lastDueTime; back++) {
    const day = new Date(today)
    day.setDate(day.getDate() - back)
    for (const slot of [...checkSlots].reverse()) {
      const t = atTime(day, slot.time).getTime()
      if (t <= now) {
        lastDueTime = t
        break
      }
    }
  }

  for (let i = HISTORY_DAYS - 1; i >= 0; i--) {
    const day = new Date(today)
    day.setDate(day.getDate() - i)
    const progress = (HISTORY_DAYS - 1 - i) / (HISTORY_DAYS - 1) // 0 → 1

    for (const slot of checkSlots) {
      const scheduled = atTime(day, slot.time)
      const t = scheduled.getTime() + Math.round(rand() * 20 - 5) * 60_000
      if (scheduled.getTime() > now || scheduled.getTime() === lastDueTime)
        continue
      const skipChance = scenario === 'steady' ? 0.04 : 0.1 + progress * 0.3
      if (rand() < skipChance) continue

      const base =
        scenario === 'steady'
          ? 185 - progress * 70 // ~185 → ~115
          : 135 + progress * 95 // ~135 → ~230
      const contextBump =
        slot.context === 'after-meal' ? 32 : slot.context === 'fasting' ? -8 : 0
      const noise = (rand() - 0.5) * (scenario === 'steady' ? 34 : 60)
      const value = Math.round(base + contextBump + noise)
      readings.push({
        id: `${scenario}-${dayKey(day)}-${slot.id}`,
        value: Math.max(62, value),
        takenAt: t,
        context: slot.context,
      })
    }

    for (const med of medications) {
      for (const time of med.times) {
        const scheduled = atTime(day, time)
        if (scheduled.getTime() > now) continue
        const missChance = scenario === 'steady' ? 0.03 : 0.08 + progress * 0.35
        if (rand() < missChance) continue
        doses.push({
          medicationId: med.id,
          slotKey: `${dayKey(day)} ${time}`,
          takenAt: scheduled.getTime() + Math.round(rand() * 25) * 60_000,
        })
      }
    }
  }

  // In the struggling scenario, the latest logged reading is a dangerous spike.
  if (scenario === 'struggling' && readings.length) {
    const last = readings[readings.length - 1]
    last.value = 268
    last.note = 'Felt very thirsty and tired'
  }

  readings.sort((a, b) => b.takenAt - a.takenAt)
  return { readings, doses }
}
