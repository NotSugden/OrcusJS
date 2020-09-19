// Slightly inspired by Discord.JS's collection package
// https://github.com/discordjs/collection
// Opted not to extend that as to use my own implementation for specific method

export default class ValueCache<V, K = string> extends Map<K, V> {
	public constructor(iterable?: Iterable<readonly [K, V]> | readonly (readonly [K, V])[]) {
		// lazy type-fix
		super(iterable!);
	}

	public find<T extends V = V>(fn: (value: V, key: K, cache: this) => boolean): T | null {
		for (const [key, value] of this) {
			if (fn(value, key, this)) return <T> value;
		}
		return null;
	}

	public filter(fn: (value: V, key: K, cache: this) => boolean): ValueCache<V, K> {
		const filtered = new ValueCache<V, K>();
		for (const [key, value] of this) {
			if (fn(value, key, this)) filtered.set(key, value);
		}
		return filtered;
	}

	/**
	 * Deletes values that meet the condition specified.
	 */
	public sweep(fn: (value: V, key: K, cache: this) => boolean): this {
		for (const [key, value] of this) {
			if (fn(value, key, this)) this.delete(key);
		}
		return this;
	}

	/**
	 * Partitions the collection into multiple arrays.
	 * The return type for the callback should be the index of which that array
	 * should be in the returned array.
	 * use -1 to ignore value
	 * @example
	 * const [usersNamedJohn, usersNamedBob, usersNamedFred] = users.partition(value => {
	 *   if (value.username === 'John') return 0;
	 *   else if (value.username === 'Bob') return 1;
	 *   else if (value.username === 'Fred') return 2;
	 *   return -1;
	 * })
	 */
	public partition(fn: (value: V, key: K, cache: this) => number): V[][] {
		const arrays: V[][] = [];
		for (const [key, value] of this) {
			const index = fn(value, key, this);
			if (index === -1) continue;
			if (!arrays[index]) arrays[index] = [value];
			else arrays[index].push(value);
		}
		return arrays;
	}
}