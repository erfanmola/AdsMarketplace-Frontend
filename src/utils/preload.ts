import type { Component } from "solid-js";
import { CustomIconTON } from "../components/misc/CustomIcons";
import { symbolizeSVGComponent } from "../components/SVG";
import { LottieAnimations } from "./animations";

const preloadURLs = async () => {
	const list: string[] = [
		LottieAnimations.duck.celebrate.url,
		LottieAnimations.duck.glassShine.url,
		LottieAnimations.duck.acceptMoney.url,
		LottieAnimations.duck.transparent.url,
		LottieAnimations.duck.hashtags.url,
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
	];

	for (const item of list) {
		await symbolizeSVGComponent(item.id, item.component);
	}
};

export const preloadPipeline = async () => {
	return Promise.all([predefineSVGSymbols(), preloadURLs()]);
};
