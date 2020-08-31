import { Base } from './Generics';
import { WebhookType } from '../../util/constants';
import { APIUser } from './User';

export interface APIWebhook extends Base {
	type: WebhookType;
	guild_id?: string;
	channel_id: string;
	user?: APIUser;
	name: string | null;
	avatar: string | null;
	token?: string;
}