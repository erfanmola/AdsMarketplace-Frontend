import type { TChartData } from "../lib/tchart/types";

export type EntityType = "channel" | "supergroup";

export type OwnedEntity = {
	id: string;
	name: string;
	members_count: number;
	is_active: boolean;
	is_verified: boolean;
	type: EntityType;
	chat_id: string | number;
	username: string;
};

export type OwnedCampaign = {
	id: string;
	name: string;
	category?: string;
	language_code?: string;
	is_ready: boolean;
};

export type EntityAd = {
	type: "channel-post" | "channel-story" | "group-pin";
	active: boolean;
	period: {
		unit: number;
		max: number;
	};
	price: {
		perHour: number;
	};
};

export type EntityAds = Record<EntityAd["type"], EntityAd>;

export type EntityBase<T, U> = {
	chat_id: string | number;
	id: string;
	is_active: boolean;
	is_verified: boolean;
	members_count: number;
	name: string;
	role: "owner" | "viewer";
	type: T;
	username: string;
	statistic?: U;
	category?: string;
	language_code?: string;
	ads?: EntityAds;
};

export type EntityChannel = EntityBase<
	"channel",
	{
		premiumAudience: {
			part?: number;
			total?: number;
		};
		period: {
			minDate: number;
			maxDate: number;
		};
		followers: {
			current: number;
			previous: number;
		};
		viewsPerPost: {
			current: number;
			previous: number;
		};
		sharesPerPost: {
			current: number;
			previous: number;
		};
		reactionsPerPost: {
			current: number;
			previous: number;
		};
		viewsPerStory: {
			current: number;
			previous: number;
		};
		sharesPerStory: {
			current: number;
			previous: number;
		};
		enabledNotifications: {
			part: number;
			total: number;
		};
		growthGraph?: TChartData;
		followersGraph?: TChartData;
		muteGraph?: TChartData;
		topHoursGraph?: TChartData;
		interactionsGraph?: TChartData;
		ivInteractionsGraph?: TChartData;
		viewsBySourceGraph?: TChartData;
		newFollowersBySourceGraph?: TChartData;
		languagesGraph?: TChartData;
		reactionsByEmotionGraph?: TChartData;
		storyInteractionsGraph?: TChartData;
		storyReactionsByEmotionGraph?: TChartData;
	}
>;

export type EntityGroup = EntityBase<
	"supergroup",
	{
		premiumAudience: {
			part?: number;
			total?: number;
		};
		period: {
			minDate: number;
			maxDate: number;
		};
		members: {
			current: number;
			previous: number;
		};
		messages: {
			current: number;
			previous: number;
		};
		viewers: {
			current: number;
			previous: number;
		};
		posters: {
			current: number;
			previous: number;
		};
		growthGraph?: TChartData;
		membersGraph?: TChartData;
		newMembersBySourceGraph?: TChartData;
		languagesGraph?: TChartData;
		messagesGraph?: TChartData;
		actionsGraph?: TChartData;
		topHoursGraph?: TChartData;
		weekdaysGraph?: TChartData;
	}
>;

export type Entity = EntityChannel | EntityGroup;
