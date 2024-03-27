import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';

@Module({
	imports: [ConfigModule.forRoot(), ScheduleModule.forRoot()],
	controllers: [AppController],
	providers: [],
})
export class AppModule {}
