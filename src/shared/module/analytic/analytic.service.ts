// ====================================
// Este modulo se encarga de enviar eventos
// a un servidor de analítica.
// ====================================

import { Injectable } from '@nestjs/common';

// type events
export enum EventName {
	SOCKET_CLIENT_CONNECTED = 'SOCKET_CLIENT_CONNECTED',
	SOCKET_CLIENT_DISCONNECTED = 'SOCKET_CLIENT_DISCONNECTED',
}

export type EventNameType = keyof typeof EventName;

@Injectable()
export class AnalyticService {
	send() {
		return 'send';
	}
}
