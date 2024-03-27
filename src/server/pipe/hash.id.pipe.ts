// ====================================
// Este es un Pipe que se encarga de
// decodificar un ID encriptado.
// ====================================

import { HashService } from '@module/hash/hash.service';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class HashIdPipe implements PipeTransform {
	private readonly hashId: any;
	constructor() {
		this.hashId = new HashService();
	}

	transform(value: any) {
		if (value.length >= this.hashId.pad) {
			return this.hashId.decode(value);
		}

		return new BadRequestException('Invalid ID');
	}
}
