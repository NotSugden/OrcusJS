import { APIUser } from 'discord-api-types/v6';
import Util, { Constants, UserAvatarURLOptions } from '../util';
import Base from './Base';

export default class User extends Base<APIUser> {
	public avatarHash!: string | null;
	public bot!: boolean;
	public discriminator!: string;
	// TODO: make class to handle this
	public publicFlags!: number;
	public system!: boolean;
	public username!: string;

	public get defaultAvatarURL(): string {
		return `${Constants.CDN_URL}/embed/avatars/${Number(this.discriminator) % 5}.png`;
	}

	public avatarURL(options?: UserAvatarURLOptions & { fallbackDefault?: false }): string | null;
	public avatarURL(options: UserAvatarURLOptions & { fallbackDefault: true }): string;
	public avatarURL({ fallbackDefault = false, format, size }: UserAvatarURLOptions = {}): string | null {
		if (!this.avatarHash) {
			if (!fallbackDefault) return null;
			return this.defaultAvatarURL;
		}
		let url = `${Constants.CDN_URL}/avatars/${this.id}/${this.avatarHash}.${
			typeof format === 'undefined' ? Util.resolveAvatarFormat(this.avatarHash) : format
		}`;
		if (typeof size === 'number') url += `?size=${size}`;
		return url;
	}

	public equals(data: APIUser | User): boolean {
		const raw = data.id === this.id
			&& (data.bot || false) === this.bot
			&& data.discriminator === this.discriminator
			&& (data.system || false) === this.system
			&& data.username === this.username;
		if (!raw) return false;
		if ('avatar' in data) {
			return data.avatar === this.avatarHash
				&& data.public_flags === this.publicFlags;
		} else {
			return data.avatarHash === this.avatarHash
				&& data.publicFlags === this.publicFlags;
		}
	}

	public fetch(): Promise<User> {
		return this.client.users.fetch(this, { force: true });
	}

	/**
	 * @internal Internal use only
	 */
	public _update(data: APIUser): void {
		if ('avatar' in data) {
			this.avatarHash = data.avatar;
		} else if (typeof this.avatarHash === 'undefined') {
			this.avatarHash = null;
		}

		if ('bot' in data) {
			this.bot = data.bot!;
		} else if (typeof this.bot === 'undefined') {
			// assume bot is false, API only sends `bot` if its true
			this.bot = false;
		}

		if ('discriminator' in data) {
			this.discriminator = data.discriminator;
		}

		if ('public_flags' in data) {
			this.publicFlags = data.public_flags!;
		}

		if ('system' in data) {
			this.system = data.system!;
		} else if (typeof this.system === 'undefined') {
			// same as bot
			this.system = false;
		}

		if ('username' in data) {
			this.username = data.username;
		}
	}
}