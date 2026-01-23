import { createStore } from "solid-js/store";

export type Store = {
	token?: string;
	version?: string;
};

export const [store, setStore] = createStore<Store>({});
