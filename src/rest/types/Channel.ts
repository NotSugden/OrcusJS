import { ChannelType } from '../../util/constants';
import { APIOverwrite } from './Overwrite';
import { APIUser } from './User';
import { Base } from './Generics';

interface BaseChannel extends Base {
	name: string;
	type: ChannelType;
}

interface TextBasedChannel extends BaseChannel {
	last_message_id: string | null;
	last_pin_timestamp: string;
}

export interface APIGuildChannelBase extends BaseChannel {
	guild_id: string;
	position: number;
	permission_overwrites: APIOverwrite[];
	parent_id: string | null;
	nsfw: boolean;
}

export interface APITextChannel extends APIGuildChannelBase, TextBasedChannel {
	type: ChannelType.TEXT,
	topic: string | null;
	rate_limit_per_user: number;
}

export interface APIDMChannel extends Omit<TextBasedChannel, 'name'> {
	type: ChannelType.DM,
	recipients: [APIUser],
}

export interface APIVoiceChannel extends APIGuildChannelBase {
	type: ChannelType.VOICE;
	nsfw: false;
	bitrate: number;
	user_limit: number;
}

export interface APIGroupDMChannel extends Omit<BaseChannel, 'name'> {
	type: ChannelType.GROUP_DM;
	name: null | string;
	icon: null | string;
}

export interface APICategoryChannel extends APIGuildChannelBase {
	type: ChannelType.CATEGORY;
	parent_id: null;
	nsfw: false;
}

export interface APINewsChannel extends Omit<APITextChannel, 'type'> {
	type: ChannelType.NEWS;
}

export interface APIStoreChannel extends APIGuildChannelBase {
	type: ChannelType.STORE;
	nsfw: false;
}

export interface APIChannelMention extends BaseChannel {
	guild_id: string;
}

// Group DM channel can only come from the `invites/{invite.code}` endpoint
export type APIChannel =
	| APITextChannel
	| APIDMChannel
	| APIVoiceChannel
	| APICategoryChannel
	| APINewsChannel
	| APICategoryChannel;

export type APIGuildChannel = Exclude<APIChannel, APIDMChannel>;