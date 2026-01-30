import type { Component } from "solid-js";
import { createStore } from "solid-js/store";
import ModalPublishersAdd from "../modals/publishers/Add";
import ModalSettings from "../modals/Settings";

type ModalState = {
	open: boolean;
	component: Component;
};

type ModalsStore = {
	settings: ModalState;
	publishersAdd: ModalState;
};

export const [modals, setModals] = createStore<ModalsStore>({
	settings: {
		open: false,
		component: ModalSettings,
	},
	publishersAdd: {
		open: false,
		component: ModalPublishersAdd,
	},
});
