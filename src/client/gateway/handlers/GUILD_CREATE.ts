import { GatewayGuildCreateDispatch } from 'discord-api-types/v6';
import GatewayManager from '../GatewayManager';

export default (manager: GatewayManager, data: GatewayGuildCreateDispatch): void => {
	// const { client } = manager;
	console.log('Recieved guild:', data);
};