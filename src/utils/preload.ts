import { BiSolidErrorCircle } from "solid-icons/bi";
import { CgSearch } from "solid-icons/cg";
import { FaSolidPlus } from "solid-icons/fa";
import {
	HiSolidHome,
	HiSolidMegaphone,
	HiSolidRocketLaunch,
	HiSolidUserCircle,
} from "solid-icons/hi";
import { IoClose } from "solid-icons/io";
import {
	RiBusinessMegaphoneLine,
	RiSystemLoader2Fill,
	RiUserFacesGroupLine,
} from "solid-icons/ri";
import { TbOutlineLoader2 } from "solid-icons/tb";
import type { Component } from "solid-js";
import { CustomIconTON } from "../components/misc/CustomIcons";
import { symbolizeSVGComponent } from "../components/SVG";
import { EntityPattern } from "../pages/Entity";
import { LottieAnimations } from "./animations";

const preloadURLs = async () => {
	const list: string[] = [
		LottieAnimations.duck.celebrate.url,
		LottieAnimations.duck.glassShine.url,
		LottieAnimations.duck.acceptMoney.url,
		LottieAnimations.duck.transparent.url,
		LottieAnimations.duck.hashtags.url,
		EntityPattern,
	];

	return Promise.all(
		list.map(
			(url) =>
				new Promise((resolve) => {
					fetch(url).finally(() => resolve(true));
				}),
		),
	);
};

const predefineSVGSymbols = async () => {
	document.querySelector("svg#symbols")!.innerHTML = "";

	const list: { id: string; component: Component }[] = [
		{
			id: "TON",
			component: CustomIconTON,
		},
		{
			id: "RiSystemLoader2Fill",
			component: RiSystemLoader2Fill,
		},
		{
			id: "HiSolidHome",
			component: HiSolidHome,
		},
		{
			id: "HiSolidMegaphone",
			component: HiSolidMegaphone,
		},
		{
			id: "HiSolidRocketLaunch",
			component: HiSolidRocketLaunch,
		},
		{
			id: "HiSolidUserCircle",
			component: HiSolidUserCircle,
		},
		{
			id: "TbOutlineLoader2",
			component: TbOutlineLoader2,
		},
		{
			id: "CgSearch",
			component: CgSearch,
		},
		{
			id: "IoClose",
			component: IoClose,
		},
		{
			id: "FaSolidPlus",
			component: FaSolidPlus,
		},
		{
			id: "BiSolidErrorCircle",
			component: BiSolidErrorCircle,
		},
		{
			id: "RiUserFacesGroupLine",
			component: RiUserFacesGroupLine,
		},
		{
			id: "RiBusinessMegaphoneLine",
			component: RiBusinessMegaphoneLine,
		},
	];

	for (const item of list) {
		await symbolizeSVGComponent(item.id, item.component);
	}
};

export const preloadPipeline = async () => {
	return Promise.all([predefineSVGSymbols(), preloadURLs()]);
};
