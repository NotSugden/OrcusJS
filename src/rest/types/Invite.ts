import { APIGroupDMChannel } from './Channel';
import { PartialAPIChannel } from './Generics';
import { ChannelType } from '../../util/constants';
import { APIUser } from './User';
import { PartialAPIGuild } from './Guild';

interface BaseInvite {
	code: string;
	channel: APIGroupDMChannel | PartialAPIChannel<ChannelType.TEXT>;
}

export interface APIGroupDMInvite extends BaseInvite {
	channel: APIGroupDMChannel;
	inviter: APIUser;
}

export interface APIGuildInvite extends BaseInvite {
	guild: PartialAPIGuild;
	channel: PartialAPIChannel<ChannelType.TEXT>;
	inviter: APIUser;
	// only present when `with_counts` is true on `/invites/{invite.code}`
	approximate_member_count?: number;
	approximate_presence_count?: number;
}

export type APIVanityInvite = Omit<APIGuildInvite, 'inviter'>

export type APIInvite = APIVanityInvite | APIGuildInvite | APIGroupDMInvite;

export interface APIInviteMeta extends APIVanityInvite {
	inviter?: APIUser;
	uses: number;
	max_uses: number;
	max_age: number;
	temporary: boolean;
	created_at: string;
}