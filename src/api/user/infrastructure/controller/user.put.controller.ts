import { UserUpdateDto } from '@api/user/application/dto/user.update.dto';
import { UserUpdate } from '@api/user/application/service/user.update';
import { UpdateUserSchema } from '@api/user/domain/user.schema';
import { UserId } from '@api/user/domain/user.type';
import { CookieSerializeOptions } from '@module/cookie/domain/cookie.type';
import {
	Body,
	Controller,
	Param,
	Put,
	Req,
	Res,
	UseGuards,
	UsePipes,
} from '@nestjs/common';
import { User } from '@server/decorator/user.decorator';
import { RolesGuard } from '@server/guard/roles.guard';
import { Api } from '@server/pipe/api.version.pipe';
import { HashIdPipe } from '@server/pipe/hash.id.pipe';
import { JoiPipe } from '@server/pipe/joi.pipe';
import { FastifyReply, FastifyRequest } from 'fastify';

@Controller(Api('user'))
export class UserPutController {
	constructor(private readonly user: UserUpdate) {}

	@Put(':id')
	@UsePipes(new JoiPipe(UpdateUserSchema))
	async updateId(
		@Param('id', HashIdPipe) id: UserId,
		@Body() body: UserUpdateDto,
	) {
		return await this.user.update(id, body);
	}

	@UseGuards(RolesGuard)
	@Put()
	@UsePipes(new JoiPipe(UpdateUserSchema))
	async update(@Body() body: UserUpdateDto, @User() user: { id: UserId }) {
		console.log('USER ======>', user);
		return {};
		//return await this.user.update(user.id, body);
	}

	@Put('confirm')
	async updateConfirm(@Body('token') token: string) {
		return await this.user.updateConfirm(token);
	}

	@Put('close-session')
	async closeSession(
		@Req() request: FastifyRequest | any,
		@Res({
			passthrough: true,
		})
		reply: FastifyReply | any,
	) {
		const { _sk } = request.cookies;

		const cookieOptions: CookieSerializeOptions = {
			secure: true, // Cambia a true si estás usando HTTPS
			httpOnly: true, // La cookie solo es accesible desde el servidor
			path: '/', // La ruta a la que se aplicará la cookie
			sameSite: 'none', // Controla la restricción de Same-Site (puede ser 'strict', 'lax', o 'none')
			//maxAge: 3600, // Duración de la cookie en segundos
			signed: false, // Si quieres que la cookie esté firmada, cambia a true
			priority: 'high',
		};

		reply.clearCookie('_sk', cookieOptions);

		return await this.user.closeSession(_sk);
	}
}
