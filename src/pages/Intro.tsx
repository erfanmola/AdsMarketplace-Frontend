import LottiePlayer from "lottix/solid/LottiePlayer";
import { Transition } from "solid-transition-group";
import CustomMainButton from "../components/ui/CustomMainButton";
import { useTranslation } from "../contexts/TranslationContext";
import { type LottieAnimation, LottieAnimations } from "../utils/animations";
import "./Intro.scss";
import {
	type Component,
	createEffect,
	createSelector,
	createSignal,
	For,
	on,
	onMount,
	Show,
} from "solid-js";
import type Swiper from "swiper";
import { setSettings } from "../utils/settings";
import { invokeHapticFeedbackImpact } from "../utils/telegram";

const PageIntro: Component = () => {
	const { t } = useTranslation();

	const [step, setStep] = createSignal(0);
	const isActive = createSelector(step);

	const animations: LottieAnimation[] = [
		LottieAnimations.duck.celebrate,
		LottieAnimations.duck.glassShine,
		LottieAnimations.duck.acceptMoney,
		LottieAnimations.duck.transparent,
		LottieAnimations.duck.hashtags,
	];

	const Animation = () => {
		const [toggle, setToggle] = createSignal(true);

		createEffect(
			on(
				step,
				() => {
					invokeHapticFeedbackImpact("light");

					setToggle(false);

					setTimeout(() => {
						setToggle(true);
					});
				},
				{
					defer: true,
				},
			),
		);

		return (
			<Transition name="transition-slide-fade">
				<Show when={toggle()}>
					<LottiePlayer
						src={animations[step()].url}
						outline={animations[step()].outline}
						autoplay
						playOnClick
					/>
				</Show>
			</Transition>
		);
	};

	onMount(() => {
		const slider: any = document.querySelector("#container-slider-intro");
		if (!slider) return;

		const swiper: Swiper = slider.swiper;
		if (!swiper) return;

		swiper.on("slideChange", () => {
			setStep(swiper.activeIndex);
		});
	});

	return (
		<div id="container-page-intro" class="page">
			<div>
				<header>
					<Animation />
				</header>

				<div>
					<swiper-container id="container-slider-intro" initial-slide={step()}>
						<swiper-slide>
							<h1>{t("pages.intro.sections.intro.title")}</h1>
							<p> {t("pages.intro.sections.intro.description")}</p>
						</swiper-slide>

						<swiper-slide>
							<h1>{t("pages.intro.sections.advertisers.title")}</h1>
							<p> {t("pages.intro.sections.advertisers.description")}</p>
						</swiper-slide>

						<swiper-slide>
							<h1>{t("pages.intro.sections.publishers.title")}</h1>
							<p> {t("pages.intro.sections.publishers.description")}</p>
						</swiper-slide>

						<swiper-slide>
							<h1>{t("pages.intro.sections.flow.title")}</h1>
							<p> {t("pages.intro.sections.flow.description")}</p>
						</swiper-slide>

						<swiper-slide>
							<h1>{t("pages.intro.sections.done.title")}</h1>
							<p> {t("pages.intro.sections.done.description")}</p>
						</swiper-slide>
					</swiper-container>

					<ul>
						<For each={Array.from(new Array(animations.length))}>
							{(_, index) => (
								<li classList={{ active: isActive(index()) }}></li>
							)}
						</For>
					</ul>
				</div>
			</div>

			<footer class="safe-area-bottom">
				<CustomMainButton
					onClick={() => {
						invokeHapticFeedbackImpact("soft");
						setSettings("intro", "done", true);
					}}
					text={t("pages.intro.button.start")}
				/>
			</footer>
		</div>
	);
};

export default PageIntro;
