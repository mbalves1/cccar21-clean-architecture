import AccountRepository from '../../infra/repository/AccountRepository';
import { inject } from '../../infra/di/Registry';
import OrderRepository from '../../infra/repository/OrderRepository';
import Order from '../../domain/Order';

export default class GetOrder {
	@inject('accountRepository')
	accountRepository!: AccountRepository;
	@inject('orderRepository')
	orderRepository!: OrderRepository;

	async execute(orderId: string): Promise<Output> {
		const order = await this.orderRepository.getById(orderId);
		return order;
	}
}

type Output = {
	orderId: string;
	accountId: string;
	marketId: string;
	side: string;
	quantity: number;
	price: number;
};
