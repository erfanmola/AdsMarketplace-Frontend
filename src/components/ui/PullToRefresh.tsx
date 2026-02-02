import {
	createSignal,
	createUniqueId,
	onCleanup,
	onMount,
	type ParentComponent,
} from "solid-js";
import "./PullToRefresh.scss";
import PullToRefreshJS from "pulltorefreshjs";
import { invokeHapticFeedbackImpact } from "../../utils/telegram";

type PullToRefreshProps = {
	onRefresh?: () => Promise<void>;
	class?: string;
	shouldPullToRefresh?: () => boolean;
	scrollEndDelay?: number;
};

const PullToRefresh: ParentComponent<PullToRefreshProps> = (props) => {
	const id = createUniqueId();

	const [scrolling, setScrolling] = createSignal(false);

	const onScroll = () => {
		setScrolling(true);
	};

	const onScrollEnd = () => {
		setTimeout(() => {
			setScrolling(false);
		}, props.scrollEndDelay ?? 250);
	};

	onMount(() => {
		window.addEventListener("scroll", onScroll, {
			passive: true,
			capture: true,
		});
		window.addEventListener("scrollend", onScrollEnd, {
			passive: true,
			capture: true,
		});

		const ptr = PullToRefreshJS.init({
			mainElement: `#${id}`,
			triggerElement: `#${id}`,
			async onRefresh() {
				invokeHapticFeedbackImpact("soft");
				return await props.onRefresh?.();
			},
			refreshTimeout: 0,
			getMarkup: () => {
				return `<div class="container-pull-to-refresh-indicator"><svg stroke-width="0" color="currentColor" fill="currentColor" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><use href="#RiSystemLoader2Fill"></use></svg></div>`;
			},
			shouldPullToRefresh: props.shouldPullToRefresh ?? (() => !scrolling()),
		});

		onCleanup(() => {
			window.removeEventListener("scrollend", onScrollEnd);
			window.removeEventListener("scroll", onScroll);
			ptr.destroy();
		});
	});

	return (
		<div
			id={id}
			class={["container-pull-to-refresh", props.class]
				.filter(Boolean)
				.join(" ")}
		>
			{props.children}
		</div>
	);
};

export default PullToRefresh;
