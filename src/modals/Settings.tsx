import "./Settings.scss";
import { type Component, createEffect, on, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import Modal from "../components/ui/Modal";
import {
	SectionList,
	SectionListSelect,
	SectionListSwitch,
} from "../components/ui/Section";
import { useTranslation } from "../contexts/TranslationContext";
import { setModals } from "../utils/modal";
import { setSettings, settings } from "../utils/settings";
import { invokeHapticFeedbackImpact, postEvent } from "../utils/telegram";

const ModalSettings: Component = () => {
	const { t, locale, setLocale } = useTranslation();

	onMount(() => {
		invokeHapticFeedbackImpact("soft");
	});

	const onClose = () => {
		setModals("settings", "open", false);
	};

	const [form, setForm] = createStore({
		lang: locale(),
		haptic: settings.haptic.enabled,
	});

	createEffect(
		on(
			() => form.lang,
			() => {
				setLocale(form.lang);
				setSettings("language", form.lang);

				setTimeout(() => {
					location.reload();
				});
			},
			{
				defer: true,
			},
		),
	);

	createEffect(
		on(
			() => form.haptic,
			() => {
				setSettings("haptic", "enabled", form.haptic);
			},
			{
				defer: true,
			},
		),
	);

	return (
		<Modal
			containerClass="container-modal-settings"
			class="modal-settings"
			onClose={onClose}
			portalParent={document.querySelector("#modals")!}
			title={t("modals.settings.title")}
			withCloseButton
		>
			<div>
				<SectionList
					title={t("modals.settings.title")}
					items={[
						{
							label: t("modals.settings.language"),
							placeholder: () => (
								<SectionListSelect
									items={[
										{
											label: t("locales.en"),
											value: "en",
										},
										{
											label: t("locales.ru"),
											value: "ru",
										},
										{
											label: t("locales.fa"),
											value: "fa",
										},
										{
											label: t("locales.ar"),
											value: "ar",
										},
										{
											label: t("locales.de"),
											value: "de",
										},
										{
											label: t("locales.hi"),
											value: "hi",
										},
									]}
									value={form.lang}
									setValue={(value) => {
										setForm("lang", value as any);
									}}
								/>
							),
						},
						{
							label: t("modals.settings.haptic"),
							placeholder: () => (
								<SectionListSwitch
									value={form.haptic}
									setValue={(value) => {
										setForm("haptic", value);
									}}
								/>
							),
						},
						{
							label: () => (
								<span class="text-danger">{t("modals.settings.reset")}</span>
							),
							clickable: true,
							onClick: async () => {
								invokeHapticFeedbackImpact("heavy");

								try {
									localStorage.clear();
								} catch (_) {}

								try {
									sessionStorage.clear();
								} catch (_) {}

								if ("caches" in window) {
									try {
										const names = await caches.keys();
										await Promise.all(names.map((name) => caches.delete(name)));
									} catch (_) {}
								}

								if ("serviceWorker" in navigator) {
									try {
										const regs =
											await navigator.serviceWorker.getRegistrations();
										await Promise.all(regs.map((r) => r.unregister()));
									} catch (_) {}
								}

								postEvent("web_app_device_storage_clear", {
									req_id: (
										Date.now().toString(36) +
										Math.random().toString(36).slice(2)
									)
										.slice(0, 16)
										.padEnd(16, "0"),
								});

								setTimeout(() => {
									postEvent("web_app_close");
								}, 250);
							},
						},
					]}
				/>
			</div>

			<p>{t("modals.settings.footer")}</p>
		</Modal>
	);
};

export default ModalSettings;
