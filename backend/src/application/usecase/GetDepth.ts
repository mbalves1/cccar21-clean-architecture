import { inject } from '../../infra/di/Registry';
import OrderRepository from '../../infra/repository/OrderRepository';
import Order from '../../domain/Order';
import GroupOrders from '../../domain/GroupOrders';

export default class GetDepth {
	@inject('orderRepository')
	orderRepository!: OrderRepository;

	async execute(marketId: string): Promise<Output> {
		const orders = await this.orderRepository.getByMarketIdAndStatus(
			marketId,
			'open',
		);
		const buys = GroupOrders.execute(
			orders.filter((order: Order) => order.side === 'buy'),
		);
		const sells = GroupOrders.execute(
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
