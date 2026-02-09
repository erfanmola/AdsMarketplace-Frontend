import "./Authorize.scss";
import {
	batch,
	createEffect,
	on,
	onMount,
	type ParentComponent,
	Show,
} from "solid-js";
import { createStore } from "solid-js/store";
import { apiAuthUser } from "../api";
import PageIntro from "../pages/Intro";
import { Color } from "../utils/color";
import { preloadPipeline } from "../utils/preload";
import { settings } from "../utils/settings";
import { setStore, store } from "../utils/store";
import {
	postEvent,
	setBackgroundColor,
	setHeaderColor,
} from "../utils/telegram";
import { ws } from "../utils/ws";

export const LayoutAuthorize: ParentComponent = (props) => {
	const [pipeline, setPipeline] = createStore({
		preload: false,
		user: false,
		ws: ws.isConnected(),
		wsAuth: ws.isAuthorized(),
	});

	onMount(async () => {
		preloadPipeline().then(() => {
			setPipeline("preload", true);
		});

		apiAuthUser()
			.then((result) => {
				batch(() => {
					setStore({
						categories: result.categories,
						languages: result.languages,
						limits: result.limits,
						token: result.token,
						user: result.user,
					});

					setPipeline("user", true);
				});
			})
			.catch(() => {
				postEvent("web_app_close");
			});

		setTimeout(() => {
			const color = new Color(getComputedStyle(document.body).backgroundColor);

			setHeaderColor(color.toHex() as any);
			setBackgroundColor(color.toHex() as any);
		});
	});

	createEffect(() => {
		if (pipeline.ws && !pipeline.wsAuth && pipeline.user) {
			ws.authenticate(store.token!);
		}
	});

	createEffect(
		on(
			ws.isConnected,
			(connected) => {
				setPipeline("ws", connected);
			},
			{
				defer: true,
			},
		),
	);

	createEffect(
		on(
			ws.isAuthorized,
			(authorized) => {
				setPipeline("wsAuth", authorized);
			},
			{
				defer: true,
			},
		),
	);

	const SectionLoader = () => (
		<div id="layout-authorize-fallback">
			<div id="container-splash-loader" class="shimmer"></div>
		</div>
	);

	return (
		<Show
			when={Object.values(pipeline).every(Boolean)}
			fallback={<SectionLoader />}
		>
			<Show when={settings.intro.done} fallback={<PageIntro />}>
				{props.children}
			</Show>
		</Show>
	);
};
