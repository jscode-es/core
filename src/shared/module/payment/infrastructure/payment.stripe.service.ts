import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {
	private key: string;
	private secret: string;

	constructor() {
		this.key = process.env.STRIPE_KEY;
		this.secret = process.env.STRIPE_SECRET;
	}

	send() {
		return 'send';
	}
}
