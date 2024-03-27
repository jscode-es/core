import { ChannelRegister } from '@api/channel/application/service/channel.register';
import { BodyConnection } from '@api/channel/domain/channel.type';
import {
	Body,
	Controller,
	Headers,
	Param,
	Post,
	UseGuards,
} from '@nestjs/common';
import { User } from '@server/decorator/user.decorator';
import { RolesGuard } from '@server/guard/roles.guard';
import { Api } from '@server/pipe/api.version.pipe';

@Controller(Api('channel'))
export class ChannelPostController {
	private readonly channel: ChannelRegister;

	constructor() {
		this.channel = new ChannelRegister();
	}

	@UseGuards(RolesGuard)
	@Post('/register')
	//@UsePipes(new JoiPipe(RegisterChannelSchema))
	async register(@User() user: any, @Body() body: any) {
		return await this.channel.save({ userId: user.id, ...body });
	}

	@Post('/render')
	async render(@Headers() headers: any, @Body() body: any) {
		headers;
		body;

		return {};
	}

	@Post('/connection')
	async connection(@Headers() headers: any, @Body() body: BodyConnection) {
		headers;
		body;

		return await this.channel.saveConnection(body);
	}

	@UseGuards(RolesGuard)
	@Post('/follow/:id')
	async follow(@User() user: any, @Param('id') id: string) {
		return await this.channel.follow(user.id, id);
	}
}
