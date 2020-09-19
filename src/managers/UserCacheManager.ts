import { APIUser } from 'discord-api-types/v6';
import { Client } from '../client';
import { User } from '../structures';
import { FetchOptions } from '../util';
import BaseCacheManager from './BaseCacheManager';

export default class UserCacheManager extends BaseCacheManager<APIUser, typeof User> {
	constructor(client: Client) {
		super(client, User);
	}

	async fetch(userOrID: User | string, options: FetchOptions = {}): Promise<User> {
		let existing: User | null = null;
		if (typeof userOrID === 'string') {
			existing = this.cache.get(userOrID) || null;
			if (existing && !options.force) return existing;
		} else {
			existing = userOrID;
			userOrID = userOrID.id;
		}
		const data = await this.client.api.users(userOrID).get<APIUser>();
		if (existing && options.cache === false) {
			existing._update(data);
			return existing;
		} 
		return this.add(data);
	}
}