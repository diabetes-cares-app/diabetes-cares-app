import { HeadContent, Scripts, createFileRoute, createRootRoute, createRouter, lazyRouteComponent } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
// src/routes/__root.tsx
var siteName = "SteadySugar — daily diabetes care companion";
var siteDescription = "SteadySugar helps people living with diabetes log blood sugar, get urgent high-sugar alerts, follow a daily meal plan, and never miss a check or medication.";
var Route$6 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: siteName },
			{
				name: "description",
				content: siteDescription
			},
			{
				property: "og:title",
				content: siteName
			},
			{
				property: "og:description",
				content: siteDescription
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "icon",
				href: "/favicon.svg",
				type: "image/svg+xml"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Figtree:wght@400;500;600;700&display=swap"
			}
		]
	}),
	shellComponent: RootDocument
});
function RootDocument({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		children: [/* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }), /* @__PURE__ */ jsxs("body", { children: [children, /* @__PURE__ */ jsx(Scripts, {})] })]
	});
}
// src/routes/index.tsx
var $$splitComponentImporter$5 = () => import("./routes-B9gNyVw2.js");
var Route$5 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
// src/routes/app.tsx
var $$splitComponentImporter$4 = () => import("./app-C3PimUBt.js");
var Route$4 = createFileRoute("/app")({
	head: () => ({ meta: [{ title: "Today · SteadySugar" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
// src/routes/app.index.tsx
var $$splitComponentImporter$3 = () => import("./app.index-JHcjeE7a.js");
var Route$3 = createFileRoute("/app/")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
// src/routes/app.log.tsx
var $$splitComponentImporter$2 = () => import("./app.log-B1YC5pd6.js");
var Route$2 = createFileRoute("/app/log")({
	head: () => ({ meta: [{ title: "Log sugar · SteadySugar" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
// src/routes/app.meals.tsx
var $$splitComponentImporter$1 = () => import("./app.meals-Dv13maPu.js");
var Route$1 = createFileRoute("/app/meals")({
	head: () => ({ meta: [{ title: "Meal plan · SteadySugar" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
// src/routes/app.medications.tsx
var $$splitComponentImporter = () => import("./app.medications-_ec6Se_1.js");
var Route = createFileRoute("/app/medications")({
	head: () => ({ meta: [{ title: "Medications · SteadySugar" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
// src/routeTree.gen.ts
var IndexRoute = Route$5.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$6
});
var AppRoute = Route$4.update({
	id: "/app",
	path: "/app",
	getParentRoute: () => Route$6
});
var AppIndexRoute = Route$3.update({
	id: "/",
	path: "/",
	getParentRoute: () => AppRoute
});
var AppRouteChildren = {
	AppLogRoute: Route$2.update({
		id: "/log",
		path: "/log",
		getParentRoute: () => AppRoute
	}),
	AppMealsRoute: Route$1.update({
		id: "/meals",
		path: "/meals",
		getParentRoute: () => AppRoute
	}),
	AppMedicationsRoute: Route.update({
		id: "/medications",
		path: "/medications",
		getParentRoute: () => AppRoute
	}),
	AppIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AppRoute: AppRoute._addFileChildren(AppRouteChildren)
};
var routeTree = Route$6._addFileChildren(rootRouteChildren)._addFileTypes();
// src/router.tsx
var getRouter = () => {
	return createRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
export { getRouter };
