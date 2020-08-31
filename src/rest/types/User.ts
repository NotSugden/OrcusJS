import { Base } from './Generics';

export interface APIUser extends Base {
  username: string;
  avatar: string | null;
  discriminator: string;
	public_flags: number;
	// bot is only present if true
	bot?: true;
}