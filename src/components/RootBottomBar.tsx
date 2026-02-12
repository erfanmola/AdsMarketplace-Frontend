import { createMemo, createSignal, Show } from "solid-js";
import { useTranslation } from "../contexts/TranslationContext";
import { navigator } from "../utils/navigator";
import { SVGSymbol } from "./SVG";
import BottomBar from "./ui/BottomBar";

const BottomBarItems = ["/", "/advertisers", "/publishers", "/profile"];

const BottomBarValidPath = [
	"/",
	"/advertisers",
	"/advertisers/all",
	"/advertisers/ready",
	"/advertisers/pending",
	"/publishers",
	"/publishers/all",
	"/publishers/active",
	"/publishers/inactive",
	"/publishers/verified",
	"/profile",
];
const SearchValidPath = [
	"/advertisers",
	"/advertisers/all",
	"/advertisers/ready",
	"/advertisers/pending",
	"/publishers",
	"/publishers/all",
	"/publishers/active",
	"/publishers/inactive",
	"/publishers/verified",
];

export const [
	rootBottomBarSearchQuery,
	setRootBottomBarrootBottomBarSearchQuery,
] = createSignal("");
export const [
	rootBottomBarSearchbarToggle,
	setRootBottomBarrootBottomBarSearchbarToggle,
] = createSignal(false);

const RootBottomBar = () => {
	const { t } = useTranslation();

	const initialIndex = createMemo(() => {
		const index = BottomBarItems.findIndex((i) =>
			navigator
				.location!.pathname.replace("/", "")
				.startsWith(i.replace("/", "") || "/"),
		);

		if (index > -1) {
			return index;
		}

		return 0;
	});

	return (
		<Show when={BottomBarValidPath.includes(navigator.location!.pathname)}>
			<BottomBar
				items={[
					{
						icon: () => <SVGSymbol id="HiSolidHome" />,
						title: t("components.bottomBar.items.home.title"),
					},
					{
						icon: () => <SVGSymbol id="HiSolidRocketLaunch" />,
						title: t("components.bottomBar.items.advertisers.title"),
					},
					{
						icon: () => <SVGSymbol id="HiSolidMegaphone" />,
						title: t("components.bottomBar.items.publishers.title"),
					},
				]}
				initialIndex={initialIndex()}
				onIndexChange={(index) => {
					navigator.go(BottomBarItems[index]);
				}}
				search={SearchValidPath.includes(navigator.location!.pathname)}
				onSearchEnter={(value) => {
					setRootBottomBarrootBottomBarSearchQuery(value.trim());
				}}
				onSearchInput={(value) => {
					setRootBottomBarrootBottomBarSearchQuery(value.trim());
				}}
				onSearchToggle={setRootBottomBarrootBottomBarSearchbarToggle}
				searchToggle={rootBottomBarSearchbarToggle()}
				initialSearchQuery={rootBottomBarSearchQuery()}
			/>
		</Show>
	);
};

export default RootBottomBar;
