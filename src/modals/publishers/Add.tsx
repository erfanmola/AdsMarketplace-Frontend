import "./Add.scss";
import LottiePlayer from "lottix/solid/LottiePlayer";
import {
	TbOutlineEdit,
	TbOutlineLifebuoy,
	TbOutlinePinned,
	TbOutlineSubtitlesEdit,
	TbOutlineTrash,
	TbOutlineUserStar,
} from "solid-icons/tb";
import { type Component, createEffect, Match, onMount, Switch } from "solid-js";
import { createStore } from "solid-js/store";
import AnimatedText from "../../components/ui/AnimatedText";
import Clickable from "../../components/ui/Clickable";
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

	const [state, setState] = createStore<{
		state: "channel" | "group";
		title: string;
		toggle: string;
		button: string;
		rowOne: {
			title: string;
			description: string;
		};
		rowTwo: {
			title: string;
			description: string;
		};
		rowThree: {
			title: string;
			description: string;
		};
		rowFour: {
			title: string;
			description: string;
		};
	}>({
		state: "channel",
		title: t(`modals.publishersAdd.title.channel`),
		toggle: t(`modals.publishersAdd.toggle.channel`),
		button: t(`modals.publishersAdd.button.channel`),
		rowOne: {
			title: t("modals.publishersAdd.permissions.post.title"),
			description: t("modals.publishersAdd.permissions.post.description"),
		},
		rowTwo: {
			title: t("modals.publishersAdd.permissions.edit.title"),
			description: t("modals.publishersAdd.permissions.edit.description"),
		},
		rowThree: {
			title: t("modals.publishersAdd.permissions.delete.title"),
			description: t("modals.publishersAdd.permissions.delete.description"),
		},
		rowFour: {
			title: t("modals.publishersAdd.permissions.promote.title"),
			description: t("modals.publishersAdd.permissions.promote.description"),
		},
	});

	onMount(() => {
		invokeHapticFeedbackImpact("soft");
	});

	createEffect(() => {
		setState("title", t(`modals.publishersAdd.title.${state.state}`));
		setState("toggle", t(`modals.publishersAdd.toggle.${state.state}`));
		setState("button", t(`modals.publishersAdd.button.${state.state}`));

		if (state.state === "channel") {
			setState("rowOne", {
				title: t("modals.publishersAdd.permissions.post.title"),
				description: t("modals.publishersAdd.permissions.post.description"),
			});
		} else if (state.state === "group") {
			setState("rowOne", {
				title: t("modals.publishersAdd.permissions.pin.title"),
				description: t("modals.publishersAdd.permissions.pin.description"),
			});
		}

		if (state.state === "channel") {
			setState("rowTwo", {
				title: t("modals.publishersAdd.permissions.edit.title"),
				description: t("modals.publishersAdd.permissions.edit.description"),
			});
		} else if (state.state === "group") {
			setState("rowTwo", {
				title: t("modals.publishersAdd.permissions.restrict.title"),
				description: t("modals.publishersAdd.permissions.restrict.description"),
			});
		}
	});

	const onClose = () => {
		setModals("publishersAdd", "open", false);
	};

	const onClickButton = () => {
		invokeHapticFeedbackImpact("soft");

		openLink(
			state.state === "channel"
				? getBotInviteAdminUrl(
						{
							add_admins: true,
							post_messages: true,
							delete_messages: true,
							edit_messages: true,
						},
						state.state,
					)
				: getBotInviteAdminUrl(
						{
							add_admins: true,
							pin_messages: true,
							delete_messages: true,
							ban_users: true,
						},
						state.state,
					),
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

			<AnimatedText text={state.title} />

			<p>{t("modals.publishersAdd.description")}</p>

			<ul>
				<li>
					<Switch>
						<Match when={state.state === "channel"}>
							<TbOutlineEdit style={{ color: "#3b86f6" }} />
						</Match>

						<Match when={state.state === "group"}>
							<TbOutlinePinned style={{ color: "#3b86f6" }} />
						</Match>
					</Switch>

					<div>
						<AnimatedText text={state.rowOne.title} />
						<AnimatedText text={state.rowOne.description} />
					</div>
				</li>

				<li>
					<Switch>
						<Match when={state.state === "channel"}>
							<TbOutlineSubtitlesEdit style={{ color: "#a267eb" }} />
						</Match>

						<Match when={state.state === "group"}>
							<TbOutlineLifebuoy style={{ color: "#a267eb" }} />
						</Match>
					</Switch>

					<div>
						<AnimatedText text={state.rowTwo.title} />
						<AnimatedText text={state.rowTwo.description} />
					</div>
				</li>

				<li>
					<TbOutlineTrash style={{ color: "#d8664d" }} />

					<div>
						<AnimatedText text={state.rowThree.title} />
						<AnimatedText text={state.rowThree.description} />
					</div>
				</li>

				<li>
					<TbOutlineUserStar style={{ color: "#db374b" }} />

					<div>
						<AnimatedText text={state.rowFour.title} />
						<AnimatedText text={state.rowFour.description} />
					</div>
				</li>
			</ul>

			<Clickable
				onClick={() => {
					invokeHapticFeedbackImpact("soft");
					setState("state", state.state === "channel" ? "group" : "channel");
				}}
			>
				<AnimatedText text={state.toggle} />
			</Clickable>

			<CustomMainButton onClick={onClickButton} text={state.button} />
		</Modal>
	);
};

export default ModalPublishersAdd;
