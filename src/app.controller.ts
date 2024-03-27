// ====================================
// Este controlador se encarga de redirigir
// a la URL de la aplicación.
// ====================================

import { Controller, Get, Redirect } from '@nestjs/common';
import { STATUS } from './server/constant/status.http.const';

@Controller()
export class AppController {
	constructor() {}

	@Get()
	@Redirect(process.env.HOST_RENDER, STATUS.MOVED_PERMANENTLY)
	redirect(): string {
		return `Redirecting to ${process.env.HOST_RENDER}`;
	}
}
