import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Hashids = require('hashids');

@Injectable()
export class HashService {
	private readonly hashids;
	private readonly salt = '493m9340234n23';
	private readonly pad = 20;

	constructor() {
		this.hashids = new Hashids(this.salt, this.pad);
	}

	encode(number: number): string {
		return this.hashids.encode(number);
	}

	decode(input: string): number {
		return this.hashids.decode(input)[0];
	}
}
