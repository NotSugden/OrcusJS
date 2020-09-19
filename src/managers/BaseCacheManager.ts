// Slightly inspired by Discord.JS's Manager system
// https://github.com/discordjs/discord.js/blob/1e63f3756e814d6b1a2a9c17af9c2b28ce37e472/src/managers/BaseManager.js

import { FetchOptions } from '../util';
import { Client } from '../client';
import Base from '../structures/Base';
import ValueCache from '../util/ValueCache';

type Constructable<T, D extends { id: string } = { id: string }> = new (client: Client, data: D) => T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ClassType<T> = T extends new (...args: any[]) => infer R ? R : never

export default abstract class BaseCacheManager<
	Raw extends { id: string },
	Holds extends Constructable<Base<Raw>, Raw>
> {
	protected readonly cacheType!: Holds;
	protected readonly client!: Client;

	public cache: ValueCache<ClassType<Holds>>;

	protected constructor(
		client: Client, cacheType: Holds
	) {
		Object.defineProperties(this, {
			cacheType: { value: cacheType },
			client: { value: client }
		});
		this.cache = new ValueCache<ClassType<Holds>>();
	}

	/**
	 * @internal This method is for internal use only
	 */
	public add(data: Raw): ClassType<Holds> {
		const existing = this.cache.get(data.id);
		if (existing) {
			existing._update(data);
			return existing;
		}
		const struct = <ClassType<Holds>> new this.cacheType(this.client, data);
		this.cache.set(struct.id, struct);
		return struct;
	}

	/**
	 * @internal This method is for internal use only
	 */
	public remove(structOrId: ClassType<Holds> | string): void {
		this.cache.delete(typeof structOrId === 'string' ? structOrId : structOrId.id);
	}

	public abstract fetch(struct: ClassType<Holds>, options?: FetchOptions): Promise<ClassType<Holds>>;
	public abstract fetch(id: string, options?: FetchOptions): Promise<ClassType<Holds>>;
}

