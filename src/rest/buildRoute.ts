// inspired by discord.js https://github.com/discordjs/discord.js/blob/b0ab37ddc0614910e032ccf423816e106c3804e5/src/rest/APIRouter.js#L1
import { Client } from '../client';
import { RequestMethod } from '../util/constants';
import { RequestOptions } from './RequestManager';

const ID_REGEX = /^\d{16,19}$/;
const MAJOR_PARAMETERS = ['channels', 'guilds'];

const getBucket = (route: string[]) => {
	const bucket = [];
	for (let index = 0;index < route.length;index++) {
		const endpoint = route[index];
		if (index === 0) {
			bucket.push(endpoint);
			continue;
		}
		const previous = route[index - 1];
		if (previous === 'reactions') break;
		const isMajor = ID_REGEX.test(endpoint) && MAJOR_PARAMETERS.includes(previous);
		bucket.push(isMajor ? ':id' : endpoint);
	}
	return bucket;
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

export const buildRoute = (client: Client): Route => {
	const route: string[] = [];
	const handler: ProxyHandler<object> = {
		apply(_, __, args: string[]) {
			route.push(...args.filter(arg => typeof arg === 'string'));
			return new Proxy(noop, handler);
		},

		get(_, endpoint) {
			endpoint = endpoint.toString();
			const uppercaseEndpoint = endpoint.toUpperCase();
			if (uppercaseEndpoint in RequestMethod) {
				return (options?: MethodRequestOptions) => new Promise(
					(resolve, reject) => client.requestManager.makeRequest(
						<RequestMethod> uppercaseEndpoint, Object.assign({}, options || {}, <RequestOptions> {
							bucket: getBucket(route).join('/'),
							endpoint: route.join('/'), resolve, reject
						})
					)
				);
			}
			route.push(endpoint);
			return new Proxy(noop, handler);
		}
	};
	return <Route> new Proxy(noop, handler);
};

export interface MethodRequestOptions {
	data?: Record<string, unknown>;
	query?: Record<string, string> | URLSearchParams;
	reason?: string;
}

export type Route = Record<string, ((...args: string[]) => Route)> & {
	get<T extends object>(options?: MethodRequestOptions): Promise<T>
}