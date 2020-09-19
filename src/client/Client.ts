import { RequestManager } from './rest';
import Util, { Constants } from '../util';
import { EventEmitter } from 'events';
import { buildRoute, Route } from './rest/buildRoute';
import GatewayManager from './gateway/GatewayManager';
import { UserCacheManager } from '../managers';

type Partialize<T extends object> = {
	[K in keyof T]?: T[K] extends object ? Partialize<T[K]> : T[K];
}

export default class Client extends EventEmitter {
	public gatewayManager: GatewayManager;
	public options: ClientOptions;
	public requestManager: RequestManager;
	public token!: string | null;
	public users: UserCacheManager;

	constructor(options: Partialize<ClientOptions> = {}) {
		super();
		this.options = Util.mergeDefaults(options, Constants.DEFAULT_CLIENT_OPTIONS);
		Object.defineProperty(this,
			'token', {
				value: process.env.DISCORD_TOKEN ?? null,
				writable: true
			}
		);
		this.gatewayManager = new GatewayManager(this);
		this.requestManager = new RequestManager(this);
		this.users = new UserCacheManager(this);
	}

	/**
	 * @internal This is for internal use only
	 */
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