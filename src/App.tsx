import * as i18n from "@solid-primitives/i18n";
import { Route, Router } from "@solidjs/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { isTMA } from "@telegram-apps/sdk-solid";
import {
	createEffect,
	createResource,
	createSignal,
	ErrorBoundary,
	lazy,
	onCleanup,
	onMount,
	Show,
} from "solid-js";
import { register as registerSwiper } from "swiper/element";
import RouterRoot from "./components/RouterRoot.tsx";
import {
	type TranslationContextType,
	TranslationProvider,
} from "./contexts/TranslationContext.ts";
import { dict as en_dict } from "./i18n/en.ts";
import { LayoutAuthorize } from "./layouts/Authorize.tsx";
import { LayoutNotifications } from "./layouts/Notifications.tsx";
import { fetchDictionary, type Locale, localeDirections } from "./locale";
import PageAdvertisers from "./pages/Advertisers.tsx";
import PageCampaign from "./pages/Campaign.tsx";
import PageEntity from "./pages/Entity.tsx";
import PageError from "./pages/Error";
import PageHome from "./pages/Home.tsx";
import PagePublishers from "./pages/Publishers.tsx";
import PageVoid from "./pages/Void.tsx";
import { setIsRTL } from "./utils/i18n.ts";
import { initializeSettings, settings } from "./utils/settings.ts";
import { initializeTMA, postEvent } from "./utils/telegram.ts";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60_000,
		},
	},
});

const App = () => {
	registerSwiper();

	const [locale, setLocale] = createSignal<Locale>("en");

	const [dict] = createResource(locale, fetchDictionary, {
		initialValue: i18n.flatten(en_dict),
	});

	dict();

	const t: TranslationContextType["t"] = i18n.translator(dict) as any;
	const td: TranslationContextType["td"] = (path, data) => {
		let text = t(path);
		if (data) {
			for (const [key, value] of Object.entries(data)) {
				text = text.replace(`{${key}}`, value);
			}
		}
		return text;
	};

	// Prevent Multiple Instances
	const channel = new BroadcastChannel(
		`${import.meta.env.VITE_PROJECT_NAME}-launch`,
	);
	channel.addEventListener("message", (event) => {
		const { data } = event;

		switch (data.type) {
			case "launch":
				postEvent("web_app_close");
				break;
		}
	});

	// Handle Document Direction
	createEffect(() => {
		const dir = localeDirections[(locale() ?? "en") as Locale] ?? "ltr";
		document.querySelector("html")?.setAttribute("dir", dir);
		setIsRTL(dir === "rtl");
	});

	onMount(async () => {
		if (!isTMA()) return;

		await initializeTMA();

		channel.postMessage({
			type: "launch",
		});

		initializeSettings();

		if (settings.language !== locale()) {
			setLocale((settings.language ?? "en") as Locale);
		}

		let debugPageAttemps: number[] = [];
		document.addEventListener("contextmenu", (event) => {
			event.preventDefault();

			if (import.meta.env.DEV) {
				const now = Date.now();

				debugPageAttemps.push(now);

				debugPageAttemps = debugPageAttemps.filter(
					(timestamp) => now - timestamp <= 5_000,
				);

				if (debugPageAttemps.length >= 5) {
					debugPageAttemps = [];
					location.href = "/debug";
				}
			}
		});
	});

	onCleanup(() => {
		channel.close();
	});

	return (
		<TranslationProvider value={{ t, td, locale, setLocale }}>
			<QueryClientProvider client={queryClient}>
				<Show
					when={isTMA()}
					fallback={
						<PageError
							title={t("pages.errorInvalidEnv.title")}
							description={t("pages.errorInvalidEnv.description")}
						/>
					}
				>
					<ErrorBoundary fallback={<PageError />}>
						<LayoutNotifications>
							<LayoutAuthorize>
								<Router root={RouterRoot}>
									<Show when={import.meta.env.DEV}>
										<Route
											path="/debug"
											component={lazy(() => import("./pages/Debug"))}
										/>
									</Show>

									<Route path="/" component={PageHome} />

									<Route
										path="/advertisers/:tab?"
										component={PageAdvertisers}
									/>

									<Route path="/publishers/:tab?" component={PagePublishers} />

									<Route path="/entity/:id/:tab?" component={PageEntity} />

									<Route path="/campaign/:id" component={PageCampaign} />

									<Route path="/void" component={PageVoid} />
								</Router>
							</LayoutAuthorize>
						</LayoutNotifications>
					</ErrorBoundary>
				</Show>
			</QueryClientProvider>
		</TranslationProvider>
	);
};

export default App;
