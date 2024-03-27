import { ChannelRemove } from '@api/channel/application/service/channel.remove';
import { ChannelId } from '@api/channel/domain/channel.type';
import { Controller, Delete, Param } from '@nestjs/common';
import { Api } from '@server/pipe/api.version.pipe';
import { HashIdPipe } from '@server/pipe/hash.id.pipe';

@Controller(Api('channel'))
export class ChannelDeleteController {
	constructor(private readonly channel: ChannelRemove) {}

	@Delete(':id')
	async remove(@Param('id', HashIdPipe) id: ChannelId) {
		return await this.channel.removeLater(id);
	}

	@Delete(':id/forever')
	async removeForeve(@Param('id', HashIdPipe) id: ChannelId) {
		return await this.channel.remove(id);
	}
}
