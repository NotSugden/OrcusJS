import { WSEventPackets } from '../types/Events';
import { GatewayManager } from '../GatewayManager';

export const READY = (manager: GatewayManager, data: WSEventPackets['READY']): null => {
	manager.emit('ready', data);
	return null;
};