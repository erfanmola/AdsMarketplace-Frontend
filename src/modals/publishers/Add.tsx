import "./Add.scss";
import LottiePlayer from "lottix/solid/LottiePlayer";
import {
	TbOutlineEdit,
	TbOutlineSubtitlesEdit,
	TbOutlineTrash,
	TbOutlineUserStar,
} from "solid-icons/tb";
import { type Component, onMount } from "solid-js";
import CustomMainButton from "../../components/ui/CustomMainButton";
import Modal from "../../components/ui/Modal";
import { useTranslation } from "../../contexts/TranslationContext";
import { LottieAnimations } from "../../utils/animations";
import { setModals } from "../../utils/modal";
import {
	getBotInviteAdminUrl,
	invokeHapticFeedbackImpact,
	openLink,
} from "../../utils/telegram";

const ModalPublishersAdd: Component = () => {
	const { t } = useTranslation();

	onMount(() => {
		invokeHapticFeedbackImpact("soft");
	});

	const onClose = () => {
		setModals("publishersAdd", "open", false);
	};

	const onClickButton = () => {
		invokeHapticFeedbackImpact("soft");

		openLink(
			getBotInviteAdminUrl({
				add_admins: true,
				post_messages: true,
				delete_messages: true,
				edit_messages: true,
			}),
		);

		setTimeout(() => {
			setModals("publishersAdd", "open", false);
		});
	};

	return (
		<Modal
			containerClass="container-modal-publishers-add"
			class="modal-publishers-add"
			onClose={onClose}
			portalParent={document.querySelector("#modals")!}
			type="fullheight"
			withCloseButton
		>
			<LottiePlayer
				src={LottieAnimations.duck.premiumCloak.url}
				outline={LottieAnimations.duck.premiumCloak.outline}
				autoplay
				loop
			/>

			<h1>{t("modals.publishersAdd.title")}</h1>

			<p>{t("modals.publishersAdd.description")}</p>

			<ul>
				<li>
					<TbOutlineEdit style={{ color: "#3b86f6" }} />

					<div>
						<span>{t("modals.publishersAdd.permissions.post.title")}</span>
						<p>{t("modals.publishersAdd.permissions.post.description")}</p>
					</div>
				</li>

				<li>
					<TbOutlineSubtitlesEdit style={{ color: "#a267eb" }} />

					<div>
						<span>{t("modals.publishersAdd.permissions.edit.title")}</span>
						<p>{t("modals.publishersAdd.permissions.edit.description")}</p>
					</div>
				</li>

				<li>
					<TbOutlineTrash style={{ color: "#d8664d" }} />

					<div>
						<span>{t("modals.publishersAdd.permissions.delete.title")}</span>
						<p>{t("modals.publishersAdd.permissions.delete.description")}</p>
					</div>
				</li>

				<li>
					<TbOutlineUserStar style={{ color: "#db374b" }} />

					<div>
						<span>{t("modals.publishersAdd.permissions.promote.title")}</span>
						<p>{t("modals.publishersAdd.permissions.promote.description")}</p>
					</div>
				</li>
			</ul>

			<CustomMainButton
				onClick={onClickButton}
				text={t("modals.publishersAdd.button.text")}
			/>
		</Modal>
	);
};

export default ModalPublishersAdd;
