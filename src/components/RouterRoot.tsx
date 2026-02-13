import type { RouteSectionProps } from "@solidjs/router";
import {
	type Component,
	createEffect,
	For,
	on as onEffect,
	onMount,
} from "solid-js";
import { Dynamic, Portal } from "solid-js/web";
import { Toaster } from "solid-toast";
import { Color } from "../utils/color";
import { modals, setModals } from "../utils/modal";
import { navigator } from "../utils/navigator";
import {
	invokeHapticFeedbackImpact,
	lp,
	setBackgroundColor,
	setBottomBarColor,
	setHeaderColor,
} from "../utils/telegram";
import PlausibleTracker from "./misc/PlausibleTracker";
import RootBottomBar from "./RootBottomBar";
import SettingsButton from "./tma/SettingsButton";

const RouterRoot: Component<RouteSectionProps<unknown>> = (props) => {
	navigator.initialize();
	navigator.history.push({
		id: 0,
		path: navigator.location!.pathname,
	});

	createEffect(
		onEffect(
			() => navigator.location!.pathname,
			() => {
				const current = navigator.getCurrentHistory();
				if (!current) return;

				if (current.options?.params?.haptic !== false) {
					invokeHapticFeedbackImpact("soft");
				}

				setTimeout(() => {
					const page = document.querySelector(".page");
					if (!page) return;

					const color = new Color(getComputedStyle(page).backgroundColor);

					const apply = {
						header: true,
						background: true,
						bottombar: true,
					};

					if (typeof current.options?.params?.theme === "object") {
						apply.header = current.options.params.theme.header ?? true;
						apply.background = current.options.params.theme.background ?? true;
						apply.bottombar = current.options.params.theme.bottombar ?? true;
					}

					if (apply.header) {
						setHeaderColor(color.toHex() as any);
					}

					if (apply.background) {
						setBackgroundColor(color.toHex() as any, false);
					}

					if (apply.bottombar) {
						setBottomBarColor(color.toHex() as any);
					}
				});
			},
		),
	);

	onMount(() => {
		lp.tgWebAppStartParam = "entity-264949c8-b67a-462d-8cda-e9f79bf45e66";

		if (!sessionStorage.getItem("launched")) {
			sessionStorage.setItem("launched", "true");

			if (lp?.tgWebAppStartParam) {
				if (
					lp.tgWebAppStartParam.match(
						/^campaign-([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/,
					)
				) {
					navigator.go(
						`/campaign/${lp.tgWebAppStartParam.replace("campaign-", "")}`,
					);
				}

				if (
					lp.tgWebAppStartParam.match(
						/^entity-([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/,
					)
				) {
					navigator.go(
						`/entity/${lp.tgWebAppStartParam.replace("entity-", "")}`,
					);
				}
			}
		}
	});

	return (
		<>
			{props.children}

			<RootBottomBar />

			<For each={Object.values(modals).filter((modal) => modal.open)}>
				{(modal) => <Dynamic component={modal.component} />}
			</For>

			<SettingsButton
				onClick={() => {
					setModals("settings", "open", true);
				}}
			/>

			<PlausibleTracker />

			<Portal mount={document.body}>
				<Toaster
					containerStyle={{
						top: "max(calc(var(--tg-viewport-safe-area-inset-top) + var(--tg-viewport-content-safe-area-inset-top)), 1rem)",
						bottom:
							"max(calc(var(--tg-viewport-safe-area-inset-bottom) + var(--tg-viewport-content-safe-area-inset-bottom)), 1rem)",
					}}
				/>
			</Portal>
		</>
	);
};

export default RouterRoot;
