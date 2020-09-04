import { PresenceStatus, ActivityType } from '../../util/constants';

export interface PresenceUpdatePayload {
	since: number | null;
	game: null;
	status: PresenceStatus;
	afk: boolean;
}

export interface ActivityPayloadBase {
	name: string;
	type: ActivityType;
}

export interface StreamingActivity extends ActivityPayloadBase {
	type: ActivityType.STREAMING;
	url: string | null;
	// unknown atm
}