import { APIUser } from './User';
import { ChannelType } from '../../util/constants';

export interface Base {
	id: string;
}

export interface PartialObject extends Base {
	name: string;
}

export interface APIBan {
	user: APIUser;
	reason: string | null;
}

export interface PartialAPIChannel<T extends ChannelType> extends Base {
	name: string;
	type: T;
}

export interface APIVanityURL {
	code: string | null;
	uses: number;
}

export interface APIGuildWidget {
	enabled: boolean;
	channel_id: string | null;
}