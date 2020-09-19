import { ClientOptions } from '../client';
import { GatewayDispatchEvents } from 'discord-api-types/v6';

export const API_URL = 'https://discord.com/api';
export const CDN_URL = 'https://cdn.discordapp.com';
export const API_VERSION = 7;
export const GATEWAY_VERSION = 6;

export const DEFAULT_CLIENT_OPTIONS: ClientOptions = {
	rest: {
		requestOffset: 500,
		timeout: 20 * 1000
	},
	gateway: {
		largeThreshold: 200
	}
};

const mirror = <T extends string>(array: T[]) => {
	const obj = <Record<T, T>> {};
	for (const key of array) obj[key] = key;
	return obj;
};

export const RequestMethods = mirror(['GET', 'DELETE', 'PATCH', 'PUT', 'POST']);

export enum GatewayStatus {
	NOT_CONNECTED = 0,
	CONNECTING = 1,
	WAITING_FOR_GUILDS = 2,
	DISCONNECTED = 3,
	RECONNECTING = 4,
	CONNECTED = 5
}

export const WSEvents = mirror(Object.values(GatewayDispatchEvents));

export enum ImageFormats {
	WEBP = 'webp',
	PNG = 'png',
	JPG = 'jpg',
	JPEG = 'jpeg',
	GIF = 'gif'
}