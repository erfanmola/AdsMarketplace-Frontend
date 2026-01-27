import {
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
};

const PullToRefresh: ParentComponent<PullToRefreshProps> = (props) => {
	const id = createUniqueId();

	onMount(() => {
		const ptr = PullToRefreshJS.init({
			mainElement: `#${id}`,
			triggerElement: `#${id}`,
			iconArrow: "REFRESH",
			iconRefreshing: "Refreshing",
			async onRefresh() {
				invokeHapticFeedbackImpact("soft");
				return await props.onRefresh?.();
			},
			refreshTimeout: 0,
			getMarkup: () => {
				return `<div class="container-pull-to-refresh-indicator"><svg stroke-width="0" color="currentColor" fill="currentColor" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><use href="#RiSystemLoader2Fill"></use></svg></div>`;
			},
		});

		onCleanup(() => {
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
