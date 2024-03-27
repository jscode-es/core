import { ChannelSearch } from '@api/channel/application/service/channel.search';
import { ResponseFindChannel } from '@api/channel/domain/channel.type';
import {
	Controller,
	DefaultValuePipe,
	Get,
	Param,
	ParseIntPipe,
	Query,
	UseGuards,
} from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { Cache } from '@server/decorator/cache.decorator';
import { User } from '@server/decorator/user.decorator';
import { RolesGuard } from '@server/guard/roles.guard';
import { Api } from '@server/pipe/api.version.pipe';

@Controller(Api('channel'))
export class ChannelGetController {
	constructor(private readonly channel: ChannelSearch) {}

	@Get('/slug/:slug')
	@Cache('get:channel:slug')
	async findBySlug(@Param('slug') slug: string) {
		console.log('slug ===>', slug);
		return await this.channel.findViewBy('slug', slug);
	}

	@Get()
	@Cache('get:channel')
	async find(
		@Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit: number,
		@Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
		@Query('values', new DefaultValuePipe('')) values: string,
		@Query('find', new DefaultValuePipe('')) find: string,
		@Query('findBy', new DefaultValuePipe('')) findBy: string,
		@Query('orderBy', new DefaultValuePipe('')) orderBy: string,
		@Query('filter', new DefaultValuePipe('')) filter: string,
	): Promise<ResponseFindChannel> {
		return await this.channel.find({
			limit,
			page,
			values,
			find,
			findBy,
			orderBy,
			filter,
		});
	}

	@Get('/all/recommended')
	async findAllRecommended(
		@Query('offset', new ParseIntPipe({ optional: true })) offset: number,
	) {
		return await this.channel.recommended({ offset });
	}

	@Get('/search')
	async search(@Query('query', new DefaultValuePipe('')) query: string) {
		return await this.channel.search(query);
	}

	@Get('/featured')
	async featured() {
		return await this.channel.featured();
	}

	@Get('/table/basic')
	async table(
		@Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
		@Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
		@Query('search', new DefaultValuePipe('')) search: string,
	) {
		const params = {
			limit,
			page,
			search,
			type: $Enums.Channel_type.NORMAL,
		};
		return await this.channel.findTable(params);
	}

	@Get('/table/silver')
	async tableSilver(
		@Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
		@Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
		@Query('search', new DefaultValuePipe('')) search: string,
	) {
		const params = {
			limit,
			page,
			search,
			type: $Enums.Channel_type.SILVER,
		};
		return await this.channel.findTable(params);
	}

	@Get('/table/gold')
	async tableGold(
		@Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
		@Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
		@Query('search', new DefaultValuePipe('')) search: string,
	) {
		const params = { limit, page, search, type: $Enums.Channel_type.GOLD };
		return await this.channel.findTable(params);
	}
}

@Controller(Api('channels'))
export class ChannelsGetController {
	constructor(private readonly channel: ChannelSearch) {}

	@Get('/recommended')
	async findRecommended(
		@Query('offset', new ParseIntPipe({ optional: true })) offset: number,
	) {
		offset;
		return await this.channel.recommended({ take: 5 });
	}

	@UseGuards(RolesGuard)
	@Get('/favorite')
	async findFavorite(
		@Query('offset', new ParseIntPipe({ optional: true })) offset: number,
		@User() user: any,
	) {
		return await this.channel.favorite({ offset, user });
	}

	@Get('/best')
	async findBest(
		@Query('offset', new ParseIntPipe({ optional: true })) offset: number,
	) {
		offset;
		return await this.channel.recommended({ take: 5 });
	}
}
