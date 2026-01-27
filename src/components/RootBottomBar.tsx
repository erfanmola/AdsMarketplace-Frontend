import { useLocation, useNavigate } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import { useTranslation } from "../contexts/TranslationContext";
import { SVGSymbol } from "./SVG";
import BottomBar from "./ui/BottomBar";

const BottomBarValidPath = ["/", "/advertisers", "/publishers", "/profile"];
const SearchValidPath = ["/advertisers", "/publishers"];

const RootBottomBar = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { t } = useTranslation();

	const [searchQuery, setSearchQuery] = createSignal("");
	const [searchbarToggle, setSearchbarToggle] = createSignal(false);

	return (
		<Show when={BottomBarValidPath.includes(location.pathname)}>
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
					{
						icon: () => <SVGSymbol id="HiSolidUserCircle" />,
						title: t("components.bottomBar.items.profile.title"),
					},
				]}
				initialIndex={BottomBarValidPath.indexOf(location.pathname) ?? 0}
				onIndexChange={(index) => {
					navigate(BottomBarValidPath[index]);
				}}
				search={SearchValidPath.includes(location.pathname)}
				onSearchEnter={(value) => {
					setSearchQuery(value);
					setSearchbarToggle(false);
				}}
				onSearchInput={(value) => {
					setSearchQuery(value);
				}}
				onSearchToggle={setSearchbarToggle}
				searchToggle={searchbarToggle()}
				initialSearchQuery={searchQuery()}
			/>
		</Show>
	);
};

export default RootBottomBar;
