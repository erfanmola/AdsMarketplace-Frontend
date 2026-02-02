import { off, on } from "@telegram-apps/sdk-solid";
import { onCleanup, onMount, type ParentComponent } from "solid-js";
import { match } from "../utils/helpers";
import {
	invokeHapticFeedbackImpact,
	invokeHapticFeedbackNotification,
	postEvent,
} from "../utils/telegram";
import { ws } from "../utils/ws";

type QueuedNotif = {
	title: string;
	message: string;
	haptic: "none" | "success" | "error" | "warning";
};

export const LayoutNotifications: ParentComponent = (props) => {
	const queue: QueuedNotif[] = [];
	let showing = false;

	const showNext = () => {
		if (showing) return;
		const next = queue.shift();
		if (!next) return;

		showing = true;

		const prependEmoji = match(
			next.haptic,
			[
				["none", "🔔"],
				["success", "✅"],
				["error", "❌"],
				["warning", "⚠️"],
			],
			"🔔",
		);

		switch (next.haptic) {
			case "none":
				invokeHapticFeedbackImpact("soft");
				break;
			case "success":
				invokeHapticFeedbackNotification("success");
				break;
			case "error":
				invokeHapticFeedbackNotification("error");
				break;
			case "warning":
				invokeHapticFeedbackNotification("warning");
				break;
		}

		postEvent("web_app_open_popup", {
			title: [prependEmoji, next.title].filter(Boolean).join(" "),
			message: next.message,
			buttons: [
				{
					id: "ok",
					type: "ok",
				},
			],
		});
	};

	const onPopupClose = () => {
		showing = false;
		showNext();
	};

	onMount(() => {
		ws.on("notification", (data) => {
			const cleanMessage =
				new DOMParser().parseFromString(data.notification.message, "text/html")
					.body.textContent || data.notification.message;

			queue.push({
				title: data.notification.title,
				message: cleanMessage,
				haptic: data.notification.haptic ?? "none",
			});

			showNext();
		});

		on("popup_closed", onPopupClose);
	});

	onCleanup(() => {
		off("popup_closed", onPopupClose);
	});

	return <>{props.children}</>;
};
