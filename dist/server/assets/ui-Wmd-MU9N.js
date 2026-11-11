import { i as contextLabels, l as formatTime, n as useCare, r as classify, s as formatDay, u as levelMeta } from "./store-CUoaJh_8.js";
import { jsx, jsxs } from "react/jsx-runtime";
// src/components/ui.tsx
var toneText = {
	good: "text-leaf",
	warn: "text-amber",
	bad: "text-alarm"
};
var toneChip = {
	good: "bg-leaf-soft text-leaf",
	warn: "bg-amber-soft text-amber",
	bad: "bg-alarm-soft text-alarm"
};
function PageHeader({ eyebrow, title, description, action }) {
	return /* @__PURE__ */ jsxs("header", {
		className: "flex flex-wrap items-end justify-between gap-4",
		children: [/* @__PURE__ */ jsxs("div", { children: [
			eyebrow && /* @__PURE__ */ jsx("p", {
				className: "text-sm font-medium text-ink-soft",
				children: eyebrow
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "font-display text-3xl sm:text-4xl font-semibold tracking-tight mt-1",
				children: title
			}),
			description && /* @__PURE__ */ jsx("p", {
				className: "mt-2 text-ink-soft max-w-2xl",
				children: description
			})
		] }), action]
	});
}
function StatTile({ label, value, unit, tone, foot }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-2xl bg-card border border-line p-4 sm:p-5",
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "text-sm text-ink-soft",
				children: label
			}),
			/* @__PURE__ */ jsxs("p", {
				className: `mt-1 font-display text-3xl font-semibold tabular-nums ${tone ? toneText[tone] : ""}`,
				children: [value, unit && /* @__PURE__ */ jsx("span", {
					className: "ml-1 font-sans text-sm font-medium text-ink-soft",
					children: unit
				})]
			}),
			foot && /* @__PURE__ */ jsx("p", {
				className: "mt-1 text-xs text-ink-soft",
				children: foot
			})
		]
	});
}
function LevelChip({ level }) {
	const meta = levelMeta[level];
	return /* @__PURE__ */ jsx("span", {
		className: `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${toneChip[meta.tone]}`,
		children: meta.label
	});
}
function ReadingRow({ reading, now }) {
	const level = classify(reading.value, reading.context);
	const tone = levelMeta[level].tone;
	return /* @__PURE__ */ jsxs("li", {
		className: "flex items-center gap-3 py-3",
		children: [
			/* @__PURE__ */ jsx("span", {
				className: `w-14 font-display text-xl font-semibold tabular-nums ${toneText[tone]}`,
				children: reading.value
			}),
			/* @__PURE__ */ jsxs("span", {
				className: "flex-1 min-w-0",
				children: [/* @__PURE__ */ jsx("span", {
					className: "block text-sm font-medium",
					children: contextLabels[reading.context]
				}), /* @__PURE__ */ jsxs("span", {
					className: "block text-xs text-ink-soft truncate",
					children: [
						formatDay(reading.takenAt, now),
						" · ",
						formatTime(reading.takenAt),
						reading.note ? ` · ${reading.note}` : ""
					]
				})]
			}),
			reading.photoUrl && /* @__PURE__ */ jsx("img", {
				src: reading.photoUrl,
				alt: "Meter photo",
				className: "h-9 w-9 rounded-lg object-cover border border-line"
			}),
			/* @__PURE__ */ jsx(LevelChip, { level })
		]
	});
}
function ScenarioSwitch() {
	const { scenario, setScenario } = useCare();
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center gap-2 text-sm",
		children: [/* @__PURE__ */ jsx("span", {
			className: "text-ink-soft",
			children: "Sample data:"
		}), /* @__PURE__ */ jsx("div", {
			role: "radiogroup",
			"aria-label": "Sample data scenario",
			className: "inline-flex rounded-full bg-card border border-line p-1",
			children: [["steady", "Good week"], ["struggling", "Tough week"]].map(([id, label]) => /* @__PURE__ */ jsx("button", {
				type: "button",
				role: "radio",
				"aria-checked": scenario === id,
				onClick: () => setScenario(id),
				className: `rounded-full px-3 py-1.5 font-medium transition ${scenario === id ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"}`,
				children: label
			}, id))
		})]
	});
}
export { StatTile as a, ScenarioSwitch as i, PageHeader as n, ReadingRow as r, LevelChip as t };
