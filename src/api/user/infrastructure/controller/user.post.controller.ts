import { UserCreateDto } from '@api/user/application/dto/user.create.dto';
import { UserConfirm } from '@api/user/application/service/user.confirm';
import { UserForguetPassword } from '@api/user/application/service/user.forguet.password';
import { UserRegister } from '@api/user/application/service/user.register';
import { RegisterUserSchema } from '@api/user/domain/user.schema';
import { ResponseUserConfirm, ReturnToken } from '@api/user/domain/user.type';
import {
	Body,
	Controller,
	Post,
	Req,
	UseInterceptors,
	UsePipes,
} from '@nestjs/common';
import { Client } from '@server/decorator/client.decorator';
import { User } from '@server/decorator/user.decorator';
import { RateLimiterInterceptor } from '@server/interceptor/rate-limiter.interceptor';
import { Api } from '@server/pipe/api.version.pipe';
import { JoiPipe } from '@server/pipe/joi.pipe';

@Controller(Api('user'))
export class UserPostController {
	constructor(
		private readonly userRegister: UserRegister,
		private readonly userForguetPass: UserForguetPassword,
		private readonly userConfirm: UserConfirm,
	) {}

	@Post('register')
	@UseInterceptors(RateLimiterInterceptor)
	@UsePipes(new JoiPipe(RegisterUserSchema))
	async create(
		@Body() input: UserCreateDto,
		@Client() client: ClientTypes,
	): Promise<ResponseUserConfirm> {
		return await this.userRegister.save(input, client);
	}

	@Post('confirm')
	@UseInterceptors(RateLimiterInterceptor)
	async confirm(@Body('token') token: string): Promise<boolean> {
		return await this.userConfirm.save(token);
	}

	@Post('upload/profile')
	async profile(@Req() req: any, @User() user: any): Promise<unknown> {
		const file = await req.file();
		return await this.userRegister.profile(user.id, file);
	}

	@Post('forguet')
	@UseInterceptors(RateLimiterInterceptor)
	async forguetPassword(@Body('email') email: string): Promise<ReturnToken> {
		return await this.userForguetPass.request(email);
	}
}
