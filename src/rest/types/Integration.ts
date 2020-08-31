import { Base } from './Generics';
import { IntegrationType, IntegrationExpireBehavior } from '../../util/constants';
import { APIUser } from './User';
import { APIIntegrationApplication } from './Application';

interface BaseIntegration extends Base {
	name: string;
	type: IntegrationType;
	enabled: boolean;
	syncing: boolean;
	role_id: string;
	expire_behavior: IntegrationExpireBehavior;
	expire_grace_period: number;
	user?: APIUser;
	account: APIIntegrationAccount;
	synced_at: string;
	subscriber_count: number;
	revoked: boolean;
}

export interface APIIntegrationAccount extends Base {
	name: string;
}

export interface APITwitchIntegration extends BaseIntegration {
	enable_emoticons: boolean;
}

export interface BotIntegration extends BaseIntegration {
	application: APIIntegrationApplication
}