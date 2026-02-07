import { useQuery } from "@tanstack/solid-query";
import BackButton from "../components/tma/BackButton";
import Page from "../layouts/Page";
import { navigator } from "../utils/navigator";
import "./Entity.scss";

import { useParams } from "@solidjs/router";
import LottiePlayer from "lottix/solid/LottiePlayer";
import {
	type Component,
	createEffect,
	createMemo,
	createSignal,
	Match,
	Show,
	Suspense,
	Switch,
} from "solid-js";
import { apiEntity } from "../api";
import type { Entity } from "../api/api";
import PeerProfile from "../components/ui/PeerProfile";
import Scrollable from "../components/ui/Scrollable";
import Section from "../components/ui/Section";
import Shimmer from "../components/ui/Shimmer";
import StatsDiff from "../components/ui/StatsDiff";
import Tabbar, { type TabbarItem } from "../components/ui/Tabbar";
import TelegramWallpaper from "../components/ui/TelegramWallpaper";
import { useTranslation } from "../contexts/TranslationContext";
import useQueryFeedback from "../hooks/useQueryFeedback";
import { LottieAnimations } from "../utils/animations";
import { oneOfOr } from "../utils/general";
import { match } from "../utils/helpers";
import { formatTGCount } from "../utils/number";
import { theme } from "../utils/telegram";

export const EntityPattern = "/patterns/animals.svg";

const PageEntity: Component = () => {
	const { t, td } = useTranslation();

	const params = useParams();
	const query = useQuery(() => ({
		queryKey: ["entity", params.id],
		queryFn: (data) => apiEntity(data.queryKey[1]!),
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

			const SectionStatisticsEmpty: Component<{ title?: string }> = (props) => {
				return (
					<Section
						class="entity-section-statistics-empty"
						type="glass"
						title={props.title}
					>
						<LottiePlayer
							src={LottieAnimations.emoji.chart.url}
							outline={LottieAnimations.emoji.chart.outline}
							autoplay
							loop
						/>

						<span>{t("pages.entity.overview.empty.text")}</span>
					</Section>
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

								{/*<li>
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
								</li>*/}
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
							</ul>
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
				return (
					<div id="container-tab-overview-owner">
						<SectionStatisticsOverview />
					</div>
				);
			};

			const TabStatistics = () => {
				return <div>Statistics Viewer</div>;
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
					<Tabbar
						id="entity-section-tabbar"
						items={tabbar}
						value={selectedTab()}
						setValue={setSelectedTab}
						autoHeight
					/>
				</section>
			);
		};

		const EntityFooter = () => {
			return <footer class="safe-area-bottom">Footer</footer>;
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
