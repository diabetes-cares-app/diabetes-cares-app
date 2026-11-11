import { n as PageHeader } from "./ui-Wmd-MU9N.js";
import { C as lowTreatment, E as patient, S as foodGuide, n as useCare, r as classify, u as levelMeta, w as meals } from "./store-CUoaJh_8.js";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Check, RefreshCw, TriangleAlert, X } from "lucide-react";
// src/routes/app.meals.tsx?tsr-split=component
var slots = [
	{
		id: "breakfast",
		label: "Breakfast",
		time: "7:30 am"
	},
	{
		id: "lunch",
		label: "Lunch",
		time: "12:45 pm"
	},
	{
		id: "snack",
		label: "Afternoon snack",
		time: "4:00 pm"
	},
	{
		id: "dinner",
		label: "Dinner",
		time: "7:00 pm"
	}
];
function MealPlan() {
	const { now, readings } = useCare();
	const latest = readings[0];
	const level = latest ? classify(latest.value, latest.context) : "in-range";
	const runningHigh = level === "high" || level === "urgent-high";
	const runningLow = level === "low" || level === "urgent-low";
	const dayIndex = Math.floor(now / 864e5);
	const [offsets, setOffsets] = useState({});
	const plan = slots.map((s) => {
		const pool = meals.filter((m) => m.slot === s.id && (!runningHigh || m.lowCarb));
		const i = (dayIndex + (offsets[s.id] ?? 0)) % pool.length;
		return {
			...s,
			meal: pool[i],
			poolSize: pool.length
		};
	});
	const totalCarbs = plan.reduce((n, p) => n + p.meal.carbs, 0);
	const totalFiber = plan.reduce((n, p) => n + p.meal.fiber, 0);
	const totalProtein = plan.reduce((n, p) => n + p.meal.protein, 0);
	const budgetPct = Math.min(100, totalCarbs / patient.dailyCarbBudget * 100);
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				eyebrow: "Suggested for today",
				title: "Your meal plan",
				description: "Balanced, diabetes-friendly meals that keep carbs steady across the day. The plan adapts to your latest reading."
			}),
			runningLow && latest && /* @__PURE__ */ jsx("section", {
				role: "alert",
				className: "rounded-3xl bg-alarm-soft border border-alarm/30 p-5 sm:p-6",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ jsx(TriangleAlert, {
						className: "h-6 w-6 text-alarm shrink-0",
						"aria-hidden": true
					}), /* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsxs("p", {
							className: "font-semibold",
							children: [
								"Your last reading was ",
								latest.value,
								" mg/dL — treat the low before eating your next meal."
							]
						}),
						/* @__PURE__ */ jsx("ul", {
							className: "mt-2 list-disc pl-5 text-sm text-ink-soft",
							children: lowTreatment.map((t) => /* @__PURE__ */ jsx("li", { children: t }, t))
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-2 text-sm text-ink-soft",
							children: "Recheck after 15 minutes."
						})
					] })]
				})
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "relative overflow-hidden rounded-3xl bg-moss-deep text-paper",
				children: [
					/* @__PURE__ */ jsx("img", {
						src: "/img/meals.png",
						alt: "",
						className: "absolute inset-0 h-full w-full object-cover opacity-45"
					}),
					/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-moss-deep via-moss-deep/85 to-transparent" }),
					/* @__PURE__ */ jsxs("div", {
						className: "relative p-6 sm:p-8 max-w-xl",
						children: [
							/* @__PURE__ */ jsx("p", {
								className: "text-sm uppercase tracking-widest text-paper/70",
								children: runningHigh ? "Adjusted for a high reading" : "Steady-sugar day"
							}),
							/* @__PURE__ */ jsx("h2", {
								className: "font-display text-3xl font-semibold mt-2",
								children: runningHigh ? "Lower-carb picks until your sugar settles" : "About 40 g of carbs per meal, plenty of fiber"
							}),
							latest && /* @__PURE__ */ jsxs("p", {
								className: "mt-3 text-paper/80 text-sm",
								children: [
									"Based on your latest reading of ",
									latest.value,
									" mg/dL (",
									levelMeta[level].label.toLowerCase(),
									")."
								]
							}),
							/* @__PURE__ */ jsxs("dl", {
								className: "mt-6 grid grid-cols-3 gap-3 text-sm",
								children: [
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", {
										className: "text-paper/65",
										children: "Carbs"
									}), /* @__PURE__ */ jsxs("dd", {
										className: "font-display text-2xl font-semibold tabular-nums",
										children: [totalCarbs, /* @__PURE__ */ jsxs("span", {
											className: "text-sm font-sans text-paper/65",
											children: [
												" / ",
												patient.dailyCarbBudget,
												" g"
											]
										})]
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", {
										className: "text-paper/65",
										children: "Fiber"
									}), /* @__PURE__ */ jsxs("dd", {
										className: "font-display text-2xl font-semibold tabular-nums",
										children: [totalFiber, /* @__PURE__ */ jsx("span", {
											className: "text-sm font-sans text-paper/65",
											children: " g"
										})]
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", {
										className: "text-paper/65",
										children: "Protein"
									}), /* @__PURE__ */ jsxs("dd", {
										className: "font-display text-2xl font-semibold tabular-nums",
										children: [totalProtein, /* @__PURE__ */ jsx("span", {
											className: "text-sm font-sans text-paper/65",
											children: " g"
										})]
									})] })
								]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-4 h-2 rounded-full bg-white/15 overflow-hidden",
								role: "meter",
								"aria-label": "Share of daily carb budget",
								"aria-valuenow": Math.round(budgetPct),
								"aria-valuemin": 0,
								"aria-valuemax": 100,
								children: /* @__PURE__ */ jsx("div", {
									className: "h-full rounded-full bg-paper",
									style: { width: `${budgetPct}%` }
								})
							})
						]
					})
				]
			}),
			/* @__PURE__ */ jsx("section", {
				className: "grid sm:grid-cols-2 gap-4",
				children: plan.map((p) => /* @__PURE__ */ jsxs("article", {
					className: "rounded-3xl bg-card border border-line p-5 flex flex-col",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between text-sm",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-semibold uppercase tracking-widest text-moss",
								children: p.label
							}), /* @__PURE__ */ jsx("span", {
								className: "text-ink-soft",
								children: p.time
							})]
						}),
						/* @__PURE__ */ jsx("h3", {
							className: "mt-3 font-display text-xl font-semibold",
							children: p.meal.name
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-1 text-sm text-ink-soft flex-1",
							children: p.meal.description
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-4 flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ jsxs("span", {
									className: "rounded-full bg-mist px-2.5 py-1 text-xs font-semibold tabular-nums",
									children: [p.meal.carbs, " g carbs"]
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "rounded-full bg-mist px-2.5 py-1 text-xs font-semibold tabular-nums",
									children: [p.meal.fiber, " g fiber"]
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "rounded-full bg-mist px-2.5 py-1 text-xs font-semibold tabular-nums",
									children: [p.meal.protein, " g protein"]
								}),
								p.meal.tags.map((t) => /* @__PURE__ */ jsx("span", {
									className: "rounded-full border border-line px-2.5 py-1 text-xs text-ink-soft",
									children: t
								}, t))
							]
						}),
						p.poolSize > 1 && /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => setOffsets((o) => ({
								...o,
								[p.id]: (o[p.id] ?? 0) + 1
							})),
							className: "mt-4 self-start inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-moss/50",
							children: [/* @__PURE__ */ jsx(RefreshCw, {
								className: "h-4 w-4",
								"aria-hidden": true
							}), " Swap meal"]
						})
					]
				}, p.id))
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "grid md:grid-cols-2 gap-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "rounded-3xl bg-leaf-soft/60 border border-leaf/20 p-5 sm:p-6",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "font-display text-xl font-semibold",
						children: "Fill your plate with"
					}), /* @__PURE__ */ jsx("ul", {
						className: "mt-3 space-y-2 text-sm",
						children: foodGuide.favour.map((f) => /* @__PURE__ */ jsxs("li", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ jsx(Check, {
								className: "h-4 w-4 text-leaf mt-0.5 shrink-0",
								"aria-hidden": true
							}), f]
						}, f))
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "rounded-3xl bg-alarm-soft/50 border border-alarm/20 p-5 sm:p-6",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "font-display text-xl font-semibold",
						children: "Go easy on"
					}), /* @__PURE__ */ jsx("ul", {
						className: "mt-3 space-y-2 text-sm",
						children: foodGuide.limit.map((f) => /* @__PURE__ */ jsxs("li", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ jsx(X, {
								className: "h-4 w-4 text-alarm mt-0.5 shrink-0",
								"aria-hidden": true
							}), f]
						}, f))
					})]
				})]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-xs text-ink-soft",
				children: "Suggestions are general guidance. Your doctor or dietitian may set different carb targets for you."
			})
		]
	});
}
export { MealPlan as component };
