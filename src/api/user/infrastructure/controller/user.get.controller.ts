import { UserSearch } from '@api/user/application/service/user.search';
import { ResponseFindUser, UserId } from '@api/user/domain/user.type';
import { Cache } from '@server/decorator/cache.decorator';
//import { EditorGuard } from '@server/guard/editor.guard';
import {
	Controller,
	DefaultValuePipe,
	Get,
	Param,
	ParseIntPipe,
	Query,
} from '@nestjs/common';
import { Api } from '@server/pipe/api.version.pipe';
import { HashIdPipe } from '@server/pipe/hash.id.pipe';
import { LimitPipe } from '@server/pipe/limit.pipe';

@Controller(Api('user'))
//@UseGuards(EditorGuard)
export class UserGetController {
	constructor(private readonly user: UserSearch) {}

	@Get()
	@Cache('get:users')
	async find(
		@Query('limit', new DefaultValuePipe(10), LimitPipe) limit: number,
		@Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
		@Query('values', new DefaultValuePipe('')) values: string,
		@Query('find', new DefaultValuePipe('')) find: string,
		@Query('findBy', new DefaultValuePipe('')) findBy: string,
		@Query('orderBy', new DefaultValuePipe('')) orderBy: string,
		@Query('filter', new DefaultValuePipe('')) filter: string,
	): Promise<ResponseFindUser> {
		return await this.user.find({
			limit,
			page,
			values,
			find,
			findBy,
			orderBy,
			filter,
		});
	}

	@Get('/alias/:alias')
	@Cache('get:user:alias')
	async findByAlias(@Param('alias') alias: string) {
		return await this.user.findBy('alias', alias);
	}

	@Get('/:id')
	@Cache('get:user:id')
	async findById(@Param('id', HashIdPipe) id: UserId) {
		return await this.user.findBy('id', id);
	}

	@Get('/table')
	async table(
		@Query('limit', new DefaultValuePipe(10), LimitPipe) limit: number,
		@Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
		@Query('search', new DefaultValuePipe('')) search: string,
	) {
		const params = { limit, page, search };
		return await this.user.findTable(params);
	}
}
