import { Client } from '../client';
import * as WebSocket from 'ws';
import { Error } from '../errors';
import { GATEWAY_VERSION, GatewayStatus, OPCode, WSEventType } from '../util/constants';
import { TextDecoder } from 'util';
import { RecievedPacket, OutgoingPacket } from './types/Packets';
import { EventEmitter } from 'events';
import * as EventHandlers from './handlers';
import { WSEventPackets } from './types/Events';

const decoder = new TextDecoder();
const unpack = (data: WebSocket.Data) => {
	if (data instanceof ArrayBuffer) data = new Uint8Array(data);
	return JSON.parse(
		typeof data === 'string' ? data : decoder.decode(<Buffer>data)
	);
};
export class GatewayManager extends EventEmitter {
	private _expectedGuilds: string[] | null = null;
	private websocket: WebSocket | null = null;
	private heartbeatInterval: NodeJS.Timeout | null = null;
	private heartbeatSequence: number | null = null;
	private lastPing: Date | null = null;
	private lastAck: Date | null = null;
	private sessionID: string | null = null;

	public client!: Client;
	public status: GatewayStatus = GatewayStatus.NOT_CONNECTED;

	constructor(client: Client) {
		super();
		Object.defineProperty(this, 'client', { value: client });
	}

	public get ping(): number | null {
		if (!this.lastPing || !this.lastAck) return null;
		return this.lastAck.getTime() - this.lastPing.getTime();
	}

	async connect(): Promise<void> {
		const { token } = this.client;
		if (!token) {
			throw new Error('MISSING_TOKEN');
		}
		const { url } = await this.client.api.gateway('bot').get<{ url: string }>();
		return new Promise((resolve, reject) => {
			const onReady = () => {
				this.client.emit('ready');
				resolve();
				this.off('disconnect', onClose);
			};
			const onClose = () => {
				if (this.status === GatewayStatus.RECONNECTING) return;
				reject();
				this.off('ready', onReady);
				this.off('disconnect', onClose);
			};
			this.once('ready', onReady);
			this.on('disconnect', onClose);

			const socket = this.websocket = new WebSocket(`${url}?v=${GATEWAY_VERSION}&encoding=json`);
			socket.onerror = (error) => {
				this.client.emit('gatewayError', error);
			};
			socket.onopen = () => {
				this.client.emit('debug', `Connecting to gateaway: ${url}`);
				this.status = GatewayStatus.CONNECTING;
			};
			socket.onclose = event => {
				this.client.emit('debug', [
					'Gateway WebSocket closed',
					`Reason: ${event.reason || 'Unknown Reason'}`,
					`Code: ${event.code}`,
					`Was Clean: ${event.wasClean}`
				].join('\n'));
				this.status = GatewayStatus.DISCONNECTED;
				this.client.emit('gatewayDisconnect', event);
			};
			socket.onmessage = data => {
				try {
					this.onMessage(data.data);
				} catch (error) {
					this.client.emit('gatewayError', error);
				}
			};
		});
	}

	public disconnect(code?: number): void {
		if (!this.websocket) {
			this.client.emit('warn', 'GatewayManager#disconnect was called before a connection was made.');
			return;
		}
		this.client.emit('debug', 'Gateaway disconnect');
		try {
			this.websocket.close(code);
		} catch { } // eslint-disable-line no-empty
		this.status = GatewayStatus.DISCONNECTED;
		this.emit('disconnect', code);
	}

	public send(data: OutgoingPacket): Promise<void> {
		if (!this.websocket) {
			this.client.emit('warn', 'GatewayManager#send was called before a connection was made.');
			return Promise.resolve();
		}
		return new Promise<void>(
			(resolve, reject) => this.websocket!.send(JSON.stringify(data), error => {
				if (error) reject(error);
				else resolve();
			})
		);
	}

	private onMessage(data: WebSocket.Data) {
		const packet: RecievedPacket = unpack(data);
		this.client.emit('gatewayPacket', packet);
		console.log(data);
		if (packet.op === OPCode.DISPATCH) {
			this.emit(packet.t, packet.d);
			if (packet.t in EventHandlers) {
				if (packet.t === WSEventType.READY) {
					this._setupReady(<WSEventPackets['READY']> packet.d);
				}
				EventHandlers[packet.t as keyof typeof EventHandlers](
					this, <WSEventPackets['READY']> packet.d
				);
			}
		} else if (packet.op === OPCode.HEARTBEAT) {
			this.heartbeatSequence = packet.d;
			this.client.emit('debug', `Received heartbeat: ${packet.d} from the Gateway.`);
		} else if (packet.op === OPCode.RECONNECT || packet.op === OPCode.INVALID_SESSION) {
			// packet.d might be null, im not sure, so thats why `=== true`
			if (!('d' in packet) || packet.d === true) {
				this.status = GatewayStatus.RECONNECTING;
			}
			this.disconnect();
		} else if (packet.op === OPCode.HEARTBEAT_ACK) {
			this.lastAck = new Date();
		} else if (packet.op === OPCode.HELLO) {
			this.heartbeatInterval = setInterval(() => this.sendHeartbeat(), packet.d.heartbeat_interval);
			this.identify();
		}
	}

	private sendHeartbeat() {
		this.lastPing = new Date();
		this.send({ op: OPCode.HEARTBEAT, d: this.heartbeatSequence });
	}

	private identify() {
		this.send({
			op: OPCode.IDENTIFY, d: {
				properties: {
					$browser: 'OrcusJS',
					$device: 'OrcusJS',
					$os: process.platform
				},
				token: this.client.token!,
				large_threshold: this.client.options.gateway.largeThreshold
			}
		});
	}

	// private method, except it has to be public to be used
	private _setupReady(data: WSEventPackets['READY']) {
		this._expectedGuilds = data.guilds.map(guild => guild.id);
		this.sessionID = data.session_id;
	}
}