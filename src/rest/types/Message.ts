import { APIUser } from './User';
import { APIEmbed } from './Embed';
import { APIEmoji } from './Emoji';
import { MessageActivityType, MessageType } from '../../util/constants';
import { APIChannelMention } from './Channel';
import { Base } from './Generics';

interface BaseMessage extends Base {
	channel_id: string;
	author: APIUser;
	content: string;
	timestamp: string;
	edited_timestamp: string | null;
	tts: boolean;
	mention_everyone: boolean;
	mentions: APIUser[];
	mention_roles: string[];
	attachments: APIAttachment[];
	embeds: APIEmbed[];
	reactions?: APIMessageReaction[];
	pinned: boolean;
	activity?: APIMessageActivity;
	application?: APIMessageApplication;
	flags?: number;
}

export interface APIDMMessage extends BaseMessage {
	type: MessageType.DEFAULT | MessageType.CHANNEL_PINNED_MESSAGE;
	mention_everyone: false;
	mention_roles: never[];
}

export interface APIGuildMessage extends BaseMessage {
	type: MessageType;
	guild_id: string;
}

export interface APIWebhookMessage extends APIGuildMessage {
	type: MessageType.DEFAULT;
	webhook_id: string;
}

export interface APICrosspostedMessage extends APIWebhookMessage {
	mention_channels?: APIChannelMention[];
}

export type APIMessage = APICrosspostedMessage | APIWebhookMessage | APIGuildMessage | APIDMMessage;

export interface BaseAttachment {
	url: string;
	proxy_url: string;
	height: number;
	width: number;
}

export interface APIAttachment extends Omit<BaseAttachment, 'height' | 'width'> {
	id: string;
	filename: string;
	size: number;
	height: number | null;
	width: number | null;
}

export interface APIMessageReaction {
	count: number;
	me: boolean;
	emoji: APIEmoji;
}

export interface APIMessageActivity {
	type: MessageActivityType;
	party_id?: string;
}

export interface APIMessageApplication {
	id: string;
	cover_image?: string;
	description: string;
	icon: string | null;
	name: string;
}