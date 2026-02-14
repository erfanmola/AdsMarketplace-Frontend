import type { Component } from "solid-js";
import { createStore } from "solid-js/store";
import type { EntityAd } from "../api/api";
import ModalCampaignsAdd from "../modals/campaigns/Add";
import ModalCampaignsOffer from "../modals/campaigns/Offer";
import ModalEntitiesOffer from "../modals/entities/Offer";
import ModalPublishersAdd from "../modals/publishers/Add";
import ModalSettings from "../modals/Settings";

type ModalState = {
	open: boolean;
	component: Component;
};

type ModalsStore = {
	settings: ModalState;
	publishersAdd: ModalState;
	campaignsAdd: ModalState;
	campaignsOffer: ModalState & {
		campaignId?: string;
	};
	entitiesOffer: ModalState & {
		entityId?: string;
		ad?: EntityAd;
		duration?: number;
	};
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
	campaignsAdd: {
		open: false,
		component: ModalCampaignsAdd,
	},
	campaignsOffer: {
		open: false,
		component: ModalCampaignsOffer,
	},
	entitiesOffer: {
		open: false,
		component: ModalEntitiesOffer,
	},
});
