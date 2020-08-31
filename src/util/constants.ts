export const API_URL = 'http://discord.com/api';
export const API_VERSION = 7;

export const DEFAULT_CLIENT_OPTIONS = {
	rest: {
		requestOffset: 500,
		timeout: 20 * 1000
	}
};

export enum AuditLogEvent {
	GUILD_UPDATE = 1,
	CHANNEL_CREATE = 10,
	CHANNEL_UPDATE = 11,
	CHANNEL_DELETE = 12,
	CHANNEL_OVERWRITE_CREATE = 13,
	CHANNEL_OVERWRITE_UPDATE = 14,
	CHANNEL_OVERWRITE_DELETE = 15,
	MEMBER_KICK = 20,
	MEMBER_PRUNE = 21,
	MEMBER_BAN_ADD = 22,
	MEMBER_BAN_REMOVE = 23,
	MEMBER_UPDATE = 24,
	MEMBER_ROLE_UPDATE = 25,
	MEMBER_MOVE = 26,
	MEMBER_DISCONNECT = 27,
	BOT_ADD = 28,
	ROLE_CREATE = 30,
	ROLE_UPDATE = 31,
	ROLE_DELETE = 32,
	INVITE_CREATE = 40,
	INVITE_UPDATE = 41,
	INVITE_DELETE = 42,
	WEBHOOK_CREATE = 50,
	WEBHOOK_UPDATE = 51,
	WEBHOOK_DELETE = 52,
	EMOJI_CREATE = 60,
	EMOJI_UPDATE = 61,
	EMOJI_DELETE = 62,
	MESSAGE_DELETE = 72,
	MESSAGE_BULK_DELETE = 73,
	MESSAGE_PIN = 74,
	MESSAGE_UNPIN = 75,
	INTEGRATION_CREATE = 80,
	INTEGRATION_UPDATE = 81,
	INTEGRATION_DELETE = 82,
}

export enum ChannelType {
	TEXT = 0,
	DM = 1,
	VOICE = 2,
	GROUP_DM = 3,
	CATEGORY = 4,
	NEWS = 5,
	STORE = 6
}

// types 1-5 cannot be achieved on a bot account, thus not covered here
export enum MessageType {
	DEFAULT = 0,
	CHANNEL_PINNED_MESSAGE = 6,
	GUILD_MEMBER_JOIN = 7,
	USER_PREMIUM_GUILD_SUBSCRIPTION = 8,
	USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1 = 9,
	USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2 = 10,
	USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3 = 11,
	CHANNEL_FOLLOW_ADD = 12,
	GUILD_DISCOVERY_DISQUALIFIED = 14,
	GUILD_DISCOVERY_REQUALIFIED = 15,
}

export enum MessageActivityType {
	JOIN = 1,
	SPECTATE = 2,
	LISTEN = 3,
	// Type 4 is undocumented, unknown
	JOIN_REQUEST = 4
}

export enum MessageFlag {
	CROSSPOSTED = 1 << 0,
	IS_CROSSPOST = 1 << 2,
	SUPPRESS_EMBEDS = 1 << 3,
	SOURCE_MESSAGE_DELETED = 1 << 4,
	URGENT = 1 << 5
}

export enum PermissionFlag {
  CREATE_INSTANT_INVITE = 1 << 0,
  KICK_MEMBERS = 1 << 1,
  BAN_MEMBERS = 1 << 2,
  ADMINISTRATOR = 1 << 3,
  MANAGE_CHANNELS = 1 << 4,
  MANAGE_GUILD = 1 << 5,
  ADD_REACTIONS = 1 << 6,
  VIEW_AUDIT_LOG = 1 << 7,
  PRIORITY_SPEAKER = 1 << 8,
  STREAM = 1 << 9,
  VIEW_CHANNEL = 1 << 10,
  SEND_MESSAGES = 1 << 11,
  SEND_TTS_MESSAGES = 1 << 12,
  MANAGE_MESSAGES = 1 << 13,
  EMBED_LINKS = 1 << 14,
  ATTACH_FILES = 1 << 15,
  READ_MESSAGE_HISTORY = 1 << 16,
  MENTION_EVERYONE = 1 << 17,
  USE_EXTERNAL_EMOJIS = 1 << 18,
  VIEW_GUILD_INSIGHTS = 1 << 19,
  CONNECT = 1 << 20,
  SPEAK = 1 << 21,
  MUTE_MEMBERS = 1 << 22,
  DEAFEN_MEMBERS = 1 << 23,
  MOVE_MEMBERS = 1 << 24,
  USE_VAD = 1 << 25,
  CHANGE_NICKNAME = 1 << 26,
  MANAGE_NICKNAMES = 1 << 27,
  MANAGE_ROLES = 1 << 28,
  MANAGE_WEBHOOKS = 1 << 29,
  MANAGE_EMOJIS = 1 << 30,
}

export enum VerificationLevel {
	NONE = 0,
	LOW = 1,
	MEDIUM = 2,
	HIGH = 3,
	VERY_HIGH = 4
}

export enum DefaultMessageNotification {
	ALL_MESSAGES = 0,
	ONLY_MENTIONS = 1
}

export enum ExplicitContentFilter {
	DISABLED = 0,
	MEMBERS_WITHOUT_ROLES = 1,
	ALL_MEMBERS = 2
}

export enum MFALevel {
	NONE = 0,
	ELEVATED = 1
}

export enum SystemChannelFlag {
	SUPPRESS_JOIN_NOTIFICATIONS = 1 << 0,
	SUPPRESS_PREMIUM_NOTIFICATIONS = 1 << 1
}

export enum PremiumTier {
	NONE = 0,
	TIER_1 = 1,
	TIER_2 = 2,
	TIER_3 = 3
}

export enum IntegrationType {
	YOUTUBE = 'youtube',
	TWITCH = 'twitch',
	DISCORD = 'discord'
}

export enum IntegrationExpireBehavior {
	REMOVE_ROLE = 0,
	KICK = 1
}

export enum TeamMembershipState {
	INVITED = 1,
	ACCEPTED = 2
}

export enum WebhookType {
	INCOMING = 1,
	CHANNEL_FOLLOWER = 2
}