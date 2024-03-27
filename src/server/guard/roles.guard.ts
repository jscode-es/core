// ====================================
// Este guardia se encarga de validar
// los roles de los usuarios.
// ====================================

import { RequestCookies } from '@module/cookie/domain/cookie.type';
import { TokenService } from '@module/token/token.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
	private token: TokenService;

	constructor() {
		this.token = new TokenService();
	}

	async canActivate(context: ExecutionContext): Promise<any> {
		const request: RequestCookies = context.switchToHttp().getRequest();
		const { _sk } = request.cookies;

		if (!_sk) return false;

		const data = await this.token.get(_sk);

		if (!data) return false;

		return true;
	}
}
