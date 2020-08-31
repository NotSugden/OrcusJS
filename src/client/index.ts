import { RequestManager } from '../rest';
import { Util, Constants } from '../util';
import { EventEmitter } from 'events';

export class Client extends EventEmitter {
	private requestManager: RequestManager;

	public token!: string | null;
	public options: ClientOptions;

	constructor(options: Partial<ClientOptions> = {}) {
		super();
		this.options = Util.mergeDefaults(options, Constants.DEFAULT_CLIENT_OPTIONS);
		Object.defineProperty(this,
			'token', {
				value: process.env.DISCORD_TOKEN ?? null,
				writable: true
			}
		);
		this.requestManager = new RequestManager(this);
	}
}

export interface ClientOptions {
	rest: {
		requestOffset: number;
		timeout: number | null;
	}
}