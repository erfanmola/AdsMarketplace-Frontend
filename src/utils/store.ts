import { createStore } from "solid-js/store";

export type Notification = {
	id: number;
	message: string;
	type: "success" | "error" | "info";
};

export type OwnedChannel = {
	type: "channel";
};

export type OwnedGroup = {
	type: "group";
};

export type Channel = {
	type: "channel";
};

export type Group = {
	type: "group";
};

export type Order = {
	id: number;
	status: string;
};

export type OwnedEntity = OwnedChannel | OwnedGroup;

export type Entity = Channel | Group;

export type StoreUser = {
	first_name: string;
	last_name?: string;
	profile_photo?: string;
	language?: string;
	user_id: number | string;
};

export type StoreData = {
	notifications?: Notification[];
	entities?: OwnedEntity[];
	orders?: Order[];
};

export type Store = {
	data?: StoreData;
	token?: string;
	user?: StoreUser;
	version?: string;
};

export const [store, setStore] = createStore<Store>({});
