import { createStore } from "solid-js/store";

export type StoreUser = {
	first_name: string;
	last_name?: string;
	profile_photo?: string;
	language?: string;
	user_id: number | string;
};

export type Store = {
	token?: string;
	user?: StoreUser;
	version?: string;
};

export const [store, setStore] = createStore<Store>({});
