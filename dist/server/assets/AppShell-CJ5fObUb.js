import { C as lowTreatment, E as patient, c as formatDuration, l as formatTime, m as overdueCheck, n as useCare, o as formatCountdown, r as classify, u as levelMeta } from "./store-CUoaJh_8.js";
import { useEffect, useState } from "react";
import { Link, Outlet } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Activity, BellRing, Droplet, LayoutDashboard, Phone, Pill, Salad, TriangleAlert, X } from "lucide-react";
// src/components/AppShell.tsx
function Logo({ light = false }) {
	return /* @__PURE__ */ jsxs("span", {
		className: "inline-flex items-center gap-2",
		children: [/* @__PURE__ */ jsxs("svg", {
			viewBox: "0 0 32 32",
			className: "h-8 w-8",
			"aria-hidden": true,
			children: [
				/* @__PURE__ */ jsx("rect", {
					width: "32",
					height: "32",
					rx: "9",
					fill: light ? "#f6f3ec" : "#1e5a43"
				}),
				/* @__PURE__ */ jsx("path", {
					d: "M16 6c-4 5.5-7 9.2-7 12.6A7 7 0 0 0 23 18.6C23 15.2 20 11.5 16 6Z",
					fill: light ? "#1e5a43" : "#f6f3ec"
				}),
				/* @__PURE__ */ jsx("path", {
					d: "M11.5 19.5h2.6l1.4-2.6 2 4.4 1.3-1.8h1.7",
					fill: "none",
					stroke: light ? "#f6f3ec" : "#1e5a43",
					strokeWidth: "1.6",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				})
			]
		}), /* @__PURE__ */ jsx("span", {
			className: `font-display text-xl font-semibold tracking-tight ${light ? "text-paper" : "text-ink"}`,
			children: "SteadySugar"
		})]
	});
}
var nav = [
	{
		to: "/app",
		label: "Today",
		icon: LayoutDashboard,
		exact: true
	},
	{
		to: "/app/log",
		label: "Log sugar",
		icon: Droplet,
		exact: false
	},
	{
		to: "/app/meals",
		label: "Meal plan",
		icon: Salad,
		exact: false
	},
	{
		to: "/app/medications",
		label: "Medications",
		icon: Pill,
		exact: false
	}
];
function AppShell() {
	const { ready } = useCare();
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-paper lg:flex",
		children: [
			/* @__PURE__ */ jsxs("aside", {
				className: "hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-moss-deep text-paper px-5 py-6",
				children: [
					/* @__PURE__ */ jsx(Link, {
						to: "/",
						className: "mb-10",
						children: /* @__PURE__ */ jsx(Logo, { light: true })
					}),
					/* @__PURE__ */ jsx("nav", {
						className: "flex flex-col gap-1",
						children: nav.map((item) => /* @__PURE__ */ jsxs(Link, {
							to: item.to,
							activeOptions: { exact: item.exact },
							className: "flex items-center gap-3 rounded-xl px-3 py-2.5 text-paper/75 hover:bg-white/5 hover:text-paper transition",
							activeProps: { className: "!bg-white/10 !text-paper font-semibold" },
							children: [/* @__PURE__ */ jsx(item.icon, {
								className: "h-5 w-5",
								"aria-hidden": true
							}), item.label]
						}, item.to))
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-auto rounded-2xl bg-white/5 p-4 text-sm",
						children: [
							/* @__PURE__ */ jsx("p", {
								className: "text-paper/60",
								children: "Your care team"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-1 font-semibold",
								children: patient.doctor.name
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-paper/70",
								children: patient.doctor.clinic
							}),
							/* @__PURE__ */ jsxs("a", {
								href: `tel:${patient.doctor.phone.replace(/[^+\d]/g, "")}`,
								className: "mt-3 inline-flex items-center gap-2 text-paper underline underline-offset-2",
								children: [
									/* @__PURE__ */ jsx(Phone, {
										className: "h-4 w-4",
										"aria-hidden": true
									}),
									" ",
									patient.doctor.phone
								]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex-1 lg:pl-64 pb-24 lg:pb-0",
				children: [/* @__PURE__ */ jsxs("header", {
					className: "lg:hidden sticky top-0 z-20 flex items-center justify-between bg-paper/90 backdrop-blur px-4 py-3 border-b border-line",
					children: [/* @__PURE__ */ jsx(Link, {
						to: "/",
						children: /* @__PURE__ */ jsx(Logo, {})
					}), /* @__PURE__ */ jsx(Link, {
						to: "/app/log",
						className: "rounded-full bg-moss text-paper text-sm font-semibold px-4 py-2",
						children: "+ Reading"
					})]
				}), ready ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(OverdueBanner, {}), /* @__PURE__ */ jsx("main", {
					className: "mx-auto max-w-6xl px-4 sm:px-6 lg:px-10 py-6 lg:py-10",
					children: /* @__PURE__ */ jsx(Outlet, {})
				})] }) : /* @__PURE__ */ jsxs("div", {
					role: "status",
					className: "mx-auto max-w-6xl px-6 py-16 text-ink-soft",
					children: [/* @__PURE__ */ jsx(Activity, {
						className: "h-6 w-6 animate-pulse text-moss",
						"aria-hidden": true
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-3",
						children: "Loading your care plan…"
					})]
				})]
			}),
			/* @__PURE__ */ jsx("nav", {
				className: "lg:hidden fixed bottom-0 inset-x-0 z-30 grid grid-cols-4 bg-card border-t border-line",
				children: nav.map((item) => /* @__PURE__ */ jsxs(Link, {
					to: item.to,
					activeOptions: { exact: item.exact },
					className: "flex flex-col items-center gap-1 py-2.5 text-xs text-ink-soft",
					activeProps: { className: "!text-moss font-semibold" },
					children: [/* @__PURE__ */ jsx(item.icon, {
						className: "h-5 w-5",
						"aria-hidden": true
					}), item.label]
				}, item.to))
			}),
			/* @__PURE__ */ jsx(Toasts, {}),
			/* @__PURE__ */ jsx(UrgentAlert, {})
		]
	});
}
function useSecondTick() {
	const [t, setT] = useState(() => Date.now());
	useEffect(() => {
		const id = window.setInterval(() => setT(Date.now()), 1e3);
		return () => window.clearInterval(id);
	}, []);
	return t;
}
function OverdueBanner() {
	const { readings, now, nextNudgeAt, nudgeCount } = useCare();
	const tick = useSecondTick();
	const overdue = overdueCheck(readings, now);
	if (!overdue) return null;
	return /* @__PURE__ */ jsx("div", {
		role: "alert",
		className: "bg-amber-soft border-b border-amber/30 text-ink",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-6xl px-4 sm:px-6 lg:px-10 py-3 flex flex-wrap items-center gap-x-4 gap-y-2",
			children: [
				/* @__PURE__ */ jsx("span", {
					className: "flex h-9 w-9 items-center justify-center rounded-full bg-amber text-white",
					children: /* @__PURE__ */ jsx(BellRing, {
						className: "h-5 w-5",
						"aria-hidden": true
					})
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "flex-1 min-w-[14rem] text-sm",
					children: [
						/* @__PURE__ */ jsxs("strong", {
							className: "font-semibold",
							children: [
								"Your ",
								overdue.slot.label.toLowerCase(),
								" is",
								" ",
								formatDuration(now - overdue.scheduledAt),
								" overdue."
							]
						}),
						" ",
						"Check your sugar and upload the result.",
						nextNudgeAt && /* @__PURE__ */ jsxs("span", {
							className: "text-ink-soft",
							children: [
								" ",
								"Reminder ",
								nudgeCount,
								" sent · next in",
								" ",
								/* @__PURE__ */ jsx("span", {
									className: "tabular-nums font-medium",
									children: formatCountdown(nextNudgeAt - tick)
								})
							]
						})
					]
				}),
				/* @__PURE__ */ jsx(Link, {
					to: "/app/log",
					className: "rounded-full bg-ink text-paper text-sm font-semibold px-4 py-2 hover:bg-moss-deep",
					children: "Log reading now"
				})
			]
		})
	});
}
var toastTone = {
	good: "border-leaf/40 bg-leaf-soft",
	warn: "border-amber/40 bg-amber-soft",
	bad: "border-alarm/40 bg-alarm-soft",
	info: "border-moss/30 bg-mist"
};
function Toasts() {
	const { toasts, dismissToast } = useCare();
	return /* @__PURE__ */ jsx("div", {
		"aria-live": "polite",
		className: "fixed z-40 bottom-24 lg:bottom-6 right-4 left-4 sm:left-auto sm:w-96 flex flex-col gap-3",
		children: toasts.map((t) => /* @__PURE__ */ jsx("div", {
			className: `rise rounded-2xl border shadow-lg shadow-ink/5 p-4 ${toastTone[t.tone]}`,
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex-1",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "font-semibold",
							children: t.title
						}),
						t.body && /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-sm text-ink-soft",
							children: t.body
						}),
						t.action && /* @__PURE__ */ jsx(Link, {
							to: t.action.to,
							onClick: () => dismissToast(t.id),
							className: "mt-2 inline-block text-sm font-semibold text-moss underline underline-offset-2",
							children: t.action.label
						})
					]
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => dismissToast(t.id),
					className: "rounded-full p-1 text-ink-soft hover:bg-black/5",
					"aria-label": "Dismiss",
					children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
				})]
			})
		}, t.id))
	});
}
function UrgentAlert() {
	const { urgentReading, dismissUrgent } = useCare();
	if (!urgentReading) return null;
	const level = classify(urgentReading.value, urgentReading.context);
	const meta = levelMeta[level];
	const isLow = level === "urgent-low";
	const tel = patient.doctor.phone.replace(/[^+\d]/g, "");
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/60 p-4",
		children: /* @__PURE__ */ jsxs("div", {
			role: "alertdialog",
			"aria-modal": "true",
			"aria-labelledby": "urgent-title",
			"aria-describedby": "urgent-body",
			className: "rise w-full max-w-md rounded-3xl bg-card overflow-hidden shadow-2xl",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "bg-alarm text-white px-6 pt-6 pb-5",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "pulse-alarm inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/15",
							children: /* @__PURE__ */ jsx(TriangleAlert, {
								className: "h-6 w-6",
								"aria-hidden": true
							})
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "mt-4 text-sm uppercase tracking-widest text-white/80",
							children: [
								meta.label,
								" · ",
								formatTime(urgentReading.takenAt)
							]
						}),
						/* @__PURE__ */ jsxs("h2", {
							id: "urgent-title",
							className: "font-display text-3xl font-semibold mt-1",
							children: [urgentReading.value, " mg/dL"]
						})
					]
				}),
				/* @__PURE__ */ jsx("div", {
					id: "urgent-body",
					className: "px-6 py-5 space-y-3",
					children: isLow ? /* @__PURE__ */ jsxs(Fragment, { children: [
						/* @__PURE__ */ jsx("p", {
							className: "font-semibold",
							children: "Treat your low right now."
						}),
						/* @__PURE__ */ jsx("ul", {
							className: "list-disc pl-5 text-sm text-ink-soft space-y-1",
							children: lowTreatment.map((t) => /* @__PURE__ */ jsx("li", { children: t }, t))
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "text-sm text-ink-soft",
							children: [
								"Recheck in 15 minutes. If you still feel unwell, call",
								" ",
								patient.doctor.name,
								"."
							]
						})
					] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("p", {
						className: "font-semibold",
						children: [
							"Your sugar is too high. Visit or call ",
							patient.doctor.name,
							" ",
							"immediately."
						]
					}), /* @__PURE__ */ jsx("p", {
						className: "text-sm text-ink-soft",
						children: "Drink water and avoid sugary food. If you have vomiting, trouble breathing, confusion or a fruity breath smell, call emergency services now."
					})] })
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "px-6 pb-6 flex flex-col gap-2",
					children: [/* @__PURE__ */ jsxs("a", {
						href: `tel:${tel}`,
						className: "flex items-center justify-center gap-2 rounded-full bg-alarm text-white font-semibold py-3 hover:brightness-110",
						children: [
							/* @__PURE__ */ jsx(Phone, {
								className: "h-4 w-4",
								"aria-hidden": true
							}),
							" Call ",
							patient.doctor.name
						]
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: dismissUrgent,
						className: "rounded-full border border-line py-3 font-semibold hover:bg-paper",
						children: "I've contacted my doctor"
					})]
				})
			]
		})
	});
}
export { Logo as n, AppShell as t };
