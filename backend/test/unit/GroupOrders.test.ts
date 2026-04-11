import GroupOrders from '../../src/domain/GroupOrders';
import Order from '../../src/domain/Order';

test('Deve agrupar as ordens de compra e venda', function () {
	const order1 = Order.create(crypto.randomUUID(), 'BTC-USD', 'buy', 1, 85000);
	const order2 = Order.create(crypto.randomUUID(), 'BTC-USD', 'buy', 1, 85000);
	const order3 = Order.create(crypto.randomUUID(), 'BTC-USD', 'buy', 1, 85000);
	const orders = [order1, order2, order3];
	const output = GroupOrders.execute(orders);
	console.log(output);
	expect(output).toHaveLength(1);
	expect(output[0].quantity).toBe(3);
	expect(output[0].price).toBe(85000);
});
