import { postEvent } from "./telegram";

export function hideKeyboardOnEnter(e: KeyboardEvent) {
	if (e.key === "Enter") {
		e.preventDefault();
		hideKeyboard();
	}
}

export function hideKeyboard() {
	(document.activeElement as any)?.blur();

	try {
		postEvent("web_app_hide_keyboard");
	} catch (_) {}
}
