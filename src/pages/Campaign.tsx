import { useMutation, useQuery, useQueryClient } from "@tanstack/solid-query";
import BackButton from "../components/tma/BackButton";
import Page from "../layouts/Page";
import { navigator } from "../utils/navigator";
import "./Campaign.scss";
import { debounce } from "@solid-primitives/scheduled";

import { useParams } from "@solidjs/router";

import {
	type Component,
	createSignal,
	Match,
	Show,
	Suspense,
	Switch,
} from "solid-js";
import { createStore, produce } from "solid-js/store";
import { apiCampaign, apiCampaignUpdate, type ResponseCampaign } from "../api";
import type { Campaign } from "../api/api";
import { SVGSymbol } from "../components/SVG";
import CustomMainButton from "../components/ui/CustomMainButton";
import PeerProfile from "../components/ui/PeerProfile";
import Scrollable from "../components/ui/Scrollable";
import Section, {
	SectionList,
	SectionListPicker,
} from "../components/ui/Section";
import Shimmer from "../components/ui/Shimmer";
import { toastNotification } from "../components/ui/Toast";
import { useTranslation } from "../contexts/TranslationContext";
import useQueryFeedback from "../hooks/useQueryFeedback";
import { APIError } from "../utils/api";
import { hideKeyboardOnEnter } from "../utils/input";
import { setModals } from "../utils/modal";
import { objectToStringRecord } from "../utils/object";
import { popupManager } from "../utils/popup";
import { store } from "../utils/store";
import {
	invokeHapticFeedbackImpact,
	openLink,
	postEvent,
} from "../utils/telegram";

const PageCampaign: Component = () => {
	const { t, td } = useTranslation();

	const params = useParams();
	const key = ["campaign", params.id];

	const [processing, setProcessing] = createSignal(false);

	const query = useQuery(() => ({
		queryKey: key,
		queryFn: (data) => apiCampaign(data.queryKey[1]!),
	}));

	useQueryFeedback({
		query,
		options: {
			hapticOnError: true,
			hapticOnSuccess: true,
			toastOnError: true,
			refetchKey: "campaign",
		},
	});

	const queryClient = useQueryClient();

	const syncDebounced = debounce(
		async (data: Partial<Campaign>, snapshot: ResponseCampaign) => {
			try {
				await apiCampaignUpdate(params.id!, objectToStringRecord(data));
			} catch (err) {
				if (!(err instanceof APIError)) return;

				queryClient.setQueryData(key, snapshot);

				toastNotification({
					text: err.message,
					type: "error",
				});
			}

			setProcessing(false);

			queryClient.invalidateQueries({
				queryKey: ["campaigns", "owned"],
			});
		},
		1000,
	);

	const mutation = useMutation(() => ({
		mutationKey: key,
		mutationFn: async (data: Partial<Campaign>) => data,

		onMutate: async (data) => {
			await queryClient.cancelQueries({ queryKey: key });

			const old = queryClient.getQueryData<ResponseCampaign>(key)!;

			queryClient.setQueryData(key, {
				campaign: { ...old.campaign, ...data },
			});

			return { old, key };
		},
	}));

	const mutate = (patch: Partial<Campaign>) => {
		const snapshot = queryClient.getQueryData<ResponseCampaign>(key)!;

		mutation.mutate(patch);

		syncDebounced(patch, snapshot);
	};

	const onBackButton = () => {
		if (navigator.isBackable()) {
			navigator.back();
		} else {
			navigator.go("/");
		}
	};

	const Campaign: Component<{ campaign: Campaign }> = (props) => {
		const CampaignHeader = () => {
			return (
				<header>
					<PeerProfile
						peerId={Number(props.campaign.id?.match(/(\d+)/)?.[1] ?? 0)}
						alternateContent={() => (
							<span>
								<SVGSymbol id="BiRegularStore" />
							</span>
						)}
					/>

					<h1>{props.campaign.name}</h1>
				</header>
			);
		};

		const CampaignBody = () => {
			const CampaignBodyViewer = () => {
				return (
					<div>
						<section class="container-section-campaigns-viewer">
							<Section>
								<p class="text-justify">
									{(query.data?.campaign.description?.length ?? 0) > 0
										? query.data?.campaign.description
										: t("pages.campaign.viewer.description.empty")}
								</p>
							</Section>

							<SectionList
								type="default"
								class="container-section-campaigns-create"
								items={[
									{
										label: t("pages.entity.options.section.category.label"),
										placeholder: () => (
											<span class="pe-4!">
												{store.categories?.[
													query.data?.campaign.category ?? "none"
												] ?? t("pages.entity.infolist.category.undefined")}
											</span>
										),
									},
									{
										label: t("pages.entity.options.section.language.label"),
										placeholder: () => (
											<span class="pe-4!">
												{store.languages?.[
													query.data?.campaign.language_code ?? "none"
												] ?? t("pages.entity.infolist.language.undefined")}
											</span>
										),
									},
								]}
							/>
						</section>
					</div>
				);
			};

			const CampaignBodyOwner = () => {
				const [form, setForm] = createStore({
					name: props.campaign.name,
					description: props.campaign.description,
				});

				return (
					<div>
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
										onBlur={(e) => {
											setForm("name", e.currentTarget.value.trim());
											if (form.name === query.data?.campaign.name) return;
											mutate({
												name: form.name,
											});
										}}
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
										onInput={(e) =>
											setForm("description", e.currentTarget.value)
										}
										onBlur={(e) => {
											setForm("description", e.currentTarget.value.trim());
											if (form.description === query.data?.campaign.description)
												return;
											mutate({
												description:
													(form.description?.length ?? 0) > 0
														? form.description
														: "none",
											});
										}}
										maxLength={store.limits!.campaigns.description.maxLength}
									/>
								</div>
							</Section>

							<SectionList
								type="default"
								class="container-section-campaigns-create"
								description={t("pages.campaign.hint.text")}
								items={[
									{
										label: t("pages.entity.options.section.category.label"),
										placeholder: () => (
											<SectionListPicker
												label={t(
													"pages.entity.options.section.category.picker",
												)}
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
												value={props.campaign.category}
												setValue={(value) => {
													mutate({
														category: value,
													});
												}}
											/>
										),
									},
									{
										label: t("pages.entity.options.section.language.label"),
										placeholder: () => (
											<SectionListPicker
												label={t(
													"pages.entity.options.section.language.picker",
												)}
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
												value={props.campaign.language_code}
												setValue={(value) => {
													mutate({
														language_code: value,
													});
												}}
											/>
										),
									},
									{
										label: t("pages.entity.options.section.verification.label"),
										placeholder: () => (
											<div class="container-section-overview-owner-options-verification">
												<Show
													when={query.data?.campaign.is_verified}
													fallback={
														<p
															classList={{
																clickable:
																	query.data?.campaign.is_ready &&
																	query.data?.campaign.is_active,
																disabled: !(
																	query.data?.campaign.is_ready &&
																	query.data?.campaign.is_active
																),
															}}
															onClick={() => {
																setModals("verification", "open", true);
															}}
														>
															<span>
																{t(
																	"pages.entity.options.section.verification.apply",
																)}
															</span>

															<SVGSymbol id="FaSolidChevronRight" />
														</p>
													}
												>
													<span class="badge badge-verified">
														{t(
															"pages.entity.options.section.verification.verified",
														)}
													</span>
												</Show>
											</div>
										),
									},
								]}
							/>
						</section>
					</div>
				);
			};

			return (
				<section id="campaign-section-body">
					<Switch>
						<Match when={props.campaign.role === "owner"}>
							<CampaignBodyOwner />
						</Match>

						<Match when={props.campaign.role === "viewer"}>
							<CampaignBodyViewer />
						</Match>
					</Switch>
				</section>
			);
		};

		return (
			<div class="container-campaign">
				<Scrollable>
					<CampaignHeader />

					<CampaignBody />
				</Scrollable>
			</div>
		);
	};

	const CampaignFooter = () => {
		return (
			<Show
				when={query.isFetched}
				fallback={
					<Shimmer id="shimmer-campaign-button">
						<div />
					</Shimmer>
				}
			>
				<Switch>
					<Match
						when={
							query.data?.campaign.role === "owner" &&
							query.data.campaign.is_ready
						}
					>
						<CustomMainButton
							text={t("pages.campaign.footer.button.share")}
							onClick={() => {
								invokeHapticFeedbackImpact("soft");

								postEvent("web_app_open_tg_link", {
									path_full: `/share/url?url=https://t.me/${import.meta.env.VITE_BOT_USERNAME}/${import.meta.env.VITE_MINIAPP_SLUG}?startapp=campaign-${query.data?.campaign.id}&text=${encodeURI(
										td("pages.campaign.footer.share.text", {
											name: query.data?.campaign.name,
											app_name: t("general.appName"),
										}),
									)}`,
								});
							}}
						/>

						<CustomMainButton
							secondary
							text={t(
								query.data?.campaign.is_active
									? "pages.campaign.footer.button.disable"
									: "pages.campaign.footer.button.enable",
							)}
							disabled={processing()}
							onClick={() => {
								setProcessing(true);
								invokeHapticFeedbackImpact("soft");
								mutate({
									is_active: !query.data?.campaign.is_active,
								});
							}}
						/>
					</Match>

					<Match
						when={
							query.data?.campaign.role === "owner" &&
							query.data?.campaign.is_active &&
							!query.data?.campaign.is_ready
						}
					>
						<CustomMainButton
							text={t("pages.campaign.footer.button.set")}
							onClick={() => {
								invokeHapticFeedbackImpact("soft");

								openLink(
									`https://t.me/${import.meta.env.VITE_BOT_USERNAME}?start=campaign-banner-${query.data?.campaign.id}`,
								);

								popupManager
									.openPopup({
										title: t("pages.campaign.footer.set.title"),
										message: t("pages.campaign.footer.set.message"),
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
							}}
						/>
					</Match>

					<Match
						when={
							query.data?.campaign.role === "viewer" &&
							query.data?.campaign.is_active
						}
					>
						<CustomMainButton
							text={t("pages.campaign.footer.button.offer")}
							onClick={() => {
								invokeHapticFeedbackImpact("soft");

								setModals(
									"campaignsOffer",
									produce((store) => {
										store.campaignId = query.data?.campaign.id;
										store.open = true;
									}),
								);
							}}
						/>
					</Match>

					<Match
						when={
							query.data?.campaign.role === "viewer" &&
							!query.data?.campaign.is_active
						}
					>
						<p>{t("pages.campaign.footer.text.disabled")}</p>
					</Match>
				</Switch>
			</Show>
		);
	};

	const CampaignShimmer: Component = () => {
		return (
			<Shimmer id="shimmer-campaign">
				<header>
					<div />
					<span />
				</header>

				<section>
					<div />
					<div />
				</section>
			</Shimmer>
		);
	};

	return (
		<>
			<Page id="container-page-campaign" footer={CampaignFooter}>
				<Suspense fallback={<CampaignShimmer />}>
					<Show when={query.data?.campaign}>
						<Campaign campaign={query.data?.campaign as Campaign} />
					</Show>
				</Suspense>
			</Page>

			<BackButton onClick={onBackButton} />
		</>
	);
};

export default PageCampaign;
