import { useInfiniteQuery } from "@tanstack/solid-query";
import { SVGSymbol } from "../components/SVG";
import { useTranslation } from "../contexts/TranslationContext";
import Page, { PageHeaderIconList } from "../layouts/Page";
import { setModals } from "../utils/modal";
import "./Publishers.scss";

import LottiePlayer from "lottix/solid/LottiePlayer";
import {
	type Component,
	createMemo,
	createSignal,
	For,
	Show,
	Suspense,
} from "solid-js";
import { createStore } from "solid-js/store";
import { apiEntitiesOwned } from "../api";
import type { OwnedEntity } from "../api/api";
import Clickable from "../components/ui/Clickable";
import Placeholder from "../components/ui/Placeholder";
import PullToRefresh from "../components/ui/PullToRefresh";
import Scrollable from "../components/ui/Scrollable";
import Shimmer from "../components/ui/Shimmer";
import Tabbar, { type TabbarItem } from "../components/ui/Tabbar";
import useQueryFeedback from "../hooks/useQueryFeedback";
import { LottieAnimations } from "../utils/animations";

const PagePublishers: Component = () => {
	const { t } = useTranslation();

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
		},
	});

	const [scrollers, setScrollers] = createStore({
		tabbar: false,
		all: false,
		active: false,
		inactive: false,
		pending: false,
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
		const items = createMemo(
			() => query.data?.pages.flatMap((page) => page.entities) ?? [],
		);

		const filters = {
			all: items,
			active: createMemo(() => items().filter((i) => i.is_active)),
			inactive: createMemo(() => items().filter((i) => !i.is_active)),
			pending: createMemo(() => items().filter((i) => i.is_verified)),
		};

		const EntitiesList: Component<{
			items: Partial<OwnedEntity>[];
			scroller: keyof typeof scrollers;
		}> = (props) => {
			return (
				<Scrollable
					class="p-4! pt-12!"
					setScrollingState={(value) => setScrollers(props.scroller, value)}
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
						<For each={props.items}>{(item) => <div>{item.name}</div>}</For>
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
				slug: "pending",
				title: t("pages.publishers.tabs.pending"),
				component: () => (
					<EntitiesList items={filters.pending()} scroller="pending" />
				),
			},
		] as const;

		return (
			<Show
				when={items().length > 0}
				fallback={
					<div class="flex flex-col h-full justify-center safe-area-bottombar">
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

	return (
		<Page
			id="container-page-publishers"
			title={t("pages.publishers.title")}
			headerAppend={HeaderAppend}
		>
			<PullToRefresh
				onRefresh={async () => {
					await query.refetch();
				}}
				shouldPullToRefresh={() => !Object.values(scrollers).some(Boolean)}
			>
				<Suspense
					fallback={<Shimmer id="shimmer-entities-owned">Loading...</Shimmer>}
				>
					<EntitiesOwned />
				</Suspense>
			</PullToRefresh>
		</Page>
	);
};

export default PagePublishers;
