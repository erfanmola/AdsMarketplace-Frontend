import "./Verification.scss";
import LottiePlayer from "lottix/solid/LottiePlayer";
import { type Component, onMount } from "solid-js";
import CustomMainButton from "../components/ui/CustomMainButton";
import Modal from "../components/ui/Modal";
import { useTranslation } from "../contexts/TranslationContext";
import { LottieAnimations } from "../utils/animations";
import { setModals } from "../utils/modal";
import { navigator } from "../utils/navigator";
import { invokeHapticFeedbackImpact, openLink } from "../utils/telegram";

const ModalVerification: Component = () => {
	const { t } = useTranslation();

	onMount(() => {
		invokeHapticFeedbackImpact("soft");

		navigator.modal(() => {
			onClose();
		});
	});

	const onClose = () => {
		setModals("verification", "open", false);

		if (navigator.history[navigator.history.length - 1].path === "modal") {
			navigator.history.pop();
		}
	};

	const onClickButton = () => {
		invokeHapticFeedbackImpact("soft");
		openLink("https://t.me/Eyfan");
		onClose();
	};

	return (
		<Modal
			containerClass="container-modal-verification"
			class="modal-verification"
			onClose={onClose}
			portalParent={document.querySelector("#modals")!}
			withCloseButton
		>
			<LottiePlayer
				src={LottieAnimations.duck.detective.url}
				outline={LottieAnimations.duck.detective.outline}
				autoplay
				loop
			/>

			<h1>{t("modals.verification.title")}</h1>

			<p>{t("modals.verification.description")}</p>

			<CustomMainButton
				onClick={onClickButton}
				text={t("modals.verification.button.support")}
			/>
		</Modal>
	);
};

export default ModalVerification;
