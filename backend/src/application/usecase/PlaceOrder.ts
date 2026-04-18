import AccountRepository from '../../infra/repository/AccountRepository';
import { inject } from '../../infra/di/Registry';
import OrderRepository from '../../infra/repository/OrderRepository';
import Order from '../../domain/Order';
import ExecuteOrder from './ExecuteOrder';
import Mediator from '../../infra/mediator/Mediator';
import WalletRepository from '../../infra/repository/WalletRepository';

export default class PlaceOrder {
	@inject('accountRepository')
	accountRepository!: AccountRepository;
	@inject('orderRepository')
	orderRepository!: OrderRepository;
	@inject('mediator')
	mediator!: Mediator;
	@inject('walletRepository')
	walletRepository!: WalletRepository;

	async execute(input: Input): Promise<Output> {
		const wallet = await this.walletRepository.getByAccountId(input.accountId);
		const [mainAsset, paymentAsset] = input.marketId.split('-');
		const asset = input.side === 'buy' ? paymentAsset : mainAsset;
		const balance = wallet.getBalance(asset);
		if (!balance || balance.quantity < input.quantity)
			throw new Error('Insufficient funds');

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
		await this.mediator.notifyAll('orderPlaced', order);

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
