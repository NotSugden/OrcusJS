import Client from '../Client';
import * as WebSocket from 'ws';
import { Error } from '../../errors';
import { GATEWAY_VERSION, GatewayStatus } from '../../util/constants';
import { TextDecoder } from 'util';
import { EventEmitter } from 'events';
import * as EventHandlers from './handlers';
import { GatewayDispatchEvents, GatewayOPCodes, GatewayReadyDispatch, GatewayReceivePayload, GatewaySendPayload } from 'discord-api-types/v6';

const decoder = new TextDecoder();

const unpack = (data: WebSocket.Data) => {
	if (data instanceof ArrayBuffer) data = new Uint8Array(data);
	return JSON.parse(
		typeof data === 'string' ? data : decoder.decode(<Buffer>data)
	);
};

export default class GatewayManager extends EventEmitter {
	private _expectedGuilds: Set<string> | null = null;
	private _readyTimeout: NodeJS.Timeout | null = null;
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
		let url: string | null = null;
		try {
			const data = await this.client.api.gateway('bot').get<{ url: string }>();
			url = data.url;
		} catch (error) {
			if (error.httpStatus === 401) {
				throw new Error('INVALID_TOKEN');
			}
			throw error;
		}
		return new Promise((resolve, reject) => {
			const removeListeners = () => {
				this.off('ready', onReady);
				this.off('disconnect', onClose);
			};
			const onReady = () => {
				this.status = GatewayStatus.CONNECTED;
				this.client.emit('ready');
				resolve();
				removeListeners();
			};
			const onClose = () => {
				if (this.status === GatewayStatus.RECONNECTING) return;
				reject();
				removeListeners();
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
			socket.onmessage = async data => {
				try {
					await this.onMessage(data.data);
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
		if (this.heartbeatInterval) {
			clearTimeout(this.heartbeatInterval);
			this.heartbeatInterval = null;
		}
		this.status = GatewayStatus.DISCONNECTED;
		this.emit('disconnect', code);
	}

	public send(data: GatewaySendPayload): Promise<void> {
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

	private async onMessage(data: WebSocket.Data) {
		const packet: GatewayReceivePayload = unpack(data);
		this.client.emit('gatewayPacket', packet);
		if (packet.op === GatewayOPCodes.Dispatch) {
			this.emit(packet.t, packet.d);
			if (packet.t in EventHandlers) {
				// Haven't added all the handlers yet so this will generate error but it will be fines
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				await EventHandlers[packet.t](this, packet.d);
			}
			if (packet.t === GatewayDispatchEvents.Ready) {
				this._setupReady(packet.d);
			} else if (packet.t === GatewayDispatchEvents.GuildCreate) {
				if (this.status === GatewayStatus.WAITING_FOR_GUILDS) {
					this._updateExpectedGuilds(packet.d.id);
				} else {
					this._expectedGuilds?.delete(packet.d.id);
					if (this._expectedGuilds && !this._expectedGuilds.size) {
						this._expectedGuilds = null;
					}
				}
			}
		} else if (packet.op === GatewayOPCodes.Heartbeat) {
			this.heartbeatSequence = packet.d;
			this.client.emit('debug', `Received heartbeat: ${packet.d} from the Gateway.`);
		} else if (packet.op === GatewayOPCodes.Reconnect || packet.op === GatewayOPCodes.InvalidSession) {
			if (packet.d) {
				this.status = GatewayStatus.RECONNECTING;
			}
			this.disconnect();
			await this.reconnect();
		} else if (packet.op === GatewayOPCodes.HeartbeatAck) {
			this.lastAck = new Date();
		} else if (packet.op === GatewayOPCodes.Hello) {
			this.heartbeatInterval = setInterval(() => this.sendHeartbeat(), packet.d.heartbeat_interval);
			await this.identify();
		}
	}

	private reconnect() {
		this.status = GatewayStatus.RECONNECTING;
		this.client.emit('debug', 'Reconnecting to gateway.');
		return this.connect();
	}

	private async sendHeartbeat() {
		this.lastPing = new Date();
		try {
			await this.send({ op: GatewayOPCodes.Heartbeat, d: this.heartbeatSequence || 0 });
		} catch (error) {
			this.client.emit('gatewayError', error);
		}
	}

	private identify() {
		return this.send(this.sessionID ? {
			op: GatewayOPCodes.Resume,
			d: {
				seq: this.heartbeatSequence!,
				session_id: this.sessionID,
				token: this.client.token!
			}
		} : {
			op: GatewayOPCodes.Identify, d: {
				properties: {
					$browser: 'OrcusJS',
					// https://github.com/discordjs/discord-api-types/pull/17 incorrect type
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					$device: 'OrcusJS',
					$os: process.platform
				},
				token: this.client.token!,
				large_threshold: this.client.options.gateway.largeThreshold
			}
		});
	}

	private _setupReady(data: GatewayReadyDispatch['d']) {
		this._expectedGuilds = new Set(data.guilds.map(guild => guild.id));
		this.sessionID = data.session_id;
		this.status = GatewayStatus.WAITING_FOR_GUILDS;
		this._setReadyTimeout();
	}

	private _updateExpectedGuilds(id: string) {
		this._expectedGuilds!.delete(id);
		if (!this._expectedGuilds!.size) {
			this._expectedGuilds = null;
			clearTimeout(this._readyTimeout!);
			this._readyTimeout = null;
			this.emit('ready');
		} else {
			this._setReadyTimeout();
		}
	}

	private _setReadyTimeout() {
		if (this._readyTimeout) {
			clearTimeout(this._readyTimeout);
		}
		this._readyTimeout = setTimeout(() => {
			this.emit('ready');
			this.client.emit('debug', `Ready emitted with missing guilds ${[...this._expectedGuilds!].join(', ')}`);
		}, 15e3);
	}
}
