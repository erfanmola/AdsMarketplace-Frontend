import { useInfiniteQuery } from "@tanstack/solid-query";
import { SVGSymbol } from "../components/SVG";
import { useTranslation } from "../contexts/TranslationContext";
import Page, { PageHeaderIconList } from "../layouts/Page";
import { setModals } from "../utils/modal";
import "./Publishers.scss";

import createFuzzySearch from "@nozbe/microfuzz";
import LottiePlayer from "lottix/solid/LottiePlayer";
import {
	type Component,
	createMemo,
	createSignal,
	For,
	Match,
	Show,
	Suspense,
	Switch,
} from "solid-js";
import { createStore } from "solid-js/store";
import { apiEntitiesOwned } from "../api";
import type { OwnedEntity } from "../api/api";
import { rootBottomBarSearchQuery } from "../components/RootBottomBar";
import Clickable from "../components/ui/Clickable";
import PeerProfile from "../components/ui/PeerProfile";
import Placeholder from "../components/ui/Placeholder";
import Scrollable from "../components/ui/Scrollable";
import Shimmer from "../components/ui/Shimmer";
import Tabbar, { type TabbarItem } from "../components/ui/Tabbar";
import useQueryFeedback from "../hooks/useQueryFeedback";
import { LottieAnimations } from "../utils/animations";
import { match } from "../utils/helpers";
import { navigator } from "../utils/navigator";
import { formatTGCount } from "../utils/number";

const PagePublishers: Component = () => {
	const { t, td } = useTranslation();

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

	const [scrollers, setScrollers] = createStore({
		tabbar: false,
		all: false,
		active: false,
		inactive: false,
		verified: false,
	});

	const onClickAdd = () => {
		setModals("publishersAdd", "open", true);
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

	const EntitiesOwned = () => {
		const items = createMemo(() => {
			const items = query.data?.pages.flatMap((page) => page.entities) ?? [];

			if (rootBottomBarSearchQuery().length > 0) {
				const fuzzySearch = createFuzzySearch(items, {
					getText: (item) => [
						item.name,
						item.username,
						item.chat_id,
						item.members_count,
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
			active: createMemo(() => items().filter((i) => i.is_active)),
			inactive: createMemo(() => items().filter((i) => !i.is_active)),
			verified: createMemo(() => items().filter((i) => i.is_verified)),
		};

		const EntitiesList: Component<{
			items: Partial<OwnedEntity>[];
			scroller: keyof typeof scrollers;
		}> = (props) => {
			const Entity: Component<{ entity: Partial<OwnedEntity> }> = (props) => {
				const badge = createMemo(() => {
					if (props.entity.is_verified) return "verified";

					if (props.entity.is_active) return "active";

					return "inactive";
				});

				const onClickEntity = (e: MouseEvent) => {
					const id = (e.currentTarget as HTMLElement).getAttribute("data-id");
					const entity = items().find((i) => i.id === id);
					if (!entity) return;
					navigator.go(`/entity/${entity.id}`);
				};

				return (
					<div
						class="entity-row"
						data-id={props.entity.id}
						onClick={onClickEntity}
					>
						<PeerProfile
							name={props.entity.name!}
							peerId={Number(String(props.entity.chat_id).replace("-100", ""))}
							username={props.entity.username}
						/>

						<div>
							<span>{props.entity.name}</span>

							<div>
								<Switch>
									<Match when={props.entity.type === "channel"}>
										<SVGSymbol id="RiBusinessMegaphoneLine" />
									</Match>

									<Match when={props.entity.type === "supergroup"}>
										<SVGSymbol id="RiUserFacesGroupLine" />
									</Match>
								</Switch>

								<span>
									{td(
										match(
											props.entity.type,
											[
												["channel", "general.subscribers"],
												["supergroup", "general.members"],
											],
											"general.members",
										),
										{
											count: formatTGCount(props.entity.members_count!),
										},
									)}
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
									title={t("pages.publishers.items.empty.subtitle")}
								/>
							</div>
						}
					>
						<div class="safe-area-bottombar">
							<div class="container-entity-rows">
								<For each={props.items}>
									{(item) => <Entity entity={item} />}
								</For>
							</div>
						</div>
					</Show>
				</Scrollable>
			);
		};

		const [selectedTab, setSelectedTab] = createSignal("all");
		const tabbar: TabbarItem[] = [
			{
				slug: "all",
				title: t("pages.publishers.tabs.all"),
				component: () => <EntitiesList items={filters.all()} scroller="all" />,
			},
			{
				slug: "active",
				title: t("pages.publishers.tabs.active"),
				component: () => (
					<EntitiesList items={filters.active()} scroller="active" />
				),
			},
			{
				slug: "inactive",
				title: t("pages.publishers.tabs.inactive"),
				component: () => (
					<EntitiesList items={filters.inactive()} scroller="inactive" />
				),
			},
			{
				slug: "verified",
				title: t("pages.publishers.tabs.verified"),
				component: () => (
					<EntitiesList items={filters.verified()} scroller="verified" />
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
											src={LottieAnimations.duck.acceptMoney.url}
											outline={LottieAnimations.duck.acceptMoney.outline}
											autoplay
											playOnClick
										/>
									)}
									title={t("pages.publishers.items.empty.title")}
									description={t("pages.publishers.items.empty.description")}
									button={() => (
										<Clickable onClick={onClickAdd} class="p-4!">
											{t("pages.publishers.items.empty.button")}
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
									title={t("pages.publishers.items.empty.search.title")}
									description={td(
										"pages.publishers.items.empty.search.description",
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

	const EntitiesOwnedShimmer = () => {
		return (
			<Shimmer id="shimmer-entities-owned" tint>
				<span />

				<div class="container-entity-rows">
					<For each={Array.from(new Array(8))}>
						{() => (
							<div class="entity-row">
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
			id="container-page-publishers"
			title={t("pages.publishers.title")}
			headerAppend={HeaderAppend}
		>
			<Suspense fallback={<EntitiesOwnedShimmer />}>
				<EntitiesOwned />
			</Suspense>
		</Page>
	);
};

export default PagePublishers;
