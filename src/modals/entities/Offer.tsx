import "./Offer.scss";
import { useInfiniteQuery } from "@tanstack/solid-query";
import LottiePlayer from "lottix/solid/LottiePlayer";
import { type Component, createMemo, onMount, Show } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { apiCampaignsOwned, apiEntityOffer } from "../../api";
import { SVGSymbol } from "../../components/SVG";
import CustomMainButton from "../../components/ui/CustomMainButton";
import Datepicker from "../../components/ui/Datepicker";
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
import { store } from "../../utils/store";
import {
	invokeHapticFeedbackImpact,
	invokeHapticFeedbackNotification,
	openLink,
} from "../../utils/telegram";

const ModalEntitiesOffer: Component = () => {
	const { t, td } = useTranslation();

	const isActive = createMemo(() =>
		["channel-post"].includes(modals.entitiesOffer.ad?.type ?? ""),
	);

	const [form, setForm] = createStore({
		campaign: "none",
		date: Date.now(),
	});

	const price = createMemo(() => {
		return (
			Math.trunc(
				(modals.entitiesOffer.duration ?? 0) *
					(modals.entitiesOffer.ad?.price.perHour ?? 0) *
					100,
			) / 100
		);
	});

	const query = useInfiniteQuery(() => ({
		queryKey: ["campaigns", "owned"],
		queryFn: (data) => apiCampaignsOwned(data.pageParam),
		initialPageParam: 0,
		getNextPageParam: (lastData) => {
			if (lastData.campaigns.length === 0) return undefined;
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
				label: t("modals.entitiesOffer.campaign.undefined"),
				value: "none",
			},
			...(query.data?.pages.flatMap((page) => page.campaigns) || [])
				.filter((i) => i.is_ready && i.is_active)
				.map((i) => ({
					label: i.name ?? "",
					value: i.id ?? "",
				})),
		];
	});

	const buttonDisabled = createMemo(() => {
		if (!isActive()) return true;

		if (
			!form.campaign ||
			form.campaign === "none" ||
			form.campaign.length === 0
		) {
			return true;
		}

		if (form.date <= Date.now()) {
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
			"entitiesOffer",
			produce((store) => {
				store.ad = undefined;
				store.duration = undefined;
				store.entityId = undefined;
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

		if (price() > (store.balance?.real ?? 0)) {
			popupManager.openPopup({
				title: t("modals.entitiesOffer.insufficientBalance.title"),
				message: t("modals.entitiesOffer.insufficientBalance.message"),
				buttons: [
					{
						id: "Ok",
						type: "ok",
					},
				],
			});

			return;
		}

		apiEntityOffer(modals.entitiesOffer.entityId!, {
			campaignId: form.campaign,
			date: form.date.toString(),
			type: modals.entitiesOffer.ad?.type ?? "",
			duration: (modals.entitiesOffer.duration ?? 0).toString(),
		})
			.then((result) => {
				onClose();

				openLink(
					`https://t.me/${import.meta.env.VITE_BOT_USERNAME}/${result.topicId}`,
				);

				popupManager.openPopup({
					title: t("modals.entitiesOffer.success.title"),
					message: t("modals.entitiesOffer.success.message"),
					buttons: [
						{
							id: "Ok",
							type: "ok",
						},
					],
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
			containerClass="container-modal-campaigns-offer"
			class="modal-campaigns-offer"
			onClose={onClose}
			portalParent={document.querySelector("#modals")!}
			type="fullheight"
			withCloseButton
		>
			<Show
				when={isActive()}
				fallback={
					<>
						<LottiePlayer
							src={LottieAnimations.duck.forbidden.url}
							outline={LottieAnimations.duck.forbidden.outline}
							autoplay
							loop
						/>

						<h1>{t("modals.entitiesOffer.unsupported.title")}</h1>

						<p>{t("modals.entitiesOffer.unsupported.message")}</p>
					</>
				}
			>
				<LottiePlayer
					src={LottieAnimations.duck.auction.url}
					outline={LottieAnimations.duck.auction.outline}
					autoplay
					loop
				/>

				<h1>
					{t(`pages.entity.ads.types.${modals.entitiesOffer.ad!.type}.title`)}
				</h1>

				<p>
					{t(
						`pages.entity.ads.types.${modals.entitiesOffer.ad!.type}.description`,
					)}
				</p>
			</Show>

			<section class="container-section-campaigns-information">
				<SectionList
					type="default"
					class="container-section-campaigns-create"
					description={td("modals.entitiesOffer.hint", {
						count: items().length - 1,
					})}
					items={[
						{
							label: t("modals.entitiesOffer.campaign.label"),
							placeholder: () => (
								<SectionListSelect
									items={items()}
									value={form.campaign}
									setValue={(value) => {
										setForm("campaign", value);
									}}
								/>
							),
						},
						{
							label: t("modals.entitiesOffer.start.label"),
							placeholder: () => (
								<span>
									<Datepicker
										hideYear
										withTime
										value={form.date}
										setValue={(value) => {
											setForm("date", value);
										}}
										minDate={new Date().toISOString().slice(0, 10)}
										maxDate={new Date(Date.now() + 7 * 86400 * 1000)
											.toISOString()
											.slice(0, 10)}
									/>
								</span>
							),
						},
						{
							label: t("modals.entitiesOffer.duration.label"),
							placeholder: () => (
								<span class="pe-4!">
									{td("modals.entitiesOffer.duration.hours", {
										hours: modals.entitiesOffer.duration,
									})}
								</span>
							),
						},
						{
							label: t("modals.entitiesOffer.price.label"),
							placeholder: () => (
								<span class="pe-4! flex items-center gap-2">
									{price()} <SVGSymbol id="TON" />
								</span>
							),
						},
					]}
				/>
			</section>

			<CustomMainButton
				onClick={onClickButton}
				disabled={buttonDisabled()}
				text={t("modals.entitiesOffer.button.send")}
			/>
		</Modal>
	);
};

export default ModalEntitiesOffer;
