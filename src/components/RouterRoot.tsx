import type { RouteSectionProps } from "@solidjs/router";
import { type Component, createEffect, For, on as onEffect } from "solid-js";
import { Dynamic, Portal } from "solid-js/web";
import { Toaster } from "solid-toast";
import { Color } from "../utils/color";
import { modals, setModals } from "../utils/modal";
import { navigator } from "../utils/navigator";
import {
	invokeHapticFeedbackImpact,
	setBackgroundColor,
	setBottomBarColor,
	setHeaderColor,
} from "../utils/telegram";
import PlausibleTracker from "./misc/PlausibleTracker";
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

	return (
		<>
			{props.children}

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
