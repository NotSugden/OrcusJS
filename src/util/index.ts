export * as Constants from './constants';

type Partialize<T extends object> = {
	[K in keyof T]?: T[K] extends object ? Partialize<T[K]> : T[K];
}

export class Util {
	static mergeDefaults<T extends object>(toMerge: Partialize<T>, defaults: T): T {
		for (const [key, _default] of Object.entries(defaults)) {
			const typeofDefault = typeof _default;
			const typeofGiven = typeof toMerge[<keyof T> key];
			if (!(key in toMerge) || typeofGiven === 'undefined') {
				if (typeofDefault === 'object' && _default !== null) {
					(<unknown> toMerge[<keyof T> key]) = this.mergeDefaults({}, <Record<string, unknown>> _default);
				} else {
					(<unknown> toMerge[<keyof T> key]) = Array.isArray(_default) ? _default.slice() : _default;
				}
			}
		}
		return <T> toMerge;
	}

	static cloneObject<T extends Record<string, unknown>>(obj: T): T {
		return Object.assign(Object.create(obj), obj);
	}
}