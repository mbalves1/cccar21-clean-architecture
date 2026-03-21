import { inject } from '../../infra/di/Registry';
import OrderRepository from '../../infra/repository/OrderRepository';
import Order from '../../domain/Order';

export default class GetDepth {
	@inject('orderRepository')
	orderRepository!: OrderRepository;

	groupOrders(orders: Order[]) {
		let index: { [price: number]: { quantity: number; price: number } } = {};
		for (const order of orders) {
			index[order.price] = index[order.price] || {
				quantity: 0,
				price: order.price,
			};
			index[order.price].quantity += order.quantity;
		}
		return Object.values(index).sort((a, b) => a.price - b.price);
	}

	async execute(marketId: string): Promise<Output> {
		const orders = await this.orderRepository.getByMarketIdAndStatus(
			marketId,
			'open',
		);
		const buys = this.groupOrders(
			orders.filter((order: Order) => order.side === 'buy'),
		);
		const sells = this.groupOrders(
			orders.filter((order: Order) => order.side === 'sell'),
		);
		return {
			marketId,
			buys,
			sells,
		};
	}
}

type Output = {
	marketId: string;
	buys: { quantity: number; price: number }[];
	sells: { quantity: number; price: number }[];
};
