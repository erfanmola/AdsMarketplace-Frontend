import { createSignal, Show } from "solid-js";
import { useTranslation } from "../contexts/TranslationContext";
import { navigator } from "../utils/navigator";
import { SVGSymbol } from "./SVG";
import BottomBar from "./ui/BottomBar";

const BottomBarValidPath = ["/", "/advertisers", "/publishers", "/profile"];
const SearchValidPath = ["/advertisers", "/publishers"];

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
					// {
					// 	icon: () => <SVGSymbol id="HiSolidUserCircle" />,
					// 	title: t("components.bottomBar.items.profile.title"),
					// },
				]}
				initialIndex={
					BottomBarValidPath.indexOf(navigator.location!.pathname) ?? 0
				}
				onIndexChange={(index) => {
					navigator.go(BottomBarValidPath[index], {
						backable: false,
					});
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
