import { isTMA, off, on } from "@telegram-apps/sdk-solid";
import { createStore, type SetStoreFunction } from "solid-js/store";
import type { Locale } from "../locale";
import { setMotionMultipler } from "./motion";
import { isVersionAtLeast, lp, postEvent } from "./telegram";

type SettingsStorage = "DeviceStorage" | "LocalStorage";

let settingsStorage: SettingsStorage = "LocalStorage";
let settingsInitialized = false;

export type Settings = {
	language: Locale;
	reduce_motion: {
		enabled: boolean;
	};
	haptic: {
		enabled: boolean;
	};
	intro: {
		done: boolean;
	};
};

export const [settings, setSettingsStore] = createStore<Settings>({
	language: "en",
	reduce_motion: {
		enabled: false,
	},
	haptic: {
		enabled: true,
	},
	intro: {
		done: false,
	},
});

export const waitForSettings = () =>
	new Promise((resolve) => {
		if (settingsInitialized) {
			resolve(settingsInitialized);
		} else {
			const interval = setInterval(() => {
				if (settingsInitialized) {
					clearInterval(interval);
					resolve(settingsInitialized);
				}
			}, 10);
		}
	});

export const initializeSettings = async () => {
	if (isTMA() && isVersionAtLeast("9.0")) {
		settingsStorage = "DeviceStorage";

		const req_id = (
			Date.now().toString(36) + Math.random().toString(36).slice(2)
		)
			.slice(0, 16)
			.padEnd(16, "0");

		postEvent("web_app_device_storage_get_key", {
			req_id,
			key: `settings_${import.meta.env.VITE_BOT_USERNAME}_${import.meta.env.VITE_MINIAPP_SLUG}`,
		});

		const localSettings = await Promise.race([
			new Promise((res) => {
				setTimeout(() => {
					res(null);
				}, 250);
			}) as Promise<null>,

			new Promise((res) => {
				const handler = (event: any) => {
					if (event.req_id !== req_id) return;
					res(event.value);
				};

				on("device_storage_key_received", handler);

				setTimeout(() => {
					off("device_storage_key_received", handler);
					res(null);
				}, 250);
			}) as Promise<string | null>,
		]);

		if (localSettings) {
			setSettingsStore(JSON.parse(localSettings));
		}
	} else {
		settingsStorage = "LocalStorage";

		const localSettings = localStorage.getItem(
			`settings_${import.meta.env.VITE_BOT_USERNAME}_${import.meta.env.VITE_MINIAPP_SLUG}_${lp?.tgWebAppData?.user?.id}`,
		);

		if (localSettings) {
			setSettingsStore(JSON.parse(localSettings));
		}
	}

	if (settings.reduce_motion.enabled) {
		setMotionMultipler(0);
	}

	document.documentElement.setAttribute(
		"prefer-reduced-motion",
		settings.reduce_motion.enabled.toString(),
	);

	settingsInitialized = true;
};

export const setSettings: SetStoreFunction<Settings> = (...args: any) => {
	// @ts-expect-error
	setSettingsStore(...args);

	if (settingsStorage === "DeviceStorage") {
		const req_id = (
			Date.now().toString(36) + Math.random().toString(36).slice(2)
		)
			.slice(0, 16)
			.padEnd(16, "0");

		postEvent("web_app_device_storage_save_key", {
			req_id,
			key: `settings_${import.meta.env.VITE_BOT_USERNAME}_${import.meta.env.VITE_MINIAPP_SLUG}`,
			value: JSON.stringify(settings),
		});
	} else if (settingsStorage === "LocalStorage") {
		localStorage.setItem(
			`settings_${import.meta.env.VITE_BOT_USERNAME}_${import.meta.env.VITE_MINIAPP_SLUG}_${lp?.tgWebAppData?.user?.id}`,
			JSON.stringify(settings),
		);
	}
};
