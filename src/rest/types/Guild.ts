import { Base } from './Generics';
import { VerificationLevel, DefaultMessageNotification, ExplicitContentFilter, MFALevel, PremiumTier } from '../../util/constants';
import { APIRole } from './Role';
import { APIGuildEmoji } from './Emoji';

export interface APIGuildPreview extends Base {
	name: string;
	icon: string | null;
	splash: string | null;
	discovery_splash: string | null;
	emojis: APIGuildEmoji[];
	features: GuildFeature[];
	description: string | null;
	approximate_member_count: number;
	approximate_presence_count: number;
}

export interface APIGuild extends Omit<
	APIGuildPreview, 'approximate_member_count' | 'approximate_presence_count'
> {
	// true if the logged in user is the owner
	owner?: true;
	// permissions(_new) and owner only available through `users/@me/guilds` endpoint
	permissions?: number;
	permissions_new?: string;
	owner_id: string;
	region: string;
	afk_channel_id: string | null;
	afk_timeout: number;
	// embed_* deprecated in favour of widget_*
	embed_enabled: boolean;
	embed_channel_id: string | null;
	widget_enabled: boolean;
	widget_channel_id: string | null;
	verification_level: VerificationLevel;
	default_message_notifications: DefaultMessageNotification;
	explicit_content_filter: ExplicitContentFilter;
	roles: APIRole[];
	mfa_level: MFALevel;
	application_id: string | null;
	system_channel_id: string | null;
	system_channel_flags: number;
	max_presences: number | null;
	max_members: number;
	vanity_url_code: string | null;
	banner: string | null;
	premium_tier: PremiumTier;
	premium_subscription_count: number;
	preferred_locale: string;
	public_updates_channel_id: string | null;
	max_video_channel_users: number;
	// only if the `with_counts` parameter is true in `guilds/{guild.id}` endpoint
	approximate_member_count?: number;
	approximate_presence_count?: number;
}

export type GuildFeature =
	| 'INVITE_SPLASH'
	|	'VIP_REGIONS'
	|	'VANITY_URL'
	|	'VERIFIED'
	|	'PARTNERED'
	|	'PUBLIC'
	|	'COMMERCE'
	|	'NEWS'
	|	'DISCOVERABLE'
	|	'FEATURABLE'
	|	'ANIMATED_ICON'
	|	'BANNER'
	|	'PUBLIC_DISABLED'
	|	'WELCOME_SCREEN_ENABLED';

export interface PartialAPIGuild {
	id: string;
  name: string;
  splash: string | null;
  banner: string | null;
  description: string;
  icon: string | null;
  features: GuildFeature[];
  verification_level: VerificationLevel;
  vanity_url_code: string | null;
}