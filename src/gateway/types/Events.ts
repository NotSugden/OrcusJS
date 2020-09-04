import { APIUser } from '../../rest/types/User';

export interface WSEventPackets {
	READY: {
		v: number;
		// user-accounts only, which isn't supported
		user_settings: {};
		user: APIUser & {
			verified: boolean;
			mfa_enabled: boolean;
			email: string | null;
		};
		session_id: string;
		relationships: [];
		private_channels: [];
		presences: [];
		guilds: { unavailable: true; id: string }[];
		application: { id: string; flags: number };
	};
	CHANNEL_CREATE: Record<string, unknown>;
	CHANNEL_UPDATE: Record<string, unknown>;
	CHANNEL_DELETE: Record<string, unknown>;
	CHANNEL_PINS_UPDATE: Record<string, unknown>;
	GUILD_CREATE: Record<string, unknown>;
	GUILD_UPDATE: Record<string, unknown>;
	GUILD_DELETE: Record<string, unknown>;
	GUILD_BAN_ADD: Record<string, unknown>;
	GUILD_BAN_REMOVE: Record<string, unknown>;
	GUILD_EMOJIS_UPDATE: Record<string, unknown>;
	GUILD_INTEGRATIONS_UPDATE: Record<string, unknown>;
	GUILD_MEMBER_ADD: Record<string, unknown>;
	GUILD_MEMBER_REMOVE: Record<string, unknown>;
	GUILD_MEMBER_UPDATE: Record<string, unknown>;
	GUILD_MEMBERS_CHUNK: Record<string, unknown>;
	GUILD_ROLE_CREATE: Record<string, unknown>;
	GUILD_ROLE_UPDATE: Record<string, unknown>;
	GUILD_ROLE_DELETE: Record<string, unknown>;
	INVITE_CREATE: Record<string, unknown>;
	INVITE_DELETE: Record<string, unknown>;
	MESSAGE_CREATE: Record<string, unknown>;
	MESSAGE_UPDATE: Record<string, unknown>;
	MESSAGE_DELETE: Record<string, unknown>;
	MESSAGE_DELETE_BULK: Record<string, unknown>;
	MESSAGE_REACTION_ADD: Record<string, unknown>;
	MESSAGE_REACTION_REMOVE: Record<string, unknown>;
	MESSAGE_REACTION_REMOVE_ALL: Record<string, unknown>;
	MESSAGE_REACTION_REMOVE_EMOJI: Record<string, unknown>;
	PRESENCE_UPDATE: Record<string, unknown>;
	TYPING_START: Record<string, unknown>;
	USER_UPDATE: Record<string, unknown>;
	VOICE_STATE_UPDATE: Record<string, unknown>;
	VOICE_SERVER_UPDATE: Record<string, unknown>;
	WEBHOOKS_UPDATE: Record<string, unknown>;
}