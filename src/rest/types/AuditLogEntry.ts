import { APIOverwrite } from './Overwrite';
import { AuditLogEvent } from '../../util/constants';
import { PartialObject, Base } from './Generics';

export interface APIAuditLogEntry extends Base {
	target_id: string;
	changes?: APIAuditLogChange[];
	user_id: string;
	action_type: AuditLogEvent;
	options?: AuditLogEntryInfo;
	reason?: string;
}

export interface APIAuditLogChange {
	new_value?: AuditLogChangeValue;
	old_value?: AuditLogChangeValue;
	key: string;
}

export interface AuditLogEntryInfo {
	delete_member_days?: string;
	members_removed?: string;
	channel_id?: string;
	message_id?: string;
	count?: string;
	type?: string;
	id?: string;
	role_name?: string;
}

export type AuditLogChangeValue =
	| string
	| number // Includes ChannelType
	| boolean
	| PartialObject[] // Role
	| APIOverwrite[];