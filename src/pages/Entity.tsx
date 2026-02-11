import { useMutation, useQuery, useQueryClient } from "@tanstack/solid-query";
import BackButton from "../components/tma/BackButton";
import Page from "../layouts/Page";
import { navigator } from "../utils/navigator";
import "./Entity.scss";
import { debounce } from "@solid-primitives/scheduled";

import { useParams } from "@solidjs/router";
import LottiePlayer from "lottix/solid/LottiePlayer";
import {
	TbFillRosetteDiscountCheck,
	TbOutlineCategory2,
	TbOutlineCircleDashed,
	TbOutlineCircleDashedCheck,
	TbOutlineEyeOff,
	TbOutlineRosette,
	TbOutlineShare3,
	TbOutlineWorld,
} from "solid-icons/tb";
import {
	type Component,
	createEffect,
	createMemo,
	createSignal,
	For,
	Match,
	onCleanup,
	onMount,
	Show,
	Suspense,
	Switch,
} from "solid-js";
import { apiEntity, apiEntityUpdate, type ResponseEntity } from "../api";
import type { Entity, EntityAd } from "../api/api";
import { SVGSymbol } from "../components/SVG";
import Clickable from "../components/ui/Clickable";
import PeerProfile from "../components/ui/PeerProfile";
import Placeholder from "../components/ui/Placeholder";
import Scrollable from "../components/ui/Scrollable";
import Section, {
	SectionList,
	SectionListInput,
	SectionListPicker,
	SectionListSelect,
	SectionListSwitch,
} from "../components/ui/Section";
import Shimmer from "../components/ui/Shimmer";
import StatsDiff from "../components/ui/StatsDiff";
import Tabbar, { type TabbarItem } from "../components/ui/Tabbar";
import TelegramChart from "../components/ui/TelegramChart";
import TelegramWallpaper from "../components/ui/TelegramWallpaper";
import { toastNotification } from "../components/ui/Toast";
import { useTranslation } from "../contexts/TranslationContext";
import useQueryFeedback from "../hooks/useQueryFeedback";
import { LottieAnimations } from "../utils/animations";
import { oneOfOr } from "../utils/general";
import { match } from "../utils/helpers";
import { clamp, formatTGCount } from "../utils/number";
import { objectToStringRecord } from "../utils/object";
import { store } from "../utils/store";
import {
	invokeHapticFeedbackImpact,
	openLink,
	postEvent,
	theme,
} from "../utils/telegram";

export const EntityPattern = "/patterns/animals.svg";

const PageEntity: Component = () => {
	const { t, td } = useTranslation();

	const params = useParams();
	const key = ["entity", params.id];

	const query = useQuery(() => ({
		queryKey: key,
		queryFn: (data) => apiEntity(data.queryKey[1]!),
	}));

	const queryClient = useQueryClient();

	const debouncedMutationFunction = debounce(
		(id: string, data: Partial<Entity>) => {
			return apiEntityUpdate(id, objectToStringRecord(data));
		},
		1_000,
	);

	const mutation = useMutation(() => ({
		mutationKey: key,
		mutationFn: async (data: Partial<Entity>) =>
			debouncedMutationFunction(params.id!, data),
		onMutate: async (data) => {
			await queryClient.cancelQueries({ queryKey: key });

			const old = queryClient.getQueryData(key) as ResponseEntity;

			queryClient.setQueryData<ResponseEntity>(key, () => {
				return { entity: { ...old.entity, ...data } } as ResponseEntity;
			});

			return { old, key };
		},
		onError: (error, _, context) => {
			if (!context) return;

			queryClient.setQueryData(context.key, context.old);

			toastNotification({
				text: error.message,
				type: "error",
			});
		},
	}));

	const wallpaper = {
		colors: createMemo(() =>
			theme() === "dark"
				? ["#dbddbb", "#6ba587", "#d5d88d", "#88b884"]
				: ["#dbddbb", "#6ba587", "#d5d88d", "#88b884"],
		),
		pattern: createMemo(() =>
			theme() === "dark"
				? {
						image: EntityPattern,
						background: "#000000",
						blur: 0,
						size: "420px",
						opacity: 0.5,
						mask: true,
					}
				: {
						image: EntityPattern,
						background: "#000000",
						blur: 0,
						size: "420px",
						opacity: 0.5,
						mask: false,
					},
		),
		tails: createMemo(() => (query.isLoading ? 15 : 90)),
		animate: createMemo(() => query.isLoading),
	};

	useQueryFeedback({
		query,
		options: {
			hapticOnError: true,
			hapticOnSuccess: true,
			toastOnError: true,
			refetchKey: "entity",
		},
	});

	const [updateSignal, setUpdateSignal] = createSignal(false);
	const initialHeight = window.visualViewport?.height || window.innerHeight;

	const handleVisualViewport = () => {
		const currentHeight = window.visualViewport?.height || window.innerHeight;
		if (currentHeight < initialHeight) {
			const activeEl = document.activeElement as HTMLElement | null;
			if (activeEl) {
				setTimeout(() => {
					activeEl.scrollIntoView({ behavior: "smooth", block: "center" });
				}, 250);
			}
		}

		setTimeout(() => {
			setUpdateSignal(!updateSignal());
		}, 250);
	};

	onMount(() => {
		if (window.visualViewport) {
			window.visualViewport.addEventListener("resize", handleVisualViewport, {
				passive: true,
			});
		} else {
			window.addEventListener("resize", handleVisualViewport, {
				passive: true,
			});
		}
	});

	onCleanup(() => {
		if (window.visualViewport) {
			window.visualViewport.removeEventListener("resize", handleVisualViewport);
		} else {
			window.removeEventListener("resize", handleVisualViewport);
		}
	});

	const onBackButton = () => {
		if (navigator.isBackable()) {
			navigator.back();
		} else {
			navigator.go("/");
		}
	};

	const Entity: Component<{ entity: Entity }> = (props) => {
		const EntityHeader = () => {
			return (
				<header>
					<div>
						<h1>{props.entity.name}</h1>
						<span>
							{td(
								match(
									props.entity.type,
									[
										["channel", "general.subscribers"],
										["supergroup", "general.members"],
									],
									"general.subscribers",
								),
								{
									count: formatTGCount(props.entity.members_count),
								},
							)}
						</span>
					</div>

					<PeerProfile
						name={props.entity.name}
						peerId={Number(props.entity.chat_id)}
						username={props.entity.username}
					/>
				</header>
			);
		};

		const EntityBody = () => {
			const [selectedTab, setSelectedTab] = createSignal(
				oneOfOr(params.tab!, ["overview", "statistics"], "overview"),
			);

			createEffect(() => {
				navigator.go(`/entity/${props.entity.id}/${selectedTab()}`, {
					skipHistory: true,
				});
			});

			const SectionInfoList = () => {
				return (
					<ul id="container-infolist">
						<li id="container-infolist-language">
							<TbOutlineWorld />

							<b>
								{props.entity.language_code &&
								props.entity.language_code !== "none"
									? store.languages?.[props.entity.language_code]
									: t("pages.entity.infolist.language.undefined")}
							</b>

							<span>{t("pages.entity.infolist.language.label")}</span>
						</li>

						<li id="container-infolist-category">
							<TbOutlineCategory2 />

							<b>
								{props.entity.category && props.entity.category !== "none"
									? store.categories?.[props.entity.category]
									: t("pages.entity.infolist.category.undefined")}
							</b>

							<span>{t("pages.entity.infolist.category.label")}</span>
						</li>

						<li id="container-infolist-status">
							<Show
								when={props.entity.is_active}
								fallback={<TbOutlineCircleDashed />}
							>
								<TbOutlineCircleDashedCheck />
							</Show>

							<b>
								{props.entity.is_active
									? t("pages.entity.infolist.status.status.active")
									: t("pages.entity.infolist.status.status.inactive")}
							</b>

							<span>{t("pages.entity.infolist.status.label")}</span>
						</li>

						<li id="container-infolist-verification">
							<Show
								when={props.entity.is_verified}
								fallback={<TbOutlineRosette />}
							>
								<TbFillRosetteDiscountCheck />
							</Show>

							<b>
								{props.entity.is_verified
									? t("pages.entity.infolist.verification.status.verified")
									: t("pages.entity.infolist.verification.status.unverified")}
							</b>

							<span>{t("pages.entity.infolist.verification.label")}</span>
						</li>
					</ul>
				);
			};

			const SectionStatisticsOverview = () => {
				const SectionStatisticsOverviewChannel = () => {
					if (!(props.entity.type === "channel" && props.entity.statistic))
						return;

					return (
						<Section
							type="glass"
							title={t("pages.entity.overview.title.channel")}
							subtitle={td("pages.entity.overview.range", {
								from: new Date(
									props.entity.statistic.period.minDate * 1000,
								).toLocaleDateString("en-US", {
									year: "numeric",
									month: "short",
									day: "numeric",
								}),
								to: new Date(
									props.entity.statistic.period.maxDate * 1000,
								).toLocaleDateString("en-US", {
									year: "numeric",
									month: "short",
									day: "numeric",
								}),
							})}
						>
							<ul>
								<li>
									<b>
										{formatTGCount(props.entity.statistic.followers.current)}

										<StatsDiff
											current={props.entity.statistic.followers.current}
											previous={props.entity.statistic.followers.previous}
										/>
									</b>

									<span>
										{t("pages.entity.overview.channel.followers.label")}
									</span>
								</li>

								<li>
									<b>
										{props.entity.statistic.enabledNotifications.total === 0
											? "0"
											: Math.trunc(
													(props.entity.statistic.enabledNotifications.part /
														props.entity.statistic.enabledNotifications.total) *
														1000,
												) / 10}
										%
									</b>

									<span>
										{t(
											"pages.entity.overview.channel.enabledNotifications.label",
										)}
									</span>
								</li>

								<li>
									<b>
										{formatTGCount(props.entity.statistic.viewsPerPost.current)}

										<StatsDiff
											current={props.entity.statistic.viewsPerPost.current}
											previous={props.entity.statistic.viewsPerPost.previous}
										/>
									</b>

									<span>
										{t("pages.entity.overview.channel.viewsPerPost.label")}
									</span>
								</li>

								<li>
									<b>
										{formatTGCount(
											props.entity.statistic.sharesPerPost.current,
										)}

										<StatsDiff
											current={props.entity.statistic.sharesPerPost.current}
											previous={props.entity.statistic.sharesPerPost.previous}
										/>
									</b>

									<span>
										{t("pages.entity.overview.channel.sharesPerPost.label")}
									</span>
								</li>

								<li>
									<b>
										{formatTGCount(
											props.entity.statistic.viewsPerStory.current,
										)}

										<StatsDiff
											current={props.entity.statistic.viewsPerStory.current}
											previous={props.entity.statistic.viewsPerStory.previous}
										/>
									</b>

									<span>
										{t("pages.entity.overview.channel.viewsPerStory.label")}
									</span>
								</li>

								<li>
									<b>
										{formatTGCount(
											props.entity.statistic.sharesPerStory.current,
										)}

										<StatsDiff
											current={props.entity.statistic.sharesPerStory.current}
											previous={props.entity.statistic.sharesPerStory.previous}
										/>
									</b>

									<span>
										{t("pages.entity.overview.channel.sharesPerStory.label")}
									</span>
								</li>

								<li>
									<b>
										{formatTGCount(
											props.entity.statistic.reactionsPerPost.current,
										)}

										<StatsDiff
											current={props.entity.statistic.reactionsPerPost.current}
											previous={
												props.entity.statistic.reactionsPerPost.previous
											}
										/>
									</b>

									<span>
										{t("pages.entity.overview.channel.reactionsPerPost.label")}
									</span>
								</li>

								<Show
									when={
										props.entity.statistic.premiumAudience.part &&
										props.entity.statistic.premiumAudience.total
									}
								>
									<li>
										<b>
											{props.entity.statistic.premiumAudience.total === 0
												? "0"
												: Math.trunc(
														(props.entity.statistic.premiumAudience.part! /
															props.entity.statistic.premiumAudience.total!) *
															1000,
													) / 10}
											%
											<Show
												when={props.entity.statistic.premiumAudience.part! > 0}
											>
												<span class="stats-diff stats-diff-grow">
													+{props.entity.statistic.premiumAudience.part}
												</span>
											</Show>
										</b>

										<span>
											{t("pages.entity.overview.channel.premiumAudience.label")}
										</span>
									</li>
								</Show>
							</ul>
						</Section>
					);
				};

				const SectionStatisticsOverviewGroup = () => {
					if (!(props.entity.type === "supergroup" && props.entity.statistic))
						return;

					return (
						<Section
							type="glass"
							title={t("pages.entity.overview.title.group")}
							subtitle={td("pages.entity.overview.range", {
								from: new Date(
									props.entity.statistic.period.minDate * 1000,
								).toLocaleDateString("en-US", {
									year: "numeric",
									month: "short",
									day: "numeric",
								}),
								to: new Date(
									props.entity.statistic.period.maxDate * 1000,
								).toLocaleDateString("en-US", {
									year: "numeric",
									month: "short",
									day: "numeric",
								}),
							})}
						>
							<ul>
								<li>
									<b>
										{formatTGCount(props.entity.statistic.members.current)}

										<StatsDiff
											current={props.entity.statistic.members.current}
											previous={props.entity.statistic.members.previous}
										/>
									</b>

									<span>{t("pages.entity.overview.group.members.label")}</span>
								</li>

								<li>
									<b>
										{formatTGCount(props.entity.statistic.messages.current)}

										<StatsDiff
											current={props.entity.statistic.messages.current}
											previous={props.entity.statistic.messages.previous}
										/>
									</b>

									<span>{t("pages.entity.overview.group.messages.label")}</span>
								</li>

								<li>
									<b>
										{formatTGCount(props.entity.statistic.viewers.current)}

										<StatsDiff
											current={props.entity.statistic.viewers.current}
											previous={props.entity.statistic.viewers.previous}
										/>
									</b>

									<span>
										{t("pages.entity.overview.group.viewingMembers.label")}
									</span>
								</li>

								<li>
									<b>
										{formatTGCount(props.entity.statistic.posters.current)}

										<StatsDiff
											current={props.entity.statistic.posters.current}
											previous={props.entity.statistic.posters.previous}
										/>
									</b>

									<span>
										{t("pages.entity.overview.group.postingMembers.label")}
									</span>
								</li>

								<Show
									when={
										props.entity.statistic.premiumAudience.part &&
										props.entity.statistic.premiumAudience.total
									}
								>
									<li>
										<b>
											{props.entity.statistic.premiumAudience.total === 0
												? "0"
												: Math.trunc(
														(props.entity.statistic.premiumAudience.part! /
															props.entity.statistic.premiumAudience.total!) *
															1000,
													) / 10}
											%
											<Show
												when={props.entity.statistic.premiumAudience.part! > 0}
											>
												<span class="stats-diff stats-diff-grow">
													+{props.entity.statistic.premiumAudience.part}
												</span>
											</Show>
										</b>

										<span>
											{t("pages.entity.overview.channel.premiumAudience.label")}
										</span>
									</li>
								</Show>
							</ul>
						</Section>
					);
				};

				const SectionStatisticsEmpty: Component<{ title?: string }> = (
					props,
				) => {
					return (
						<Section
							class="entity-section-statistics-empty"
							type="glass"
							title={props.title}
						>
							<Placeholder
								symbol={() => (
									<LottiePlayer
										src={LottieAnimations.emoji.chart.url}
										outline={LottieAnimations.emoji.chart.outline}
										autoplay
										loop
									/>
								)}
								description={t("pages.entity.overview.empty.text")}
							/>
						</Section>
					);
				};

				return (
					<div class="entity-section-statistics-overview">
						<Switch>
							<Match when={!props.entity.statistic}>
								<SectionStatisticsEmpty
									title={
										props.entity.type === "channel"
											? t("pages.entity.overview.title.channel")
											: t("pages.entity.overview.title.group")
									}
								/>
							</Match>

							<Match when={props.entity.type === "channel"}>
								<SectionStatisticsOverviewChannel />
							</Match>

							<Match when={props.entity.type === "supergroup"}>
								<SectionStatisticsOverviewGroup />
							</Match>
						</Switch>
					</div>
				);
			};

			const TabOverviewViewer = () => {
				return (
					<div id="container-tab-overview-viewer">
						<SectionStatisticsOverview />
					</div>
				);
			};

			const TabOverviewOwner = () => {
				const SectionOverviewOwnerOptions = () => {
					return (
						<SectionList
							type="glass"
							title={t(`pages.entity.options.title.${props.entity.type}`)}
							class="container-section-overview-owner-options"
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
											value={props.entity.category}
											setValue={(value) => {
												mutation.mutate({
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
											value={props.entity.language_code}
											setValue={(value) => {
												mutation.mutate({
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
												when={props.entity.is_verified}
												fallback={
													<p
														classList={{
															clickable: props.entity.is_active,
															disabled: !props.entity.is_active,
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
								{
									label: t("pages.entity.options.section.status.label"),
									placeholder: () => (
										<div class="pe-4!">
											<span
												class={`badge badge-${props.entity.is_active ? "active" : "inactive"}`}
											>
												{props.entity.is_active ? "active" : "inactive"}
											</span>
										</div>
									),
								},
							]}
						/>
					);
				};

				const SectionOverviewOwnerAdTypes = () => {
					const SectionAdType: Component<{ item: EntityAd }> = (adProps) => {
						const [price, setPrice] = createSignal(adProps.item.price.perHour);
						const priceDisplayValue = createMemo(() =>
							price() > 0 ? price().toString() : "",
						);

						return (
							<div
								class="container-section-overview-owner-adtype"
								classList={{ inactive: !props.entity.is_active }}
							>
								<SectionList
									type="glass"
									title={t(`pages.entity.ads.types.${adProps.item.type}.title`)}
									description={t(
										`pages.entity.ads.types.${adProps.item.type}.description`,
									)}
									items={[
										{
											label: t("pages.entity.ads.options.active.label"),
											placeholder: () => (
												<SectionListSwitch
													value={adProps.item.active}
													setValue={(value) => {
														queryClient.setQueryData<ResponseEntity>(
															key,
															(old) => {
																if (!old?.entity.ads) return;

																return {
																	entity: {
																		...old.entity,
																		ads: Object.fromEntries([
																			...Object.entries(old.entity.ads),
																			[
																				adProps.item.type,
																				{ ...adProps.item, active: value },
																			],
																		]),
																	},
																} as ResponseEntity;
															},
														);

														setTimeout(() => {
															mutation.mutate({
																ads: props.entity.ads,
															});
														});
													}}
												/>
											),
										},
										{
											label: t("pages.entity.ads.options.maxPeriod.label"),
											placeholder: () => (
												<SectionListSelect
													value={adProps.item.period.max.toString()}
													setValue={(value) => {
														queryClient.setQueryData<ResponseEntity>(
															key,
															(old) => {
																if (!old?.entity.ads) return;

																return {
																	entity: {
																		...old.entity,
																		ads: Object.fromEntries([
																			...Object.entries(old.entity.ads),
																			[
																				adProps.item.type,
																				{
																					...adProps.item,
																					period: {
																						...adProps.item.period,
																						max: Number(value),
																					},
																				},
																			],
																		]),
																	},
																} as ResponseEntity;
															},
														);

														setTimeout(() => {
															mutation.mutate({
																ads: props.entity.ads,
															});
														});
													}}
													items={[
														{
															label: "1 Day",
															value: "24",
														},
														{
															label: "2 Days",
															value: "48",
														},
														{
															label: "3 Days",
															value: "72",
														},
														{
															label: "4 Days",
															value: "96",
														},
														{
															label: "5 Days",
															value: "120",
														},
														{
															label: "6 Days",
															value: "144",
														},
														{
															label: "7 Days",
															value: "168",
														},
													]}
												/>
											),
											disabled: !adProps.item.active,
										},
										{
											label: t("pages.entity.ads.options.unit.label"),
											placeholder: () => (
												<SectionListSelect
													value={adProps.item.period.unit.toString()}
													setValue={(value) => {
														queryClient.setQueryData<ResponseEntity>(
															key,
															(old) => {
																if (!old?.entity.ads) return;

																return {
																	entity: {
																		...old.entity,
																		ads: Object.fromEntries([
																			...Object.entries(old.entity.ads),
																			[
																				adProps.item.type,
																				{
																					...adProps.item,
																					period: {
																						...adProps.item.period,
																						unit: Number(value),
																					},
																				},
																			],
																		]),
																	},
																} as ResponseEntity;
															},
														);

														setTimeout(() => {
															mutation.mutate({
																ads: props.entity.ads,
															});
														});
													}}
													items={[
														{
															label: "1 Hour",
															value: "1",
														},
														{
															label: "2 Hours",
															value: "2",
														},
														{
															label: "3 Hours",
															value: "3",
														},
														{
															label: "4 Hours",
															value: "4",
														},
														{
															label: "6 Hours",
															value: "6",
														},
														{
															label: "8 Hours",
															value: "8",
														},
														{
															label: "12 Hours",
															value: "12",
														},
														{
															label: "24 Hours",
															value: "24",
														},
													]}
												/>
											),
											disabled: !adProps.item.active,
										},
										{
											label: t("pages.entity.ads.options.price.label"),
											placeholder: () => (
												<SectionListInput
													class="input-price"
													type="text"
													inputmode="decimal"
													append={() => <SVGSymbol id="TON" />}
													value={priceDisplayValue()}
													placeholder={t(
														"pages.entity.ads.options.price.placeholder",
													)}
													setValue={(input) => {
														let value = store.limits?.adType.price.perHour.min;

														if (!(input === "" || input === "0")) {
															value = clamp(
																Number.isNaN(Number.parseFloat(input))
																	? store.limits?.adType.price.perHour.min
																	: Number.parseFloat(input),
																store.limits?.adType.price.perHour.min,
																store.limits?.adType.price.perHour.max,
															);
														}

														setPrice(value);
													}}
													onBlur={() => {
														if (price() === adProps.item.price.perHour) return;

														queryClient.setQueryData<ResponseEntity>(
															key,
															(old) => {
																if (!old?.entity.ads) return;

																return {
																	entity: {
																		...old.entity,
																		ads: Object.fromEntries([
																			...Object.entries(old.entity.ads),
																			[
																				adProps.item.type,
																				{
																					...adProps.item,
																					price: {
																						...adProps.item.price,
																						perHour: Number(price()),
																					},
																				},
																			],
																		]),
																	},
																} as ResponseEntity;
															},
														);

														setTimeout(() => {
															mutation.mutate({
																ads: props.entity.ads,
															});
														});
													}}
													min={store.limits?.adType.price.perHour.min}
													max={store.limits?.adType.price.perHour.max}
												/>
											),
											disabled: !adProps.item.active,
										},
									]}
								/>

								<Show when={!props.entity.is_active}>
									<div class="placeholder">
										<Placeholder
											symbol={TbOutlineEyeOff}
											description={t("pages.entity.ads.inactive.text")}
										/>
									</div>
								</Show>
							</div>
						);
					};

					return (
						<Switch>
							<Match when={props.entity.type === "channel"}>
								<SectionAdType item={props.entity.ads!["channel-post"]} />

								<SectionAdType item={props.entity.ads!["channel-story"]} />
							</Match>

							<Match when={props.entity.type === "supergroup"}>
								<SectionAdType item={props.entity.ads!["group-pin"]} />
							</Match>
						</Switch>
					);
				};

				return (
					<div id="container-tab-overview-owner">
						<SectionStatisticsOverview />

						<SectionOverviewOwnerOptions />

						<SectionOverviewOwnerAdTypes />
					</div>
				);
			};

			const TabStatistics = () => {
				const statistics: { title: string; subtitle?: string; data: any }[] =
					[];

				if (props.entity.type === "channel") {
					statistics.push({
						title: t("pages.entity.statistics.charts.channel.growth.title"),
						data: props.entity.statistic?.growthGraph,
					});

					statistics.push({
						title: t("pages.entity.statistics.charts.channel.followers.title"),
						data: props.entity.statistic?.followersGraph,
					});

					// statistics.push({
					// 	title: t(
					// 		"pages.entity.statistics.charts.channel.notifications.title",
					// 	),
					// 	data: props.entity.statistic?.muteGraph,
					// });

					statistics.push({
						title: t(
							"pages.entity.statistics.charts.channel.viewsByHours.title",
						),
						data: props.entity.statistic?.topHoursGraph,
					});

					statistics.push({
						title: t(
							"pages.entity.statistics.charts.channel.viewsBySource.title",
						),
						data: props.entity.statistic?.viewsBySourceGraph,
					});

					// statistics.push({
					// 	title: t(
					// 		"pages.entity.statistics.charts.channel.followersBySource.title",
					// 	),
					// 	data: props.entity.statistic?.newFollowersBySourceGraph,
					// });

					statistics.push({
						title: t("pages.entity.statistics.charts.channel.languages.title"),
						data: props.entity.statistic?.languagesGraph,
					});

					statistics.push({
						title: t(
							"pages.entity.statistics.charts.channel.interactions.title",
						),
						data: props.entity.statistic?.interactionsGraph,
					});

					// statistics.push({
					// 	title: t(
					// 		"pages.entity.statistics.charts.channel.reactionsByEmotion.title",
					// 	),
					// 	data: props.entity.statistic?.reactionsByEmotionGraph,
					// });
				} else if (props.entity.type === "supergroup") {
					statistics.push({
						title: t("pages.entity.statistics.charts.group.growth.title"),
						data: props.entity.statistic?.growthGraph,
					});

					statistics.push({
						title: t("pages.entity.statistics.charts.group.members.title"),
						data: props.entity.statistic?.membersGraph,
					});

					statistics.push({
						title: t(
							"pages.entity.statistics.charts.group.membersPrimaryLanguage.title",
						),
						data: props.entity.statistic?.languagesGraph,
					});

					statistics.push({
						title: t("pages.entity.statistics.charts.group.messages.title"),
						data: props.entity.statistic?.messagesGraph,
					});

					statistics.push({
						title: t("pages.entity.statistics.charts.group.topHours.title"),
						data: props.entity.statistic?.topHoursGraph,
					});

					statistics.push({
						title: t(
							"pages.entity.statistics.charts.group.topDaysOfWeek.title",
						),
						data: props.entity.statistic?.weekdaysGraph,
					});
				}

				return (
					<div id="container-tab-statistics">
						<For each={statistics}>
							{(statistic) => (
								<Section type="glass" title={statistic.title}>
									<Show
										when={statistic.data}
										fallback={
											<Placeholder
												description={t("pages.entity.overview.empty.text")}
											/>
										}
									>
										<TelegramChart
											data={{ ...JSON.parse(JSON.stringify(statistic.data)) }}
										/>
									</Show>
								</Section>
							)}
						</For>
					</div>
				);
			};

			const tabbar: TabbarItem[] = [
				{
					title: t("pages.entity.tabs.overview.title"),
					slug: "overview",
					component:
						props.entity.role === "owner"
							? TabOverviewOwner
							: TabOverviewViewer,
				},
				{
					title: t("pages.entity.tabs.statistics.title"),
					slug: "statistics",
					component: TabStatistics,
				},
			];

			return (
				<section id="entity-section-body">
					<SectionInfoList />

					<Tabbar
						id="entity-section-tabbar"
						items={tabbar}
						value={selectedTab()}
						setValue={setSelectedTab}
						autoHeight
						updateSignal={updateSignal}
					/>
				</section>
			);
		};

		const EntityFooter = () => {
			return (
				<footer class="safe-area-bottom">
					<div>
						<Switch>
							<Match when={props.entity.role === "owner"}>
								<div>{/* Slot */}</div>

								<Clickable
									onClick={() => {
										invokeHapticFeedbackImpact("soft");
										openLink(`https://t.me/${props.entity.username}`);
									}}
								>
									<div>
										<span>
											{t(`pages.entity.footer.view.${props.entity.type}.text`)}
										</span>
									</div>
								</Clickable>

								<div>
									<Clickable
										onClick={() => {
											invokeHapticFeedbackImpact("soft");

											postEvent("web_app_open_tg_link", {
												path_full: `/share/url?url=https://t.me/${import.meta.env.VITE_BOT_USERNAME}/${import.meta.env.VITE_MINIAPP_SLUG}?startapp=entity-${props.entity.id}&text=${encodeURI(
													td("pages.entity.footer.share.text", {
														name: props.entity.name,
														app_name: t("general.appName"),
													}),
												)}`,
											});
										}}
									>
										<div>
											<TbOutlineShare3 />
										</div>
									</Clickable>
								</div>
							</Match>

							<Match when={props.entity.role === "viewer"}>Viewer</Match>
						</Switch>
					</div>
				</footer>
			);
		};

		return (
			<div class="container-entity">
				<Scrollable>
					<EntityHeader />

					<EntityBody />
				</Scrollable>

				<EntityFooter />
			</div>
		);
	};

	const EntityShimmer: Component = () => {
		return <Shimmer id="shimmer-entity">Loading...</Shimmer>;
	};

	return (
		<>
			<Page id="container-page-entity">
				<TelegramWallpaper
					colors={wallpaper.colors()}
					pattern={wallpaper.pattern()}
					tails={wallpaper.tails()}
					animate={wallpaper.animate()}
				/>

				<Suspense fallback={<EntityShimmer />}>
					<Show when={query.data?.entity}>
						<Entity entity={query.data?.entity as Entity} />
					</Show>
				</Suspense>
			</Page>

			<BackButton onClick={onBackButton} />
		</>
	);
};

export default PageEntity;
