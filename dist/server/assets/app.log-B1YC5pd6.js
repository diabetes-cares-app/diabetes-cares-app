import { n as PageHeader, r as ReadingRow, t as LevelChip } from "./ui-Wmd-MU9N.js";
import { E as patient, b as checkSlots, d as mgdlToMmol, f as mmolToMgdl, g as todaysChecks, i as contextLabels, n as useCare, r as classify, s as formatDay, u as levelMeta, x as dayKey } from "./store-CUoaJh_8.js";
import { useMemo, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Camera, Droplet, ImagePlus, X } from "lucide-react";
// src/routes/app.log.tsx?tsr-split=component
function toLocalInput(ms) {
	const d = new Date(ms);
	d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
	return d.toISOString().slice(0, 16);
}
function guessContext(now) {
	const minutes = new Date(now).getHours() * 60 + new Date(now).getMinutes();
	let best = "random";
	let bestDiff = 75;
	for (const s of checkSlots) {
		const [h, m] = s.time.split(":").map(Number);
		const diff = Math.abs(h * 60 + m - minutes);
		if (diff < bestDiff) {
			best = s.context;
			bestDiff = diff;
		}
	}
	return best;
}
function LogReading() {
	const { now, readings, addReading } = useCare();
	const [unit, setUnit] = useState("mgdl");
	const [value, setValue] = useState("");
	const [context, setContext] = useState(() => guessContext(Date.now()));
	const [takenAt, setTakenAt] = useState(() => toLocalInput(Date.now()));
	const [note, setNote] = useState("");
	const [photo, setPhoto] = useState(null);
	const [error, setError] = useState("");
	const [saved, setSaved] = useState(null);
	const fileRef = useRef(null);
	const numeric = Number(value);
	const mg = value ? unit === "mgdl" ? Math.round(numeric) : mmolToMgdl(numeric) : null;
	const preview = mg && mg >= 20 && mg <= 600 ? classify(mg, context) : null;
	const checks = todaysChecks(readings, now);
	function submit(e) {
		e.preventDefault();
		if (!value || Number.isNaN(numeric) || mg === null || mg < 20 || mg > 600) {
			setError(unit === "mgdl" ? "Enter a reading between 20 and 600 mg/dL." : "Enter a reading between 1.1 and 33.3 mmol/L.");
			return;
		}
		const t = new Date(takenAt).getTime();
		if (Number.isNaN(t) || t > Date.now() + 3e5) {
			setError("The reading time cannot be in the future.");
			return;
		}
		setError("");
		const r = addReading({
			value: mg,
			context,
			takenAt: t,
			note: note.trim() || void 0,
			photoUrl: photo?.url
		});
		setSaved(r);
		setValue("");
		setNote("");
		setPhoto(null);
		setTakenAt(toLocalInput(Date.now()));
		if (fileRef.current) fileRef.current.value = "";
	}
	const grouped = useMemo(() => {
		const map = /* @__PURE__ */ new Map();
		for (const r of readings.slice(0, 40)) {
			const k = dayKey(r.takenAt);
			map.set(k, [...map.get(k) ?? [], r]);
		}
		return [...map.entries()];
	}, [readings]);
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				eyebrow: "Every check counts",
				title: "Log your blood sugar",
				description: "Upload each result as soon as you check. SteadySugar reviews it instantly and alerts you if you need to see your doctor."
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid lg:grid-cols-5 gap-6 items-start",
				children: [/* @__PURE__ */ jsxs("form", {
					onSubmit: submit,
					noValidate: true,
					className: "lg:col-span-3 rounded-3xl bg-card border border-line p-5 sm:p-7 space-y-6",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ jsx("label", {
									htmlFor: "value",
									className: "font-semibold",
									children: "Reading"
								}), /* @__PURE__ */ jsx("div", {
									role: "radiogroup",
									"aria-label": "Unit",
									className: "inline-flex rounded-full bg-paper border border-line p-1 text-sm",
									children: [["mgdl", "mg/dL"], ["mmol", "mmol/L"]].map(([id, label]) => /* @__PURE__ */ jsx("button", {
										type: "button",
										role: "radio",
										"aria-checked": unit === id,
										onClick: () => setUnit(id),
										className: `rounded-full px-3 py-1 font-medium ${unit === id ? "bg-ink text-paper" : "text-ink-soft"}`,
										children: label
									}, id))
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-3 flex items-end gap-3",
								children: [/* @__PURE__ */ jsx("input", {
									id: "value",
									inputMode: "decimal",
									type: "number",
									step: unit === "mgdl" ? 1 : .1,
									placeholder: unit === "mgdl" ? "112" : "6.2",
									value,
									onChange: (e) => setValue(e.target.value),
									"aria-invalid": !!error,
									"aria-describedby": error ? "value-error" : void 0,
									className: "w-full rounded-2xl border border-line bg-paper px-5 py-4 font-display text-5xl font-semibold tabular-nums focus:outline-none focus:ring-2 focus:ring-moss"
								}), /* @__PURE__ */ jsx("span", {
									className: "pb-4 text-ink-soft font-medium",
									children: unit === "mgdl" ? "mg/dL" : "mmol/L"
								})]
							}),
							preview && /* @__PURE__ */ jsxs("p", {
								className: "mt-2 flex items-center gap-2 text-sm text-ink-soft",
								children: [
									/* @__PURE__ */ jsx(LevelChip, { level: preview }),
									unit === "mmol" && `≈ ${mg} mg/dL · `,
									levelMeta[preview].advice
								]
							}),
							error && /* @__PURE__ */ jsx("p", {
								id: "value-error",
								className: "mt-2 text-sm font-medium text-alarm",
								children: error
							})
						] }),
						/* @__PURE__ */ jsxs("fieldset", { children: [/* @__PURE__ */ jsx("legend", {
							className: "font-semibold",
							children: "When did you check?"
						}), /* @__PURE__ */ jsx("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: Object.keys(contextLabels).map((c) => /* @__PURE__ */ jsx("button", {
								type: "button",
								"aria-pressed": context === c,
								onClick: () => setContext(c),
								className: `rounded-full border px-4 py-2 text-sm font-medium transition ${context === c ? "border-moss bg-moss text-paper" : "border-line hover:border-moss/50"}`,
								children: contextLabels[c]
							}, c))
						})] }),
						/* @__PURE__ */ jsxs("div", {
							className: "grid sm:grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								htmlFor: "takenAt",
								className: "font-semibold",
								children: "Time"
							}), /* @__PURE__ */ jsx("input", {
								id: "takenAt",
								type: "datetime-local",
								value: takenAt,
								onChange: (e) => setTakenAt(e.target.value),
								className: "mt-2 w-full rounded-xl border border-line bg-paper px-4 py-3 focus:outline-none focus:ring-2 focus:ring-moss"
							})] }), /* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("span", {
									className: "font-semibold",
									children: "Meter photo (optional)"
								}),
								/* @__PURE__ */ jsx("input", {
									ref: fileRef,
									id: "photo",
									type: "file",
									accept: "image/*",
									capture: "environment",
									className: "sr-only",
									onChange: (e) => {
										const f = e.target.files?.[0];
										if (f) setPhoto({
											url: URL.createObjectURL(f),
											name: f.name
										});
									}
								}),
								photo ? /* @__PURE__ */ jsxs("div", {
									className: "mt-2 flex items-center gap-3 rounded-xl border border-line bg-paper p-2",
									children: [
										/* @__PURE__ */ jsx("img", {
											src: photo.url,
											alt: "Selected meter photo",
											className: "h-10 w-10 rounded-lg object-cover"
										}),
										/* @__PURE__ */ jsx("span", {
											className: "flex-1 truncate text-sm",
											children: photo.name
										}),
										/* @__PURE__ */ jsx("button", {
											type: "button",
											"aria-label": "Remove photo",
											onClick: () => {
												setPhoto(null);
												if (fileRef.current) fileRef.current.value = "";
											},
											className: "rounded-full p-1 hover:bg-black/5",
											children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
										})
									]
								}) : /* @__PURE__ */ jsxs("label", {
									htmlFor: "photo",
									className: "mt-2 flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-line bg-paper px-4 py-3 text-sm text-ink-soft hover:border-moss/50",
									children: [
										/* @__PURE__ */ jsx(Camera, {
											className: "h-4 w-4",
											"aria-hidden": true
										}),
										" Snap or upload your meter",
										/* @__PURE__ */ jsx(ImagePlus, {
											className: "ml-auto h-4 w-4",
											"aria-hidden": true
										})
									]
								})
							] })]
						}),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
							htmlFor: "note",
							className: "font-semibold",
							children: ["How are you feeling? ", /* @__PURE__ */ jsx("span", {
								className: "font-normal text-ink-soft",
								children: "(optional)"
							})]
						}), /* @__PURE__ */ jsx("input", {
							id: "note",
							value: note,
							onChange: (e) => setNote(e.target.value),
							placeholder: "e.g. after a walk, skipped snack, feeling shaky",
							className: "mt-2 w-full rounded-xl border border-line bg-paper px-4 py-3 focus:outline-none focus:ring-2 focus:ring-moss"
						})] }),
						/* @__PURE__ */ jsxs("button", {
							type: "submit",
							className: "w-full flex items-center justify-center gap-2 rounded-full bg-moss text-paper font-semibold py-4 text-lg hover:bg-moss-deep transition",
							children: [/* @__PURE__ */ jsx(Droplet, {
								className: "h-5 w-5",
								"aria-hidden": true
							}), " Upload reading"]
						}),
						saved && /* @__PURE__ */ jsx(SavedCard, {
							reading: saved,
							onClose: () => setSaved(null)
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "lg:col-span-2 space-y-6",
					children: [/* @__PURE__ */ jsxs("section", {
						className: "rounded-3xl bg-card border border-line p-5 sm:p-6",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "font-display text-xl font-semibold",
							children: "Today's checks"
						}), /* @__PURE__ */ jsx("ul", {
							className: "mt-3 space-y-2",
							children: checks.map((c) => /* @__PURE__ */ jsxs("li", {
								className: `flex items-center justify-between rounded-xl px-3 py-2.5 text-sm ${c.state === "done" ? "bg-leaf-soft/60" : c.state === "overdue" ? "bg-amber-soft" : "bg-paper"}`,
								children: [/* @__PURE__ */ jsxs("span", {
									className: "font-medium",
									children: [
										c.slot.time,
										" · ",
										c.slot.label
									]
								}), /* @__PURE__ */ jsx("span", {
									className: `font-semibold ${c.state === "done" ? "text-leaf" : c.state === "overdue" ? "text-amber" : "text-ink-soft"}`,
									children: c.state === "done" ? `${c.reading.value} mg/dL` : c.state === "overdue" ? "Overdue" : "Upcoming"
								})]
							}, c.slot.id))
						})]
					}), /* @__PURE__ */ jsxs("section", {
						className: "rounded-3xl bg-moss-deep text-paper p-5 sm:p-6",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "font-display text-xl font-semibold",
							children: "Your targets"
						}), /* @__PURE__ */ jsxs("dl", {
							className: "mt-3 grid grid-cols-2 gap-3 text-sm",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "rounded-xl bg-white/5 p-3",
									children: [/* @__PURE__ */ jsx("dt", {
										className: "text-paper/65",
										children: "Fasting / before meals"
									}), /* @__PURE__ */ jsxs("dd", {
										className: "mt-1 font-semibold",
										children: [
											patient.targets.fastingLow,
											"–",
											patient.targets.fastingHigh,
											" mg/dL"
										]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "rounded-xl bg-white/5 p-3",
									children: [/* @__PURE__ */ jsx("dt", {
										className: "text-paper/65",
										children: "2h after meals"
									}), /* @__PURE__ */ jsxs("dd", {
										className: "mt-1 font-semibold",
										children: [
											"under ",
											patient.targets.afterMealHigh,
											" mg/dL"
										]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "rounded-xl bg-white/5 p-3",
									children: [/* @__PURE__ */ jsx("dt", {
										className: "text-paper/65",
										children: "Low — treat now"
									}), /* @__PURE__ */ jsxs("dd", {
										className: "mt-1 font-semibold",
										children: [
											"under ",
											patient.targets.low,
											" mg/dL"
										]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "rounded-xl bg-alarm/90 p-3",
									children: [/* @__PURE__ */ jsx("dt", {
										className: "text-white/80",
										children: "See doctor now"
									}), /* @__PURE__ */ jsxs("dd", {
										className: "mt-1 font-semibold",
										children: [patient.targets.urgentHigh, "+ mg/dL"]
									})]
								})
							]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "rounded-3xl bg-card border border-line p-5 sm:p-6",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "font-display text-xl font-semibold",
					children: "Reading history"
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-2 grid md:grid-cols-2 gap-x-10",
					children: grouped.map(([k, list]) => /* @__PURE__ */ jsxs("div", {
						className: "pt-3",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "text-xs font-semibold uppercase tracking-widest text-ink-soft",
							children: formatDay(list[0].takenAt, now)
						}), /* @__PURE__ */ jsx("ul", {
							className: "divide-y divide-line",
							children: list.map((r) => /* @__PURE__ */ jsx(ReadingRow, {
								reading: r,
								now
							}, r.id))
						})]
					}, k))
				})]
			})
		]
	});
}
function SavedCard({ reading, onClose }) {
	const level = classify(reading.value, reading.context);
	const meta = levelMeta[level];
	const bg = meta.tone === "good" ? "bg-leaf-soft border-leaf/30" : meta.tone === "warn" ? "bg-amber-soft border-amber/30" : "bg-alarm-soft border-alarm/30";
	return /* @__PURE__ */ jsx("div", {
		role: "status",
		className: `rise rounded-2xl border p-4 ${bg}`,
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex items-start justify-between gap-3",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("p", {
				className: "font-semibold",
				children: [
					"Saved ",
					reading.value,
					" mg/dL (",
					mgdlToMmol(reading.value),
					" mmol/L) · ",
					meta.label
				]
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-1 text-sm text-ink-soft",
				children: meta.advice
			})] }), /* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: onClose,
				"aria-label": "Dismiss",
				className: "rounded-full p-1 hover:bg-black/5",
				children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
			})]
		})
	});
}
export { LogReading as component };
