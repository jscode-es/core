import { TokenService } from '@module/token/token.service';
import { Module } from '@nestjs/common';
import { UserConfirm } from './application/service/user.confirm';
import { UserForguetPassword } from './application/service/user.forguet.password';
import { UserRegister } from './application/service/user.register';
import { UserRemove } from './application/service/user.remove';
import { UserSearch } from './application/service/user.search';
import { UserUpdate } from './application/service/user.update';
import { UserRemoveController } from './infrastructure/controller/user.delete.controlle';
import { UserGetController } from './infrastructure/controller/user.get.controller';
import { UserPostController } from './infrastructure/controller/user.post.controller';
import { UserPutController } from './infrastructure/controller/user.put.controller';
import { UserMysqlRepository } from './infrastructure/user.mysql.repository';

@Module({
	controllers: [
		UserPostController,
		UserGetController,
		UserPutController,
		UserRemoveController,
	],
	providers: [
		UserRegister,
		UserSearch,
		UserMysqlRepository,
		UserUpdate,
		UserRemove,
		TokenService,
		UserForguetPassword,
		UserConfirm,
	],
})
export class UserModule {}
