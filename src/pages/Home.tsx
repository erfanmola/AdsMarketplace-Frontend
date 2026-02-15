import { useQuery } from "@tanstack/solid-query";
import { useTranslation } from "../contexts/TranslationContext";
import Page from "../layouts/Page";
import "./Home.scss";

import { TbOutlineSettings } from "solid-icons/tb";
import { type Component, Show, Suspense } from "solid-js";
import { apiGallery } from "../api";
import { SVGSymbol } from "../components/SVG";
import Clickable from "../components/ui/Clickable";
import SectionGallery from "../components/ui/Gallery";
import Shimmer from "../components/ui/Shimmer";
import useQueryFeedback from "../hooks/useQueryFeedback";
import { setModals } from "../utils/modal";
import { navigator } from "../utils/navigator";
import { store } from "../utils/store";

const PageHome: Component = () => {
	const { t } = useTranslation();

	const query = useQuery(() => ({
		queryKey: ["gallery"],
		queryFn: () => apiGallery(),
	}));

	useQueryFeedback({
		query,
		options: {
			hapticOnError: true,
			hapticOnSuccess: true,
			toastOnError: true,
			refetchKey: "gallery",
		},
	});

	const headerAppend = () => {
		return (
			<div>
				<Clickable
					class="container-header-append-settings"
					onClick={() => {
						setModals("settings", "open", true);
					}}
				>
					<TbOutlineSettings />
				</Clickable>

				<Clickable
					class="container-header-append-balance"
					onClick={() => {
						navigator.go("/balance");
					}}
				>
					<SVGSymbol id="TON" />

					<span>{(store.balance?.total ?? 0).toLocaleString()}</span>

					<span>
						<SVGSymbol id="FaSolidPlus" />
					</span>
				</Clickable>
			</div>
		);
	};

	return (
		<Page
			id="container-page-home"
			title={t("general.appName")}
			headerAppend={headerAppend}
		>
			<Suspense
				fallback={
					<Shimmer id="shimmer-gallery">
						<span />

						<ul>
							<li />
							<li />
							<li />
							<li />
						</ul>

						<section>
							<span />

							<div>
								<div>
									<span />

									<div>
										<span />
										<span />
									</div>

									<div>
										<span />
										<span />
									</div>
								</div>

								<div>
									<span />

									<div>
										<span />
										<span />
									</div>

									<div>
										<span />
										<span />
									</div>
								</div>
							</div>
						</section>

						<section>
							<span />

							<div>
								<div>
									<span class="square" />

									<div>
										<span />
									</div>

									<div>
										<span />
										<span />
									</div>
								</div>

								<div>
									<span class="square" />

									<div>
										<span />
									</div>

									<div>
										<span />
										<span />
									</div>
								</div>
							</div>
						</section>

						<div />

						<section>
							<span />

							<div>
								<div>
									<span />

									<div>
										<span />
										<span />
									</div>

									<div>
										<span />
										<span />
									</div>
								</div>

								<div>
									<span />

									<div>
										<span />
										<span />
									</div>

									<div>
										<span />
										<span />
									</div>
								</div>
							</div>
						</section>

						<section>
							<span />

							<div>
								<div>
									<span class="square" />

									<div>
										<span />
									</div>

									<div>
										<span />
										<span />
									</div>
								</div>

								<div>
									<span class="square" />

									<div>
										<span />
									</div>

									<div>
										<span />
										<span />
									</div>
								</div>
							</div>
						</section>
					</Shimmer>
				}
			>
				<Show when={query.data?.gallery}>
					<SectionGallery
						gallery={query.data!.gallery}
						class="safe-area-bottombar"
					/>
				</Show>
			</Suspense>
		</Page>
	);
};

export default PageHome;
