import "./Add.scss";
import LottiePlayer from "lottix/solid/LottiePlayer";
import { type Component, createMemo, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { apiCampaignCreate } from "../../api";
import CustomMainButton from "../../components/ui/CustomMainButton";
import Modal from "../../components/ui/Modal";
import {
	SectionList,
	SectionListInput,
	SectionListPicker,
} from "../../components/ui/Section";
import { toastNotification } from "../../components/ui/Toast";
import { useTranslation } from "../../contexts/TranslationContext";
import { LottieAnimations } from "../../utils/animations";
import { APIError } from "../../utils/api";
import { setModals } from "../../utils/modal";
import { store } from "../../utils/store";
import {
	invokeHapticFeedbackImpact,
	invokeHapticFeedbackNotification,
	openLink,
} from "../../utils/telegram";

const ModalCampaignsAdd: Component = () => {
	const { t } = useTranslation();

	const [form, setForm] = createStore({
		name: "",
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
			.then((result) => {
				openLink(
					`https://t.me/${import.meta.env.VITE_BOT_USERNAME}?start=campaign-banner-${result.id}`,
				);

				setTimeout(onClose);
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

			<p>{t("modals.campaignsAdd.description")}</p>

			<section>
				<SectionList
					type="default"
					title={t("modals.campaignsAdd.section.title")}
					description={t("modals.campaignsAdd.section.description")}
					class="container-section-campaigns-create"
					items={[
						{
							label: t("modals.campaignsAdd.section.fields.name.label"),
							placeholder: () => (
								<SectionListInput
									type="text"
									inputmode="text"
									maxLength={store.limits!.campaigns.name.maxLength}
									placeholder={t(
										"modals.campaignsAdd.section.fields.name.placeholder",
									)}
									value={form.name}
									setValue={(value) => {
										setForm("name", value);
									}}
									onBlur={() => {
										setForm("name", form.name.trim());
									}}
								/>
							),
						},
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
