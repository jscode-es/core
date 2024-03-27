// ====================================
// Este decorador se encarga de obtener
// los datos del usuario a través del
// token almacenado en la cookie.
// ====================================

import { UserToken } from '@api/user/domain/user.type';
import { HashService } from '@module/hash/hash.service';
import { TokenService } from '@module/token/token.service';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
	(output: unknown, ctx: ExecutionContext) => {
		const token = new TokenService();
		const hash = new HashService();
		const request = ctx.switchToHttp().getRequest();
		const { _sk } = request.cookies;

		const data = token.get<UserToken>(_sk);

		if (!data) return null;

		return {
			id: hash.decode(data.id),
			decorator: 'User',
		};
	},
);
