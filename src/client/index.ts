import { RequestManager } from '../rest';
import { Util, Constants } from '../util';
import { EventEmitter } from 'events';
import { buildRoute, Route } from '../rest/buildRoute';
import { GatewayManager } from '../gateway/GatewayManager';

type Partialize<T extends object> = {
	[K in keyof T]?: T[K] extends object ? Partialize<T[K]> : T[K];
}

export class Client extends EventEmitter {
	public requestManager: RequestManager;
	public gatewayManager: GatewayManager;
	public token!: string | null;
	public options: ClientOptions;

	constructor(options: Partialize<ClientOptions> = {}) {
		super();
		this.options = Util.mergeDefaults(options, Constants.DEFAULT_CLIENT_OPTIONS);
		Object.defineProperty(this,
			'token', {
				value: process.env.DISCORD_TOKEN ?? null,
				writable: true
			}
		);
		this.requestManager = new RequestManager(this);
		this.gatewayManager = new GatewayManager(this);
	}

	public get api(): Route {
		return buildRoute(this);
	}

	public async login(token = this.token): Promise<this> {
		this.token = token;
		await this.gatewayManager.connect();
		return this;
	}
}

export interface ClientOptions {
	rest: {
		requestOffset: number;
		timeout: number | null;
	},
	gateway: {
		largeThreshold: number;
	}
}