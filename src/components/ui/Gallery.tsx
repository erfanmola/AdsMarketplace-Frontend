import { type Component, For, Match, onMount, Show, Switch } from "solid-js";
import type {
	Gallery,
	GalleryRowButtonList,
	GalleryRowButtonListItem,
	GalleryRowCampaignList,
	GalleryRowCampaignListItem,
	GalleryRowEntityList,
	GalleryRowEntityListItem,
	GalleryRowSliderFull,
	GalleryRowSliderFullItem,
	GalleryRowSliderMini,
	GalleryRowSliderMiniItem,
} from "../../gallery";
import "./Gallery.scss";
import { Autoplay, Grid } from "swiper/modules";
import { useTranslation } from "../../contexts/TranslationContext";
import { isRTL } from "../../utils/i18n";
import { navigator } from "../../utils/navigator";
import { formatTGCount } from "../../utils/number";
import { store } from "../../utils/store";
import { openLink } from "../../utils/telegram";
import { SVGSymbol } from "../SVG";
import Clickable from "./Clickable";
import ImageLoader from "./ImageLoader";
import PeerProfile from "./PeerProfile";

const GridStyle = `data:text/css;base64,${btoa(`.swiper-grid > .swiper-wrapper {flex-wrap: wrap;}.swiper-grid-column > .swiper-wrapper {flex-wrap: wrap;flex-direction: column;}`)}`;

type SectionGallerySliderMiniProps = {
	row: GalleryRowSliderMini;
};

export const SectionGallerySliderMini: Component<
	SectionGallerySliderMiniProps
> = (props) => {
	let swiperEl: any;

	const SectionGallerySliderMiniItem: Component<{
		item: GalleryRowSliderMiniItem;
	}> = (props) => {
		const onClick = () => {
			if (!props.item.url) return;

			if (props.item.external) {
				openLink(props.item.url);
			} else {
				navigator.go(props.item.url);
			}
		};

		return (
			<div
				style={{
					"--item-bg": props.item.background,
				}}
				onClick={onClick}
			>
				<div>
					<span class="title">{props.item.title}</span>

					<Show when={props.item.subtitle}>
						<span class="subtitle">{props.item.subtitle}</span>
					</Show>
				</div>

				<SVGSymbol id={props.item.icon} />
			</div>
		);
	};

	onMount(() => {
		const params = {
			modules: [Autoplay],
			injectStylesUrls: [],
		};

		Object.assign(swiperEl, params);

		swiperEl.initialize();
	});

	return (
		<section class="container-gallery-slider-mini">
			<swiper-container
				ref={swiperEl}
				init={false}
				slides-per-view={1}
				dir={isRTL() ? "rtl" : "ltr"}
				autoplay-delay={5000}
				autoplay-disable-on-interaction={true}
				loop={true}
			>
				<For each={props.row.items}>
					{(item) => (
						<swiper-slide>
							<SectionGallerySliderMiniItem item={item} />
						</swiper-slide>
					)}
				</For>
			</swiper-container>
		</section>
	);
};

type SectionGallerySliderFullProps = {
	row: GalleryRowSliderFull;
};

export const SectionGallerySliderFull: Component<
	SectionGallerySliderFullProps
> = (props) => {
	let swiperEl: any;

	const SectionGallerySliderFullItem: Component<{
		item: GalleryRowSliderFullItem;
	}> = (props) => {
		const onClick = () => {
			if (!props.item.url) return;

			if (props.item.external) {
				openLink(props.item.url);
			} else {
				navigator.go(props.item.url);
			}
		};

		return (
			<div onClick={onClick}>
				<ImageLoader src={props.item.image} />
			</div>
		);
	};

	onMount(() => {
		const params = {
			modules: [Autoplay],
			injectStylesUrls: [],
		};

		Object.assign(swiperEl, params);

		swiperEl.initialize();
	});

	return (
		<section class="container-gallery-slider-full">
			<swiper-container
				ref={swiperEl}
				init={false}
				slides-per-view={1}
				dir={isRTL() ? "rtl" : "ltr"}
				autoplay-delay={6000}
				autoplay-disable-on-interaction={true}
				loop={true}
			>
				<For each={props.row.items}>
					{(item) => (
						<swiper-slide>
							<SectionGallerySliderFullItem item={item} />
						</swiper-slide>
					)}
				</For>
			</swiper-container>
		</section>
	);
};

type SectionGalleryButtonListProps = {
	row: GalleryRowButtonList;
};

export const SectionGalleryButtonList: Component<
	SectionGalleryButtonListProps
> = (props) => {
	const SectionGalleryButtonListItem: Component<{
		item: GalleryRowButtonListItem;
	}> = (props) => {
		const onClick = () => {
			if (!props.item.url) return;

			if (props.item.external) {
				openLink(props.item.url);
			} else {
				navigator.go(props.item.url);
			}
		};

		return (
			<Clickable onClick={onClick}>
				<div style={{ "--item-color": props.item.color }}>
					<SVGSymbol id={props.item.icon} />

					<span>{props.item.title}</span>
				</div>
			</Clickable>
		);
	};

	return (
		<section class="container-gallery-button-list">
			<For each={props.row.items}>
				{(item) => <SectionGalleryButtonListItem item={item} />}
			</For>
		</section>
	);
};

type SectionGalleryEntityListProps = {
	row: GalleryRowEntityList;
};

export const SectionGalleryEntityList: Component<
	SectionGalleryEntityListProps
> = (props) => {
	const { t, td } = useTranslation();

	let swiperEl: any;

	const SectionGalleryEntityListItem: Component<{
		item: GalleryRowEntityListItem;
	}> = (props) => {
		const onClick = () => {
			navigator.go(`/entity/${props.item.id}`);
		};

		return (
			<Clickable onClick={onClick}>
				<PeerProfile
					peerId={props.item.chat_id}
					username={props.item.username}
					name={props.item.name}
				/>

				<div>
					<span class="title">{props.item.name}</span>

					<span class="subtitle">
						{props.item.type === "channel"
							? td("general.subscribers", {
									count: formatTGCount(props.item.members),
								})
							: td("general.members", {
									count: formatTGCount(props.item.members),
								})}
					</span>
				</div>

				<ul>
					<li>
						{store.languages?.[props.item.language_code ?? ""] ??
							t("pages.entity.infolist.language.undefined")}
					</li>

					<li>
						{store.categories?.[props.item.category ?? ""] ??
							t("pages.entity.infolist.category.undefined")}
					</li>
				</ul>
			</Clickable>
		);
	};

	onMount(() => {
		const params = {
			modules: [Grid],
			injectStylesUrls: [GridStyle],
		};

		Object.assign(swiperEl, params);

		swiperEl.initialize();
	});

	return (
		<section class="container-gallery-entity-list">
			<header>
				<h2>{props.row.meta.title}</h2>
			</header>

			<swiper-container
				ref={swiperEl}
				init={false}
				slides-per-view={1.1875}
				space-between={16}
				modules={[Grid]}
				grid={true}
				grid-rows={2}
				grid-fill="row"
				slides-offset-before={16}
				slides-offset-after={16}
				dir={isRTL() ? "rtl" : "ltr"}
			>
				<For each={props.row.items}>
					{(item) => (
						<swiper-slide>
							<SectionGalleryEntityListItem item={item} />
						</swiper-slide>
					)}
				</For>
			</swiper-container>
		</section>
	);
};

type SectionGalleryCampaignListProps = {
	row: GalleryRowCampaignList;
};

export const SectionGalleryCampaignList: Component<
	SectionGalleryCampaignListProps
> = (props) => {
	const { t } = useTranslation();

	let swiperEl: any;

	const SectionGalleryCampaignListItem: Component<{
		item: GalleryRowCampaignListItem;
	}> = (props) => {
		const onClick = () => {
			navigator.go(`/campaign/${props.item.id}`);
		};

		return (
			<Clickable onClick={onClick}>
				<PeerProfile
					peerId={Number(props.item.id?.match(/(\d+)/)?.[1] ?? 0)}
					alternateContent={() => (
						<span>
							<SVGSymbol id="BiRegularStore" />
						</span>
					)}
				/>

				<div>
					<span class="title">{props.item.name}</span>
				</div>

				<ul>
					<li>
						{store.languages?.[props.item.language_code ?? ""] ??
							t("pages.entity.infolist.language.undefined")}
					</li>

					<li>
						{store.categories?.[props.item.category ?? ""] ??
							t("pages.entity.infolist.category.undefined")}
					</li>
				</ul>
			</Clickable>
		);
	};

	onMount(() => {
		const params = {
			modules: [Grid],
			injectStylesUrls: [GridStyle],
		};

		Object.assign(swiperEl, params);

		swiperEl.initialize();
	});

	return (
		<section class="container-gallery-campaign-list">
			<header>
				<h2>{props.row.meta.title}</h2>
			</header>

			<swiper-container
				ref={swiperEl}
				init={false}
				slides-per-view={1.1875}
				space-between={16}
				modules={[Grid]}
				grid={true}
				grid-rows={2}
				grid-fill="row"
				slides-offset-before={16}
				slides-offset-after={16}
				dir={isRTL() ? "rtl" : "ltr"}
			>
				<For each={props.row.items}>
					{(item) => (
						<swiper-slide>
							<SectionGalleryCampaignListItem item={item} />
						</swiper-slide>
					)}
				</For>
			</swiper-container>
		</section>
	);
};

type SectionGalleryProps = {
	gallery: Gallery;
	class?: string;
};

const SectionGallery: Component<SectionGalleryProps> = (props) => {
	return (
		<section id="container-gallery" class={props.class}>
			<For each={props.gallery}>
				{(row) => (
					<Switch>
						<Match when={row.type === "slider-mini"}>
							<SectionGallerySliderMini row={row as GalleryRowSliderMini} />
						</Match>

						<Match when={row.type === "slider-full"}>
							<SectionGallerySliderFull row={row as GalleryRowSliderFull} />
						</Match>

						<Match when={row.type === "button-list"}>
							<SectionGalleryButtonList row={row as GalleryRowButtonList} />
						</Match>

						<Match when={row.type === "campaign-list"}>
							<SectionGalleryCampaignList row={row as GalleryRowCampaignList} />
						</Match>

						<Match when={row.type === "entity-list"}>
							<SectionGalleryEntityList row={row as GalleryRowEntityList} />
						</Match>
					</Switch>
				)}
			</For>
		</section>
	);
};

export default SectionGallery;
