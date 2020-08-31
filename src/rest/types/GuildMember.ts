import { APIUser } from './User';

export interface APIGuildMember {
	user: APIUser;
	nick: string | null;
	roles: string[];
	joined_at: string;
	premium_since: string;
	deaf: boolean;
	mute: boolean;
}