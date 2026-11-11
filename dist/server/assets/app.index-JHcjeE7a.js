import { a as StatTile, i as ScenarioSwitch, n as PageHeader, r as ReadingRow } from "./ui-Wmd-MU9N.js";
import { E as patient, _ as todaysDoses, a as dailyScores, c as formatDuration, g as todaysChecks, h as timeInRange, l as formatTime, n as useCare, p as nextCheck, r as classify, u as levelMeta, v as trendOf } from "./store-CUoaJh_8.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowDownRight, ArrowUpRight, Bell, CheckCircle2, Circle, Clock, Droplet, Pill, Salad } from "lucide-react";
import { CategoryScale, Chart, Filler, LineElement, LinearScale, PointElement, Tooltip } from "chart.js";
import { Line } from "react-chartjs-2";
// src/components/TrendChart.tsx
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);
var GOOD = "#1a8f4c";
var BAD = "#c9302c";
function TrendChart({ scores, trend, height = 260 }) {
	const color = trend.status === "doing-well" ? GOOD : BAD;
	const labels = scores.map((s) => s.date.toLocaleDateString([], {
		month: "short",
		day: "numeric"
	}));
	const summary = trend.status === "doing-well" ? `Care score trending up, averaging ${trend.weekAvg} this week.` : `Care score trending down, averaging ${trend.weekAvg} this week.`;
	return /* @__PURE__ */ jsxs("figure", {
		className: "m-0",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "relative w-full",
				style: { height },
				children: /* @__PURE__ */ jsx(Line, {
					role: "img",
					"aria-label": `Daily care score chart for the last ${scores.length} days. ${summary}`,
					data: {
						labels,
						datasets: [{
							label: "Care score",
							data: scores.map((s) => s.score),
							borderColor: color,
							borderWidth: 3,
							tension: .35,
							fill: true,
							pointRadius: scores.map((_, i) => i === scores.length - 1 ? 5 : 0),
							pointHoverRadius: 6,
							pointBackgroundColor: color,
							pointBorderColor: "#fffdf8",
							pointBorderWidth: 2,
							backgroundColor: (ctx) => {
								const { chart } = ctx;
								const area = chart.chartArea;
								if (!area) return "transparent";
								const g = chart.ctx.createLinearGradient(0, area.top, 0, area.bottom);
								g.addColorStop(0, color + "55");
								g.addColorStop(1, color + "00");
								return g;
							}
						}]
					},
					options: {
						responsive: true,
						maintainAspectRatio: false,
						animation: { duration: 700 },
						interaction: {
							mode: "index",
							intersect: false
						},
						plugins: {
							legend: { display: false },
							tooltip: {
								backgroundColor: "#14231d",
								padding: 10,
								displayColors: false,
								callbacks: { label: (item) => {
									const s = scores[item.dataIndex];
									return [
										`Care score ${s.score}/100`,
										`${s.checksDone}/${s.checksDue} checks · ${s.dosesTaken}/${s.dosesDue} doses`,
										s.avg ? `Average ${s.avg} mg/dL` : "No readings"
									];
								} }
							}
						},
						scales: {
							y: {
								min: 0,
								max: 100,
								ticks: {
									stepSize: 25,
									color: "#4a5a52",
									font: { size: 11 }
								},
								grid: { color: "#e4dfd3" },
								border: { display: false }
							},
							x: {
								ticks: {
									color: "#4a5a52",
									font: { size: 11 },
									maxRotation: 0,
									autoSkip: true,
									maxTicksLimit: 7
								},
								grid: { display: false },
								border: { display: false }
							}
						}
					}
				})
			}),
			/* @__PURE__ */ jsx("figcaption", {
				className: "sr-only",
				children: summary
			}),
			/* @__PURE__ */ jsxs("details", {
				className: "mt-3 text-sm",
				children: [/* @__PURE__ */ jsx("summary", {
					className: "cursor-pointer text-ink-soft underline underline-offset-2",
					children: "View daily scores"
				}), /* @__PURE__ */ jsxs("table", {
					className: "mt-2 w-full text-left",
					children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
						className: "text-ink-soft",
						children: [
							/* @__PURE__ */ jsx("th", {
								className: "py-1 font-medium",
								children: "Day"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "py-1 font-medium text-right",
								children: "Score"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "py-1 font-medium text-right",
								children: "Checks"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "py-1 font-medium text-right",
								children: "Doses"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "py-1 font-medium text-right",
								children: "Avg mg/dL"
							})
						]
					}) }), /* @__PURE__ */ jsx("tbody", { children: scores.map((s, i) => /* @__PURE__ */ jsxs("tr", {
						className: "border-t border-line",
						children: [
							/* @__PURE__ */ jsx("th", {
								className: "py-1 font-normal",
								children: labels[i]
							}),
							/* @__PURE__ */ jsx("td", {
								className: "py-1 text-right tabular-nums",
								children: s.score
							}),
							/* @__PURE__ */ jsxs("td", {
								className: "py-1 text-right tabular-nums",
								children: [
									s.checksDone,
									"/",
									s.checksDue
								]
							}),
							/* @__PURE__ */ jsxs("td", {
								className: "py-1 text-right tabular-nums",
								children: [
									s.dosesTaken,
									"/",
									s.dosesDue
								]
							}),
							/* @__PURE__ */ jsx("td", {
								className: "py-1 text-right tabular-nums",
								children: s.avg ?? "—"
							})
						]
					}, s.key)) })]
				})]
			})
		]
	});
}
// src/routes/app.index.tsx?tsr-split=component
function greeting(now) {
	const h = new Date(now).getHours();
	if (h < 12) return "Good morning";
	if (h < 18) return "Good afternoon";
	return "Good evening";
}
function TodayDashboard() {
	const { now, readings, doses, notificationPermission, requestNotifications } = useCare();
	const scores = dailyScores(readings, doses, now, 14).filter((s, i, all) => i < all.length - 1 || s.avg !== null);
	const trend = trendOf(scores);
	const good = trend.status === "doing-well";
	const latest = readings[0];
	const latestLevel = latest ? classify(latest.value, latest.context) : null;
	const tir = timeInRange(readings, now - 6048e5);
	const checks = todaysChecks(readings, now);
	const doseList = todaysDoses(doses, now);
	const upcoming = nextCheck(now);
	const delta = trend.weekAvg - trend.previousWeekAvg;
	const steps = [...checks.map((c) => ({
		key: c.slot.id,
		at: c.scheduledAt,
		icon: Droplet,
		title: c.slot.label,
		detail: c.reading ? `${c.reading.value} mg/dL at ${formatTime(c.reading.takenAt)}` : c.state === "overdue" ? `Overdue by ${formatDuration(now - c.scheduledAt)}` : `Due at ${formatTime(c.scheduledAt)}`,
		done: c.state === "done",
		late: c.state === "overdue",
		to: "/app/log"
	})), ...doseList.map((d) => ({
		key: d.medication.id + d.time,
		at: d.scheduledAt,
		icon: Pill,
		title: `${d.medication.name} · ${d.medication.dose}`,
		detail: d.state === "taken" ? `Taken at ${formatTime(d.taken.takenAt)}` : d.state === "missed" ? "Missed" : d.state === "due" ? "Due now" : `Due at ${formatTime(d.scheduledAt)}`,
		done: d.state === "taken",
		late: d.state === "missed" || d.state === "due",
		to: "/app/medications"
	}))].sort((a, b) => a.at - b.at);
	const doneCount = steps.filter((s) => s.done).length;
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				eyebrow: new Date(now).toLocaleDateString([], {
					weekday: "long",
					month: "long",
					day: "numeric"
				}),
				title: `${greeting(now)}, ${patient.firstName}`,
				action: /* @__PURE__ */ jsx(ScenarioSwitch, {})
			}),
			/* @__PURE__ */ jsxs("section", {
				"aria-labelledby": "trend-title",
				className: `rise rounded-3xl border p-5 sm:p-7 ${good ? "bg-leaf-soft/60 border-leaf/25" : "bg-alarm-soft/70 border-alarm/25"}`,
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-start justify-between gap-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-start gap-4",
							children: [/* @__PURE__ */ jsx("span", {
								className: `flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white ${good ? "bg-leaf" : "bg-alarm"}`,
								children: good ? /* @__PURE__ */ jsx(ArrowUpRight, {
									className: "h-7 w-7",
									"aria-hidden": true
								}) : /* @__PURE__ */ jsx(ArrowDownRight, {
									className: "h-7 w-7",
									"aria-hidden": true
								})
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
								className: `text-sm font-semibold uppercase tracking-widest ${good ? "text-leaf" : "text-alarm"}`,
								children: good ? "You're doing well" : "Needs attention"
							}), /* @__PURE__ */ jsx("h2", {
								id: "trend-title",
								className: "font-display text-2xl sm:text-3xl font-semibold mt-1 max-w-xl",
								children: good ? "Your sugar and routine are improving week over week." : "Your sugar is climbing and care steps are being missed."
							})] })]
						}), /* @__PURE__ */ jsxs("div", {
							className: "text-right",
							children: [
								/* @__PURE__ */ jsx("p", {
									className: "text-sm text-ink-soft",
									children: "Care score this week"
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "font-display text-5xl font-semibold tabular-nums",
									children: [trend.weekAvg, /* @__PURE__ */ jsx("span", {
										className: "text-xl text-ink-soft",
										children: "/100"
									})]
								}),
								/* @__PURE__ */ jsxs("p", {
									className: `text-sm font-semibold ${delta >= 0 ? "text-leaf" : "text-alarm"}`,
									children: [
										delta >= 0 ? "▲" : "▼",
										" ",
										Math.abs(delta),
										" vs last week"
									]
								})
							]
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-6 rounded-2xl bg-card/80 p-3 sm:p-4",
						children: /* @__PURE__ */ jsx(TrendChart, {
							scores,
							trend
						})
					}),
					!good && /* @__PURE__ */ jsxs("p", {
						className: "mt-4 text-sm",
						children: [
							/* @__PURE__ */ jsx("strong", { children: "What helps:" }),
							" check at every scheduled time, take each dose on time, and choose the lower-carb picks in your",
							" ",
							/* @__PURE__ */ jsx(Link, {
								to: "/app/meals",
								className: "underline font-semibold",
								children: "meal plan"
							}),
							". If readings stay above ",
							patient.targets.urgentHigh,
							" mg/dL, see",
							" ",
							patient.doctor.name,
							"."
						]
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4",
				children: [
					/* @__PURE__ */ jsx(StatTile, {
						label: "Latest reading",
						value: latest ? `${latest.value}` : "—",
						unit: "mg/dL",
						tone: latestLevel ? levelMeta[latestLevel].tone : void 0,
						foot: latest && latestLevel ? `${levelMeta[latestLevel].label} · ${formatTime(latest.takenAt)}` : "No readings yet"
					}),
					/* @__PURE__ */ jsx(StatTile, {
						label: "Time in range · 7 days",
						value: tir === null ? "—" : `${tir}`,
						unit: "%",
						tone: tir === null ? void 0 : tir >= 70 ? "good" : tir >= 50 ? "warn" : "bad",
						foot: "Goal: 70% or more"
					}),
					/* @__PURE__ */ jsx(StatTile, {
						label: "Checks today",
						value: `${checks.filter((c) => c.state === "done").length}/${checks.length}`,
						tone: checks.some((c) => c.state === "overdue") ? "warn" : "good",
						foot: upcoming ? `Next: ${upcoming.slot.label} at ${formatTime(upcoming.scheduledAt)}` : ""
					}),
					/* @__PURE__ */ jsx(StatTile, {
						label: "Doses today",
						value: `${doseList.filter((d) => d.state === "taken").length}/${doseList.length}`,
						tone: doseList.some((d) => d.state === "missed") ? "bad" : "good",
						foot: doseList.find((d) => d.state === "due" || d.state === "upcoming") ? `Next: ${doseList.find((d) => d.state === "due" || d.state === "upcoming").medication.name}` : "All doses handled"
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid lg:grid-cols-5 gap-6",
				children: [/* @__PURE__ */ jsxs("section", {
					className: "lg:col-span-3 rounded-3xl bg-card border border-line p-5 sm:p-6",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-baseline justify-between",
							children: [/* @__PURE__ */ jsx("h2", {
								className: "font-display text-xl font-semibold",
								children: "Today's care steps"
							}), /* @__PURE__ */ jsxs("p", {
								className: "text-sm text-ink-soft tabular-nums",
								children: [
									doneCount,
									" of ",
									steps.length,
									" done"
								]
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-3 h-2 rounded-full bg-mist overflow-hidden",
							children: /* @__PURE__ */ jsx("div", {
								className: "h-full rounded-full bg-moss transition-all",
								style: { width: `${doneCount / steps.length * 100}%` }
							})
						}),
						/* @__PURE__ */ jsx("ol", {
							className: "mt-4 divide-y divide-line",
							children: steps.map((s) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
								to: s.to,
								className: "flex items-center gap-3 py-3 group",
								children: [
									s.done ? /* @__PURE__ */ jsx(CheckCircle2, {
										className: "h-5 w-5 text-leaf shrink-0",
										"aria-label": "Done"
									}) : s.late ? /* @__PURE__ */ jsx(Clock, {
										className: "h-5 w-5 text-amber shrink-0",
										"aria-label": "Needs action"
									}) : /* @__PURE__ */ jsx(Circle, {
										className: "h-5 w-5 text-line shrink-0",
										"aria-label": "Upcoming"
									}),
									/* @__PURE__ */ jsx(s.icon, {
										className: "h-4 w-4 text-ink-soft shrink-0",
										"aria-hidden": true
									}),
									/* @__PURE__ */ jsxs("span", {
										className: "flex-1 min-w-0",
										children: [/* @__PURE__ */ jsx("span", {
											className: `block font-medium ${s.done ? "text-ink-soft line-through decoration-line" : ""}`,
											children: s.title
										}), /* @__PURE__ */ jsx("span", {
											className: `block text-sm ${s.late && !s.done ? "text-amber font-medium" : "text-ink-soft"}`,
											children: s.detail
										})]
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-sm text-ink-soft tabular-nums",
										children: formatTime(s.at)
									})
								]
							}) }, s.key))
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "lg:col-span-2 space-y-6",
					children: [
						/* @__PURE__ */ jsxs("section", {
							className: "rounded-3xl bg-card border border-line p-5 sm:p-6",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-baseline justify-between",
								children: [/* @__PURE__ */ jsx("h2", {
									className: "font-display text-xl font-semibold",
									children: "Recent readings"
								}), /* @__PURE__ */ jsx(Link, {
									to: "/app/log",
									className: "text-sm font-semibold text-moss underline underline-offset-2",
									children: "See all"
								})]
							}), /* @__PURE__ */ jsx("ul", {
								className: "mt-3 divide-y divide-line",
								children: readings.slice(0, 5).map((r) => /* @__PURE__ */ jsx(ReadingRow, {
									reading: r,
									now
								}, r.id))
							})]
						}),
						/* @__PURE__ */ jsxs(Link, {
							to: "/app/meals",
							className: "flex items-center gap-4 rounded-3xl bg-moss text-paper p-5 hover:bg-moss-deep transition",
							children: [/* @__PURE__ */ jsx(Salad, {
								className: "h-8 w-8 shrink-0",
								"aria-hidden": true
							}), /* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("span", {
								className: "block font-semibold",
								children: "Today's meal plan is ready"
							}), /* @__PURE__ */ jsx("span", {
								className: "block text-sm text-paper/75",
								children: latestLevel === "high" || latestLevel === "urgent-high" ? "Adjusted to lower-carb picks while your sugar is high." : "Balanced picks for steady sugar all day."
							})] })]
						}),
						notificationPermission !== "granted" && notificationPermission !== "unsupported" && /* @__PURE__ */ jsx("section", {
							className: "rounded-3xl border border-dashed border-moss/40 p-5",
							children: /* @__PURE__ */ jsxs("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ jsx(Bell, {
									className: "h-5 w-5 text-moss mt-0.5",
									"aria-hidden": true
								}), /* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("p", {
										className: "font-semibold",
										children: "Turn on reminder alerts"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-sm text-ink-soft mt-1",
										children: "Get a device notification for every check and dose, and every 30 minutes while a check is overdue."
									}),
									/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: requestNotifications,
										disabled: notificationPermission === "denied",
										className: "mt-3 rounded-full bg-ink text-paper text-sm font-semibold px-4 py-2 disabled:opacity-50",
										children: notificationPermission === "denied" ? "Blocked in browser settings" : "Enable notifications"
									})
								] })]
							})
						})
					]
				})]
			})
		]
	});
}
export { TodayDashboard as component };
