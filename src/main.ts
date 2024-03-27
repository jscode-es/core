import fastifyCsrf from '@fastify/csrf-protection';
import helmet from '@fastify/helmet';
import * as multipart from '@fastify/multipart';
import * as secureSession from '@fastify/secure-session';
import { NestFactory } from '@nestjs/core';
import {
	FastifyAdapter,
	NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SERVER } from '@server/constant/server.const';
import * as morgan from 'morgan';
import { AppModule } from './app.module';

async function bootstrap() {
	const env = process.env;

	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(),
		SERVER.OPTIONS,
	);

	await app.register(helmet);
	await app.register(secureSession, SERVER.OPTIONS_SESSION);
	await app.register(fastifyCsrf);
	await app.register(multipart);

	app.use(morgan(env.MORGAN_LOG_FORMAT));
	app.enableCors(SERVER.CORS);
	app.enableVersioning(SERVER.OPTIONS_VERSING);

	await app.listen(parseInt(env.PORT_HTTP), env.IP_HTTP);

	console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
