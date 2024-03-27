import { UserRemove } from '@api/user/application/service/user.remove';
import { UserId } from '@api/user/domain/user.type';
import { Controller, Delete, Param } from '@nestjs/common';
import { Api } from '@server/pipe/api.version.pipe';
import { HashIdPipe } from '@server/pipe/hash.id.pipe';

@Controller(Api('user'))
export class UserRemoveController {
	constructor(private readonly user: UserRemove) {}

	//@UseGuards(UserDeleteGuard())
	@Delete(':id')
	async removeLater(@Param('id', HashIdPipe) id: UserId) {
		return await this.user.removeLater(id);
	}

	//@UseGuards(UserDeleteGuard())
	@Delete(':id/forever')
	async removeForeve(@Param('id', HashIdPipe) id: UserId) {
		return await this.user.remove(id);
	}
}
