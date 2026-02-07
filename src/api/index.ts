import { retrieveRawInitData } from "@telegram-apps/sdk-solid";
import { requestAPI } from "../utils/api";
import { urlParseQueryString } from "../utils/auth";
import type { StoreUser } from "../utils/store";
import type { Entity, OwnedEntity } from "./api";

type ResponseAuthUser = {
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

type ResponseEntitiesOwned = {
	entities: Partial<OwnedEntity>[];
	nextOffset: number;
};

export const apiEntitiesOwned = async (offset = 0) =>
	requestAPI(
		`/entities/owned/${offset}`,
		{},
		"GET",
	) as Promise<ResponseEntitiesOwned>;

type ResponseEntity = {
	entity: Entity;
};

export const apiEntity = async (id: string) =>
	requestAPI(`/entities/${id}`, {}, "GET") as Promise<ResponseEntity>;
