import { Base } from './Generics';

export interface APIRole extends Base {
	name: string;
	color: number;
	hoist: boolean;
	position: number;
	// legacy
	permissions: number;
	permissions_new: string;
	managed: boolean;
	mentionable: boolean;
}