import {
	type Accessor,
	type Component,
	createEffect,
	createSignal,
	For,
	on,
	onCleanup,
	onMount,
} from "solid-js";
import "./Tabbar.scss";
import { Dynamic } from "solid-js/web";
import { isRTL } from "../../utils/i18n";
import { invokeHapticFeedbackImpact } from "../../utils/telegram";

export type TabbarItem = {
	slug: string;
	title: string;
	badge?: string | Accessor<string | undefined>;
	component: Component;
};

type TabbarMode = "glass";

type TabbarProps = {
	class?: string;
	id?: string;
	items: TabbarItem[];
	value: TabbarItem["slug"];
	setValue: (value: TabbarItem["slug"]) => void;
	gap?: number;
	mode?: TabbarMode;
	setScrollingState?: (value: boolean) => void;
	autoHeight?: boolean;
};

const Tabbar: Component<TabbarProps> = (props) => {
	let slider: any;

	const [mode, setMode] = createSignal(props.mode ?? "glass");

	createEffect(() => {
		setMode(props.mode ?? "glass");
	});

	createEffect(
		on(
			() => props.value,
			() => {
				invokeHapticFeedbackImpact("light");

				slider.swiper.slideTo(getIndex(props.value));

				updateIndicator();
			},
			{
				defer: true,
			},
		),
	);

	const getIndex = (slug: string) => {
		return props.items.findIndex((i) => i.slug === slug);
	};

	let ulRef!: HTMLUListElement;

	const updateDistance = () => {
		const ulRect = ulRef.getBoundingClientRect();
		const containerRect = ulRef.parentElement!.getBoundingClientRect();

		ulRef.style.setProperty(
			"--pill-distance",
			`${-1 * (ulRect.left - containerRect.left)}px`,
		);
	};

	const updateIndicator = () => {
		const active = ulRef.querySelector("li.active") as HTMLElement;
		if (!active) return;

		const ulRect = ulRef.getBoundingClientRect();
		const liRect = active.getBoundingClientRect();

		ulRef.style.setProperty("--pill-x", `${liRect.left - ulRect.left}px`);
		ulRef.style.setProperty("--pill-w", `${liRect.width}px`);
		ulRef.style.setProperty("--pill-h", `${liRect.height}px`);
	};

	const updateIndicatorBySwiper = (swiper: any) => {
		const items = [...ulRef.querySelectorAll("li")] as HTMLElement[];
		if (!items.length) return;

		// Get Swiper’s slides grid in pixels
		const slidesGrid = swiper.slidesGrid; // array of offsets for each slide

		// Calculate current translate (in px)
		const translate = -swiper.translate; // negative because Swiper.translate is negative when swiping left

		// Find current slide index and progress to next
		let currentIndex = 0;
		for (let i = 0; i < slidesGrid.length; i++) {
			if (translate >= slidesGrid[i]) currentIndex = i;
		}

		const nextIndex = Math.min(currentIndex + 1, items.length - 1);

		const current = items[currentIndex];
		const next = items[nextIndex];

		// Slide width difference
		const slideDiff = slidesGrid[nextIndex] - slidesGrid[currentIndex] || 1;

		// Fractional progress between current and next slide
		const t = Math.max(
			0,
			Math.min((translate - slidesGrid[currentIndex]) / slideDiff, 1),
		);

		const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

		const x = lerp(current.offsetLeft, next.offsetLeft, t);
		const w = lerp(current.offsetWidth, next.offsetWidth, t);
		const h = lerp(current.offsetHeight, next.offsetHeight, t);

		ulRef.style.setProperty("--pill-x", `${x}px`);
		ulRef.style.setProperty("--pill-w", `${w}px`);
		ulRef.style.setProperty("--pill-h", `${h}px`);
	};

	onMount(() => {
		updateDistance();
		updateIndicator();

		window.addEventListener("resize", updateIndicator, {
			passive: true,
		});
		window.addEventListener("resize", updateDistance, {
			passive: true,
		});

		slider.swiper.update();

		setTimeout(() => {
			slider.swiper.update();
		});

		onCleanup(() => {
			window.removeEventListener("resize", updateIndicator);
			window.removeEventListener("resize", updateDistance);
		});
	});

	const onClick = (slug: string) => {
		props.setValue(slug);
		requestAnimationFrame(updateIndicator);
	};

	const onSliderChange = () => {
		props.setValue(props.items[slider.swiper.activeIndex].slug);
	};

	const onSliderProgress = (swiper: any) => {
		updateIndicatorBySwiper(swiper);
	};

	const snapIndicatorToActive = () => {
		const active = ulRef.querySelector("li.active") as HTMLElement;
		if (!active) return;

		ulRef.style.setProperty("--pill-x", `${active.offsetLeft}px`);
		ulRef.style.setProperty("--pill-w", `${active.offsetWidth}px`);
		ulRef.style.setProperty("--pill-h", `${active.offsetHeight}px`);
	};

	let directionLocked: "horizontal" | "vertical" | null = null;

	const onSliderTouchStart = () => {
		directionLocked = null; // reset at the start
	};

	const onSliderTouchMove = (swiper: any) => {
		const touches = swiper.touches; // Swiper keeps track of touch positions
		const deltaX = Math.abs(touches.currentX - touches.startX);
		const deltaY = Math.abs(touches.currentY - touches.startY);

		if (!directionLocked && (deltaX > 5 || deltaY > 5)) {
			directionLocked = deltaX > deltaY ? "horizontal" : "vertical";
		}

		// Only disable pull-to-refresh if horizontal swipe
		props?.setScrollingState?.(directionLocked === "horizontal");
	};

	const onSliderTouchEnd = () => {
		props?.setScrollingState?.(false); // always re-enable pull-to-refresh
		directionLocked = null;
	};

	onMount(() => {
		slider.swiper.on("slideChange", () => {
			onSliderChange();
			snapIndicatorToActive();
		});

		slider.swiper.on("transitionEnd", snapIndicatorToActive);
		slider.swiper.on("progress", onSliderProgress);
		slider.swiper.on("setTranslate", onSliderProgress);

		slider.swiper.on("touchStart", onSliderTouchStart);
		slider.swiper.on("touchMove", onSliderTouchMove);
		slider.swiper.on("touchEnd", onSliderTouchEnd);

		onCleanup(() => {
			slider.swiper.off("slideChange", onSliderChange);
			slider.swiper.off("transitionEnd", snapIndicatorToActive);
			slider.swiper.off("progress", onSliderProgress);
			slider.swiper.off("setTranslate", onSliderProgress);
			slider.swiper.off("touchStart", onSliderTouchStart);
			slider.swiper.off("touchMove", onSliderTouchMove);
			slider.swiper.off("touchEnd", onSliderTouchEnd);
		});
	});

	return (
		<div
			id={props.id}
			class={[
				"container-tabbar",
				`tabbar-${mode()}`,
				props.autoHeight && "tabbar-auto-height",
				props.class,
			]
				.filter(Boolean)
				.join(" ")}
		>
			<ul ref={ulRef}>
				<For each={props.items}>
					{(item) => (
						<li
							classList={{ active: item.slug === props.value }}
							onClick={() => onClick(item.slug)}
						>
							<span>{item.title}</span>
						</li>
					)}
				</For>
			</ul>

			<swiper-container
				ref={slider}
				slides-per-view={1}
				initial-slide={getIndex(props.value)}
				dir={isRTL() ? "rtl" : "ltr"}
				space-between={props.gap ?? 0}
				auto-height={props.autoHeight ?? false}
			>
				<For each={props.items}>
					{(item) => (
						<swiper-slide>
							<Dynamic component={item.component} />
						</swiper-slide>
					)}
				</For>
			</swiper-container>
		</div>
	);
};

export default Tabbar;
