import Account from '../../src/domain/Account';
import Book from '../../src/domain/Book';
import Order from '../../src/domain/Order';
import Registry from '../../src/infra/di/Registry';
import { MediatorMemory } from '../../src/infra/mediator/Mediator';

test('Deve testar a execucao de ordens de compra e venda', async () => {
	const mediator = new MediatorMemory();
	const fills: Order[] = [];
	mediator.register('orderFilled', async (order: Order) => {
		fills.push(order);
	});
	Registry.getInstance().provide('Mediator', mediator);
	const marketId = 'BTC-USD';
	const book = new Book(marketId);
	const account = Account.create(
		'John Doe',
		'john.doe@email.com',
		'97456321558',
		'asdWSF2343',
	);
	await book.insert(Order.create(account.accountId, marketId, 'buy', 1, 85000));
	expect(book.buys).toHaveLength(1);
	await book.insert(
		Order.create(account.accountId, marketId, 'sell', 1, 85000),
	);
	expect(book.buys).toHaveLength(0);
	expect(book.sells).toHaveLength(0);
	console.log(fills);
});
