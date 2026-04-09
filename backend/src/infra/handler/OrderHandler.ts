import ExecuteOrder from '../../application/usecase/ExecuteOrder';
import Book from '../../domain/Book';
import Order from '../../domain/Order';
import { inject } from '../di/Registry';
import Mediator from '../mediator/Mediator';
import OrderRepository from '../repository/OrderRepository';

export default interface OrderHandler {
	handle(): void;
}

export class OrderHandler1 implements OrderHandler {
	@inject('mediator')
	mediator!: Mediator;
	@inject('orderRepository')
	orderRepository!: OrderRepository;
	@inject('book')
	book!: Book;

	handle(): void {
		this.mediator.register('orderPlaced', async (order: Order) => {
			await this.book.insert(order);
		});
		this.mediator.register('orderFilled', async (order: Order) => {
			await this.orderRepository.update(order);
		});
	}
}

export class OrderHandler2 implements OrderHandler {
	@inject('mediator')
	mediator!: Mediator;
	@inject('executeOrder')
	executeOrder!: ExecuteOrder;

	handle(): void {
		this.mediator.register('orderPlaced', async (order: Order) => {
			await this.executeOrder.execute(order.marketId);
		});
	}
}
