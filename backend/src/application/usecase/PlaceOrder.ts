import AccountRepository from '../../infra/repository/AccountRepository';
import { inject } from '../../infra/di/Registry';
import OrderRepository from '../../infra/repository/OrderRepository';
import Order from '../../domain/Order';
import ExecuteOrder from './ExecuteOrder';
import Mediator from '../../infra/mediator/Mediator';

export default class PlaceOrder {
	@inject('accountRepository')
	accountRepository!: AccountRepository;
	@inject('orderRepository')
	orderRepository!: OrderRepository;
	@inject('mediator')
	mediator!: Mediator;

	async execute(input: Input): Promise<Output> {
		const order = Order.create(
			input.accountId,
			input.marketId,
			input.side,
			input.quantity,
			input.price,
		);
		await this.orderRepository.save(order);

		// const executeOrder = new ExecuteOrder();
		// await executeOrder.execute(input.marketId);
		await this.mediator.notifyAll('orderPlaced', {
			marketId: order.marketId,
			orderId: order.orderId,
		});

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
