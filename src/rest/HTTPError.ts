export default class HTTPError extends Error {
	public code: number;
	public endpoint: string;
	public method: string;
	
	constructor(method: string, endpoint: string, statusText: string, code: number) {
		super(statusText);
		this.endpoint = endpoint;
		this.code = code;
		this.method = method;
	}
}