import { onCleanup, onMount, type ParentComponent } from "solid-js";
import "./Scrollable.scss";

type ScrollableProps = {
	class?: string;
	id?: string;
	setScrollingState?: (scrolling: boolean) => void;
	scrollEndDelay?: number;
};

const Scrollable: ParentComponent<ScrollableProps> = (props) => {
	let el: HTMLDivElement | undefined;

	if (props.setScrollingState) {
		const onScroll = () => {
			props.setScrollingState?.(true);
		};

		const onScrollEnd = () => {
			setTimeout(() => {
				props.setScrollingState?.(false);
			}, props.scrollEndDelay ?? 250);
		};

		onMount(() => {
			el?.addEventListener("scroll", onScroll, {
				passive: true,
				capture: true,
			});
			el?.addEventListener("scrollend", onScrollEnd, {
				passive: true,
				capture: true,
			});
		});

		onCleanup(() => {
			el?.removeEventListener("scrollend", onScrollEnd);
			el?.removeEventListener("scroll", onScroll);
		});
	}

	return (
		<div
			ref={el}
			class={["scrollable", props.class].filter(Boolean).join(" ")}
			id={props.id}
		>
			{props.children}
		</div>
	);
};

export default Scrollable;
