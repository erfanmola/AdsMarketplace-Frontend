import "./Void.scss";

import { RiUserFacesGhostSmileLine } from "solid-icons/ri";
import { type Component, onCleanup, onMount } from "solid-js";
import BackButton from "../components/tma/BackButton";
import { useTranslation } from "../contexts/TranslationContext";
import Page from "../layouts/Page";
import { navigator } from "../utils/navigator";
import { theme } from "../utils/telegram";
import type { IWorkerPixelSpritesGeneratorMessage } from "../workers/pixel-sprites-generator";
import PixelSpritesGenerator from "../workers/pixel-sprites-generator?worker";

const PageVoid: Component = () => {
	const { t } = useTranslation();

	let canvas: HTMLCanvasElement | undefined;

	const onBackButton = () => {
		if (navigator.isBackable()) {
			navigator.back();
		} else {
			navigator.go("/");
		}
	};

	onMount(() => {
		if (!canvas) return;

		canvas.width = 96;
		canvas.height = 128;

		const offscreen = canvas.transferControlToOffscreen();

		const worker = new PixelSpritesGenerator();
		worker.postMessage(
			{
				type: "init",
				data: {
					canvas: offscreen,
					cols: 6,
					rows: 8,
					strokeStyle: theme() === "dark" ? "#f0f0f0" : "#000000",
				},
			} satisfies IWorkerPixelSpritesGeneratorMessage,
			[offscreen],
		);

		onCleanup(() => {
			worker.terminate();
		});
	});

	return (
		<>
			<Page
				id="container-page-void"
				title={t("pages.void.title")}
				headerPrepend={() => (
					<RiUserFacesGhostSmileLine
						style={{ "font-size": "2rem", color: "var(--accent)" }}
					/>
				)}
			>
				<h1>{t("pages.void.subtitle")}</h1>
				<p>{t("pages.void.description")}</p>

				<canvas ref={canvas} />
			</Page>

			<BackButton onClick={onBackButton} />
		</>
	);
};

export default PageVoid;
