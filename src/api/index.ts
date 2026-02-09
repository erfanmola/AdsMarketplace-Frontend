import { retrieveRawInitData } from "@telegram-apps/sdk-solid";
import { requestAPI } from "../utils/api";
import { urlParseQueryString } from "../utils/auth";
import type { StoreUser } from "../utils/store";
import type { Entity, OwnedEntity } from "./api";

// API User

export type ResponseAuthUser = {
	categories: Record<string, string>;
	languages: Record<string, string>;
	token: string;
	user: StoreUser;
};

export const apiAuthUser = async () =>
	requestAPI(
		"/auth",
		{
			initDataUnsafe: JSON.stringify(
				urlParseQueryString(retrieveRawInitData() ?? ""),
			),
		},
		"POST",
	) as Promise<ResponseAuthUser>;

// API User

// API Entity

export type ResponseEntitiesOwned = {
	entities: Partial<OwnedEntity>[];
	nextOffset: number;
};

export type ResponseEntity = {
	entity: Entity;
};

export const apiEntitiesOwned = async (offset = 0) =>
	requestAPI(
		`/entities/owned/${offset}`,
		{},
		"GET",
	) as Promise<ResponseEntitiesOwned>;

export const apiEntity = async (id: string) =>
	requestAPI(`/entities/${id}`, {}, "GET") as Promise<ResponseEntity>;

export const apiEntityUpdate = async (
	id: string,
	data: Record<string, string>,
) => requestAPI(`/entities/${id}/update`, data, "POST") as Promise<void>;

// API Entity
