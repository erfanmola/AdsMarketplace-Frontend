import "./Settings.scss";
// @ts-expect-error
import { BUILD_ID, BUILD_TIME } from "build-info:generated";
import { type Component, onMount } from "solid-js";
import Modal from "../components/ui/Modal";
import { setModals } from "../utils/modal";
import { invokeHapticFeedbackImpact } from "../utils/telegram";

const ModalSettings: Component = () => {
	onMount(() => {
		invokeHapticFeedbackImpact("soft");
	});

	const onClose = () => {
		setModals("settings", "open", false);
	};

	return (
		<Modal
			containerClass="container-modal-settings"
			class="modal-settings"
			onClose={onClose}
			portalParent={document.querySelector("#modals")!}
		>
			<h1>Settings</h1>

			<p>
				Build Number: {BUILD_ID} (
				{new Date(BUILD_TIME).toLocaleDateString(undefined, {
					month: "short",
					year: "numeric",
				})}
				)
			</p>
		</Modal>
	);
};

export default ModalSettings;
