import AccountRepository from './AccountRepository';
import { inject } from './Registry';

export default class GetAccount {
	@inject('accountRepository')
	accountRepository!: AccountRepository;

	async execute(input: Input): Promise<void> {
		const account = await this.accountRepository.getById(input.accountId);
		account.deposit(input.assetId, input.quantity);
		await this.accountRepository.update(account);
	}
}

type Input = {
	accountId: string;
	assetId: string;
	quantity: number;
};
