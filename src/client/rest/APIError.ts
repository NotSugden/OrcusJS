export default class APIError extends Error {
	public code: number;
	public endpoint: string;
	public bucket: string;
	public httpStatus: number;
	
	constructor(
		endpoint: string,
		bucket: string,
		statusCode: number,
		data: RawAPIError
	) {
		super();
		this.name = 'APIError';
		this.message = data.errors ? APIError.resolveError(data.errors) : data.message;
		this.code = data.code;
		this.endpoint = endpoint;
		this.bucket = bucket;
		this.httpStatus = statusCode;
	}

	static resolveError(rawError: Exclude<RawAPIError['errors'], undefined>, props: string[] = []): string {
		const messages: string[] = [];
		for (const [key, value] of Object.entries(rawError)) {
			const int = parseInt(key);
			props.push(isNaN(int) ? key : `[${key}]`);
			if (Array.isArray(value._errors)) {
				messages.push(`${props.join('.')}: ${value._errors.map(e => e.message).join(' ')}`);
				continue;
			}
			messages.push(...this.resolveError(rawError));
		}
		return messages.join('\n');
	}
}

interface BaseError {
	code: string;
	message: string;
}

export interface RawAPIError {
	code: number;
	message: string;
	errors?: {
		[key: string]: {
			_errors: BaseError[];
		} | {
			[key: string]: RawAPIError['errors'];
		}
	}
}