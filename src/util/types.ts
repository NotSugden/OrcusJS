import { ImageFormats, RequestMethods } from './constants';

export interface FetchOptions {
	cache?: boolean;
	force?: boolean;
}

export interface ImageURLOptions {
	format?: ImageFormats;
	size?: ImageSize;
}

export interface UserAvatarURLOptions extends ImageURLOptions {
	fallbackDefault?: boolean;
}

export type ImageSize = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;

export type RequestMethod = keyof typeof RequestMethods;