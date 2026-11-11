import { n as PageHeader } from "./ui-Wmd-MU9N.js";
import { D as startOfDay, T as medications, _ as todaysDoses, l as formatTime, n as useCare, x as dayKey, y as atTime } from "./store-CUoaJh_8.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { BellRing, CheckCircle2, Clock, Pill, Undo2 } from "lucide-react";
// src/routes/app.medications.tsx?tsr-split=component
var stateStyle = {
	taken: "bg-leaf-soft/60 border-leaf/25",
	due: "bg-amber-soft border-amber/40 ring-2 ring-amber/30",
	missed: "bg-alarm-soft/60 border-alarm/25",
	upcoming: "bg-card border-line"
};
function Medications() {
	const { now, doses, markDoseTaken, undoDose } = useCare();
	const today = todaysDoses(doses, now);
	const adherence = medications.map((m) => {
		const days = Array.from({ length: 7 }, (_, i) => {
			const d = startOfDay(now);
			d.setDate(d.getDate() - (6 - i));
			const due = m.times.filter((t) => atTime(d, t).getTime() <= now);
			const taken = due.filter((t) => doses.some((x) => x.medicationId === m.id && x.slotKey === `${dayKey(d)} ${t}`)).length;
			return {
				key: dayKey(d),
				date: d,
				due: due.length,
				taken
			};
		});
		const due = days.reduce((n, d) => n + d.due, 0);
		const taken = days.reduce((n, d) => n + d.taken, 0);
		return {
			med: m,
			days,
			pct: due ? Math.round(taken / due * 100) : 100
		};
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				eyebrow: "On time, every time",
				title: "Medications",
				description: "You'll get a reminder at each scheduled time, repeated every 30 minutes until you mark the dose as taken."
			}),
			/* @__PURE__ */ jsxs("section", {
				"aria-labelledby": "today-doses",
				children: [/* @__PURE__ */ jsx("h2", {
					id: "today-doses",
					className: "font-display text-xl font-semibold",
					children: "Today's doses"
				}), /* @__PURE__ */ jsx("ol", {
					className: "mt-4 grid sm:grid-cols-2 gap-3",
					children: today.map((d) => /* @__PURE__ */ jsxs("li", {
						className: `rounded-2xl border p-4 ${stateStyle[d.state]}`,
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ jsx("span", {
								className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white",
								style: { background: d.medication.color },
								children: /* @__PURE__ */ jsx(Pill, {
									className: "h-5 w-5",
									"aria-hidden": true
								})
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex-1 min-w-0",
								children: [
									/* @__PURE__ */ jsxs("p", {
										className: "font-semibold",
										children: [
											d.medication.name,
											" ",
											/* @__PURE__ */ jsxs("span", {
												className: "font-normal text-ink-soft",
												children: ["· ", d.medication.dose]
											})
										]
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-sm text-ink-soft",
										children: d.medication.instructions
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-2 flex items-center gap-1.5 text-sm font-medium",
										children: d.state === "taken" ? /* @__PURE__ */ jsxs(Fragment, { children: [
											/* @__PURE__ */ jsx(CheckCircle2, {
												className: "h-4 w-4 text-leaf",
												"aria-hidden": true
											}),
											"Taken at ",
											formatTime(d.taken.takenAt)
										] }) : d.state === "due" ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(BellRing, {
											className: "h-4 w-4 text-amber",
											"aria-hidden": true
										}), /* @__PURE__ */ jsxs("span", {
											className: "text-amber",
											children: ["Due now · scheduled ", formatTime(d.scheduledAt)]
										})] }) : d.state === "missed" ? /* @__PURE__ */ jsxs("span", {
											className: "text-alarm",
											children: ["Missed · scheduled ", formatTime(d.scheduledAt)]
										}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Clock, {
											className: "h-4 w-4 text-ink-soft",
											"aria-hidden": true
										}), /* @__PURE__ */ jsxs("span", {
											className: "text-ink-soft",
											children: ["Scheduled ", formatTime(d.scheduledAt)]
										})] })
									})
								]
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: "mt-3 flex justify-end",
							children: d.state === "taken" ? /* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => undoDose(d.medication.id, d.slotKey),
								className: "inline-flex items-center gap-1.5 text-sm text-ink-soft underline underline-offset-2",
								children: [/* @__PURE__ */ jsx(Undo2, {
									className: "h-4 w-4",
									"aria-hidden": true
								}), " Undo"]
							}) : /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => markDoseTaken(d.medication.id, d.slotKey),
								className: `rounded-full px-4 py-2 text-sm font-semibold ${d.state === "upcoming" ? "border border-line hover:border-moss/50" : "bg-moss text-paper hover:bg-moss-deep"}`,
								children: d.state === "missed" ? "I took it late" : d.state === "upcoming" ? "Taken early" : "Mark as taken"
							})
						})]
					}, d.slotKey + d.medication.id))
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "rounded-3xl bg-card border border-line p-5 sm:p-6",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "font-display text-xl font-semibold",
					children: "Last 7 days"
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-4 space-y-5",
					children: adherence.map(({ med, days, pct }) => /* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center gap-4",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "w-48",
								children: [/* @__PURE__ */ jsx("p", {
									className: "font-semibold",
									children: med.name
								}), /* @__PURE__ */ jsx("p", {
									className: "text-sm text-ink-soft",
									children: med.times.join(" · ")
								})]
							}),
							/* @__PURE__ */ jsx("ul", {
								className: "flex gap-1.5",
								"aria-label": `${med.name} daily adherence`,
								children: days.map((d) => {
									const full = d.due > 0 && d.taken === d.due;
									const none = d.due > 0 && d.taken === 0;
									return /* @__PURE__ */ jsxs("li", {
										title: `${d.date.toLocaleDateString([], {
											weekday: "short",
											day: "numeric"
										})}: ${d.taken}/${d.due}`,
										className: `flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold ${d.due === 0 ? "bg-paper text-ink-soft" : full ? "bg-leaf text-white" : none ? "bg-alarm text-white" : "bg-amber text-white"}`,
										children: [/* @__PURE__ */ jsxs("span", {
											className: "sr-only",
											children: [
												d.date.toLocaleDateString(),
												": ",
												d.taken,
												" of ",
												d.due
											]
										}), /* @__PURE__ */ jsx("span", {
											"aria-hidden": true,
											children: d.date.toLocaleDateString([], { weekday: "narrow" })
										})]
									}, d.key);
								})
							}),
							/* @__PURE__ */ jsxs("p", {
								className: `ml-auto font-display text-2xl font-semibold tabular-nums ${pct >= 90 ? "text-leaf" : pct >= 70 ? "text-amber" : "text-alarm"}`,
								children: [pct, "%"]
							})
						]
					}, med.id))
				})]
			})
		]
	});
}
export { Medications as component };
