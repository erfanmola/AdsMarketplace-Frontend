import { type Component, createEffect, on, onCleanup, onMount } from "solid-js";
import TWallpaper from "twallpaper";

type TWallpaperProps = {
	fps?: number;
	tails?: number;
	animate?: boolean;
	scrollAnimate?: boolean;
	colors: string[];
	pattern: {
		image: string;
		background: string;
		blur: number;
		size: string;
		opacity: number;
		mask: boolean;
	};
};

const TelegramWallpaper: Component<TWallpaperProps> = (props) => {
	let container: HTMLDivElement | undefined;

	onMount(() => {
		if (!container) return;

		const wallpaper = new TWallpaper(container, {
			colors: props.colors,
			fps: props.fps ?? 60,
			tails: props.tails ?? 90,
			animate: props.animate ?? false,
			scrollAnimate: props.scrollAnimate ?? false,
			pattern: props.pattern,
		});

		wallpaper.init();

		createEffect(
			on(
				() => props.colors,
				() => {
					wallpaper.updateColors(props.colors);
					wallpaper.animate();
				},
				{
					defer: true,
				},
			),
		);

		createEffect(
			on(
				() => props.pattern,
				() => {
					wallpaper.updatePattern(props.pattern);
					wallpaper.animate();
				},
				{
					defer: true,
				},
			),
		);

		createEffect(
			on(
				() => props.tails,
				() => {
					wallpaper.updateTails(props.tails);
					wallpaper.animate();
				},
				{
					defer: true,
				},
			),
		);

		createEffect(
			on(
				() => props.fps,
				() => {
					wallpaper.updateFrametime(props.fps);
					wallpaper.animate();
				},
				{
					defer: true,
				},
			),
		);

		createEffect(
			on(
				() => props.animate,
				() => {
					wallpaper.animate(props.animate);
				},
				{
					defer: true,
				},
			),
		);

		onCleanup(() => {
			wallpaper.dispose();
		});
	});

	return <div ref={container}></div>;
};

export default TelegramWallpaper;
