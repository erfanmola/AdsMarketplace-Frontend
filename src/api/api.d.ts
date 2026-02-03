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
