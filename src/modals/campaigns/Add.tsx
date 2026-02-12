import "./Add.scss";
import { useQueryClient } from "@tanstack/solid-query";
import LottiePlayer from "lottix/solid/LottiePlayer";
import { type Component, createMemo, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { apiCampaignCreate } from "../../api";
import CustomMainButton from "../../components/ui/CustomMainButton";
import Modal from "../../components/ui/Modal";
import Section, {
	SectionList,
	SectionListPicker,
} from "../../components/ui/Section";
import { toastNotification } from "../../components/ui/Toast";
import { useTranslation } from "../../contexts/TranslationContext";
import { LottieAnimations } from "../../utils/animations";
import { APIError } from "../../utils/api";
import { hideKeyboardOnEnter } from "../../utils/input";
import { setModals } from "../../utils/modal";
import { popupManager } from "../../utils/popup";
import { store } from "../../utils/store";
import {
	invokeHapticFeedbackImpact,
	invokeHapticFeedbackNotification,
	openLink,
	postEvent,
} from "../../utils/telegram";

const ModalCampaignsAdd: Component = () => {
	const { t } = useTranslation();

	const queryClient = useQueryClient();

	const [form, setForm] = createStore({
		name: "",
		description: "",
		language_code: "none",
		category: "none",
	});

	const buttonDisabled = createMemo(() => {
		if (form.name.length < store.limits!.campaigns.name.minLength) {
			return true;
		}

		if (form.name.length > store.limits!.campaigns.name.maxLength) {
			return true;
		}

		return false;
	});

	onMount(() => {
		invokeHapticFeedbackImpact("soft");
	});

	const onClose = () => {
		setModals("campaignsAdd", "open", false);
	};

	const onClickButton = () => {
		if (buttonDisabled()) return;

		invokeHapticFeedbackImpact("soft");

		apiCampaignCreate(form)
			.then(async (result) => {
				queryClient.invalidateQueries({
					queryKey: ["campaigns", "owned"],
				});

				openLink(
					`https://t.me/${import.meta.env.VITE_BOT_USERNAME}?start=campaign-banner-${result.id}`,
				);

				setTimeout(onClose);

				popupManager
					.openPopup({
						title: t("modals.campaignsAdd.success.title"),
						message: t("modals.campaignsAdd.success.message"),
						buttons: [
							{
								id: "Ok",
								type: "ok",
							},
						],
					})
					.finally(() => {
						postEvent("web_app_close");
					});
			})
			.catch((error) => {
				invokeHapticFeedbackNotification("error");

				if (error instanceof APIError) {
					toastNotification({
						text: error.message,
						type: "error",
					});
				}
			});
	};

	return (
		<Modal
			containerClass="container-modal-campaigns-add"
			class="modal-campaigns-add"
			onClose={onClose}
			portalParent={document.querySelector("#modals")!}
			type="fullheight"
			withCloseButton
		>
			<LottiePlayer
				src={LottieAnimations.duck.chartGrow.url}
				outline={LottieAnimations.duck.chartGrow.outline}
				autoplay
				loop
			/>

			<h1>{t("modals.campaignsAdd.title.text")}</h1>

			<section class="container-section-campaigns-information">
				<Section>
					<div>
						<input
							class="input"
							type="text"
							placeholder={t(
								"modals.campaignsAdd.section.fields.name.placeholder",
							)}
							value={form.name}
							onInput={(e) => setForm("name", e.currentTarget.value)}
							onBlur={(e) => setForm("name", e.currentTarget.value.trim())}
							onKeyDown={hideKeyboardOnEnter}
							maxLength={store.limits!.campaigns.name.maxLength}
						/>
					</div>

					<div>
						<textarea
							id="input-description"
							placeholder={t(
								"modals.campaignsAdd.section.fields.description.placeholder",
							)}
							value={form.description}
							onInput={(e) => setForm("description", e.currentTarget.value)}
							onChange={(e) => {
								setForm("description", e.currentTarget.value.trim());
							}}
							maxLength={store.limits!.campaigns.description.maxLength}
						/>
					</div>
				</Section>

				<SectionList
					type="default"
					description={t("modals.campaignsAdd.section.description")}
					class="container-section-campaigns-create"
					items={[
						{
							label: t("pages.entity.options.section.category.label"),
							placeholder: () => (
								<SectionListPicker
									label={t("pages.entity.options.section.category.picker")}
									placeholder={t(
										"pages.entity.options.section.category.undefined",
									)}
									items={[
										{
											label: t(
												"pages.entity.options.section.category.undefined",
											),
											value: "none",
										},
										...Object.entries(store.categories!).map(
											([value, label]) => ({
												label,
												value,
											}),
										),
									]}
									value={form.category}
									setValue={(value) => {
										setForm("category", value);
									}}
								/>
							),
						},
						{
							label: t("pages.entity.options.section.language.label"),
							placeholder: () => (
								<SectionListPicker
									label={t("pages.entity.options.section.language.picker")}
									placeholder={t(
										"pages.entity.options.section.language.undefined",
									)}
									items={[
										{
											label: t(
												"pages.entity.options.section.language.undefined",
											),
											value: "none",
										},
										...Object.entries(store.languages!).map(
											([value, label]) => ({
												label,
												value,
											}),
										),
									]}
									value={form.language_code}
									setValue={(value) => {
										setForm("language_code", value);
									}}
								/>
							),
						},
					]}
				/>
			</section>

			<CustomMainButton
				onClick={onClickButton}
				disabled={buttonDisabled()}
				text={t("modals.campaignsAdd.button.text")}
			/>
		</Modal>
	);
};

export default ModalCampaignsAdd;
