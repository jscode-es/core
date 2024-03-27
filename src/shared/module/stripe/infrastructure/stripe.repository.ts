import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';
import { ProductType } from '../domain/stripe.const';

@Injectable()
export class StripeRepository {
	private key: string;
	private api: Stripe;

	constructor() {
		this.key = process.env.STRIPE_KEY;
		this.api = new Stripe(process.env.STRIPE_SECRET);
	}

	async getAllProducts() {
		return await this.api.products.list();
	}

	async getAllPrices() {
		return await this.api.prices.list();
	}

	async getAllProductsByType(type: ProductType) {
		return await this.api.products.search({
			query: `metadata['type']:'${type}'`,
		});
	}
}
