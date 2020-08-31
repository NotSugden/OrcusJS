import { Client } from '../client';
import { promisify } from 'util';
import { Constants } from '../util';
import fetch, { Response } from 'node-fetch';
import APIError from './APIError';
import HTTPError from './HTTPError';
import { RequestMethod } from '../util/constants';
import { MethodRequestOptions } from './buildRoute';
const sleep = promisify(setTimeout);

const parse = (response: Response) => {
	const contentType = response.headers.get('content-type');
	if (!contentType || !contentType.startsWith('application/json')) return response.buffer();
	return response.json();
};

const isBetween = (num: number, min: number, max: number) => num >= min && num <= max;

export default class RequestManager {
	private client!: Client;
	private requestBuckets = new Map<string, RequestBucket>();
	private globalTimeout: Promise<void> | null = null;
	// future use
	constructor(client: Client) {
		Object.defineProperty(this, 'client', { value: client, writable: false });
	}

	public isLimited(bucket: RequestBucket): boolean {
		if (!bucket.reset) return false;
		return bucket.remaining === 0 && bucket.reset.getTime() > Date.now();
	}

	public async makeRequest(method: RequestMethod, options: RequestOptions): Promise<void> {
		let bucket = this.requestBuckets.get(options.bucket);
		if (bucket) {
			if (bucket.busy) {
				bucket.queue.push({ method, options });
				return;
			}
			bucket.busy = true;
			if (this.isLimited(bucket)) {
				await sleep((bucket.reset!.getTime() - Date.now()) + this.client.options.rest.requestOffset);
			}
		} else {
			bucket = { queue: [], limit: -1, remaining: -1, reset: null, busy: true };
			this.requestBuckets.set(options.bucket, bucket);
		}
		if (this.globalTimeout) {
			await this.globalTimeout;
			this.globalTimeout = null;
		}
		let url = `${Constants.API_URL}/v${Constants.API_VERSION}/${options.endpoint}`;
		const query = options.query ? new URLSearchParams(options.query) : null;
		if (query) url += `?${query}`;
		const headers: Record<string, string> = {
			Authorization: `Bot ${this.client.token}`
		};
		if (typeof options.reason === 'string') {
			headers['X-Audit-Log-Reason'] = options.reason;
		}
		let body: string | undefined = undefined;
		if (options.data) {
			body = JSON.stringify(options.data);
			headers['Content-Type'] = 'application/json';
		}
		let response: Response;
		try {
			response = await fetch(url, {
				body, headers, 
			});
		} catch (error) {
			bucket.busy = false;
			options.reject(error);
			return this.next(bucket);
		}
		const serverDate = new Date(response.headers.get('date')!);
		const limit = response.headers.get('x-ratelimit-limit');
		const remaining = response.headers.get('x-ratelimit-remaining');
		const reset = response.headers.get('x-ratelimit-reset');
		const retryAfter = response.headers.get('retry-after');
		const APIOffset = serverDate.getTime() - Date.now();
		bucket.limit = limit ? parseInt(limit) : -1;
		bucket.remaining = remaining ? parseInt(remaining) : -1;
		bucket.reset = reset ? new Date(
			(parseInt(reset) * 1000) - APIOffset
		) : null;
		if (options.bucket.includes('reactions')) {
			bucket.reset = new Date(serverDate.getTime() - APIOffset + 250);
		}

		if (response.headers.has('x-ratelimit-global') && retryAfter) {
			this.globalTimeout = sleep(parseInt(retryAfter));
		}

		bucket.busy = false;
		const data = await parse(response);
		if (response.ok) {
			options.resolve(data);
		} else if (response.status === 429) {
			this.client.emit('debug', `429 Ratelimit on ${method} ${options.endpoint}`);
			bucket.queue.unshift({ method, options });
		} else if (isBetween(response.status, 400, 499)) {
			options.reject(new APIError(options.endpoint, options.bucket, response.status, data));
		} else {
			options.reject(new HTTPError(method, options.endpoint, response.statusText, response.status));
		}
		return this.next(bucket);
	}

	public next(bucket: RequestBucket): void {
		const data = bucket.queue.shift();
		if (!data) return;
		this.makeRequest(data.method, data.options);
	}
}

export interface Request {
	method: RequestMethod;
	options: RequestOptions;
}

export interface RequestBucket {
	queue: Request[]
	limit: number;
	remaining: number;
	reset: Date | null;
	busy: boolean
}


export interface RequestOptions extends MethodRequestOptions {
	endpoint: string;
	bucket: string;
	resolve: (res: unknown) => void;
	reject: (error: Error) => void;
}