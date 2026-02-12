import { useInfiniteQuery } from "@tanstack/solid-query";
import { SVGSymbol } from "../components/SVG";
import { useTranslation } from "../contexts/TranslationContext";
import Page, { PageHeaderIconList } from "../layouts/Page";
import { setModals } from "../utils/modal";
import "./Advertisers.scss";

import createFuzzySearch from "@nozbe/microfuzz";
import { useParams } from "@solidjs/router";
import LottiePlayer from "lottix/solid/LottiePlayer";
import {
	type Component,
	createEffect,
	createMemo,
	createSignal,
	For,
	Match,
	Show,
	Suspense,
	Switch,
} from "solid-js";
import { createStore } from "solid-js/store";
import { apiCampaignsOwned } from "../api";
import type { OwnedCampaign } from "../api/api";
import { rootBottomBarSearchQuery } from "../components/RootBottomBar";
import Clickable from "../components/ui/Clickable";
import PeerProfile from "../components/ui/PeerProfile";
import Placeholder from "../components/ui/Placeholder";
import Scrollable from "../components/ui/Scrollable";
import Shimmer from "../components/ui/Shimmer";
import Tabbar, { type TabbarItem } from "../components/ui/Tabbar";
import useQueryFeedback from "../hooks/useQueryFeedback";
import { LottieAnimations } from "../utils/animations";
import { oneOfOr } from "../utils/general";
import { navigator } from "../utils/navigator";
import { store } from "../utils/store";

const PageAdvertisers: Component = () => {
	const { t, td } = useTranslation();
	const params = useParams();

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
			refetchKey: "owned-campaigns",
		},
	});

	const [scrollers, setScrollers] = createStore({
		tabbar: false,
		all: false,
		ready: false,
		pending: false,
		disabled: false,
	});

	const onClickAdd = () => {
		setModals("campaignsAdd", "open", true);
	};

	const HeaderAppend = () => {
		return (
			<PageHeaderIconList
				items={[
					{
						component: () => <SVGSymbol id="FaSolidPlus" />,
						onClick: onClickAdd,
					},
				]}
			/>
		);
	};

	const CampaignsOwned = () => {
		const items = createMemo(() => {
			const items = query.data?.pages.flatMap((page) => page.campaigns) ?? [];

			if (rootBottomBarSearchQuery().length > 0) {
				const fuzzySearch = createFuzzySearch([...items], {
					getText: (item) => [
						item.name,
						item.language_code,
						item.category,
						item.type,
					],
				});

				const searchResults = fuzzySearch(rootBottomBarSearchQuery());

				return searchResults.map((result) => result.item);
			}

			return items;
		});

		const filters = {
			all: items,
			ready: createMemo(() => items().filter((i) => i.is_ready && i.is_active)),
			pending: createMemo(() =>
				items().filter((i) => !i.is_ready && i.is_active),
			),
			disabled: createMemo(() => items().filter((i) => !i.is_active)),
		};

		const CampaignsList: Component<{
			items: Partial<OwnedCampaign>[];
			scroller: keyof typeof scrollers;
		}> = (props) => {
			const Campaign: Component<{ campaign: Partial<OwnedCampaign> }> = (
				props,
			) => {
				const badge = createMemo(() => {
					if (!props.campaign.is_active) return "disabled";
					if (!props.campaign.is_ready) return "pending";
					return "ready";
				});

				const onClickCampaign = (e: MouseEvent) => {
					const id = (e.currentTarget as HTMLElement).getAttribute("data-id");
					const campaign = items().find((i) => i.id === id);
					if (!campaign) return;
					navigator.go(`/campaign/${campaign.id}`, {
						backable: true,
					});
				};

				return (
					<div
						class="campaign-row"
						data-id={props.campaign.id}
						onClick={onClickCampaign}
					>
						<PeerProfile
							peerId={Number(props.campaign.id?.match(/(\d+)/)?.[1] ?? 0)}
							alternateContent={() => (
								<span>
									<SVGSymbol id="BiRegularStore" />
								</span>
							)}
						/>

						<div>
							<span>{props.campaign.name}</span>

							<div>
								<span>
									{" "}
									{[
										props.campaign.language_code &&
											store.languages?.[props.campaign.language_code],
										props.campaign.category &&
											store.categories?.[props.campaign.category],
									]
										.filter(Boolean)
										.join(" | ")}
								</span>
							</div>
						</div>

						<div>
							<span class={`badge badge-${badge()}`}>{badge()}</span>
						</div>
					</div>
				);
			};

			return (
				<Scrollable
					class="p-4! pt-12!"
					setScrollingState={(value) => setScrollers(props.scroller, value)}
					onEnd={() => query.fetchNextPage()}
				>
					<Show
						when={props.items.length > 0}
						fallback={
							<div class="h-full flex flex-col justify-center safe-area-bottombar">
								<Placeholder
									symbol={() => (
										<LottiePlayer
											src={LottieAnimations.duck.egg.url}
											outline={LottieAnimations.duck.egg.outline}
											autoplay
											playOnClick
										/>
									)}
									title={t("pages.advertisers.items.empty.subtitle")}
								/>
							</div>
						}
					>
						<div class="safe-area-bottombar">
							<div class="container-campaign-rows">
								<For each={props.items}>
									{(item) => <Campaign campaign={item} />}
								</For>
							</div>
						</div>
					</Show>
				</Scrollable>
			);
		};

		const [selectedTab, setSelectedTab] = createSignal(
			oneOfOr(params.tab!, ["all", "ready", "pending", "disabled"], "all"),
		);

		createEffect(() => {
			navigator.go(`/advertisers/${selectedTab()}`);
		});

		const tabbar: TabbarItem[] = [
			{
				slug: "all",
				title: t("pages.advertisers.tabs.all"),
				component: () => <CampaignsList items={filters.all()} scroller="all" />,
			},
			{
				slug: "ready",
				title: t("pages.advertisers.tabs.ready"),
				component: () => (
					<CampaignsList items={filters.ready()} scroller="ready" />
				),
			},
			{
				slug: "pending",
				title: t("pages.advertisers.tabs.pending"),
				component: () => (
					<CampaignsList items={filters.pending()} scroller="pending" />
				),
			},
			{
				slug: "disabled",
				title: t("pages.advertisers.tabs.disabled"),
				component: () => (
					<CampaignsList items={filters.disabled()} scroller="disabled" />
				),
			},
		] as const;

		return (
			<Show
				when={items().length > 0}
				fallback={
					<div class="flex flex-col h-full justify-center safe-area-bottombar">
						<Switch
							fallback={
								<Placeholder
									symbol={() => (
										<LottiePlayer
											src={LottieAnimations.duck.launchPlane.url}
											outline={LottieAnimations.duck.launchPlane.outline}
											autoplay
											playOnClick
										/>
									)}
									title={t("pages.advertisers.items.empty.title")}
									description={t("pages.advertisers.items.empty.description")}
									button={() => (
										<Clickable onClick={onClickAdd} class="p-4!">
											{t("pages.advertisers.items.empty.button")}
										</Clickable>
									)}
								/>
							}
						>
							<Match when={rootBottomBarSearchQuery().length > 0}>
								<Placeholder
									symbol={() => (
										<LottiePlayer
											src={LottieAnimations.duck.hashtags.url}
											outline={LottieAnimations.duck.hashtags.outline}
											autoplay
											playOnClick
										/>
									)}
									title={t("pages.advertisers.items.empty.search.title")}
									description={td(
										"pages.advertisers.items.empty.search.description",
										{
											query: rootBottomBarSearchQuery(),
										},
									)}
								/>
							</Match>
						</Switch>
					</div>
				}
			>
				<Tabbar
					items={tabbar}
					value={selectedTab()}
					setValue={setSelectedTab}
					setScrollingState={(value) => setScrollers("tabbar", value)}
				/>
			</Show>
		);
	};

	const CampaignsOwnedShimmer = () => {
		return (
			<Shimmer id="shimmer-campaigns-owned" tint>
				<span />

				<div class="container-campaign-rows">
					<For each={Array.from(new Array(8))}>
						{() => (
							<div class="campaign-row">
								<div />

								<div>
									<span />

									<div>
										<span />
										<span />
									</div>
								</div>

								<div>
									<span />
								</div>
							</div>
						)}
					</For>
				</div>
			</Shimmer>
		);
	};

	return (
		<Page
			id="container-page-advertisers"
			title={t("pages.advertisers.title")}
			headerAppend={HeaderAppend}
		>
			<Suspense fallback={<CampaignsOwnedShimmer />}>
				<CampaignsOwned />
			</Suspense>
		</Page>
	);
};

export default PageAdvertisers;
