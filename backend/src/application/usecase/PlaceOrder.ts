import AccountRepository from '../../infra/repository/AccountRepository';
import { inject } from '../../infra/di/Registry';
import OrderRepository from '../../infra/repository/OrderRepository';
import Order from '../../domain/Order';

export default class PlaceOrder {
	@inject('accountRepository')
	accountRepository!: AccountRepository;
	@inject('orderRepository')
	orderRepository!: OrderRepository;

	async execute(input: Input): Promise<Output> {
		const order = Order.create(
			input.accountId,
			input.marketId,
			input.side,
			input.quantity,
			input.price,
		);
		await this.orderRepository.save(order);

		while (true) {
			const orders = await this.orderRepository.getByMarketIdAndStatus(
				input.marketId,
				'open',
			);
			const buys = orders
				.filter((order: Order) => order.side === 'buy')
				.sort((a, b) => b.price - a.price);
			const sells = orders
				.filter((order: Order) => order.side === 'sell')
				.sort((a, b) => a.price - b.price);
			const highestBuy = buys[0];
			const lowestSell = sells[0];

			if (!highestBuy || !lowestSell || highestBuy.price < lowestSell.price)
				break;

			const fillQuantity = Math.min(
				highestBuy.getAvailableQuantity(),
				lowestSell.getAvailableQuantity(),
			);
			const fillPrice =
				highestBuy.timestamp.getTime() > lowestSell.getAvailableQuantity()
					? lowestSell.price
					: highestBuy.price;
			highestBuy.fill(fillQuantity, fillPrice);
			lowestSell.fill(fillQuantity, fillPrice);
			await this.orderRepository.update(highestBuy);
			await this.orderRepository.update(lowestSell);
		}

		return {
			orderId: order.orderId,
		};
	}
}

type Input = {
	accountId: string;
	marketId: string;
	side: string;
	quantity: number;
	price: number;
};

type Output = {
	orderId: string;
};
