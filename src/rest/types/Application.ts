import { Base } from './Generics';
import { APIUser } from './User';
import { TeamMembershipState } from '../../util/constants';

interface BaseApplication extends Base {
	name: string;
	icon: string | null;
	description: string;
	summary: string;
}

export interface APIClientApplication extends BaseApplication {
	rpc_origins?: string[];
	bot_public: boolean;
	bot_require_code_grant: boolean;
	owner: APIUser;
	verify_key: string;
	team: APITeam | null;
	guild_id?: string;
	primary_sku_id?: string;
	slug?: string;
	cover_image?: string;
}

export interface APIIntegrationApplication extends BaseApplication {
	bot?: APIUser;
}

export interface APITeam extends Base {
	icon: string | null;
	owner_user_id: string;
	members: APITeamMember[];
}

export interface APITeamMember {
	permissions: ['*'];
	team_id: string;
	user: APIUser;
	membership_state: TeamMembershipState;
}