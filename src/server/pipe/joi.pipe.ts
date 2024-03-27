// ====================================
// Este es un Pipe que se encarga de
// validar los datos
// ====================================

import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiPipe implements PipeTransform {
	constructor(private schema: ObjectSchema) {}
	transform(values: any) {
		if (values?.ip) return values;
		if (values?.decorator) return values;

		if (!values) throw new BadRequestException('Validation failed');

		const { error, value } = this.schema.validate(values, {
			stripUnknown: true,
		});

		if (error) throw new BadRequestException(error.message);

		return value;
	}
}
