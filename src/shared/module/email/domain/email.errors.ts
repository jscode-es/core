// Errores personalizado de permision con nestjs

import { HttpException, HttpStatus } from '@nestjs/common';

export class PermisionExistNameError extends HttpException {
	constructor() {
		super(
			{
				status: HttpStatus.BAD_REQUEST,
				error: 'PermisionExistNameError',
			},
			HttpStatus.BAD_REQUEST,
		);
	}
}

export class PermisionExistReferenceError extends HttpException {
	constructor() {
		super(
			{
				status: HttpStatus.BAD_REQUEST,
				error: 'PermisionExistReferenceError',
			},
			HttpStatus.BAD_REQUEST,
		);
	}
}

export class PermisionRequiredDataError extends HttpException {
	constructor() {
		super(
			{
				status: HttpStatus.BAD_REQUEST,
				error: 'PermisionRequiredDataError',
			},
			HttpStatus.BAD_REQUEST,
		);
	}
}
