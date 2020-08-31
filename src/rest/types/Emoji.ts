import { APIUser } from './User';
import { Base } from './Generics';

export interface APIUnicodeEmoji {
	id: null;
	name: string;
}

export interface APIGuildEmoji extends Base {
	name: string;
	roles: string[];
	user: APIUser;
	require_colons: boolean;
	managed: boolean;
	animated: boolean;
	available: boolean;
}

export type APIEmoji = APIUnicodeEmoji | APIGuildEmoji;