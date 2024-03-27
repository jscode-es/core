import { CookieService } from '@module/cookie/application/cookie.service';
import { Module } from '@nestjs/common';
import { AuthService } from './application/service/auth.service';
import { AuthPostController } from './infrastructure/controller/auth.post.controller';

@Module({
	controllers: [AuthPostController],
	providers: [AuthService, CookieService],
})
export class AuthModule {}
