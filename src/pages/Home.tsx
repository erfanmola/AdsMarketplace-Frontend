import { useQuery } from "@tanstack/solid-query";
import { useTranslation } from "../contexts/TranslationContext";
import Page from "../layouts/Page";
import "./Home.scss";

import { type Component, Show, Suspense } from "solid-js";
import { apiGallery } from "../api";
import SectionGallery from "../components/ui/Gallery";
import Shimmer from "../components/ui/Shimmer";
import useQueryFeedback from "../hooks/useQueryFeedback";

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
		return <div>Balance and stuff</div>;
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
