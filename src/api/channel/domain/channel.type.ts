import { Channel } from '@prisma/client';

export enum TYPE_CHANNEL {
	NORMAL = 'NORMAL',
	SILVER = 'SILVER',
	GOLD = 'GOLD',
}

export type ChannelId = number;

export type FindManyOptions = {
	limit?: number;
	offset?: number;
	order?: any;
	where?: any;
	include?: any;
};

export type ResponseFindChannel = {
	data: Channel[];
	pagination: {
		totalData: number;
		totalPage: number;
		page: number;
		perPage: number;
	};
};

export type ResponseChannel = {
	error?: string;
	data?: Channel;
};

export type ResponseChannelConfirm = {
	error?: string;
	data?: string;
};

export type ResponseChannels = {
	error?: string;
	data?: Channel[];
};

export type BodyConnection = {
	data: {
		input_id: string;
		event_type: 'live_input.disconnected' | 'live_input.connected';
		updated_at: string;
	};
};
