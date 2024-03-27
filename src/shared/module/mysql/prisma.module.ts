import { Global, Module } from '@nestjs/common';
import { MysqlDB } from './mysql.database';

@Global()
@Module({
	providers: [MysqlDB],
	exports: [MysqlDB],
})
export class MysqlPrismaModule {}
