import { OPCode, WSEventType } from '../../util/constants';
import { WSEventPackets } from './Events';

export interface EventPacket<T extends keyof typeof WSEventType = keyof typeof WSEventType> {
	op: OPCode.DISPATCH;
	d: WSEventPackets[T];
	t: T;
	s: number;
}

export interface HeartbeatPacketRecieve {
	op: OPCode.HEARTBEAT;
	d: number;
}

export interface HeartbeatPacketSend {
	op: OPCode.HEARTBEAT;
	d: number | null;
}

export interface IdentifyPacket {
	op: OPCode.IDENTIFY,
	d: {
		token: string;
		properties: {
			$os: string;
			$browser: string; // OrcusJS
			$device: string; // OrcusJS
		};
		large_threshold?: number; // 50-250
		shard?: [number, number]; // [shard id, number of shards]
	}
}

// 3 unknown atm

export interface VoiceStateUpdatePacket {
	op: OPCode.VOICE_STATE_UPDATE;
	d: {
		guild_id: string;
		channel_id: string | null;
		self_mute: boolean;
		self_deaf: boolean;
	}
}

export interface ResumePacket {
	op: OPCode.RESUME;
	d: {
		token: string;
		session_id: string;
		seq: number;
	}
}

export interface ReconnectPacket {
	op: OPCode.RECONNECT;
}

export interface RequestGuildMembersPacket {
	op: OPCode.REQUEST_GUILD_MEMBERS;
	d: ({
		guild_id: string;
		limit: number;
		presences?: boolean;
		nonce?: string;
	} & ({ query?: string } | { user_ids?: string | string[] }))
}

export interface InvalidSessionPacket {
	op: OPCode.INVALID_SESSION;
	d: boolean;
}

export interface HelloPacket {
	op: OPCode.HELLO;
	d: {
		heartbeat_interval: number;
	};
}

export interface HeartbeatACKPacket {
	op: OPCode.HEARTBEAT_ACK;
}

export type OutgoingPacket =
	| HeartbeatPacketSend
	| IdentifyPacket
	| VoiceStateUpdatePacket
	| ResumePacket
	| RequestGuildMembersPacket;

export type RecievedPacket =
	| EventPacket
	| HeartbeatPacketRecieve
	| ReconnectPacket
	| InvalidSessionPacket
	| HelloPacket
	| HeartbeatACKPacket;