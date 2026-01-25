import "./Authorize.scss";
import { batch, onMount, type ParentComponent, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { apiAuthUser } from "../api";
import PageIntro from "../pages/Intro";
import { preloadPipeline } from "../utils/preload";
import { settings } from "../utils/settings";
import { setStore } from "../utils/store";

export const LayoutAuthorize: ParentComponent = (props) => {
	const [pipeline, setPipeline] = createStore({
		preload: false,
		user: false,
	});

	onMount(async () => {
		preloadPipeline().then(() => {
			setPipeline("preload", true);
		});

		apiAuthUser().then((data) => {
			if (data) {
				const { result } = data;

				batch(() => {
					setStore({
						token: result.token,
						user: result.user,
					});
					setPipeline("user", true);
				});
			}
		});
	});

	const SectionLoader = () => (
		<div id="layout-authorize-fallback">
			<div id="container-splash-loader" class="shimmer"></div>
		</div>
	);

	return (
		<Show
			when={Object.values(pipeline).every(Boolean)}
			fallback={<SectionLoader />}
		>
			<Show when={settings.intro.done} fallback={<PageIntro />}>
				{props.children}
			</Show>
		</Show>
	);
};
