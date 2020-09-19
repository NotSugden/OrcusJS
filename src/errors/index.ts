type Params<T extends keyof typeof messages> = (
	(typeof messages)[T] extends ((...args: unknown[]) => string)
		? Parameters<(typeof messages)[T]>
		: never[]
);

const makeError = (Class: typeof Error) => {
	return class OrcusError<
		T extends keyof typeof messages
	> extends Class {
		public code: string;
		constructor(
			message: T,
			...params: Params<T>
		) {
			const msg = <string | ((...args: Params<T>) => string)> messages[message];
			super(typeof msg === 'function' ? msg(...params) : msg);
			this.code = message;
		}

		get name() {
			return `${super.name} [${this.code}]`;
		}
	};
};

const _Error = makeError(Error);
const _TypeError = makeError(TypeError);

export {
	_Error as Error,
	_TypeError as TypeError
};

const messages = {
	MISSING_TOKEN: 'The Client does not have a token attached.',
	INVALID_TYPE: (parameter: string, expected: string) => `Supplied ${parameter} is not ${expected}`,
	INVALID_TOKEN: 'An invalid token was provided'
};