import { BaseAttachment } from './Message';

export interface APIEmbed {
	title?: string;
	type: EmbedType;
	description?: string;
	url?: string;
	timestamp?: string;
	color?: number;
	footer?: APIEmbedFooter;
	image?: APIEmbedImage;
	thumbnail?: APIEmbedThumbnail;
	video?: APIEmbedVideo;
	provider?: APIEmbedProvider;
	author?: APIEmbedAuthor;
	fields?: APIEmbedField[];
}

export interface APIEmbedFooter {
	text: string;
	icon_url?: string;
	proxy_icon_url?: string;
}

export interface APIEmbedProvider {
	name: string;
	url: string;
}

export interface APIEmbedAuthor {
	name: string;
	url?: string;
	icon_url?: string;
	proxy_icon_url?: string;
}

export interface APIEmbedField {
	name: string;
	value: string;
	inline: boolean;
}

export type APIEmbedImage = BaseAttachment;

export type APIEmbedThumbnail = BaseAttachment;

export type APIEmbedVideo = Omit<BaseAttachment, 'proxy_url'>;

export type EmbedType = 'rich' | 'image' | 'video' | 'gifv' | 'article' | 'link'