import { Module } from '@nestjs/common';
import { ChannelRegister } from './application/service/channel.register';
import { ChannelRemove } from './application/service/channel.remove';
import { ChannelSearch } from './application/service/channel.search';
import { ChannelDeleteController } from './infrastructure/controller/channel.delete.controller';
import {
	ChannelGetController,
	ChannelsGetController,
} from './infrastructure/controller/channel.get.controller';
import { ChannelPostController } from './infrastructure/controller/channel.post.controller';

@Module({
	controllers: [
		ChannelGetController,
		ChannelsGetController,
		ChannelPostController,
		ChannelDeleteController,
	],
	providers: [ChannelRegister, ChannelRemove, ChannelSearch],
})
export class ChannelModule {}
