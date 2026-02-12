import { retrieveRawInitData } from "@telegram-apps/sdk-solid";
import { requestAPI } from "../utils/api";
import { urlParseQueryString } from "../utils/auth";
import type { StoreUser } from "../utils/store";
import type { Entity, OwnedCampaign, OwnedEntity } from "./api";

// API User

export type ResponseAuthUser = {
	categories: Record<string, string>;
	languages: Record<string, string>;
	limits: Record<string, any>;
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

// API Campaign

export type ResponseCampaignsOwned = {
	campaigns: Partial<OwnedCampaign>[];
	nextOffset: number;
};

export type ResponseCampaign = {
	campaign: any;
};

export type ResponseCampaignCreate = {
	id: string;
};

export const apiCampaignsOwned = async (offset = 0) =>
	requestAPI(
		`/campaigns/owned/${offset}`,
		{},
		"GET",
	) as Promise<ResponseCampaignsOwned>;

export const apiCampaign = async (id: string) =>
	requestAPI(`/campaigns/${id}`, {}, "GET") as Promise<ResponseCampaign>;

export const apiCampaignCreate = async (data: Record<string, string>) =>
	requestAPI(
		`/campaigns/create`,
		data,
		"POST",
	) as Promise<ResponseCampaignCreate>;

export const apiCampaignUpdate = async (
	id: string,
	data: Record<string, string>,
) => requestAPI(`/campaigns/${id}/update`, data, "POST") as Promise<void>;

// API Campaign
