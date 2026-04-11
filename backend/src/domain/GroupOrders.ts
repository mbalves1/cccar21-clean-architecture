import Order from './Order';

export default class GroupOrders {
	static execute(orders: Order[]) {
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
}
