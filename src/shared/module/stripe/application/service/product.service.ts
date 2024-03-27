import { ProductType } from '@module/stripe/domain/stripe.const';
import { StripeRepository } from '../../infrastructure/stripe.repository';

export class StripeProduct {
	private api: StripeRepository;

	constructor() {
		this.api = new StripeRepository();
	}

	async getAllGift() {
		const products = await this.api.getAllProductsByType(ProductType.Gift);
		const prices = await this.api.getAllPrices();

		const productsWithPrices = products.data.map((product) => {
			const productPrices = prices.data.filter(
				(price) => price.product === product.id,
			);

			return {
				id: product.id,
				name: product.name,
				description: product.description,
				metadata: {
					acumulated: 1,
					quantity: parseInt(product.metadata.quantity),
				},
				prices: {
					id: productPrices[0].id,
					currency: productPrices[0].currency,
					unit_amount: productPrices[0].unit_amount,
				},
			};
		});

		// Ordernar segundo la cantidad de productos
		productsWithPrices.sort((a, b) => {
			if (a.metadata.quantity > b.metadata.quantity) {
				return 1;
			}
			if (a.metadata.quantity < b.metadata.quantity) {
				return -1;
			}
			return 0;
		});

		return productsWithPrices;
	}

	async getAllStandard() {
		const products = await this.api.getAllProductsByType(
			ProductType.Standard,
		);

		const prices = await this.api.getAllPrices();

		const productsWithPrices = products.data.map((product) => {
			const productPrices = prices.data.filter(
				(price) => price.product === product.id,
			);

			return {
				id: product.id,
				name: product.name,
				description: product.description,
				metadata: {
					discount: parseInt(product.metadata.discount),
				},
				prices: {
					id: productPrices[0].id,
					currency: productPrices[0].currency,
					unit_amount: productPrices[0].unit_amount,
				},
			};
		});

		// Ordernar segundo la cantidad de productos
		productsWithPrices.sort((a, b) => {
			if (a.prices.unit_amount > b.prices.unit_amount) {
				return 1;
			}
			if (a.prices.unit_amount < b.prices.unit_amount) {
				return -1;
			}
			return 0;
		});

		return productsWithPrices;
	}
}
