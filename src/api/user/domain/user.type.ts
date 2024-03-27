import { User } from '@prisma/client';

export enum TYPE_USER {
	VIEWER = 'VIEWER',
	STREAMER = 'STREAMER',
	BUSINESS = 'BUSINESS',
}

export enum VERIFY_USER {
	NORMAL = 'NORMAL',
	VERIFIED = 'VERIFIED',
	SILVER = 'SILVER',
	GOLD = 'GOLD',
}

export type UserId = number;

export type SendEmailConfirmProps = {
	url: string;
	name: string;
	userId: UserId;
	lang: string;
};

export type TokenUserConfirm = {
	user: string;
	type: 'confirm';
};

export type ResponseFindUser = {
	items: User[];
	total: number;
	pagination: {
		totalPage: number;
		page: number;
		perPage: number;
	};
};

export type ResponseUser = {
	error?: string;
	data?: User;
};

export type ResponseUserConfirm = {
	token: string;
	id: string;
};

export type ResponseUsers = {
	error?: string;
	data?: User[];
};

export type UserToken = {
	id: string;
	scope: string;
};

export type ReturnToken = {
	token: string;
};
