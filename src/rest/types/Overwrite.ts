import { Base } from './Generics';

export interface APIOverwrite extends Base {
	type: 'role' | 'member';
	// legacy
	allow: number;
	deny: number;
	allow_new: string;
	deny_new: string;
}

export interface OverwriteData extends Base {
	type: APIOverwrite['type'];
	allow: string | number;
	deny: string | number;
}