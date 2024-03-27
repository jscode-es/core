import { TYPE_USER } from '@api/user/domain/user.type';
import { SCOPE } from '@module/scope/scope.type';

export type AuthTokenUser = {
	scope: SCOPE;
};

export type ReturnAuthLogin = {
	token?: string;
	alias: string;
	type: TYPE_USER;
	avatar: string;
	email: string;
	channel?: {
		name: string;
		slug: string;
	};
};
