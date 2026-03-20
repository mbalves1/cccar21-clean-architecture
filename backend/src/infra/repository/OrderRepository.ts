import Order from '../../domain/Order';
import DatabaseConnection from '../database/DatabaseConnection';
import { inject } from '../di/Registry';

export default interface OrderRepository {
	save(order: Order): Promise<void>;
	getById(orderId: string): Promise<Order>;
}

export class OrderRepositoryDatabase implements OrderRepository {
	@inject('databaseConnection')
	connection!: DatabaseConnection;

	async save(order: Order): Promise<void> {
		await this.connection.query(
			'insert into cccar.order (order_id, account_id, market_id, side, quantity, price, fill_quantity, fill_price, status, timestamp) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
			[
				order.orderId,
				order.accountId,
				order.marketId,
				order.side,
				order.quantity,
				order.price,
				order.fillQuantity,
				order.fillPrice,
				order.status,
				order.timestamp,
			],
		);
	}

	async getById(orderId: string): Promise<Order> {
		const [orderData] = await this.connection.query(
			'select * from cccar.order where order_id = $1',
			[orderId],
		);
		if (!orderData) {
			throw new Error('Order not found');
		}
		return new Order(
			orderData.order_id,
			orderData.account_id,
			orderData.market_id,
			orderData.side,
			parseFloat(orderData.quantity),
			parseFloat(orderData.price),
			parseFloat(orderData.fill_quantity),
			parseFloat(orderData.fill_price),
			orderData.status,
			orderData.timestamp,
		);
	}
}
