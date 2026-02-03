import { onCleanup, onMount, type ParentComponent } from "solid-js";
import "./Scrollable.scss";

type ScrollableProps = {
	class?: string;
	id?: string;
	setScrollingState?: (scrolling: boolean) => void;
	scrollEndDelay?: number;
	onEnd?: () => void;
	endOffset?: number;
};

const Scrollable: ParentComponent<ScrollableProps> = (props) => {
	let el: HTMLDivElement | undefined;
	let scrollEndTimer: number | undefined;
	let endLocked = false;

	const checkEnd = () => {
		if (!el || !props.onEnd) return;

		const offset = props.endOffset ?? 120;
		const reached = el.scrollTop + el.clientHeight >= el.scrollHeight - offset;

		if (reached && !endLocked) {
			endLocked = true;
			props.onEnd();
		}

		if (!reached) {
			endLocked = false;
		}
	};

	const onScroll = () => {
		props.setScrollingState?.(true);
		checkEnd();

		clearTimeout(scrollEndTimer);
		scrollEndTimer = window.setTimeout(() => {
			props.setScrollingState?.(false);
		}, props.scrollEndDelay ?? 250);
	};

	onMount(() => {
		el?.addEventListener("scroll", onScroll, {
			passive: true,
			capture: true,
		});
	});

	onCleanup(() => {
		el?.removeEventListener("scroll", onScroll);
		clearTimeout(scrollEndTimer);
	});

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
