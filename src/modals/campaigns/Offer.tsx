import "./Offer.scss";
import { useInfiniteQuery } from "@tanstack/solid-query";
import LottiePlayer from "lottix/solid/LottiePlayer";
import { type Component, createMemo, onMount } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { apiCampaignOffer, apiEntitiesOwned } from "../../api";
import CustomMainButton from "../../components/ui/CustomMainButton";
import Modal from "../../components/ui/Modal";
import { SectionList, SectionListSelect } from "../../components/ui/Section";
import { toastNotification } from "../../components/ui/Toast";
import { useTranslation } from "../../contexts/TranslationContext";
import useQueryFeedback from "../../hooks/useQueryFeedback";
import { LottieAnimations } from "../../utils/animations";
import { APIError } from "../../utils/api";
import { modals, setModals } from "../../utils/modal";
import { navigator } from "../../utils/navigator";
import { popupManager } from "../../utils/popup";
import {
	invokeHapticFeedbackImpact,
	invokeHapticFeedbackNotification,
} from "../../utils/telegram";

const ModalCampaignsOffer: Component = () => {
	const { t, td } = useTranslation();

	const [form, setForm] = createStore({
		entity: "none",
	});

	const query = useInfiniteQuery(() => ({
		queryKey: ["entities", "owned"],
		queryFn: (data) => apiEntitiesOwned(data.pageParam),
		initialPageParam: 0,
		getNextPageParam: (lastData) => {
			if (lastData.entities.length === 0) return undefined;
			return lastData.nextOffset;
		},
	}));

	useQueryFeedback({
		query,
		options: {
			hapticOnError: true,
			hapticOnSuccess: true,
			toastOnError: true,
			refetchKey: "owned-entities",
		},
	});

	const items = createMemo(() => {
		return [
			{
				label: t("modals.campaignsOffer.entity.undefined"),
				value: "none",
			},
			...(query.data?.pages.flatMap((page) => page.entities) || [])
				.filter((i) => i.is_active)
				.map((i) => ({
					label: i.name ?? "",
					value: i.id ?? "",
				})),
		];
	});

	const buttonDisabled = createMemo(() => {
		if (!form.entity || form.entity === "none" || form.entity.length === 0) {
			return true;
		}

		return false;
	});

	onMount(() => {
		invokeHapticFeedbackImpact("soft");

		navigator.modal(() => {
			onClose();
		});
	});

	const onClose = () => {
		setModals(
			"campaignsOffer",
			produce((store) => {
				store.campaignId = undefined;
				store.open = false;
			}),
		);

		if (navigator.history[navigator.history.length - 1].path === "modal") {
			navigator.history.pop();
		}
	};

	const onClickButton = () => {
		if (buttonDisabled()) return;

		invokeHapticFeedbackImpact("soft");

		apiCampaignOffer(modals.campaignsOffer.campaignId!, {
			entityId: form.entity,
		})
			.then(() => {
				popupManager.openPopup({
					title: t("modals.campaignsOffer.success.title"),
					message: t("modals.campaignsOffer.success.message"),
					buttons: [
						{
							id: "OK",
							type: "ok",
						},
					],
				});

				onClose();
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
			containerClass="container-modal-campaigns-offer"
			class="modal-campaigns-offer"
			onClose={onClose}
			portalParent={document.querySelector("#modals")!}
			type="fullheight"
			withCloseButton
		>
			<LottiePlayer
				src={LottieAnimations.duck.glassShine.url}
				outline={LottieAnimations.duck.glassShine.outline}
				autoplay
				loop
			/>

			<h1>{t("modals.campaignsOffer.title")}</h1>

			<p>{t("modals.campaignsOffer.description")}</p>

			<section class="container-section-campaigns-information">
				<SectionList
					type="default"
					class="container-section-campaigns-create"
					description={td("modals.campaignsOffer.hint", {
						count: items().length - 1,
					})}
					items={[
						{
							label: t("modals.campaignsOffer.entity.label"),
							placeholder: () => (
								<SectionListSelect
									items={items()}
									value={form.entity}
									setValue={(value) => {
										setForm("entity", value);
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
				text={t("modals.campaignsOffer.button.send")}
			/>
		</Modal>
	);
};

export default ModalCampaignsOffer;
