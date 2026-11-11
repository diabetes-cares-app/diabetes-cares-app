import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { jsx } from "react/jsx-runtime";
// src/lib/fixtures.ts
var patient = {
	firstName: "Amara",
	diabetesType: "Type 2 diabetes",
	doctor: {
		name: "Dr. Okafor",
		clinic: "Riverside Diabetes Clinic",
		phone: "+1 (555) 014-2290"
	},
	targets: {
		fastingLow: 80,
		fastingHigh: 130,
		afterMealHigh: 180,
		urgentHigh: 250,
		low: 70,
		urgentLow: 54
	},
	dailyCarbBudget: 160
};
var checkSlots = [
	{
		id: "wake",
		label: "Fasting check",
		time: "07:00",
		context: "fasting"
	},
	{
		id: "lunch",
		label: "Before lunch",
		time: "12:30",
		context: "before-meal"
	},
	{
		id: "post",
		label: "2h after lunch",
		time: "14:30",
		context: "after-meal"
	},
	{
		id: "bed",
		label: "Bedtime check",
		time: "21:30",
		context: "bedtime"
	}
];
var medications = [
	{
		id: "metformin",
		name: "Metformin",
		dose: "500 mg tablet",
		instructions: "Take with breakfast and dinner",
		times: ["08:00", "19:00"],
		color: "#1e5a43"
	},
	{
		id: "glargine",
		name: "Insulin glargine",
		dose: "10 units",
		instructions: "Inject at the same time each night",
		times: ["21:30"],
		color: "#c4704a"
	},
	{
		id: "atorvastatin",
		name: "Atorvastatin",
		dose: "20 mg tablet",
		instructions: "Take in the evening",
		times: ["20:00"],
		color: "#b7790c"
	}
];
var meals = [
	{
		id: "b1",
		slot: "breakfast",
		name: "Steel-cut oats, berries & walnuts",
		description: "Half a cup of oats cooked in water, topped with blueberries, walnuts and cinnamon.",
		carbs: 38,
		fiber: 7,
		protein: 9,
		lowCarb: false,
		tags: ["High fiber", "Heart healthy"]
	},
	{
		id: "b2",
		slot: "breakfast",
		name: "Veggie omelette & avocado",
		description: "Two-egg omelette with spinach, peppers and onion, with a quarter avocado.",
		carbs: 9,
		fiber: 5,
		protein: 16,
		lowCarb: true,
		tags: ["Low carb", "Keeps you full"]
	},
	{
		id: "b3",
		slot: "breakfast",
		name: "Greek yogurt & chia bowl",
		description: "Plain unsweetened Greek yogurt with chia seeds, raspberries and pumpkin seeds.",
		carbs: 18,
		fiber: 8,
		protein: 20,
		lowCarb: true,
		tags: ["Protein rich"]
	},
	{
		id: "b4",
		slot: "breakfast",
		name: "Whole-grain toast with egg & tomato",
		description: "One slice of seeded whole-grain toast, a poached egg and grilled tomato.",
		carbs: 22,
		fiber: 4,
		protein: 11,
		lowCarb: true,
		tags: ["Balanced"]
	},
	{
		id: "l1",
		slot: "lunch",
		name: "Lentil & vegetable soup",
		description: "Red lentils, carrot, celery and kale, with a side salad and olive oil.",
		carbs: 34,
		fiber: 12,
		protein: 15,
		lowCarb: false,
		tags: ["High fiber", "Plant protein"]
	},
	{
		id: "l2",
		slot: "lunch",
		name: "Grilled chicken salad bowl",
		description: "Mixed greens, grilled chicken, chickpeas, cucumber and lemon-tahini dressing.",
		carbs: 24,
		fiber: 9,
		protein: 32,
		lowCarb: true,
		tags: ["Protein rich", "Low GI"]
	},
	{
		id: "l3",
		slot: "lunch",
		name: "Tuna & bean lettuce wraps",
		description: "Tuna with white beans, red onion and herbs wrapped in crisp lettuce leaves.",
		carbs: 16,
		fiber: 6,
		protein: 28,
		lowCarb: true,
		tags: ["Low carb", "Omega-3"]
	},
	{
		id: "l4",
		slot: "lunch",
		name: "Brown rice & black bean bowl",
		description: "Half a cup of brown rice, black beans, salsa, lettuce and a spoon of yogurt.",
		carbs: 45,
		fiber: 11,
		protein: 14,
		lowCarb: false,
		tags: ["High fiber"]
	},
	{
		id: "d1",
		slot: "dinner",
		name: "Baked salmon, quinoa & broccoli",
		description: "Salmon fillet with a third cup of quinoa and roasted broccoli.",
		carbs: 28,
		fiber: 6,
		protein: 34,
		lowCarb: true,
		tags: ["Omega-3", "Balanced plate"]
	},
	{
		id: "d2",
		slot: "dinner",
		name: "Turkey & vegetable stir-fry",
		description: "Lean turkey strips with bok choy, mushrooms and peppers over cauliflower rice.",
		carbs: 14,
		fiber: 5,
		protein: 30,
		lowCarb: true,
		tags: ["Low carb"]
	},
	{
		id: "d3",
		slot: "dinner",
		name: "Chickpea & spinach curry",
		description: "Tomato-based chickpea curry with spinach and a small whole-wheat chapati.",
		carbs: 42,
		fiber: 13,
		protein: 15,
		lowCarb: false,
		tags: ["Plant based", "High fiber"]
	},
	{
		id: "d4",
		slot: "dinner",
		name: "Grilled fish with greens & sweet potato",
		description: "White fish, sautéed greens and a small roasted sweet potato.",
		carbs: 30,
		fiber: 6,
		protein: 29,
		lowCarb: true,
		tags: ["Balanced plate"]
	},
	{
		id: "s1",
		slot: "snack",
		name: "Apple slices & peanut butter",
		description: "One small apple with a tablespoon of natural peanut butter.",
		carbs: 18,
		fiber: 4,
		protein: 4,
		lowCarb: true,
		tags: ["Satisfying"]
	},
	{
		id: "s2",
		slot: "snack",
		name: "Handful of almonds",
		description: "About 20 unsalted almonds.",
		carbs: 5,
		fiber: 3,
		protein: 6,
		lowCarb: true,
		tags: ["Low carb"]
	},
	{
		id: "s3",
		slot: "snack",
		name: "Hummus & veggie sticks",
		description: "Carrot, cucumber and pepper sticks with three tablespoons of hummus.",
		carbs: 12,
		fiber: 5,
		protein: 4,
		lowCarb: true,
		tags: ["Plant based"]
	}
];
var lowTreatment = [
	"Half a cup (120 ml) of fruit juice or regular soda",
	"4 glucose tablets",
	"1 tablespoon of sugar or honey"
];
var foodGuide = {
	favour: [
		"Non-starchy vegetables — leafy greens, broccoli, peppers",
		"Lean proteins — fish, chicken, eggs, tofu, beans",
		"Whole grains in small portions — oats, quinoa, brown rice",
		"Healthy fats — olive oil, nuts, seeds, avocado",
		"Water, unsweetened tea and coffee"
	],
	limit: [
		"Sugary drinks, juice and sweetened coffee",
		"White bread, white rice and pastries",
		"Fried and heavily processed foods",
		"Sweets and desserts — save for small, planned portions"
	]
};
function seeded(seed) {
	let s = seed;
	return () => {
		s = (s * 1664525 + 1013904223) % 4294967296;
		return s / 4294967296;
	};
}
function atTime(day, hhmm) {
	const [h, m] = hhmm.split(":").map(Number);
	const d = new Date(day);
	d.setHours(h, m, 0, 0);
	return d;
}
function dayKey(d) {
	const date = new Date(d);
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function startOfDay(d) {
	const date = new Date(d);
	date.setHours(0, 0, 0, 0);
	return date;
}
/**
* Builds two weeks of readings and medication doses.
* - steady: sugars drift down into range, almost every check and dose done.
* - struggling: sugars climb, checks and doses get skipped, latest reading spikes.
*
* The most recent scheduled check is always left empty, so the
* "you haven't checked yet" reminder is visible on first load.
*/
function buildHistory(scenario, now = Date.now()) {
	const rand = seeded(scenario === "steady" ? 42 : 7);
	const readings = [];
	const doses = [];
	const today = startOfDay(now);
	let lastDueTime = 0;
	for (let back = 0; back < 2 && !lastDueTime; back++) {
		const day = new Date(today);
		day.setDate(day.getDate() - back);
		for (const slot of [...checkSlots].reverse()) {
			const t = atTime(day, slot.time).getTime();
			if (t <= now) {
				lastDueTime = t;
				break;
			}
		}
	}
	for (let i = 13; i >= 0; i--) {
		const day = new Date(today);
		day.setDate(day.getDate() - i);
		const progress = (13 - i) / 13;
		for (const slot of checkSlots) {
			const scheduled = atTime(day, slot.time);
			const t = scheduled.getTime() + Math.round(rand() * 20 - 5) * 6e4;
			if (scheduled.getTime() > now || scheduled.getTime() === lastDueTime) continue;
			const skipChance = scenario === "steady" ? .04 : .1 + progress * .3;
			if (rand() < skipChance) continue;
			const base = scenario === "steady" ? 185 - progress * 70 : 135 + progress * 95;
			const contextBump = slot.context === "after-meal" ? 32 : slot.context === "fasting" ? -8 : 0;
			const noise = (rand() - .5) * (scenario === "steady" ? 34 : 60);
			const value = Math.round(base + contextBump + noise);
			readings.push({
				id: `${scenario}-${dayKey(day)}-${slot.id}`,
				value: Math.max(62, value),
				takenAt: t,
				context: slot.context
			});
		}
		for (const med of medications) for (const time of med.times) {
			const scheduled = atTime(day, time);
			if (scheduled.getTime() > now) continue;
			const missChance = scenario === "steady" ? .03 : .08 + progress * .35;
			if (rand() < missChance) continue;
			doses.push({
				medicationId: med.id,
				slotKey: `${dayKey(day)} ${time}`,
				takenAt: scheduled.getTime() + Math.round(rand() * 25) * 6e4
			});
		}
	}
	if (scenario === "struggling" && readings.length) {
		const last = readings[readings.length - 1];
		last.value = 268;
		last.note = "Felt very thirsty and tired";
	}
	readings.sort((a, b) => b.takenAt - a.takenAt);
	return {
		readings,
		doses
	};
}
// src/lib/health.ts
var levelMeta = {
	"urgent-low": {
		label: "Dangerously low",
		tone: "bad",
		advice: "Treat now with 15 g of fast-acting sugar, recheck in 15 minutes and call your doctor."
	},
	low: {
		label: "Low",
		tone: "warn",
		advice: "Have 15 g of fast-acting carbs and recheck in 15 minutes."
	},
	"in-range": {
		label: "In range",
		tone: "good",
		advice: "Nicely done — keep following your plan."
	},
	high: {
		label: "High",
		tone: "warn",
		advice: "Drink water, choose a lower-carb next meal and check again in 2 hours."
	},
	"urgent-high": {
		label: "Too high",
		tone: "bad",
		advice: `Contact ${patient.doctor.name} at ${patient.doctor.clinic} now.`
	}
};
var contextLabels = {
	fasting: "Fasting",
	"before-meal": "Before meal",
	"after-meal": "After meal",
	bedtime: "Bedtime",
	random: "Other time"
};
function classify(value, context) {
	const t = patient.targets;
	if (value < t.urgentLow) return "urgent-low";
	if (value < t.low) return "low";
	if (value >= t.urgentHigh) return "urgent-high";
	if (value > (context === "after-meal" || context === "random" || context === "bedtime" ? t.afterMealHigh : t.fastingHigh)) return "high";
	return "in-range";
}
function isUrgent(level) {
	return level === "urgent-high" || level === "urgent-low";
}
var mmolToMgdl = (mmol) => Math.round(mmol * 18.0182);
var mgdlToMmol = (mg) => Math.round(mg / 18.0182 * 10) / 10;
var REMINDER_INTERVAL_MS = 18e5;
/** A check counts as overdue this long after its scheduled time. */
var CHECK_GRACE_MS = 9e5;
/** Status of each of today's checks. A reading satisfies the nearest slot within ±90 minutes, or any later-unfilled overdue slot. */
function todaysChecks(readings, now) {
	const today = startOfDay(now);
	const todays = readings.filter((r) => dayKey(r.takenAt) === dayKey(now)).sort((a, b) => a.takenAt - b.takenAt);
	const used = /* @__PURE__ */ new Set();
	return checkSlots.map((slot, idx) => {
		const scheduledAt = atTime(today, slot.time).getTime();
		const nextAt = idx < checkSlots.length - 1 ? atTime(today, checkSlots[idx + 1].time).getTime() : Infinity;
		const reading = todays.find((r) => !used.has(r.id) && r.takenAt >= scheduledAt - 54e5 && r.takenAt < nextAt - 18e5);
		if (reading) {
			used.add(reading.id);
			return {
				slot,
				scheduledAt,
				reading,
				state: "done"
			};
		}
		return {
			slot,
			scheduledAt,
			state: now > scheduledAt + 9e5 ? "overdue" : "upcoming"
		};
	});
}
/** The oldest check that is overdue with no reading logged since it was due. */
function overdueCheck(readings, now) {
	const latest = readings[0]?.takenAt ?? 0;
	const today = startOfDay(now);
	const candidates = [];
	for (let back = 1; back >= 0; back--) {
		const day = new Date(today);
		day.setDate(day.getDate() - back);
		for (const slot of checkSlots) {
			const scheduledAt = atTime(day, slot.time).getTime();
			if (now > scheduledAt + 9e5) candidates.push({
				slot,
				scheduledAt
			});
		}
	}
	const mostRecent = candidates[candidates.length - 1];
	if (!mostRecent) return null;
	if (latest >= mostRecent.scheduledAt - 54e5) return null;
	return mostRecent;
}
function nextCheck(now) {
	const today = startOfDay(now);
	for (let add = 0; add < 2; add++) {
		const day = new Date(today);
		day.setDate(day.getDate() + add);
		for (const slot of checkSlots) {
			const at = atTime(day, slot.time).getTime();
			if (at > now) return {
				slot,
				scheduledAt: at
			};
		}
	}
	return null;
}
function todaysDoses(doses, now) {
	const today = startOfDay(now);
	const list = [];
	for (const medication of medications) for (const time of medication.times) {
		const scheduledAt = atTime(today, time).getTime();
		const slotKey = `${dayKey(today)} ${time}`;
		const taken = doses.find((d) => d.medicationId === medication.id && d.slotKey === slotKey);
		let state = "upcoming";
		if (taken) state = "taken";
		else if (now >= scheduledAt && now < scheduledAt + 108e5) state = "due";
		else if (now >= scheduledAt) state = "missed";
		list.push({
			medication,
			time,
			slotKey,
			scheduledAt,
			taken,
			state
		});
	}
	return list.sort((a, b) => a.scheduledAt - b.scheduledAt);
}
/**
* 0–100 care score for a day:
*  50% — share of readings in range
*  25% — scheduled checks completed
*  25% — scheduled medication doses taken
*/
function dailyScores(readings, doses, now, days = 14) {
	const out = [];
	const today = startOfDay(now);
	for (let i = days - 1; i >= 0; i--) {
		const date = new Date(today);
		date.setDate(date.getDate() - i);
		const key = dayKey(date);
		const dayReadings = readings.filter((r) => dayKey(r.takenAt) === key);
		const checksDue = checkSlots.filter((s) => atTime(date, s.time).getTime() + CHECK_GRACE_MS <= now).length;
		const dosesDue = medications.reduce((n, m) => n + m.times.filter((t) => atTime(date, t).getTime() <= now).length, 0);
		const dosesTaken = doses.filter((d) => d.slotKey.startsWith(key)).length;
		const inRange = dayReadings.filter((r) => classify(r.value, r.context) === "in-range").length;
		const inRangePct = dayReadings.length ? inRange / dayReadings.length : 0;
		const checksDone = Math.min(dayReadings.length, checksDue || dayReadings.length);
		const checkPct = checksDue ? checksDone / checksDue : 1;
		const dosePct = dosesDue ? Math.min(1, dosesTaken / dosesDue) : 1;
		const rangePart = dayReadings.length ? inRangePct : checkPct;
		const score = Math.round(rangePart * 50 + checkPct * 25 + dosePct * 25);
		const avg = dayReadings.length ? Math.round(dayReadings.reduce((s, r) => s + r.value, 0) / dayReadings.length) : null;
		out.push({
			key,
			date,
			score,
			inRangePct,
			checksDone,
			checksDue,
			dosesTaken,
			dosesDue,
			avg
		});
	}
	return out;
}
function trendOf(scores) {
	const last7 = scores.slice(-7);
	const prev7 = scores.slice(-14, -7);
	const n = last7.length;
	const xs = last7.map((_, i) => i);
	const ys = last7.map((s) => s.score);
	const mx = xs.reduce((a, b) => a + b, 0) / n;
	const my = ys.reduce((a, b) => a + b, 0) / n;
	const slope = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0) / (xs.reduce((s, x) => s + (x - mx) ** 2, 0) || 1);
	const weekAvg = Math.round(my);
	const previousWeekAvg = prev7.length ? Math.round(prev7.reduce((s, d) => s + d.score, 0) / prev7.length) : weekAvg;
	return {
		status: slope >= 0 && weekAvg >= 65 ? "doing-well" : "needs-attention",
		slope,
		weekAvg,
		previousWeekAvg
	};
}
function timeInRange(readings, sinceMs) {
	const recent = readings.filter((r) => r.takenAt >= sinceMs);
	if (!recent.length) return null;
	return Math.round(recent.filter((r) => classify(r.value, r.context) === "in-range").length / recent.length * 100);
}
function formatTime(ms) {
	return new Date(ms).toLocaleTimeString([], {
		hour: "numeric",
		minute: "2-digit"
	});
}
function formatDay(ms, now) {
	const k = dayKey(ms);
	if (k === dayKey(now)) return "Today";
	const y = new Date(now);
	y.setDate(y.getDate() - 1);
	if (k === dayKey(y)) return "Yesterday";
	return new Date(ms).toLocaleDateString([], {
		weekday: "short",
		month: "short",
		day: "numeric"
	});
}
function formatDuration(ms) {
	const total = Math.max(0, Math.round(ms / 6e4));
	const h = Math.floor(total / 60);
	const m = total % 60;
	if (h && m) return `${h}h ${m}m`;
	if (h) return `${h}h`;
	return `${m}m`;
}
function formatCountdown(ms) {
	const s = Math.max(0, Math.ceil(ms / 1e3));
	return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
// src/lib/store.tsx
var CareContext = createContext(null);
var TICK_MS = 15e3;
function notify(title, body) {
	if (typeof Notification === "undefined") return;
	if (Notification.permission !== "granted") return;
	try {
		new Notification(title, {
			body,
			icon: "/favicon.svg",
			tag: title
		});
	} catch {}
}
function CareProvider({ children }) {
	const [ready, setReady] = useState(false);
	const [now, setNow] = useState(0);
	const [scenario, setScenarioState] = useState("steady");
	const [readings, setReadings] = useState([]);
	const [doses, setDoses] = useState([]);
	const [urgentReading, setUrgentReading] = useState(null);
	const [toasts, setToasts] = useState([]);
	const [lastNudgeAt, setLastNudgeAt] = useState(null);
	const [nudgeCount, setNudgeCount] = useState(0);
	const [permission, setPermission] = useState("default");
	const medNudges = useRef(/* @__PURE__ */ new Map());
	const toastId = useRef(0);
	const pushToast = useCallback((t) => {
		const id = ++toastId.current;
		setToasts((list) => [...list.slice(-3), {
			...t,
			id
		}]);
		if (t.tone !== "bad") window.setTimeout(() => setToasts((list) => list.filter((x) => x.id !== id)), 9e3);
	}, []);
	const dismissToast = useCallback((id) => setToasts((list) => list.filter((x) => x.id !== id)), []);
	const seed = useCallback((s) => {
		const t = Date.now();
		const history = buildHistory(s, t);
		setReadings(history.readings);
		setDoses(history.doses);
		setNow(t);
		setLastNudgeAt(null);
		setNudgeCount(0);
		medNudges.current.clear();
		const latest = history.readings[0];
		setUrgentReading(latest && isUrgent(classify(latest.value, latest.context)) ? latest : null);
	}, []);
	useEffect(() => {
		seed("steady");
		setPermission(typeof Notification === "undefined" ? "unsupported" : Notification.permission);
		setReady(true);
		const id = window.setInterval(() => setNow(Date.now()), TICK_MS);
		return () => window.clearInterval(id);
	}, [seed]);
	const setScenario = useCallback((s) => {
		setScenarioState(s);
		seed(s);
	}, [seed]);
	const overdue = ready ? overdueCheck(readings, now) : null;
	const isOverdue = overdue !== null;
	useEffect(() => {
		if (!ready || !overdue) return;
		if (lastNudgeAt !== null && now - lastNudgeAt < 18e5) return;
		const late = formatDuration(now - overdue.scheduledAt);
		const title = "Time to check your blood sugar";
		const body = `Your ${overdue.slot.label.toLowerCase()} (${overdue.slot.time}) is ${late} overdue. Check and upload your result.`;
		pushToast({
			tone: "warn",
			title,
			body,
			action: {
				label: "Log reading",
				to: "/app/log"
			}
		});
		notify(title, body);
		setLastNudgeAt(now);
		setNudgeCount((n) => n + 1);
	}, [
		ready,
		overdue,
		now,
		lastNudgeAt,
		pushToast
	]);
	useEffect(() => {
		if (!ready) return;
		for (const dose of todaysDoses(doses, now)) {
			if (dose.state !== "due") continue;
			const key = `${dose.medication.id}|${dose.slotKey}`;
			const last = medNudges.current.get(key);
			if (last !== void 0 && now - last < 18e5) continue;
			medNudges.current.set(key, now);
			const title = `Take your ${dose.medication.name}`;
			const body = `${dose.medication.dose} · scheduled for ${dose.time}. ${dose.medication.instructions}.`;
			pushToast({
				tone: "info",
				title,
				body,
				action: {
					label: "Mark as taken",
					to: "/app/medications"
				}
			});
			notify(title, body);
		}
	}, [
		ready,
		doses,
		now,
		pushToast
	]);
	const addReading = useCallback((input) => {
		const reading = {
			id: `r-${Date.now()}`,
			...input
		};
		setReadings((list) => [reading, ...list].sort((a, b) => b.takenAt - a.takenAt));
		setNow(Date.now());
		setLastNudgeAt(null);
		setNudgeCount(0);
		const level = classify(reading.value, reading.context);
		const meta = levelMeta[level];
		if (isUrgent(level)) {
			setUrgentReading(reading);
			notify(`${meta.label}: ${reading.value} mg/dL`, meta.advice);
		} else pushToast({
			tone: meta.tone,
			title: `${reading.value} mg/dL · ${meta.label}`,
			body: `${contextLabels[reading.context]} reading saved. ${meta.advice}`
		});
		return reading;
	}, [pushToast]);
	const markDoseTaken = useCallback((medicationId, slotKey) => {
		setDoses((list) => list.some((d) => d.medicationId === medicationId && d.slotKey === slotKey) ? list : [...list, {
			medicationId,
			slotKey,
			takenAt: Date.now()
		}]);
		pushToast({
			tone: "good",
			title: "Dose recorded",
			body: "Nice work staying on schedule."
		});
	}, [pushToast]);
	const undoDose = useCallback((medicationId, slotKey) => {
		setDoses((list) => list.filter((d) => !(d.medicationId === medicationId && d.slotKey === slotKey)));
	}, []);
	const requestNotifications = useCallback(() => {
		if (typeof Notification === "undefined") return;
		Notification.requestPermission().then(setPermission);
	}, []);
	const value = useMemo(() => ({
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
		nextNudgeAt: isOverdue && lastNudgeAt !== null ? lastNudgeAt + REMINDER_INTERVAL_MS : null,
		nudgeCount,
		notificationPermission: permission,
		requestNotifications
	}), [
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
		requestNotifications
	]);
	return /* @__PURE__ */ jsx(CareContext.Provider, {
		value,
		children
	});
}
function useCare() {
	const ctx = useContext(CareContext);
	if (!ctx) throw new Error("useCare must be used inside CareProvider");
	return ctx;
}
export { lowTreatment as C, startOfDay as D, patient as E, foodGuide as S, medications as T, todaysDoses as _, dailyScores as a, checkSlots as b, formatDuration as c, mgdlToMmol as d, mmolToMgdl as f, todaysChecks as g, timeInRange as h, contextLabels as i, formatTime as l, overdueCheck as m, useCare as n, formatCountdown as o, nextCheck as p, classify as r, formatDay as s, CareProvider as t, levelMeta as u, trendOf as v, meals as w, dayKey as x, atTime as y };
