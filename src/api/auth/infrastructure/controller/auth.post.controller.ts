import { UserLoginDto } from '@api/auth/application/dto/auth.create.dto';
import { AuthService } from '@api/auth/application/service/auth.service';
import { LoginAuthSchema } from '@api/auth/domain/auth.schema';
import { ReturnAuthLogin } from '@api/auth/domain/auth.type';
import { CookieService } from '@module/cookie/application/cookie.service';
import {
	Body,
	Controller,
	Post,
	Req,
	Res,
	UseInterceptors,
	UsePipes,
} from '@nestjs/common';
import { RateLimiterInterceptor } from '@server/interceptor/rate-limiter.interceptor';
import { Api } from '@server/pipe/api.version.pipe';
import { JoiPipe } from '@server/pipe/joi.pipe';
import { FastifyReply, FastifyRequest } from 'fastify';

@Controller(Api('auth'))
export class AuthPostController {
	private readonly MAX_AGE_COOKIE_MONTH = 3;

	constructor(
		private readonly auth: AuthService,
		private readonly cookie: CookieService,
	) {}

	@Post('login')
	@UseInterceptors(RateLimiterInterceptor)
	@UsePipes(new JoiPipe(LoginAuthSchema))
	async login(
		@Body() input: UserLoginDto,
		@Req() request: FastifyRequest,
		@Res({ passthrough: true })
		reply: FastifyReply,
	): Promise<ReturnAuthLogin> {
		const user = await this.auth.login(input);

		this.cookie.setReply(reply);
		this.cookie.setOptions({ maxAge: this.MAX_AGE_COOKIE_MONTH });
		this.cookie.setData('_sk', user.token);

		/* const cookieOptions: CookieSerializeOptions = {
			secure: true, // Cambia a true si estás usando HTTPS
			httpOnly: true, // La cookie solo es accesible desde el servidor
			path: '/', // La ruta a la que se aplicará la cookie
			sameSite: 'none', // Controla la restricción de Same-Site (puede ser 'strict', 'lax', o 'none')
			maxAge: convertMonthToSeconds(this.MAX_MONTHS), // Duración de la cookie en segundos (3 meses)
			signed: false, // Si quieres que la cookie esté firmada, cambia a true
			priority: 'high',
		};

		reply.setCookie('_sk', token, cookieOptions); */

		return user;
	}
}
