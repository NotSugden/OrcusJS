import { Client } from '../client';

export default abstract class Base<Raw extends { id: string }> {
	protected readonly client!: Client;

	public readonly id!: string;

	constructor(client: Client, data: Raw) {
		Object.defineProperties(this, {
			client: { value: client },
			id: { enumerable: true, value: data.id, writable: false }
		});

		this._update(data);
	}

	public abstract equals(data: Raw | Base<Raw>): boolean;

	/**
	 * @internal This method is for internal use only
	 */
	public abstract _update(data: Raw): void
}